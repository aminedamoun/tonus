'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
}

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showImageForm, setShowImageForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching gallery images:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('gallery_images')
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

    // First, get the image URL to extract the file path
    const imageToDelete = images.find(img => img.id === id);
    
    if (imageToDelete?.image_url) {
      // Extract file path from URL if it's from our storage
      const urlParts = imageToDelete.image_url.split('/gallery-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1].split('?')[0]; // Remove query params
        
        console.log('Deleting from storage, path:', filePath);
        
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('gallery-images')
          .remove([filePath]);
        
        if (storageError) {
          console.error('Error deleting image from storage:', storageError);
        } else {
          console.log('Successfully deleted from storage');
        }
      }
    }

    // Delete from database
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);

    if (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image: ' + error.message);
    } else {
      await fetchImages();
    }
  };

  const saveImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const imageData = {
      image_url: currentImageUrl || (formData.get('image_url') as string),
      alt_text: formData.get('alt_text') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'true',
    };

    if (!imageData.image_url) {
      alert('Please provide an image URL or upload an image');
      return;
    }

    if (editingImage) {
      const { error } = await supabase
        .from('gallery_images')
        .update(imageData)
        .eq('id', editingImage.id);

      if (error) {
        console.error('Error updating image:', error);
        alert('Failed to update image: ' + error.message);
      } else {
        setEditingImage(null);
        setShowImageForm(false);
        setImagePreview(null);
        setCurrentImageUrl('');
        await fetchImages();
      }
    } else {
      const { error } = await supabase.from('gallery_images').insert([imageData]);

      if (error) {
        console.error('Error creating image:', error);
        alert('Failed to create image: ' + error.message);
      } else {
        setShowImageForm(false);
        setImagePreview(null);
        setCurrentImageUrl('');
        await fetchImages();
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
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
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `gallery/${fileName}`;

      console.log('Uploading to path:', filePath);
      console.log('File size:', file.size, 'bytes');
      console.log('File type:', file.type);

      const { data, error } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image: ' + error.message);
        return;
      }

      console.log('Upload successful, data:', data);

      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('Public URL:', publicUrl);
      
      setImagePreview(publicUrl);
      setCurrentImageUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image);
    setShowImageForm(true);
    setImagePreview(image.image_url || null);
    setCurrentImageUrl(image.image_url || '');
  };

  const handleCancelForm = () => {
    setEditingImage(null);
    setShowImageForm(false);
    setImagePreview(null);
    setCurrentImageUrl('');
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
          <h3 className="text-xl font-bold text-foreground">Gallery Images ({images.length})</h3>
          <button
            onClick={() => {
              setEditingImage(null);
              setShowImageForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Icon name="PlusIcon" size={20} />
            Add Image
          </button>
        </div>

        {showImageForm && (
          <div className="bg-muted/50 p-6 rounded-2xl border-2 border-primary/40">
            <h4 className="text-lg font-bold mb-4">{editingImage ? 'Edit Image' : 'New Image'}</h4>
            <form onSubmit={saveImage} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">Image Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  />
                  {uploadingImage && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                  {imagePreview && (
                    <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">Or Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={currentImageUrl || ''}
                    onChange={(e) => setCurrentImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">Alt Text (Description)</label>
                  <textarea
                    name="alt_text"
                    defaultValue={editingImage?.alt_text}
                    required
                    rows={3}
                    placeholder="Describe the image for accessibility"
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
                <div>
                  <label className="block text-sm font-bold mb-2">Status</label>
                  <select
                    name="is_active"
                    defaultValue={editingImage?.is_active ? 'true' : 'false'}
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  {editingImage ? 'Update Image' : 'Add Image'}
                </button>
                <button type="button" onClick={handleCancelForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Images Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-background rounded-2xl overflow-hidden border-2 border-border">
              <div className="relative h-48">
                <Image src={image.image_url} alt={image.alt_text} fill className="object-cover" />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-bold text-foreground line-clamp-2">{image.alt_text}</p>
                  <p className="text-xs text-muted-foreground mt-1">Order: {image.display_order}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      image.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {image.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditImage(image)}
                      className="p-2 rounded-lg bg-primary/10"
                    >
                      <Icon name="PencilIcon" size={16} className="text-primary" />
                    </button>
                    <button
                      onClick={() => toggleActive(image.id, image.is_active)}
                      className="p-2 rounded-lg bg-secondary/10"
                    >
                      <Icon name={image.is_active ? 'EyeSlashIcon' : 'EyeIcon'} size={16} className="text-secondary" />
                    </button>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="p-2 rounded-lg bg-red-100"
                    >
                      <Icon name="TrashIcon" size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <Icon name="PhotoIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No gallery images yet. Add your first image!</p>
          </div>
        )}
      </div>
    </div>
  );
}