'use client';

import { useState } from 'react';
import offersData from '@/data/offers.json';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: string | null;
  valid_until: string | null;
  available: boolean;
  display_order: number;
  image_url: string;
  star_rating: number;
}

interface OffersAdminProps {
  password: string;
}

export default function OffersAdmin({ password }: OffersAdminProps) {
  const [offers, setOffers] = useState<Offer[]>(offersData as Offer[]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function updateOffer(id: string, field: keyof Offer, value: string | number | boolean | null) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  }

  function deleteOffer(id: string) {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  }

  function addOffer() {
    const newOffer: Offer = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      price: null,
      valid_until: null,
      available: true,
      display_order: offers.length,
      image_url: '/assets/images/menu/',
      star_rating: 5,
    };
    setOffers((prev) => [...prev, newOffer]);
  }

  async function handleSave() {
    setSaveStatus('saving');
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ file: 'src/data/offers.json', data: offers }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err: unknown) {
      setSaveStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Offers / Events</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addOffer}
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            + Add Offer
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'success'
                ? 'Saved!'
                : 'Save & Deploy'}
          </button>
        </div>
      </div>

      {saveStatus === 'error' && <p className="text-sm text-red-500">{errorMessage}</p>}

      <div className="space-y-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex gap-4 rounded-lg border border-border bg-background p-4"
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              {offer.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={offer.image_url}
                  alt={offer.title}
                  className="h-20 w-[100px] rounded object-cover"
                />
              ) : (
                <div className="flex h-20 w-[100px] items-center justify-center rounded bg-border text-xs text-foreground/50">
                  No image
                </div>
              )}
              <input
                type="text"
                value={offer.image_url}
                onChange={(e) => updateOffer(offer.id, 'image_url', e.target.value)}
                placeholder="Image URL"
                className="mt-1 w-[100px] rounded border border-border bg-background px-1 py-0.5 text-[10px] text-foreground"
              />
            </div>

            {/* Fields */}
            <div className="flex flex-1 flex-col gap-2">
              {/* Row 1: Title + Price */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => updateOffer(offer.id, 'title', e.target.value)}
                  placeholder="Title"
                  className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
                />
                <input
                  type="text"
                  value={offer.price ?? ''}
                  onChange={(e) => updateOffer(offer.id, 'price', e.target.value || null)}
                  placeholder="Price (e.g. AED 50.00)"
                  className="w-44 rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
                />
              </div>

              {/* Row 2: Description */}
              <textarea
                value={offer.description}
                onChange={(e) => updateOffer(offer.id, 'description', e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
              />

              {/* Row 3: Star rating, Available, Valid until */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <label className="flex items-center gap-1 text-foreground">
                  Stars
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={offer.star_rating}
                    onChange={(e) => updateOffer(offer.id, 'star_rating', Number(e.target.value))}
                    className="w-16 rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
                  />
                </label>

                <label className="flex items-center gap-1 text-foreground">
                  <input
                    type="checkbox"
                    checked={offer.available}
                    onChange={(e) => updateOffer(offer.id, 'available', e.target.checked)}
                    className="accent-primary"
                  />
                  Available
                </label>

                <label className="flex items-center gap-1 text-foreground">
                  Valid until
                  <input
                    type="date"
                    value={offer.valid_until ?? ''}
                    onChange={(e) => updateOffer(offer.id, 'valid_until', e.target.value || null)}
                    className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
                  />
                </label>

                <label className="flex items-center gap-1 text-foreground">
                  Order
                  <input
                    type="number"
                    value={offer.display_order}
                    onChange={(e) => updateOffer(offer.id, 'display_order', Number(e.target.value))}
                    className="w-16 rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
                  />
                </label>
              </div>
            </div>

            {/* Delete */}
            <button
              type="button"
              onClick={() => deleteOffer(offer.id)}
              className="flex-shrink-0 self-start rounded px-2 py-1 text-sm text-red-500 hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        ))}

        {offers.length === 0 && (
          <p className="py-8 text-center text-sm text-foreground/50">
            No offers yet. Click &quot;+ Add Offer&quot; to create one.
          </p>
        )}
      </div>
    </div>
  );
}
