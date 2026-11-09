'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost, BLOG_POSTS } from '@/data/blogs';
import Navbar from '@/components/Navbar';

interface BlogPostViewProps {
  post: BlogPost;
}

export default function BlogPostView({ post }: BlogPostViewProps) {
  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <Navbar />

      {/* Main Reading View */}
      <div className="main-wrapper">
        {/* Breadcrumb */}
        <div style={{ maxWidth: '860px', margin: '24px auto 0', padding: '0 20px', fontSize: '13px', color: '#71717a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{ color: '#71717a', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/blog" style={{ color: '#71717a', textDecoration: 'none' }}>Insights</Link>
            <span>/</span>
            <span style={{ color: '#09090b', fontWeight: 600 }}>{post.category}</span>
          </div>
        </div>

        {/* Article Header */}
        <article style={{ maxWidth: '860px', margin: '32px auto 80px', padding: '0 20px' }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#2563EB',
                backgroundColor: '#eff6ff',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                {post.category}
              </span>
              <span style={{ fontSize: '13px', color: '#a1a1aa' }}>•</span>
              <span style={{ fontSize: '13px', color: '#71717a' }}>{post.readTime}</span>
            </div>

            <h1 style={{
              fontSize: '36px',
              fontWeight: 800,
              color: '#09090b',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
              margin: '0 0 16px'
            }}>
              {post.title}
            </h1>

            <p style={{
              fontSize: '18px',
              color: '#52525b',
              lineHeight: '1.5',
              margin: '0 0 24px'
            }}>
              {post.subtitle}
            </p>

            {/* Author Byline */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              paddingTop: '20px',
              borderTop: '1px solid #f4f4f5'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#18181b',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {post.author.initials}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#18181b' }}>
                  {post.author.name}
                </div>
                <div style={{ fontSize: '12px', color: '#71717a' }}>
                  {post.author.role} · Published {post.date}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '40px',
            backgroundColor: '#18181b',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
          }}>
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: '100%',
                maxHeight: '480px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>

          {/* Lead Paragraph */}
          <div style={{
            padding: '24px 28px',
            backgroundColor: '#fafafa',
            borderRadius: '12px',
            borderLeft: '4px solid #18181b',
            fontSize: '17px',
            lineHeight: '1.7',
            color: '#27272a',
            marginBottom: '36px',
            fontWeight: 500
          }}>
            {post.content.lead}
          </div>

          {/* Article Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {post.content.sections.map((section, idx) => (
              <div key={idx}>
                <h2 style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#09090b',
                  letterSpacing: '-0.01em',
                  margin: '0 0 16px',
                  lineHeight: '1.35'
                }}>
                  {section.heading}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', color: '#3f3f46', lineHeight: '1.75' }}>
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} style={{ margin: 0 }}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Key Takeaway Box */}
                {section.keyTakeaway && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px 20px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '10px',
                    border: '1px solid #bfdbfe',
                    fontSize: '13px',
                    color: '#1e40af',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    lineHeight: '1.6'
                  }}>
                    <span style={{ fontSize: '16px' }}>💡</span>
                    <div>
                      <strong>Key Architectural Rule:</strong> {section.keyTakeaway}
                    </div>
                  </div>
                )}

                {/* Metric Callout Card */}
                {section.codeOrMetric && (
                  <div style={{
                    marginTop: '20px',
                    padding: '20px 24px',
                    backgroundColor: '#18181b',
                    borderRadius: '12px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#60A5FA' }}>
                        {section.codeOrMetric.label}
                      </span>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#d4d4d8', lineHeight: '1.5' }}>
                        {section.codeOrMetric.description}
                      </p>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#38BDF8', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                      {section.codeOrMetric.value}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div style={{
            marginTop: '56px',
            padding: '36px',
            background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
            borderRadius: '16px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'center',
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#60A5FA' }}>
              Production-Tested Web Engineering
            </span>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#fff', maxWidth: '540px' }}>
              Ready to Upgrade to a High-Converting Digital Flagship?
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa', maxWidth: '520px', lineHeight: '1.6' }}>
              Skip 6-month agency builds. Every aB Labs template is production-ready, mobile-first, and customized and deployed turnkey for your business.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link
                href="/shop"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#fff',
                  color: '#09090b',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
              >
                Browse All Templates →
              </Link>
              <Link
                href="/contact-us"
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Custom Engineering Inquiry
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <div style={{ marginTop: '64px', paddingTop: '40px', borderTop: '1px solid #e4e4e7' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', margin: '0 0 24px' }}>
              Related Playbooks &amp; Insights
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px'
            }}>
              {relatedPosts.map(rel => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #e4e4e7',
                    backgroundColor: '#fff',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <div style={{ height: '140px', overflow: 'hidden', backgroundColor: '#18181b' }}>
                    <img
                      src={rel.image}
                      alt={rel.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#2563EB', marginBottom: '6px' }}>
                      {rel.category}
                    </span>
                    <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 700, color: '#18181b', lineHeight: '1.4' }}>
                      {rel.title}
                    </h4>
                    <span style={{ fontSize: '11px', color: '#71717a', marginTop: 'auto' }}>
                      {rel.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* Footer */}
      <section className="footer">
        <div className="w-layout-blockcontainer container-large w-container">
          <div className="fh-in">
            <div className="fh-main">
              <div className="fh-brand">
                <Link href="/" className="fh-logo w-inline-block">
                  <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="footer-logo" />
                </Link>
                <p className="fh-statement">
                  Production-ready website designs and bespoke web engineering built for ambitious Nigerian and African businesses.
                </p>
              </div>
              <div className="fh-col">
                <p className="fh-col-h">Templates</p>
                <Link href="/shop" className="fh-lk">All Templates</Link>
                <Link href="/shop?category=ecommerce" className="fh-lk">E-Commerce</Link>
                <Link href="/shop?category=real-estate" className="fh-lk">Real Estate</Link>
                <Link href="/shop?category=corporate" className="fh-lk">Corporate</Link>
                <Link href="/shop?category=saas" className="fh-lk">Tech &amp; SaaS</Link>
              </div>
              <div className="fh-col">
                <p className="fh-col-h">Company</p>
                <Link href="/" className="fh-lk">Home</Link>
                <Link href="/about-us" className="fh-lk">About Us</Link>
                <Link href="/contact-us" className="fh-lk">Contact Us</Link>
                <Link href="/blog" className="fh-lk">Insights</Link>
                <Link href="/cart" className="fh-lk">Your Cart</Link>
              </div>
            </div>
            <div className="footer-border v2"></div>
            <div className="footer-border"></div>
          </div>
          <div className="fh-bot">
            <div className="fh-bot-in">
              <p className="fh-copy">© 2026 aB Labs — Production-Ready Web Flagships</p>
              <a href="#top" className="fh-top-top w-inline-block">
                <div>Back to top</div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
