-- Migration: Create hero-videos storage bucket for video uploads
-- Timestamp: 20260325150000

-- Create the hero-videos storage bucket with video MIME types and 100MB limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-videos',
  'hero-videos',
  true,
  104857600,
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/mpeg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/mpeg'];

-- RLS policies for hero-videos bucket
DROP POLICY IF EXISTS "hero_videos_public_read" ON storage.objects;
CREATE POLICY "hero_videos_public_read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'hero-videos');

DROP POLICY IF EXISTS "hero_videos_anon_upload" ON storage.objects;
CREATE POLICY "hero_videos_anon_upload"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'hero-videos');

DROP POLICY IF EXISTS "hero_videos_anon_update" ON storage.objects;
CREATE POLICY "hero_videos_anon_update"
  ON storage.objects
  FOR UPDATE
  TO anon
  USING (bucket_id = 'hero-videos');

DROP POLICY IF EXISTS "hero_videos_anon_delete" ON storage.objects;
CREATE POLICY "hero_videos_anon_delete"
  ON storage.objects
  FOR DELETE
  TO anon
  USING (bucket_id = 'hero-videos');

DROP POLICY IF EXISTS "hero_videos_auth_upload" ON storage.objects;
CREATE POLICY "hero_videos_auth_upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'hero-videos');

DROP POLICY IF EXISTS "hero_videos_auth_update" ON storage.objects;
CREATE POLICY "hero_videos_auth_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'hero-videos');

DROP POLICY IF EXISTS "hero_videos_auth_delete" ON storage.objects;
CREATE POLICY "hero_videos_auth_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'hero-videos');
