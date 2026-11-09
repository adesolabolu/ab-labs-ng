'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BLOG_POSTS, BLOG_CATEGORIES, BlogPost } from '@/data/blogs';

export default function BlogCatalog() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = activeCategory === 'all' || post.categorySlug === activeCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div className="blog-catalog-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 80px' }}>
      {/* Category Pills & Search */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        margin: '32px 0 40px'
      }}>
        {/* Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {BLOG_CATEGORIES.map((cat) => {
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
                  border: isActive ? '1px solid #09090b' : '1px solid #e4e4e7',
                  backgroundColor: isActive ? '#09090b' : '#fff',
                  color: isActive ? '#fff' : '#52525b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search articles &amp; playbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 38px',
              borderRadius: '100px',
              border: '1px solid #e4e4e7',
              backgroundColor: '#fff',
              fontSize: '13px',
              color: '#18181b',
              outline: 'none'
            }}
          />
          <svg
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa' }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#71717a' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#18181b', marginBottom: '8px' }}>
            No articles found
          </h3>
          <p style={{ fontSize: '14px' }}>
            Try adjusting your search query or select another category filter.
          </p>
        </div>
      ) : (
        <>
          {/* Featured Article Banner */}
          {featuredPost && (
            <div style={{
              marginBottom: '48px',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#fff',
              border: '1px solid #e4e4e7',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'stretch'
            }}>
              <Link
                href={`/blog-post/${featuredPost.slug}`}
                style={{
                  display: 'block',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '280px',
                  backgroundColor: '#09090b'
                }}
              >
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: '#09090b',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Featured Playbook
                </div>
              </Link>

              <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#2563EB',
                    backgroundColor: '#eff6ff',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    {featuredPost.category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#a1a1aa' }}>•</span>
                  <span style={{ fontSize: '12px', color: '#71717a' }}>{featuredPost.readTime}</span>
                </div>

                <Link href={`/blog-post/${featuredPost.slug}`} style={{ textDecoration: 'none' }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#09090b',
                    margin: '0 0 12px',
                    lineHeight: '1.3',
                    letterSpacing: '-0.02em'
                  }}>
                    {featuredPost.title}
                  </h2>
                </Link>

                <p style={{ fontSize: '14px', color: '#52525b', lineHeight: '1.6', margin: '0 0 20px' }}>
                  {featuredPost.excerpt}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid #f4f4f5'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#18181b',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {featuredPost.author.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#18181b' }}>
                        {featuredPost.author.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a' }}>
                        {featuredPost.date}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/blog-post/${featuredPost.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#09090b',
                      textDecoration: 'none'
                    }}
                  >
                    Read Article →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Remaining Articles */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {gridPosts.map((post) => (
              <article
                key={post.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid #e4e4e7',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Thumbnail */}
                <Link
                  href={`/blog-post/${post.slug}`}
                  style={{
                    display: 'block',
                    position: 'relative',
                    height: '200px',
                    overflow: 'hidden',
                    backgroundColor: '#18181b'
                  }}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(9, 9, 11, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {post.category}
                  </span>
                </Link>

                {/* Body */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#71717a', marginBottom: '8px' }}>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <Link href={`/blog-post/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: '#09090b',
                      margin: '0 0 8px',
                      lineHeight: '1.4'
                    }}>
                      {post.title}
                    </h3>
                  </Link>

                  <p style={{
                    fontSize: '13px',
                    color: '#52525b',
                    lineHeight: '1.6',
                    margin: '0 0 16px',
                    flexGrow: 1
                  }}>
                    {post.excerpt}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid #f4f4f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#f4f4f5',
                        border: '1px solid #e4e4e7',
                        color: '#18181b',
                        fontSize: '10px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {post.author.initials}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#3f3f46' }}>
                        {post.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blog-post/${post.slug}`}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#2563EB',
                        textDecoration: 'none'
                      }}
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
