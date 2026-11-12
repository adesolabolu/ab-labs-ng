import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const links = await sql`
      SELECT * FROM payment_links 
      ORDER BY created_at DESC
    `;

    // Compute stats
    const totalLinks = links.length;
    const activeLinks = links.filter(l => l.status === 'ACTIVE').length;
    const paidLinks = links.filter(l => l.status === 'PAID').length;
    const totalPaidAmount = links
      .filter(l => l.status === 'PAID')
      .reduce((sum, l) => sum + (Number(l.amount_due_now_ngn) || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalLinks,
        activeLinks,
        paidLinks,
        totalPaidAmount
      },
      links
    });
  } catch (error: any) {
    console.error('Error fetching payment links:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      clientName,
      clientEmail,
      clientPhone,
      templateSlug,
      templateName,
      planType = 'MONTHLY',
      setupFeeNgn = 15000,
      monthlyPriceNgn = 5000,
      outrightPriceNgn = 50000,
      notes = ''
    } = body;

    if (!templateSlug) {
      return NextResponse.json({ success: false, error: 'Target design template is required' }, { status: 400 });
    }

    const finalTitle = title?.trim() || `${templateName || 'Digital Web Flagship'} Launch Proposal`;

    // Generate unique ID: link_<random8>
    const randomHex = Math.random().toString(36).substring(2, 10);
    const id = `link_${randomHex}`;

    // Amount due now: if monthly -> setupFee + first month; if outright -> outright price
    const amountDueNow = planType === 'MONTHLY' 
      ? Number(setupFeeNgn) + Number(monthlyPriceNgn)
      : Number(outrightPriceNgn);

    const inserted = await sql`
      INSERT INTO payment_links (
        id,
        title,
        client_name,
        client_email,
        client_phone,
        template_slug,
        template_name,
        plan_type,
        setup_fee_ngn,
        monthly_price_ngn,
        outright_price_ngn,
        amount_due_now_ngn,
        notes,
        status
      ) VALUES (
        ${id},
        ${finalTitle},
        ${clientName || null},
        ${clientEmail || null},
        ${clientPhone || null},
        ${templateSlug},
        ${templateName || templateSlug},
        ${planType},
        ${Number(setupFeeNgn)},
        ${Number(monthlyPriceNgn)},
        ${Number(outrightPriceNgn)},
        ${amountDueNow},
        ${notes || null},
        'ACTIVE'
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, link: inserted[0] });
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
