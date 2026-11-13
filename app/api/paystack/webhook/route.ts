import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from '@/lib/db';
import { generateFriendlyPassword, hashPassword } from '@/lib/auth';
import { sendClientCredentialsEmail } from '@/lib/email';
import { TEMPLATES } from '@/data/templates';

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

    // Verify Paystack HMAC SHA512 signature
    const hash = crypto.createHmac('sha512', paystackSecretKey).update(rawBody).digest('hex');
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;

      if (!reference) {
        return NextResponse.json({ status: 'ignored_no_reference' });
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

      // 4. Provision client account if not already created
      const clientId = `cli_${crypto.randomBytes(4).toString('hex')}`;
      const portalAccessToken = `token_${crypto.randomBytes(12).toString('hex')}`;
      const tempPassword = generateFriendlyPassword();
      const passwordHash = hashPassword(tempPassword);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 365);

      await sql`
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
          portal_access_token,
          password_hash,
          build_phase
        ) VALUES (
          ${clientId},
          ${order.customer_email},
          ${order.customer_name},
          ${order.customer_phone || null},
          ${order.business_name || null},
          ${order.requested_domain || null},
          'ACTIVE',
          ${expiryDate.toISOString()},
          ${order.template_slug},
          ${order.plan_type},
          'ACTIVE',
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
          portal_access_token = EXCLUDED.portal_access_token,
          password_hash = COALESCE(clients.password_hash, EXCLUDED.password_hash)
      `;

      // 5. Send confirmation email
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ng.ab-labs.cv';
      const portalUrl = `${baseUrl}/portal?token=${portalAccessToken}`;
      const templateMatch = TEMPLATES.find((t) => t.slug === order.template_slug);
      const templateName = templateMatch ? templateMatch.name : (order.template_slug || 'Website Template');

      sendClientCredentialsEmail({
        to: order.customer_email,
        name: order.customer_name,
        templateName,
        temporaryPassword: tempPassword,
        portalUrl,
        domainName: order.requested_domain,
      }).catch((err) => console.error('[Paystack Webhook] Email error:', err));
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[Paystack Webhook] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
