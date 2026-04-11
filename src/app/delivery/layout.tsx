import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delivery — Greek Food Delivered Across Dubai',
  description:
    'Order authentic Greek food delivery from Tonos via Talabat. Fast delivery of souvlaki, mezze, seafood and Mediterranean dishes to your door across Dubai.',
  keywords: [
    'Greek food delivery Dubai',
    'Talabat Tonos',
    'Greek delivery Dubai',
    'Mediterranean delivery Dubai',
    'best Greek takeaway Dubai',
    'Downtown Dubai food delivery',
  ],
  alternates: { canonical: '/delivery' },
  openGraph: {
    title: 'Delivery — Greek Food Delivered Across Dubai | Tonos',
    description:
      'Order Tonos Greek cuisine for delivery anywhere in Dubai via Talabat.',
    url: '/delivery',
    type: 'website',
  },
};

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
