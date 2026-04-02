'use client';
import { useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MenuInteractive from './components/MenuInteractive';
import QuickOrderBanner from './components/QuickOrderBanner';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

export default function MenuPage() {
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
      <main className="pt-32 pb-20">
        {/* Page Header */}
        <section className="container-custom mb-12 reveal">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif italic text-foreground leading-tight">
              Traditional Greek <br />
              <span className="text-primary">Recipes</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Every dish is prepared with the finest Mediterranean ingredients, using authentic
              recipes passed down through generations.
            </p>
          </div>
        </section>

        {/* Menu Items */}
        <section className="container-custom reveal">
          <MenuInteractive />
        </section>

        {/* CTA Section */}
        <section className="container-custom mt-20 reveal">
          <div className="bg-secondary text-secondary-foreground rounded-[48px] p-12 md:p-16 text-center space-y-6 border-2 border-primary/30 transition-all duration-500 hover:border-primary/60 hover:shadow-blue-glow-lg">
            <h2 className="text-4xl md:text-5xl font-serif italic">
              Ready to taste <span className="text-primary">Greece</span>?
            </h2>
            <p className="text-lg text-secondary-foreground/80 max-w-xl mx-auto">
              Reserve your table or order directly via WhatsApp for delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/reservations" className="btn-primary">
                Reserve Table
              </Link>
              <a
                href="tel:+971XXXXXXXXX"
                className="px-8 py-4 rounded-full bg-white text-secondary font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all duration-450 hover:scale-105 hover:shadow-blue-glow-lg"
              >
                <Icon name="PhoneIcon" size={20} />
                Call Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <QuickOrderBanner />
    </>
  );
}
