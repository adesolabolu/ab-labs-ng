import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const projectId = typeof body?.projectId === 'string' ? body.projectId.trim() : '';
    const isLive = Boolean(body?.isLive);

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const updated = (await sql`
      UPDATE client_projects
      SET is_live = ${isLive}
      WHERE id = ${projectId}
      RETURNING id, client_id, is_live
    `) as any[];

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updated[0] });
  } catch (err: any) {
    console.error('[/api/admin/clients/live-toggle] Error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
