import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Prettier formatting errors in existing files — fix separately, don't block deploys
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
      },
    ],
  },
};

export default nextConfig;

