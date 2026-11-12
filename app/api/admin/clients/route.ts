import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clients = await sql`
      SELECT * FROM clients 
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      clients
    });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Normalise whatever was typed into a bare domain, e.g.
// "https://www.ClientBrand.com.ng/" -> "clientbrand.com.ng"
const normalizeDomain = (raw: unknown): string | null => {
  if (typeof raw !== 'string') return null;
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '');
  return cleaned || null;
};

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const clientId = typeof body?.clientId === 'string' ? body.clientId.trim() : '';

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'clientId is required' }, { status: 400 });
    }

    const hasDomain = Object.prototype.hasOwnProperty.call(body, 'domainName');
    const hasExpiry = Object.prototype.hasOwnProperty.call(body, 'domainExpiryDate');

    if (!hasDomain && !hasExpiry) {
      return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 });
    }

    let domainName: string | null = null;
    if (hasDomain) {
      domainName = normalizeDomain(body.domainName);
      if (domainName && !/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(domainName)) {
        return NextResponse.json(
          { success: false, error: `"${body.domainName}" does not look like a domain name.` },
          { status: 400 }
        );
      }
    }

    let expiryDate: Date | null = null;
    if (hasExpiry) {
      const rawExpiry = body.domainExpiryDate;
      if (rawExpiry) {
        const parsed = new Date(rawExpiry);
        if (Number.isNaN(parsed.getTime())) {
          return NextResponse.json({ success: false, error: 'Invalid renewal date' }, { status: 400 });
        }
        expiryDate = parsed;
      }
    }

    let updated: any[];
    if (hasDomain && hasExpiry) {
      updated = await sql`
        UPDATE clients
        SET domain_name = ${domainName}, domain_expiry_date = ${expiryDate}
        WHERE id = ${clientId}
        RETURNING *
      `;
    } else if (hasDomain) {
      updated = await sql`
        UPDATE clients
        SET domain_name = ${domainName}
        WHERE id = ${clientId}
        RETURNING *
      `;
    } else {
      updated = await sql`
        UPDATE clients
        SET domain_expiry_date = ${expiryDate}
        WHERE id = ${clientId}
        RETURNING *
      `;
    }

    if (!updated || updated.length === 0) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, client: updated[0] });
  } catch (error: any) {
    console.error('Error updating client domain:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
