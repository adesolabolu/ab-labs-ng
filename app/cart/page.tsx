import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';
import Link from 'next/link';
import CartView from '@/components/CartView';

export const metadata = {
  title: 'Your Cart & Checkout | aB Labs',
  description: 'Review your selected website templates and checkout securely with Paystack.',
};

export default function CartPage() {
  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        
        <div className="main-wrapper">
          <section className="section-breadcrumb">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="page-heading-block align-center">
                <div className="hero-subtitle-block">
                  <div className="subtitle-dot"></div>
                  <div>02 - Review &amp; Checkout</div>
                </div>
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
