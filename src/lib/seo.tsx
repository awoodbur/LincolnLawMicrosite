import { env } from './env';

export interface SeoData {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function generateMetadata(data: SeoData) {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const canonical = data.canonical || siteUrl;
  const ogImage = data.ogImage || `${siteUrl}/og-image.png`;

  return {
    title: data.title,
    description: data.description,
    ...(data.noindex && { robots: 'noindex,nofollow' }),
    alternates: {
      canonical,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: canonical,
      siteName: 'Lincoln Law',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [ogImage],
    },
  };
}

export function generateLegalServiceJsonLd() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Lincoln Law',
    description: 'Utah bankruptcy legal services',
    areaServed: {
      '@type': 'State',
      name: 'Utah',
    },
    url: siteUrl,
    priceRange: '$$',
  };
}

export function generateFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
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
