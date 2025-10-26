import type { Metadata } from 'next';
import '../styles/globals.css';
import { generateMetadata, generateLocalBusinessSchema } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <html lang="en">
      <head>
        {/* Google Fonts - Lincoln era inspired */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Rokkitt:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Favicon - Lincoln head */}
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />

        {/* Local Business Structured Data - helps Google show you in local search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
