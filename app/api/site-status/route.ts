import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, max-age=30, s-maxage=30',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = (searchParams.get('projectId') || '').trim();
    const rawDomain = (searchParams.get('domain') || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');

    if (!projectId && !rawDomain) {
      return NextResponse.json({ live: true, reason: 'missing_identifier' }, { headers: corsHeaders });
    }

    const rows = (projectId
      ? await sql`
          SELECT id, domain_name, is_live, billing_status
          FROM client_projects
          WHERE id = ${projectId}
          LIMIT 1
        `
      : await sql`
          SELECT id, domain_name, is_live, billing_status
          FROM client_projects
          WHERE LOWER(REPLACE(REPLACE(COALESCE(domain_name, ''), 'https://', ''), 'www.', '')) = ${rawDomain}
          ORDER BY created_at DESC
          LIMIT 1
        `) as any[];

    if (rows.length === 0) {
      return NextResponse.json({ live: true, reason: 'not_found' }, { headers: corsHeaders });
    }

    const project = rows[0];
    return NextResponse.json(
      {
        live: project.is_live !== false,
        billingStatus: project.billing_status || 'pending_launch',
        domain: project.domain_name || null,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error('[/api/site-status] Error:', err);
    return NextResponse.json({ live: true, reason: 'error_fail_open' }, { headers: corsHeaders });
  }
}
