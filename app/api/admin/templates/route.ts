import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  applyPricingOverrides,
  clearPricingOverride,
  savePricingOverride,
} from '@/lib/template-pricing';

export const dynamic = 'force-dynamic';

/** Refresh the cached storefront pages that render catalog prices. */
function revalidateStorefront() {
  revalidatePath('/', 'page');
  revalidatePath('/shop', 'page');
  revalidatePath('/product/[slug]', 'page');
  revalidatePath('/checkout', 'page');
}

/** Every catalog template merged with any saved price override. */
export async function GET() {
  try {
    const templates = await applyPricingOverrides();
    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    console.error('Error fetching template pricing:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** Saves a price override for one template slug. */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';

    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
    }

    const hasPrice = Object.prototype.hasOwnProperty.call(body, 'priceNgn');
    const hasSetup = Object.prototype.hasOwnProperty.call(body, 'setupFeeNgn');
    const hasMonthly = Object.prototype.hasOwnProperty.call(body, 'monthlyNgn');

    if (!hasPrice && !hasSetup && !hasMonthly) {
      return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 });
    }

    for (const field of ['priceNgn', 'setupFeeNgn', 'monthlyNgn'] as const) {
      if (!Object.prototype.hasOwnProperty.call(body, field)) continue;
      const raw = body[field];
      if (raw === '' || raw === null) continue;
      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return NextResponse.json(
          { success: false, error: `${field} must be a positive number` },
          { status: 400 }
        );
      }
    }

    const pricing = await savePricingOverride({
      slug,
      priceNgn: hasPrice ? body.priceNgn : undefined,
      setupFeeNgn: hasSetup ? body.setupFeeNgn : undefined,
      monthlyNgn: hasMonthly ? body.monthlyNgn : undefined,
    });

    revalidateStorefront();

    return NextResponse.json({ success: true, pricing });
  } catch (error: any) {
    console.error('Error saving template pricing:', error);
    const status = /Unknown template slug|must be/.test(error.message) ? 400 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

/** Clears an override so the template returns to its coded default. */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let slug = searchParams.get('slug') || '';

    if (!slug) {
      const body = await req.json().catch(() => null);
      slug = typeof body?.slug === 'string' ? body.slug : '';
    }

    slug = slug.trim();
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
    }

    await clearPricingOverride(slug);
    revalidateStorefront();
    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    console.error('Error clearing template pricing:', error);
    const status = /Unknown template slug/.test(error.message) ? 400 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
