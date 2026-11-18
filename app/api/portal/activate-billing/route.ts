import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getClientSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getClientSession();
    if (!session?.clientId) {
      return NextResponse.json({ success: false, error: 'Please sign in first.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const projectId = typeof body?.projectId === 'string' ? body.projectId.trim() : '';
    const callbackOrigin =
      typeof body?.callbackOrigin === 'string' && body.callbackOrigin.startsWith('http')
        ? body.callbackOrigin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://ng.ab-labs.cv';

    const rows = (projectId
      ? await sql`
          SELECT p.id, p.monthly_amount_ngn, p.plan_type, c.email
          FROM client_projects p
          JOIN clients c ON c.id = p.client_id
          WHERE p.id = ${projectId} AND p.client_id = ${session.clientId}
          LIMIT 1
        `
      : await sql`
          SELECT p.id, p.monthly_amount_ngn, p.plan_type, c.email
          FROM client_projects p
          JOIN clients c ON c.id = p.client_id
          WHERE p.client_id = ${session.clientId}
          ORDER BY p.created_at DESC
          LIMIT 1
        `) as any[];

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Website project not found.' }, { status: 404 });
    }

    const project = rows[0];
    if (String(project.plan_type || '').toUpperCase() === 'OUTRIGHT') {
      return NextResponse.json({ success: false, error: 'Outright plans do not require monthly billing.' }, { status: 400 });
    }

    const amountNgn = Number(project.monthly_amount_ngn || 5000);
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey || paystackSecretKey.includes('placeholder')) {
      return NextResponse.json({ success: false, error: 'Paystack is not configured yet.' }, { status: 503 });
    }

    const reference = `ab_bill_${Date.now()}_${project.id}`;
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: project.email,
        amount: Math.round(amountNgn * 100),
        reference,
        callback_url: `${callbackOrigin}/portal?billing_activated=1&projectId=${encodeURIComponent(project.id)}`,
        metadata: {
          type: 'activate_monthly_billing',
          clientId: session.clientId,
          projectId: project.id,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.status || !data?.data?.authorization_url) {
      return NextResponse.json(
        { success: false, error: data?.message || 'Could not initialize Paystack checkout.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      reference,
    });
  } catch (err: any) {
    console.error('[/api/portal/activate-billing] Error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
