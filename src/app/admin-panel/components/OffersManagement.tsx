'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface Offer {
  id: string;
  title: string;
  description?: string;
  price: string;
  image_url?: string;
  valid_until?: string;
  available: boolean;
  display_order: number;
  star_rating?: number;
}

export default function OffersManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching offers:', error);
    } else {
      setOffers(data || []);
    }
    setLoading(false);
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('offers')
      .update({ available: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating availability:', error);
    } else {
      await fetchOffers();
    }
  };

  const deleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    const { error } = await supabase.from('offers').delete().eq('id', id);

    if (error) {
      console.error('Error deleting offer:', error);
    } else {
      await fetchOffers();
    }
  };

  const saveOffer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const offerData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      valid_until: formData.get('valid_until') as string || null,
      available: formData.get('available') === 'true',
      display_order: parseInt(formData.get('display_order') as string) || 0,
      image_url: currentImageUrl || null,
      star_rating: parseInt(formData.get('star_rating') as string) || 5,
    };

    if (editingOffer) {
      const { error } = await supabase
        .from('offers')
        .update(offerData)
        .eq('id', editingOffer.id);

      if (error) {
        console.error('Error updating offer:', error);
      } else {
        setEditingOffer(null);
        setShowOfferForm(false);
        setImagePreview(null);
        setCurrentImageUrl('');
        await fetchOffers();
      }
    } else {
      const { error } = await supabase.from('offers').insert([offerData]);

      if (error) {
        console.error('Error creating offer:', error);
      } else {
        setShowOfferForm(false);
        setImagePreview(null);
        setCurrentImageUrl('');
        await fetchOffers();
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingImage(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image: ' + (error as any).message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      setImagePreview(publicUrl);
      setCurrentImageUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setShowOfferForm(true);
    setImagePreview(offer.image_url || null);
    setCurrentImageUrl(offer.image_url || '');
  };

  const handleCancelForm = () => {
    setEditingOffer(null);
    setShowOfferForm(false);
    setImagePreview(null);
    setCurrentImageUrl('');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-foreground">Special Offers ({offers.length})</h3>
          <button
            onClick={() => {
              setEditingOffer(null);
              setShowOfferForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Icon name="PlusIcon" size={20} />
            Add Offer
          </button>
        </div>

        {showOfferForm && (
          <div className="bg-muted/50 p-6 rounded-2xl border-2 border-primary/40">
            <h4 className="text-lg font-bold mb-4">{editingOffer ? 'Edit Offer' : 'New Offer'}</h4>
            <form onSubmit={saveOffer} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingOffer?.title}
                    required
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Price</label>
                  <input
                    type="text"
                    name="price"
                    defaultValue={editingOffer?.price}
                    required
                    placeholder="€45"
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Valid Until</label>
                  <input
                    type="date"
                    name="valid_until"
                    defaultValue={editingOffer?.valid_until}
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    defaultValue={editingOffer?.display_order || 0}
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Star Rating (1–5)</label>
                  <select
                    name="star_rating"
                    defaultValue={editingOffer?.star_rating ?? 5}
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingOffer?.description}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-bold mb-2">Offer Image</label>
                
                {(imagePreview || editingOffer?.image_url) && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                    <Image
                      src={imagePreview || editingOffer?.image_url || ''}
                      alt="Offer preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-2 bg-secondary rounded-lg border-2 border-border text-center">
                      {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  {(imagePreview || editingOffer?.image_url) && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setCurrentImageUrl('');
                      }}
                      className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Availability</label>
                <select
                  name="available"
                  defaultValue={editingOffer?.available ? 'true' : 'false'}
                  className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary" disabled={uploadingImage}>
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-8 py-4 rounded-full bg-secondary text-foreground font-bold text-sm uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl border-2 border-border"
            >
              {offer.image_url && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={offer.image_url}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-lg">{offer.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} className={`w-3.5 h-3.5 ${s <= (offer.star_rating ?? 5) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-primary font-bold">{offer.price}</span>
                      <span className="text-xs text-muted-foreground">Valid: {formatDate(offer.valid_until)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${offer.available ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {offer.available ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleAvailability(offer.id, offer.available)}
                      className="p-2 rounded-lg bg-primary/10 text-primary"
                      title={offer.available ? 'Mark as unavailable' : 'Mark as available'}
                    >
                      <Icon name={offer.available ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
                    </button>
                    <button
                      onClick={() => handleEditOffer(offer)}
                      className="p-2 rounded-lg bg-accent/10 text-accent"
                      title="Edit offer"
                    >
                      <Icon name="PencilIcon" size={20} />
                    </button>
                    <button
                      onClick={() => deleteOffer(offer.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500"
                      title="Delete offer"
                    >
                      <Icon name="TrashIcon" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {offers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="SparklesIcon" size={48} className="mx-auto mb-4 opacity-50" />
            <p>No offers yet. Create your first special offer!</p>
          </div>
        )}
      </div>
    </div>
  );
}