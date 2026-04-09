'use client';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ContactForm from './components/ContactForm';
import ContactMethods from './components/ContactMethods';
import LocationMap from './components/LocationMap';
import QuickActions from './components/QuickActions';
import Icon from '@/components/ui/AppIcon';
import Image from 'next/image';
import { useRevealAnimations } from '@/lib/useRevealAnimations';
import { usePageEnter } from '@/hooks/usePageEnter';

export default function ContactPage() {
  useRevealAnimations();
  const mainRef = usePageEnter();

  return (
    <>
      <Header />
      <main ref={mainRef} className="pt-24 md:pt-32 pb-12 md:pb-20">
        {/* Page Header */}
        <section className="container-custom mb-10 md:mb-16 reveal">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-block pill-badge mb-4">Get in Touch</div>
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-serif italic text-foreground leading-tight">
              We&apos;re Here to <br />
              <span className="text-primary">Help</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question, special request, or feedback? Our team is ready to make your dining
              experience perfect.
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="container-custom mb-20 reveal">
          <ContactForm />
        </section>

        {/* Contact Methods */}
        <section className="container-custom mb-20 reveal">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif italic text-foreground mb-4">
              Direct <span className="text-primary">Contact</span>
            </h2>
            <p className="text-muted-foreground">Choose your preferred way to reach us.</p>
          </div>
          <ContactMethods />
        </section>

        {/* Location Map with Contact Card */}
        <section className="container-custom mb-20 reveal">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <LocationMap />
            </div>

            {/* Contact Information Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 h-full">
                {/* Logo and Title */}
                <div className="flex items-start gap-4 pb-6 border-b border-border">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src="/assets/images/logotonos-1770983075095.png"
                      alt="Tonos Greek Restaurant Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-medium text-foreground">
                      Tonos Greek Restaurant
                    </h3>
                    <p className="text-sm text-muted-foreground">Downtown, Dubai</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Icon name="PhoneIcon" size={20} className="text-primary" />
                    <span className="text-sm font-medium uppercase">Phone</span>
                  </div>
                  <a
                    href="tel:+971581391113"
                    className="block text-xl font-semibold text-foreground hover:text-primary transition-colors pl-8"
                  >
                    +971 58 139 1113
                  </a>
                </div>

                {/* Hours */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Icon name="ClockIcon" size={20} className="text-primary" />
                    <span className="text-sm font-medium uppercase">Hours</span>
                  </div>
                  <div className="pl-8 space-y-3">
                    {/* Open 24 Hours Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full border border-primary/20">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-base font-bold text-foreground">Open 24 Hours</span>
                    </div>

                    {/* Service Hours Grid */}
                    <div className="grid gap-2 mt-3">
                      {/* Lunch */}
                      <div className="flex items-start gap-2 group">
                        <span className="inline-flex items-center justify-center min-w-[90px] px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-md border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                          🍽️ Lunch
                        </span>
                        <span className="text-sm text-muted-foreground pt-0.5">
                          Mon-Fri 11 AM–4 PM
                        </span>
                      </div>

                      {/* Happy Hours */}
                      <div className="flex items-start gap-2 group">
                        <span className="inline-flex items-center justify-center min-w-[90px] px-3 py-1 bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-md border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                          🍹 Happy
                        </span>
                        <span className="text-sm text-muted-foreground pt-0.5">
                          Daily 10 AM–5 PM
                        </span>
                      </div>

                      {/* Delivery */}
                      <div className="flex items-start gap-2 group">
                        <span className="inline-flex items-center justify-center min-w-[90px] px-3 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-md border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                          🚚 Delivery
                        </span>
                        <span className="text-sm text-muted-foreground pt-0.5">
                          Daily 11 AM–2:30 AM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Icon name="MapPinIcon" size={20} className="text-primary" />
                    <span className="text-sm font-medium uppercase">Address</span>
                  </div>
                  <p className="text-base text-foreground leading-relaxed pl-8">
                    FF3, Boulevard Plaza - Shop - Tower 2<br />
                    Sheikh Mohammed bin Rashid Blvd -<br />
                    Burj Khalifa - Downtown Dubai - Dubai
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4">
                  <a
                    href="https://maps.app.goo.gl/93QcuKCwUEwK57uy9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 rounded-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider text-center transition-all duration-450 hover:scale-105 hover:shadow-blue-glow-lg"
                  >
                    Get Directions
                  </a>
                  <a
                    href="tel:+971581391113"
                    className="w-full py-3 px-6 rounded-full border-2 border-primary text-primary font-bold text-sm uppercase tracking-wider text-center transition-all duration-450 hover:bg-primary hover:text-primary-foreground"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container-custom mb-20 reveal">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif italic text-foreground mb-4">
              Quick <span className="text-primary">Actions</span>
            </h2>
            <p className="text-muted-foreground">Get in touch or visit us with one click.</p>
          </div>
          <QuickActions />
        </section>

        {/* CTA Section */}
        <section className="container-custom reveal">
          <div className="bg-secondary text-secondary-foreground rounded-3xl md:rounded-[48px] p-8 sm:p-12 md:p-16 text-center space-y-6 border-2 border-primary/30 transition-all duration-500 hover:border-primary/60 hover:shadow-blue-glow-lg">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic">
              Visit us <span className="text-primary">today</span>
            </h2>
            <p className="text-lg text-secondary-foreground/80 max-w-xl mx-auto">
              Experience authentic Greek hospitality and flavors in the heart of Dubai.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="https://maps.app.goo.gl/dFFzYUPz1d6WxWdZ9"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Get Directions
              </a>
              <a
                href="tel:+971581391113"
                className="px-8 py-4 rounded-full bg-white text-secondary font-bold text-sm uppercase tracking-wider transition-all duration-450 hover:scale-105 hover:shadow-blue-glow-lg"
              >
                Call Now
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
