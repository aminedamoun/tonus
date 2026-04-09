'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { createWhatsAppLink } from '@/lib/whatsapp';
import heroAdBlocksStatic from '@/data/hero-ad-blocks.json';
import { useLiveData } from '@/lib/useLiveData';

interface PromoCard {
  id: string;
  slot: number;
  title: string;
  text: string;
  whatsappMessage: string;
  emoji: string;
  starRating: number;
  floatClass: string;
  delay: string;
}

const FLOAT_CLASSES = ['bubble-float-1', 'bubble-float-2', 'bubble-float-3'];
const DELAYS = ['0s', '0.6s', '1.2s'];

const DEFAULT_CARDS: PromoCard[] = [
  {
    id: 'default-1',
    slot: 1,
    title: 'Wednesday Special Night',
    text: 'Every Wednesday special night for girls',
    whatsappMessage: 'Hi, I want to know more about the Wednesday Special Night.',
    emoji: '🌙',
    floatClass: 'bubble-float-1',
    delay: '0s',
    starRating: 5,
  },
  {
    id: 'default-2',
    slot: 2,
    title: 'Ladies Day Sunday',
    text: 'Special offers and vibes for ladies every Sunday',
    whatsappMessage: 'Hi, I want to know more about Ladies Day Sunday.',
    emoji: '👑',
    floatClass: 'bubble-float-2',
    delay: '0.6s',
    starRating: 5,
  },
  {
    id: 'default-3',
    slot: 3,
    title: 'Free Sheesha Offer',
    text: 'Get free sheesha after spending 100 AED',
    whatsappMessage: 'Hi, I want to claim the free sheesha offer.',
    emoji: '💨',
    floatClass: 'bubble-float-3',
    delay: '1.2s',
    starRating: 5,
  },
];

const floatingStars = [
  { id: 1, cls: 'fstar-1', size: 'w-5 h-5' },
  { id: 2, cls: 'fstar-2', size: 'w-3 h-3' },
  { id: 3, cls: 'fstar-3', size: 'w-4 h-4' },
  { id: 4, cls: 'fstar-4', size: 'w-3 h-3' },
  { id: 5, cls: 'fstar-5', size: 'w-5 h-5' },
];

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function BubbleCard({ card, index: _index }: { card: PromoCard; index: number }) {
  const handleClick = () => {
    window.open(createWhatsAppLink(card.whatsappMessage), '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className={`bubble-card ${card.floatClass} relative cursor-pointer group`}
      style={{ animationDelay: card.delay }}
    >
      {/* Chat bubble tail */}
      <div className="bubble-tail" />

      {/* Glass card body */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.28)',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
          padding: '22px 22px 16px',
          minWidth: '270px',
          maxWidth: '300px',
        }}
      >
        {/* Top row: emoji + title + chat icon */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">{card.emoji}</span>
            <h3
              className="font-serif text-white font-semibold leading-tight"
              style={{
                fontSize: '1.05rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)',
              }}
            >
              {card.title}
            </h3>
          </div>
          <div
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full"
            style={{
              background: 'rgba(137,207,240,0.2)',
              border: '1px solid rgba(137,207,240,0.45)',
            }}
          >
            <Icon name="ChatBubbleLeftRightIcon" size={14} className="text-blue-200" />
          </div>
        </div>

        {/* Description */}
        <p
          className="text-white/90 text-sm leading-relaxed mb-3"
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
        >
          {card.text}
        </p>

        {/* stars based on starRating */}
        <div className="flex items-center gap-0.5 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon
              key={s}
              className={`w-3.5 h-3.5 ${s <= card.starRating ? 'text-yellow-400' : 'text-white/20'}`}
            />
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-xs font-medium">WhatsApp</span>
          </div>
          <span className="text-white/70 text-xs italic">Tap to know more</span>
        </div>

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(137,207,240,0.18) 0%, rgba(255,215,0,0.09) 100%)',
            transition: 'opacity 0.35s ease',
          }}
        />
      </div>
    </div>
  );
}

