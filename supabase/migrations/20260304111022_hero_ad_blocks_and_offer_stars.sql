-- Create hero_ad_blocks table
CREATE TABLE IF NOT EXISTS public.hero_ad_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot INTEGER NOT NULL UNIQUE CHECK (slot IN (1, 2)),
    image_url TEXT,
    star_rating INTEGER DEFAULT 5 CHECK (star_rating >= 1 AND star_rating <= 5),
    alt_text TEXT DEFAULT 'Promotional offer',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.hero_ad_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_can_read_hero_ad_blocks" ON public.hero_ad_blocks;
CREATE POLICY "public_can_read_hero_ad_blocks"
ON public.hero_ad_blocks
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "admin_can_manage_hero_ad_blocks" ON public.hero_ad_blocks;
CREATE POLICY "admin_can_manage_hero_ad_blocks"
ON public.hero_ad_blocks
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Seed default slots
DO $$
BEGIN
    INSERT INTO public.hero_ad_blocks (slot, image_url, star_rating, alt_text)
    VALUES
        (1, NULL, 5, 'Special promotion 1'),
        (2, NULL, 5, 'Special promotion 2')
    ON CONFLICT (slot) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Seed failed: %', SQLERRM;
END $$;

-- Add star_rating column to offers if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'offers'
          AND column_name = 'star_rating'
    ) THEN
        ALTER TABLE public.offers ADD COLUMN star_rating INTEGER DEFAULT 5 CHECK (star_rating >= 1 AND star_rating <= 5);
    END IF;
END $$;
