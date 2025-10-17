import { MetadataRoute } from 'next';

/**
 * Generates a robots.txt file
 * This tells search engines which pages they can crawl and index
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*', // Applies to all search engines
        allow: '/', // Allow crawling homepage
        disallow: [
          '/intake/', // Don't index intake form pages
          '/api/', // Don't crawl API endpoints
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // Tell search engines where to find our sitemap
  };
}
