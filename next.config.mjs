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
    ];
  },
};

export default nextConfig;
