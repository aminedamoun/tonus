'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MenuAdmin from './components/MenuAdmin';
import OffersAdmin from './components/OffersAdmin';

type Tab = 'menu' | 'events';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('menu');

  useEffect(() => {
    const stored = localStorage.getItem('admin_password');
    if (stored) {
      setPassword(stored);
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword.trim()) return;
    localStorage.setItem('admin_password', inputPassword);
    setPassword(inputPassword);
    setAuthenticated(true);
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
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Enter Admin
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Tonos Admin</h1>
        <Link href="/homepage" className="text-sm text-primary hover:underline">
          Back to Site
        </Link>
      </header>

      {/* Tabs */}
      <div className="px-6 pt-6 flex gap-3">
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'menu'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'events'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Events &amp; Offers
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'menu' ? (
          <MenuAdmin password={password} />
        ) : (
          <OffersAdmin password={password} />
        )}
      </div>
    </div>
  );
}
