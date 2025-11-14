import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize images for better performance and SEO
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression
  compress: true,

  // Turbopack configuration (Next.js 16+ uses Turbopack by default)
  turbopack: {},

  // Webpack configuration for PDF parsing
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore canvas module on server (not needed for PDF parsing)
      config.resolve.alias.canvas = false;
      
      // Disable worker for pdfjs-dist in serverless
      config.resolve.alias['pdfjs-dist/build/pdf.worker.entry'] = false;
    }

    return config;
  },

  // Headers for better SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
