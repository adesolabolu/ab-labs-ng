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

export type PricingSortOption = 'default' | 'monthly-low' | 'monthly-high';

interface ShopCatalogProps {
  /** Catalog with any admin price overrides already applied. */
  templates: Template[];
}

export default function ShopCatalog({ templates }: ShopCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [liveTemplates, setLiveTemplates] = useState<Template[]>(templates);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pricingSort, setPricingSort] = useState<PricingSortOption>('default');

  useEffect(() => {
    let active = true;
    fetch('/api/templates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.success && Array.isArray(data.templates) && data.templates.length > 0) {
          setLiveTemplates(data.templates);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.some((c) => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const filteredTemplates = useMemo(() => {
    return liveTemplates
      .filter((tpl) => {
        const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
        const matchesSearch =
          tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tpl.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tpl.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const monthlyA = a.monthlyNgn || 5000;
        const monthlyB = b.monthlyNgn || 5000;
        if (pricingSort === 'monthly-low') return monthlyA - monthlyB;
        if (pricingSort === 'monthly-high') return monthlyB - monthlyA;
        return 0;
      });
  }, [liveTemplates, activeCategory, searchQuery, pricingSort]);

  const hasActiveFilters = activeCategory !== 'all' || searchQuery.trim() !== '' || pricingSort !== 'default';

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setPricingSort('default');
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
                data-umami-event="Shop - Selected Category"
                data-umami-event-category={cat.id}
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
            {/* Mobile-only Category Dropdown */}
            <div className="abfilter-category-mobile">
              <label htmlFor="category-mobile-select" className="sr-only">
                Filter templates by category
              </label>
              <select
                id="category-mobile-select"
                value={activeCategory}
                data-umami-event="Shop - Selected Category Mobile"
                onChange={(e) => setActiveCategory(e.target.value)}
                aria-label="Filter templates by category"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Single Monthly Pricing Filter (Low to High, High to Low) */}
            <div className="abfilter-sort">
              <label htmlFor="pricing-sort-select" className="sr-only">
                Pricing
              </label>
              <select
                id="pricing-sort-select"
                value={pricingSort}
                data-umami-event="Shop - Changed Pricing Sort"
                onChange={(e) => setPricingSort(e.target.value as PricingSortOption)}
                aria-label="Pricing"
              >
                <option value="default">Pricing</option>
                <option value="monthly-low">Low to High</option>
                <option value="monthly-high">High to Low</option>
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
            {pricingSort !== 'default' && (
              <> · <strong>{pricingSort === 'monthly-low' ? 'Low to High' : 'High to Low'}</strong></>
            )}
            {searchQuery && (
              <> matching <strong>&ldquo;{searchQuery}&rdquo;</strong></>
            )}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              className="abfilter-reset"
              data-umami-event="Shop - Reset Filters"
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
          <p style={{ color: '#78716c', fontSize: '14px', marginBottom: '16px' }}>Try clearing your search query or choosing another category.</p>
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
