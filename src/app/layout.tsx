import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import '../styles/index.css';
import BackToTop from '@/components/common/BackToTop';
import RouteProgressBar from '@/components/common/RouteProgressBar';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-serif',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const SITE_URL = 'https://tonosdxb.com';
const OG_IMAGE = '/assets/images/gallery/1775120375970-tonostable.webp';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      'Tonos | Greek Restaurant & Shisha Lounge in Downtown Dubai',
    template: '%s | Tonos Greek Restaurant Dubai',
  },
  description:
    'Tonos is Downtown Dubai’s authentic Greek restaurant and shisha lounge. Fresh Mediterranean cuisine, grilled seafood, souvlaki, mezze, signature cocktails, and premium shisha flavors. Dine in, reserve a table, or order delivery.',
  applicationName: 'Tonos Greek Restaurant',
  keywords: [
    'Greek restaurant Dubai',
    'best Greek restaurant Dubai',
    'Greek food Dubai',
    'Mediterranean restaurant Dubai',
    'Downtown Dubai restaurant',
    'restaurant Downtown Dubai',
    'shisha Dubai',
    'shisha lounge Dubai',
    'hookah Dubai',
    'hookah lounge Dubai',
    'best shisha Dubai',
    'shisha Downtown Dubai',
    'Tonos Dubai',
    'Tonos Greek Restaurant',
    'souvlaki Dubai',
    'moussaka Dubai',
    'mezze Dubai',
    'Greek seafood Dubai',
    'Mediterranean cuisine Dubai',
    'Greek cocktails Dubai',
    'fine dining Dubai',
    'restaurant with shisha Dubai',
  ],
  authors: [{ name: 'Tonos Greek Restaurant' }],
  creator: 'Tonos Greek Restaurant',
  publisher: 'Tonos Greek Restaurant',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Tonos Greek Restaurant',
    title:
      'Tonos | Greek Restaurant & Shisha Lounge in Downtown Dubai',
    description:
      'Authentic Greek cuisine and premium shisha in the heart of Downtown Dubai. Fresh Mediterranean flavors, grilled seafood, mezze, cocktails and hookah.',
    locale: 'en_US',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Tonos Greek Restaurant in Downtown Dubai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tonos | Greek Restaurant & Shisha Lounge in Downtown Dubai',
    description:
      'Authentic Greek cuisine and premium shisha in Downtown Dubai. Fresh Mediterranean flavors, seafood, mezze, cocktails and hookah.',
    images: [OG_IMAGE],
  },
  category: 'restaurant',
};

const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': `${SITE_URL}/#restaurant`,
  name: 'Tonos Greek Restaurant',
  alternateName: 'Tonos Dubai',
  description:
    'Authentic Greek restaurant and shisha lounge in Downtown Dubai serving Mediterranean cuisine, seafood, mezze, cocktails and premium hookah.',
  url: SITE_URL,
  telephone: '+971581391113',
  email: 'tonosdxb@gmail.com',
  image: [`${SITE_URL}${OG_IMAGE}`],
  logo: `${SITE_URL}/assets/images/logotonos-1770983075095.png`,
  priceRange: '$$$',
  servesCuisine: ['Greek', 'Mediterranean', 'Seafood'],
  acceptsReservations: 'True',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Downtown Dubai',
    addressRegion: 'Dubai',
    addressCountry: 'AE',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '08:00',
      closes: '00:00',
    },
  ],
  sameAs: ['https://www.instagram.com/tonosgreekrestaurant'],
  hasMenu: `${SITE_URL}/menu`,
  amenityFeature: [
    {
      '@type': 'LocationFeatureSpecification',
      name: 'Shisha / Hookah',
      value: true,
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: 'Outdoor Seating',
      value: true,
    },
    {
      '@type': 'LocationFeatureSpecification',
      name: 'Serves Alcohol',
      value: true,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
      </head>
      <body>
        <RouteProgressBar />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
