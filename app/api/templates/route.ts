import { NextResponse } from 'next/server';
import { applyPricingOverrides, getTemplateWithPricing } from '@/lib/template-pricing';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const template = await getTemplateWithPricing(slug);
      if (!template) {
        return NextResponse.json(
          { success: false, error: `Template not found: ${slug}` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, template },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    const templates = await applyPricingOverrides();
    return NextResponse.json(
      { success: true, templates },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in public /api/templates route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
