/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Required for Prisma in serverless environment
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  // Expose environment variables to serverless functions (API routes)
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    MAILGUN_FROM: process.env.MAILGUN_FROM,
    STAFF_LEADS_EMAIL: process.env.STAFF_LEADS_EMAIL,
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
    PLAID_ENV: process.env.PLAID_ENV,
    PLAID_PRODUCTS: process.env.PLAID_PRODUCTS,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
