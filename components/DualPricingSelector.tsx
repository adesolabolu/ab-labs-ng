'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoRequestModal from '@/components/DemoRequestModal';

interface DualPricingSelectorProps {
  templateName?: string;
  templateSlug?: string;
  monthlyPrice?: number;
  setupFee?: number;
  outrightPrice?: number;
  standardMonthlyPrice?: number;
  standardSetupFee?: number;
  standardOutrightPrice?: number;
  whatsappNumber?: string;
}

export default function DualPricingSelector({
  templateName = 'Lumina Website Foundation',
  templateSlug = 'lumina-lighting-lamps',
  monthlyPrice = 5000,
  setupFee = 15000,
  outrightPrice = 50000,
  standardMonthlyPrice = 10000,
  standardSetupFee = 30000,
  standardOutrightPrice = 100000,
  whatsappNumber = '2349036193817',
}: DualPricingSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'outright'>('monthly');
  const [showDemoModal, setShowDemoModal] = useState(false);

  const formatNgn = (val: number) => `₦${val.toLocaleString()}`;

  const discountPct = (standard: number, current: number) =>
    standard > current && current > 0 ? Math.round((1 - current / standard) * 100) : 0;

  const monthlyDiscountPct = discountPct(standardMonthlyPrice, monthlyPrice);
  const outrightDiscountPct = discountPct(standardOutrightPrice, outrightPrice);

  const isMonthly = selectedPlan === 'monthly';

  return (
    <div className="dual-pricing-selector" style={{ width: '100%', marginTop: '16px' }}>
      <style>{`
        .dps-card {
          cursor: pointer;
          padding: 14px 16px;
          border-radius: 12px;
          transition: border-color 0.16s ease, background-color 0.16s ease, box-shadow 0.16s ease;
        }
        .dps-card:hover {
          border-color: #1c1917;
        }
        .dps-ticks {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 14px;
          margin-top: 8px;
          font-size: 12px;
          color: #57534e;
        }
        .dps-tick {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
      `}</style>

      {/* Both Plans Always Visible */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* OPTION 1: Monthly Plan */}
        <div
          className="dps-card"
          onClick={() => setSelectedPlan('monthly')}
          role="button"
          tabIndex={0}
          aria-pressed={isMonthly}
          data-umami-event="Pricing Selector - Selected Monthly Plan"
          data-umami-event-template={templateSlug}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedPlan('monthly');
            }
          }}
          style={{
            border: isMonthly ? '2px solid #1c1917' : '1px solid #e7e5e4',
            backgroundColor: isMonthly ? '#ffffff' : '#fafaf9',
            boxShadow: isMonthly ? '0 6px 18px rgba(28, 25, 23, 0.07)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span
                style={{
                  width: '17px',
                  height: '17px',
                  borderRadius: '50%',
                  border: isMonthly ? '5px solid #1c1917' : '2px solid #d6d3d1',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>
                Monthly Plan
              </span>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#15803d', whiteSpace: 'nowrap' }}>
              {monthlyDiscountPct > 0 ? `Popular · ${monthlyDiscountPct}% Off` : 'Most Popular'}
            </span>
          </div>

          <div style={{ marginTop: '10px', paddingLeft: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#1c1917', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {formatNgn(monthlyPrice)}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#78716c' }}>/month</span>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginLeft: '4px' }}>
                + {formatNgn(setupFee)} setup
              </span>
            </div>

            <div className="dps-ticks">
              <span className="dps-tick">
                <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> Monthly starts after launch
              </span>
              <span className="dps-tick">
                <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> Hosting &amp; updates included
              </span>
            </div>
          </div>
        </div>

        {/* OPTION 2: Outright Ownership */}
        <div
          className="dps-card"
          onClick={() => setSelectedPlan('outright')}
          role="button"
          tabIndex={0}
          aria-pressed={!isMonthly}
          data-umami-event="Pricing Selector - Selected Outright Plan"
          data-umami-event-template={templateSlug}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedPlan('outright');
            }
          }}
          style={{
            border: !isMonthly ? '2px solid #1c1917' : '1px solid #e7e5e4',
            backgroundColor: !isMonthly ? '#ffffff' : '#fafaf9',
            boxShadow: !isMonthly ? '0 6px 18px rgba(28, 25, 23, 0.07)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span
                style={{
                  width: '17px',
                  height: '17px',
                  borderRadius: '50%',
                  border: !isMonthly ? '5px solid #1c1917' : '2px solid #d6d3d1',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>
                Outright Ownership
              </span>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#9a6843', whiteSpace: 'nowrap' }}>
              {outrightDiscountPct > 0 ? `Save ${outrightDiscountPct}%` : 'One-Time'}
            </span>
          </div>

          <div style={{ marginTop: '10px', paddingLeft: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#1c1917', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {formatNgn(outrightPrice)}
              </span>
              {outrightDiscountPct > 0 && (
                <span style={{ fontSize: '13.5px', color: '#a8a29e', textDecoration: 'line-through', fontWeight: 500 }}>
                  {formatNgn(standardOutrightPrice)}
                </span>
              )}
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#15803d' }}>
                once
              </span>
            </div>

            <div className="dps-ticks">
              <span className="dps-tick">
                <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> ₦0 monthly fees
              </span>
              <span className="dps-tick">
                <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> Full GitHub code ownership
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Due Today Summary */}
      <div
        style={{
          marginTop: '14px',
          padding: '11px 14px',
          borderRadius: '10px',
          backgroundColor: '#f5f2ec',
          border: '1px solid #e7e5e4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: '12.5px', color: '#44403c', lineHeight: 1.35 }}>
          <strong style={{ color: '#1c1917' }}>Pay today: {formatNgn(isMonthly ? setupFee : outrightPrice)}</strong>
          <span style={{ display: 'block', fontSize: '11.5px', color: '#78716c', marginTop: '1px' }}>
            {isMonthly
              ? `Then ${formatNgn(monthlyPrice)}/mo once your website goes live`
              : 'One-time payment — zero recurring monthly fees'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginTop: '12px' }}>
        <Link
          href={`/checkout?template=${templateSlug}&plan=${selectedPlan}`}
          className="primary-button"
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).umami) {
              (window as any).umami.track('Pricing Selector - Clicked Pay Now', {
                template: templateSlug,
                plan: selectedPlan,
              });
            }
          }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            minHeight: '48px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '14.5px',
            borderRadius: '10px',
            backgroundColor: '#1c1917',
            color: '#ffffff',
            textAlign: 'center',
            padding: '11px 16px',
            boxSizing: 'border-box',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#9a6843';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1c1917';
          }}
        >
          Start My Build &rarr;
        </Link>

        <button
          type="button"
          onClick={() => setShowDemoModal(true)}
          className="demo-request-btn"
          data-umami-event="Pricing Selector - Clicked Request Free Demo"
          data-umami-event-template={templateSlug}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            minHeight: '42px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '13.5px',
            borderRadius: '10px',
            border: '1px solid #d6d3d1',
            backgroundColor: '#ffffff',
            color: '#1c1917',
            cursor: 'pointer',
            boxSizing: 'border-box',
            transition: 'background-color 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fafaf9';
            e.currentTarget.style.borderColor = '#a8a29e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#d6d3d1';
          }}
        >
          Request a Free Brand Demo
        </button>
      </div>

      {/* 2-Option Interactive Demo Request Modal */}
      <DemoRequestModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        templateName={templateName}
        templateSlug={templateSlug}
        selectedPlan={selectedPlan}
        monthlyPrice={monthlyPrice}
        setupFee={setupFee}
        outrightPrice={outrightPrice}
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
}
