import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { setClientSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (token) {
    const clients = await sql`
      SELECT id, email FROM clients 
      WHERE portal_access_token = ${token}
      LIMIT 1
    `;
    if (clients.length > 0) {
      await setClientSessionCookie(clients[0].id, clients[0].email);
    }
  }

  return NextResponse.redirect(new URL('/portal', req.url));
}
