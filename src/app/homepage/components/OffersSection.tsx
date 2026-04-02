'use client';
import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import offersData from '@/data/offers.json';
import { createWhatsAppLink } from '@/lib/whatsapp';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
  validUntil?: string;
  available: boolean;
  starRating: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function OffersSection() {
  // Load available offers from local JSON, sorted by display_order, limited to 3
  const [offers] = useState<Offer[]>(() =>
    offersData
      .filter((offer) => offer.available)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .slice(0, 3)
      .map((offer) => ({
        id: offer.id,
        title: offer.title,
        description: offer.description || '',
        price: offer.price,
        imageUrl: offer.image_url,
        validUntil: offer.valid_until,
        available: offer.available,
        starRating: offer.star_rating ?? 5,
      }))
  );
  const loading = false;
  const error: string | null = null;

  const formatValidUntil = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleWhatsApp = (offer: Offer) => {
    const message = `Hi! I'm interested in the "${offer.title}" special offer at ${offer.price}. Could you please provide more details?`;
    window.open(createWhatsAppLink(message), '_blank');
  };

  return (
    <section className="section-padding reveal bg-[rgba(248,251,252,1)]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block pill-badge mb-4">Our Special Offers</div>
          <h2 className="text-5xl md:text-7xl font-serif italic text-foreground">
            Special <span className="text-primary">Offers</span>
          </h2>
          <p className="text-sm font-medium text-primary/70 tracking-widest uppercase">
            Handpicked for you
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take advantage of our exclusive offers and experience authentic Greek cuisine at special
            prices.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading offers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <Icon name="ExclamationTriangleIcon" size={32} className="text-red-500" />
            </div>
            <p className="text-red-500 mb-4">{error}</p>
          </div>
        )}

        {/* Offers Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div key={offer.id} className="dish-card group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {offer.imageUrl ? (
                    <AppImage
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <Icon name="SparklesIcon" size={64} className="text-primary" />
                    </div>
                  )}
                  {offer.validUntil && (
                    <div className="absolute top-4 right-4 pill-badge bg-primary text-white">
                      Valid until {formatValidUntil(offer.validUntil)}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-serif italic text-foreground">{offer.title}</h3>
                  </div>
                  {/* Star Rating */}
                  <div className="mt-2">
                    <StarRating rating={offer.starRating} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2 flex-1">
                    {offer.description}
                  </p>
                  {/* Price and WhatsApp button - same layout as menu item cards */}
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <span className="text-2xl font-bold text-primary">{offer.price}</span>
                    <button
                      onClick={() => handleWhatsApp(offer)}
                      className="btn-primary p-4 text-white"
                      aria-label="Chat on WhatsApp about this offer"
                    >
                      <Icon name="ChatBubbleLeftRightIcon" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
