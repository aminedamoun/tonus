'use client';

import menuItems from '@/data/menu-items.json';
import menuCategories from '@/data/menu-categories.json';
import galleryImages from '@/data/gallery-images.json';
import aboutGalleryImages from '@/data/about-gallery-images.json';

interface OverviewStatsProps {
  onTabChange: (tab: string) => void;
}

const quickGuideCards = [
  { tab: 'menu', icon: '🍽️', title: 'Menu', subtitle: 'Food & drinks' },
  { tab: 'offers', icon: '🏷️', title: 'Offers', subtitle: 'Special deals' },
  { tab: 'hero-video', icon: '🎬', title: 'Hero Video', subtitle: 'Homepage video' },
  { tab: 'hero-ads', icon: '📢', title: 'Hero Ads', subtitle: 'Promo blocks' },
  { tab: 'gallery', icon: '🖼️', title: 'Gallery', subtitle: 'Ambiance photos' },
  { tab: 'about-gallery', icon: '📸', title: 'About Gallery', subtitle: 'About Us photos' },
];

export default function OverviewStats({ onTabChange }: OverviewStatsProps) {
  const activeMenuItems = (menuItems as { available?: boolean }[]).filter(
    (item) => item.available === true
  ).length;
  const categoryCount = (menuCategories as unknown[]).length;
  const totalImages =
    (galleryImages as unknown[]).length + (aboutGalleryImages as unknown[]).length;

  const stats = [
    { label: 'ACTIVE MENU ITEMS', value: activeMenuItems, color: 'bg-green-500', iconChar: '🥗' },
    { label: 'CATEGORIES', value: categoryCount, color: 'bg-blue-500', iconChar: '📂' },
    { label: 'TOTAL IMAGES', value: totalImages, color: 'bg-purple-500', iconChar: '🖼️' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#89CFF0]/30 bg-white p-6 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-xl`}
            >
              {stat.iconChar}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500 tracking-wide">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Guide */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Guide</h3>
        <p className="text-sm text-gray-500 mb-4">Jump to any section to manage your content</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickGuideCards.map((card) => (
            <button
              key={card.tab}
              onClick={() => onTabChange(card.tab)}
              className="rounded-xl border border-gray-200 bg-white p-4 text-left cursor-pointer hover:border-primary transition-colors flex items-start gap-3"
            >
              <span className="text-2xl">{card.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{card.title}</p>
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
