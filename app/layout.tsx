import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import ClientInitializer from '@/components/ClientInitializer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppFab from '@/components/WhatsAppFab';
import { CartProvider } from '@/context/CartContext';
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
  SITE_LOCALE,
  SITE_TWITTER,
  DEFAULT_OG_IMAGE,
} from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    'website templates Nigeria',
    'web design agency Nigeria',
    'affordable websites Lagos',
    'ecommerce website Nigeria',
    'business website templates',
    'aB Labs'
  ],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: SITE_URL,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE]
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_TWITTER,
    creator: SITE_TWITTER,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  icons: {
    icon: [
      { url: '/assets/favicon/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/favicon/favicon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/assets/favicon/favicon-32.png',
    apple: '/assets/favicon/apple-touch-icon.png'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="site-mod-js">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Umami Analytics — Telemetry & Traffic */}
        <Script
          src={`${process.env.NEXT_PUBLIC_UMAMI_HOST_URL || 'https://umami-tracker-8hgi.vercel.app'}/script.js`}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || 'dcd3a1e0-7b7b-42aa-bdbb-59ac022198c2'}
          strategy="afterInteractive"
        />
        {/* Umami Analytics — 100% Session Replay Capture */}
        <Script
          src={`${process.env.NEXT_PUBLIC_UMAMI_HOST_URL || 'https://umami-tracker-8hgi.vercel.app'}/recorder.js`}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || 'dcd3a1e0-7b7b-42aa-bdbb-59ac022198c2'}
          strategy="afterInteractive"
        />
      </head>
      <body>
        <CartProvider>
          {children}
          <ScrollToTop />
          <WhatsAppFab />
          <ClientInitializer />
        </CartProvider>
      </body>
    </html>
  );
}
