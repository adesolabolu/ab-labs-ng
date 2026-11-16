import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const clients = await sql`
      SELECT portal_access_token FROM clients
      WHERE id = ${id}
      LIMIT 1
    `;

    if (clients.length === 0) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    // Issue #21: keep portal tokens out of admin JSON responses.
    // Hand the token to the browser only as a redirect target.
    return NextResponse.redirect(new URL(`/portal?token=${clients[0].portal_access_token}`, req.url));
  } catch (error: any) {
    console.error('Error creating portal link:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
