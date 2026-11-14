import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      linkId,
      templateSlug,
      planType,
      amountNgn,
      customerName,
      customerEmail,
      customerPhone,
      businessName,
      requestedDomain,
      callbackUrl,
    } = body;

    if (!customerEmail || !customerName || !amountNgn) {
      return NextResponse.json({ success: false, error: 'Missing required customer details' }, { status: 400 });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    const isLiveKeyAvailable = paystackSecretKey && !paystackSecretKey.includes('placeholder');

    const orderId = `ord_${Math.random().toString(36).substring(2, 10)}`;
    const reference = `ab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create pending order in database
    await sql`
      INSERT INTO orders (
        id,
        payment_link_id,
        template_slug,
        plan_type,
        amount_paid_ngn,
        customer_name,
        customer_email,
        customer_phone,
        business_name,
        requested_domain,
        paystack_reference,
        paystack_status,
        metadata
      ) VALUES (
        ${orderId},
        ${linkId || null},
        ${templateSlug || 'custom'},
        ${planType || 'MONTHLY'},
        ${Number(amountNgn)},
        ${customerName},
        ${customerEmail},
        ${customerPhone || null},
        ${businessName || null},
        ${requestedDomain || null},
        ${reference},
        'pending',
        ${JSON.stringify({ initiatedAt: new Date().toISOString() })}
      )
    `;

    if (isLiveKeyAvailable) {
      // Call Paystack API
      const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          amount: Number(amountNgn) * 100, // Paystack expects kobo
          reference,
          callback_url: callbackUrl || undefined,
          metadata: {
            customerName,
            customerPhone,
            businessName,
            requestedDomain,
            orderId,
            linkId,
            templateSlug,
            planType,
          },
        }),
      });

      const paystackData = await paystackRes.json();
      if (!paystackData.status) {
        return NextResponse.json({ success: false, error: paystackData.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        isSimulation: false,
        authorizationUrl: paystackData.data.authorization_url,
        reference,
        orderId,
      });
    } else {
      // Sandbox / Instant demo mode for testing until user injects their live Paystack key
      return NextResponse.json({
        success: true,
        isSimulation: true,
        reference,
        orderId,
        message: 'Paystack is in sandbox/testing mode. Ready to verify simulation or live transaction.',
      });
    }
  } catch (error: any) {
    console.error('Error initializing payment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
