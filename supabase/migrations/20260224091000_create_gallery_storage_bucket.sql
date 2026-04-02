-- Create Gallery Images Storage Bucket
-- Purpose: Dedicated storage for gallery images with proper RLS policies

-- Create gallery-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public read access for gallery images
DROP POLICY IF EXISTS "public_read_gallery_images" ON storage.objects;
CREATE POLICY "public_read_gallery_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- Authenticated users can upload gallery images
DROP POLICY IF EXISTS "authenticated_upload_gallery_images" ON storage.objects;
CREATE POLICY "authenticated_upload_gallery_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

-- Authenticated users can update gallery images
DROP POLICY IF EXISTS "authenticated_update_gallery_images" ON storage.objects;
CREATE POLICY "authenticated_update_gallery_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images')
WITH CHECK (bucket_id = 'gallery-images');

-- Authenticated users can delete gallery images
DROP POLICY IF EXISTS "authenticated_delete_gallery_images" ON storage.objects;
CREATE POLICY "authenticated_delete_gallery_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');