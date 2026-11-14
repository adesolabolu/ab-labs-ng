import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React, { Suspense } from 'react';
import Link from 'next/link';
import ShopCatalog from '@/components/ShopCatalog';
import StepsTileMarker from '@/components/StepsTileMarker';
import { applyPricingOverrides } from '@/lib/template-pricing';
import { pageMetadata } from '@/lib/site';

// Prices are editable from the admin portal, so refresh the cached page.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: 'Website Templates Catalog',
  description:
    'Browse ready-to-launch website templates crafted for Nigerian and African businesses. Pick your favorite design and we launch your custom website in less than 36 hours.',
  path: '/shop',
});

export default async function ShopPage() {
  const templates = await applyPricingOverrides();

  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        
        <div className="main-wrapper">
          <section className="section-breadcrumb">
            <div className="site-blockcontainer container-large site-container">
              <div className="page-heading-block align-center">
                <div className="page-title-block">
                  <h1 className="heading-style-h1">Website Templates for Your Business</h1>
                </div>
                <div className="hero-summary-wrapper max-width-460px">
                  <p className="hero-summary">
                    Pick a proven website design for your industry. We customize your logo, colors, text, and payments, then launch your site on your own domain in less than 36 hours.
                  </p>
                </div>

                <StepsTileMarker />


              </div>
            </div>
          </section>

          <section className="section-shop-catalog" style={{ padding: '40px 0 80px' }}>
            <div className="site-blockcontainer container-large site-container">
              <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px' }}>Loading templates...</div>}>
                <ShopCatalog templates={templates} />
              </Suspense>
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
