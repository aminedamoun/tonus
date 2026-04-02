'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

export default function HeroVideoManagement() {
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchVideoUrl();
  }, []);

  const fetchVideoUrl = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_video_url')
      .single();

    if (!error && data) {
      setVideoUrl(data.value || '');
    }
    setLoading(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please upload a valid video file (MP4, WebM, OGG, or MOV)' });
      return;
    }

    if (file.size > 104857600) {
      setMessage({ type: 'error', text: 'Video size must be less than 100MB' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-video-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('hero-videos')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        setMessage({ type: 'error', text: 'Upload failed: ' + uploadError.message });
        return;
      }

      const { data: urlData } = supabase.storage
        .from('hero-videos')
        .getPublicUrl(fileName);

      setVideoUrl(urlData.publicUrl);
      setMessage({ type: 'success', text: 'Video uploaded! Click "Save Video URL" to apply.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An error occurred while uploading' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!videoUrl.trim()) {
      setMessage({ type: 'error', text: 'Please provide a video URL' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'hero_video_url', value: videoUrl.trim(), updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Hero video URL saved successfully! Refresh the homepage to see changes.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="floating-card p-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="mt-3 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="floating-card p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Icon name="FilmIcon" size={22} className="text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Hero Banner Video</h3>
            <p className="text-sm text-muted-foreground">Upload or set the background video for the homepage hero section</p>
          </div>
        </div>

        {/* Current Video Preview */}
        {videoUrl && (
          <div className="bg-muted/40 rounded-2xl border-2 border-border p-4">
            <p className="text-sm font-bold mb-3 text-foreground">Current Video Preview</p>
            <video
              src={videoUrl}
              className="w-full max-h-48 rounded-xl object-cover"
              controls
              muted
              preload="metadata"
            />
            <p className="text-xs text-muted-foreground mt-2 break-all">{videoUrl}</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Upload New Video</label>
            <p className="text-xs text-muted-foreground mb-3">Supported formats: MP4, WebM, OGG, MOV (max 100MB)</p>
            <label className="cursor-pointer block">
              <div className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-border rounded-xl bg-muted/20">
                <Icon name="ArrowUpTrayIcon" size={20} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {uploading ? 'Uploading...' : 'Click to upload video file'}
                </span>
              </div>
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime,.webm,.mp4,.ogg,.mov"
                onChange={handleVideoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Or Enter Video URL Directly</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none text-sm"
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`px-4 py-3 rounded-xl text-sm font-medium ${
              message.type === 'success' ?'bg-green-100 text-green-700 border border-green-200' :'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Icon name="CheckIcon" size={18} />
              Save Video URL
            </>
          )}
        </button>
      </div>
    </div>
  );
}
