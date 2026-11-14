import sql from '@/lib/db';
import { TEMPLATES, type Template } from '@/data/templates';

/**
 * Single source of truth for website template catalog & pricing.
 *
 * Neon PostgreSQL `templates` table is the authoritative database store.
 * The static `TEMPLATES` array serves as the seed and fallback so the site
 * remains resilient if the database is temporarily unreachable.
 */

export interface TemplatePricing {
  slug: string;
  priceNgn: number;
  setupFeeNgn: number;
  monthlyNgn: number;
  outrightNgn?: number;
  demoUrl?: string;
  updatedAt?: string | null;
}

export interface TemplateWithPricing extends Template {
  pricingOverride?: boolean;
  basePriceNgn?: number;
  baseSetupFeeNgn?: number;
  baseMonthlyNgn?: number;
}

let tableInitialized = false;

export async function ensureTemplatesTable(): Promise<void> {
  if (tableInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        tagline TEXT,
        category TEXT NOT NULL,
        category_label TEXT NOT NULL,
        price_ngn INTEGER NOT NULL,
        price_usd INTEGER NOT NULL DEFAULT 35,
        monthly_ngn INTEGER NOT NULL DEFAULT 5000,
        setup_fee_ngn INTEGER NOT NULL DEFAULT 15000,
        outright_ngn INTEGER NOT NULL DEFAULT 50000,
        standard_monthly_ngn INTEGER DEFAULT 10000,
        standard_setup_fee_ngn INTEGER DEFAULT 30000,
        standard_outright_ngn INTEGER DEFAULT 100000,
        rating NUMERIC(3, 1) DEFAULT 4.9,
        reviews INTEGER DEFAULT 24,
        badge TEXT,
        badge_color TEXT,
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        stack JSONB DEFAULT '[]'::jsonb,
        features JSONB DEFAULT '[]'::jsonb,
        demo_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Ensure template_pricing also exists for legacy callers
    await sql`
      CREATE TABLE IF NOT EXISTS template_pricing (
        slug TEXT PRIMARY KEY,
        price_ngn INTEGER NOT NULL,
        setup_fee_ngn INTEGER NOT NULL,
        monthly_ngn INTEGER NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    tableInitialized = true;
  } catch (err) {
    console.error('Error ensuring templates table:', err);
  }
}

export async function seedTemplatesIfEmpty(): Promise<void> {
  try {
    await ensureTemplatesTable();
    const countResult = (await sql`SELECT count(*)::int as count FROM templates`) as any[];
    const count = countResult[0]?.count ?? 0;

    if (count === 0) {
      console.log('Seeding templates table in Neon database from data/templates.ts...');
      // Check for any legacy overrides from template_pricing table
      let legacyOverrides: Record<string, any> = {};
      try {
        const rows = (await sql`SELECT slug, price_ngn, setup_fee_ngn, monthly_ngn FROM template_pricing`) as any[];
        for (const r of rows) {
          if (r.slug) legacyOverrides[r.slug] = r;
        }
      } catch (e) {}

      for (const tpl of TEMPLATES) {
        const ovr = legacyOverrides[tpl.slug];
        const priceNgn = ovr?.price_ngn ?? tpl.priceNgn ?? 50000;
        const setupFeeNgn = ovr?.setup_fee_ngn ?? tpl.setupFeeNgn ?? 15000;
        const monthlyNgn = ovr?.monthly_ngn ?? tpl.monthlyNgn ?? 5000;
        const outrightNgn = ovr?.price_ngn ?? tpl.outrightNgn ?? priceNgn;

        await sql`
          INSERT INTO templates (
            id, slug, name, tagline, category, category_label,
            price_ngn, price_usd, monthly_ngn, setup_fee_ngn, outright_ngn,
            standard_monthly_ngn, standard_setup_fee_ngn, standard_outright_ngn,
            rating, reviews, badge, badge_color, image, description,
            stack, features, demo_url, updated_at
          ) VALUES (
            ${tpl.id}, ${tpl.slug}, ${tpl.name}, ${tpl.tagline || ''}, ${tpl.category}, ${tpl.categoryLabel},
            ${priceNgn}, ${tpl.priceUsd || 35}, ${monthlyNgn}, ${setupFeeNgn}, ${outrightNgn},
            ${tpl.standardMonthlyNgn || 10000}, ${tpl.standardSetupFeeNgn || 30000}, ${tpl.standardOutrightNgn || 100000},
            ${tpl.rating || 4.9}, ${tpl.reviews || 24}, ${tpl.badge || null}, ${tpl.badgeColor || null},
            ${tpl.image}, ${tpl.description},
            ${JSON.stringify(tpl.stack || [])}::jsonb,
            ${JSON.stringify(tpl.features || [])}::jsonb,
            ${tpl.demoUrl || null},
            NOW()
          ) ON CONFLICT (slug) DO NOTHING
        `;
      }
      console.log(`Successfully seeded ${TEMPLATES.length} templates into Neon DB.`);
    }
  } catch (err) {
    console.error('Error seeding templates table:', err);
  }
}

function parseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch (e) {}
  }
  return [];
}

function rowToTemplate(row: any): TemplateWithPricing {
  const priceNgn = Number(row.price_ngn) || 50000;
  const outrightNgn = Number(row.outright_ngn) || priceNgn;
  const setupFeeNgn = Number(row.setup_fee_ngn) || 15000;
  const monthlyNgn = Number(row.monthly_ngn) || 5000;

  return {
    id: String(row.id || row.slug),
    slug: String(row.slug),
    name: String(row.name),
    tagline: String(row.tagline || ''),
    category: row.category as any,
    categoryLabel: String(row.category_label || 'Business Flagship'),
    priceNgn,
    priceUsd: Number(row.price_usd) || 35,
    monthlyNgn,
    setupFeeNgn,
    outrightNgn,
    standardMonthlyNgn: Number(row.standard_monthly_ngn) || 10000,
    standardSetupFeeNgn: Number(row.standard_setup_fee_ngn) || 30000,
    standardOutrightNgn: Number(row.standard_outright_ngn) || 100000,
    rating: Number(row.rating) || 4.9,
    reviews: Number(row.reviews) || 24,
    badge: row.badge ? String(row.badge) : undefined,
    badgeColor: row.badge_color ? String(row.badge_color) : undefined,
    image: String(row.image),
    description: String(row.description),
    stack: parseJsonArray(row.stack),
    features: parseJsonArray(row.features),
    demoUrl: row.demo_url ? String(row.demo_url) : undefined,
    pricingOverride: true,
    basePriceNgn: priceNgn,
    baseSetupFeeNgn: setupFeeNgn,
    baseMonthlyNgn: monthlyNgn,
  };
}

/** Queries all templates directly from Neon Database (authoritative single source of truth). */
export async function getTemplatesFromDb(): Promise<TemplateWithPricing[]> {
  try {
    await seedTemplatesIfEmpty();
    const rows = (await sql`
      SELECT id, slug, name, tagline, category, category_label,
             price_ngn, price_usd, monthly_ngn, setup_fee_ngn, outright_ngn,
             standard_monthly_ngn, standard_setup_fee_ngn, standard_outright_ngn,
             rating, reviews, badge, badge_color, image, description,
             stack, features, demo_url, updated_at
      FROM templates
      ORDER BY id ASC
    `) as any[];

    if (!rows || rows.length === 0) {
      return TEMPLATES.map((t) => ({ ...t, pricingOverride: false }));
    }

    return rows.map(rowToTemplate);
  } catch (error) {
    console.error('Error fetching templates from Neon DB, falling back to static TEMPLATES:', error);
    return TEMPLATES.map((t) => ({ ...t, pricingOverride: false }));
  }
}

/** Queries a single template directly from Neon DB by slug or id. */
export async function getTemplateFromDb(slugOrId: string): Promise<TemplateWithPricing | null> {
  const clean = String(slugOrId || '').trim();
  if (!clean) return null;

  try {
    await seedTemplatesIfEmpty();
    const rows = (await sql`
      SELECT id, slug, name, tagline, category, category_label,
             price_ngn, price_usd, monthly_ngn, setup_fee_ngn, outright_ngn,
             standard_monthly_ngn, standard_setup_fee_ngn, standard_outright_ngn,
             rating, reviews, badge, badge_color, image, description,
             stack, features, demo_url, updated_at
      FROM templates
      WHERE slug = ${clean} OR id = ${clean}
      LIMIT 1
    `) as any[];

    if (rows && rows.length > 0) {
      return rowToTemplate(rows[0]);
    }
  } catch (error) {
    console.error(`Error querying template ${clean} from DB:`, error);
  }

  // Fallback
  const fallback = TEMPLATES.find((t) => t.slug === clean || t.id === clean);
  return fallback ? { ...fallback, pricingOverride: false } : null;
}

/** Saves template pricing and details directly to Neon DB. */
export async function savePricingOverride(params: {
  slug: string;
  priceNgn?: number;
  setupFeeNgn?: number;
  monthlyNgn?: number;
  outrightNgn?: number;
  demoUrl?: string;
  name?: string;
  description?: string;
}): Promise<TemplatePricing> {
  const { slug } = params;
  if (!slug) throw new Error('slug is required');

  await seedTemplatesIfEmpty();
  const current = await getTemplateFromDb(slug);
  if (!current) throw new Error(`Unknown template slug: ${slug}`);

  const priceNgn = params.priceNgn !== undefined ? Math.round(Number(params.priceNgn)) : current.priceNgn;
  const outrightNgn = params.outrightNgn !== undefined ? Math.round(Number(params.outrightNgn)) : priceNgn;
  const setupFeeNgn = params.setupFeeNgn !== undefined ? Math.round(Number(params.setupFeeNgn)) : current.setupFeeNgn;
  const monthlyNgn = params.monthlyNgn !== undefined ? Math.round(Number(params.monthlyNgn)) : current.monthlyNgn;
  const demoUrl = params.demoUrl !== undefined ? String(params.demoUrl).trim() : current.demoUrl;
  const name = params.name !== undefined ? String(params.name).trim() : current.name;
  const description = params.description !== undefined ? String(params.description).trim() : current.description;

  // Update primary templates table
  await sql`
    UPDATE templates
    SET price_ngn = ${priceNgn},
        outright_ngn = ${outrightNgn},
        setup_fee_ngn = ${setupFeeNgn},
        monthly_ngn = ${monthlyNgn},
        demo_url = ${demoUrl || null},
        name = ${name},
        description = ${description},
        updated_at = NOW()
    WHERE slug = ${slug} OR id = ${slug}
  `;

  // Also sync to legacy template_pricing table
  await sql`
    INSERT INTO template_pricing (slug, price_ngn, setup_fee_ngn, monthly_ngn, updated_at)
    VALUES (${slug}, ${priceNgn}, ${setupFeeNgn}, ${monthlyNgn}, NOW())
    ON CONFLICT (slug) DO UPDATE
      SET price_ngn = EXCLUDED.price_ngn,
          setup_fee_ngn = EXCLUDED.setup_fee_ngn,
          monthly_ngn = EXCLUDED.monthly_ngn,
          updated_at = NOW()
  `;

  return {
    slug,
    priceNgn,
    setupFeeNgn,
    monthlyNgn,
    outrightNgn,
    demoUrl,
    updatedAt: new Date().toISOString(),
  };
}

export async function clearPricingOverride(slug: string): Promise<void> {
  const base = TEMPLATES.find((t) => t.slug === slug || t.id === slug);
  if (!base) throw new Error(`Unknown template slug: ${slug}`);

  await sql`
    UPDATE templates
    SET price_ngn = ${base.priceNgn},
        outright_ngn = ${base.outrightNgn || base.priceNgn},
        setup_fee_ngn = ${base.setupFeeNgn},
        monthly_ngn = ${base.monthlyNgn},
        demo_url = ${base.demoUrl || null},
        updated_at = NOW()
    WHERE slug = ${slug} OR id = ${slug}
  `;

  await sql`DELETE FROM template_pricing WHERE slug = ${slug}`;
}

export async function getPricingOverrides(): Promise<Record<string, TemplatePricing>> {
  const templates = await getTemplatesFromDb();
  const map: Record<string, TemplatePricing> = {};
  for (const t of templates) {
    map[t.slug] = {
      slug: t.slug,
      priceNgn: t.priceNgn,
      setupFeeNgn: t.setupFeeNgn,
      monthlyNgn: t.monthlyNgn,
      outrightNgn: t.outrightNgn,
      demoUrl: t.demoUrl,
    };
  }
  return map;
}

/** Calculates the authoritative amount due today: Setup fee for monthly, full price for outright. */
export function calculateAmountDue(
  template: { setupFeeNgn?: number; outrightNgn?: number; priceNgn?: number },
  planType: string
): number {
  const isMonthly = String(planType || '').toUpperCase() === 'MONTHLY';
  if (isMonthly) {
    return Number(template.setupFeeNgn ?? 15000);
  }
  return Number(template.outrightNgn ?? template.priceNgn ?? 50000);
}

/** Drop-in replacement aliases for existing callers. */
export const applyPricingOverrides = getTemplatesFromDb;
export const getTemplateWithPricing = getTemplateFromDb;
