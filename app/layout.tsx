import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import ClientInitializer from '@/components/ClientInitializer';
import ScrollToTop from '@/components/ScrollToTop';
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
    icon: '/assets/6abc9a73889258d54f8515ca_Favicon%20(256x256).png',
    apple: '/assets/6abc9a733a9ac776108332dd_Favicon%20(256x256).png'
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
      </head>
      <body>
        <CartProvider>
          {children}
          <ScrollToTop />
          <ClientInitializer />
        </CartProvider>
      </body>
    </html>
  );
}
