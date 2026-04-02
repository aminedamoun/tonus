'use client';
import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MenuManagement from './components/MenuManagement';
import OffersManagement from './components/OffersManagement';
import StatsCards from './components/StatsCards';
import Icon from '@/components/ui/AppIcon';
import GalleryManagement from './components/GalleryManagement';
import HeroAdBlocksManagement from './components/HeroAdBlocksManagement';
import HeroVideoManagement from './components/HeroVideoManagement';
import AboutGalleryManagement from './components/AboutGalleryManagement';

type TabId = 'overview' | 'menu' | 'offers' | 'hero-video' | 'hero-ads' | 'gallery' | 'about-gallery';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  description: string;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: 'ChartBarIcon', description: 'Dashboard stats' },
  { id: 'menu', label: 'Menu', icon: 'BookOpenIcon', description: 'Food & drinks' },
  { id: 'offers', label: 'Offers', icon: 'TagIcon', description: 'Special deals' },
  { id: 'hero-video', label: 'Hero Video', icon: 'VideoCameraIcon', description: 'Homepage video' },
  { id: 'hero-ads', label: 'Hero Ads', icon: 'RectangleGroupIcon', description: 'Promo blocks' },
  { id: 'gallery', label: 'Gallery', icon: 'PhotoIcon', description: 'Ambiance photos' },
  { id: 'about-gallery', label: 'About Gallery', icon: 'CameraIcon', description: 'About Us photos' },
];

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 bg-gray-50 min-h-screen">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40 shadow-sm">
          <div className="container-custom">
            {/* Title row */}
            <div className="flex items-center gap-3 py-4 border-b border-gray-100">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Cog6ToothIcon" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Manage your restaurant content</p>
              </div>
            </div>

            {/* Tab strip */}
            <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white' :'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon name={tab.icon} size={16} className={activeTab === tab.id ? 'text-white' : 'text-gray-500'} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container-custom py-8">
          {/* Section heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{currentTab.label}</h2>
            <p className="text-sm text-gray-500 mt-1">{currentTab.description}</p>
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <StatsCards />
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="QuestionMarkCircleIcon" size={18} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Quick Guide</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tabs.slice(1).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 text-left"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={tab.icon} size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{tab.label}</p>
                        <p className="text-xs text-gray-500">{tab.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && <MenuManagement />}
          {activeTab === 'offers' && <OffersManagement />}
          {activeTab === 'hero-video' && <HeroVideoManagement />}
          {activeTab === 'hero-ads' && <HeroAdBlocksManagement />}
          {activeTab === 'gallery' && <GalleryManagement />}
          {activeTab === 'about-gallery' && <AboutGalleryManagement />}
        </div>
      </main>
      <Footer />
    </>
  );
}