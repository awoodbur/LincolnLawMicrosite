import { MetadataRoute } from 'next';

/**
 * Generates a sitemap.xml file for search engines
 * This tells Google and other search engines which pages exist on your site
 * and how often they should be crawled
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0, // Homepage is most important
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, // FAQ is very important for SEO
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3, // Legal pages are lower priority
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/consent`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Note: We don't include /intake pages in sitemap because:
    // 1. They're multi-step forms, not content pages
    // 2. We don't want people landing directly on step 2 or 3
    // 3. They require noIndex in robots meta tag
  ];
}
