import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu — Greek Dishes, Mezze, Seafood & Shisha',
  description:
    'Browse the full Tonos menu: authentic Greek mezze, grilled souvlaki, moussaka, fresh seafood, Mediterranean salads, signature cocktails and premium shisha flavors in Downtown Dubai.',
  keywords: [
    'Greek menu Dubai',
    'souvlaki Dubai',
    'moussaka Dubai',
    'mezze Dubai',
    'Greek seafood Dubai',
    'shisha menu Dubai',
    'hookah flavors Dubai',
    'Mediterranean food Dubai',
    'Greek lunch Dubai',
    'Greek dinner Dubai',
    'best Greek food Dubai',
  ],
  alternates: { canonical: '/menu' },
  openGraph: {
    title: 'Menu — Greek Dishes, Mezze, Seafood & Shisha | Tonos Dubai',
    description:
      'Authentic Greek mezze, grilled souvlaki, moussaka, fresh seafood and premium shisha in Downtown Dubai.',
    url: '/menu',
    type: 'website',
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
