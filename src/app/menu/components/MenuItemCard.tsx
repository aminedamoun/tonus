import Icon from '@/components/ui/AppIcon';
import { createWhatsAppLink, createOrderMessage } from '@/lib/whatsapp';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: string;
  category: string;
  subcategory?: string;
  available: boolean;
  imageUrl?: string;
}

export default function MenuItemCard({
  name,
  description,
  price,
  category,
  subcategory,
  available,
  imageUrl,
}: MenuItemCardProps) {
  const handleOrderClick = () => {
    const message = createOrderMessage(name, price);
    const whatsappLink = createWhatsAppLink(message);
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="dish-card group overflow-hidden transition-all duration-500 h-full flex flex-col">
      {/* Image Section */}
      {imageUrl && (
        <div className="relative w-full h-64 overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {!available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold">
                Unavailable
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="pill-badge text-xs">{subcategory || category}</span>
          {!available && !imageUrl && (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
              Unavailable
            </span>
          )}
        </div>

        {/* Item Name */}
        <h3 className="text-2xl font-serif italic text-foreground group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {description}
          </p>
        )}

        {/* Price and Order Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <span className="text-2xl font-bold text-primary">{price}</span>
          <button
            onClick={handleOrderClick}
            disabled={!available}
            className="btn-primary p-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Order via WhatsApp"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
