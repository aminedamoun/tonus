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

const emptyOffer = (): Offer => ({
  id: crypto.randomUUID(),
  title: '',
  description: '',
  price: null,
  valid_until: null,
  available: true,
  display_order: 0,
  image_url: '/assets/images/menu/',
  star_rating: 5,
});

export default function OffersAdmin({ password }: OffersAdminProps) {
  const [offers, setOffers] = useState<Offer[]>(offersData as Offer[]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Offer | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newDraft, setNewDraft] = useState<Offer>(emptyOffer());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /* ---- CRUD helpers ---- */

  function startEdit(offer: Offer) {
    setEditingId(offer.id);
    setEditDraft({ ...offer });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  function saveEdit() {
    if (!editDraft) return;
    setOffers((prev) => prev.map((o) => (o.id === editDraft.id ? editDraft : o)));
    cancelEdit();
  }

  function toggleAvailable(id: string) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, available: !o.available } : o)));
  }

  function deleteOffer(id: string) {
    if (!confirm('Delete this offer?')) return;
    setOffers((prev) => prev.filter((o) => o.id !== id));
    if (editingId === id) cancelEdit();
  }

  function openAdd() {
    setAddingNew(true);
    setNewDraft({ ...emptyOffer(), display_order: offers.length });
  }

  function cancelAdd() {
    setAddingNew(false);
  }

  function confirmAdd() {
    setOffers((prev) => [newDraft, ...prev]);
    setAddingNew(false);
  }

  /* ---- Save & Deploy ---- */

  async function handleSave() {
    setSaveStatus('saving');
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
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

  /* ---- Stars renderer ---- */

  function renderStars(rating: number) {
    return (
      <span className="text-yellow-400 tracking-wide">
        {Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆')).join('')}
      </span>
    );
  }

  /* ---- Inline form (used for add + edit) ---- */

  function renderForm(
    draft: Offer,
    setDraft: (o: Offer) => void,
    onSave: () => void,
    onCancel: () => void,
    label: string
  ) {
    return (
      <div className="bg-white rounded-2xl border border-[#89CFF0]/30 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">{label}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
            <input
              type="text"
              value={draft.price ?? ''}
              onChange={(e) => setDraft({ ...draft, price: e.target.value || null })}
              placeholder="e.g. AED 50.00 or Tap Now"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
          <input
            type="text"
            value={draft.image_url}
            onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Star Rating (1-5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={draft.star_rating}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  star_rating: Math.min(5, Math.max(1, Number(e.target.value))),
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Valid Until</label>
            <input
              type="date"
              value={draft.valid_until ?? ''}
              onChange={(e) => setDraft({ ...draft, valid_until: e.target.value || null })}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
            />
          </div>
          <div className="flex items-center gap-2 pb-1">
            <input
              type="checkbox"
              checked={draft.available}
              onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
              className="h-4 w-4 accent-[#0ea5e9]"
              id={`avail-${draft.id}`}
            />
            <label htmlFor={`avail-${draft.id}`} className="text-sm text-gray-700">
              Available
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-[#0ea5e9] px-5 py-2 text-sm font-medium text-white hover:bg-[#0284c7] transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  /* ---- Render ---- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Special Offers{' '}
          <span className="text-base font-normal text-gray-500">({offers.length})</span>
        </h2>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          + ADD OFFER
        </button>
      </div>

      {/* Save & Deploy */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="rounded-lg bg-[#0ea5e9] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0284c7] disabled:opacity-50 transition-colors"
        >
          {saveStatus === 'saving'
            ? 'Saving...'
            : saveStatus === 'success'
              ? 'Saved!'
              : 'Save & Deploy'}
        </button>
        {saveStatus === 'error' && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>

      {/* Add form */}
      {addingNew && renderForm(newDraft, (o) => setNewDraft(o), confirmAdd, cancelAdd, 'New Offer')}

      {/* Offer list */}
      <div className="space-y-4">
        {offers.map((offer) => {
          const isEditing = editingId === offer.id;

          if (isEditing && editDraft) {
            return (
              <div key={offer.id}>
                {renderForm(editDraft, (o) => setEditDraft(o), saveEdit, cancelEdit, 'Edit Offer')}
              </div>
            );
          }

          return (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-[#89CFF0]/30 p-6 flex items-start gap-5"
            >
              {/* Left: image thumbnail */}
              <div className="flex-shrink-0">
                {offer.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* Middle: details */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <h3 className="font-bold text-gray-900 truncate">{offer.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{offer.description}</p>
                <div className="flex items-center gap-3 flex-wrap text-sm">
                  {renderStars(offer.star_rating)}
                  {offer.price && (
                    <span className="text-[#0ea5e9] font-medium cursor-pointer hover:underline">
                      {offer.price}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                  {offer.valid_until && <span>Valid: {offer.valid_until}</span>}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      offer.available
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {offer.available ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Right: action buttons */}
              <div className="flex-shrink-0 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleAvailable(offer.id)}
                  title={offer.available ? 'Hide' : 'Show'}
                  className="rounded-lg p-2 hover:bg-gray-100 transition-colors text-lg"
                >
                  {offer.available ? '👁️' : '🙈'}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(offer)}
                  title="Edit"
                  className="rounded-lg p-2 hover:bg-gray-100 transition-colors text-lg"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  onClick={() => deleteOffer(offer.id)}
                  title="Delete"
                  className="rounded-lg p-2 hover:bg-red-50 text-lg transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}

        {offers.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-400">
            No offers yet. Click &quot;+ ADD OFFER&quot; to create one.
          </p>
        )}
      </div>
    </div>
  );
}
