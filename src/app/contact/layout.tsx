import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Tonos Greek Restaurant Downtown Dubai',
  description:
    'Get in touch with Tonos Greek Restaurant in Downtown Dubai. Location, phone, WhatsApp and email for reservations, private events and general inquiries.',
  keywords: [
    'Tonos contact Dubai',
    'Greek restaurant location Dubai',
    'Downtown Dubai restaurant contact',
    'shisha lounge Dubai contact',
    'book Greek restaurant Dubai',
    'Tonos phone Dubai',
  ],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Tonos — Greek Restaurant Downtown Dubai',
    description:
      'Reach Tonos Greek Restaurant & shisha lounge in Downtown Dubai for reservations and inquiries.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
