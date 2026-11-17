'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BLOG_CATEGORIES, type BlogPost } from '@/data/blogs';

interface LiveBlogSectionsProps {
  initialPosts: BlogPost[];
}

export default function LiveBlogSections({ initialPosts }: LiveBlogSectionsProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  useEffect(() => {
    let active = true;
    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const featured = posts[0];
  const listPosts = posts.slice(1);

  return (
    <>
      {featured && (
        <section className="secftion-blog-featured">
          <div className="site-blockcontainer container-large site-container">
            <div className="site-dyn-list">
              <div fade-in="true" role="list" className="site-dyn-items">
                <div role="listitem" className="bl-feat site-dyn-item">
                  <Link href={`/blog/${featured.slug}`} className="bl-feat-media inline-block">
                    <img
                      src={featured.image}
                      loading="eager"
                      decoding="async"
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
                    <p className="bl-feat-exc">{featured.excerpt}</p>
                    <div className="bl-feat-ft">
                      <div className="blog-autor-wrap">
                        <p className="bl-feat-meta">
                          {featured.date} · {featured.readTime}
                        </p>
                      </div>
                      <Link stagger-up-animate="" href={`/blog/${featured.slug}`} className="primary-button inline-block">
                        <div className="button-text-wrapper">
                          <div className="button-text-block">
                            <div className="link-text is-1">Read Guide</div>
                            <div className="link-text is-2">Read Guide</div>
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
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-blog-page">
        <div className="site-blockcontainer container-large site-container">
          <div className="bl-bar">
            <div fade-in="true" className="bl-pills">
              <a data-filter="all" href="#" className="bl-pill inline-block is-current">All</a>
              <div className="site-dyn-list">
                <div role="list" className="categories-flex site-dyn-items">
                  {BLOG_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <div key={cat.id} role="listitem" className="site-dyn-item">
                      <a data-filter={cat.id} href="#" className="bl-pill inline-block">{cat.label}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="site-dyn-list">
            <div fade-in="true" role="list" className="blog-wrappper site-dyn-items">
              {listPosts.map((post) => (
                <div key={post.id} role="listitem" className="site-dyn-item" data-category={post.categorySlug}>
                  <div className="blog-single-item-card">
                    <div className="bl-card-img">
                      <Link href={`/blog/${post.slug}`} className="blog-image-link inline-block">
                        <img
                          src={post.image}
                          loading="lazy"
                          decoding="async"
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
                      <p className="bl-card-exc">{post.excerpt}</p>
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
    </>
  );
}
