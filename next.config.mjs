/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://unpkg.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
];

const nextConfig = {
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '127.0.0.1:3005',
    'localhost:3005',
    '*.localhost',
  ],
  reactStrictMode: false,
  images: {
    unoptimized: true
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true
  },
  async redirects() {
    return [
      {
        source: '/blog-post/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/room-category/:slug*',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/category/:slug*',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/curated-collections/:slug*',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/refund',
        destination: '/refund-policy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
