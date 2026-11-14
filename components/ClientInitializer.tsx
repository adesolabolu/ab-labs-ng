'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    initABLabs?: (force?: boolean) => void;
    gsap?: any;
    ScrollTrigger?: any;
    SplitText?: any;
    TextPlugin?: any;
    Lenis?: any;
    lenisInstance?: any;
    lenis?: any;
  }
}

export default function ClientInitializer() {
  const pathname = usePathname();
  const initialLoad = useRef(true);

  // Use manual scroll restoration so browsers do not fight Next.js navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Immediately reset scroll on route transition
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      if (window.lenisInstance) {
        try {
          window.lenisInstance.scrollTo(0, { immediate: true });
        } catch (e) {}
      }
    }

    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && typeof window.initABLabs === 'function') {
        window.initABLabs(true);
        setTimeout(() => {
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
          // Ensure page stays pinned to top after interactions/plugins re-calculate
          window.scrollTo(0, 0);
          if (window.lenisInstance) {
            try {
              window.lenisInstance.scrollTo(0, { immediate: true });
            } catch (e) {}
          }
        }, 150);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <Script
        src="/assets/js/jquery-3.5.1.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/js/gsap.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/js/ScrollTrigger.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/js/SplitText.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/js/TextPlugin.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/js/lenis.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/js/ab-labs.js?v=4"
        strategy="afterInteractive"
      />
    </>
  );
}
