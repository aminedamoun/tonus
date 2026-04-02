'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  password: string;
  folder?: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}

import { toPreviewSrc } from '../utils';

export default function ImageUpload({
  password,
  folder = 'menu',
  currentUrl,
  onUploaded,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [localPreview, setLocalPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setUploading(true);
    setError('');

    // Show instant local preview
    setLocalPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onUploaded(data.url);
      // Use GitHub raw URL for preview since local path won't work until next deploy
      setLocalPreview(data.previewUrl || toPreviewSrc(data.url));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {(localPreview || currentUrl) && (
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={localPreview || toPreviewSrc(currentUrl || '')}
            alt="Current"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fall back to local path if GitHub raw fails
              const target = e.target as HTMLImageElement;
              if (currentUrl && target.src !== currentUrl) target.src = currentUrl;
            }}
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <label
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition-colors ${
            uploading
              ? 'bg-gray-200 text-gray-500 cursor-wait'
              : 'bg-[#89CFF0] text-white hover:bg-[#6bb8e8]'
          }`}
        >
          {uploading ? '⏳ Uploading...' : '📷 Upload Image'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {currentUrl && (
          <span className="text-xs text-gray-400 truncate max-w-[200px]">{currentUrl}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
