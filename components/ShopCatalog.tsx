'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { TEMPLATES, CATEGORIES, Template } from '@/data/templates';
// Direct design onboarding without shopping cart

export default function ShopCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  // direct flow

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.some(c => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((tpl) => {
      const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
      const matchesSearch =
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.stack.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.priceNgn - b.priceNgn;
      if (sortBy === 'price-high') return b.priceNgn - a.priceNgn;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured (default order)
    });
  }, [activeCategory, searchQuery, sortBy]);

  const handleGetTemplate = (template: Template) => {
    router.push(`/product/${template.slug}`);
  };

  return (
    <div className="shop-catalog-container">
      {/* Filter Bar */}
      <div className="abfilter">
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

          <div className="abfilter-sort">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort templates"
            >
              <option value="featured">Featured order</option>
              <option value="rating">Highest rated</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>
        </div>

        <div className="abfilter-meta">
          <span>
            <strong>{filteredTemplates.length}</strong>{' '}
            {filteredTemplates.length === 1 ? 'design' : 'designs'}
            {activeCategory !== 'all' && (
              <> in <strong>{CATEGORIES.find((c) => c.id === activeCategory)?.label}</strong></>
            )}
            {searchQuery && (
              <> matching <strong>&ldquo;{searchQuery}&rdquo;</strong></>
            )}
          </span>
          {(activeCategory !== 'all' || searchQuery) && (
            <button
              type="button"
              className="abfilter-reset"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fafafa', borderRadius: '12px', margin: '20px 0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>No matching templates found</h3>
          <p style={{ color: '#777', fontSize: '14px', marginBottom: '16px' }}>Try clearing your search query or choosing another category.</p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            style={{
              padding: '8px 20px',
              background: '#111',
              color: '#fff',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px',
          marginBottom: '60px'
        }}>
          {filteredTemplates.map((template) => (
            <article
              key={template.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '1px solid #eee',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
              }}
            >
              {/* Image & Badges */}
              <div style={{ position: 'relative', width: '100%', paddingTop: '65%', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                <Link href={`/product/${template.slug}`}>
                  <img
                    src={template.image}
                    alt={template.name}
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Link>

                {/* Badge Top-Left */}
                {template.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: template.badgeColor || '#111',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '100px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {template.badge}
                  </span>
                )}

                {/* Category Pill Top-Right */}
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#222',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '100px',
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  {template.categoryLabel}
                </span>
              </div>

              {/* Content Body */}
              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Rating & Stack Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#F59E0B', fontSize: '13px' }}>★</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#222' }}>{template.rating}</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>({template.reviews})</span>
                  </div>

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {template.stack.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <Link
                  href={`/product/${template.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: '#111',
                    fontSize: '17px',
                    fontWeight: 700,
                    marginBottom: '6px',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.3'
                  }}
                >
                  {template.name}
                </Link>

                {/* Description */}
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.5',
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {template.description}
                </p>

                {/* Footer with Dual Launch Pricing and CTA */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '16px',
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                        ₦50,000
                      </span>
                      <span style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through' }}>
                        ₦100,000
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#047857', backgroundColor: '#ecfdf5', padding: '1px 6px', borderRadius: '4px' }}>
                        50% OFF
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '2px' }}>
                      or <strong>₦5k/mo</strong> + ₦15k setup
                    </div>
                  </div>

                  <Link
                    href={`/product/${template.slug}`}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#111827',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Order this design →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
