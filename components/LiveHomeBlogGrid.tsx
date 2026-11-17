'use client';

import React, { useEffect, useState } from 'react';
import type { BlogPost } from '@/data/blogs';

interface LiveHomeBlogGridProps {
  initialBlogs: BlogPost[];
}

export default function LiveHomeBlogGrid({ initialBlogs }: LiveHomeBlogGridProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);

  useEffect(() => {
    let active = true;
    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setBlogs(data.posts.slice(0, 4));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const featuredBlog = blogs[0];
  const recentBlogs = blogs.slice(1, 4);

  if (!featuredBlog) return null;

  return (
    <div className="blog-grid">
      <div className="blog-featured-wrapper site-dyn-list">
        <div role="list" className="blog-featured-block site-dyn-items">
          <div role="listitem" className="blog-collection site-dyn-item">
            <div fade-in="true" className="bfeat">
              <a aria-label="blog" href={`/blog/${featuredBlog.slug}`} className="featured-image-link inline-block">
                <img src={featuredBlog.image} loading="lazy" decoding="async" alt={featuredBlog.title} className="bfeat-img" />
                <div className="featured-overlay"></div>
              </a>
              <div className="bfeat-body">
                <a aria-label="link" href="/blog" className="bcat">{featuredBlog.category}</a>
                <a aria-label="link" href={`/blog/${featuredBlog.slug}`} className="bfeat-ttl">{featuredBlog.title}</a>
                <p className="bfeat-exc">{featuredBlog.excerpt}</p>
                <div className="bfeat-ft">
                  <div className="blog-autor-wrap">
                    <p className="bl-feat-meta" style={{ color: '#ffffff', opacity: 0.95 }}>
                      {featuredBlog.date} · {featuredBlog.readTime}
                    </p>
                  </div>
                  <a aria-label="link" href={`/blog/${featuredBlog.slug}`} className="bread inline-block">
                    <div className="arrow-icon site-embed">
                      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                        <path d="M7 17 17 7M7 7h10v10"></path>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="site-dyn-list">
        <div fade-in="true" role="list" className="blist site-dyn-items">
          {recentBlogs.map((post) => (
            <div key={post.id} role="listitem" className="site-dyn-item">
              <div className="bcard">
                <a aria-label="blog post" href={`/blog/${post.slug}`} className="bcard-img inline-block">
                  <img src={post.image} loading="lazy" decoding="async" alt={post.title} className="bcard-img-img" />
                </a>
                <div className="bcard-body">
                  <a aria-label="link" href="/blog" className="bcard-cat">{post.category}</a>
                  <a aria-label="link" href={`/blog/${post.slug}`} className="bcard-ttl">{post.title}</a>
                  <div className="bcard-meta">
                    <div>{post.date}</div>
                    <div className="blog-meta-dot"></div>
                    <div>{post.readTime}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
