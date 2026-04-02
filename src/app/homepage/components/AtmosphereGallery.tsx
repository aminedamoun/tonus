'use client';
import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import galleryData from '@/data/gallery-images.json';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
}

export default function AtmosphereGallery() {
  // Load active gallery images from local JSON, sorted by display_order
  const [images] = useState<GalleryImage[]>(() =>
    (galleryData as GalleryImage[])
      .filter((img) => img.is_active)
      .sort((a, b) => a.display_order - b.display_order)
  );
  const loading = false;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % images.length;
    });
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + images.length) % images.length;
    });
  };

  useEffect(() => {
    if (selectedImageIndex === null) {
      document.body.style.overflow = 'unset';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageIndex, images.length]);

  if (loading) {
    return (
      <section className="section-padding bg-cream reveal">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  // Split images into rows (3 images per row)
  const rows = [];
  for (let i = 0; i < images.length; i += 3) {
    rows.push(images.slice(i, i + 3));
  }

  return (
    <>
      <section className="section-padding bg-cream reveal">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block pill-badge mb-4">Our Atmosphere</div>
            <h2 className="text-5xl md:text-7xl font-serif italic text-foreground">
              Experience the <span className="text-primary">Ambiance</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Step into a space that captures the essence of Greek hospitality, where every detail
              reflects Mediterranean warmth.
            </p>
          </div>

          {/* Gallery Grid - 3 Images per Row */}
          <div className="space-y-6">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {row.map((image, colIndex) => {
                  const imageIndex = rowIndex * 3 + colIndex;
                  return (
                    <div
                      key={image.id}
                      className="relative aspect-[4/3] rounded-[32px] overflow-hidden group cursor-pointer"
                      onClick={() => openLightbox(imageIndex)}
                    >
                      <AppImage
                        src={image.image_url}
                        alt={image.alt_text}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Hover Overlay with Magnify Icon */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40">
                          <Icon name="MagnifyingGlassPlusIcon" size={32} className="text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && images[selectedImageIndex] && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 hover:bg-white/20 transition-all"
            style={{ zIndex: 10001 }}
          >
            <Icon name="XMarkIcon" size={24} className="text-white" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 hover:bg-white/20 transition-all"
            style={{ zIndex: 10001, opacity: selectedImageIndex === 0 ? 0.3 : 1 }}
          >
            <Icon name="ChevronLeftIcon" size={24} className="text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 hover:bg-white/20 transition-all"
            style={{ zIndex: 10001, opacity: selectedImageIndex === images.length - 1 ? 0.3 : 1 }}
          >
            <Icon name="ChevronRightIcon" size={24} className="text-white" />
          </button>

          {/* Image Container */}
          <div
            className="relative max-w-6xl max-h-[90vh] w-full mx-20"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 10000 }}
          >
            <AppImage
              key={selectedImageIndex}
              src={images[selectedImageIndex].image_url}
              alt={images[selectedImageIndex].alt_text}
              className="w-full h-full object-contain rounded-2xl"
            />
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/20">
              <p className="text-white text-sm font-bold">
                {selectedImageIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
