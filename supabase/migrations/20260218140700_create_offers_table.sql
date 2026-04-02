-- Create offers table for special promotions
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price TEXT NOT NULL,
    image_url TEXT,
    valid_until DATE,
    available BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_offers_display_order ON public.offers(display_order);

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read, no auth required for viewing offers
DROP POLICY IF EXISTS "public_can_read_offers" ON public.offers;
CREATE POLICY "public_can_read_offers" 
ON public.offers
FOR SELECT 
TO public 
USING (true);

-- Admin can manage offers (for future auth integration)
DROP POLICY IF EXISTS "admin_can_manage_offers" ON public.offers;
CREATE POLICY "admin_can_manage_offers" 
ON public.offers
FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

-- Mock data for offers
DO $$
BEGIN
    INSERT INTO public.offers (id, title, description, price, valid_until, display_order, available)
    VALUES 
        (gen_random_uuid(), 'Weekend Special', 'Get 20% off on all Mediterranean platters this weekend. Perfect for family gatherings.', '€45', CURRENT_DATE + INTERVAL '7 days', 1, true),
        (gen_random_uuid(), 'Happy Hour Drinks', 'Buy 2 cocktails and get the third one free. Valid from 5 PM to 7 PM daily.', '€15', CURRENT_DATE + INTERVAL '30 days', 2, true),
        (gen_random_uuid(), 'Shisha Night Deal', 'Premium shisha flavors at special prices. Includes complimentary mint tea.', '€25', CURRENT_DATE + INTERVAL '14 days', 3, true)
    ON CONFLICT (id) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;