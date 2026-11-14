import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Terms and Conditions | aB Labs',
  description:
    'Terms of service governing aB Labs website foundation customization, 36-hour launch SLA, monthly hosting, and outright codebase ownership.',
  path: '/terms-of-service',
});

export default function TermsOfServicePage() {
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
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              marginBottom: '14px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Service Agreement &amp; Delivery SLA
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
            Terms &amp; Conditions
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#78716c' }}>
            <span>Last Updated: November 2026</span>
            <span>&bull;</span>
            <span>Applicable to all Orders &amp; Subscriptions</span>
          </div>
        </header>

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
              1. Acceptance &amp; Scope of Services
            </h2>
            <p>
              By selecting a website template, making a payment, or submitting brand details through <strong>aB Labs</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;the Service&quot;), you (&quot;Client&quot;) agree to be legally bound by these Terms and Conditions.
            </p>
            <p>
              aB Labs specializes in the rapid adaptation, engineering customization, domain configuration, and cloud deployment of production-grade website foundations designed for modern businesses.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              2. Launch Plans &amp; Billing Structures
            </h2>
            <p>
              We provide two distinct, transparent engagement models:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '16px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e7e5e4' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', margin: '0 0 8px' }}>
                  A. Monthly Launch Plan (Low-Friction Model)
                </h3>
                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
                  <li>
                    <strong>Setup Fee Due Today:</strong> Client pays only the one-time initial Setup Fee upon ordering to begin engineering and domain allocation.
                  </li>
                  <li>
                    <strong>Deferred Monthly Billing:</strong> The monthly hosting and management subscription (e.g. ₦5,000/mo or custom catalog price) begins <strong>only after</strong> the website has been delivered, reviewed, and approved for live launch.
                  </li>
                  <li>
                    <strong>Inclusions:</strong> High-speed cloud hosting, automated SSL renewal, DNS routing, and technical server maintenance.
                  </li>
                  <li>
                    <strong>Cancellation:</strong> May be cancelled at any time with 7 days&apos; notice before the subsequent billing cycle.
                  </li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '20px', border: '1px solid #e7e5e4' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', margin: '0 0 8px' }}>
                  B. Outright Purchase Plan (100% Ownership)
                </h3>
                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
                  <li>
                    <strong>One-Time Investment:</strong> Client pays the designated outright fee with <strong>zero recurring monthly platform charges</strong> to aB Labs.
                  </li>
                  <li>
                    <strong>Complete Codebase Transfer:</strong> Full repository ownership transfer (via GitHub repo transfer or zipped codebase archive) upon project sign-off.
                  </li>
                  <li>
                    <strong>Inclusions:</strong> 1-year custom domain registration, DNS wiring, SSL certificate, and lifetime perpetual software license.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              3. The 36-Hour Launch SLA &amp; Delivery Workflow
            </h2>
            <p>
              Our flagship commitment is delivery of your operational website in <strong>less than 36 hours</strong>:
            </p>
            <ol style={{ paddingLeft: '20px', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong>Clock Inception:</strong> The 36-hour delivery clock begins when the Client provides essential brand assets (logo, brand colors, primary service/product offerings, and contact numbers) via the Client Portal.
              </li>
              <li>
                <strong>Staging Review:</strong> Within 24 hours, our engineering desk delivers a live, responsive staging preview on a secure testing URL.
              </li>
              <li>
                <strong>Revision &amp; Polish:</strong> Every build includes up to <strong>two (2) rounds of comprehensive revisions</strong> covering typography, color nuances, image replacements, and copy tweaks.
              </li>
              <li>
                <strong>Domain Cutover:</strong> Upon client sign-off, DNS records are linked to the custom domain, SSL is propagated, and the site is declared live.
              </li>
            </ol>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              4. Domain Names &amp; DNS Management
            </h2>
            <p>
              All orders include one (1) year of complimentary custom domain registration (.com.ng, .online, .store, .site or eligible standard extensions).
            </p>
            <ul style={{ paddingLeft: '20px', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Domains are registered with the Client designated as the registered administrative owner.</li>
              <li>Domain renewals after Year 1 are billed at standard registrar cost without predatory markups.</li>
              <li>Clients with existing custom domains may retain their existing registrar and simply point DNS A/CNAME records as guided by our desk.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              5. Intellectual Property Rights
            </h2>
            <p>
              <strong>Client Assets:</strong> You retain complete ownership of all trademarks, copy, photography, and logos submitted to us.
            </p>
            <p>
              <strong>Customized Code:</strong> For Outright Purchase plans, upon full payment, all custom stylesheets, layout customizations, and configured components created for your site are assigned to you. Core third-party open-source libraries (e.g. React, Next.js, Tailwind CSS) remain subject to their respective MIT or open-source licenses.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              6. Limitation of Liability &amp; Governing Law
            </h2>
            <p>
              In no event shall aB Labs be liable for indirect, incidental, or consequential commercial damages, loss of business revenue, or third-party telecommunications outages beyond the total amount paid by the Client for the specific order.
            </p>
            <p>
              These Terms shall be governed and interpreted in accordance with the laws of the <strong>Federal Republic of Nigeria</strong>. Any disputes arising hereunder shall be subject to the jurisdiction of the courts of Lagos State.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
