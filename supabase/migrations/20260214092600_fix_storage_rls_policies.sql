-- Fix RLS policies for menu-images storage bucket to allow public access for uploads
-- This is needed because the admin panel doesn't use authentication

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload menu images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update menu images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete menu images" ON storage.objects;

-- Create new policies that allow public access for INSERT/UPDATE/DELETE
-- Public users can upload menu images
CREATE POLICY "Public users can upload menu images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'menu-images');

-- Public users can update menu images
CREATE POLICY "Public users can update menu images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'menu-images')
WITH CHECK (bucket_id = 'menu-images');

-- Public users can delete menu images
CREATE POLICY "Public users can delete menu images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'menu-images');
