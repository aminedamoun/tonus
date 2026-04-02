'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
}

const fallbackImages: GalleryImage[] = [
{ id: 'story_kitchen', image_url: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e5bccedd-1772095430402.png', alt_text: 'Chef preparing traditional Greek dishes in open kitchen with fresh ingredients', display_order: 1, is_active: true },
{ id: 'story_ingredients', image_url: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d8180acc-1772053971388.png', alt_text: 'Fresh Mediterranean vegetables and herbs arranged on rustic wooden table', display_order: 2, is_active: true },
{ id: 'story_olive_oil', image_url: 'https://img.rocket.new/generatedImages/rocket_gen_img_14b9b7d24-1772095429710.png', alt_text: 'Premium extra virgin olive oil being poured from traditional Greek bottle', display_order: 3, is_active: true },
{ id: 'story_preparation', image_url: 'https://img.rocket.new/generatedImages/rocket_gen_img_10c07dfde-1766484045960.png', alt_text: 'Hands preparing fresh phyllo dough for traditional Greek pastries', display_order: 4, is_active: true },
{ id: 'story_grill', image_url: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e69a3ada-1772095431317.png', alt_text: 'Meat and vegetables being grilled over open flame in traditional Greek style', display_order: 5, is_active: true },
{ id: 'story_herbs', image_url: "https://img.rocket.new/generatedImages/rocket_gen_img_1b1bf229b-1772768377008.png", alt_text: 'Fresh Mediterranean herbs and spices in ceramic bowls', display_order: 6, is_active: true }];


function optimizeSupabaseUrl(src: string, width: number): string {
  if (!src) return src;
  if (!src.includes('.supabase.co/storage/')) return src;
  if (src.includes('?width=') || src.includes('&width=')) return src;
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}width=${width}&quality=80&format=webp`;
}

export default function VisualStoryGallery() {
  const [images, setImages] = useState<GalleryImage[]>(fallbackImages);

  useEffect(() => {
    const supabase = createClient();
    supabase.
    from('about_gallery_images').
    select('id, image_url, alt_text, display_order, is_active').
    eq('is_active', true).
    order('display_order', { ascending: true }).
    then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setImages(data as GalleryImage[]);
      }
    });
  }, []);

  const displayImages = images.slice(0, 6);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-block pill-badge mb-4">Our Ambience</div>
        <h2 className="text-5xl md:text-6xl font-serif italic text-foreground">
          Feel the  <span className="text-primary">Mediterranean</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Soft lighting. Warm tones. The scent of fresh herbs and grilled dishes in the air. Tonos isn't just a restaurant — it's your escape to Greece, right here in Dubai.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {displayImages.map((img) =>
        <div key={img.id} className="relative rounded-[24px] overflow-hidden group cursor-pointer" style={{ height: '320px' }}>
            <img
            src={optimizeSupabaseUrl(img.image_url, 600)}
            alt={img.alt_text}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImages[0].image_url;
            }} />
          
            {/* Hover Overlay with Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 30px 6px rgba(212, 175, 55, 0.45)' }} />
          </div>
        )}
      </div>
    </div>);

}