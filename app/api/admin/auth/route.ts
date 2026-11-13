import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { setAdminSessionCookie, clearAdminSessionCookie, verifyAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

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
