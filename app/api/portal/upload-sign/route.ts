import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from '@/lib/db';
import { getClientSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB strict cap
const MAX_FILES_PER_CLIENT = 10;
const ALLOWED_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'pdf', 'zip'];
const ALLOWED_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
]);

export async function POST(req: Request) {
  try {
    const session = await getClientSession();
    if (!session?.clientId) {
      return NextResponse.json({ success: false, error: 'Please sign in to upload files.' }, { status: 401 });
    }

    // Rate-limit upload signature requests per client (max 20 per 15 mins)
    const limit = checkRateLimit(`upload_sign:${session.clientId}`, 20, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many uploads in a short time. Please wait a few minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const fileName = String(body?.fileName || '').trim();
    const fileSize = Number(body?.fileSize || 0);
    const mimeType = String(body?.mimeType || '').toLowerCase().trim();

    if (!fileName || !Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid file metadata.' }, { status: 400 });
    }

    if (fileSize > MAX_FILE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File is too large. Maximum size per file is 8 MB.' },
        { status: 400 }
      );
    }

    // Strict extension & MIME check (blocks SVG/HTML/JS to prevent stored XSS)
    const ext = fileName.includes('.') ? fileName.split('.').pop()!.toLowerCase() : '';
    if (!ALLOWED_FORMATS.includes(ext) || (mimeType && !ALLOWED_MIMES.has(mimeType))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported file type. Only PNG, JPG, WEBP, PDF, and ZIP files are allowed.',
        },
        { status: 400 }
      );
    }

    // Enforce per-client file count quota
    const rows = (await sql`
      SELECT brand_files FROM clients WHERE id = ${session.clientId} LIMIT 1
    `) as any[];
    const currentFiles = Array.isArray(rows[0]?.brand_files) ? rows[0].brand_files : [];
    if (currentFiles.length >= MAX_FILES_PER_CLIENT) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_FILES_PER_CLIENT} files allowed. Remove an old file first.` },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: 'File storage is not configured on the server.' },
        { status: 503 }
      );
    }

    // Generate short-lived Cloudinary SHA-1 signature locked to this client's isolated folder
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `ab-labs/clients/${session.clientId}`;
    const allowedFormatsStr = ALLOWED_FORMATS.join(',');

    // Cloudinary requires parameters sorted alphabetically by key
    const toSign = `allowed_formats=${allowedFormatsStr}&folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    return NextResponse.json({
      success: true,
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
      allowedFormats: allowedFormatsStr,
    });
  } catch (error: any) {
    console.error('Error signing upload:', error);
    return NextResponse.json({ success: false, error: 'Could not prepare upload.' }, { status: 500 });
  }
}
