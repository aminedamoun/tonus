-- Add menu_type and subcategory columns to menu_categories table
ALTER TABLE public.menu_categories
ADD COLUMN IF NOT EXISTS menu_type TEXT DEFAULT 'food',
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Create index for menu_type filtering
CREATE INDEX IF NOT EXISTS idx_menu_categories_menu_type ON public.menu_categories(menu_type);

-- Update existing categories to have proper menu_type
UPDATE public.menu_categories
SET menu_type = 'food', subcategory = name
WHERE menu_type IS NULL OR subcategory IS NULL;