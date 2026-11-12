import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getClientSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getClientSession();
    if (!session?.clientId) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const { logoUrl, primaryColor, accentColor, businessBio, whatsappNumber, brandAssets } = body;

    await sql`
      UPDATE clients
      SET 
        logo_url = COALESCE(${logoUrl || null}, logo_url),
        primary_color = COALESCE(${primaryColor || null}, primary_color),
        accent_color = COALESCE(${accentColor || null}, accent_color),
        business_bio = COALESCE(${businessBio || null}, business_bio),
        whatsapp_number = COALESCE(${whatsappNumber || null}, whatsapp_number),
        brand_assets = COALESCE(${brandAssets ? JSON.stringify(brandAssets) : null}::jsonb, brand_assets)
      WHERE id = ${session.clientId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Brand assets and preferences saved successfully!',
    });
  } catch (error: any) {
    console.error('Error saving portal assets:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
