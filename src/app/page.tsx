'use client';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HeroSection from './homepage/components/HeroSection';
import SignatureDishes from './homepage/components/SignatureDishes';
import OffersSection from './homepage/components/OffersSection';
import MediterraneanStory from './homepage/components/MediterraneanStory';
import LocationSection from './homepage/components/AtmosphereGallery';
import AtmosphereGallery from './homepage/components/LocationSection';
import CTABanner from './homepage/components/CTABanner';
import { useRevealAnimations } from '@/lib/useRevealAnimations';
import { usePageEnter } from '@/hooks/usePageEnter';

export default function Homepage() {
  useRevealAnimations();
  const mainRef = usePageEnter();

  return (
    <>
      <Header />
      <main ref={mainRef}>
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
