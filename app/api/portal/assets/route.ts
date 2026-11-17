import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from '@/lib/db';
import { getClientSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_FORMATS = new Set(['png', 'jpg', 'jpeg', 'webp', 'pdf', 'zip']);
const MAX_FILES = 10;

export interface BrandFileItem {
  publicId: string;
  url: string;
  name: string;
  format: string;
  bytes: number;
  resourceType: 'image' | 'raw';
  uploadedAt: string;
}

function sanitizeFilename(raw: unknown): string {
  return String(raw || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 100);
}

function validateBrandFiles(rawList: unknown, clientId: string): BrandFileItem[] {
  if (!Array.isArray(rawList)) return [];
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'drzh5dzha';
  const expectedUrlPrefix = `https://res.cloudinary.com/${cloudName}/`;
  const expectedPublicIdPrefix = `ab-labs/clients/${clientId}/`;

  const validated: BrandFileItem[] = [];
  for (const item of rawList.slice(0, MAX_FILES)) {
    if (!item || typeof item !== 'object') continue;
    const url = String((item as any).url || '');
    const publicId = String((item as any).publicId || '');
    const format = String((item as any).format || '').toLowerCase();
    const bytes = Number((item as any).bytes || 0);
    const resourceType = (item as any).resourceType === 'raw' ? 'raw' : 'image';

    // Strict ownership & origin enforcement
    if (!url.startsWith(expectedUrlPrefix)) continue;
    if (!publicId.startsWith(expectedPublicIdPrefix)) continue;
    if (!ALLOWED_FORMATS.has(format)) continue;
    if (!Number.isFinite(bytes) || bytes <= 0 || bytes > 8 * 1024 * 1024) continue;

    validated.push({
      publicId,
      url,
      name: sanitizeFilename((item as any).name),
      format,
      bytes,
      resourceType,
      uploadedAt: String((item as any).uploadedAt || new Date().toISOString()),
    });
  }
  return validated;
}

export async function POST(req: Request) {
  try {
    const session = await getClientSession();
    if (!session?.clientId) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const { logoUrl, primaryColor, accentColor, businessBio, whatsappNumber, brandAssets, brandFiles } = body;

    const hasBrandFiles = Array.isArray(brandFiles);
    const cleanFiles = hasBrandFiles ? validateBrandFiles(brandFiles, session.clientId) : null;
    const firstImage = cleanFiles?.find((f) => f.resourceType === 'image');
    const resolvedLogoUrl = logoUrl || firstImage?.url || null;

    await sql`
      UPDATE clients
      SET 
        logo_url = COALESCE(${resolvedLogoUrl}, logo_url),
        primary_color = COALESCE(${primaryColor || null}, primary_color),
        accent_color = COALESCE(${accentColor || null}, accent_color),
        business_bio = COALESCE(${businessBio || null}, business_bio),
        whatsapp_number = COALESCE(${whatsappNumber || null}, whatsapp_number),
        brand_assets = COALESCE(${brandAssets ? JSON.stringify(brandAssets) : null}::jsonb, brand_assets),
        brand_files = COALESCE(${cleanFiles ? JSON.stringify(cleanFiles) : null}::jsonb, brand_files)
      WHERE id = ${session.clientId}
    `;

    return NextResponse.json({
      success: true,
      brandFiles: cleanFiles,
      message: 'Brand details and files saved successfully!',
    });
  } catch (error: any) {
    console.error('Error saving portal assets:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getClientSession();
    if (!session?.clientId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const publicId = String(searchParams.get('publicId') || '').trim();
    const resourceType = searchParams.get('resourceType') === 'raw' ? 'raw' : 'image';

    // Strict ownership check: clients may only delete files inside their own isolated folder
    const expectedPrefix = `ab-labs/clients/${session.clientId}/`;
    if (!publicId || !publicId.startsWith(expectedPrefix)) {
      return NextResponse.json({ success: false, error: 'Forbidden file reference.' }, { status: 403 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(toSign).digest('hex');

      const formData = new URLSearchParams({
        public_id: publicId,
        timestamp: String(timestamp),
        api_key: apiKey,
        signature,
      });

      await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
        method: 'POST',
        body: formData,
      }).catch((err) => console.error('[Cloudinary Destroy] Warning:', err));
    }

    const rows = (await sql`
      SELECT brand_files FROM clients WHERE id = ${session.clientId} LIMIT 1
    `) as any[];
    const currentFiles = Array.isArray(rows[0]?.brand_files) ? rows[0].brand_files : [];
    const updatedFiles = currentFiles.filter((f: any) => f?.publicId !== publicId);

    await sql`
      UPDATE clients
      SET brand_files = ${JSON.stringify(updatedFiles)}::jsonb
      WHERE id = ${session.clientId}
    `;

    return NextResponse.json({ success: true, brandFiles: updatedFiles });
  } catch (error: any) {
    console.error('Error deleting portal file:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not delete file' }, { status: 500 });
  }
}
