'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import Image from 'next/image';

export default function LocationSection() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <section className="section-padding bg-white reveal">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block pill-badge mb-4">Visit Us</div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif italic text-foreground">
            Our <span className="text-primary">Location</span>
          </h2>
        </div>

        {/* Map with Overlay Card Container */}
        <div className="relative rounded-3xl md:rounded-[48px] overflow-hidden border-2 border-primary/40 transition-all duration-500 hover:border-primary/60 hover:shadow-blue-glow-lg h-auto md:h-[700px]">
          {/* Google Maps Embed */}
          {isHydrated && (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.106445792126!2d55.27063887675307!3d25.199632531599477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43e9e80bd6e5%3A0xea35880fe1607382!2sTonos%20Greek%20Restaurant!5e0!3m2!1sen!2sae!4v1771576699209!5m2!1sen!2sae"
              width="100%"
              height="100%"
              className="min-h-[300px] md:min-h-0"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GreekRestaurant location in Dubai"
            ></iframe>
          )}

          {/* Floating Contact Card Overlay */}
          <div className="relative md:absolute md:top-6 md:right-6 w-full md:max-w-[420px] md:max-h-[calc(100%-3rem)] overflow-y-auto bg-white/95 backdrop-blur-sm rounded-b-3xl md:rounded-3xl shadow-2xl p-5 sm:p-6 border border-primary/20">
            <div className="space-y-6">
              {/* Header with Logo */}
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="relative w-12 h-12 shrink-0">
                  <Image
                    src="/assets/images/logotonos-1770983075095.png"
                    alt="Tonos Restaurant Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-medium text-foreground">
                    Tonos Greek Restaurant
                  </h3>
                  <p className="text-sm text-muted-foreground">Downtown, Dubai</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="PhoneIcon" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      PHONE
                    </p>
                    <a
                      href="tel:+971581391113"
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      +971 58 139 1113
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="ClockIcon" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      HOURS
                    </p>
                    <div className="space-y-2 mt-1">
                      {/* Open 24 Hours Badge */}
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-foreground">Open 24 Hours</span>
                      </div>

                      {/* Service Hours Grid */}
                      <div className="grid gap-1.5 mt-2">
                        {/* Lunch */}
                        <div className="flex items-start gap-2 group">
                          <span className="inline-flex items-center justify-center min-w-[75px] px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-semibold rounded-md border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                            🍽️ Lunch
                          </span>
                          <span className="text-xs text-muted-foreground pt-0.5">
                            Mon-Fri 11 AM–4 PM
                          </span>
                        </div>

                        {/* Happy Hours */}
                        <div className="flex items-start gap-2 group">
                          <span className="inline-flex items-center justify-center min-w-[75px] px-2 py-0.5 bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[10px] font-semibold rounded-md border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                            🍹 Happy
                          </span>
                          <span className="text-xs text-muted-foreground pt-0.5">
                            Daily 10 AM–5 PM
                          </span>
                        </div>

                        {/* Delivery */}
                        <div className="flex items-start gap-2 group">
                          <span className="inline-flex items-center justify-center min-w-[75px] px-2 py-0.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-semibold rounded-md border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                            🚚 Delivery
                          </span>
                          <span className="text-xs text-muted-foreground pt-0.5">
                            Daily 11 AM–2:30 AM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="MapPinIcon" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      ADDRESS
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      FF3, Boulevard Plaza - Shop - Tower 2 Sheikh Mohammed bin Rashid Blvd - Burj
                      Khalifa - Downtown Dubai - Dubai
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <a
                  href="https://share.google/ZgADqgykNRwfd4TYe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm text-center hover:scale-105 transition-transform"
                >
                  GET DIRECTIONS
                </a>
                <a
                  href="tel:+971581391113"
                  className="flex-1 px-6 py-3 rounded-2xl border-2 border-primary text-primary font-bold text-sm text-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  CALL NOW
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
