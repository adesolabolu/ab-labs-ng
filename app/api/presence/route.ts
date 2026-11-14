import { NextResponse } from 'next/server';
import { recordPresence } from '@/lib/presence';
import { getClientSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, pathname } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'sessionId is required' }, { status: 400 });
    }

    const session = await getClientSession();
    const isLoggedIn = !!session?.clientId;
    const clientEmail = session?.email || null;

    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const ip = forwardedFor.split(',')[0].trim() || 'Direct';

    recordPresence({
      sessionId,
      pathname: pathname || '/',
      isLoggedIn,
      clientEmail,
      userAgent,
      ip,
    });

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
