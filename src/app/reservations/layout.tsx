import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reserve a Table — Greek Restaurant in Downtown Dubai',
  description:
    'Book your table at Tonos Greek Restaurant and shisha lounge in Downtown Dubai. Dine in for authentic Mediterranean cuisine, cocktails and premium hookah.',
  keywords: [
    'book table Dubai',
    'restaurant reservation Dubai',
    'Greek restaurant reservation Dubai',
    'Downtown Dubai dining',
    'shisha lounge reservation Dubai',
    'best restaurant Downtown Dubai',
    'Tonos reservation',
  ],
  alternates: { canonical: '/reservations' },
  openGraph: {
    title: 'Reserve a Table — Tonos Greek Restaurant Downtown Dubai',
    description:
      'Book a table at Downtown Dubai’s authentic Greek restaurant and shisha lounge.',
    url: '/reservations',
    type: 'website',
  },
};

export default function ReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
