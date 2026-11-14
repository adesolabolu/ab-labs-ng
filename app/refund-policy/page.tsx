import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Refund & Cancellation Policy | aB Labs',
  description:
    'Our transparent, fair, and founder-friendly refund policy for website template customization, setup fees, and monthly hosting.',
  path: '/refund-policy',
});

export default function RefundPolicyPage() {
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
              backgroundColor: '#fef3c7',
              border: '1px solid #fde68a',
              marginBottom: '14px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#d97706' }}></span>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Consumer Protection &amp; Guarantees
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
            Refund &amp; Cancellation Policy
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#78716c' }}>
            <span>Last Updated: November 2026</span>
            <span>&bull;</span>
            <span>Founder-Friendly &amp; Fair</span>
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
              1. Our Philosophy on Refunds
            </h2>
            <p>
              At <strong>aB Labs</strong>, we want ambitious founders and business owners to invest in their web presence with complete peace of mind. We stand behind our 36-hour rapid deployment commitment with clear, equitable refund terms.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              2. Pre-Engineering Cancellation (100% Full Refund)
            </h2>
            <p>
              If you place an order and change your mind before our engineering desk has commenced setup or registered your third-party domain (within <strong>4 hours</strong> of payment confirmation), you are entitled to a <strong>100% full, no-questions-asked refund</strong>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              3. During the 36-Hour Customization Window
            </h2>
            <p>
              Because our builds involve dedicated engineering hours and immediate non-refundable capital expenditures (such as registrar domain registration fees, SSL provisioning, and cloud container allocation):
            </p>
            <ul style={{ paddingLeft: '20px', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong>Revision Guarantee:</strong> If our initial staging preview does not meet your expectations, we will provide up to <strong>two (2) complimentary rounds of comprehensive revisions</strong> to fine-tune the layout, typography, colors, and content.
              </li>
              <li>
                <strong>Pre-Cutover Partial Refund:</strong> If after the revision cycles you remain unsatisfied and request a cancellation prior to final custom domain DNS propagation or repository transfer, we will refund your payment minus a <strong>flat ₦10,000 disbursement fee</strong> to cover third-party domain registration and server provisioning costs. The registered domain remains yours.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              4. Post-Delivery &amp; Live Launch
            </h2>
            <p>
              Once your customized website foundation has been approved, declared live on your domain, or the complete GitHub codebase transfer has been finalized (for Outright Purchase plans), the service is considered fully delivered and fees are non-refundable.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              5. Monthly Subscription Cancellation
            </h2>
            <p>
              For clients on the <strong>Monthly Launch Plan</strong>:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                Remember: Your recurring monthly fee begins <strong>only after</strong> your website is completed, approved, and live.
              </li>
              <li>
                You may cancel your monthly maintenance at any time with <strong>7 days&apos; advance notice</strong> prior to your next monthly billing cycle via the Client Portal or by contacting support.
              </li>
              <li>
                Upon cancellation, your site will remain active until the end of your current paid month. No subsequent recurring charges will ever be levied.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              6. Refund Method &amp; Processing Timelines
            </h2>
            <p>
              All approved refunds are initiated through our official payment gateway (<strong>Paystack</strong>) back to the originating debit card or Nigerian bank account.
            </p>
            <p>
              Depending on your financial institution, funds typically reflect in your account within <strong>3 to 7 business days</strong> following approval.
            </p>
          </section>

          <section style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e7e5e4' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', margin: '0 0 8px' }}>
              7. How to Request a Refund
            </h2>
            <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#57534e' }}>
              To request a cancellation or refund, simply reach out to our desk with your Order Reference:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13.5px' }}>
              <div>
                <strong>Email:</strong>{' '}
                <a href="mailto:boluwatifeadesola9@gmail.com?subject=Refund%20Request" style={{ color: '#9a6843', textDecoration: 'none' }}>
                  boluwatifeadesola9@gmail.com
                </a>
              </div>
              <div>
                <strong>Direct Desk:</strong>{' '}
                <a href="https://wa.me/2349036193817?text=Hi%20aB%20Labs,%20I%20have%20an%20inquiry%20concerning%20my%20order%20and%20refund" style={{ color: '#16a34a', textDecoration: 'none' }}>
                  +234 903 619 3817 (WhatsApp)
                </a>
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
