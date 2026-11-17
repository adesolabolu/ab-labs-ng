import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from '@/lib/db';
import { getClientSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Initializes a refundable ₦50 card-only Paystack transaction so an existing client
 * (e.g. one who originally paid via Bank Transfer) can save a card in /portal for
 * automated monthly maintenance renewals.
 */
export async function POST(req: Request) {
  try {
    const session = await getClientSession();
    if (!session?.clientId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const clients = (await sql`
      SELECT id, email, name, plan_type
      FROM clients
      WHERE id = ${session.clientId}
      LIMIT 1
    `) as any[];

    if (clients.length === 0) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const client = clients[0];
    if (String(client.plan_type || '').toUpperCase() === 'OUTRIGHT') {
      return NextResponse.json(
        { success: false, error: 'Outright clients have no recurring monthly fees.' },
        { status: 400 }
      );
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey || paystackSecretKey.includes('placeholder')) {
      return NextResponse.json(
        { success: false, error: 'Paystack live key is not configured.' },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const origin =
      typeof body?.callbackOrigin === 'string' && body.callbackOrigin.startsWith('http')
        ? body.callbackOrigin.replace(/\/+$/, '')
        : process.env.NEXT_PUBLIC_APP_URL || 'https://ng.ab-labs.cv';

    const reference = `ab_card_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const callbackUrl = `${origin}/portal?card_linked=1`;

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: client.email,
        amount: 50 * 100, // ₦50 refundable card verification charge
        reference,
        channels: ['card'],
        callback_url: callbackUrl,
        metadata: {
          purpose: 'link_card',
          clientId: client.id,
          customerName: client.name,
        },
      }),
    });

    const paystackData = await paystackRes.json();
    if (!paystackData?.status || !paystackData?.data?.authorization_url) {
      return NextResponse.json(
        { success: false, error: paystackData?.message || 'Failed to initialize card linking' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackData.data.authorization_url,
      reference,
    });
  } catch (error: any) {
    console.error('Error in /api/portal/link-card:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}
