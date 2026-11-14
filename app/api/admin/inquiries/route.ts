import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const inquiries = await sql`
      SELECT 
        id,
        name,
        email,
        phone,
        business_name,
        subject,
        message,
        message AS notes,
        template_interest,
        inquiry_type,
        plan_type,
        status,
        created_at
      FROM contact_inquiries 
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      inquiries,
    });
  } catch (error: any) {
    console.error('Error fetching admin inquiries:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 });
    }

    const updated = await sql`
      UPDATE contact_inquiries
      SET status = ${status}
      WHERE id = ${Number(id)}
      RETURNING *
    `;

    if (!updated || updated.length === 0) {
      return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      inquiry: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'id parameter is required' }, { status: 400 });
    }

    await sql`
      DELETE FROM contact_inquiries
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
