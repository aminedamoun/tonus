'use client';

import { useState } from 'react';
import heroAdBlocksData from '@/data/hero-ad-blocks.json';

interface HeroAdBlock {
  id: string;
  slot: number;
  title: string;
  description: string;
  emoji: string;
  whatsapp_message: string;
  star_rating: number;
  image_url: string | null;
}

interface HeroAdsAdminProps {
  password: string;
}

export default function HeroAdsAdmin({ password }: HeroAdsAdminProps) {
  const [cards, setCards] = useState<HeroAdBlock[]>(heroAdBlocksData as HeroAdBlock[]);
  const [savingSlot, setSavingSlot] = useState<number | null>(null);
  const [savedSlot, setSavedSlot] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  function updateCard(id: string, field: keyof HeroAdBlock, value: string | number | null) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  async function handleSaveCard(slot: number) {
    setSavingSlot(slot);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ file: 'src/data/hero-ad-blocks.json', data: cards }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setSavingSlot(null);
      setSavedSlot(slot);
      setTimeout(() => setSavedSlot(null), 2000);
    } catch (err: unknown) {
      setSavingSlot(null);
      setErrorMessage(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">📢 Hero Ad Blocks</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage the 3 promotional cards shown on the hero section
        </p>
      </div>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-2xl border border-[#89CFF0]/30 p-6 space-y-4"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Card {card.slot}</h3>
              <span className="text-xs font-medium bg-[#89CFF0]/20 text-[#89CFF0] px-2 py-1 rounded-full">
                Slot {card.slot}
              </span>
            </div>

            {/* Emoji */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Emoji</label>
              <input
                type="text"
                value={card.emoji}
                onChange={(e) => updateCard(card.id, 'emoji', e.target.value)}
                placeholder="⭐"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent"
              />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={card.title}
                onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                placeholder="Card title"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={card.description}
                onChange={(e) => updateCard(card.id, 'description', e.target.value)}
                placeholder="Card description"
                rows={2}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent resize-none"
              />
            </div>

            {/* WhatsApp Message */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">WhatsApp Message</label>
              <textarea
                value={card.whatsapp_message}
                onChange={(e) => updateCard(card.id, 'whatsapp_message', e.target.value)}
                placeholder="Hi, I want to know more..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent resize-none"
              />
            </div>

            {/* Star Rating */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Star Rating</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={card.star_rating}
                  onChange={(e) => updateCard(card.id, 'star_rating', Number(e.target.value))}
                  className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent"
                />
                <span className="text-amber-400 text-lg">
                  {'★'.repeat(card.star_rating)}
                  {'☆'.repeat(5 - card.star_rating)}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={() => handleSaveCard(card.slot)}
              disabled={savingSlot === card.slot}
              className="w-full rounded-lg bg-[#89CFF0] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {savingSlot === card.slot
                ? 'Saving...'
                : savedSlot === card.slot
                  ? '✓ Saved!'
                  : `SAVE CARD ${card.slot}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
