-- Migration: Hero video URL setting + About Us gallery images table
-- Timestamp: 20260325143200

-- 1. Create site_settings table for hero video URL
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON public.site_settings;
CREATE POLICY "public_read_site_settings"
  ON public.site_settings
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "anon_write_site_settings" ON public.site_settings;
CREATE POLICY "anon_write_site_settings"
  ON public.site_settings
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_write_site_settings" ON public.site_settings;
CREATE POLICY "auth_write_site_settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default hero video URL
INSERT INTO public.site_settings (key, value)
VALUES ('hero_video_url', 'https://698ef95f42985dd050940011.imgix.net/banner_1.webm')
ON CONFLICT (key) DO NOTHING;

-- 2. Create about_gallery_images table
CREATE TABLE IF NOT EXISTS public.about_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.about_gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_about_gallery" ON public.about_gallery_images;
CREATE POLICY "public_read_about_gallery"
  ON public.about_gallery_images
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "anon_write_about_gallery" ON public.about_gallery_images;
CREATE POLICY "anon_write_about_gallery"
  ON public.about_gallery_images
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_write_about_gallery" ON public.about_gallery_images;
CREATE POLICY "auth_write_about_gallery"
  ON public.about_gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_about_gallery_display_order ON public.about_gallery_images(display_order);

-- Seed default about gallery images
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.about_gallery_images LIMIT 1) THEN
    INSERT INTO public.about_gallery_images (image_url, alt_text, display_order, is_active) VALUES
      ('https://img.rocket.new/generatedImages/rocket_gen_img_1e5bccedd-1772095430402.png', 'Chef preparing traditional Greek dishes in open kitchen with fresh ingredients', 1, true),
      ('https://img.rocket.new/generatedImages/rocket_gen_img_1d8180acc-1772053971388.png', 'Fresh Mediterranean vegetables and herbs arranged on rustic wooden table', 2, true),
      ('https://img.rocket.new/generatedImages/rocket_gen_img_14b9b7d24-1772095429710.png', 'Premium extra virgin olive oil being poured from traditional Greek bottle', 3, true),
      ('https://img.rocket.new/generatedImages/rocket_gen_img_10c07dfde-1766484045960.png', 'Hands preparing fresh phyllo dough for traditional Greek pastries', 4, true),
      ('https://img.rocket.new/generatedImages/rocket_gen_img_1e69a3ada-1772095431317.png', 'Meat and vegetables being grilled over open flame in traditional Greek style', 5, true),
      ('https://images.unsplash.com/photo-1571139318929-bb90d382dbd8', 'Fresh Mediterranean herbs and spices in ceramic bowls', 6, true);
  END IF;
END $$;
