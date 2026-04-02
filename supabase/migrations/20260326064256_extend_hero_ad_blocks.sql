-- Extend hero_ad_blocks: allow 3 slots and add content fields

-- Drop old slot check constraint and add new one allowing 1-3
ALTER TABLE public.hero_ad_blocks DROP CONSTRAINT IF EXISTS hero_ad_blocks_slot_check;
ALTER TABLE public.hero_ad_blocks ADD CONSTRAINT hero_ad_blocks_slot_check CHECK (slot IN (1, 2, 3));

-- Add new content columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'hero_ad_blocks' AND column_name = 'title'
    ) THEN
        ALTER TABLE public.hero_ad_blocks ADD COLUMN title TEXT DEFAULT '';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'hero_ad_blocks' AND column_name = 'description'
    ) THEN
        ALTER TABLE public.hero_ad_blocks ADD COLUMN description TEXT DEFAULT '';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'hero_ad_blocks' AND column_name = 'emoji'
    ) THEN
        ALTER TABLE public.hero_ad_blocks ADD COLUMN emoji TEXT DEFAULT '⭐';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'hero_ad_blocks' AND column_name = 'whatsapp_message'
    ) THEN
        ALTER TABLE public.hero_ad_blocks ADD COLUMN whatsapp_message TEXT DEFAULT 'Hi, I want to know more about this offer.';
    END IF;
END $$;

-- Seed default data for existing slots and add slot 3
DO $$
BEGIN
    -- Update slot 1 with default content
    UPDATE public.hero_ad_blocks
    SET
        title = COALESCE(NULLIF(title, ''), 'Wednesday Special Night'),
        description = COALESCE(NULLIF(description, ''), 'Every Wednesday special night for girls'),
        emoji = COALESCE(NULLIF(emoji, ''), '🌙'),
        whatsapp_message = COALESCE(NULLIF(whatsapp_message, ''), 'Hi, I want to know more about the Wednesday Special Night.')
    WHERE slot = 1;

    -- Update slot 2 with default content
    UPDATE public.hero_ad_blocks
    SET
        title = COALESCE(NULLIF(title, ''), 'Ladies Day Sunday'),
        description = COALESCE(NULLIF(description, ''), 'Special offers and vibes for ladies every Sunday'),
        emoji = COALESCE(NULLIF(emoji, ''), '👑'),
        whatsapp_message = COALESCE(NULLIF(whatsapp_message, ''), 'Hi, I want to know more about Ladies Day Sunday.')
    WHERE slot = 2;

    -- Insert slot 3 if not exists
    INSERT INTO public.hero_ad_blocks (slot, image_url, star_rating, alt_text, title, description, emoji, whatsapp_message)
    VALUES (3, NULL, 5, 'Free Sheesha Offer', 'Free Sheesha Offer', 'Get free sheesha after spending 100 AED', '💨', 'Hi, I want to claim the free sheesha offer.')
    ON CONFLICT (slot) DO UPDATE SET
        title = COALESCE(NULLIF(hero_ad_blocks.title, ''), EXCLUDED.title),
        description = COALESCE(NULLIF(hero_ad_blocks.description, ''), EXCLUDED.description),
        emoji = COALESCE(NULLIF(hero_ad_blocks.emoji, ''), EXCLUDED.emoji),
        whatsapp_message = COALESCE(NULLIF(hero_ad_blocks.whatsapp_message, ''), EXCLUDED.whatsapp_message);

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Seed failed: %', SQLERRM;
END $$;
