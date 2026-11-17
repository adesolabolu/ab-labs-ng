import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from '@/lib/db';
import { generateFriendlyPassword, hashPassword } from '@/lib/auth';
import { sendClientCredentialsEmail } from '@/lib/email';
import { TEMPLATES } from '@/data/templates';
import { getTemplateWithPricing } from '@/lib/template-pricing';
import {
  saveClientAuthorizationFromPaystack,
  refundVerificationCharge,
  activateClientSubscription,
} from '@/lib/paystack-recurring';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey || paystackSecretKey.includes('placeholder')) {
      return NextResponse.json({ error: 'Paystack secret not configured' }, { status: 503 });
    }

    // Read raw body for HMAC verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // Verify Paystack HMAC SHA512 signature (constant-time compare)
    const hash = crypto.createHmac('sha512', paystackSecretKey).update(rawBody).digest('hex');
    const expected = Buffer.from(hash, 'hex');
    const provided = Buffer.from(signature, 'hex');
    if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;

      if (!reference) {
        return NextResponse.json({ status: 'ignored_no_reference' });
      }

      // Handle /portal card-linking verification charge
      if (data.metadata?.purpose === 'link_card' || String(reference).startsWith('ab_card_')) {
        const linkedClientId = String(data.metadata?.clientId || '');
        if (linkedClientId) {
          const saved = await saveClientAuthorizationFromPaystack(linkedClientId, data);
          await refundVerificationCharge(reference, paystackSecretKey);
          const clientRows = (await sql`SELECT build_phase, billing_status FROM clients WHERE id = ${linkedClientId} LIMIT 1`) as any[];
          if (
            saved.saved &&
            clientRows.length > 0 &&
            (Number(clientRows[0].build_phase) >= 4 || clientRows[0].billing_status === 'awaiting_card')
          ) {
            await activateClientSubscription(linkedClientId).catch((err) =>
              console.error('[Webhook Card Link] Subscription activation warning:', err)
            );
          }
        }
        return NextResponse.json({ received: true, purpose: 'link_card' });
      }

      // 1. Look up the order in Neon Postgres
      const orders = await sql`
        SELECT * FROM orders 
        WHERE paystack_reference = ${reference}
        LIMIT 1
      `;

      if (orders.length === 0) {
        return NextResponse.json({ status: 'ignored_order_not_found' });
      }

      const order = orders[0];

      // If already processed as success, exit idempotently
      if (order.paystack_status === 'success') {
        return NextResponse.json({ status: 'already_processed' });
      }

      // Verify amount paid matches order expected amount (Paystack amount is in kobo)
      const expectedKobo = Number(order.amount_paid_ngn) * 100;
      if (data.amount < expectedKobo) {
        console.warn(`[Paystack Webhook] Underpaid amount: received ${data.amount}, expected ${expectedKobo}`);
        return NextResponse.json({ status: 'underpaid_ignored' });
      }

      // 2. Mark order as success
      await sql`
        UPDATE orders 
        SET paystack_status = 'success'
        WHERE id = ${order.id}
      `;

      // 3. Mark payment link as PAID if applicable
      if (order.payment_link_id) {
        await sql`
          UPDATE payment_links 
          SET status = 'PAID', paid_at = NOW() 
          WHERE id = ${order.payment_link_id}
        `;
      }

      // 4. Provision client account. New customers get fresh credentials.
      // Existing customers (ON CONFLICT) keep portal_access_token and
      // password_hash untouched: no rotation, no credential email, no overwrites.
      const orderEmail = String(order.customer_email || '').toLowerCase().trim();
      const clientId = `cli_${crypto.randomBytes(4).toString('hex')}`;
      const portalAccessToken = `token_${crypto.randomBytes(12).toString('hex')}`;
      const tempPassword = generateFriendlyPassword();
      const passwordHash = hashPassword(tempPassword);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 365);

      const matchedTpl = order.template_slug ? await getTemplateWithPricing(order.template_slug) : null;
      const monthlyAmountNgn =
        String(order.plan_type || '').toUpperCase() === 'OUTRIGHT'
          ? 0
          : Number(matchedTpl?.monthlyNgn || 5000);
      const initialBillingStatus =
        String(order.plan_type || '').toUpperCase() === 'OUTRIGHT' ? 'outright' : 'pending_launch';

      const upserted = await sql`
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
          ${expiryDate.toISOString()},
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
          business_name = COALESCE(EXCLUDED.business_name, clients.business_name),
          domain_name = COALESCE(EXCLUDED.domain_name, clients.domain_name),
          template_slug = EXCLUDED.template_slug,
          plan_type = EXCLUDED.plan_type,
          domain_expiry_date = EXCLUDED.domain_expiry_date,
          monthly_status = 'ACTIVE',
          billing_status = COALESCE(clients.billing_status, EXCLUDED.billing_status),
          monthly_amount_ngn = EXCLUDED.monthly_amount_ngn
        RETURNING id, (xmax = 0) AS inserted
      `;

      const resolvedClientId = Array.isArray(upserted) && upserted[0] ? String(upserted[0].id) : clientId;
      await saveClientAuthorizationFromPaystack(resolvedClientId, data).catch((err) =>
        console.error('[Paystack Webhook] Failed to save authorization:', err)
      );

      const isNewClient = Array.isArray(upserted) && upserted[0] && upserted[0].inserted === true;

      // 5. Send credentials email (new accounts only)
      if (isNewClient) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ng.ab-labs.cv';
        const portalUrl = `${baseUrl}/portal?token=${portalAccessToken}`;
        const templateMatch = TEMPLATES.find((t) => t.slug === order.template_slug);
        const templateName = templateMatch ? templateMatch.name : (order.template_slug || 'Website Template');

        await sendClientCredentialsEmail({
          to: orderEmail,
          name: order.customer_name,
          templateName,
          temporaryPassword: tempPassword,
          portalUrl,
          domainName: order.requested_domain,
        }).catch((err) => console.error('[Paystack Webhook] Email error:', err));
      }
    } else if (event.event === 'subscription.create') {
      const data = event.data;
      const customerEmail = String(data?.customer?.email || '').toLowerCase().trim();
      if (customerEmail) {
        await sql`
          UPDATE clients
          SET paystack_subscription_code = COALESCE(${data?.subscription_code || null}, paystack_subscription_code),
              paystack_email_token = COALESCE(${data?.email_token || null}, paystack_email_token),
              paystack_plan_code = COALESCE(${data?.plan?.plan_code || null}, paystack_plan_code),
              billing_status = 'active',
              next_billing_date = COALESCE(${data?.next_payment_date ? new Date(data.next_payment_date) : null}, next_billing_date)
          WHERE email = ${customerEmail}
        `;
      }
    } else if (event.event === 'invoice.payment_failed') {
      const data = event.data;
      const customerEmail = String(data?.customer?.email || '').toLowerCase().trim();
      if (customerEmail) {
        await sql`
          UPDATE clients
          SET billing_status = 'past_due'
          WHERE email = ${customerEmail}
        `;
      }
    } else if (event.event === 'subscription.disable' || event.event === 'subscription.not_renew') {
      const data = event.data;
      const subCode = data?.subscription_code || null;
      if (subCode) {
        await sql`
          UPDATE clients
          SET billing_status = 'cancelled'
          WHERE paystack_subscription_code = ${subCode}
        `;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[Paystack Webhook] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
