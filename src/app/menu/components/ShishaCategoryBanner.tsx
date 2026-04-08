'use client';

import Icon from '@/components/ui/AppIcon';

interface ShishaCategoryBannerProps {
  categoryName: string;
  tagline: string;
  description: string;
  imageUrl: string;
  itemCount: number;
  index: number;
}

const CATEGORY_STYLE: Record<
  string,
  { gradient: string; icon: string; accent: string; accentLight: string }
> = {
  'Most Liked': {
    gradient: 'from-amber-600 to-orange-500',
    icon: 'HeartIcon',
    accent: '#f59e0b',
    accentLight: 'rgba(251, 191, 36, 0.08)',
  },
  'Arabic Shisha': {
    gradient: 'from-amber-700 to-yellow-500',
    icon: 'SunIcon',
    accent: '#b4822f',
    accentLight: 'rgba(180, 130, 50, 0.08)',
  },
  'Turkish Shisha': {
    gradient: 'from-red-700 to-rose-500',
    icon: 'FireIcon',
    accent: '#e11d48',
    accentLight: 'rgba(225, 29, 72, 0.06)',
  },
  'Russian Shisha': {
    gradient: 'from-blue-700 to-indigo-500',
    icon: 'SparklesIcon',
    accent: '#3b82f6',
    accentLight: 'rgba(59, 130, 246, 0.06)',
  },
  'Signature Shisha': {
    gradient: 'from-purple-700 to-violet-500',
    icon: 'StarIcon',
    accent: '#8b5cf6',
    accentLight: 'rgba(139, 92, 246, 0.06)',
  },
  Extras: {
    gradient: 'from-teal-600 to-emerald-500',
    icon: 'PlusCircleIcon',
    accent: '#14b8a6',
    accentLight: 'rgba(20, 184, 166, 0.06)',
  },
  'Change Bowl': {
    gradient: 'from-cyan-600 to-sky-500',
    icon: 'ArrowPathIcon',
    accent: '#06b6d4',
    accentLight: 'rgba(6, 182, 212, 0.06)',
  },
};

const DEFAULT_STYLE = {
  gradient: 'from-primary to-primary/70',
  icon: 'FireIcon',
  accent: '#89CFF0',
  accentLight: 'rgba(137, 207, 240, 0.08)',
};

export default function ShishaCategoryBanner({
  categoryName,
  tagline,
  description,
  imageUrl,
  itemCount,
  index,
}: ShishaCategoryBannerProps) {
  const style = CATEGORY_STYLE[categoryName] || DEFAULT_STYLE;
  const hasImage = imageUrl && imageUrl.trim() !== '';
  const isReversed = index % 2 === 1;

  return (
    <div className="mb-10">
      <div
        className={`shisha-banner-wrapper relative w-full rounded-[2rem] overflow-hidden group ${
          isReversed ? 'flex-row-reverse' : ''
        }`}
        style={{ background: style.accentLight }}
      >
        <div
          className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch`}
        >
          {/* Square Image Side */}
          <div className="relative w-full md:w-80 lg:w-96 aspect-square shrink-0 overflow-hidden">
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
                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-90`}>
                {/* Decorative smoke for no-image */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-10"
                  viewBox="0 0 300 300"
                  fill="none"
                >
                  <path
                    d="M150 300C150 300 80 220 130 140C180 60 100 20 150 -20"
                    stroke="white"
                    strokeWidth="3"
                    className="shisha-smoke-path"
                  />
                  <path
                    d="M200 300C200 300 130 200 180 120C230 40 150 0 200 -40"
                    stroke="white"
                    strokeWidth="2"
                    className="shisha-smoke-path"
                    style={{ animationDelay: '1.5s' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name={style.icon} size={80} className="text-white/20" />
                </div>
              </div>
            )}

            {/* Flavor count chip on image */}
            <div
              className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg"
              style={{
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="text-sm">{itemCount}</span>
              <span className="opacity-70">{itemCount === 1 ? 'flavor' : 'flavors'}</span>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex-1 flex flex-col justify-center px-8 py-8 md:px-12 md:py-10 relative overflow-hidden">
            {/* Background decorative elements */}
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{ background: style.accentLight }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full blur-2xl opacity-30 pointer-events-none"
              style={{ background: style.accentLight }}
            />

            {/* Icon + tagline row */}
            <div className="flex items-center gap-3 mb-4 relative">
              <div
                className="shisha-banner-icon w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${style.accent}20, ${style.accent}10)`,
                  border: `1.5px solid ${style.accent}30`,
                }}
              >
                <Icon name={style.icon} size={20} style={{ color: style.accent }} />
              </div>
              <span
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: style.accent }}
              >
                {tagline}
              </span>
            </div>

            {/* Category name */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-foreground leading-tight mb-3 relative">
              {categoryName}
            </h2>

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6 relative">
                {description}
              </p>
            )}

            {/* Decorative bottom accent */}
            <div className="flex items-center gap-3 relative">
              <div
                className="h-[3px] w-10 rounded-full transition-all duration-500 group-hover:w-20"
                style={{ background: style.accent }}
              />
              <div
                className="h-[3px] w-3 rounded-full"
                style={{ background: `${style.accent}40` }}
              />
              <div
                className="h-[3px] w-1.5 rounded-full"
                style={{ background: `${style.accent}20` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
