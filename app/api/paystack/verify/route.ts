import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { setClientSessionCookie } from '@/lib/auth';
import { provisionClientAndProjectFromOrder } from '@/lib/client-provisioning';
import {
  saveClientAuthorizationFromPaystack,
  refundVerificationCharge,
  activateClientSubscription,
} from '@/lib/paystack-recurring';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ success: false, error: 'Reference is required' }, { status: 400 });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    const isLiveKeyAvailable = paystackSecretKey && !paystackSecretKey.includes('placeholder');

    // Special flow: /portal "Save Card for Auto-Renewal" (₦50 refundable verification)
    if (String(reference).startsWith('ab_card_')) {
      if (!isLiveKeyAvailable) {
        return NextResponse.json({ success: false, error: 'Paystack live key not configured' }, { status: 503 });
      }
      const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: { Authorization: `Bearer ${paystackSecretKey}` },
      });
      const verifyData = await verifyRes.json();
      if (!verifyData?.status || verifyData?.data?.status !== 'success') {
        return NextResponse.json({ success: false, error: 'Card verification failed at Paystack' }, { status: 400 });
      }

      const clientId = String(verifyData.data?.metadata?.clientId || '');
      if (!clientId) {
        return NextResponse.json({ success: false, error: 'Missing client metadata' }, { status: 400 });
      }

      const saved = await saveClientAuthorizationFromPaystack(clientId, verifyData.data);
      await refundVerificationCharge(reference, paystackSecretKey);

      const clientRows = (await sql`SELECT build_phase, billing_status FROM clients WHERE id = ${clientId} LIMIT 1`) as any[];
      if (
        saved.saved &&
        clientRows.length > 0 &&
        (Number(clientRows[0].build_phase) >= 4 || clientRows[0].billing_status === 'awaiting_card')
      ) {
        await activateClientSubscription(clientId).catch((err) =>
          console.error('[Card Link] Subscription activation warning:', err)
        );
      }

      return NextResponse.json({
        success: true,
        cardLinked: saved.saved,
        last4: saved.last4 || null,
        brand: saved.brand || null,
        message: saved.saved
          ? 'Card saved for automatic monthly renewals and ₦50 verification refunded.'
          : 'Card verified, but Paystack marked it non-reusable for auto-billing.',
      });
    }

    // Find the order
    const orders = await sql`
      SELECT * FROM orders 
      WHERE paystack_reference = ${reference}
      LIMIT 1
    `;

    if (orders.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const order = orders[0];
    let paystackTxData: any = null;

    if (isLiveKeyAvailable) {
      const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.status || verifyData.data?.status !== 'success') {
        return NextResponse.json({ success: false, error: 'Payment verification failed at Paystack' }, { status: 400 });
      }

      // Verify currency and amount matches (Paystack amount is in kobo)
      const expectedKobo = Number(order.amount_paid_ngn) * 100;
      if (verifyData.data.amount < expectedKobo) {
        return NextResponse.json({
          success: false,
          error: 'Paid amount does not match expected order total',
        }, { status: 400 });
      }
      paystackTxData = verifyData.data;
    } else {
      console.log(`[Paystack Simulation]: Approving reference ${reference} in testing mode`);
    }

    // 1. Mark Order as Success
    await sql`
      UPDATE orders 
      SET paystack_status = 'success'
      WHERE id = ${order.id}
    `;

    // 2. If order is tied to a payment_link, mark link as PAID
    if (order.payment_link_id) {
      await sql`
        UPDATE payment_links 
        SET status = 'PAID', paid_at = NOW() 
        WHERE id = ${order.payment_link_id}
      `;
    }

    // 3. Idempotently provision client account + project row + post-payment email
    const { clientId: resolvedClientId, orderEmail, isNewClient, expiryDateIso } =
      await provisionClientAndProjectFromOrder(order, paystackTxData);

    // 4. ALWAYS issue session cookie so paying customer enters /portal immediately without hitting /login
    await setClientSessionCookie(resolvedClientId, orderEmail);

    return NextResponse.json({
      success: true,
      message: isNewClient
        ? 'Payment verified and client account successfully created!'
        : 'Payment verified. Your new website project has been added to your portal.',
      client: {
        email: order.customer_email,
        name: order.customer_name,
        businessName: order.business_name,
        domainName: order.requested_domain,
        domainExpiryDate: expiryDateIso,
      },
      orderId: order.id,
      portalUrl: '/portal',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
