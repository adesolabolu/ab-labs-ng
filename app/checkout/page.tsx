import React, { Suspense } from 'react';
import { applyPricingOverrides } from '@/lib/template-pricing';
import CheckoutClient from './CheckoutClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Secure Launch Checkout | aB Labs',
  description: 'Complete your website foundation deployment. Seamless payment and instant client portal provisioning.',
};

export default async function CheckoutPage() {
  const templates = await applyPricingOverrides();

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', backgroundColor: '#faf8f5' }}>
      <Navbar />

      <main style={{ maxWidth: '1160px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <Suspense
          fallback={
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#78716c', fontSize: '14px' }}>Loading launch checkout...</p>
            </div>
          }
        >
          <CheckoutClient initialTemplates={templates} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
