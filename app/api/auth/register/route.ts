import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from '@/lib/db';
import { hashPassword, setClientSessionCookie } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.toLowerCase().trim() : '';
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!name || name.length < 2) {
      return NextResponse.json({ success: false, error: 'Please enter your full name.' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const regLimit = checkRateLimit(`register:${email}`, 5, 15 * 60 * 1000);
    if (!regLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many sign-up attempts. Please wait a few minutes and try again.' },
        { status: 429 }
      );
    }

    const existing = (await sql`
      SELECT id FROM clients WHERE email = ${email} LIMIT 1
    `) as any[];

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 }
      );
    }

    const clientId = `cli_${crypto.randomBytes(4).toString('hex')}`;
    const portalAccessToken = `token_${crypto.randomBytes(12).toString('hex')}`;
    const passwordHash = hashPassword(password);

    await sql`
      INSERT INTO clients (
        id,
        email,
        name,
        phone,
        portal_access_token,
        password_hash,
        build_phase
      ) VALUES (
        ${clientId},
        ${email},
        ${name},
        ${phone || null},
        ${portalAccessToken},
        ${passwordHash},
        0
      )
    `;

    await setClientSessionCookie(clientId, email);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      redirectUrl: '/portal',
    });
  } catch (error: any) {
    console.error('Client registration error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Could not create account.' }, { status: 500 });
  }
}
