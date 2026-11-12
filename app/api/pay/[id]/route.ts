import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const links = await sql`
      SELECT * FROM payment_links 
      WHERE id = ${id}
      LIMIT 1
    `;

    if (links.length === 0) {
      return NextResponse.json({ success: false, error: 'Payment link not found' }, { status: 404 });
    }

    // Increment click count asynchronously
    sql`
      UPDATE payment_links 
      SET clicks_count = clicks_count + 1 
      WHERE id = ${id}
    `.catch((e: any) => console.error('Failed to increment clicks:', e));

    return NextResponse.json({
      success: true,
      link: links[0]
    });
  } catch (error: any) {
    console.error('Error fetching payment link:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
