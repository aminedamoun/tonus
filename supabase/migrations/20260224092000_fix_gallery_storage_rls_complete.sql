-- Safe RLS policy creation for gallery-images bucket
-- Uses exception handling to ignore "already exists" errors
-- Does NOT query pg_policies (avoids permission issues)
-- Uses auth.role() for Supabase compatibility

-- Ensure RLS is enabled (safe operation)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: Allow anyone to view gallery images
DO $$
BEGIN
  CREATE POLICY "gallery_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery-images');
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

-- INSERT: Authenticated users can upload images
DO $$
BEGIN
  CREATE POLICY "gallery_auth_insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery-images'
    AND auth.role() = 'authenticated'
  );
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

-- UPDATE: Authenticated users can update images
DO $$
BEGIN
  CREATE POLICY "gallery_auth_update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'gallery-images'
    AND auth.role() = 'authenticated'
  );
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;

-- DELETE: Authenticated users can delete images
DO $$
BEGIN
  CREATE POLICY "gallery_auth_delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'gallery-images'
    AND auth.role() = 'authenticated'
  );
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Policy already exists, ignore
END $$;