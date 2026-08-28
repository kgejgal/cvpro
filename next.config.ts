import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@dnd-kit/core', '@dnd-kit/sortable'],
  },
  // playwright-core reads browsers.json at runtime (not via a static import Turbopack's
  // tracer can follow), and @sparticuz/chromium's brotli-compressed binaries are read the
  // same way — both were silently dropped from the deployed function, breaking PDF export
  // in production (confirmed via Vercel runtime error: "Cannot find module
  // '/var/task/node_modules/playwright-core/browsers.json'", 26 occurrences / 8 users
  // since July 2026). Force them into the trace explicitly.
  outputFileTracingIncludes: {
    '/api/cv/pdf': [
      './node_modules/playwright-core/browsers.json',
      './node_modules/@sparticuz/chromium/bin/**',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
};

export default withBundleAnalyzer(nextConfig);
