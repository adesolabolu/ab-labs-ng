'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CATEGORIES, Template } from '@/data/templates';
import TemplateCard from '@/components/TemplateCard';

/** Compact money label for tight card footers (₦5k, ₦15k, ₦35,500). */
function formatShortNgn(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '₦0';
  if (value >= 1000 && value % 1000 === 0) return `₦${value / 1000}k`;
  return `₦${value.toLocaleString()}`;
}

export const PRICE_RANGES = [
  { id: 'all', label: 'All Budgets', min: 0, max: Infinity },
  { id: 'under-75k', label: 'Under ₦75,000', min: 0, max: 75000 },
  { id: '75k-150k', label: '₦75,000 – ₦150,000', min: 75000, max: 150000 },
  { id: '150k-plus', label: 'Above ₦150,000', min: 150000, max: Infinity },
] as const;

export type PriceRangeId = (typeof PRICE_RANGES)[number]['id'];
export type SortOption = 'featured' | 'price-low' | 'price-high' | 'monthly-low';

interface ShopCatalogProps {
  /** Catalog with any admin price overrides already applied. */
  templates: Template[];
}

export default function ShopCatalog({ templates }: ShopCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<PriceRangeId>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.some((c) => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const filteredTemplates = useMemo(() => {
    const selectedRange = PRICE_RANGES.find((r) => r.id === priceRange) || PRICE_RANGES[0];

    return templates
      .filter((tpl) => {
        const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
        const effectivePrice = tpl.outrightNgn || tpl.priceNgn || 0;
        const matchesPrice = effectivePrice >= selectedRange.min && effectivePrice <= selectedRange.max;
        const matchesSearch =
          tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tpl.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tpl.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        const priceA = a.outrightNgn || a.priceNgn || 0;
        const priceB = b.outrightNgn || b.priceNgn || 0;
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'monthly-low') return (a.monthlyNgn || 5000) - (b.monthlyNgn || 5000);
        return 0; // featured default order
      });
  }, [templates, activeCategory, searchQuery, priceRange, sortBy]);

  const hasActiveFilters = activeCategory !== 'all' || searchQuery.trim() !== '' || priceRange !== 'all' || sortBy !== 'featured';

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setPriceRange('all');
    setSortBy('featured');
  };

  return (
    <div className="shop-catalog-container">
      {/* Filter & Search Bar */}
      <div className="abfilter">
        {/* Horizontal Category Pill Track */}
        <div className="abfilter-pills" role="group" aria-label="Filter templates by industry">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`abfilter-pill${isActive ? ' is-active' : ''}`}
              >
                <span>{cat.label}</span>
                <span className="abfilter-count">{cat.count}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Controls Row */}
        <div className="abfilter-controls">
          <div className="abfilter-search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="20" y1="20" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, industry or stack"
              aria-label="Search templates"
            />
            {searchQuery && (
              <button
                type="button"
                className="abfilter-clear-input"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="abfilter-select-group">
            {/* Price Range Filter ("This to that") */}
            <div className="abfilter-price-filter">
              <label htmlFor="price-range-select" className="sr-only">
                Filter by price range
              </label>
              <select
                id="price-range-select"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as PriceRangeId)}
                aria-label="Filter templates by budget"
              >
                {PRICE_RANGES.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Sorting (Low to High, High to Low) */}
            <div className="abfilter-sort">
              <label htmlFor="sort-by-select" className="sr-only">
                Sort templates
              </label>
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort templates"
              >
                <option value="featured">Featured order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="monthly-low">Monthly Plan: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Meta & Active Reset */}
        <div className="abfilter-meta">
          <span>
            <strong>{filteredTemplates.length}</strong>{' '}
            {filteredTemplates.length === 1 ? 'design' : 'designs'}
            {activeCategory !== 'all' && (
              <> in <strong>{CATEGORIES.find((c) => c.id === activeCategory)?.label}</strong></>
            )}
            {priceRange !== 'all' && (
              <> · <strong>{PRICE_RANGES.find((r) => r.id === priceRange)?.label}</strong></>
            )}
            {searchQuery && (
              <> matching <strong>&ldquo;{searchQuery}&rdquo;</strong></>
            )}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              className="abfilter-reset"
              onClick={handleResetFilters}
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fafafa', borderRadius: '16px', margin: '20px 0', border: '1px solid #eaeaea' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1c1917', marginBottom: '8px' }}>No matching templates found</h3>
          <p style={{ color: '#78716c', fontSize: '14px', marginBottom: '16px' }}>Try clearing your search query or choosing another budget/category.</p>
          <button
            onClick={handleResetFilters}
            style={{
              padding: '10px 22px',
              background: '#1c1917',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="shop-catalog-grid">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} ctaText="Order this design" />
          ))}
        </div>
      )}
    </div>
  );
}
