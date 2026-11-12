/** @type {import('next').NextConfig} */
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
    ];
  },
};

export default nextConfig;
