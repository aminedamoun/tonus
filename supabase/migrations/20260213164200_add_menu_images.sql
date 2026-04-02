-- Add image_url column to menu_items table
ALTER TABLE public.menu_items
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for menu item images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
DROP POLICY IF EXISTS "Public read access for menu images" ON storage.objects;
CREATE POLICY "Public read access for menu images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'menu-images');

-- Create storage policy for authenticated users to upload
DROP POLICY IF EXISTS "Authenticated users can upload menu images" ON storage.objects;
CREATE POLICY "Authenticated users can upload menu images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'menu-images');

-- Create storage policy for authenticated users to update
DROP POLICY IF EXISTS "Authenticated users can update menu images" ON storage.objects;
CREATE POLICY "Authenticated users can update menu images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'menu-images')
WITH CHECK (bucket_id = 'menu-images');

-- Create storage policy for authenticated users to delete
DROP POLICY IF EXISTS "Authenticated users can delete menu images" ON storage.objects;
CREATE POLICY "Authenticated users can delete menu images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'menu-images');

-- Add sample placeholder images to existing menu items
DO $$
DECLARE
    food_items TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        'https://images.unsplash.com/photo-1529042410759-befb1204b468',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
        'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
        'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327'
    ];
    bar_items TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
        'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
        'https://images.unsplash.com/photo-1544145945-f90425340c7e',
        'https://images.unsplash.com/photo-1587080266227-677cc2a4e76e'
    ];
    shisha_items TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1528821128474-27f963b062bf',
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca',
        'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf'
    ];
    item_record RECORD;
    image_index INTEGER := 1;
BEGIN
    -- Update food menu items with sample images
    FOR item_record IN 
        SELECT mi.id, mc.menu_type
        FROM public.menu_items mi
        JOIN public.menu_categories mc ON mi.category_id = mc.id
        WHERE mc.menu_type = 'food'
        ORDER BY mi.display_order
    LOOP
        UPDATE public.menu_items
        SET image_url = food_items[(image_index % array_length(food_items, 1)) + 1] || '?w=400&h=300&fit=crop'
        WHERE id = item_record.id;
        image_index := image_index + 1;
    END LOOP;

    -- Update bar menu items with sample images
    image_index := 1;
    FOR item_record IN 
        SELECT mi.id, mc.menu_type
        FROM public.menu_items mi
        JOIN public.menu_categories mc ON mi.category_id = mc.id
        WHERE mc.menu_type = 'bar'
        ORDER BY mi.display_order
    LOOP
        UPDATE public.menu_items
        SET image_url = bar_items[(image_index % array_length(bar_items, 1)) + 1] || '?w=400&h=300&fit=crop'
        WHERE id = item_record.id;
        image_index := image_index + 1;
    END LOOP;

    -- Update shisha menu items with sample images
    image_index := 1;
    FOR item_record IN 
        SELECT mi.id, mc.menu_type
        FROM public.menu_items mi
        JOIN public.menu_categories mc ON mi.category_id = mc.id
        WHERE mc.menu_type = 'shisha'
        ORDER BY mi.display_order
    LOOP
        UPDATE public.menu_items
        SET image_url = shisha_items[(image_index % array_length(shisha_items, 1)) + 1] || '?w=400&h=300&fit=crop'
        WHERE id = item_record.id;
        image_index := image_index + 1;
    END LOOP;

    RAISE NOTICE 'Sample images added to menu items successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding sample images: %', SQLERRM;
END $$;