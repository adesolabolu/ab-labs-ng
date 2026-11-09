/** @type {import('next').NextConfig} */
const nextConfig = {
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
