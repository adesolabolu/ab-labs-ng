'use client';

import React, { useState } from 'react';
import DemoRequestModal from '@/components/DemoRequestModal';
import InstantCheckoutModal from '@/components/InstantCheckoutModal';

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
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const formatNgn = (val: number) => `₦${val.toLocaleString()}`;

  // Discount badges are derived so admin-edited prices stay truthful.
  const discountPct = (standard: number, current: number) =>
    standard > current && current > 0 ? Math.round((1 - current / standard) * 100) : 0;

  const monthlyDiscountPct = discountPct(standardMonthlyPrice, monthlyPrice);
  const outrightDiscountPct = discountPct(standardOutrightPrice, outrightPrice);

  const cleanTemplateName = templateName.replace(/ - /g, '-');

  const whatsappMessage = selectedPlan === 'monthly'
    ? `Hi aB Labs, I would like to request a free brand demo for the ${cleanTemplateName} on the Monthly Launch Plan (${formatNgn(setupFee)} setup + ${formatNgn(monthlyPrice)}/month).`
    : `Hi aB Labs, I would like to request a free brand demo for the ${cleanTemplateName} on the Outright Launch Plan (${formatNgn(outrightPrice)} one-time).`;

  const encodedWhatsapp = encodeURIComponent(whatsappMessage);

  return (
    <div className="dual-pricing-selector" style={{ width: '100%', marginTop: '16px' }}>
      {/* Plan Selection Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* OPTION 1: Low-Friction Monthly Plan */}
        <div
          onClick={() => setSelectedPlan('monthly')}
          role="button"
          tabIndex={0}
          data-umami-event="Pricing Selector - Selected Monthly Plan"
          data-umami-event-template={templateSlug}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setSelectedPlan('monthly');
          }}
          style={{
            cursor: 'pointer',
            padding: '14px 14px',
            borderRadius: '12px',
            border: selectedPlan === 'monthly' ? '2px solid #111827' : '1px solid #e5e7eb',
            backgroundColor: selectedPlan === 'monthly' ? '#ffffff' : '#f9fafb',
            boxShadow: selectedPlan === 'monthly' ? '0 4px 12px rgba(0, 0, 0, 0.06)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: selectedPlan === 'monthly' ? '5px solid #111827' : '2px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                Low-Friction Entry Plan
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#065f46',
                backgroundColor: '#d1fae5',
                padding: '2px 8px',
                borderRadius: '999px',
                flexShrink: 0,
              }}
            >
              {monthlyDiscountPct > 0 ? `${monthlyDiscountPct}% Launch Off` : 'Monthly Plan'}
            </span>
          </div>

          <div style={{ marginTop: '8px', paddingLeft: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                {formatNgn(monthlyPrice)}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#6b7280' }}>/ month</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginLeft: '4px' }}>
                + {formatNgn(setupFee)} setup
              </span>
            </div>

            <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.45 }}>
              ⚡ <strong>{monthlyDiscountPct > 0 ? `${monthlyDiscountPct}% launch discount` : 'Launch pricing'}</strong> active for 3 months. Includes 1-year domain (.com.ng, .online, .store, .site &amp; more), hosting &amp; full management.
            </p>
          </div>
        </div>

        {/* OPTION 2: Outright Full Ownership */}
        <div
          onClick={() => setSelectedPlan('outright')}
          role="button"
          tabIndex={0}
          data-umami-event="Pricing Selector - Selected Outright Plan"
          data-umami-event-template={templateSlug}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setSelectedPlan('outright');
          }}
          style={{
            cursor: 'pointer',
            padding: '14px 14px',
            borderRadius: '12px',
            border: selectedPlan === 'outright' ? '2px solid #111827' : '1px solid #e5e7eb',
            backgroundColor: selectedPlan === 'outright' ? '#ffffff' : '#f9fafb',
            boxShadow: selectedPlan === 'outright' ? '0 4px 12px rgba(0, 0, 0, 0.06)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: selectedPlan === 'outright' ? '5px solid #111827' : '2px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                Outright Ownership
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#1e40af',
                backgroundColor: '#dbeafe',
                padding: '2px 8px',
                borderRadius: '999px',
                flexShrink: 0,
              }}
            >
              {outrightDiscountPct > 0 ? `${outrightDiscountPct}% Launch Off` : 'Full Ownership'}
            </span>
          </div>

          <div style={{ marginTop: '8px', paddingLeft: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                {formatNgn(outrightPrice)}
              </span>
              {outrightDiscountPct > 0 && (
                <span
                  style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    textDecoration: 'line-through',
                    fontWeight: 500,
                  }}
                >
                  {formatNgn(standardOutrightPrice)}
                </span>
              )}
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#047857' }}>
                One-time
              </span>
            </div>

            <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.45 }}>
              🛡️ <strong>100% full ownership</strong> with zero monthly fees. GitHub repository transfer, 1-year domain (.com.ng, .online, .store, .site &amp; more) &amp; SSL included.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => setShowCheckoutModal(true)}
          className="primary-button"
          data-umami-event={`Pricing Selector - Clicked Pay Now (${selectedPlan})`}
          data-umami-event-template={templateSlug}
          data-umami-event-plan={selectedPlan}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            minHeight: '48px',
            fontWeight: 700,
            fontSize: '14.5px',
            borderRadius: '100px',
            backgroundColor: '#111827',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            textAlign: 'center',
            padding: '10px 16px',
            boxSizing: 'border-box',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#9a6843';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#111827';
          }}
        >
          {selectedPlan === 'monthly'
            ? `Pay & Start Build (${formatNgn(setupFee + monthlyPrice)})`
            : `Pay & Start Build (${formatNgn(outrightPrice)})`}
        </button>

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
            minHeight: '44px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            borderRadius: '100px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            color: '#111827',
            cursor: 'pointer',
            boxSizing: 'border-box',
            transition: 'background-color 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <span>Request a Free Brand Demo</span>
        </button>
      </div>

      {/* Instant Paystack Checkout & Automated Portal Provisioning Modal */}
      <InstantCheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        templateName={templateName}
        templateSlug={templateSlug}
        selectedPlan={selectedPlan}
        monthlyPrice={monthlyPrice}
        setupFee={setupFee}
        outrightPrice={outrightPrice}
        whatsappNumber={whatsappNumber}
      />

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
