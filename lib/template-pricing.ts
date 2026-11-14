import sql from '@/lib/db';
import { TEMPLATES, type Template } from '@/data/templates';

/**
 * Editable catalog pricing.
 *
 * `data/templates.ts` stays the default source of truth so the site still
 * builds and renders if the database is unreachable. Any row in the
 * `template_pricing` table overrides the defaults for that slug.
 */

export interface TemplatePricing {
  slug: string;
  priceNgn: number;
  setupFeeNgn: number;
  monthlyNgn: number;
  updatedAt?: string | null;
}

export interface TemplateWithPricing extends Template {
  pricingOverride: boolean;
  basePriceNgn: number;
  baseSetupFeeNgn: number;
  baseMonthlyNgn: number;
}

const KNOWN_SLUGS = new Set(TEMPLATES.map((t) => t.slug));

let tableReady = false;

async function ensurePricingTable(): Promise<void> {
  if (tableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS template_pricing (
      slug TEXT PRIMARY KEY,
      price_ngn INTEGER NOT NULL,
      setup_fee_ngn INTEGER NOT NULL,
      monthly_ngn INTEGER NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  tableReady = true;
}

function toNumber(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.round(parsed);
}

/** Reads every saved price override. Returns an empty map on any DB problem. */
export async function getPricingOverrides(): Promise<Record<string, TemplatePricing>> {
  try {
    await ensurePricingTable();
    const rows = (await sql`
      SELECT slug, price_ngn, setup_fee_ngn, monthly_ngn, updated_at
      FROM template_pricing
    `) as any[];

    const map: Record<string, TemplatePricing> = {};
    for (const row of rows) {
      if (!row?.slug) continue;
      const base = TEMPLATES.find((t) => t.slug === row.slug);
      if (!base) continue;
      map[row.slug] = {
        slug: row.slug,
        priceNgn: toNumber(row.price_ngn, base.priceNgn),
        setupFeeNgn: toNumber(row.setup_fee_ngn, base.setupFeeNgn),
        monthlyNgn: toNumber(row.monthly_ngn, base.monthlyNgn),
        updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
      };
    }
    return map;
  } catch (error) {
    console.error('Could not load template pricing overrides:', error);
    return {};
  }
}

/** Applies saved overrides on top of the defaults. Never throws. */
export async function applyPricingOverrides(): Promise<TemplateWithPricing[]> {
  const overrides = await getPricingOverrides();
  return TEMPLATES.map((template) => {
    const override = overrides[template.slug];
    if (!override) {
      return {
        ...template,
        pricingOverride: false,
        basePriceNgn: template.priceNgn,
        baseSetupFeeNgn: template.setupFeeNgn,
        baseMonthlyNgn: template.monthlyNgn,
      };
    }
    return {
      ...template,
      priceNgn: override.priceNgn,
      outrightNgn: override.priceNgn,
      setupFeeNgn: override.setupFeeNgn,
      monthlyNgn: override.monthlyNgn,
      pricingOverride: true,
      basePriceNgn: template.priceNgn,
      baseSetupFeeNgn: template.setupFeeNgn,
      baseMonthlyNgn: template.monthlyNgn,
    };
  });
}

/** Returns a single template with current database pricing applied. */
export async function getTemplateWithPricing(slug: string): Promise<TemplateWithPricing | null> {
  const templates = await applyPricingOverrides();
  const clean = String(slug || '').trim();
  return templates.find((t) => t.slug === clean || t.id === clean) || null;
}

/** Single source of truth calculation for initial payment due today */
export function calculateAmountDue(
  template: { setupFeeNgn?: number; outrightNgn?: number; priceNgn?: number },
  plan: 'monthly' | 'outright' | string
): number {
  if (String(plan).toLowerCase() === 'outright') {
    return Number(template.outrightNgn || template.priceNgn || 50000);
  }
  // For monthly launch: customer pays JUST the setup fee first to start the build
  return Number(template.setupFeeNgn || 15000);
}

export interface PricingInput {
  slug: string;
  priceNgn?: number | string;
  setupFeeNgn?: number | string;
  monthlyNgn?: number | string;
}

/** Saves one override. Throws a readable error for bad input. */
export async function savePricingOverride(input: PricingInput): Promise<TemplatePricing> {
  const slug = String(input.slug || '').trim();
  if (!KNOWN_SLUGS.has(slug)) {
    throw new Error(`Unknown template slug: ${slug || '(empty)'}`);
  }

  const base = TEMPLATES.find((t) => t.slug === slug)!;

  await ensurePricingTable();

  // Partial patches keep whatever was already saved, then the coded defaults.
  const existing = (await sql`
    SELECT price_ngn, setup_fee_ngn, monthly_ngn
    FROM template_pricing
    WHERE slug = ${slug}
  `) as any[];
  const current = existing[0];

  const priceNgn = toNumber(input.priceNgn, toNumber(current?.price_ngn, base.priceNgn));
  const setupFeeNgn = toNumber(input.setupFeeNgn, toNumber(current?.setup_fee_ngn, base.setupFeeNgn));
  const monthlyNgn = toNumber(input.monthlyNgn, toNumber(current?.monthly_ngn, base.monthlyNgn));

  const rows = (await sql`
    INSERT INTO template_pricing (slug, price_ngn, setup_fee_ngn, monthly_ngn, updated_at)
    VALUES (${slug}, ${priceNgn}, ${setupFeeNgn}, ${monthlyNgn}, NOW())
    ON CONFLICT (slug) DO UPDATE
      SET price_ngn = EXCLUDED.price_ngn,
          setup_fee_ngn = EXCLUDED.setup_fee_ngn,
          monthly_ngn = EXCLUDED.monthly_ngn,
          updated_at = NOW()
    RETURNING slug, price_ngn, setup_fee_ngn, monthly_ngn, updated_at
  `) as any[];

  const row = rows[0];
  return {
    slug,
    priceNgn,
    setupFeeNgn,
    monthlyNgn,
    updatedAt: row?.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

/** Removes an override so the template falls back to its coded default. */
export async function clearPricingOverride(slug: string): Promise<void> {
  const clean = String(slug || '').trim();
  if (!KNOWN_SLUGS.has(clean)) {
    throw new Error(`Unknown template slug: ${clean || '(empty)'}`);
  }
  await ensurePricingTable();
  await sql`DELETE FROM template_pricing WHERE slug = ${clean}`;
}
