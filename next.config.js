/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    path: '/_next/image',
    cacheDirectory: '/tmp/next-image-cache' // Use a writable path
  }
};

module.exports = nextConfig;
