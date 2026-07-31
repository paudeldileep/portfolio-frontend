import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output:
    process.env.NEXT_OUTPUT_MODE === 'standalone' ? 'standalone' : undefined,
  reactStrictMode: true,
  transpilePackages: ['@portfolio/ui', '@portfolio/tokens'],
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ];
    const privateHeaders = [
      {
        key: 'Cache-Control',
        value: 'private, no-store, max-age=0, must-revalidate',
      },
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      { source: '/dashboard/:path*', headers: privateHeaders },
      { source: '/posts/:path*', headers: privateHeaders },
      { source: '/portfolio/:path*', headers: privateHeaders },
      { source: '/auth/:path*', headers: privateHeaders },
    ];
  },
};

export default nextConfig;
