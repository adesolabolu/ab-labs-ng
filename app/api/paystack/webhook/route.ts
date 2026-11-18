import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from '@/lib/db';
import { provisionClientAndProjectFromOrder } from '@/lib/client-provisioning';
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

      // 4. Idempotently provision client account + project row + post-payment email
      await provisionClientAndProjectFromOrder(order, data);
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
