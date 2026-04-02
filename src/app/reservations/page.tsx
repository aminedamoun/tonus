'use client';
import { useEffect } from 'react';
 import Header from'@/components/common/Header';
 import Footer from'@/components/common/Footer';
 import BookingForm from'./components/BookingForm';
 import AlternativeMethods from'./components/AlternativeMethods';
 import ReservationPolicies from'./components/ReservationPolicies';
 import Icon from'@/components/ui/AppIcon';
 import Link from'next/link';

export default function ReservationsPage() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    if (!reveals?.length) return

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    )
    reveals?.forEach((el) => observer?.observe(el))

    return () => observer?.disconnect();
  }, [])

  return (
    <>
      <Header />
      <main className="pt-32 pb-20">
        {/* Page Header */}
        <section className="container-custom mb-16 reveal">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-block pill-badge mb-4">Reserve Your Table</div>
            <h1 className="md:text-8xl font-serif italic text-foreground text-[64px]">
              Secure Your <br />
              <span className="text-primary">Mediterranean</span> Experience
            </h1>
            <p className="text-muted-foreground text-base">
              Book your table at GreekRestaurant and embark on a culinary journey 
              through the Greek islands. We look forward to welcoming you.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Icon name="ClockIcon" size={20} className="text-primary" />
              <span>Open daily: 8:00 AM - 12:00 AM</span>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="container-custom mb-20 reveal">
          <BookingForm />
        </section>

        {/* Alternative Methods */}
        <section className="container-custom mb-20 reveal">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif italic text-foreground mb-4">
              Or Book via <span className="text-primary">Alternative Methods</span>
            </h2>
            <p className="text-muted-foreground">
              Prefer a quick call or message? We're here to help.
            </p>
          </div>
          <AlternativeMethods />
        </section>

        {/* Policies */}
        <section className="container-custom mb-20 reveal">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif italic text-foreground mb-4">
              Reservation <span className="text-primary">Policies</span>
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about booking with us.
            </p>
          </div>
          <ReservationPolicies />
        </section>

        {/* CTA Section */}
        <section className="container-custom reveal">
          <div className="bg-secondary text-secondary-foreground rounded-[48px] p-12 md:p-16 text-center space-y-6 border-2 border-primary/30 transition-all duration-500 hover:border-primary/60 hover:shadow-blue-glow-lg">
            <h2 className="text-4xl md:text-5xl font-serif italic">
              Questions about your <span className="text-primary">reservation</span>?
            </h2>
            <p className="text-lg text-secondary-foreground/80 max-w-xl mx-auto">
              Our team is here to assist you with any special requests or inquiries.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact" className="btn-primary">
                Contact Us
              </Link>
              <a
                href="https://wa.me/971XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-white text-secondary font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all duration-450 hover:scale-105 hover:shadow-blue-glow-lg"
              >
                <Icon name="ChatBubbleLeftRightIcon" size={20} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}