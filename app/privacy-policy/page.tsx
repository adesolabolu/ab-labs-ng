import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Privacy Policy | aB Labs',
  description:
    'Learn how aB Labs collects, protects, and uses client data, brand assets, and payment information in accordance with NDPA standards.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', backgroundColor: '#faf8f5' }}>
      <Navbar />

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 24px 100px' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#78716c',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
          >
            <span>&larr;</span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Block */}
        <header style={{ marginBottom: '40px', borderBottom: '1px solid #e7e5e4', paddingBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '100px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              marginBottom: '14px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Data Protection &amp; Confidentiality
            </span>
          </div>

          <h1
            style={{
              fontSize: '36px',
              fontWeight: 800,
              color: '#1c1917',
              letterSpacing: '-0.03em',
              margin: '0 0 12px',
              lineHeight: 1.2,
            }}
          >
            Privacy Policy
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#78716c' }}>
            <span>Last Updated: November 2026</span>
            <span>&bull;</span>
            <span>Version 2.4</span>
            <span>&bull;</span>
            <span>Effective immediately upon order initiation</span>
          </div>
        </header>

        {/* Key Summary Callout */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(12, 11, 10, 0.08)',
            boxShadow: '0 8px 24px rgba(12, 11, 10, 0.03)',
            marginBottom: '48px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <strong style={{ fontSize: '14.5px', color: '#1c1917' }}>Our Core Privacy Commitment</strong>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#57534e', lineHeight: 1.6 }}>
            At <strong>aB Labs</strong>, we prioritize the confidentiality of ambitious founders and businesses. We collect only what is strictly necessary to customize, deploy, and host your website foundation in under 36 hours. <strong>We never sell, rent, or monetize client data or uploaded brand assets.</strong>
          </p>
        </div>

        {/* Content Body */}
        <article
          style={{
            fontSize: '15px',
            lineHeight: 1.75,
            color: '#292524',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              1. Information We Collect
            </h2>
            <p>
              When you browse our catalog, submit an inquiry, request a demo, or initiate a website build, we collect the following categories of information:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong>Contact &amp; Identity Details:</strong> Full name, business email address, and WhatsApp/phone number.
              </li>
              <li>
                <strong>Business &amp; Domain Details:</strong> Legal or operating business name, industry classification, desired custom domain, and current online footprint (e.g. Instagram handle or existing URLs).
              </li>
              <li>
                <strong>Brand &amp; Creative Assets:</strong> Logos, typography files, brand color hex codes, product images, marketing copy, and service rate cards uploaded through the Client Portal.
              </li>
              <li>
                <strong>Technical &amp; Telemetry Data:</strong> IP address, device type, browser user agent, presence heartbeats, and privacy-preserving page analytics via self-hosted Umami analytics (cookieless and GDPR/NDPA compliant).
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              2. How We Use Your Information
            </h2>
            <p>
              Your data is utilized solely for providing and improving our web engineering services:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Assembling and launching your tailored website foundation in under 36 hours.</li>
              <li>Registering and linking your 1-year custom domain name and issuing SSL certificates.</li>
              <li>Provisioning your dedicated Client Portal account for real-time build tracking and asset review.</li>
              <li>Processing secure payments and generating receipts via Paystack.</li>
              <li>Dispatching direct build milestones, portal access links, and technical updates via email and WhatsApp.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              3. Payment Security &amp; Financial Information
            </h2>
            <p>
              aB Labs does <strong>not</strong> collect, process, or store sensitive debit/credit card numbers or banking PINs on our servers. All transactions are securely routed through <strong>Paystack</strong> (a Stripe subsidiary), which is fully certified under <strong>PCI-DSS Level 1</strong> compliance standards.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              4. Client Asset Ownership &amp; Non-Disclosure
            </h2>
            <p>
              All trademarks, product photos, vector logos, customer lists, and business copy provided to aB Labs remain the exclusive intellectual property of the client. aB Labs acts solely as an engineering custodian during the customization phase. We treat all non-public business strategies as strictly confidential under non-disclosure obligations.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              5. Third-Party Infrastructure Processors
            </h2>
            <p>
              We partner with trusted, SOC2-certified cloud infrastructure providers to run our high-performance service:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Neon Database (AWS us-east-2):</strong> Encrypted PostgreSQL storage for order ledgers and client portals.</li>
              <li><strong>Paystack Payments:</strong> PCI-DSS certified payment processing.</li>
              <li><strong>Resend / Amazon SES:</strong> Transactional email dispatch for receipts and portal credentials.</li>
              <li><strong>Umami Analytics:</strong> Cookieless, privacy-first site performance tracking.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              6. Your Data Rights
            </h2>
            <p>
              In compliance with the <strong>Nigeria Data Protection Act (NDPA)</strong> and global privacy standards, you have the right to request access to your personal data, request correction of inaccurate records, or request complete deletion of your portal account once your project is delivered.
            </p>
          </section>

          <section style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e7e5e4' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', margin: '0 0 8px' }}>
              7. Contact Our Privacy &amp; Data Desk
            </h2>
            <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#57534e' }}>
              If you have any questions or data requests regarding this Privacy Policy, reach out directly to our engineering desk:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13.5px' }}>
              <div>
                <strong>Email:</strong>{' '}
                <a href="mailto:boluwatifeadesola9@gmail.com" style={{ color: '#9a6843', textDecoration: 'none' }}>
                  boluwatifeadesola9@gmail.com
                </a>
              </div>
              <div>
                <strong>Direct Desk:</strong>{' '}
                <a href="https://wa.me/2349036193817" style={{ color: '#16a34a', textDecoration: 'none' }}>
                  +234 903 619 3817 (WhatsApp)
                </a>
              </div>
              <div>
                <strong>Location:</strong> Lagos, Nigeria
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
