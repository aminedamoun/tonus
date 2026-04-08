'use client';

import Icon from '@/components/ui/AppIcon';

interface ShishaCategoryBannerProps {
  categoryName: string;
  tagline: string;
  description: string;
  imageUrl: string;
  itemCount: number;
}

// Category-specific accent colors and icons
const CATEGORY_STYLE: Record<
  string,
  { gradient: string; icon: string; accentColor: string; pattern: string }
> = {
  'Most Liked': {
    gradient: 'from-amber-500/80 via-orange-500/70 to-rose-500/60',
    icon: 'HeartIcon',
    accentColor: 'rgba(251, 191, 36, 0.4)',
    pattern: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
  },
  'Arabic Shisha': {
    gradient: 'from-amber-700/80 via-yellow-600/70 to-amber-500/60',
    icon: 'SunIcon',
    accentColor: 'rgba(180, 130, 50, 0.4)',
    pattern: 'radial-gradient(circle at 80% 30%, rgba(180, 130, 50, 0.15) 0%, transparent 50%)',
  },
  'Turkish Shisha': {
    gradient: 'from-red-700/80 via-rose-600/70 to-red-500/60',
    icon: 'FireIcon',
    accentColor: 'rgba(185, 28, 28, 0.4)',
    pattern: 'radial-gradient(circle at 30% 70%, rgba(185, 28, 28, 0.15) 0%, transparent 50%)',
  },
  'Russian Shisha': {
    gradient: 'from-blue-700/80 via-indigo-600/70 to-blue-500/60',
    icon: 'SparklesIcon',
    accentColor: 'rgba(59, 130, 246, 0.4)',
    pattern: 'radial-gradient(circle at 70% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
  },
  'Signature Shisha': {
    gradient: 'from-purple-700/80 via-violet-600/70 to-purple-500/60',
    icon: 'StarIcon',
    accentColor: 'rgba(139, 92, 246, 0.4)',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
  },
  Extras: {
    gradient: 'from-teal-600/80 via-emerald-500/70 to-teal-400/60',
    icon: 'PlusCircleIcon',
    accentColor: 'rgba(20, 184, 166, 0.4)',
    pattern: 'radial-gradient(circle at 60% 60%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)',
  },
  'Change Bowl': {
    gradient: 'from-cyan-600/80 via-sky-500/70 to-cyan-400/60',
    icon: 'ArrowPathIcon',
    accentColor: 'rgba(6, 182, 212, 0.4)',
    pattern: 'radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
  },
};

const DEFAULT_STYLE = {
  gradient: 'from-primary/80 via-primary/60 to-primary/40',
  icon: 'FireIcon',
  accentColor: 'rgba(137, 207, 240, 0.4)',
  pattern: 'radial-gradient(circle at 50% 50%, rgba(137, 207, 240, 0.15) 0%, transparent 50%)',
};

export default function ShishaCategoryBanner({
  categoryName,
  tagline,
  description,
  imageUrl,
  itemCount,
}: ShishaCategoryBannerProps) {
  const style = CATEGORY_STYLE[categoryName] || DEFAULT_STYLE;
  const hasImage = imageUrl && imageUrl.trim() !== '';

  return (
    <div className="shisha-banner-wrapper relative w-full rounded-3xl overflow-hidden mb-10 group">
      {/* Background layer */}
      <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={categoryName}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </>
        ) : (
          /* Gradient fallback when no image */
          <div
            className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`}
            style={{ backgroundImage: style.pattern }}
          />
        )}

        {/* Decorative floating circles */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl animate-pulse-subtle"
          style={{ background: style.accentColor }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-15 blur-xl animate-float"
          style={{ background: style.accentColor }}
        />

        {/* Decorative smoke-like SVG pattern */}
        <svg
          className="absolute right-0 top-0 h-full w-1/3 opacity-10"
          viewBox="0 0 200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 400C100 400 30 300 80 200C130 100 50 50 100 0"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            className="shisha-smoke-path"
          />
          <path
            d="M140 400C140 400 70 280 120 180C170 80 90 30 140 -20"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="shisha-smoke-path"
            style={{ animationDelay: '1s' }}
          />
          <path
            d="M60 400C60 400 -10 320 40 220C90 120 10 70 60 20"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            className="shisha-smoke-path"
            style={{ animationDelay: '2s' }}
          />
        </svg>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center px-6 sm:px-10 md:px-14">
          <div className="flex items-center gap-5 sm:gap-8 w-full">
            {/* Icon circle */}
            <div
              className="shisha-banner-icon shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${style.accentColor}, rgba(255,255,255,0.1))`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <Icon name={style.icon} size={32} className="text-white drop-shadow-lg sm:hidden" />
              <Icon
                name={style.icon}
                size={40}
                className="text-white drop-shadow-lg hidden sm:block"
              />
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/70 mb-1">
                {tagline}
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white drop-shadow-md leading-tight">
                {categoryName}
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1 line-clamp-1 hidden sm:block">
                {description}
              </p>
            </div>

            {/* Item count badge */}
            <div
              className="shrink-0 hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-2xl border border-white/20"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span className="text-2xl font-bold text-white leading-none">{itemCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-white/60 mt-0.5">
                {itemCount === 1 ? 'flavor' : 'flavors'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom border glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${style.accentColor}, transparent)`,
          }}
        />
      </div>
    </div>
  );
}
