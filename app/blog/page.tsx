import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';
import Link from 'next/link';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/data/blogs';

export const metadata = {
  title: 'Guides & Tips to Grow Your Business Online | aB Labs',
  description: 'Simple, practical guides on getting more customers, ranking on Google, collecting payments, and building a professional website for your brand.',
};

export default function BlogPage() {
  const featured = BLOG_POSTS[0];
  const listPosts = BLOG_POSTS.slice(1);

  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        <div className="main-wrapper">
          {/* Breadcrumb / Page Heading */}
          <section className="section-breadcrumb">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="page-heading-block align-center">
                <div className="hero-subtitle-block">
                  <div className="subtitle-dot"></div>
                  <div>08 - Practical Guides</div>
                </div>
                <div className="page-title-block">
                  <h1 className="heading-style-h1">Simple Guides to Grow Your Business Online</h1>
                </div>
                <div className="hero-summary-wrapper max-width-460px">
                  <p className="hero-summary">
                    Easy-to-follow tips on getting more customers, ranking on Google, collecting payments, and building a trusted website for your brand.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Guide */}
          <section className="secftion-blog-featured">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="w-dyn-list">
                <div fade-in="true" role="list" className="w-dyn-items">
                  <div role="listitem" className="bl-feat w-dyn-item">
                    <Link href={`/blog/${featured.slug}`} className="bl-feat-media w-inline-block">
                      <img
                        src={featured.image}
                        loading="eager"
                        alt={featured.title}
                        sizes="(max-width: 767px) 100vw, (max-width: 991px) 727px, 939px"
                        className="bl-feat-media-img"
                      />
                      <div className="bl-feat-badge">
                        <div className="dot-4"></div>
                        <div>&nbsp;Featured Guide</div>
                      </div>
                    </Link>
                    <div className="bl-feat-content">
                      <Link aria-label="link" href={`/blog?category=${featured.categorySlug}`} className="bl-feat-cat">
                        {featured.category}
                      </Link>
                      <Link aria-label="link" href={`/blog/${featured.slug}`} className="bl-feat-ttl">
                        {featured.title}
                      </Link>
                      <p className="bl-feat-exc">
                        {featured.excerpt}
                      </p>
                      <div className="bl-feat-ft">
                        <div className="blog-autor-wrap">
                          <p className="bl-feat-meta">{featured.date} · {featured.readTime}</p>
                        </div>
                        <Link stagger-up-animate="" href={`/blog/${featured.slug}`} className="primary-button w-inline-block">
                          <div className="button-text-wrapper">
                            <div className="button-text-block">
                              <div className="link-text is-1">Read Guide</div>
                              <div className="link-text is-2">Read Guide</div>
                            </div>
                            <div className="button-arrow-block">
                              <div className="link-icon is-1 w-embed">
                                <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                  <path d="M7 17 17 7M7 7h10v10"></path>
                                </svg>
                              </div>
                              <div className="link-icon is-2 w-embed">
                                <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                  <path d="M7 17 17 7M7 7h10v10"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Filter Bar & All Articles Grid */}
          <section className="section-blog-page">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="bl-bar">
                <div fade-in="true" className="bl-pills">
                  <a data-filter="all" href="#" className="bl-pill w-inline-block w--current">All</a>
                  <div className="w-dyn-list">
                    <div role="list" className="categories-flex w-dyn-items">
                      {BLOG_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                        <div key={cat.id} role="listitem" className="w-dyn-item">
                          <a data-filter={cat.id} href="#" className="bl-pill w-inline-block">{cat.label}</a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-dyn-list">
                <div fade-in="true" role="list" className="blog-wrappper w-dyn-items">
                  {listPosts.map((post) => (
                    <div key={post.id} role="listitem" className="w-dyn-item" data-category={post.categorySlug}>
                      <div className="blog-single-item-card">
                        <div className="bl-card-img">
                          <Link href={`/blog/${post.slug}`} className="blog-image-link w-inline-block">
                            <img
                              src={post.image}
                              loading="lazy"
                              alt={post.title}
                              className="bl-card-img-img"
                            />
                          </Link>
                          <span className="bl-card-cat">{post.category}</span>
                        </div>
                        <div className="bl-card-body">
                          <Link aria-label="link" href={`/blog/${post.slug}`} className="bl-card-ttl">
                            {post.title}
                          </Link>
                          <p className="bl-card-exc">
                            {post.excerpt}
                          </p>
                          <div className="bl-card-ft">
                            <div className="blog-meta-wrapper">
                              <p className="bl-card-meta">{post.date}</p>
                              <div className="blog-meta-dot"></div>
                              <p className="bl-card-meta">{post.readTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        <CallToAction />
        </div>
        <Footer />
      </div>
      <link rel="stylesheet" href="https://unpkg.com/lenis@1.3.1/dist/lenis.css" />
    </>
  );
}
