'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Icon from '@/components/ui/AppIcon';

// ─── Data ────────────────────────────────────────────────────────────────────

const deliveryPartners = [
  {
    id: 'talabat',
    name: 'Talabat',
    color: '#FF5A00',
    bg: '#FFF5F0',
    border: 'rgba(255,90,0,0.2)',
    glow: 'rgba(255,90,0,0.25)',
    logo: '/assets/images/delivery/talabat-logo.svg',
    href: 'https://www.talabat.com/uae/tonos-restaurant',
    tagline: 'Order on Talabat',
  },
  {
    id: 'deliveroo',
    name: 'Deliveroo',
    color: '#00CCBC',
    bg: '#F0FFFE',
    border: 'rgba(0,204,188,0.2)',
    glow: 'rgba(0,204,188,0.25)',
    logo: '/assets/images/deliveroo-1774506859786.png',
    href: 'https://deliveroo.ae/menu/dubai/downtown-dubai-mall/tonos-restaurant',
    tagline: 'Order on Deliveroo',
  },
];

const deliveryInfoCards = [
  {
    id: 'coverage',
    icon: 'MapPinIcon',
    title: 'Delivery Coverage',
    desc: 'Downtown Dubai, Business Bay, DIFC, Dubai Marina, JBR, Palm Jumeirah, Jumeirah, Deira & more major areas.',
  },
  {
    id: 'hours',
    icon: 'ClockIcon',
    title: 'Delivery Hours',
    desc: "Daily 11 AM – 2:30 AM. Order late and we'll still deliver fresh Greek flavors to your door.",
  },
  {
    id: 'minorder',
    icon: 'ShoppingBagIcon',
    title: 'Minimum Order',
    desc: 'Minimum order amount depends on your location and the delivery platform you choose.',
  },
];

const paymentMethods = [
  { id: 'cod', icon: 'BanknotesIcon', label: 'Cash on Delivery' },
  { id: 'card', icon: 'CreditCardIcon', label: 'Credit / Debit Cards' },
  { id: 'digital', icon: 'DevicePhoneMobileIcon', label: 'Apple Pay / Google Pay' },
  { id: 'apps', icon: 'RocketLaunchIcon', label: 'Delivery App Payments' },
];

