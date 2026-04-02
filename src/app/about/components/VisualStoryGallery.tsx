'use client';
import { useState, useEffect } from 'react';
import aboutGalleryStatic from '@/data/about-gallery-images.json';
import { useLiveData } from '@/lib/useLiveData';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
}

const fallbackImages: GalleryImage[] = [
  {
    id: 'story_kitchen',
    image_url: '/assets/images/about/story-kitchen.webp',
    alt_text: 'Chef preparing traditional Greek dishes in open kitchen with fresh ingredients',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'story_ingredients',
    image_url: '/assets/images/about/story-vegetables.webp',
    alt_text: 'Fresh Mediterranean vegetables and herbs arranged on rustic wooden table',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'story_olive_oil',
    image_url: '/assets/images/about/story-olive-oil.webp',
    alt_text: 'Premium extra virgin olive oil being poured from traditional Greek bottle',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'story_preparation',
    image_url: '/assets/images/about/story-phyllo.webp',
    alt_text: 'Hands preparing fresh phyllo dough for traditional Greek pastries',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'story_grill',
    image_url: '/assets/images/about/story-grilling.webp',
    alt_text: 'Meat and vegetables being grilled over open flame in traditional Greek style',
    display_order: 5,
    is_active: true,
  },
  {
    id: 'story_herbs',
    image_url: '/assets/images/about/story-herbs.webp',
    alt_text: 'Fresh Mediterranean herbs and spices in ceramic bowls',
    display_order: 6,
    is_active: true,
  },
];

function getImageUrl(src: string): string {
  if (!src) return src;
  return src;
}

export default function VisualStoryGallery() {
  const aboutGalleryData = useLiveData('about-gallery-images.json', aboutGalleryStatic);

  const [images, setImages] = useState<GalleryImage[]>(fallbackImages);

  useEffect(() => {
    const activeImages = aboutGalleryData
      .filter((img) => img.is_active)
      .sort((a, b) => a.display_order - b.display_order) as GalleryImage[];

    if (activeImages.length > 0) {
      setImages(activeImages);
    }
  }, [aboutGalleryData]);

  const displayImages = images.slice(0, 6);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-block pill-badge mb-4">Our Ambience</div>
        <h2 className="text-5xl md:text-6xl font-serif italic text-foreground">
          Feel the <span className="text-primary">Mediterranean</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Soft lighting. Warm tones. The scent of fresh herbs and grilled dishes in the air. Tonos
          isn&apos;t just a restaurant — it&apos;s your escape to Greece, right here in Dubai.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {displayImages.map((img) => (
          <div
            key={img.id}
            className="relative rounded-[24px] overflow-hidden group cursor-pointer"
            style={{ height: '320px' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(img.image_url)}
              alt={img.alt_text}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImages[0].image_url;
              }}
            />

            {/* Hover Overlay with Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: '0 0 30px 6px rgba(212, 175, 55, 0.45)' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
