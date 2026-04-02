-- Allow anonymous users to manage gallery images (no auth required for admin panel)
-- This fixes the upload error caused by RLS blocking anon role

-- ============================================================
-- STORAGE: gallery-images bucket policies
-- ============================================================

-- Drop existing write policies that require authenticated role
DROP POLICY IF EXISTS "gallery_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "gallery_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "gallery_auth_delete" ON storage.objects;
DROP POLICY IF EXISTS "gallery_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "gallery_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "gallery_authenticated_delete" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_insert_gallery" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_gallery" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete_gallery" ON storage.objects;

-- Allow anyone (including anon) to upload to gallery-images bucket
DROP POLICY IF EXISTS "gallery_anon_insert" ON storage.objects;
CREATE POLICY "gallery_anon_insert"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'gallery-images');

-- Allow anyone (including anon) to update files in gallery-images bucket
DROP POLICY IF EXISTS "gallery_anon_update" ON storage.objects;
CREATE POLICY "gallery_anon_update"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'gallery-images')
WITH CHECK (bucket_id = 'gallery-images');

-- Allow anyone (including anon) to delete files from gallery-images bucket
DROP POLICY IF EXISTS "gallery_anon_delete" ON storage.objects;
CREATE POLICY "gallery_anon_delete"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'gallery-images');

-- ============================================================
-- DATABASE: gallery_images table policies
-- ============================================================

-- Drop existing write policies that require authenticated role
DROP POLICY IF EXISTS "authenticated_insert_gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "authenticated_update_gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "authenticated_delete_gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_auth_insert_db" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_auth_update_db" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_auth_delete_db" ON public.gallery_images;

-- Allow anyone (including anon) to insert gallery images
DROP POLICY IF EXISTS "gallery_anon_insert_db" ON public.gallery_images;
CREATE POLICY "gallery_anon_insert_db"
ON public.gallery_images
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone (including anon) to update gallery images
DROP POLICY IF EXISTS "gallery_anon_update_db" ON public.gallery_images;
CREATE POLICY "gallery_anon_update_db"
ON public.gallery_images
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow anyone (including anon) to delete gallery images
DROP POLICY IF EXISTS "gallery_anon_delete_db" ON public.gallery_images;
CREATE POLICY "gallery_anon_delete_db"
ON public.gallery_images
FOR DELETE
TO public
USING (true);
