import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'ab-labs-production-secret-session-key-2026';
const ADMIN_COOKIE_NAME = 'ab_admin_session';

async function verifyAdminTokenEdge(token: string): Promise<boolean> {
  try {
    const [payloadEncoded, signature] = token.split('.');
    if (!payloadEncoded || !signature) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const expectedSigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadEncoded));
    const expectedSigBase64Url = Buffer.from(expectedSigBuffer).toString('base64url');

    if (signature !== expectedSigBase64Url) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString('utf-8'));
    return payload.role === 'admin' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin and /api/admin/*
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isLoginPage = pathname === '/admin/login';
  const isAuthApi = pathname === '/api/admin/auth';

  if (!isAdminRoute || isLoginPage || isAuthApi) {
    return NextResponse.next();
  }

  // Check admin session cookie
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isValid = token ? await verifyAdminTokenEdge(token) : false;

  if (!isValid) {
    // If it's an API route, return 401 JSON
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    // If it's a page, redirect to /admin/login
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
