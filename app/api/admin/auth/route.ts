import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { setAdminSessionCookie, clearAdminSessionCookie, verifyAdminToken } from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    // Brute-force protection: 5 attempts per 15 minutes per source IP.
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const clientIp = forwardedFor.split(',')[0].trim() || 'unknown';
    const loginLimit = checkRateLimit(`admin_login:${clientIp}`, 5, 15 * 60 * 1000);
    if (!loginLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Too many failed attempts. Please wait a few minutes and try again.',
        retryAfterSeconds: loginLimit.retryAfterSeconds,
      }, { status: 429 });
    }

    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword || !password) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    const inputBuf = Buffer.from(String(password));
    const expectedBuf = Buffer.from(String(expectedPassword));

    if (inputBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(inputBuf, expectedBuf)) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    await setAdminSessionCookie();
    resetRateLimit(`admin_login:${clientIp}`);

    return NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      redirectUrl: '/admin',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearAdminSessionCookie();
    return NextResponse.json({ success: true, message: 'Admin signed out' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
