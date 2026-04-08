'use client';

import Icon from '@/components/ui/AppIcon';

interface ShishaCategoryBannerProps {
  categoryName: string;
  tagline: string;
  description: string;
  imageUrl: string;
  itemCount: number;
}

const CATEGORY_STYLE: Record<
  string,
  { gradient: string; icon: string; accent: string; bg: string }
> = {
  'Most Liked': {
    gradient: 'from-amber-600 to-orange-500',
    icon: 'HeartIcon',
    accent: 'rgba(251, 191, 36, 0.5)',
    bg: 'from-amber-50 to-orange-50',
  },
  'Arabic Shisha': {
    gradient: 'from-amber-700 to-yellow-500',
    icon: 'SunIcon',
    accent: 'rgba(180, 130, 50, 0.5)',
    bg: 'from-amber-50 to-yellow-50',
  },
  'Turkish Shisha': {
    gradient: 'from-red-700 to-rose-500',
    icon: 'FireIcon',
    accent: 'rgba(185, 28, 28, 0.5)',
    bg: 'from-red-50 to-rose-50',
  },
  'Russian Shisha': {
    gradient: 'from-blue-700 to-indigo-500',
    icon: 'SparklesIcon',
    accent: 'rgba(59, 130, 246, 0.5)',
    bg: 'from-blue-50 to-indigo-50',
  },
  'Signature Shisha': {
    gradient: 'from-purple-700 to-violet-500',
    icon: 'StarIcon',
    accent: 'rgba(139, 92, 246, 0.5)',
    bg: 'from-purple-50 to-violet-50',
  },
  Extras: {
    gradient: 'from-teal-600 to-emerald-500',
    icon: 'PlusCircleIcon',
    accent: 'rgba(20, 184, 166, 0.5)',
    bg: 'from-teal-50 to-emerald-50',
  },
  'Change Bowl': {
    gradient: 'from-cyan-600 to-sky-500',
    icon: 'ArrowPathIcon',
    accent: 'rgba(6, 182, 212, 0.5)',
    bg: 'from-cyan-50 to-sky-50',
  },
};

const DEFAULT_STYLE = {
  gradient: 'from-primary to-primary/70',
  icon: 'FireIcon',
  accent: 'rgba(137, 207, 240, 0.5)',
  bg: 'from-blue-50 to-sky-50',
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
    <div className="flex justify-center mb-12">
      <div className="shisha-banner-wrapper relative w-64 sm:w-72 md:w-80 aspect-square rounded-[2rem] overflow-hidden group cursor-default">
        {/* Background */}
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={categoryName}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${style.bg}`}>
            {/* Decorative pattern for no-image state */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 70%, ${style.accent} 0%, transparent 50%), radial-gradient(circle at 70% 30%, ${style.accent} 0%, transparent 50%)`,
              }}
            />
          </div>
        )}

        {/* Smoke SVG decoration */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
          viewBox="0 0 300 300"
          fill="none"
        >
          <path
            d="M150 300C150 300 90 220 130 150C170 80 100 40 150 0"
            stroke={hasImage ? 'white' : 'currentColor'}
            strokeWidth="2"
            className="shisha-smoke-path"
          />
          <path
            d="M190 300C190 300 130 200 170 130C210 60 140 20 190 -20"
            stroke={hasImage ? 'white' : 'currentColor'}
            strokeWidth="1.5"
            className="shisha-smoke-path"
            style={{ animationDelay: '1.2s' }}
          />
          <path
            d="M110 300C110 300 50 240 90 170C130 100 60 60 110 20"
            stroke={hasImage ? 'white' : 'currentColor'}
            strokeWidth="1"
            className="shisha-smoke-path"
            style={{ animationDelay: '2.4s' }}
          />
        </svg>

        {/* Floating accent orb */}
        <div
          className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-30 animate-pulse-subtle pointer-events-none"
          style={{ background: style.accent }}
        />

        {/* Content - bottom aligned */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          {/* Icon badge - top right */}
          <div
            className="absolute top-5 right-5 shisha-banner-icon w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 shadow-lg"
            style={{
              background: hasImage
                ? 'rgba(255,255,255,0.15)'
                : `linear-gradient(135deg, ${style.accent}, transparent)`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Icon
              name={style.icon}
              size={24}
              className={hasImage ? 'text-white drop-shadow' : 'text-foreground/70'}
            />
          </div>

          {/* Count badge - top left */}
          <div
            className="absolute top-5 left-5 flex flex-col items-center justify-center w-11 h-11 rounded-xl border border-white/20"
            style={{
              background: hasImage ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              className={`text-lg font-bold leading-none ${hasImage ? 'text-white' : 'text-foreground'}`}
            >
              {itemCount}
            </span>
            <span
              className={`text-[8px] uppercase tracking-wider mt-0.5 ${hasImage ? 'text-white/70' : 'text-muted-foreground'}`}
            >
              {itemCount === 1 ? 'flavor' : 'flavors'}
            </span>
          </div>

          {/* Text */}
          <div>
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${
                hasImage ? 'text-white/60' : 'text-muted-foreground'
              }`}
            >
              {tagline}
            </p>
            <h2
              className={`text-2xl sm:text-3xl font-serif italic leading-tight ${
                hasImage ? 'text-white drop-shadow-md' : 'text-foreground'
              }`}
            >
              {categoryName}
            </h2>
            {description && (
              <p
                className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                  hasImage ? 'text-white/50' : 'text-muted-foreground'
                }`}
              >
                {description}
              </p>
            )}
          </div>

          {/* Bottom accent line */}
          <div
            className={`mt-4 h-0.5 w-12 rounded-full transition-all duration-500 group-hover:w-20 ${
              hasImage ? '' : ''
            }`}
            style={{
              background: hasImage
                ? 'rgba(255,255,255,0.4)'
                : `linear-gradient(90deg, ${style.accent}, transparent)`,
            }}
          />
        </div>

        {/* Corner border accents */}
        <div
          className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            borderTop: `2px solid ${style.accent}`,
            borderLeft: `2px solid ${style.accent}`,
            borderTopLeftRadius: '2rem',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            borderBottom: `2px solid ${style.accent}`,
            borderRight: `2px solid ${style.accent}`,
            borderBottomRightRadius: '2rem',
          }}
        />
      </div>
    </div>
  );
}
