'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';

interface RestaurantImage {
  id: string;
  url: string;
  title: string;
  alt: string;
  is_active: boolean;
  display_order: number;
}

export default function ImageManagement() {
  const [images, setImages] = useState<RestaurantImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<RestaurantImage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('restaurant_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('restaurant_images')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating image status:', error);
    } else {
      await fetchImages();
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const { error } = await supabase.from('restaurant_images').delete().eq('id', id);

    if (error) {
      console.error('Error deleting image:', error);
    } else {
      await fetchImages();
    }
  };

  const saveImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageData = {
      url: formData.get('url') as string,
      title: formData.get('title') as string,
      alt: formData.get('alt') as string,
      is_active: formData.get('is_active') === 'true',
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    if (editingImage) {
      const { error } = await supabase
        .from('restaurant_images')
        .update(imageData)
        .eq('id', editingImage.id);

      if (error) {
        console.error('Error updating image:', error);
      } else {
        setEditingImage(null);
        setShowForm(false);
        await fetchImages();
      }
    } else {
      const { error } = await supabase.from('restaurant_images').insert([imageData]);

      if (error) {
        console.error('Error creating image:', error);
      } else {
        setShowForm(false);
        await fetchImages();
      }
    }
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
          <h3 className="text-xl font-bold text-foreground">Restaurant Images ({images.length})</h3>
          <button
            onClick={() => {
              setEditingImage(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Icon name="PhotoIcon" size={20} />
            Upload Image
          </button>
        </div>

        {showForm && (
          <div className="bg-muted/50 p-6 rounded-2xl border-2 border-primary/40">
            <h4 className="text-lg font-bold mb-4">{editingImage ? 'Edit Image' : 'New Image'}</h4>
            <form onSubmit={saveImage} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Image URL</label>
                <input
                  type="url"
                  name="url"
                  defaultValue={editingImage?.url}
                  required
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingImage?.title}
                    required
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    defaultValue={editingImage?.display_order || 0}
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Alt Text (Description)</label>
                <input
                  type="text"
                  name="alt"
                  defaultValue={editingImage?.alt}
                  required
                  placeholder="Describe the image for accessibility"
                  className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    value="true"
                    defaultChecked={editingImage?.is_active ?? true}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-bold">Active</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {editingImage ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingImage(null);
                  }}
                  className="px-6 py-3 rounded-full bg-muted text-foreground font-bold text-sm uppercase tracking-wider transition-all duration-450 hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative rounded-2xl overflow-hidden border-2 border-primary/40 group transition-all duration-450 hover:border-primary/80 hover:shadow-blue-glow-lg hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="aspect-square">
                <AppImage src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                  <div>
                    <h4 className="font-bold text-white">{image.title}</h4>
                    <p className="text-xs text-white/70">{image.alt}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActive(image.id, image.is_active)}
                      className={`flex-1 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors ${
                        image.is_active
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {image.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingImage(image);
                        setShowForm(true);
                      }}
                      className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center transition-all duration-400 hover:scale-110 hover:shadow-blue-glow"
                    >
                      <Icon name="PencilIcon" size={18} />
                    </button>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="w-10 h-10 rounded-lg bg-destructive text-destructive-foreground flex items-center justify-center transition-all duration-400 hover:scale-110 hover:shadow-blue-glow"
                    >
                      <Icon name="TrashIcon" size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {image.is_active && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-success rounded-full flex items-center justify-center border-2 border-white shadow-blue-glow">
                  <Icon name="CheckIcon" size={16} className="text-success-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}