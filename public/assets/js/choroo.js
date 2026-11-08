/**
 * Choroo Studio — 100% Clean-Room Native JavaScript Interaction Engine
 * Zero Third-Party Builder Runtime • Pure Vanilla ES6, GSAP & Lenis
 * Matches Live choroo.webflow.io Interaction Physics with Single-Pixel Precision
 */

let hasInitializedChoroo = false;

function initChoroo(force = false) {
  if (hasInitializedChoroo && !force) {
    return;
  }
  hasInitializedChoroo = true;

  if (force && typeof window !== 'undefined' && window.gsap) {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach(t => t.kill());
    }
    window.gsap.killTweensOf('*');
  }
  console.log('Choroo 100% Clean-Room Interaction Engine initialized.');

  // =========================================================================
  // 1. Lenis Smooth Scrolling Synchronized with GSAP ScrollTrigger
  // =========================================================================
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1.1
    });

    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', () => {
        ScrollTrigger.update();
      });
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // =========================================================================
  // 2. GSAP Plugins & Multi-Page Hero Entrance Sequences (Exact Webflow IX)
  // =========================================================================
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);
    if (typeof TextPlugin !== 'undefined') gsap.registerPlugin(TextPlugin);

    // -----------------------------------------------------------------------
    // A. Home Page Hero Entrance Sequence (Timeline t-f110dbe7)
    // -----------------------------------------------------------------------
    const heroH = document.querySelector('.hero-h');
    const heroEyebrow = document.querySelector('.hero-eyebrow');
    const heroLead = document.querySelector('.hero-lead');
    const heroBtn = document.querySelector('.hero-button-wrapper');
    const heroCard = document.querySelector('.hero-card');
    const heroThumb = document.querySelector('.hero-thumb');
    const heroContentWrapper = document.querySelector('.hero-content-wrapper');

    if (heroH || heroEyebrow || heroContentWrapper) {
      // 1. Pre-set starting properties while elements are still hidden by CSS
      if (heroContentWrapper) gsap.set(heroContentWrapper, { yPercent: -100, opacity: 0 });
      if (heroEyebrow) gsap.set(heroEyebrow, { opacity: 0, y: 16 });
      if (heroBtn) gsap.set(heroBtn, { opacity: 0, y: 16 });
      if (heroCard) gsap.set(heroCard, { opacity: 0, y: 16 });
      if (heroThumb) gsap.set(heroThumb, { opacity: 0, y: 16 });
      if (heroLead) gsap.set(heroLead, { opacity: 0, y: 16 });

      let splitChars = null;
      if (heroH && typeof SplitText !== 'undefined') {
        try {
          const splitH = new SplitText(heroH, { type: 'words,chars', charsClass: 'split-char' });
          splitChars = splitH.chars;
          gsap.set(splitChars, { opacity: 0, y: 40 });
        } catch (e) {
          gsap.set(heroH, { opacity: 0, y: 30 });
        }
      } else if (heroH) {
        gsap.set(heroH, { opacity: 0, y: 30 });
      }

      let splitLines = null;
      if (heroLead && typeof SplitText !== 'undefined') {
        try {
          const splitL = new SplitText(heroLead, { type: 'lines' });
          splitLines = splitL.lines;
          gsap.set(heroLead, { opacity: 1, y: 0 });
          gsap.set(splitLines, { opacity: 0, y: 16 });
        } catch (e) {
          gsap.set(heroLead, { opacity: 0, y: 16 });
        }
      }

      // 2. Release visibility lock NOW (elements are pre-transformed and 0 opacity, so ZERO FOUC!)
      document.documentElement.classList.add('choroo-ready');

      // 3. Play entrance timeline
      const heroTl = gsap.timeline();
      if (heroContentWrapper) {
        heroTl.to(heroContentWrapper, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power1.out' }, 0);
      }
      if (heroEyebrow) {
        heroTl.to(heroEyebrow, { opacity: 1, y: 0, duration: 0.8, ease: 'power1.out' }, 0.2);
      }
      if (splitChars) {
        heroTl.to(splitChars, { opacity: 1, y: 0, duration: 0.7, stagger: 0.035, ease: 'power1.out' }, 0.4);
      } else if (heroH) {
        heroTl.to(heroH, { opacity: 1, y: 0, duration: 0.8, ease: 'power1.out' }, 0.4);
      }
      if (heroBtn) {
        heroTl.to(heroBtn, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.9);
      }
      if (heroCard) {
        heroTl.to(heroCard, { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, 1.0);
      }
      if (heroThumb) {
        heroTl.to(heroThumb, { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, 1.1);
      }
      if (splitLines) {
        heroTl.to(splitLines, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power1.out' }, 1.2);
      } else if (heroLead) {
        heroTl.to(heroLead, { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, 1.2);
      }
    }

    // -----------------------------------------------------------------------
    // B. About Us Hero Entrance Sequence (Timeline t-28e5bcf5)
    // -----------------------------------------------------------------------
    const aboutSummary = document.querySelector('.about-hero-summary');
    if (aboutSummary) {
      const abSub = document.querySelector('.hero-subtitle-block');
      const abH1 = document.querySelector('.heading-style-h1');
      const abRight = document.querySelector('.ab-hero-right');
      const abActions = document.querySelector('.ab-hero-actions');
      const abMeta = document.querySelectorAll('.ab-hero-meta');

      if (abSub) gsap.set(abSub, { opacity: 0, y: 16 });
      if (abRight) gsap.set(abRight, { opacity: 0, scale: 0.98 });
      if (abActions) gsap.set(abActions, { opacity: 0, y: 16 });
      if (abMeta.length > 0) gsap.set(abMeta, { opacity: 0, y: 16 });

      let splitAbChars = null;
      if (abH1 && typeof SplitText !== 'undefined') {
        try {
          const splitAb = new SplitText(abH1, { type: 'words,chars', charsClass: 'split-char' });
          splitAbChars = splitAb.chars;
          gsap.set(splitAbChars, { opacity: 0, y: 16 });
        } catch (e) {
          gsap.set(abH1, { opacity: 0, y: 16 });
        }
      } else if (abH1) {
        gsap.set(abH1, { opacity: 0, y: 16 });
      }

      let splitAbLines = null;
      if (typeof SplitText !== 'undefined') {
        try {
          const splitAbS = new SplitText(aboutSummary, { type: 'lines' });
          splitAbLines = splitAbS.lines;
          gsap.set(splitAbLines, { opacity: 0, y: 16 });
        } catch (e) {
          gsap.set(aboutSummary, { opacity: 0, y: 16 });
        }
      } else {
        gsap.set(aboutSummary, { opacity: 0, y: 16 });
      }

      // Release visibility lock
      document.documentElement.classList.add('choroo-ready');

      const aboutTl = gsap.timeline();
      if (abSub) {
        aboutTl.to(abSub, { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, 0.1);
      }
      if (splitAbChars) {
        aboutTl.to(splitAbChars, { opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: 'power1.out' }, 0.4);
      } else if (abH1) {
        aboutTl.to(abH1, { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, 0.4);
      }
      if (abRight) {
        aboutTl.to(abRight, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 0.57);
      }
      if (splitAbLines) {
        aboutTl.to(splitAbLines, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power1.out' }, 1.2);
      } else {
        aboutTl.to(aboutSummary, { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, 1.2);
      }
      if (abActions) {
        aboutTl.to(abActions, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.5);
      }
      if (abMeta.length > 0) {
        aboutTl.to(abMeta, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power1.out' }, 1.7);
      }

      // About Page Scroll Interactions:
      // Timeline t-03ca24f8: ab-tl-rail vertical scrub
      const tlRails = document.querySelectorAll('.ab-tl-rail');
      tlRails.forEach((rail) => {
        gsap.fromTo(rail, 
          { height: '0%' }, 
          { 
            height: '100%', 
            ease: 'none',
            scrollTrigger: {
              trigger: rail.closest('.ab-tl-item') || rail,
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: true
            }
          }
        );
      });

      // Timeline t-bae3a039: ab-seal badge fan-out
      const seals = document.querySelectorAll('.ab-seal');
      if (seals.length > 0) {
        const sealWrap = document.querySelector('.ab-flow-seals, .ab-seals-wrap') || seals[0].parentElement;
        gsap.from(seals, {
          scrollTrigger: {
            trigger: sealWrap,
            start: 'top 85%',
            once: true
          },
          scale: 0.6,
          xPercent: (idx) => -(idx * 75),
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out'
        });
      }

      // Timeline t-c1771a23: ab-flow-row tilt/entrance
      const flowRows = document.querySelectorAll('.ab-flow-row');
      flowRows.forEach((row) => {
        const img = row.querySelector('.ab-flow-img');
        const txt = row.querySelector('.ab-flow-txt');
        if (img && txt) {
          gsap.from([img, txt], {
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              once: true
            },
            y: 32,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out'
          });
        }
      });

      // Timeline t-533b7749: About manifesto character color scrub on scroll
      const manifestoTitle = document.querySelector('.title-42px');
      if (manifestoTitle && typeof SplitText !== 'undefined') {
        try {
          const splitManifesto = new SplitText(manifestoTitle, { type: 'words,chars', charsClass: 'manifesto-char' });
          gsap.fromTo(splitManifesto.chars, 
            { color: '#8c8782' }, 
            { 
              color: '#161514', 
              stagger: 0.04, 
              ease: 'none',
              scrollTrigger: {
                trigger: manifestoTitle,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: 0.8
              }
            }
          );
        } catch (e) {
          console.warn('Manifesto SplitText error:', e);
        }
      }
    }

    // -----------------------------------------------------------------------
    // C. Inner Pages Hero Entrance (Timeline t-4c3a2a95)
    // Applies to Blog, Shop, Categories, PDP, Room Categories, etc.
    // -----------------------------------------------------------------------
    const hasHomeHero = document.querySelector('.hero-h');
    const hasAboutHero = document.querySelector('.about-hero-summary');
    const innerH1 = document.querySelector('.heading-style-h1');

    if (!hasHomeHero && !hasAboutHero && innerH1) {
      const innerSub = document.querySelector('.hero-subtitle-block');
      const innerSummary = document.querySelector('.hero-summary');
      const innerTags = document.querySelectorAll('.ab-flow-tag');

      if (innerSub) gsap.set(innerSub, { opacity: 0, y: 16 });
      if (innerTags.length > 0) gsap.set(innerTags, { opacity: 0, y: 16 });

      let splitInnerChars = null;
      if (typeof SplitText !== 'undefined') {
        try {
          const splitInner = new SplitText(innerH1, { type: 'words,chars', charsClass: 'split-char' });
          splitInnerChars = splitInner.chars;
          gsap.set(splitInnerChars, { opacity: 0, y: 16 });
        } catch (e) {
          gsap.set(innerH1, { opacity: 0, y: 16 });
        }
      } else {
        gsap.set(innerH1, { opacity: 0, y: 16 });
      }

      let splitInnerLines = null;
      if (innerSummary && typeof SplitText !== 'undefined') {
        try {
          const splitInnerS = new SplitText(innerSummary, { type: 'lines' });
          splitInnerLines = splitInnerS.lines;
          gsap.set(splitInnerLines, { opacity: 0, y: 16 });
        } catch (e) {
          gsap.set(innerSummary, { opacity: 0, y: 16 });
        }
      } else if (innerSummary) {
        gsap.set(innerSummary, { opacity: 0, y: 16 });
      }

      // Release visibility lock
      document.documentElement.classList.add('choroo-ready');

      const innerTl = gsap.timeline();
      if (innerSub) {
        innerTl.to(innerSub, { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, 0.1);
      }
      if (splitInnerChars) {
        innerTl.to(splitInnerChars, { opacity: 1, y: 0, duration: 0.6, stagger: 0.035, ease: 'power1.out' }, 0.35);
      } else {
        innerTl.to(innerH1, { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, 0.35);
      }
      if (splitInnerLines) {
        innerTl.to(splitInnerLines, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power1.out' }, 0.9);
      } else if (innerSummary) {
        innerTl.to(innerSummary, { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, 0.9);
      }
      if (innerTags.length > 0) {
        innerTl.to(innerTags, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power1.out' }, 1.2);
      }
    }

    // Safety fallback: ensure choroo-ready is added on all pages
    document.documentElement.classList.add('choroo-ready');

    // ScrollTrigger Character Split for Section Headings
    const sectionHeadings = document.querySelectorAll('.heading-style-h2:not(.story-title)');
    sectionHeadings.forEach((h2) => {
      try {
        if (typeof SplitText !== 'undefined') {
          const split = new SplitText(h2, { type: 'words,chars', charsClass: 'split-char' });
          gsap.from(split.chars, {
            scrollTrigger: { trigger: h2, start: 'top 90%', once: true },
            yPercent: 105,
            opacity: 0,
            duration: 0.75,
            stagger: 0.02,
            ease: 'power2.out'
          });
        }
      } catch (err) {
        gsap.from(h2, {
          scrollTrigger: { trigger: h2, start: 'top 90%', once: true },
          y: 25,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    });

    // Staggered Fade-in on [fade-in="true"] (Excluding review cards to prevent duplicate tweens)
    const fadeContainers = document.querySelectorAll('[fade-in="true"]:not(.pd-rev-list):not(.pd-rev-top):not(.blog-wrappper)');
    fadeContainers.forEach((container) => {
      const children = Array.from(container.children);
      if (children.length > 0) {
        gsap.from(children, {
          scrollTrigger: { trigger: container, start: 'top 90%', once: true },
          y: 20,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power2.out'
        });
      }
    });

    // Discovery Section Story Title Line-Mask Reveal ("Make Every Room Feel Considered...")
    const storyTitle = document.querySelector('.story-title');
    if (storyTitle && typeof SplitText !== 'undefined') {
      try {
        const split = new SplitText(storyTitle, { type: 'lines', linesClass: 'gsap_split_line' });
        split.lines.forEach((line, i) => {
          const mask = document.createElement('span');
          mask.className = `gsap_split_line-mask gsap_split_line${i+1}-mask`;
          mask.style.cssText = 'text-align: start; overflow: clip; position: relative; display: block;';
          line.parentNode.insertBefore(mask, line);
          mask.appendChild(line);
          line.style.cssText = 'text-align: start; position: relative; display: block; transform: translate(0px, 16px); opacity: 0;';
        });

        gsap.to(split.lines, {
          scrollTrigger: {
            trigger: storyTitle,
            start: 'top 85%',
            once: true
          },
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power2.out'
        });
      } catch (err) {
        console.warn('Story title SplitText error:', err);
      }
    }

    // Product Detail: Reviews Top Summary Animation (Single Clean Tween)
    const revTop = document.querySelector('.pd-rev-top');
    if (revTop) {
      const topChildren = revTop.querySelectorAll('.pd-rev-score, .pd-rev-bars, .pd-rev-cta');
      if (topChildren.length > 0) {
        gsap.from(topChildren, {
          scrollTrigger: {
            trigger: revTop,
            start: 'top 85%',
            once: true
          },
          y: 16,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        });
      }
    }

    // Product Detail: Review Cards Stagger (Single Clean Tween, No Conflicts)
    const revList = document.querySelector('.pd-rev-list');
    if (revList) {
      const reviewCards = revList.querySelectorAll('.pd-rev-card');
      if (reviewCards.length > 0) {
        gsap.from(reviewCards, {
          scrollTrigger: {
            trigger: revList,
            start: 'top 85%',
            once: true
          },
          y: 20,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out'
        });
      }
    }

    // Blog Page: Editorial Cards Stagger
    const blogWrapper = document.querySelector('.blog-wrappper');
    if (blogWrapper) {
      const blogCards = blogWrapper.querySelectorAll('.blog-single-item-card, .bl-feat');
      if (blogCards.length > 0) {
        gsap.from(blogCards, {
          scrollTrigger: {
            trigger: blogWrapper,
            start: 'top 85%',
            once: true
          },
          y: 24,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power2.out'
        });
      }
    }

    // Summaries and Description Paragraphs Reveal
    const summaries = document.querySelectorAll('[summary="true"]:not(.story-title), [data-summary="true"]:not(.story-title), .abt-desc');
    summaries.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  }

  // =========================================================================
  // 3. Number Counter Animation (Native IntersectionObserver)
  // =========================================================================
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const runCounter = (el) => {
      const raw = el.textContent.trim();
      const numeric = raw.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
      const target = parseFloat(numeric);
      if (isNaN(target)) return;

      const decimals = (numeric.split('.')[1] || '').length;
      const duration = parseFloat(el.getAttribute('data-duration')) || 2;
      const obj = { value: 0 };

      if (typeof gsap !== 'undefined') {
        gsap.to(obj, {
          value: target,
          duration: duration,
          ease: 'power1.out',
          onUpdate: () => {
            el.textContent = obj.value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        });
      } else {
        el.textContent = target;
      }
    };

    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach((el) => counterObs.observe(el));
  }

  // =========================================================================
  // 4. Announcement Ticker Cycling (every 3.5s)
  // =========================================================================
  const tickerItems = document.querySelectorAll('.anbar-trackon');
  if (tickerItems.length > 0) {
    let currentTicker = 0;
    tickerItems[0].classList.add('is-active');
    setInterval(() => {
      tickerItems[currentTicker].classList.remove('is-active');
      currentTicker = (currentTicker + 1) % tickerItems.length;
      tickerItems[currentTicker].classList.add('is-active');
    }, 3500);
  }

  // =========================================================================
  // 5. Hero 4-Stage Continuous Curtain Wipe Loop (Exact Webflow IX t-976369a7)
  // =========================================================================
  const stageImages = [
    document.querySelector('.hero-stage-img.is-4'),
    document.querySelector('.hero-stage-img.is-3'),
    document.querySelector('.hero-stage-img.is-2'),
    document.querySelector('.hero-stage-img:not(.is-2):not(.is-3):not(.is-4)')
  ];

  if (stageImages[0] && stageImages[1] && stageImages[2] && typeof gsap !== 'undefined') {
    // Initial styles
    gsap.set(['.hero-stage-img.is-4', '.hero-stage-img.is-3', '.hero-stage-img.is-2'], {
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    });

    const stageLoop = gsap.timeline({ repeat: -1 });
    stageLoop
      // Stage 4 visible for 3.5s, then wipe width from 100% to 0% over 1.7s
      .to('.hero-stage-img.is-4', { width: '0%', duration: 1.7, ease: 'power1.inOut' }, '+=3.5')
      // Stage 3 visible for 3.5s, then wipe width from 100% to 0% over 1.7s
      .to('.hero-stage-img.is-3', { width: '0%', duration: 1.7, ease: 'power1.inOut' }, '+=3.5')
      // Stage 2 visible for 3.5s, then wipe width from 100% to 0% over 1.7s
      .to('.hero-stage-img.is-2', { width: '0%', duration: 1.7, ease: 'power1.inOut' }, '+=3.5')
      // Stage 1 (base) visible for 3.5s, then reset all widths back to 100% instantly
      .set(['.hero-stage-img.is-2', '.hero-stage-img.is-3', '.hero-stage-img.is-4'], { width: '100%' }, '+=3.5');

    // Thumbnail click interaction
    const thumbs = document.querySelectorAll('.hero-thumb, .hero-card-link');
    thumbs.forEach((thumb, idx) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        stageLoop.pause();
        if (idx === 0) {
          gsap.set(['.hero-stage-img.is-2', '.hero-stage-img.is-3', '.hero-stage-img.is-4'], { width: '100%' });
        } else if (idx === 1) {
          gsap.set('.hero-stage-img.is-4', { width: '0%' });
          gsap.set(['.hero-stage-img.is-2', '.hero-stage-img.is-3'], { width: '100%' });
        } else if (idx === 2) {
          gsap.set(['.hero-stage-img.is-4', '.hero-stage-img.is-3'], { width: '0%' });
          gsap.set('.hero-stage-img.is-2', { width: '100%' });
        } else {
          gsap.set(['.hero-stage-img.is-4', '.hero-stage-img.is-3', '.hero-stage-img.is-2'], { width: '0%' });
        }
      });
    });
  }

  // =========================================================================
  // 6. Curated Collections Accordion
  // =========================================================================
  const accordionItems = document.querySelectorAll('.col-item');
  if (accordionItems.length > 0) {
    accordionItems.forEach((item, index) => {
      const header = item.querySelector('.col-item-hd');
      const body = item.querySelector('.curated-body-items');
      if (header && body) {
        if (index === 0) {
          header.setAttribute('is-active', 'true');
          body.style.height = '218px';
          body.style.overflow = 'hidden';
        } else {
          header.setAttribute('is-active', '');
          body.style.height = '0px';
          body.style.overflow = 'hidden';
        }

        header.addEventListener('click', (e) => {
          e.preventDefault();
          const isCurrentlyActive = header.getAttribute('is-active') === 'true';

          accordionItems.forEach((other) => {
            const otherHeader = other.querySelector('.col-item-hd');
            const otherBody = other.querySelector('.curated-body-items');
            if (otherHeader && otherBody) {
              otherHeader.setAttribute('is-active', '');
              if (window.gsap) {
                gsap.to(otherBody, {
                  height: 0,
                  duration: 0.35,
                  ease: 'power2.out',
                  onComplete: () => {
                    if (window.ScrollTrigger) ScrollTrigger.refresh();
                  }
                });
              } else {
                otherBody.style.height = '0px';
              }
            }
          });

          if (!isCurrentlyActive) {
            header.setAttribute('is-active', 'true');
            if (window.gsap) {
              gsap.to(body, {
                height: 218,
                duration: 0.45,
                ease: 'power2.out',
                onComplete: () => {
                  if (window.ScrollTrigger) ScrollTrigger.refresh();
                }
              });
            } else {
              body.style.height = '218px';
            }
          }
        });
      }
    });
  }

  // =========================================================================
  // 7. Universal Tabs System (Product Gallery, Swatches, PDP Details)
  // =========================================================================
  const tabContainers = document.querySelectorAll('.w-tabs');
  tabContainers.forEach((container) => {
    const tabLinks = container.querySelectorAll('.w-tab-link');
    const tabPanes = container.querySelectorAll('.w-tab-pane');

    tabLinks.forEach((link, idx) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Update links
        tabLinks.forEach((l) => {
          l.classList.remove('w--current');
          l.setAttribute('aria-selected', 'false');
        });
        link.classList.add('w--current');
        link.setAttribute('aria-selected', 'true');

        // Update panes
        tabPanes.forEach((p, pIdx) => {
          if (pIdx === idx) {
            p.classList.add('w--tab-active');
            p.style.display = 'block';
          } else {
            p.classList.remove('w--tab-active');
            p.style.display = 'none';
          }
        });
      });
    });
  });

  // =========================================================================
  // 8. Dropdown Mega-Menu
  // =========================================================================
  const dropdowns = document.querySelectorAll('.nav-dropdown, .w-dropdown');
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown, .w-dropdown-toggle');
    const list = dropdown.querySelector('.nav-dropdown-list, .w-dropdown-list');

    if (toggle && list) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = dropdown.classList.contains('w--open');
        dropdowns.forEach((other) => {
          other.classList.remove('w--open');
          const otherToggle = other.querySelector('.dropdown, .w-dropdown-toggle');
          const otherList = other.querySelector('.nav-dropdown-list, .w-dropdown-list');
          if (otherToggle) otherToggle.classList.remove('w--open');
          if (otherList) otherList.classList.remove('w--open');
        });

        if (!isOpen) {
          dropdown.classList.add('w--open');
          toggle.classList.add('w--open');
          list.classList.add('w--open');
        }
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown, .w-dropdown')) {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove('w--open');
        const toggle = dropdown.querySelector('.dropdown, .w-dropdown-toggle');
        const list = dropdown.querySelector('.nav-dropdown-list, .w-dropdown-list');
        if (toggle) toggle.classList.remove('w--open');
        if (list) list.classList.remove('w--open');
      });
    }
  });

  // =========================================================================
  // 9. Mobile Navigation Drawer & Hamburger Toggle
  // =========================================================================
  const menuBtn = document.querySelector('.menu-button, .w-nav-button');
  const navMenu = document.querySelector('.nav-menu, .w-nav-menu');
  const navOverlay = document.querySelector('.w-nav-overlay');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = navMenu.classList.contains('is-open');
      if (isOpen) {
        navMenu.classList.remove('is-open');
        menuBtn.classList.remove('w--open');
        if (navOverlay) navOverlay.style.display = 'none';
        document.body.style.overflow = '';
      } else {
        navMenu.classList.add('is-open');
        menuBtn.classList.add('w--open');
        if (navOverlay) navOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        menuBtn.classList.remove('w--open');
        navOverlay.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
  }

  // =========================================================================
  // 10. Slide-Over Cart Drawer & Commerce Counter Simulation
  // =========================================================================
  const cartOpenBtns = document.querySelectorAll('.cart-button-wrapper, .w-commerce-commercecartopenlink');
  const cartCloseBtns = document.querySelectorAll('.close-icons, .w-commerce-commercecartcloselink');
  const cartWrapper = document.querySelector('.cart-wrapper, .w-commerce-commercecartcontainerwrapper');
  const cartCountBadges = document.querySelectorAll('.cart-number, .w-commerce-commercecartopenlinkcount');
  let cartCount = 0;

  const openCart = () => {
    if (cartWrapper) {
      cartWrapper.style.display = 'flex';
      requestAnimationFrame(() => {
        cartWrapper.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }
  };

  const closeCart = () => {
    if (cartWrapper) {
      cartWrapper.classList.remove('is-open');
      setTimeout(() => {
        cartWrapper.style.display = 'none';
        document.body.style.overflow = '';
      }, 350);
    }
  };

  cartOpenBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  });

  cartCloseBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCart();
    });
  });

  if (cartWrapper) {
    cartWrapper.addEventListener('click', (e) => {
      if (e.target === cartWrapper) {
        closeCart();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cartWrapper.classList.contains('is-open')) {
        closeCart();
      }
    });
  }

  // Add to Cart Buttons
  const addToCartBtns = document.querySelectorAll('.add-cart-button-wrapper, .add-to-cart-button, [data-node-type="commerce-add-to-cart-button"], input[value*="Add to Cart"]');
  addToCartBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const qtyInput = document.querySelector('.pd-qty, input[name="commerce-add-to-cart-quantity-input"]');
      const addedQty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
      cartCount += addedQty;

      cartCountBadges.forEach((badge) => {
        badge.textContent = cartCount;
      });

      const cartForm = document.querySelector('.w-commerce-commercecartform');
      const cartEmpty = document.querySelector('.w-commerce-commercecartemptystate');
      if (cartForm) cartForm.style.display = 'block';
      if (cartEmpty) cartEmpty.style.display = 'none';

      openCart();
    });
  });

  // PDP Variant Radio Pills
  const variantPills = document.querySelectorAll('.verient-button, [data-node-type="commerce-add-to-cart-pill"]');
  variantPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const parentGroup = pill.closest('.verient-button-wrapper, [role="radiogroup"]');
      if (parentGroup) {
        parentGroup.querySelectorAll('.verient-button, [data-node-type="commerce-add-to-cart-pill"]').forEach((p) => {
          p.classList.remove('is-active');
          p.setAttribute('aria-checked', 'false');
        });
      }
      pill.classList.add('is-active');
      pill.setAttribute('aria-checked', 'true');
    });
  });

  // =========================================================================
  // 11. Search Modal Overlay Trigger
  // =========================================================================
  const searchTriggers = document.querySelectorAll('.search-button-wrapper, [data-search-trigger], .nav-search, a[href="#search"]');
  const searchWrapper = document.querySelector('.search-wrapper');
  const searchClose = document.querySelector('.search-close-btn, .search-overlay, [data-search-close]');

  if (searchWrapper) {
    searchTriggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        searchWrapper.classList.add('is-open');
        const input = searchWrapper.querySelector('input');
        if (input) input.focus();
      });
    });

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchWrapper.classList.remove('is-open');
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchWrapper.classList.contains('is-open')) {
        searchWrapper.classList.remove('is-open');
      }
    });
  }

  // =========================================================================
  // 12. Testimonial Slider Controls (On-Demand Navigation via Left/Right Arrows)
  // =========================================================================
  const testimonialSlider = document.querySelector('.testimonial-slider-wrapper');
  if (testimonialSlider) {
    const slides = testimonialSlider.querySelectorAll('.testimonial-slider-mask .w-slide');
    const prevBtn = testimonialSlider.querySelector('.testimonial-button-block.left, .w-slider-arrow-left, .slider-left');
    const nextBtn = testimonialSlider.querySelector('.testimonial-button-block.right, .w-slider-arrow-right, .slider-right');

    if (slides.length > 0) {
      let currentSlide = 0;
      const totalSlides = slides.length;

      function updateSlides() {
        const slideWidth = slides[0].offsetWidth || 710;
        slides.forEach((slide, idx) => {
          slide.style.transition = 'transform 500ms ease, opacity 500ms ease';
          slide.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
          if (idx === currentSlide) {
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.zIndex = '1';
          } else {
            slide.style.opacity = '1';
            slide.style.visibility = 'hidden';
            slide.style.zIndex = '0';
          }
        });
      }

      // Initial state
      updateSlides();

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          currentSlide = (currentSlide + 1) % totalSlides;
          updateSlides();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
          updateSlides();
        });
      }
    }
  }


  // =========================================================================
  // 13. Dynamic In-Page Filtering (Blog Categories & Shop Room Categories)
  // =========================================================================
  function initDynamicFilters() {
    // A. Blog In-Page Category Filtering
    const blogPills = document.querySelectorAll('.section-blog-page .bl-pills .bl-pill');
    const blogCards = document.querySelectorAll('.blog-wrappper > .w-dyn-item');

    if (blogPills.length > 0 && blogCards.length > 0) {
      blogPills.forEach((pill) => {
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          blogPills.forEach((p) => p.classList.remove('w--current'));
          pill.classList.add('w--current');

          const filter = pill.getAttribute('data-filter') || 'all';

          blogCards.forEach((card) => {
            const cardCat = card.getAttribute('data-category');
            if (filter === 'all' || cardCat === filter) {
              card.style.display = 'block';
              if (window.gsap) {
                gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out', clearProps: 'transform' });
              } else {
                card.style.opacity = '1';
              }
            } else {
              if (window.gsap) {
                gsap.to(card, {
                  opacity: 0,
                  scale: 0.98,
                  duration: 0.2,
                  ease: 'power2.in',
                  onComplete: () => {
                    card.style.display = 'none';
                  }
                });
              } else {
                card.style.display = 'none';
              }
            }
          });

          setTimeout(() => {
            if (window.ScrollTrigger) ScrollTrigger.refresh();
          }, 350);
        });
      });

      // Also wire category badges on blog cards to click their matching pill
      document.querySelectorAll('.bl-card-cat').forEach((catBadge) => {
        catBadge.addEventListener('click', (e) => {
          e.preventDefault();
          const catFilter = catBadge.getAttribute('data-filter') || catBadge.textContent.trim().toLowerCase().replace(/\s+/g, '-');
          const targetPill = document.querySelector(`.section-blog-page .bl-pills [data-filter="${catFilter}"]`);
          if (targetPill) {
            targetPill.click();
            targetPill.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      });
    }

    // B. Shop In-Page Room Category Filtering
    const shopPills = document.querySelectorAll('.section-shop .bl-pills .bl-pill');
    const shopCards = document.querySelectorAll('.products-content-wrapper > .w-dyn-item');

    if (shopPills.length > 0 && shopCards.length > 0) {
      shopPills.forEach((pill) => {
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          shopPills.forEach((p) => p.classList.remove('w--current'));
          pill.classList.add('w--current');

          const filter = pill.getAttribute('data-filter') || 'all';

          shopCards.forEach((card) => {
            const cardRooms = (card.getAttribute('data-room') || '').split(/\s+/);
            const matches = filter === 'all' || cardRooms.includes(filter);

            if (matches) {
              card.style.display = 'block';
              if (window.gsap) {
                gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out', clearProps: 'transform' });
              } else {
                card.style.opacity = '1';
              }
            } else {
              if (window.gsap) {
                gsap.to(card, {
                  opacity: 0,
                  scale: 0.98,
                  duration: 0.2,
                  ease: 'power2.in',
                  onComplete: () => {
                    card.style.display = 'none';
                  }
                });
              } else {
                card.style.display = 'none';
              }
            }
          });

          setTimeout(() => {
            if (window.ScrollTrigger) ScrollTrigger.refresh();
          }, 350);
        });
      });
    }
  }

  initDynamicFilters();

  // =========================================================================
  // 12. Clean-Room Form Submissions (Zero Webflow Backend / 100% Client-Side)
  // =========================================================================
  const forms = document.querySelectorAll('.w-form form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
      const waitText = submitBtn ? submitBtn.getAttribute('data-wait') : null;
      const originalVal = submitBtn ? (submitBtn.value || submitBtn.textContent) : '';
      
      if (waitText && submitBtn) {
        if (submitBtn.tagName === 'INPUT') submitBtn.value = waitText;
        else submitBtn.textContent = waitText;
      }
      
      setTimeout(() => {
        const parentWForm = form.closest('.w-form');
        if (parentWForm) {
          const doneBlock = parentWForm.querySelector('.w-form-done');
          const failBlock = parentWForm.querySelector('.w-form-fail');
          if (failBlock) failBlock.style.display = 'none';
          if (doneBlock) {
            form.style.display = 'none';
            doneBlock.style.display = 'block';
          }
        }
        if (submitBtn) {
          if (submitBtn.tagName === 'INPUT') submitBtn.value = originalVal;
          else submitBtn.textContent = originalVal;
        }
      }, 500);
    });
  });
}

if (typeof window !== 'undefined') {
  window.initChoroo = initChoroo;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initChoroo());
  } else {
    initChoroo();
  }
}


// Ensure all layout coordinates are refreshed when images and fonts finish loading
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  setTimeout(() => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }, 300);
}
