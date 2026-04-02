'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface AboutGalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
}

export default function AboutGalleryManagement() {
  const [images, setImages] = useState<AboutGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<AboutGalleryImage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('about_gallery_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching about gallery images:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
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

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `about-gallery-${Date.now()}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        alert('Upload failed: ' + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      setImagePreview(urlData.publicUrl);
      setCurrentImageUrl(urlData.publicUrl);
    } catch (err) {
      console.error(err);
      alert('An error occurred while uploading');
    } finally {
      setUploading(false);
    }
  };

  const saveImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveError('');
    const formData = new FormData(e.currentTarget);

    const imageData = {
      image_url: currentImageUrl || (formData.get('image_url') as string),
      alt_text: formData.get('alt_text') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'true',
    };

    if (!imageData.image_url) {
      setSaveError('Please provide an image URL or upload an image');
      return;
    }

    if (editingImage) {
      const { error } = await supabase
        .from('about_gallery_images')
        .update(imageData)
        .eq('id', editingImage.id);

      if (error) {
        setSaveError('Failed to update image: ' + error.message);
      } else {
        handleCancelForm();
        await fetchImages();
      }
    } else {
      const { error } = await supabase.from('about_gallery_images').insert([imageData]);

      if (error) {
        setSaveError('Failed to add image: ' + error.message);
      } else {
        handleCancelForm();
        await fetchImages();
      }
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const imageToDelete = images.find((img) => img.id === id);
    if (imageToDelete?.image_url) {
      const urlParts = imageToDelete.image_url.split('/gallery-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1].split('?')[0];
        await supabase.storage.from('gallery-images').remove([filePath]);
      }
    }

    const { error } = await supabase.from('about_gallery_images').delete().eq('id', id);
    if (error) {
      alert('Failed to delete image: ' + error.message);
    } else {
      await fetchImages();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('about_gallery_images')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) await fetchImages();
  };

  const handleEditImage = (image: AboutGalleryImage) => {
    setEditingImage(image);
    setShowForm(true);
    setImagePreview(image.image_url || null);
    setCurrentImageUrl(image.image_url || '');
    setSaveError('');
  };

  const handleCancelForm = () => {
    setEditingImage(null);
    setShowForm(false);
    setImagePreview(null);
    setCurrentImageUrl('');
    setSaveError('');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
        <p className="text-gray-500 text-sm">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{images.length} image{images.length !== 1 ? 's' : ''} in About Us gallery</p>
        </div>
        <button
          onClick={() => { setEditingImage(null); setShowForm(true); setSaveError(''); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          <Icon name="PlusIcon" size={16} className="text-white" />
          Add Image
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border-2 border-primary p-6">
          <h4 className="text-base font-bold text-gray-900 mb-4">
            {editingImage ? '✏️ Edit Image' : '➕ Add New Image'}
          </h4>
          <form onSubmit={saveImage} className="space-y-4">
            {/* Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Upload Image File
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              />
              {uploading && (
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <span className="inline-block animate-spin rounded-full h-3 w-3 border-b border-blue-600"></span>
                  Uploading...
                </p>
              )}
            </div>

            {/* Preview */}
            {imagePreview && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Preview</label>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Or paste Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={currentImageUrl}
                onChange={(e) => { setCurrentImageUrl(e.target.value); setImagePreview(e.target.value); }}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-primary outline-none"
              />
            </div>

            {/* Alt text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Image Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alt_text"
                defaultValue={editingImage?.alt_text}
                required
                rows={2}
                placeholder="Describe what's in the image (e.g. Chef preparing Greek salad)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-primary outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Display order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  defaultValue={editingImage?.display_order ?? images.length + 1}
                  min={1}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-primary outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Lower number = shown first</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Visibility</label>
                <select
                  name="is_active"
                  defaultValue={editingImage?.is_active !== false ? 'true' : 'false'}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-primary outline-none bg-white"
                >
                  <option value="true">✅ Visible on website</option>
                  <option value="false">🚫 Hidden</option>
                </select>
              </div>
            </div>

            {saveError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{saveError}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {editingImage ? 'Save Changes' : 'Add Image'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Images grid */}
      {images.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Icon name="PhotoIcon" size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No images yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Image" to add your first photo</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Image */}
              <div className="relative h-44 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = 'none';
                  }}
                />
                {/* Status badge */}
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  image.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {image.is_active ? 'Visible' : 'Hidden'}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{image.alt_text}</p>
                <p className="text-xs text-gray-400 mb-3">Order: {image.display_order}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditImage(image)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200"
                  >
                    <Icon name="PencilIcon" size={13} className="text-blue-700" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(image.id, image.is_active)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-200"
                  >
                    <Icon name={image.is_active ? 'EyeSlashIcon' : 'EyeIcon'} size={13} className="text-gray-600" />
                    {image.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-200"
                  >
                    <Icon name="TrashIcon" size={13} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
