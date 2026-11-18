import crypto from 'crypto';
import sql from '@/lib/db';
import { generateFriendlyPassword, hashPassword } from '@/lib/auth';
import { sendClientCredentialsEmail, sendOrderConfirmationEmail } from '@/lib/email';
import { getTemplateWithPricing } from '@/lib/template-pricing';
import { saveClientAuthorizationFromPaystack } from '@/lib/paystack-recurring';
import { TEMPLATES } from '@/data/templates';

export interface ProvisionResult {
  clientId: string;
  projectId: string;
  orderEmail: string;
  portalAccessToken: string;
  isNewClient: boolean;
  expiryDateIso: string;
}

/**
 * Idempotently provisions a client account (1 per email) and a project row
 * (1 per order_id) when a Paystack order succeeds, and atomically sends
 * exactly one confirmation/welcome email per order.
 */
export async function provisionClientAndProjectFromOrder(
  order: any,
  paystackTxData?: any
): Promise<ProvisionResult> {
  const orderEmail = String(order.customer_email || '').toLowerCase().trim();
  const clientId = `cli_${crypto.randomBytes(4).toString('hex')}`;
  const projectId = `proj_${crypto.randomBytes(4).toString('hex')}`;
  const portalAccessToken = `token_${crypto.randomBytes(12).toString('hex')}`;
  const tempPassword = generateFriendlyPassword();
  const passwordHash = hashPassword(tempPassword);

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 365);
  const expiryDateIso = expiryDate.toISOString();

  const matchedTpl = order.template_slug ? await getTemplateWithPricing(order.template_slug) : null;
  const isOutright = String(order.plan_type || '').toUpperCase() === 'OUTRIGHT';
  const monthlyAmountNgn = isOutright ? 0 : Number(matchedTpl?.monthlyNgn || 5000);
  const initialBillingStatus = isOutright ? 'outright' : 'pending_launch';

  // 1. Upsert client account by email — preserve existing password/token/first-site fields on conflict
  const upserted = (await sql`
    INSERT INTO clients (
      id,
      email,
      name,
      phone,
      business_name,
      domain_name,
      domain_status,
      domain_expiry_date,
      template_slug,
      plan_type,
      monthly_status,
      billing_status,
      monthly_amount_ngn,
      portal_access_token,
      password_hash,
      build_phase
    ) VALUES (
      ${clientId},
      ${orderEmail},
      ${order.customer_name},
      ${order.customer_phone || null},
      ${order.business_name || null},
      ${order.requested_domain || null},
      'ACTIVE',
      ${expiryDateIso},
      ${order.template_slug},
      ${order.plan_type},
      'ACTIVE',
      ${initialBillingStatus},
      ${monthlyAmountNgn},
      ${portalAccessToken},
      ${passwordHash},
      1
    )
    ON CONFLICT (email) DO UPDATE SET
      name = COALESCE(clients.name, EXCLUDED.name),
      phone = COALESCE(clients.phone, EXCLUDED.phone)
    RETURNING id, portal_access_token, (xmax = 0) AS inserted
  `) as any[];

  const resolvedClientId = upserted[0] ? String(upserted[0].id) : clientId;
  const resolvedAccessToken = upserted[0]?.portal_access_token
    ? String(upserted[0].portal_access_token)
    : portalAccessToken;
  const isNewClient = Boolean(upserted[0]?.inserted === true);

  // 2. Idempotently create a project row for this specific order (1 per order_id)
  const insertedProj = (await sql`
    INSERT INTO client_projects (
      id,
      client_id,
      order_id,
      business_name,
      domain_name,
      domain_status,
      domain_expiry_date,
      template_slug,
      plan_type,
      build_phase,
      billing_status,
      monthly_amount_ngn
    ) VALUES (
      ${projectId},
      ${resolvedClientId},
      ${String(order.id)},
      ${order.business_name || null},
      ${order.requested_domain || null},
      'ACTIVE',
      ${expiryDateIso},
      ${order.template_slug || null},
      ${order.plan_type || null},
      1,
      ${initialBillingStatus},
      ${monthlyAmountNgn}
    )
    ON CONFLICT (order_id) DO UPDATE SET
      client_id = client_projects.client_id
    RETURNING id
  `) as any[];

  const resolvedProjectId = insertedProj[0] ? String(insertedProj[0].id) : projectId;

  // 3. Save reusable Paystack card authorization if present
  if (paystackTxData) {
    await saveClientAuthorizationFromPaystack(resolvedClientId, paystackTxData).catch((err) =>
      console.error('[Provisioning] Failed to save authorization:', err)
    );
  }

  // 4. Atomically claim post-payment email dispatch on this order so verify + webhook never double-send or miss
  const emailClaim = (await sql`
    UPDATE orders
    SET confirmation_email_sent_at = NOW()
    WHERE id = ${order.id} AND confirmation_email_sent_at IS NULL
    RETURNING id
  `) as any[];

  if (emailClaim.length > 0) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ng.ab-labs.cv';
    const portalUrl = `${baseUrl}/portal?token=${resolvedAccessToken}`;
    const templateMatch = TEMPLATES.find((t) => t.slug === order.template_slug);
    const templateName = templateMatch ? templateMatch.name : (order.template_slug || 'Website Template');

    if (isNewClient) {
      await sendClientCredentialsEmail({
        to: orderEmail,
        name: order.customer_name,
        templateName,
        temporaryPassword: tempPassword,
        portalUrl,
        domainName: order.requested_domain,
      }).catch((err) => console.error('[Provisioning] Credentials email error:', err));
    } else {
      await sendOrderConfirmationEmail({
        to: orderEmail,
        name: order.customer_name,
        templateName,
        portalUrl,
        domainName: order.requested_domain,
      }).catch((err) => console.error('[Provisioning] Order confirmation email error:', err));
    }
  }

  return {
    clientId: resolvedClientId,
    projectId: resolvedProjectId,
    orderEmail,
    portalAccessToken: resolvedAccessToken,
    isNewClient,
    expiryDateIso,
  };
}
