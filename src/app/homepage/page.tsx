'use client';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HeroSection from './components/HeroSection';
import SignatureDishes from './components/SignatureDishes';
import OffersSection from './components/OffersSection';
import MediterraneanStory from './components/MediterraneanStory';
import LocationSection from './components/AtmosphereGallery';
import AtmosphereGallery from './components/LocationSection';
import CTABanner from './components/CTABanner';
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
