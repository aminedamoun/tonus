'use client';

import { useState } from 'react';
import aboutGalleryData from '@/data/about-gallery-images.json';
import ImageUpload from './ImageUpload';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
}

interface AboutGalleryAdminProps {
  password: string;
}

export default function AboutGalleryAdmin({ password }: AboutGalleryAdminProps) {
  const [images, setImages] = useState<GalleryImage[]>(aboutGalleryData as GalleryImage[]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  function updateImage(id: string, field: keyof GalleryImage, value: string | number | boolean) {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, [field]: value } : img)));
  }

  function deleteImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  function addImage() {
    const newImage: GalleryImage = {
      id: crypto.randomUUID(),
      image_url: '/assets/images/gallery/about/',
      alt_text: '',
      display_order: images.length + 1,
      is_active: true,
    };
    setImages((prev) => [...prev, newImage]);
    setEditingId(newImage.id);
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
        body: JSON.stringify({ file: 'src/data/about-gallery-images.json', data: images }),
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          📸 About Gallery Images ({images.length})
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addImage}
            className="rounded-lg bg-[#89CFF0] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            + ADD IMAGE
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'success'
                ? '✓ Saved!'
                : 'Save & Deploy'}
          </button>
        </div>
      </div>

      {saveStatus === 'error' && <p className="text-sm text-red-500">{errorMessage}</p>}

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => {
          const isEditing = editingId === image.id;

          return (
            <div
              key={image.id}
              className="bg-white rounded-2xl border border-[#89CFF0]/30 p-6 space-y-4"
            >
              {/* Image Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                {image.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No image
                  </div>
                )}
                {!image.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                      Hidden
                    </span>
                  </div>
                )}
              </div>

              {/* Info / Edit */}
              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-500">Image</label>
                    <ImageUpload
                      password={password}
                      folder="gallery/about"
                      currentUrl={image.image_url}
                      onUploaded={(url) => updateImage(image.id, 'image_url', url)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-500">Alt Text</label>
                    <input
                      type="text"
                      value={image.alt_text}
                      onChange={(e) => updateImage(image.id, 'alt_text', e.target.value)}
                      placeholder="Describe the image"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="space-y-1 flex-1">
                      <label className="block text-xs font-medium text-gray-500">Order</label>
                      <input
                        type="number"
                        value={image.display_order}
                        onChange={(e) =>
                          updateImage(image.id, 'display_order', Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <label className="block text-xs font-medium text-gray-500">Active</label>
                      <button
                        type="button"
                        onClick={() => updateImage(image.id, 'is_active', !image.is_active)}
                        className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          image.is_active
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {image.is_active ? '✓ Visible' : '✗ Hidden'}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Done Editing
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.alt_text || 'No alt text'}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Order: {image.display_order}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        image.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {image.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingId(isEditing ? null : image.id)}
                  className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {isEditing ? 'Cancel' : '✏️ Edit'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteImage(image.id)}
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {images.length === 0 && (
        <p className="py-12 text-center text-sm text-gray-400">
          No images yet. Click &quot;+ ADD IMAGE&quot; to add one.
        </p>
      )}
    </div>
  );
}
