import { NextResponse } from 'next/server';
import { activateClientSubscription } from '@/lib/paystack-recurring';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clientId = typeof body?.clientId === 'string' ? body.clientId.trim() : '';
    const markLive = body?.markLive !== false;

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'clientId is required' }, { status: 400 });
    }

    const result = await activateClientSubscription(clientId, { markLive });
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error activating client subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to activate monthly billing' },
      { status: 500 }
    );
  }
}
