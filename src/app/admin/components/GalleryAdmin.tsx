'use client';

import { useState } from 'react';
import galleryData from '@/data/gallery-images.json';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
}

interface GalleryAdminProps {
  password: string;
}

const emptyImage = (): GalleryImage => ({
  id: crypto.randomUUID(),
  image_url: '/assets/images/gallery/',
  alt_text: '',
  display_order: 0,
  is_active: true,
});

export default function GalleryAdmin({ password }: GalleryAdminProps) {
  const [images, setImages] = useState<GalleryImage[]>(galleryData as GalleryImage[]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<GalleryImage | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newDraft, setNewDraft] = useState<GalleryImage>(emptyImage());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /* ---- CRUD helpers ---- */

  function startEdit(img: GalleryImage) {
    setEditingId(img.id);
    setEditDraft({ ...img });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  function saveEdit() {
    if (!editDraft) return;
    setImages((prev) => prev.map((i) => (i.id === editDraft.id ? editDraft : i)));
    cancelEdit();
  }

  function toggleActive(id: string) {
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, is_active: !i.is_active } : i)));
  }

  function deleteImage(id: string) {
    if (!confirm('Delete this gallery image?')) return;
    setImages((prev) => prev.filter((i) => i.id !== id));
    if (editingId === id) cancelEdit();
  }

  function openAdd() {
    setAddingNew(true);
    setNewDraft({ ...emptyImage(), display_order: images.length + 1 });
  }

  function cancelAdd() {
    setAddingNew(false);
  }

  function confirmAdd() {
    setImages((prev) => [...prev, newDraft]);
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
        body: JSON.stringify({ file: 'src/data/gallery-images.json', data: images }),
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

  /* ---- Inline form (add / edit) ---- */

  function renderForm(
    draft: GalleryImage,
    setDraft: (img: GalleryImage) => void,
    onSave: () => void,
    onCancel: () => void,
    label: string
  ) {
    return (
      <div className="bg-white rounded-2xl border border-[#89CFF0]/30 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">{label}</h3>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
          <input
            type="text"
            value={draft.image_url}
            onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
          />
        </div>

        {draft.image_url && (
          <div className="w-48">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={draft.image_url}
              alt={draft.alt_text || 'Preview'}
              className="w-full aspect-video rounded-xl object-cover border border-gray-200"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Alt Text / Title</label>
          <input
            type="text"
            value={draft.alt_text}
            onChange={(e) => setDraft({ ...draft, alt_text: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Display Order</label>
            <input
              type="number"
              value={draft.display_order}
              onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
            />
          </div>
          <div className="flex items-center gap-2 pb-1">
            <input
              type="checkbox"
              checked={draft.is_active}
              onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
              className="h-4 w-4 accent-[#0ea5e9]"
              id={`active-${draft.id}`}
            />
            <label htmlFor={`active-${draft.id}`} className="text-sm text-gray-700">
              Active
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
          Gallery Images{' '}
          <span className="text-base font-normal text-gray-500">({images.length})</span>
        </h2>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          + ADD IMAGE
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
      {addingNew &&
        renderForm(newDraft, (img) => setNewDraft(img), confirmAdd, cancelAdd, 'New Gallery Image')}

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {images.map((img) => {
          const isEditing = editingId === img.id;

          if (isEditing && editDraft) {
            return (
              <div key={img.id} className="sm:col-span-2 lg:col-span-3">
                {renderForm(editDraft, (i) => setEditDraft(i), saveEdit, cancelEdit, 'Edit Image')}
              </div>
            );
          }

          return (
            <div
              key={img.id}
              className="bg-white rounded-2xl border border-[#89CFF0]/30 p-6 flex flex-col gap-3"
            >
              {/* Image preview */}
              {img.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={img.image_url}
                  alt={img.alt_text}
                  className="w-full aspect-video rounded-xl object-cover"
                />
              ) : (
                <div className="w-full aspect-video rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                  No image
                </div>
              )}

              {/* Info */}
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {img.alt_text || 'No title'}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>Order: {img.display_order}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      img.is_active
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {img.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => startEdit(img)}
                  title="Edit"
                  className="rounded-lg p-2 hover:bg-gray-100 transition-colors text-lg"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  onClick={() => toggleActive(img.id)}
                  title={img.is_active ? 'Hide' : 'Show'}
                  className="rounded-lg p-2 hover:bg-gray-100 transition-colors text-lg"
                >
                  {img.is_active ? '👁️' : '🙈'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteImage(img.id)}
                  title="Delete"
                  className="rounded-lg p-2 hover:bg-red-50 text-lg transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {images.length === 0 && (
        <p className="py-12 text-center text-sm text-gray-400">
          No gallery images yet. Click &quot;+ ADD IMAGE&quot; to add one.
        </p>
      )}
    </div>
  );
}
