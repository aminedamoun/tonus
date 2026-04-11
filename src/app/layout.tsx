import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import BackToTop from '@/components/common/BackToTop';
import RouteProgressBar from '@/components/common/RouteProgressBar';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Tonos Greek Restaurant | Authentic Greek Flavors in Downtown Dubai',
  description:
    'Experience authentic Greek cuisine in the heart of Downtown Dubai. Fresh Mediterranean dishes, signature cocktails, and premium shisha.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
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
