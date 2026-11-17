import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from '@/lib/db';
import { generateFriendlyPassword, hashPassword, setClientSessionCookie } from '@/lib/auth';
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

    // 3. AUTOMATED ACCOUNT PROVISIONING
    // New customers get a fresh account with emailed credentials.
    // Existing customers (ON CONFLICT) keep portal_access_token and
    // password_hash untouched - nothing is returned in this unauthenticated response.
    const orderEmail = String(order.customer_email || '').toLowerCase().trim();
    const clientId = `cli_${crypto.randomBytes(4).toString('hex')}`;
    const portalAccessToken = `token_${crypto.randomBytes(12).toString('hex')}`;
    const tempPassword = generateFriendlyPassword();
    const passwordHash = hashPassword(tempPassword);

    // Calculate domain expiry: 1 year (365 days) from today
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
    if (paystackTxData) {
      await saveClientAuthorizationFromPaystack(resolvedClientId, paystackTxData).catch((err) =>
        console.error('[Paystack Verify] Failed to save authorization:', err)
      );
    }

    const isNewClient = Array.isArray(upserted) && upserted[0] && upserted[0].inserted === true;

    if (!isNewClient) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified. Welcome back - your existing login details are unchanged.',
        orderId: order.id,
        portalUrl: '/portal',
      });
    }
    // 4. New account: issue session cookie so customer is logged in immediately upon redirect
    await setClientSessionCookie(clientId, orderEmail);

    // 5. Send Welcome & Credentials Email asynchronously
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';
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
    }).catch((err) => console.error('Email error in verify route:', err));

    return NextResponse.json({
      success: true,
      message: 'Payment verified and client account successfully created!',
      client: {
        email: order.customer_email,
        name: order.customer_name,
        businessName: order.business_name,
        domainName: order.requested_domain,
        domainExpiryDate: expiryDate.toISOString(),
      },
      orderId: order.id,
      portalUrl: '/portal',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
