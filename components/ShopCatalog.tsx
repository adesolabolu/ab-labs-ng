'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { TEMPLATES, CATEGORIES, Template } from '@/data/templates';
import { useCart } from '@/context/CartContext';

export default function ShopCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const { addItem } = useCart();

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
    addItem(template);
    router.push('/cart');
  };

  return (
    <div className="shop-catalog-container">
      {/* Search and Sort Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Category Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center'
        }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  border: isActive ? '1px solid #111' : '1px solid #e5e5e5',
                  backgroundColor: isActive ? '#111' : '#fff',
                  color: isActive ? '#fff' : '#444',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 14px 8px 34px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '13px',
                outline: 'none',
                background: '#fff'
              }}
            />
            <svg
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  fontSize: '14px'
                }}
              >
                ×
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '13px',
              backgroundColor: '#fff',
              color: '#333',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="featured">Sort: Featured</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Header Count */}
      <div style={{ marginBottom: '20px', fontSize: '13px', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
        <span>Showing <strong>{filteredTemplates.length}</strong> {filteredTemplates.length === 1 ? 'template' : 'templates'}</span>
        {activeCategory !== 'all' && (
          <button
            onClick={() => setActiveCategory('all')}
            style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
          >
            Clear category filter
          </button>
        )}
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

                {/* Footer with Price and CTA */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '16px',
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>
                      ₦{template.priceNgn.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888' }}>
                      ≈ ${template.priceUsd} USD
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/product/${template.slug}`}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#0f172a',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Preview ↗
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleGetTemplate(template)}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#111',
                        border: '1px solid #111',
                        color: '#fff',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      Get Template
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