const steps = [
  { id: 1, icon: 'BookOpenIcon', label: 'Browse the Menu' },
  { id: 2, icon: 'HeartIcon', label: 'Choose Your Desserts' },
  { id: 3, icon: 'ShoppingCartIcon', label: 'Place Your Order' },
  { id: 4, icon: 'TruckIcon', label: 'Track Your Delivery' },
  { id: 5, icon: 'SparklesIcon', label: 'Enjoy Fresh Desserts' },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DeliveryPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals?.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    reveals?.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main className="pt-24 md:pt-32 pb-12 md:pb-20 overflow-x-hidden">
        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        <section className="container-custom mb-12 md:mb-20 reveal">
          <div className="relative">
            {/* Subtle background accent - top right */}
            <div
              className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #89CFF0 0%, transparent 70%)',
                transform: 'translate(30%, -30%)',
              }}
            />

            {/* Floating decorative dots - bottom left */}
            <div
              className="absolute bottom-0 left-0 pointer-events-none select-none"
              aria-hidden="true"
            >
              <div
                className="absolute w-24 h-24 rounded-full"
                style={{
                  border: '2px dashed rgba(137,207,240,0.35)',
                  top: '-20px',
                  left: '-10px',
                  animation: 'spin 18s linear infinite',
                }}
              />

              <div
                className="absolute w-12 h-12 rounded-full"
                style={{
                  border: '2px solid rgba(30,58,95,0.12)',
                  top: '30px',
                  left: '60px',
                  animation: 'spin 12s linear infinite reverse',
                }}
              />

              <div
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  background: '#89CFF0',
                  opacity: 0.5,
                  top: '0px',
                  left: '40px',
                  animation: 'floatDot 4s ease-in-out infinite',
                }}
              />
              <div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: '#1E3A5F',
                  opacity: 0.2,
                  top: '50px',
                  left: '10px',
                  animation: 'floatDot 5.5s ease-in-out infinite 1s',
                }}
              />
              <div
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: '#89CFF0',
                  opacity: 0.35,
                  top: '70px',
                  left: '80px',
                  animation: 'floatDot 3.8s ease-in-out infinite 0.5s',
                }}
              />
            </div>

            {/* Floating decorative dots - top right */}
            <div
              className="absolute top-0 right-8 pointer-events-none select-none"
              aria-hidden="true"
            >
              <div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: '#89CFF0',
                  opacity: 0.4,
                  animation: 'floatDot 4.5s ease-in-out infinite',
                }}
              />
              <div
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: '#1E3A5F',
                  opacity: 0.2,
                  top: '20px',
                  left: '15px',
                  animation: 'floatDot 6s ease-in-out infinite 1.5s',
                }}
              />
              <div
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: '#89CFF0',
                  opacity: 0.25,
                  top: '40px',
                  left: '-5px',
                  animation: 'floatDot 5s ease-in-out infinite 0.8s',
                }}
              />
            </div>

            {/* Keyframe styles */}
            <style>{`
              @keyframes floatDot {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes phoneFloat {
                0%, 100% { transform: translateY(0px) rotate(-1deg); }
                50% { transform: translateY(-14px) rotate(1deg); }
              }
              @keyframes phoneGlow {
                0%, 100% { opacity: 0.15; transform: scale(1); }
                50% { opacity: 0.28; transform: scale(1.05); }
              }
            `}</style>

            <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10 py-8">
              <div className="inline-block pill-badge mb-4">🚚 Fast Delivery Available</div>
              <h1 className="text-3xl sm:text-5xl md:text-8xl font-serif italic text-foreground leading-tight">
                Fresh Greek Flavors.
                <br />
                <span className="text-primary">Delivered to Your Door.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Authentic Mediterranean cuisine crafted with love, packaged with care, and delivered
                straight to you — hot, fresh, and on time.
              </p>

              {/* Highlight badges */}
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                {[
                  { icon: '⚡', text: '30–45 Min Delivery' },
                  { icon: '🤝', text: 'Contactless Delivery' },
                  { icon: '📍', text: 'Real-Time Tracking' },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-secondary"
                    style={{
                      background: 'rgba(30,58,95,0.06)',
                      border: '1px solid rgba(30,58,95,0.15)',
                    }}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <a
                  href="https://wa.me/971581391113"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2"
                >
                  <Icon name="ChatBubbleLeftRightIcon" size={20} />
                  Order via WhatsApp
                </a>
                <Link
                  href="/menu"
                  className="px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider text-secondary flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  style={{
                    border: '2px solid rgba(30,58,95,0.3)',
                    background: 'rgba(30,58,95,0.05)',
                  }}
                >
                  <Icon name="BookOpenIcon" size={20} />
                  View Full Menu
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. DELIVERY PARTNERS ────────────────────────────────────────── */}
        <section className="section-padding reveal" style={{ background: '#fafcff' }}>
          <div className="container-custom">
            <div className="text-center mb-14">
              <div className="inline-block pill-badge mb-4">Order Anywhere</div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-foreground mb-4">
                Our Delivery <span className="text-primary">Partners</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Find us on all major food delivery platforms. Order through your favourite app.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto">
              {deliveryPartners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: partner.bg,
                    border: `1.5px solid ${partner.border}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${partner.glow}`;
                    (e.currentTarget as HTMLElement).style.borderColor = partner.color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.borderColor = partner.border;
                  }}
                >
                  {/* Logo image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-16 w-auto object-contain"
                    loading="lazy"
                    decoding="async"
                    style={{ maxWidth: '80%' }}
                  />

                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    {partner.tagline}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. DELIVERY INFO ────────────────────────────────────────────── */}
        <section className="section-padding bg-white reveal">
          <div className="container-custom">
            <div className="text-center mb-14">
              <div className="inline-block pill-badge mb-4">Good to Know</div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-foreground mb-4">
                Delivery <span className="text-primary">Information</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deliveryInfoCards.map((card) => (
                <div key={card.id} className="floating-card p-8 text-center space-y-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                    style={{
                      background: 'rgba(137,207,240,0.15)',
                      border: '2px solid rgba(137,207,240,0.3)',
                    }}
                  >
                    <Icon name={card.icon} size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. PREMIUM PACKAGING ────────────────────────────────────────── */}
        <section
          className="section-padding reveal"
          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0f2240 100%)' }}
        >
          <div className="container-custom">
            <div
              className="relative rounded-3xl md:rounded-[48px] p-8 sm:p-12 md:p-20 overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid rgba(137,207,240,0.25)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Decorative pattern */}
              <div
                className="absolute inset-0 opacity-5 rounded-[48px] pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(137,207,240,0.5) 20px, rgba(137,207,240,0.5) 40px)',
                }}
              />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(137,207,240,0.15)',
                    border: '2px solid rgba(137,207,240,0.4)',
                  }}
                >
                  <Icon name="GiftIcon" size={40} className="text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <div
                    className="inline-block pill-badge mb-4"
                    style={{
                      background: 'rgba(137,207,240,0.2)',
                      color: '#89CFF0',
                      border: '1px solid rgba(137,207,240,0.4)',
                    }}
                  >
                    Premium Quality
                  </div>
                  <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-4">
                    Packed with <span style={{ color: '#89CFF0' }}>Perfection</span>
                  </h2>
                  <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
                    Every dish leaves our kitchen in premium, food-grade packaging designed to lock
                    in freshness, preserve presentation, and arrive at your door exactly as it left
                    our hands — beautiful and delicious.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                    {['Temperature Sealed', 'Eco-Friendly', 'Presentation Ready', 'Leak-Proof'].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                          style={{
                            background: 'rgba(137,207,240,0.12)',
                            border: '1px solid rgba(137,207,240,0.3)',
                          }}
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. PAYMENT OPTIONS ──────────────────────────────────────────── */}
        <section className="section-padding bg-white reveal">
          <div className="container-custom">
            <div className="text-center mb-14">
              <div className="inline-block pill-badge mb-4">Flexible Payments</div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-foreground mb-4">
                Payment <span className="text-primary">Options</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We accept all major payment methods for your convenience.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
              {paymentMethods.map((method) => (
                <div key={method.id} className="floating-card p-6 text-center space-y-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                    style={{
                      background: 'rgba(137,207,240,0.12)',
                      border: '2px solid rgba(137,207,240,0.25)',
                    }}
                  >
                    <Icon name={method.icon} size={26} className="text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {method.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. HOW IT WORKS ─────────────────────────────────────────────── */}
        <section className="section-padding reveal" style={{ background: '#fafcff' }}>
          <div className="container-custom">
            <div className="text-center mb-16">
              <div className="inline-block pill-badge mb-4">Simple Process</div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-foreground mb-4">
                How It <span className="text-primary">Works</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Getting your favourite Greek food delivered is as easy as 1-2-3.
              </p>
            </div>

            {/* Steps */}
            <div className="relative">
              {/* Connecting line (desktop) */}
              <div
                className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 mx-20"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(137,207,240,0.5) 20%, rgba(137,207,240,0.5) 80%, transparent)',
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {steps.map((step, i) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center text-center gap-4"
                    style={{ transitionDelay: `${i * 0.12}s` }}
                  >
                    {/* Step number + icon */}
                    <div className="relative">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(137,207,240,0.2) 0%, rgba(30,58,95,0.1) 100%)',
                          border: '2px solid rgba(137,207,240,0.4)',
                          boxShadow: '0 0 20px rgba(137,207,240,0.15)',
                        }}
                      >
                        <Icon name={step.icon} size={30} className="text-primary" />
                      </div>
                      <div
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: '#1E3A5F' }}
                      >
                        {step.id}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-foreground">{step.label}</p>
                    {i < steps.length - 1 && <div className="lg:hidden w-px h-6 bg-primary/30" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. REAL-TIME TRACKING ───────────────────────────────────────── */}
        <section className="section-padding bg-white reveal">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text side */}
              <div className="space-y-6">
                <div className="inline-block pill-badge">Live Updates</div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-foreground">
                  Real-Time <span className="text-primary">Order Tracking</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Once your order is confirmed, you can track it live — from our kitchen to your
                  doorstep. No more guessing. Just sit back and get ready to enjoy.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: 'CheckCircleIcon', text: 'Order confirmed instantly' },
                    { icon: 'FireIcon', text: 'Kitchen prepares your meal' },
                    { icon: 'TruckIcon', text: 'Rider picks up your order' },
                    { icon: 'MapPinIcon', text: 'Live GPS tracking on the way' },
                    { icon: 'BellIcon', text: 'Notification when arrived' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <Icon name={item.icon} size={20} className="text-primary flex-shrink-0" />
                      <span className="text-foreground font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phone mockup illustration - with floating animation */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Outer glow ring - animated */}
                  <div
                    className="absolute -inset-6 rounded-[60px] pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(137,207,240,0.25) 0%, transparent 70%)',
                      animation: 'phoneGlow 3s ease-in-out infinite',
                    }}
                  />

                  {/* Second glow ring */}
                  <div
                    className="absolute -inset-10 rounded-[70px] pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(30,58,95,0.1) 0%, transparent 70%)',
                      animation: 'phoneGlow 3s ease-in-out infinite 1.5s',
                    }}
                  />

                  {/* Phone frame - floating */}
                  <div
                    className="w-64 h-[500px] rounded-[48px] p-4 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #1E3A5F 0%, #0f2240 100%)',
                      border: '3px solid rgba(137,207,240,0.4)',
                      boxShadow: '0 0 40px rgba(137,207,240,0.2), 0 20px 60px rgba(30,58,95,0.3)',
                      animation: 'phoneFloat 4s ease-in-out infinite',
                    }}
                  >
                    {/* Phone notch */}
                    <div className="w-20 h-5 bg-black/50 rounded-full mx-auto mb-4" />

                    {/* App UI mockup */}
                    <div className="space-y-3 px-2">
                      <div className="text-center">
                        <p className="text-white/60 text-xs">Your Order</p>
                        <p className="text-white font-bold text-sm">Tonos Greek Restaurant</p>
                      </div>

                      {/* Progress bar */}
                      <div className="bg-white/10 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: '65%',
                            background: 'linear-gradient(90deg, #89CFF0, #1E3A5F)',
                          }}
                        />
                      </div>

                      {/* Status steps */}
                      {[
                        { label: 'Order Placed', done: true },
                        { label: 'Preparing', done: true },
                        { label: 'On the Way', done: true, active: true },
                        { label: 'Delivered', done: false },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: s.done ? '#89CFF0' : 'rgba(255,255,255,0.1)',
                              border: s.active ? '2px solid #89CFF0' : 'none',
                              boxShadow: s.active ? '0 0 10px rgba(137,207,240,0.6)' : 'none',
                            }}
                          >
                            {s.done && <span className="text-xs text-foreground font-bold">✓</span>}
                          </div>
                          <span
                            className="text-xs font-semibold"
                            style={{
                              color: s.active
                                ? '#89CFF0'
                                : s.done
                                  ? 'rgba(255,255,255,0.8)'
                                  : 'rgba(255,255,255,0.4)',
                            }}
                          >
                            {s.label}
                          </span>
                          {s.active && <span className="text-xs text-primary">●</span>}
                        </div>
                      ))}

                      {/* Map placeholder */}
                      <div
                        className="rounded-2xl h-32 mt-4 flex items-center justify-center"
                        style={{
                          background: 'rgba(137,207,240,0.1)',
                          border: '1px solid rgba(137,207,240,0.2)',
                        }}
                      >
                        <div className="text-center">
                          <Icon name="MapIcon" size={32} className="text-primary mx-auto mb-1" />
                          <p className="text-white/60 text-xs">Live Map</p>
                          <p className="text-primary text-xs font-bold">ETA: 12 min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. FINAL CTA ────────────────────────────────────────────────── */}
        <section className="section-padding greek-pattern-bg reveal">
          <div className="container-custom">
            <div
              className="rounded-3xl md:rounded-[48px] p-8 sm:p-12 md:p-20 text-center space-y-6 md:space-y-8"
              style={{
                background: 'linear-gradient(135deg, #1E3A5F 0%, #0f2240 100%)',
                border: '2px solid rgba(137,207,240,0.3)',
                boxShadow: '0 0 40px rgba(137,207,240,0.1)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                style={{
                  background: 'rgba(137,207,240,0.15)',
                  border: '2px solid rgba(137,207,240,0.3)',
                }}
              >
                <Icon name="TruckIcon" size={32} className="text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif italic text-white">
                Ready to <span style={{ color: '#89CFF0' }}>Order?</span>
              </h2>
              <p className="text-lg text-white/75 max-w-xl mx-auto">
                Authentic Greek flavors are just a few taps away. Order now and experience the taste
                of the Mediterranean at home.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link href="/menu" className="btn-primary flex items-center gap-2">
                  <Icon name="BookOpenIcon" size={20} />
                  View Full Menu
                </Link>
                <a
                  href="https://wa.me/971581391113"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-white text-secondary font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                >
                  <Icon name="ChatBubbleLeftRightIcon" size={20} />
                  Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
