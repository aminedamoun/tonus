'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface HeroAdBlock {
  id: string;
  slot: number;
  image_url: string | null;
  star_rating: number;
  alt_text: string;
  title: string;
  description: string;
  emoji: string;
  whatsapp_message: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className=""
        >
          <svg
            className={`w-7 h-7 ${
              star <= (hovered || value) ? 'text-yellow-400' : 'text-gray-300'
            } transition-colors`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm font-bold text-foreground">{value}/5</span>
    </div>
  );
}

export default function HeroAdBlocksManagement() {
  const [blocks, setBlocks] = useState<HeroAdBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [localData, setLocalData] = useState<Record<number, Partial<HeroAdBlock>>>({});
  const supabase = createClient();

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_ad_blocks')
      .select('*')
      .order('slot', { ascending: true });
    if (!error && data) {
      setBlocks(data);
      const local: Record<number, Partial<HeroAdBlock>> = {};
      data.forEach((b: HeroAdBlock) => {
        local[b.slot] = {
          star_rating: b.star_rating,
          alt_text: b.alt_text,
          title: b.title,
          description: b.description,
          emoji: b.emoji,
          whatsapp_message: b.whatsapp_message,
        };
      });
      setLocalData(local);
    }
    setLoading(false);
  };

  const updateLocal = (slot: number, field: keyof HeroAdBlock, value: string | number) => {
    setLocalData((prev) => ({
      ...prev,
      [slot]: { ...prev[slot], [field]: value },
    }));
  };

  const handleImageUpload = async (slot: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }
    if (file.size > 5242880) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingSlot(slot);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-ad-${slot}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        alert('Upload failed: ' + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('hero_ad_blocks')
        .update({ image_url: urlData.publicUrl })
        .eq('slot', slot);

      if (updateError) {
        alert('Failed to save image URL');
        return;
      }
      await fetchBlocks();
    } catch (err) {
      console.error(err);
      alert('An error occurred while uploading');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemoveImage = async (slot: number) => {
    if (!confirm('Remove this image?')) return;
    const { error } = await supabase
      .from('hero_ad_blocks')
      .update({ image_url: null })
      .eq('slot', slot);
    if (!error) await fetchBlocks();
  };

  const handleSaveBlock = async (slot: number) => {
    setSaving(slot);
    const d = localData[slot] ?? {};
    const { error } = await supabase
      .from('hero_ad_blocks')
      .update({
        star_rating: d.star_rating ?? 5,
        alt_text: d.alt_text ?? 'Promotional offer',
        title: d.title ?? '',
        description: d.description ?? '',
        emoji: d.emoji ?? '⭐',
        whatsapp_message: d.whatsapp_message ?? 'Hi, I want to know more about this offer.',
      })
      .eq('slot', slot);
    if (error) alert('Failed to save changes');
    else await fetchBlocks();
    setSaving(null);
  };

  if (loading) {
    return (
      <div className="floating-card p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="floating-card p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Icon name="PhotoIcon" size={22} className="text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Hero Ad Blocks</h3>
            <p className="text-sm text-muted-foreground">Manage the 3 promotional cards shown on the hero section</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blocks.map((block) => {
            const d = localData[block.slot] ?? {};
            return (
              <div key={block.id} className="bg-muted/40 rounded-2xl border-2 border-border p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-lg">Card {block.slot}</span>
                  <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">Slot {block.slot}</span>
                </div>

                {/* Image Preview */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-border bg-secondary/30">
                  {block.image_url ? (
                    <Image
                      src={block.image_url}
                      alt={block.alt_text}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Icon name="PhotoIcon" size={36} />
                      <span className="text-xs">No image uploaded</span>
                    </div>
                  )}
                </div>

                {/* Image Actions */}
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-2 bg-secondary rounded-lg border-2 border-border text-center text-sm font-medium">
                      {uploadingSlot === block.slot ? 'Uploading...' : 'Upload Image'}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(block.slot, e)}
                      disabled={uploadingSlot === block.slot}
                      className="hidden"
                    />
                  </label>
                  {block.image_url && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(block.slot)}
                      className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Emoji */}
                <div>
                  <label className="block text-sm font-bold mb-1">Emoji</label>
                  <input
                    type="text"
                    value={d.emoji ?? block.emoji ?? '⭐'}
                    onChange={(e) => updateLocal(block.slot, 'emoji', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border focus:border-primary outline-none text-sm"
                    placeholder="e.g. 🌙"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-bold mb-1">Title</label>
                  <input
                    type="text"
                    value={d.title ?? block.title ?? ''}
                    onChange={(e) => updateLocal(block.slot, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border focus:border-primary outline-none text-sm"
                    placeholder="Card title..."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold mb-1">Description</label>
                  <textarea
                    value={d.description ?? block.description ?? ''}
                    onChange={(e) => updateLocal(block.slot, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border focus:border-primary outline-none text-sm resize-none"
                    placeholder="Short description..."
                  />
                </div>

                {/* WhatsApp Message */}
                <div>
                  <label className="block text-sm font-bold mb-1">WhatsApp Message</label>
                  <textarea
                    value={d.whatsapp_message ?? block.whatsapp_message ?? ''}
                    onChange={(e) => updateLocal(block.slot, 'whatsapp_message', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border focus:border-primary outline-none text-sm resize-none"
                    placeholder="Message sent via WhatsApp..."
                  />
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-bold mb-2">Star Rating</label>
                  <StarPicker
                    value={d.star_rating ?? block.star_rating ?? 5}
                    onChange={(v) => updateLocal(block.slot, 'star_rating', v)}
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={() => handleSaveBlock(block.slot)}
                  disabled={saving === block.slot}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {saving === block.slot ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Icon name="CheckIcon" size={16} />
                      Save Card {block.slot}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
