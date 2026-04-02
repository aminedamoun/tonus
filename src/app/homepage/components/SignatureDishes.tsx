'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import { createWhatsAppLink, createOrderMessage } from '@/lib/whatsapp';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  badge?: string;
}

type SignatureType = 'dishes' | 'drinks' | 'shisha';

export default function SignatureDishes() {
  const [activeType, setActiveType] = useState<SignatureType>('dishes');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignatureItems();
  }, [activeType]);

  const fetchSignatureItems = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      // Map signature type to menu type
      const menuTypeMap = {
        'dishes': 'food',
        'drinks': 'bar',
        'shisha': 'shisha'
      };
      
      const menuType = menuTypeMap[activeType];
      
      // Fetch top 3 items from each menu type
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories!inner(menu_type)
        `)
        .eq('menu_categories.menu_type', menuType)
        .eq('available', true)
        .order('display_order', { ascending: true })
        .limit(3);

      if (error) throw error;
      
      if (data) {
        const formattedItems: MenuItem[] = data.map((item: any, index: number) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          imageUrl: item.image_url,
          badge: index === 0 ? 'Most Popular' : undefined
        }));
        setItems(formattedItems);
      }
    } catch (err) {
      console.error('Error fetching signature items:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: SignatureType) => {
    switch (type) {
      case 'dishes':
        return 'SparklesIcon';
      case 'drinks':
        return 'BeakerIcon';
      case 'shisha':
        return 'FireIcon';
      default:
        return 'SparklesIcon';
    }
  };

  const getTypeTitle = (type: SignatureType) => {
    switch (type) {
      case 'dishes':
        return 'Our Signature Dishes';
      case 'drinks':
        return 'Our Signature Drinks';
      case 'shisha':
        return 'Our Signature Shisha';
      default:
        return 'Our Signatures';
    }
  };

  return (
    <section className="section-padding bg-white reveal">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block pill-badge mb-4">{getTypeTitle(activeType)}</div>
          <h2 className="text-5xl md:text-7xl font-serif italic text-foreground">
            Taste the <span className="text-primary">Mediterranean</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each dish is crafted with authentic Greek recipes passed down through generations, 
            using the finest ingredients imported from Greece.
          </p>
        </div>

        {/* Type Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-secondary/50 rounded-full p-2 gap-2 border-2 border-primary/20">
            <button
              onClick={() => setActiveType('dishes')}
              className={`px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeType === 'dishes' ?'bg-primary text-white shadow-blue-glow-lg scale-105' :'text-muted-foreground hover:text-foreground hover:bg-hover-light-blue'
              }`}
            >
              <Icon name={getTypeIcon('dishes')} size={20} />
              Dishes
            </button>
            <button
              onClick={() => setActiveType('drinks')}
              className={`px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeType === 'drinks' ?'bg-primary text-white shadow-blue-glow-lg scale-105' :'text-muted-foreground hover:text-foreground hover:bg-hover-light-blue'
              }`}
            >
              <Icon name={getTypeIcon('drinks')} size={20} />
              Drinks
            </button>
            <button
              onClick={() => setActiveType('shisha')}
              className={`px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeType === 'shisha' ?'bg-primary text-white shadow-blue-glow-lg scale-105' :'text-muted-foreground hover:text-foreground hover:bg-hover-light-blue'
              }`}
            >
              <Icon name={getTypeIcon('shisha')} size={20} />
              Shisha
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading items...</p>
          </div>
        )}

        {/* Items Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} className="dish-card group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.imageUrl ? (
                    <AppImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <Icon name="PhotoIcon" size={64} className="text-muted-foreground" />
                    </div>
                  )}
                  {item.badge && (
                    <div className="absolute top-4 right-4 pill-badge">
                      {item.badge}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-serif italic text-foreground">{item.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2 flex-1">
                    {item.description}
                  </p>
                  {/* Price and WhatsApp order button - same layout as menu item cards */}
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <span className="text-2xl font-bold text-primary">{item.price}</span>
                    <button
                      onClick={() => {
                        const message = createOrderMessage(item.name, item.price);
                        window.open(createWhatsAppLink(message), '_blank');
                      }}
                      className="btn-primary p-4 text-white"
                      aria-label={`Order ${item.name} via WhatsApp`}
                    >
                      <Icon name="ChatBubbleLeftRightIcon" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/menu" className="btn-primary">
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
