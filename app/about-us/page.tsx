import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'About aB Labs | High-Performance Next.js Website Templates & Digital Flagships',
  description: 'Learn how aB Labs engineers production-grade Next.js website templates, custom digital storefronts, and conversion-optimized web applications for ambitious African brands.',
};

export default function AboutUsPage() {
  return (
    <>
      <div className="page-wrapper">
        <Navbar />

        <main className="main-wrapper">
          {/* SECTION: HERO */}
          <section className="section-about-hero">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="ab-hero-in">
                <div className="ab-hero-left">
                  <div className="page-heading-block">
                    <div className="hero-subtitle-block">
                      <div className="subtitle-dot"></div>
                      <div>About aB Labs</div>
                    </div>
                    <div className="page-title-block max-width-780px">
                      <h1 className="heading-style-h1">Digital Flagships Engineered for Scale, Built to Convert.</h1>
                    </div>
                    <div className="hero-summary-wrapper max-width-520px">
                      <p className="about-hero-summary">
                        We design and engineer production-grade Next.js website templates, high-converting digital storefronts, and tailored web applications for fast-growing African enterprises and ambitious creators.
                      </p>
                    </div>
                  </div>
                  <div className="ab-hero-actions">
                    <Link href="/shop" className="primary-button w-inline-block">
                      <div className="button-text-wrapper">
                        <div className="button-text-block">
                          <div className="link-text is-1">Explore Templates</div>
                          <div className="link-text is-2">Explore Templates</div>
                        </div>
                        <div className="button-arrow-block">
                          <div className="link-icon is-1 w-embed">
                            <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                              <path d="M7 17 17 7M7 7h10v10"></path>
                            </svg>
                          </div>
                          <div className="link-icon is-2 w-embed">
                            <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                              <path d="M7 17 17 7M7 7h10v10"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/contact-us" className="primary-button w-variant-247f4bce-739b-3294-dc6c-b061c876c17e w-inline-block">
                      <div className="button-text-wrapper">
                        <div className="button-text-block">
                          <div className="link-text is-1">Book a Consultation</div>
                          <div className="link-text is-2">Book a Consultation</div>
                        </div>
                        <div className="button-arrow-block">
                          <div className="link-icon is-1 w-embed">
                            <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                              <path d="M7 17 17 7M7 7h10v10"></path>
                            </svg>
                          </div>
                          <div className="link-icon is-2 w-embed">
                            <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                              <path d="M7 17 17 7M7 7h10v10"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="ab-hero-meta">
                    <div className="it">
                      <p className="ab-hero-meta-it-b counter">2020</p>
                      <p className="ab-hero-meta-it-small">Founded in Lagos</p>
                    </div>
                    <div className="sep"></div>
                    <div className="it">
                      <p className="ab-hero-meta-it-b"><span className="counter">140</span>+</p>
                      <p className="ab-hero-meta-it-small">Flagships deployed</p>
                    </div>
                    <div className="sep"></div>
                    <div className="it">
                      <p className="ab-hero-meta-it-b"><span className="counter">99.8</span>%</p>
                      <p className="ab-hero-meta-it-small">Mobile Lighthouse score</p>
                    </div>
                  </div>
                </div>
                <div className="ab-hero-right">
                  <div className="ab-hero-rate">
                    <p className="ab-hero-rate-n">4.9</p>
                    <div>
                      <p className="ab-hero-rate-s">★★★★★</p>
                      <p className="ab-hero-rate-l">Rated by 120+ founders &amp; tech leads</p>
                    </div>
                  </div>
                  <img src="/assets/6aa0e1f3d02666b3379f7bfb_About%20Hero%20image%20(1).webp" alt="Engineers building high-performance web flagships at aB Labs" loading="eager" className="ab-hero-media-img" />
                  <div className="ab-hero-tag">
                    <div className="subtitle-dot"></div>
                    <div>Engineered in Nigeria for global commerce</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: PHILOSOPHY */}
          <section className="section-philoshphy">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="section-heading-block align-center">
                <div className="section-subtitle-block">
                  <div className="subtitle-text">02 — Our Philosophy</div>
                </div>
                <div className="section-title-block max-width-980px">
                  <h2 className="title-42px text-weight-medium _42px">
                    We Believe Web Software Should Be Accessible, Blazing Fast, and 100% Free of Bloat.
                  </h2>
                </div>
              </div>
              <div className="ab-prin-grid">
                <div className="ab-prin rv">
                  <p className="ab-prin-n">01</p>
                  <div className="ab-prin-rule"></div>
                  <h3 className="ab-prin-h">Material Honesty in Code</h3>
                  <p className="ab-prin-p">
                    Zero bloated drag-and-drop builders, zero fragile plugins. Clean Next.js 16, TypeScript, and semantic Tailwind CSS that your engineers will love working with.
                  </p>
                </div>
                <div className="ab-prin rv rv1">
                  <p className="ab-prin-n">02</p>
                  <div className="ab-prin-rule"></div>
                  <h3 className="ab-prin-h">Engineered for African Scale</h3>
                  <p className="ab-prin-p">
                    Pre-wired Paystack &amp; Flutterwave checkout routes, lightweight assets for 3G/4G networks, and responsive WhatsApp lead capture designed to maximize conversion.
                  </p>
                </div>
                <div className="ab-prin">
                  <p className="ab-prin-n">03</p>
                  <div className="ab-prin-rule"></div>
                  <h3 className="ab-prin-h">100% Full Source Ownership</h3>
                  <p className="ab-prin-p">
                    When you acquire an aB Labs template, you own the full unminified GitHub codebase forever. Zero recurring builder lock-ins, zero hidden licensing royalties.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: STORY */}
          <section className="section-story">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="story-wrapper">
                <div className="story-left-column">
                  <div className="section-heading-block">
                    <div className="section-subtitle-block">
                      <div className="subtitle-text text-color-white">03 — Our Story</div>
                    </div>
                    <div className="section-title-block max-width-460px">
                      <h2 className="heading-style-h2 text-color-white">Six Years, One Mission.</h2>
                    </div>
                    <div className="section-summary-block max-width-400px">
                      <p className="text-size-regular text-color--f9f6f1">
                        Frustrated by sluggish website builders and fragile CMS stacks, we set out to engineer production-grade web flagships that give African founders enterprise speed without agency overhead.
                      </p>
                    </div>
                  </div>
                  <div className="ab-story-badge">
                    <p className="ab-story-badge-b"><span className="counter">140</span>+</p>
                    <p className="ab-story-badge-span">Digital flagships deployed to date</p>
                  </div>
                </div>
                <div className="story-right-column">
                  <div className="ab-tl-list">
                    <div className="ab-tl-row">
                      <div className="ab-tl-rail"></div>
                      <div className="ab-tl-dot"></div>
                      <p className="ab-tl-yr">2020</p>
                      <div>
                        <h3 className="ab-tl-h">The Boutique Software Lab</h3>
                        <p className="ab-tl-p">
                          aB Labs was founded in Lagos as a bespoke full-stack engineering consultancy building high-traffic fintech, logistics, and commerce platforms.
                        </p>
                      </div>
                    </div>
                    <div className="ab-tl-row">
                      <div className="ab-tl-rail"></div>
                      <div className="ab-tl-dot"></div>
                      <p className="ab-tl-yr">2022</p>
                      <div>
                        <h3 className="ab-tl-h">Codifying Modern Architecture</h3>
                        <p className="ab-tl-p">
                          After repeatedly hand-crafting the same core Next.js &amp; Paystack payment foundations, we standardized our component libraries and design tokens into production-ready marketplace templates.
                        </p>
                      </div>
                    </div>
                    <div className="ab-tl-row">
                      <div className="ab-tl-rail"></div>
                      <div className="ab-tl-dot"></div>
                      <p className="ab-tl-yr">2024</p>
                      <div>
                        <h3 className="ab-tl-h">Pan-African Expansion</h3>
                        <p className="ab-tl-p">
                          Our templates power brands across Nigeria, Ghana, Kenya, and Rwanda, processing hundreds of millions in transactions with sub-second response times.
                        </p>
                      </div>
                    </div>
                    <div className="ab-tl-row">
                      <div className="ab-tl-rail"></div>
                      <div className="ab-tl-dot"></div>
                      <p className="ab-tl-yr">2025</p>
                      <div>
                        <h3 className="ab-tl-h">Next.js 16 &amp; Turbopack Standard</h3>
                        <p className="ab-tl-p">
                          Complete modernization to React 19, Turbopack, and Server Actions, cutting mobile page load times by over 70% on cellular networks.
                        </p>
                      </div>
                    </div>
                    <div className="ab-tl-row">
                      <div className="ab-tl-rail"></div>
                      <div className="ab-tl-dot"></div>
                      <p className="ab-tl-yr">Today</p>
                      <div>
                        <h3 className="ab-tl-h">The Template Benchmark</h3>
                        <p className="ab-tl-p">
                          Over 140 deployments later, every template in our catalog represents the gold standard in speed, typography, conversion, and transaction reliability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: NUMBERS */}
          <section className="section-number">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="ab-stats-stage">
                <div className="ab-stats-bg">
                  <img src="/assets/6aa0f4f06ebeb100bcea2cac_About%20stats%20image.webp" alt="Inside the aB Labs studio" loading="lazy" sizes="100vw" className="ab-stats-bg-img" />
                  <div className="number-image-overlay"></div>
                </div>
                <div className="ab-stats-top">
                  <div className="section-heading-block align-center">
                    <div className="section-subtitle-block">
                      <div className="subtitle-text text-color-white">04 — By the Numbers</div>
                    </div>
                    <div className="section-title-block">
                      <h2 className="heading-style-h2 text-color-white">Performance Metrics That Impact Your Bottom Line.</h2>
                    </div>
                  </div>
                </div>
                <div className="ab-stat-row">
                  <div className="ab-stat">
                    <div className="ab-statn"><p data-count="99"><span className="counter">99</span></p><p className="s">+</p></div>
                    <div className="ab-statl">Mobile Lighthouse Score</div>
                  </div>
                  <div className="ab-stat left-border">
                    <div className="ab-statn"><p data-count="48"><span className="counter">48</span></p><p className="s">hr</p></div>
                    <div className="ab-statl">Average Turnkey Launch</div>
                  </div>
                  <div className="ab-stat left-border">
                    <div className="ab-statn"><p data-count="140"><span className="counter">140</span></p><p className="s">+</p></div>
                    <div className="ab-statl">Active Brand Flagships</div>
                  </div>
                  <div className="ab-stat left-border">
                    <div className="ab-statn"><p data-count="99.9"><span className="counter">99.9</span></p><p className="s">%</p></div>
                    <div className="ab-statl">Production Uptime Benchmark</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: STANDARDS / PROMISE */}
          <section className="section-promise">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="section-heading-block align-center">
                <div className="section-subtitle-block">
                  <div className="subtitle-text">05 — Our Standards</div>
                </div>
                <div className="section-title-block">
                  <h2 className="heading-style-h2">Code You Own. Performance You Can Verify.</h2>
                </div>
                <div className="section-summary-block max-width-670px">
                  <p className="text-size-regular text-color--8c8782">
                    Every aB Labs digital package is tested against Google Core Web Vitals and African payment gateway APIs before joining our catalog.
                  </p>
                </div>
              </div>
              <div className="ab-seals">
                <div className="ab-seal">
                  <div className="ab-seal-ring">
                    <div className="ab-seal-tick">
                      <div className="arrow-icon w-embed">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ab-seal-disc">
                      <div className="promise-icon w-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="ab-seal-h">100% Code Ownership</h3>
                  <p className="ab-seal-p">Complete website ownership with bespoke branding, domain connection, and live launch.</p>
                </div>
                <div className="ab-seal">
                  <div className="ab-seal-ring">
                    <div className="ab-seal-tick">
                      <div className="arrow-icon w-embed">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ab-seal-disc">
                      <div className="promise-icon w-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <path d="M16 8h4l3 3v5h-7V8z"></path>
                          <circle cx="5.5" cy="18.5" r="2.5"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="ab-seal-h">Turnkey Live Launch</h3>
                  <p className="ab-seal-p">Automatic GitHub repository invite and ZIP download immediately upon Paystack checkout.</p>
                </div>
                <div className="ab-seal">
                  <div className="ab-seal-ring">
                    <div className="ab-seal-tick">
                      <div className="arrow-icon w-embed">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ab-seal-disc">
                      <div className="promise-icon w-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                          <polyline points="23 4 23 10 17 10"></polyline>
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="ab-seal-h">30-Day Dev Support</h3>
                  <p className="ab-seal-p">Direct technical support for environment setup, custom domains, and Paystack webhooks.</p>
                </div>
                <div className="ab-seal">
                  <div className="ab-seal-ring">
                    <div className="ab-seal-tick">
                      <div className="arrow-icon w-embed">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ab-seal-disc">
                      <div className="promise-icon w-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="ab-seal-h">Zero Platform Subscriptions</h3>
                  <p className="ab-seal-p">Deploy free on Vercel or your own cloud. Never pay recurring monthly website builder fees.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: HOW IT'S ENGINEERED */}
          <section className="section-him">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="section-heading-block align-center">
                <div className="section-subtitle-block">
                  <div className="subtitle-text">06 — How We Engineer</div>
                </div>
                <div className="section-title-block">
                  <h2 className="heading-style-h2">From Design System to Production Deployment.</h2>
                </div>
                <div className="section-summary-block max-width-510px">
                  <p className="text-size-regular text-color--8c8782">
                    A disciplined, engineering-first approach to digital commerce — from atomic UI components to sub-second edge delivery.
                  </p>
                </div>
              </div>
              <div className="ab-proc-in">
                {/* STEP 1 */}
                <div className="ab-flow-row">
                  <div className="ab-flow-img is-1">
                    <img src="/assets/6aa11df30f2e4d72542f8ec8_Step%2001.webp" alt="Design tokens and architecture" loading="lazy" sizes="100vw" className="ab-flow-img-img" />
                    <div className="ab-flow-badge"><div className="him-dot"></div><div>Phase 01</div></div>
                  </div>
                  <div className="ab-flow-txt is-1">
                    <div className="ab-flow-idx">
                      <p className="ab-flow-wm">01</p>
                      <div className="ab-flow-idx-rule"></div>
                      <p className="ab-flow-k">Design &amp; Architecture</p>
                    </div>
                    <h3 className="ab-flow-h">Built from conversion psychology and clean tokens.</h3>
                    <p className="ab-flow-p">
                      Each template begins with rigorous UX wireframes and WCAG-compliant design tokens, perfected for crisp mobile typography, instant visual hierarchy, and intuitive user navigation.
                    </p>
                    <div className="ab-flow-meta">
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          </svg>
                        </div>
                        <div>Semantic Tokens</div>
                      </div>
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          </svg>
                        </div>
                        <div>Mobile-First Grid</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="ab-flow-row">
                  <div className="ab-flow-txt is-2">
                    <div className="ab-flow-idx">
                      <p className="ab-flow-wm">02</p>
                      <div className="ab-flow-idx-rule"></div>
                      <p className="ab-flow-k">Next.js 16 &amp; TypeScript</p>
                    </div>
                    <h3 className="ab-flow-h">Strict typing and zero fragile dependencies.</h3>
                    <p className="ab-flow-p">
                      Engineered with Next.js App Router, Turbopack, and type-safe schemas. Optimized for Core Web Vitals and tested against real-world 3G mobile cellular networks across West Africa.
                    </p>
                    <div className="ab-flow-meta">
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                        </div>
                        <div>100% Type-Safe</div>
                      </div>
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <path d="M12 7v5l3 2"></path>
                          </svg>
                        </div>
                        <div>&lt; 1.2s LCP Benchmark</div>
                      </div>
                    </div>
                  </div>
                  <div id="w-node-_5bfb187c-5cc4-f5c1-d31d-7accf11859c5-e9c951ad" className="ab-flow-img is-2">
                    <img src="/assets/6aa11df33ec80924db4ad236_Step%2002.webp" alt="Clean TypeScript engineering" loading="lazy" sizes="100vw" className="ab-flow-img-img" />
                    <div className="ab-flow-badge"><div className="him-dot"></div><div>Phase 02</div></div>
                  </div>
                </div>

                {/* STEP 3 */}
                <div className="ab-flow-row">
                  <div className="ab-flow-img">
                    <img src="/assets/6aa11df30f2e4d72542f8ec3_Step%2003.webp" alt="Turnkey deployment and Paystack handover" loading="lazy" sizes="100vw" className="ab-flow-img-img" />
                    <div className="ab-flow-badge"><div className="him-dot"></div><div>Phase 03</div></div>
                  </div>
                  <div className="ab-flow-txt">
                    <div className="ab-flow-idx">
                      <p className="ab-flow-wm">03</p>
                      <div className="ab-flow-idx-rule"></div>
                      <p className="ab-flow-k">Turnkey Launch &amp; Payments</p>
                    </div>
                    <h3 className="ab-flow-h">Pre-wired for African transactions.</h3>
                    <p className="ab-flow-p">
                      One-click Vercel deployment with pre-wired Paystack multi-currency webhooks, automated WhatsApp sales channel routing, and complete SEO schema configurations ready from day one.
                    </p>
                    <div className="ab-flow-meta">
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <path d="M16 8h4l3 3v5h-7V8z"></path>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                          </svg>
                        </div>
                        <div>Paystack Pre-Wired</div>
                      </div>
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        </div>
                        <div>1-Click Vercel Deploy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* SECTION: FOOTER */}
        <section className="footer">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="fh-trust">
              <div className="fh-trust-it">
                <div className="footer-icon w-embed">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <path d="M16 8h4l3 3v5h-7V8z"></path>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <div>Instant Code Delivery (GitHub &amp; ZIP)</div>
              </div>
              <div className="fh-trust-it">
                <div className="footer-icon w-embed">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>30-Day Engineering Support</div>
              </div>
              <div className="fh-trust-it">
                <div className="footer-icon w-embed">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                </div>
                <div>100% Clean Code &amp; Full Ownership</div>
              </div>
              <div className="fh-trust-it">
                <div className="footer-icon w-embed">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div>Secure Paystack Checkout</div>
              </div>
            </div>

            <div className="fh-in">
              <div className="fh-main">
                <div className="fh-brand">
                  <Link href="/" className="fh-logo w-inline-block">
                    <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="footer-logo" />
                  </Link>
                  <p className="fh-statement">
                    Production-ready Next.js website templates engineered for ambitious African businesses, agencies, and e-commerce leaders.
                  </p>
                  <div className="w-form">
                    <form id="cta-forms" name="email-form" method="get">
                      <label htmlFor="newsletter-email" className="fh-nl-ey">Join our developer dispatch</label>
                      <div className="fh-nl-form">
                        <input className="fh-nl-inp w-input" maxLength={256} name="email" placeholder="Enter your work email" type="email" id="newsletter-email" required={true} />
                        <button type="submit" className="fh-nl-btn" aria-label="Subscribe">
                          <div className="arrow-icon w-embed">
                            <svg fill="none" width="15" height="15" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </form>
                    <div className="form_message-success w-form-done">
                      <div>You&apos;re subscribed! Expect new template drops &amp; engineering playbooks.</div>
                    </div>
                    <div className="form_message-error w-form-fail">
                      <div>Unable to subscribe right now. Please try again.</div>
                    </div>
                  </div>
                  <div className="fh-soc"><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="fh-si"><div className="arrow-icon w-embed"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></div></a><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="fh-si"><div className="arrow-icon w-embed"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></div></a><a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="fh-si"><div className="arrow-icon w-embed"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path></svg></div></a></div>
                </div>

                <div className="fh-col">
                  <p className="fh-col-h">Templates</p>
                  <Link href="/shop" className="fh-lk a">All Templates (8)</Link>
                  <Link href="/shop?category=ecommerce" className="fh-lk">E-Commerce &amp; Retail</Link>
                  <Link href="/shop?category=real-estate" className="fh-lk a">Real Estate &amp; PropTech</Link>
                  <Link href="/shop?category=corporate" className="fh-lk a">Corporate &amp; Agency</Link>
                  <Link href="/shop?category=saas" className="fh-lk a">Tech Startups &amp; SaaS</Link>
                  <Link href="/shop?category=hospitality" className="fh-lk a">Hospitality &amp; Dining</Link>
                </div>

                <div className="fh-col">
                  <p className="fh-col-h">Company</p>
                  <Link href="/" className="fh-lk a">Home</Link>
                  <Link href="/about-us" aria-current="page" className="fh-lk a w--current">About Us</Link>
                  <Link href="/contact-us" className="fh-lk a">Contact Us</Link>
                  <Link href="/blog" className="fh-lk a">Insights &amp; Playbooks</Link>
                </div>
              </div>

              <div className="footer-border v2"></div>
              <div className="footer-border"></div>
            </div>

            <div className="fh-bot">
              <div className="fh-bot-in">
                <p className="fh-copy">© 2026 aB Labs — Production-Ready Next.js Web Flagships</p>
                <a href="#top" className="fh-top-top w-inline-block">
                  <div>Back to top</div>
                  <div className="fh-toptop-span">
                    <div className="arrow-icon w-embed">
                      <svg fill="none" width="14" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M12 19V5M5 12l7-7 7 7"></path>
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <link rel="stylesheet" href="https://unpkg.com/lenis@1.3.1/dist/lenis.css" />
    </>
  );
}
