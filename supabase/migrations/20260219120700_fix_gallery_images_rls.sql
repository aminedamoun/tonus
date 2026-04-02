-- Fix Gallery Images RLS Policies
-- Purpose: Allow authenticated users to insert and update gallery images

-- Drop existing policy
DROP POLICY IF EXISTS "authenticated_can_manage_gallery_images" ON public.gallery_images;

-- Create separate policies for better control
-- Public read access
DROP POLICY IF EXISTS "public_read_gallery_images" ON public.gallery_images;
CREATE POLICY "public_read_gallery_images"
ON public.gallery_images
FOR SELECT
TO public
USING (true);

-- Authenticated users can insert
DROP POLICY IF EXISTS "authenticated_insert_gallery_images" ON public.gallery_images;
CREATE POLICY "authenticated_insert_gallery_images"
ON public.gallery_images
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update
DROP POLICY IF EXISTS "authenticated_update_gallery_images" ON public.gallery_images;
CREATE POLICY "authenticated_update_gallery_images"
ON public.gallery_images
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete
DROP POLICY IF EXISTS "authenticated_delete_gallery_images" ON public.gallery_images;
CREATE POLICY "authenticated_delete_gallery_images"
ON public.gallery_images
FOR DELETE
TO authenticated
USING (true);