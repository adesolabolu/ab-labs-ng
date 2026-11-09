'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

interface Slide {
  name: string;
  category: string;
  metric: string;
  metricColor: string;
  image: string;
  slug: string;
}

const SLIDES: Slide[] = [
  {
    name: 'Lumina Storefront Pro',
    category: 'Next.js 16 + Paystack',
    metric: '99.8% Lighthouse',
    metricColor: '#16a34a',
    image: '/assets/6a9d41e8ed1798ce9da07242_hero-stage-grad%20image.webp',
    slug: 'lumina-storefront',
  },
  {
    name: 'Apex Real Estate Suite',
    category: 'Next.js 16 + Paystack',
    metric: 'Sub-Second Turnkey',
    metricColor: '#2563eb',
    image: '/assets/6aa8e6c9377fd78d6e9319eb_Rectangle%203xx4624707.webp',
    slug: 'apex-real-estate',
  },
  {
    name: 'Vertex Corporate Flagship',
    category: 'Next.js 16 + Paystack',
    metric: '100% Clean Architecture',
    metricColor: '#9333ea',
    image: '/assets/6aa8e6ca646687ab06e34fdd_Rectanccgle%2034624706.webp',
    slug: 'vertex-corporate',
  },
  {
    name: 'Pulse SaaS Platform',
    category: 'Next.js 16 + Paystack',
    metric: 'Zero-Friction Checkout',
    metricColor: '#ea580c',
    image: '/assets/6aa685cd92e156928afe94c4_Rectangle%2034624705%20(2).webp',
    slug: 'pulse-saas',
  },
];

export default function HeroStageSlider() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(3); // Start with Pulse (top layer)
  const containerRef = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const l2 = layer2Ref.current;
    const l3 = layer3Ref.current;
    const l4 = layer4Ref.current;

    if (!l2 || !l3 || !l4) return;

    // Reset initial layer layout: full reveal
    gsap.set([l2, l3, l4], {
      clipPath: 'inset(0% 0% 0% 0%)',
    });

    const tl = gsap.timeline({ repeat: -1 });

    tl
      // 1. Slide 4 (Pulse) holds for 3.5s, then curtain wipes away revealing Slide 3 (Vertex)
      .to({}, { duration: 3.5 })
      .call(() => setCurrentSlideIndex(2))
      .to(l4, {
        clipPath: 'inset(0% 0% 0% 100%)',
        duration: 1.6,
        ease: 'power2.inOut',
      })

      // 2. Slide 3 (Vertex) holds for 3.5s, then curtain wipes away revealing Slide 2 (Apex)
      .to({}, { duration: 3.5 })
      .call(() => setCurrentSlideIndex(1))
      .to(l3, {
        clipPath: 'inset(0% 0% 0% 100%)',
        duration: 1.6,
        ease: 'power2.inOut',
      })

      // 3. Slide 2 (Apex) holds for 3.5s, then curtain wipes away revealing Slide 1 (Lumina)
      .to({}, { duration: 3.5 })
      .call(() => setCurrentSlideIndex(0))
      .to(l2, {
        clipPath: 'inset(0% 0% 0% 100%)',
        duration: 1.6,
        ease: 'power2.inOut',
      })

      // 4. Slide 1 (Lumina) holds for 3.5s
      .to({}, { duration: 3.5 })

      // 5. Seamless Return: Prep Layer 4 from left (inset right 100%), then wipe in over Lumina
      .set(l4, { clipPath: 'inset(0% 100% 0% 0%)' })
      .call(() => setCurrentSlideIndex(3))
      .to(l4, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.6,
        ease: 'power2.inOut',
      })

      // 6. Once Layer 4 is 100% covering stage, reset underlying layers silently
      .set([l2, l3], { clipPath: 'inset(0% 0% 0% 0%)' });

    return () => {
      tl.kill();
    };
  }, []);

  const active = SLIDES[currentSlideIndex];

  return (
    <div ref={containerRef} className="hero-content-wrapper hero-slider-container">
      {/* BASE LAYER (Slide 0: Lumina Storefront Pro) */}
      <div className="hero-stage-img hero-slide-layer is-base">
        <img
          src={SLIDES[0].image}
          alt={SLIDES[0].name}
          loading="eager"
          className="hero-stage-img-img"
        />
      </div>

      {/* LAYER 2 (Slide 1: Apex Real Estate Suite) */}
      <div ref={layer2Ref} className="hero-stage-img is-2 hero-slide-layer">
        <img
          src={SLIDES[1].image}
          alt={SLIDES[1].name}
          loading="eager"
          className="hero-stage-img-img"
        />
      </div>

      {/* LAYER 3 (Slide 2: Vertex Corporate Flagship) */}
      <div ref={layer3Ref} className="hero-stage-img is-3 hero-slide-layer">
        <img
          src={SLIDES[2].image}
          alt={SLIDES[2].name}
          loading="eager"
          className="hero-stage-img-img"
        />
      </div>

      {/* LAYER 4 (Slide 3: Pulse SaaS Platform - Top Layer) */}
      <div ref={layer4Ref} className="hero-stage-img is-4 hero-slide-layer">
        <img
          src={SLIDES[3].image}
          alt={SLIDES[3].name}
          loading="eager"
          className="hero-stage-img-img"
        />
      </div>

      {/* Ambient Gradient Overlay */}
      <div className="hero-stage-grad"></div>

      {/* Dynamic Floating Template Card with Smooth Crossfade */}
      <div className="hero-card hero-floating-card">
        <p className="hero-card-name" key={active.name}>
          {active.name}
        </p>
        <div className="hero-card-rule"></div>
        <div className="hero-card-meta">
          <p className="hero-card-meta-small">Stack</p>
          <span>{active.category}</span>
        </div>
        <div className="hero-card-meta">
          <p className="hero-card-meta-small">Performance</p>
          <span style={{ color: active.metricColor, fontWeight: 700 }}>
            {active.metric}
          </span>
        </div>
        <Link href={`/product/${active.slug}`} className="hero-card-link w-inline-block">
          <div>Preview Template</div>
          <div className="readmore-button-icon w-embed">
            <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
              <path d="M7 17 17 7M7 7h10v10"></path>
            </svg>
          </div>
        </Link>
      </div>

      {/* Interactive Slide Progress Indicators */}
      <div className="hero-slide-pills">
        {SLIDES.map((s, idx) => (
          <div
            key={s.slug}
            className={`hero-slide-pill ${currentSlideIndex === idx ? 'is-active' : ''}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
