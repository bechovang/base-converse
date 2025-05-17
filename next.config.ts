import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Bỏ qua lỗi TypeScript & ESLint khi build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Cho phép load ảnh từ placehold.co
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Dùng SWC WebAssembly thay vì native
  swcMinify: true,
  experimental: {
    swcPlugins: [],
    forceSwcTransforms: true,
  },
};

export default nextConfig;
