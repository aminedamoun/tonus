'use client';

import { useState } from 'react';

interface HeroVideoAdminProps {
  password: string;
}

export default function HeroVideoAdmin({ password: _password }: HeroVideoAdminProps) {
  const [videoUrl] = useState('/assets/banner_1.webm');
  const [inputUrl, setInputUrl] = useState(videoUrl);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#89CFF0]/30 p-6 space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">🎬 Hero Banner Video</h3>
          <p className="text-sm text-gray-500 mt-1">
            Upload or set the background video for the homepage hero section
          </p>
        </div>

        {/* Video Preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Current Video Preview</p>
          <video
            src={videoUrl}
            controls
            muted
            className="w-full max-w-2xl rounded-xl border border-gray-200"
          />
          <p className="text-xs text-gray-400 break-all">{videoUrl}</p>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Or Enter Video URL Directly
          </label>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="/assets/banner_1.webm"
            className="w-full max-w-2xl rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent"
          />
        </div>

        {/* Info Note */}
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm text-amber-800">
            ℹ️ This section is display-only for now. Video files cannot be committed via the GitHub
            API. To change the hero video, replace the file at{' '}
            <code className="rounded bg-amber-100 px-1 py-0.5 text-xs font-mono">
              public/assets/banner_1.webm
            </code>{' '}
            directly in the repository.
          </p>
        </div>
      </div>
    </div>
  );
}