export default function HeroSection() {
  const heroAdBlocks = useLiveData('hero-ad-blocks.json', heroAdBlocksStatic);
  const videoDesktopRef = useRef<HTMLVideoElement>(null);
  const videoMobileRef = useRef<HTMLVideoElement>(null);
  const heroVideoUrl = '/assets/banner_1.webm';

  // Build promo cards from local JSON data
  const promoCards: PromoCard[] =
    heroAdBlocks.length > 0
      ? heroAdBlocks.map((block, idx) => ({
          id: block.id,
          slot: block.slot,
          title: block.title || DEFAULT_CARDS[idx]?.title || '',
          text: block.description || DEFAULT_CARDS[idx]?.text || '',
          whatsappMessage: block.whatsapp_message || DEFAULT_CARDS[idx]?.whatsappMessage || '',
          emoji: block.emoji || DEFAULT_CARDS[idx]?.emoji || '⭐',
          starRating: block.star_rating ?? 5,
          floatClass: FLOAT_CLASSES[idx % 3],
          delay: DELAYS[idx % 3],
        }))
      : DEFAULT_CARDS;

  const playVideo = (video: HTMLVideoElement | null) => {
    if (!video) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setTimeout(() => {
          video.play().catch(() => {});
        }, 500);
      });
    }
  };

  // Play videos on mount
  useEffect(() => {
    const desktop = videoDesktopRef.current;
    const mobile = videoMobileRef.current;

    if (desktop) {
      desktop.load();
      playVideo(desktop);
    }
    if (mobile) {
      mobile.load();
      playVideo(mobile);
    }
  }, []);

  useEffect(() => {
    // Resume video when tab becomes active again
    const handleVisibility = () => {
      if (!document.hidden) {
        playVideo(videoDesktopRef.current);
        playVideo(videoMobileRef.current);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <>
      <style>{`
        /* Card floating animations */
        @keyframes bubbleFloat1 {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          30% { transform: translateY(-14px) rotate(0.5deg); }
          60% { transform: translateY(-7px) rotate(-0.3deg); }
        }
        @keyframes bubbleFloat2 {
          0%, 100% { transform: translateY(0px) rotate(0.4deg); }
          40% { transform: translateY(-18px) rotate(-0.6deg); }
          70% { transform: translateY(-9px) rotate(0.3deg); }
        }
        @keyframes bubbleFloat3 {
          0%, 100% { transform: translateY(0px) rotate(-0.3deg); }
          25% { transform: translateY(-10px) rotate(0.4deg); }
          55% { transform: translateY(-20px) rotate(-0.5deg); }
          80% { transform: translateY(-6px) rotate(0.2deg); }
        }

        /* Floating stars animations */
        @keyframes starFloat1 {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.9; }
          50% { transform: translate(6px,-18px) scale(1.2); opacity: 0.5; }
        }
        @keyframes starFloat2 {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.7; }
          40% { transform: translate(-8px,-14px) scale(0.8); opacity: 1; }
          80% { transform: translate(4px,-8px) scale(1.1); opacity: 0.6; }
        }
        @keyframes starFloat3 {
          0%, 100% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.8; }
          33% { transform: translate(10px,-12px) scale(1.3) rotate(20deg); opacity: 0.4; }
          66% { transform: translate(-4px,-20px) scale(0.9) rotate(-10deg); opacity: 0.9; }
        }
        @keyframes starFloat4 {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.6; }
          60% { transform: translate(-6px,-16px) scale(1.2); opacity: 1; }
        }
        @keyframes starFloat5 {
          0%, 100% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.85; }
          45% { transform: translate(8px,-22px) scale(0.85) rotate(15deg); opacity: 0.4; }
        }
        @keyframes starPulse {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(255,215,0,0.4)); }
          50% { filter: drop-shadow(0 0 8px rgba(255,215,0,0.9)); }
        }

        .bubble-float-1 { animation: bubbleFloat1 4.2s ease-in-out infinite; }
        .bubble-float-2 { animation: bubbleFloat2 5.1s ease-in-out infinite; }
        .bubble-float-3 { animation: bubbleFloat3 3.8s ease-in-out infinite; }

        .bubble-card {
          position: relative;
          filter: drop-shadow(0 12px 28px rgba(0,0,0,0.35));
          transition: filter 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .bubble-card:hover {
          filter: drop-shadow(0 16px 36px rgba(137,207,240,0.5)) drop-shadow(0 0 12px rgba(255,215,0,0.25));
          transform: scale(1.04) !important;
          animation-play-state: paused;
        }

        /* Chat bubble tail (bottom-left pointer) */
        .bubble-tail {
          position: absolute;
          bottom: -10px;
          left: 28px;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 6px solid transparent;
          border-top: 12px solid rgba(255,255,255,0.12);
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
          z-index: 1;
        }

        /* Floating stars */
        .fstar-1 { position: absolute; top: 8%; left: 5%; color: #facc15; animation: starFloat1 3.4s ease-in-out infinite, starPulse 2.1s ease-in-out infinite; }
        .fstar-2 { position: absolute; top: 18%; right: 8%; color: #fde68a; animation: starFloat2 4.0s ease-in-out infinite 0.5s, starPulse 2.8s ease-in-out infinite 0.3s; }
        .fstar-3 { position: absolute; top: 45%; left: 2%; color: #fbbf24; animation: starFloat3 3.7s ease-in-out infinite 1.0s, starPulse 2.4s ease-in-out infinite 0.8s; }
        .fstar-4 { position: absolute; bottom: 22%; right: 4%; color: #fde047; animation: starFloat4 4.5s ease-in-out infinite 0.7s, starPulse 3.0s ease-in-out infinite 0.5s; }
        .fstar-5 { position: absolute; bottom: 8%; left: 10%; color: #facc15; animation: starFloat5 3.2s ease-in-out infinite 1.4s, starPulse 2.2s ease-in-out infinite 1.0s; }

        /* Hero video */
        .hero-video-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #0a0e1e;
        }
      `}</style>

      <section className="relative min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-8 overflow-hidden bg-[#0a0e1e]">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 bg-[#0a0e1e]">
          {/* Desktop video */}
          <video
            ref={videoDesktopRef}
            autoPlay
            loop
            muted
            playsInline
            className="hero-video-bg hidden md:block"
            preload="auto"
            src={heroVideoUrl}
          />
          {/* Mobile video */}
          <video
            ref={videoMobileRef}
            autoPlay
            loop
            muted
            playsInline
            className="hero-video-bg md:hidden"
            preload="auto"
            src={heroVideoUrl}
          />
          <div className="hero-video-overlay absolute inset-0"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-200px)]">
            {/* Left Content */}
            <div className="space-y-10">
              <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-serif tracking-tight text-white drop-shadow-lg font-thin">
                Authentic
                <br />
                <span className="italic">Greek Flavors</span>
              </h1>

              <div className="max-w-md space-y-6 md:space-y-8">
                <p className="text-base md:text-2xl font-medium text-white drop-shadow">
                  Fresh. Mediterranean. Timeless.
                </p>

                <div className="flex items-start gap-4 pt-4 border-t border-white/20">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Icon name="MapPinIcon" size={24} className="text-white" />
                  </div>
                  <p className="text-sm font-bold text-white">
                    Located in the heart of <span className="text-primary">Downtown Dubai</span>
                    <br />
                    <span className="opacity-80 font-medium">
                      Open daily from 8:00 AM - 12:00 AM
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/reservations" className="btn-primary">
                    Reserve Your Table
                  </Link>
                  <Link
                    href="/menu"
                    className="px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '2px solid rgba(255,255,255,0.55)',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.85)';
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        '0 0 12px rgba(137,207,240,0.35), 0 4px 20px rgba(0,0,0,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.55)';
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        '0 4px 14px rgba(0,0,0,0.2)';
                    }}
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Floating Bubble Cards */}
            <div className="hidden md:flex flex-col gap-8 items-end justify-center relative py-8">
              {/* Floating gold stars (independent of cards) */}
              {floatingStars.map((star) => (
                <StarIcon
                  key={star.id}
                  className={`${star.cls} ${star.size} pointer-events-none`}
                />
              ))}

              {promoCards.map((card, index) => (
                <BubbleCard key={card.id} card={card} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
