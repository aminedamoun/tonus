import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Tonos — Greek Restaurant & Shisha Lounge in Dubai',
  description:
    'Discover the story of Tonos, Downtown Dubai’s authentic Greek restaurant and shisha lounge. Mediterranean flavors, warm hospitality and a true taste of Greece in Dubai.',
  keywords: [
    'about Tonos Dubai',
    'Greek restaurant story Dubai',
    'authentic Greek food Dubai',
    'Greek chef Dubai',
    'Mediterranean restaurant Downtown Dubai',
    'Greek dining experience Dubai',
  ],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Tonos — Greek Restaurant & Shisha Lounge in Dubai',
    description:
      'The story behind Downtown Dubai’s authentic Greek restaurant and shisha lounge.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
