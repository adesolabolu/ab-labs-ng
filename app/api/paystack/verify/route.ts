import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { generateFriendlyPassword, hashPassword, setClientSessionCookie } from '@/lib/auth';
import { sendClientCredentialsEmail } from '@/lib/email';
import { TEMPLATES } from '@/data/templates';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ success: false, error: 'Reference is required' }, { status: 400 });
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

    // If live Paystack key is set, verify with Paystack API
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    const isLiveKeyAvailable = paystackSecretKey && !paystackSecretKey.includes('placeholder');

    if (isLiveKeyAvailable) {
      const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.status || verifyData.data.status !== 'success') {
        return NextResponse.json({ success: false, error: 'Payment verification failed at Paystack' }, { status: 400 });
      }
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

    // 3. AUTOMATED ACCOUNT PROVISIONING:
    // Generate secure client ID, portal access token, and initial password
    const clientId = `cli_${Math.random().toString(36).substring(2, 10)}`;
    const portalAccessToken = `token_${Math.random().toString(36).substring(2, 14)}`;
    const tempPassword = generateFriendlyPassword();
    const passwordHash = hashPassword(tempPassword);

    // Calculate domain expiry: 1 year (365 days) from today
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 365);

    // Upsert client account in Neon DB
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

    // 4. Issue authenticated session cookie so customer is logged in immediately upon redirect
    await setClientSessionCookie(clientId, order.customer_email);

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
        portalAccessToken,
        temporaryPassword: tempPassword,
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
