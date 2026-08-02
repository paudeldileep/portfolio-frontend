import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output:
    process.env.NEXT_OUTPUT_MODE === 'standalone' ? 'standalone' : undefined,

  // Enable React strict mode for surfacing potential issues early
  reactStrictMode: true,

  // Transpile monorepo packages so Next.js handles their TypeScript/JSX
  transpilePackages: ['@portfolio/ui', '@portfolio/tokens', '@portfolio/api-client'],

  // Images: allow external domains if profile photos are hosted externally
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
