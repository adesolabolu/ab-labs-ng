import React, { Suspense } from 'react';
import { applyPricingOverrides } from '@/lib/template-pricing';
import CheckoutClient from './CheckoutClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Secure Launch Checkout | aB Labs',
  description: 'Complete your website foundation deployment. Seamless payment and instant client portal provisioning.',
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; plan?: string }>;
}) {
  const { template: templateSlugParam, plan: planParam } = await searchParams;

  // Single source of truth: fetch all templates with real database price overrides
  const templates = await applyPricingOverrides();
  const slug = templateSlugParam || 'lumina-lighting-lamps';
  const matchedTemplate =
    templates.find((t) => t.slug === slug || t.id === slug) || templates[0];

  const initialPlan =
    planParam?.toLowerCase() === 'outright' ? 'outright' : 'monthly';

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
          <CheckoutClient
            initialTemplate={matchedTemplate}
            initialPlan={initialPlan}
          />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
