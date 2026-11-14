import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';
import Link from 'next/link';
import CartView from '@/components/CartView';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Your Cart & Checkout',
  description: 'Review your selected website templates and checkout securely with Paystack.',
  path: '/cart',
  noIndex: true,
});

export default function CartPage() {
  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        
        <div className="main-wrapper">
          <section className="section-breadcrumb">
            <div className="site-blockcontainer container-large site-container">
              <div className="page-heading-block align-center">
                <div className="page-title-block">
                  <h1 className="heading-style-h1">Your Flagship Cart</h1>
                </div>
                <div className="hero-summary-wrapper max-width-460px">
                  <p className="hero-summary">
                    Review your selected production-ready website templates. Every build includes full website ownership, bespoke brand styling, custom domain connection, and dedicated launch support.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <CartView />
        </div>

        <Footer />
      </div>
    </>
  );
}
