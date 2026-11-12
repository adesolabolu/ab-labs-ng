import Footer from '@/components/Footer';
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The requested template or page could not be found. Browse our catalog of production-ready website designs.',
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <>
      <div className="page-wrapper">
        <Navbar />

        <main className="main-wrapper">
          <section className="section-404">
            <div className="site-blockcontainer container-large site-container">
              <div className="content-block-404">
                <h1 className="text-404">4<span className="span-404">0</span>4</h1>
                <div className="inner-content-block-404">
                  <h2 className="utility-title">Page or Template Not Found</h2>
                  <p className="excerpt-404">
                    The page or template you are looking for may have been moved, renamed, or is currently unavailable. Explore our full template catalog or return to the home page.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
                    <Link href="/shop" className="primary-button inline-block">
                      <div className="button-text-wrapper">
                        <div className="button-text-block">
                          <div className="link-text is-1">Explore Templates</div>
                          <div className="link-text is-2">Explore Templates</div>
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
                    <Link href="/" className="primary-button site-variant-247f4bce-739b-3294-dc6c-b061c876c17e inline-block">
                      <div className="button-text-wrapper">
                        <div className="button-text-block">
                          <div className="link-text is-1">Back To Home</div>
                          <div className="link-text is-2">Back To Home</div>
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
          </section>
        </main>

        <Footer />
      </div>
      <link rel="stylesheet" href="https://unpkg.com/lenis@1.3.1/dist/lenis.css" />
    </>
  );
}
