'use client';
import { useEffect, useRef } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

import { createWhatsAppLink, createGeneralInquiryMessage } from '@/lib/whatsapp';
import VisualStoryGallery from './components/VisualStoryGallery';
import { useRevealAnimations } from '@/lib/useRevealAnimations';

export default function AboutPage() {
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const timelineDotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useRevealAnimations();

  // Timeline scroll animation
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineLineRef.current) return;

      const timelineSection = timelineLineRef.current.parentElement;
      if (!timelineSection) return;

      const rect = timelineSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      // Calculate scroll progress (0 to 1)
      const scrollProgress = Math.max(
        0,
        Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5))
      );

      // Animate the line
      timelineLineRef.current.style.transform = `scaleY(${scrollProgress})`;

      // Animate dots and cards sequentially
      timelineDotsRef.current.forEach((dot, index) => {
        if (!dot) return;

        const dotThreshold = (index + 1) / (timelineDotsRef.current.length + 1);

        if (scrollProgress >= dotThreshold) {
          dot.classList.add('timeline-dot-visible');

          // Animate corresponding card
          const card = timelineCardsRef.current[index];
          if (card) {
            card.classList.add('timeline-card-visible');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    const message = createGeneralInquiryMessage();
    const whatsappLink = createWhatsAppLink(message);
    window.open(whatsappLink, '_blank');
  };

  const timeline = [
    {
      year: '1985',
      title: 'The Beginning',
      description:
        'Our family opened the first Tonos taverna in Santorini, serving fresh seafood and traditional recipes passed down through generations.',
    },
    {
      year: '2010',
      title: 'Expanding Horizons',
      description:
        'Inspired by the growing love for Mediterranean cuisine, we decided to bring authentic Greek flavors beyond the islands.',
    },
    {
      year: '2018',
      title: 'Dubai Arrival',
      description:
        'Tonos Greek Restaurant opened in Downtown Dubai, introducing the city to genuine Greek hospitality and cuisine.',
    },
    {
      year: '2024',
      title: 'Today',
      description:
        'We continue to honor our roots while delighting guests with the timeless flavors of Greece in the heart of Dubai.',
    },
  ];

  const features = [
    {
      icon: 'SparklesIcon',
      title: 'Authentic Recipes',
      description: 'Traditional Greek dishes prepared exactly as they are in the islands',
    },
    {
      icon: 'ShieldCheckIcon',
      title: 'Premium Ingredients',
      description: 'Imported olive oil, feta, and herbs directly from Greece',
    },
    {
      icon: 'FireIcon',
      title: 'Wood-Fired Cooking',
      description: 'Traditional grilling methods for authentic Mediterranean flavor',
    },
    {
      icon: 'HeartIcon',
      title: 'Greek Hospitality',
      description: 'Philoxenia - welcoming every guest like family',
    },
    {
      icon: 'SunIcon',
      title: 'Fresh Daily',
      description: 'Ingredients sourced fresh every morning from local markets',
    },
    {
      icon: 'UserGroupIcon',
      title: 'Community Focus',
      description: 'A gathering place for families, friends, and celebrations',
    },
  ];

  const values = [
    {
      title: 'Authenticity',
      description: 'Every dish honors centuries-old Greek culinary traditions',
      gradient: 'from-blue-500/10 to-blue-600/5',
    },
    {
      title: 'Quality',
      description: 'We never compromise on ingredients or preparation',
      gradient: 'from-amber-500/10 to-amber-600/5',
    },
    {
      title: 'Passion',
      description: 'Cooking with love and sharing the joy of Mediterranean life',
      gradient: 'from-rose-500/10 to-rose-600/5',
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-24 md:pt-32 pb-12 md:pb-20">
        {/* Hero Section - A Journey from Greece to Dubai */}
        <section className="container-custom mb-16 md:mb-32 reveal">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-block pill-badge mb-4">Our Story</div>
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-serif italic text-foreground leading-tight">
              From Santorini <br />
              to <span className="text-primary">Dubai</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A journey of passion, tradition, and the timeless flavors of the Mediterranean. At
              Tonos Greek Restaurant, we bring the heart of the Greek islands to Dubai, crafting
              every dish with love and authenticity. Discover how Tonos became Downtown Dubai&apos;s
              go-to destination for an unforgettable Greek dining experience.
            </p>
          </div>
        </section>

        {/* Timeline Section - Our Story */}
        <section className="container-custom mb-16 md:mb-32 reveal">
          <div className="text-center mb-16">
            <div className="inline-block pill-badge mb-4">Our Journey</div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-foreground">
              Four Decades of <span className="text-primary">Tradition</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Animated Timeline line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/10">
                <div
                  ref={timelineLineRef}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary via-primary to-primary/70 origin-top transition-transform duration-300 ease-out"
                  style={{ transform: 'scaleY(0)' }}
                ></div>
              </div>

              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative mb-16 last:mb-0 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'}`}
                >
                  <div
                    className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}
                  >
                    <div
                      ref={(el) => {
                        timelineCardsRef.current[index] = el;
                      }}
                      className="timeline-card floating-card p-8 space-y-4 hover:scale-105 transition-all duration-500"
                    >
                      <div
                        className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r from-primary to-primary/70 text-white font-bold text-lg ${index % 2 === 0 ? '' : 'md:float-right'}`}
                      >
                        {item.year}
                      </div>
                      <h3 className="text-2xl font-serif text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Animated Timeline dot */}
                  <div
                    ref={(el) => {
                      timelineDotsRef.current[index] = el;
                    }}
                    className="timeline-dot hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50"
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes Us Special */}
        <section className="container-custom mb-16 md:mb-32 reveal">
          <div className="text-center mb-16">
            <div className="inline-block pill-badge mb-4">What Makes Us Special</div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-foreground">
              The <span className="text-primary">Tonos</span> Difference
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
              Six pillars that define our commitment to authentic Greek dining
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="floating-card p-8 h-full space-y-6 hover:bg-primary/5 transition-all duration-500 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-glow transition-all duration-500 group-hover:rotate-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Icon name={feature.icon as any} size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-serif text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="container-custom mb-16 md:mb-32 reveal">
          <div className="text-center mb-16">
            <div className="inline-block pill-badge mb-4">Our Values</div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-foreground">
              What We <span className="text-primary">Stand For</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="group">
                <div
                  className={`floating-card p-10 h-full space-y-6 bg-gradient-to-br ${value.gradient} border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105`}
                >
                  <div className="text-6xl font-serif italic text-primary/20 group-hover:text-primary/40 transition-colors duration-500">
                    0{index + 1}
                  </div>
                  <h3 className="text-3xl font-serif text-foreground">{value.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visual Story - Behind the Scenes */}
        <section className="container-custom mb-16 md:mb-32 reveal">
          <VisualStoryGallery />
        </section>

        {/* Call to Action */}
        <section className="container-custom reveal">
          <div className="bg-secondary text-secondary-foreground rounded-3xl md:rounded-[48px] p-8 sm:p-12 md:p-16 text-center space-y-6 md:space-y-8 border-2 border-primary/30 transition-all duration-500 hover:border-primary/60 hover:shadow-blue-glow-lg">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic">
              Experience the <span className="text-primary">Heart of Greece</span>
            </h2>
            <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
              Join us for an authentic Mediterranean dining experience that celebrates tradition,
              quality, and the warmth of Greek hospitality.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/menu" className="btn-primary">
                Explore Our Menu
              </Link>
              <Link
                href="/reservations"
                className="px-8 py-4 rounded-full bg-white text-secondary font-bold text-sm uppercase tracking-wider transition-all duration-450 hover:scale-105 hover:shadow-blue-glow-lg"
              >
                Book a Table
              </Link>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-success text-white font-bold text-sm uppercase tracking-wider transition-all duration-450 hover:scale-105 hover:shadow-blue-glow-lg"
              >
                <Icon name="ChatBubbleLeftRightIcon" size={20} />
                WhatsApp Us
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
