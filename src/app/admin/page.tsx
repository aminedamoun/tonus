'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MenuAdmin from './components/MenuAdmin';
import OffersAdmin from './components/OffersAdmin';
import HeroVideoAdmin from './components/HeroVideoAdmin';
import HeroAdsAdmin from './components/HeroAdsAdmin';
import GalleryAdmin from './components/GalleryAdmin';
import AboutGalleryAdmin from './components/AboutGalleryAdmin';
import OverviewStats from './components/OverviewStats';

type Tab = 'overview' | 'menu' | 'offers' | 'hero-video' | 'hero-ads' | 'gallery' | 'about-gallery';

const tabs: { id: Tab; label: string; icon: string; title: string; subtitle: string }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: '📊',
    title: 'Dashboard Overview',
    subtitle: 'A quick look at your restaurant content',
  },
  {
    id: 'menu',
    label: 'Menu',
    icon: '🍽️',
    title: 'Menu Management',
    subtitle: 'Add, edit, and organize your food & drink items',
  },
  {
    id: 'offers',
    label: 'Offers',
    icon: '🏷️',
    title: 'Offers & Promotions',
    subtitle: 'Manage special deals and event announcements',
  },
  {
    id: 'hero-video',
    label: 'Hero Video',
    icon: '🎬',
    title: 'Hero Video',
    subtitle: 'Set the homepage background video',
  },
  {
    id: 'hero-ads',
    label: 'Hero Ads',
    icon: '📢',
    title: 'Hero Ads',
    subtitle: 'Manage promotional blocks on the homepage',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: '🖼️',
    title: 'Photo Gallery',
    subtitle: 'Curate ambiance and food photography',
  },
  {
    id: 'about-gallery',
    label: 'About Gallery',
    icon: '📸',
    title: 'About Gallery',
    subtitle: 'Manage photos shown on the About Us page',
  },
];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    const stored = localStorage.getItem('admin_password');
    if (stored) {
      setPassword(stored);
      setAuthenticated(true);
    }
  }, []);

  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword.trim()) return;
    setLoggingIn(true);
    setLoginError('');

    try {
      // Validate password against the server before granting access
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': inputPassword.trim(),
        },
        body: JSON.stringify({ file: 'src/data/hero-ad-blocks.json', data: null, dryRun: true }),
      });

      if (res.status === 401) {
        setLoginError('Wrong password. Please try again.');
        setLoggingIn(false);
        return;
      }

      // Password is valid
      localStorage.setItem('admin_password', inputPassword.trim());
      setPassword(inputPassword.trim());
      setAuthenticated(true);
    } catch {
      setLoginError('Connection error. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_password');
    setPassword('');
    setInputPassword('');
    setAuthenticated(false);
    setActiveTab('overview');
  };

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-5"
        >
          <h1 className="text-2xl font-bold text-center text-gray-900">Tonos Admin</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {loginError && <p className="text-sm text-red-500 text-center">{loginError}</p>}
          <button
            type="submit"
            disabled={loggingIn}
            className={`w-full py-3 font-semibold rounded-lg transition-opacity ${
              loggingIn
                ? 'bg-gray-400 text-gray-200 cursor-wait'
                : 'bg-primary text-white hover:opacity-90'
            }`}
          >
            {loggingIn ? 'Verifying...' : 'Enter Admin'}
          </button>
        </form>
      </div>
    );
  }

  const current = tabs.find((t) => t.id === activeTab)!;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewStats onTabChange={(tab) => setActiveTab(tab as Tab)} />;
      case 'menu':
        return <MenuAdmin password={password} />;
      case 'offers':
        return <OffersAdmin password={password} />;
      case 'hero-video':
        return <HeroVideoAdmin password={password} />;
      case 'hero-ads':
        return <HeroAdsAdmin password={password} />;
      case 'gallery':
        return <GalleryAdmin password={password} />;
      case 'about-gallery':
        return <AboutGalleryAdmin password={password} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">&#9881;</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Manage your restaurant content</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-primary hover:underline">
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#89CFF0] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Title */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-lg font-semibold text-gray-900">{current.title}</h2>
        <p className="text-sm text-gray-500">{current.subtitle}</p>
      </div>

      {/* Content Area */}
      <div className="p-6">{renderContent()}</div>
    </div>
  );
}
