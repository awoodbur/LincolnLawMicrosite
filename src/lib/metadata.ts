import { Metadata } from 'next';

/**
 * Default site metadata configuration
 * Used across all pages unless overridden
 */

export const siteConfig = {
  name: 'Lincoln Law',
  tagline: 'Utah Bankruptcy Attorney',
  description: 'Find relief from debt with experienced Utah bankruptcy attorneys. Free consultation for Chapter 7 and Chapter 13 bankruptcy. Serving all of Utah with compassionate, expert legal guidance.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg', // We'll create this
  phone: '(801) 717-1210',
  address: {
    street: '921 West Center St.',
    city: 'Orem',
    state: 'UT',
    zip: '84057',
  },
  social: {
    // Add if you have social media accounts
    // twitter: '@lincolnlawut',
    // facebook: 'lincolnlawutah',
  },
};

/**
 * Generate metadata for a page
 * @param title - Page title (will be appended with site name)
 * @param description - Page description for search engines
 * @param path - URL path (e.g., '/faq')
 * @param noIndex - Set to true to prevent search engine indexing
 */
export function generateMetadata({
  title,
  description,
  path = '',
  noIndex = false,
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  image?: string;
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} - ${siteConfig.tagline}`;
  const pageDescription = description || siteConfig.description;
  const pageUrl = `${siteConfig.url}${path}`;
  const pageImage = image || `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageTitle,
    description: pageDescription,

    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pageUrl,
      siteName: siteConfig.name,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      // creator: siteConfig.social.twitter, // Uncomment if you have Twitter
    },

    // Prevent indexing if specified (e.g., for legal pages, intake forms)
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },

    // Verification (add these when you set up Google Search Console, Bing Webmaster Tools)
    // verification: {
    //   google: 'your-google-verification-code',
    //   yandex: 'your-yandex-verification-code',
    //   bing: 'your-bing-verification-code',
    // },

    // Additional metadata
    alternates: {
      canonical: pageUrl,
    },
  };
}

/**
 * Generate JSON-LD structured data for local business
 * Helps Google show your business in local search results and maps
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.2969', // Orem, UT coordinates
      longitude: '-111.6946',
    },
    areaServed: {
      '@type': 'State',
      name: 'Utah',
    },
    serviceType: ['Bankruptcy Law', 'Chapter 7 Bankruptcy', 'Chapter 13 Bankruptcy'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Bankruptcy Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Chapter 7 Bankruptcy',
            description: 'Liquidation bankruptcy for eliminating unsecured debts',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Chapter 13 Bankruptcy',
            description: 'Reorganization bankruptcy with 3-5 year repayment plan',
          },
        },
      ],
    },
  };
}

/**
 * Generate FAQ structured data for FAQ page
 * Shows rich results in Google search with expandable questions
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
