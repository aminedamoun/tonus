'use client';
import { useEffect } from 'react';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HeroSection from './components/HeroSection';
import SignatureDishes from './components/SignatureDishes';
import OffersSection from './components/OffersSection';
import MediterraneanStory from './components/MediterraneanStory';
import LocationSection from './components/AtmosphereGallery';
import AtmosphereGallery from './components/LocationSection';
import CTABanner from './components/CTABanner';

export default function Homepage() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals?.length) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    reveals?.forEach((el) => observer?.observe(el));

    return () => observer?.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SignatureDishes />
        <OffersSection />
        <MediterraneanStory />
        <LocationSection />
        <AtmosphereGallery />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
