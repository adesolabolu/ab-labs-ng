import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { verifyPassword, setClientSessionCookie, clearClientSessionCookie } from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';
import { sendClientCredentialsEmail } from '@/lib/email';
import { TEMPLATES } from '@/data/templates';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, requestMagicLink } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Please enter your email address' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Look up client
    const clients = await sql`
      SELECT * FROM clients
      WHERE email = ${cleanEmail}
      LIMIT 1
    `;

    if (clients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No account found for this email. Please check your email or sign up.',
      }, { status: 404 });
    }

    const client = clients[0];

    // Case A: User requested a 1-Click Magic Login Link via email
    if (requestMagicLink) {
      const magicLimit = checkRateLimit(`magic:${cleanEmail}`, 3, 15 * 60 * 1000);
      if (!magicLimit.allowed) {
        return NextResponse.json({
          success: false,
          error: 'Too many login link requests. Please wait a few minutes and try again.',
        }, { status: 429 });
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';
      const portalUrl = `${baseUrl}/portal?token=${client.portal_access_token}`;
      const templateMatch = TEMPLATES.find((t) => t.slug === client.template_slug);
      const templateName = templateMatch ? templateMatch.name : (client.template_slug || 'Website');

      await sendClientCredentialsEmail({
        to: client.email,
        name: client.name,
        templateName,
        temporaryPassword: '(Existing Password Unchanged)',
        portalUrl,
        domainName: client.domain_name,
      });

      return NextResponse.json({
        success: true,
        message: 'A 1-click portal login link has been sent to your email!',
      });
    }

    // Case B: Standard Email + Password Login
    if (!password) {
      return NextResponse.json({ success: false, error: 'Please enter your password' }, { status: 400 });
    }

    const loginLimit = checkRateLimit(`login:${cleanEmail}`, 5, 15 * 60 * 1000);
    if (!loginLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Too many failed login attempts. Please wait a few minutes and try again.',
        retryAfterSeconds: loginLimit.retryAfterSeconds,
      }, { status: 429 });
    }

    if (!client.password_hash) {
      return NextResponse.json({
        success: false,
        error: 'Your account does not have a password set yet. Please check your welcome email for your 1-click login link.',
      }, { status: 400 });
    }

    const isValid = verifyPassword(password, client.password_hash);
    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: 'Incorrect password. Please try again or click "Forgot password?" above.',
      }, { status: 401 });
    }

    // Issue session cookie
    await setClientSessionCookie(client.id, client.email);
    resetRateLimit(`login:${cleanEmail}`);

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      redirectUrl: '/portal',
    });
  } catch (error: any) {
    console.error('Client login error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearClientSessionCookie();
    return NextResponse.json({ success: true, message: 'Signed out successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
