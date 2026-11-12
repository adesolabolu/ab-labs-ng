import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import { BLOG_POSTS, BLOG_CATEGORIES, type BlogPost } from '@/data/blogs';

const categoryLabel = (slug: BlogPost['categorySlug']) =>
  BLOG_CATEGORIES.find((c) => c.id === slug)?.label ?? 'Guides';

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <div role="listitem" className="site-dyn-item">
      <div className="blog-single-item-card">
        <div className="bl-card-img">
          <Link href={`/blog/${post.slug}`} className="blog-image-link inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <Link aria-label={post.title} href={`/blog/${post.slug}`} className="bl-card-ttl">
            {post.title}
          </Link>
          <p className="bl-card-exc">{post.subtitle}</p>
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
  );
}

export default function BlogArticle({ post }: { post: BlogPost }) {
  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.categorySlug === post.categorySlug
  );
  const fillers = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.categorySlug !== post.categorySlug
  );
  const relatedPosts = [...related, ...fillers].slice(0, 3);

  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        <div className="main-wrapper">
          <section className="section-breadcrumb">
            <div className="site-blockcontainer container-large site-container">
              <div className="page-heading-block align-center">
                <div className="hero-subtitle-block">
                  <div className="subtitle-dot"></div>
                  <div>{post.category}</div>
                </div>
                <div className="page-title-block max-width-800px">
                  <h1 className="heading-style-h1">{post.title}</h1>
                </div>
                <p className="bl-article-subtitle">{post.subtitle}</p>

                <div className="bl-article-meta">
                  <div className="bl-article-author">
                    <span className="bl-article-avatar" aria-hidden="true">
                      {post.author.initials}
                    </span>
                    <span className="bl-article-author-txt">
                      <strong>{post.author.name}</strong>
                      <span>{post.author.role}</span>
                    </span>
                  </div>
                  <div className="blog-meta-wrapper">
                    <p className="bl-card-meta">{post.date}</p>
                    <div className="blog-meta-dot"></div>
                    <p className="bl-card-meta">{post.readTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section-blog-details">
            <div className="site-blockcontainer container-large site-container">
              <div className="blog-main-image-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  loading="eager"
                  alt={post.title}
                  sizes="100vw"
                  className="blog-main-image"
                />
              </div>

              <div className="blog-details-content-block">
                <div fade-in="true" className="blog-details-content site-richtext">
                  <p className="bl-article-lead">{post.content.lead}</p>

                  {post.content.sections.map((section, index) => (
                    <React.Fragment key={section.heading}>
                      <h2 id={`section-${index + 1}`}>{section.heading}</h2>
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                      ))}

                      {section.keyTakeaway && (
                        <div className="bl-article-takeaway">
                          <span className="bl-article-takeaway-label">Key takeaway</span>
                          <p>{section.keyTakeaway}</p>
                        </div>
                      )}

                      {section.codeOrMetric && (
                        <div className="bl-article-metric">
                          <span className="bl-article-metric-label">
                            {section.codeOrMetric.label}
                          </span>
                          <span className="bl-article-metric-value">
                            {section.codeOrMetric.value}
                          </span>
                          <span className="bl-article-metric-desc">
                            {section.codeOrMetric.description}
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="bl-article-authorbox">
                  <span className="bl-article-avatar is-large" aria-hidden="true">
                    {post.author.initials}
                  </span>
                  <div>
                    <p className="bl-article-authorbox-name">{post.author.name}</p>
                    <p className="bl-article-authorbox-role">{post.author.role}</p>
                    <p className="bl-article-authorbox-note">
                      Written by the aB Labs team - we build fast, high-converting websites for
                      Nigerian and African businesses.
                    </p>
                  </div>
                </div>

                <div fade-in="true" className="blog-button-wrapper">
                  <Link href="/blog" className="primary-button inline-block">
                    <div className="button-text-wrapper">
                      <div className="button-text-block">
                        <div className="link-text is-1">All articles</div>
                        <div className="link-text is-2">All articles</div>
                      </div>
                      <div className="button-arrow-block">
                        <div className="link-icon is-1 site-embed">
                          <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                            <path d="M7 17 17 7M7 7h10v10"></path>
                          </svg>
                        </div>
                        <div className="link-icon is-2 site-embed">
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
          </section>

          <section className="section-blog-details-page">
            <div className="site-blockcontainer container-large site-container">
              <div className="section-heading-flex">
                <div className="section-heading-block">
                  <div className="hero-subtitle-block">
                    <div className="subtitle-dot"></div>
                    <div>Related Articles</div>
                  </div>
                  <div className="section-title-block">
                    <h2 className="heading-style-h2">You might also like</h2>
                  </div>
                </div>
                <div className="section-button-block">
                  <Link href={`/blog?category=${post.categorySlug}`} className="primary-button inline-block">
                    <div className="button-text-wrapper">
                      <div className="button-text-block">
                        <div className="link-text is-1">More on {categoryLabel(post.categorySlug)}</div>
                        <div className="link-text is-2">More on {categoryLabel(post.categorySlug)}</div>
                      </div>
                      <div className="button-arrow-block">
                        <div className="link-icon is-1 site-embed">
                          <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                            <path d="M7 17 17 7M7 7h10v10"></path>
                          </svg>
                        </div>
                        <div className="link-icon is-2 site-embed">
                          <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                            <path d="M7 17 17 7M7 7h10v10"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="site-dyn-list">
                <div fade-in="true" role="list" className="blog-content-wrappper site-dyn-items">
                  {relatedPosts.map((p) => (
                    <RelatedCard key={p.slug} post={p} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <CallToAction />
        <Footer />
      </div>
      <link rel="stylesheet" href="https://unpkg.com/lenis@1.3.1/dist/lenis.css" />
    </>
  );
}
