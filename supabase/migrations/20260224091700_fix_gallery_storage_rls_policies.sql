-- Fix Gallery Images Storage RLS Policies
-- Purpose: Allow authenticated users to upload, update, and delete gallery images

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "public_read_gallery_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_upload_gallery_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_gallery_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete_gallery_images" ON storage.objects;

-- Public read access for gallery images (anyone can view)
CREATE POLICY "public_read_gallery_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- Authenticated users can upload gallery images
CREATE POLICY "authenticated_upload_gallery_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

-- Authenticated users can update gallery images
CREATE POLICY "authenticated_update_gallery_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images')
WITH CHECK (bucket_id = 'gallery-images');

-- Authenticated users can delete gallery images
CREATE POLICY "authenticated_delete_gallery_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');