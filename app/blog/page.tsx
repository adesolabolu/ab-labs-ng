import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import LiveBlogSections from '@/components/LiveBlogSections';
import React from 'react';
import { getBlogPostsFromDb } from '@/lib/blogs-db';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Guides & Tips to Grow Your Business Online',
  description:
    'Simple, practical guides on getting more customers, ranking on Google, collecting payments, and building a professional website for your brand.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getBlogPostsFromDb();

  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        <div className="main-wrapper">
          {/* Breadcrumb / Page Heading */}
          <section className="section-breadcrumb">
            <div className="site-blockcontainer container-large site-container">
              <div className="page-heading-block align-center">
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

          <LiveBlogSections initialPosts={posts} />
          <CallToAction />
        </div>
        <Footer />
      </div>
      <link rel="stylesheet" href="https://unpkg.com/lenis@1.3.1/dist/lenis.css" />
    </>
  );
}
