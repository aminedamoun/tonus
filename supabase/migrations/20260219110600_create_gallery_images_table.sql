-- Gallery Images Table Migration
-- Purpose: Store ambiance gallery images for homepage with admin management

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON public.gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_active ON public.gallery_images(is_active);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read, no auth required for viewing
DROP POLICY IF EXISTS "public_can_read_gallery_images" ON public.gallery_images;
CREATE POLICY "public_can_read_gallery_images"
ON public.gallery_images
FOR SELECT
TO public
USING (true);

-- RLS Policies: Authenticated users can manage (for admin panel)
DROP POLICY IF EXISTS "authenticated_can_manage_gallery_images" ON public.gallery_images;
CREATE POLICY "authenticated_can_manage_gallery_images"
ON public.gallery_images
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert mock gallery images
DO $$
BEGIN
  INSERT INTO public.gallery_images (id, image_url, alt_text, display_order, is_active)
  VALUES
    (gen_random_uuid(), 'https://images.unsplash.com/photo-1645627205631-c4e0308d1724', 'Modern Greek restaurant interior with white walls, blue accents, and Mediterranean decor', 1, true),
    (gen_random_uuid(), 'https://images.unsplash.com/photo-1719787771056-ea8fda1423b5', 'Beautifully plated Greek mezze dishes with fresh vegetables and dips', 2, true),
    (gen_random_uuid(), 'https://img.rocket.new/generatedImages/rocket_gen_img_11a884365-1764715924285.png', 'Guests enjoying dinner at elegantly set table with Mediterranean ambiance', 3, true),
    (gen_random_uuid(), 'https://img.rocket.new/generatedImages/rocket_gen_img_1e667c6f6-1764717593748.png', 'Chef preparing traditional Greek dishes in open kitchen with fresh ingredients', 4, true),
    (gen_random_uuid(), 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'Cozy restaurant seating area with warm lighting and traditional Greek decorations', 5, true),
    (gen_random_uuid(), 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5', 'Outdoor terrace dining with Mediterranean sunset views', 6, true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;