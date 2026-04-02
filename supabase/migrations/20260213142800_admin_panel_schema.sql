-- Menu Categories Table
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  price TEXT NOT NULL,
  description TEXT,
  available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Restaurant Images Table
CREATE TABLE IF NOT EXISTS public.restaurant_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  alt TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_display_order ON public.menu_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON public.menu_items(display_order);
CREATE INDEX IF NOT EXISTS idx_restaurant_images_display_order ON public.restaurant_images(display_order);

-- Enable RLS
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public read, no auth required for restaurant menu)
DROP POLICY IF EXISTS "public_read_menu_categories" ON public.menu_categories;
CREATE POLICY "public_read_menu_categories"
ON public.menu_categories
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "public_manage_menu_categories" ON public.menu_categories;
CREATE POLICY "public_manage_menu_categories"
ON public.menu_categories
FOR ALL
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_menu_items" ON public.menu_items;
CREATE POLICY "public_read_menu_items"
ON public.menu_items
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "public_manage_menu_items" ON public.menu_items;
CREATE POLICY "public_manage_menu_items"
ON public.menu_items
FOR ALL
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_restaurant_images" ON public.restaurant_images;
CREATE POLICY "public_read_restaurant_images"
ON public.restaurant_images
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "public_manage_restaurant_images" ON public.restaurant_images;
CREATE POLICY "public_manage_restaurant_images"
ON public.restaurant_images
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Mock Data
DO $$
DECLARE
  cat_starters UUID := gen_random_uuid();
  cat_salads UUID := gen_random_uuid();
  cat_mains UUID := gen_random_uuid();
  cat_grill UUID := gen_random_uuid();
  cat_seafood UUID := gen_random_uuid();
  cat_desserts UUID := gen_random_uuid();
  cat_beverages UUID := gen_random_uuid();
BEGIN
  -- Insert Categories
  INSERT INTO public.menu_categories (id, name, display_order) VALUES
    (cat_starters, 'Starters', 1),
    (cat_salads, 'Salads', 2),
    (cat_mains, 'Mains', 3),
    (cat_grill, 'Grill', 4),
    (cat_seafood, 'Seafood', 5),
    (cat_desserts, 'Desserts', 6),
    (cat_beverages, 'Beverages', 7)
  ON CONFLICT (id) DO NOTHING;

  -- Insert Menu Items
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_starters, 'Hummus', 'AED 25', 'Classic chickpea dip with tahini and olive oil', true, 1),
    (cat_starters, 'Tzatziki', 'AED 20', 'Greek yogurt with cucumber and garlic', true, 2),
    (cat_starters, 'Dolmades', 'AED 30', 'Stuffed grape leaves with rice and herbs', true, 3),
    (cat_salads, 'Greek Salad', 'AED 45', 'Fresh tomatoes, cucumber, feta, olives, and oregano', true, 1),
    (cat_salads, 'Mediterranean Salad', 'AED 40', 'Mixed greens with pomegranate and walnuts', true, 2),
    (cat_mains, 'Moussaka', 'AED 80', 'Layered eggplant with minced meat and bechamel', true, 1),
    (cat_mains, 'Pastitsio', 'AED 75', 'Greek pasta bake with meat sauce', true, 2),
    (cat_grill, 'Chicken Souvlaki', 'AED 65', 'Grilled chicken skewers with herbs', true, 1),
    (cat_grill, 'Lamb Chops', 'AED 95', 'Grilled lamb chops with rosemary', true, 2),
    (cat_seafood, 'Grilled Octopus', 'AED 85', 'Tender octopus with lemon and olive oil', true, 1),
    (cat_seafood, 'Sea Bass', 'AED 90', 'Whole grilled sea bass with herbs', true, 2),
    (cat_desserts, 'Baklava', 'AED 35', 'Layers of phyllo with nuts and honey', true, 1),
    (cat_desserts, 'Galaktoboureko', 'AED 30', 'Custard pie with crispy phyllo', true, 2),
    (cat_beverages, 'Greek Coffee', 'AED 15', 'Traditional strong coffee', true, 1),
    (cat_beverages, 'Fresh Lemonade', 'AED 18', 'Homemade lemonade with mint', true, 2)
  ON CONFLICT (id) DO NOTHING;

  -- Insert Restaurant Images
  INSERT INTO public.restaurant_images (url, title, alt, is_active, display_order) VALUES
    ('https://img.rocket.new/generatedImages/rocket_gen_img_10f164a68-1764870013277.png', 'Restaurant Interior', 'Modern Greek restaurant interior with Mediterranean decor', true, 1),
    ('https://images.unsplash.com/photo-1588008099417-78d7676e4d9f', 'Greek Mezze', 'Assorted Greek mezze dishes with fresh vegetables', true, 2),
    ('https://img.rocket.new/generatedImages/rocket_gen_img_172c6f116-1767913524738.png', 'Dining Experience', 'Guests enjoying dinner at elegantly set table', true, 3)
  ON CONFLICT (id) DO NOTHING;
END $$;
