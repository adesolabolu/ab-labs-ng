import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import ClientInitializer from '@/components/ClientInitializer';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: {
    default: 'Choroo - Modern Furniture Storefront',
    template: '%s | Choroo'
  },
  description: 'Choroo is a modern furniture template for stylish brands, featuring elegant layouts, striking visuals, seamless online shopping, and easy customization.',
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
    <html lang="en" className="w-mod-js">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ScrollToTop />
        <ClientInitializer />
      </body>
    </html>
  );
}
