import React from 'react';
import Link from 'next/link';
import { Template } from '@/data/templates';

function formatShortNgn(num: number): string {
  if (num >= 1000000) {
    return `₦${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`;
  }
  if (num >= 1000) {
    return `₦${(num / 1000).toFixed(0)}k`;
  }
  return `₦${num.toLocaleString()}`;
}

interface TemplateCardProps {
  template: Template;
  priority?: boolean;
  ctaText?: string;
}

export default function TemplateCard({ template, priority = false, ctaText = 'Explore Design' }: TemplateCardProps) {
  const monthly = template.monthlyNgn || 5000;
  const setup = template.setupFeeNgn || 50000;
  const outright = template.outrightNgn || template.priceNgn;
  const standardOutright = template.standardOutrightNgn || 0;

  return (
    <article className="shop-template-card">
      {/* Image & Category Tag */}
      <div className="shop-template-thumb-wrap">
        <Link href={`/product/${template.slug}`} className="shop-template-img-link">
          <img
            src={template.image}
            alt={template.name}
            loading={priority ? 'eager' : 'lazy'}
            className="shop-template-img"
          />
        </Link>

        {/* Category Pill Top-Right */}
        <span className="shop-template-cat-badge">
          {template.categoryLabel}
        </span>
      </div>

      {/* Content Body */}
      <div className="shop-template-body">
        {/* Launch speed & Tech Stack Badges (Zero fake ratings) */}
        <div className="shop-template-meta-row">
          <span className="shop-template-speed-badge">
            <span className="speed-dot"></span>
            <span>Live in &lt; 36h</span>
          </span>

          <div className="shop-template-stack-list">
            {template.stack.slice(0, 2).map((s) => (
              <span key={s} className="shop-template-stack-pill">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/product/${template.slug}`}
          className="shop-template-title"
        >
          {template.name}
        </Link>

        {/* Description */}
        <p className="shop-template-desc">
          {template.description}
        </p>

        {/* Footer with Dual Launch Pricing and CTA (Zero-Collision Mobile Layout) */}
        <div className="shop-card-footer">
          <div className="shop-card-price-group">
            <div className="shop-card-price-monthly">
              <span className="shop-card-price-mo">
                ₦{monthly.toLocaleString()}/mo
              </span>
              <span className="shop-card-price-setup">
                + {formatShortNgn(setup)} setup
              </span>
            </div>
            <div className="shop-card-price-outright">
              or <strong>₦{outright.toLocaleString()}</strong> outright
              {standardOutright > outright && (
                <span className="shop-card-price-strike">
                  ₦{standardOutright.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/product/${template.slug}`}
            className="shop-card-cta"
          >
            <span>{ctaText}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
