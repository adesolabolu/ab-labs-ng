import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { createClientToken, getClientSession } from '@/lib/auth';
import { TEMPLATES } from '@/data/templates';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token')?.trim();

    let client: any = null;
    let authenticatedViaToken = false;

    if (token) {
      const rows = (await sql`
        SELECT id, name, email, phone, business_name, domain_name, domain_status,
               domain_expiry_date, template_slug, plan_type, build_phase,
               logo_url, primary_color, accent_color, business_bio,
               whatsapp_number, demo_preview_url, created_at
        FROM clients
        WHERE portal_access_token = ${token}
        LIMIT 1
      `) as any[];
      if (rows.length > 0) {
        client = rows[0];
        authenticatedViaToken = true;
      }
    }

    if (!client) {
      const session = await getClientSession();
      if (session?.clientId) {
        const rows = (await sql`
          SELECT id, name, email, phone, business_name, domain_name, domain_status,
                 domain_expiry_date, template_slug, plan_type, build_phase,
                 logo_url, primary_color, accent_color, business_bio,
                 whatsapp_number, demo_preview_url, created_at
          FROM clients
          WHERE id = ${session.clientId}
          LIMIT 1
        `) as any[];
        if (rows.length > 0) {
          client = rows[0];
        }
      }
    }

    if (!client) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const template = TEMPLATES.find((t) => t.slug === client.template_slug) || null;
    const response = NextResponse.json(
      { success: true, client, template },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );

    if (authenticatedViaToken && client.id && client.email) {
      const sessionToken = createClientToken(client.id, client.email);
      response.cookies.set('ab_client_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    return response;
  } catch (error: any) {
    console.error('Error in /api/portal/me:', error);
    return NextResponse.json({ success: false, error: 'Failed to load portal session' }, { status: 500 });
  }
}
