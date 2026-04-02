-- Add menu_type column to menu_categories to support Food/Bar/Shisha menus
ALTER TABLE public.menu_categories
ADD COLUMN IF NOT EXISTS menu_type TEXT DEFAULT 'food',
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Create index for menu_type filtering
CREATE INDEX IF NOT EXISTS idx_menu_categories_menu_type ON public.menu_categories(menu_type);

-- Clear existing mock data to repopulate with new structure
DO $$
BEGIN
  DELETE FROM public.menu_items;
  DELETE FROM public.menu_categories;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END $$;

-- Populate with complete menu data
DO $$
DECLARE
  -- Food Menu Categories
  cat_most_liked UUID := gen_random_uuid();
  cat_breakfast UUID := gen_random_uuid();
  cat_soup UUID := gen_random_uuid();
  cat_salads UUID := gen_random_uuid();
  cat_sandwich UUID := gen_random_uuid();
  cat_burger UUID := gen_random_uuid();
  cat_appetizers UUID := gen_random_uuid();
  cat_grill_seafood UUID := gen_random_uuid();
  cat_meat_lovers UUID := gen_random_uuid();
  cat_pasta UUID := gen_random_uuid();
  cat_sides UUID := gen_random_uuid();
  cat_veggies UUID := gen_random_uuid();
  cat_desserts UUID := gen_random_uuid();
  
  -- Bar Menu Categories
  cat_coffee UUID := gen_random_uuid();
  cat_mocktails UUID := gen_random_uuid();
  cat_juices UUID := gen_random_uuid();
  cat_water UUID := gen_random_uuid();
  cat_soft_drinks UUID := gen_random_uuid();
  cat_beer UUID := gen_random_uuid();
  cat_wine UUID := gen_random_uuid();
  
  -- Shisha Menu Categories
  cat_arabic_shisha UUID := gen_random_uuid();
  cat_turkish_shisha UUID := gen_random_uuid();
  cat_russian_shisha UUID := gen_random_uuid();
  cat_signature_shisha UUID := gen_random_uuid();
  cat_shisha_extras UUID := gen_random_uuid();
BEGIN
  -- Insert Food Menu Categories
  INSERT INTO public.menu_categories (id, name, menu_type, subcategory, display_order) VALUES
    (cat_most_liked, 'Most Liked', 'food', 'Most Liked', 1),
    (cat_breakfast, 'Breakfast', 'food', 'Breakfast', 2),
    (cat_soup, 'Soup', 'food', 'Soup', 3),
    (cat_salads, 'Salads', 'food', 'Salads', 4),
    (cat_sandwich, 'Sandwich', 'food', 'Sandwich', 5),
    (cat_burger, 'Burger', 'food', 'Burger', 6),
    (cat_appetizers, 'Appetizers', 'food', 'Appetizers', 7),
    (cat_grill_seafood, 'Grill Sea Food', 'food', 'Grill Sea Food', 8),
    (cat_meat_lovers, 'Meat Lovers', 'food', 'Meat Lovers', 9),
    (cat_pasta, 'Pasta', 'food', 'Pasta', 10),
    (cat_sides, 'Sides', 'food', 'Sides', 11),
    (cat_veggies, 'Veggies', 'food', 'Veggies', 12),
    (cat_desserts, 'Desserts', 'food', 'Desserts', 13)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Bar Menu Categories
  INSERT INTO public.menu_categories (id, name, menu_type, subcategory, display_order) VALUES
    (cat_coffee, 'Coffee', 'bar', 'Coffee', 1),
    (cat_mocktails, 'Mocktails', 'bar', 'Mocktails', 2),
    (cat_juices, 'Juices', 'bar', 'Juices', 3),
    (cat_water, 'Water', 'bar', 'Water', 4),
    (cat_soft_drinks, 'Soft Drinks', 'bar', 'Soft Drinks', 5),
    (cat_beer, 'Beer', 'bar', 'Beer', 6),
    (cat_wine, 'Wine', 'bar', 'Wine', 7)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Shisha Menu Categories
  INSERT INTO public.menu_categories (id, name, menu_type, subcategory, display_order) VALUES
    (cat_arabic_shisha, 'Arabic Shisha', 'shisha', 'Arabic Shisha', 1),
    (cat_turkish_shisha, 'Turkish Shisha', 'shisha', 'Turkish Shisha', 2),
    (cat_russian_shisha, 'Russian Shisha', 'shisha', 'Russian Shisha', 3),
    (cat_signature_shisha, 'Signature Shisha', 'shisha', 'Signature Shisha', 4),
    (cat_shisha_extras, 'Extras', 'shisha', 'Extras', 5)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Most Liked
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_most_liked, 'Vineyard Fig & Couscous Salad', 'AED 85.00', 'Crisp mix leaves and baby gem tossed with spicy couscous and sun-sweet raisin dressing, topped with caramelized fig fillets and Gruyère flakes.', true, 1),
    (cat_most_liked, 'Classic Greek Salad', 'AED 85.00', 'Cherry tomatoes, feta, cucumber, grilled bell peppers, Kalamata olives, oregano and extra virgin olive oil.', true, 2)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Breakfast
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_breakfast, 'English Breakfast', 'AED 75.00', 'Eggs, sausages, baked beans, mushrooms, tomatoes, hashbrown, mustard sauce.', true, 1),
    (cat_breakfast, 'Turkey Brasy', 'AED 65.00', 'Turkey slices, sour cream, labneh, cherry tomato, spinach and pesto sauce.', true, 2),
    (cat_breakfast, 'Russian Brasy', 'AED 70.00', 'Crepe, smoked salmon, egg, avocado, sour cream and fresh herbs.', true, 3),
    (cat_breakfast, 'Shrimp Avo Toast', 'AED 65.00', 'Sourdough toast, shrimp, smashed avocado, herbs and tomato.', true, 4),
    (cat_breakfast, 'Tuna Avo Toast', 'AED 65.00', 'Sourdough toast, tuna, sesame seeds, dill flakes and sauce.', true, 5),
    (cat_breakfast, 'Greek Poached Egg', 'AED 60.00', 'Greek yogurt, grilled halloumi, egg, hollandaise and pesto sauce.', true, 6),
    (cat_breakfast, 'Royal Salmon Benedict', 'AED 65.00', 'Croissant, smoked salmon, egg, hollandaise sauce.', true, 7),
    (cat_breakfast, 'Egg Omelet', 'AED 55.00', 'Button mushrooms, spinach, cherry tomatoes, feta cheese.', true, 8),
    (cat_breakfast, 'Egg with Sujuk', 'AED 65.00', 'Eggs with sujuk and herbs.', true, 9),
    (cat_breakfast, 'Shakshouka', 'AED 55.00', 'Tomato and capsicum sauce with eggs, feta cheese.', true, 10),
    (cat_breakfast, 'Avocado Benedict', 'AED 60.00', 'Sourdough, smashed avocado, egg, hollandaise.', true, 11),
    (cat_breakfast, 'Croissant Benedict', 'AED 60.00', 'Croissant, portobello mushroom, egg, hollandaise.', true, 12),
    (cat_breakfast, 'Zaatar Croissant', 'AED 27.00', 'Traditional croissant with zaatar.', true, 13),
    (cat_breakfast, 'Butter Croissant', 'AED 15.00', 'Fresh butter croissant.', true, 14),
    (cat_breakfast, 'Cheese Croissant', 'AED 23.00', 'Croissant filled with cheese.', true, 15),
    (cat_breakfast, 'Pain Chocolate', 'AED 22.00', 'Croissant with chocolate filling.', true, 16),
    (cat_breakfast, 'Almond Croissant', 'AED 23.00', 'Croissant with almond cream.', true, 17),
    (cat_breakfast, 'Banana Granola Bowl', 'AED 55.00', 'Greek yogurt, granola, banana, berries and honey.', true, 18),
    (cat_breakfast, 'Simit', 'AED 35.00', 'Turkish bagel with cream cheese and berries.', true, 19),
    (cat_breakfast, 'Acai Bowl', 'AED 60.00', 'Acai base topped with granola, berries and banana.', true, 20),
    (cat_breakfast, 'Crepe', 'AED 45.00', 'Flour, butter, milk, chocolate sauce, berries.', true, 21),
    (cat_breakfast, 'French Toast', 'AED 52.00', 'Brioche bread, mixed berries and caramelized banana.', true, 22),
    (cat_breakfast, 'Crepe Salmon', 'AED 62.00', 'Crepe with smoked salmon and sour cream.', true, 23)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Soup
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_soup, 'Red Borscht Soup', 'AED 45.00', 'Beetroot, potato, carrot, cabbage with bread and sour cream.', true, 1),
    (cat_soup, 'Mushroom Soup', 'AED 45.00', 'Creamy mushroom soup served with croutons.', true, 2),
    (cat_soup, 'Lentil Soup', 'AED 45.00', 'Lentil soup with croutons and lemon.', true, 3),
    (cat_soup, 'Tomato Soup', 'AED 45.00', 'Tomato cream soup served with crispy croutons.', true, 4)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Salads
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_salads, 'Quinoa Salad', 'AED 75.00', 'Quinoa, mixed greens, cherry tomatoes, avocado and grilled chicken.', true, 1)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Sandwich
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_sandwich, 'Chicken Quesadilla', 'AED 65.00', 'Tortilla wrap with chicken, cheddar cheese and sauce.', true, 1),
    (cat_sandwich, 'Halloumi Sandwich', 'AED 55.00', 'Grilled halloumi, tomato, pesto sauce.', true, 2)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Burger
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_burger, 'Beef Burger', 'AED 75.00', 'Beef patty, cheddar cheese and sauce served with fries.', true, 1),
    (cat_burger, 'Chicken Burger', 'AED 65.00', 'Chicken patty, cheese and sauce served with fries.', true, 2)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Appetizers
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_appetizers, 'Chicken Tiganiá with Yogurt & Warm Sourdough', 'AED 89.25', 'Skillet-seared chicken thighs with Greek yogurt and grilled sourdough.', true, 1),
    (cat_appetizers, 'Homemade Tzatziki', 'AED 45.00', 'Greek yogurt with cucumber and garlic.', true, 2),
    (cat_appetizers, 'Marinated Olives', 'AED 45.00', 'Olives marinated with herbs and olive oil.', true, 3),
    (cat_appetizers, 'Mezze Platter', 'AED 73.50', 'Assorted Greek dips and bread.', true, 4),
    (cat_appetizers, 'Zucchini Herb Fritters', 'AED 47.25', 'Crispy zucchini fritters served with tzatziki.', true, 5)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Grill Sea Food
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_grill_seafood, 'Tuna Steak', 'AED 126.00', 'Bluefin tuna, rucola, grilled lemon, balsamic emulsion.', true, 1),
    (cat_grill_seafood, 'Salmon Fillet', 'AED 120.00', 'Grilled salmon with lemon and dill sauce.', true, 2),
    (cat_grill_seafood, 'Shrimp / Gambi', 'AED 104.00', 'Grilled shrimp with herbs.', true, 3),
    (cat_grill_seafood, 'Sea Bass', 'AED 99.75', 'Grilled sea bass with garden salad.', true, 4)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Meat Lovers
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_meat_lovers, 'Wagyu Ribeye Steak', 'AED 189.00', 'Premium Wagyu ribeye with crushed potatoes.', true, 1),
    (cat_meat_lovers, 'Lemon Chicken', 'AED 95.00', 'Grilled chicken with lemon and herbs.', true, 2),
    (cat_meat_lovers, 'Lamb Kebab', 'AED 120.00', 'Grilled lamb kebab served with sauce.', true, 3),
    (cat_meat_lovers, 'Chicken Gyros with Tzatziki & Fries', 'AED 84.00', 'Marinated chicken gyros with pita and fries.', true, 4),
    (cat_meat_lovers, 'Greek Chicken Souvlaki', 'AED 78.75', 'Grilled chicken skewers with oregano and lemon.', true, 5),
    (cat_meat_lovers, 'Keftedakia', 'AED 68.25', 'Greek meatballs with fries and feta spread.', true, 6),
    (cat_meat_lovers, 'Greek Moussaka', 'AED 73.50', 'Traditional layered eggplant and beef dish.', true, 7)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Pasta
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_pasta, 'Spaghetti Bolognese', 'AED 65.00', 'Spaghetti with minced beef tomato sauce.', true, 1),
    (cat_pasta, 'Orzo Pasta', 'AED 74.00', 'Greek-style orzo with peppers and tomato.', true, 2),
    (cat_pasta, 'Risotto Pasta', 'AED 78.75', 'Mushroom risotto with Greek touch.', true, 3),
    (cat_pasta, 'Linguini Pasta', 'AED 89.00', 'Prawns with tomato sauce.', true, 4),
    (cat_pasta, 'Salmon Pasta', 'AED 85.00', 'Salmon with cream and parmesan sauce.', true, 5),
    (cat_pasta, 'Seafood Penne Pasta', 'AED 88.00', 'Penne with shrimp and cherry tomato.', true, 6)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Sides
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_sides, 'Truffle Fries', 'AED 26.00', 'Truffle paste with parmesan.', true, 1),
    (cat_sides, 'Plain Fries', 'AED 26.00', 'French fries with garlic aioli.', true, 2)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Veggies
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_veggies, 'Crispy Greek Fried Eggplant', 'AED 52.50', 'Fried eggplant with Greek seasoning.', true, 1),
    (cat_veggies, 'Mixed Vegetables Souvlaki', 'AED 47.25', 'Grilled mixed vegetables with feta.', true, 2)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Food Menu Items - Desserts
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_desserts, 'Chocolate Fondue', 'AED 52.00', 'Chocolate served with ice cream and fruit.', true, 1),
    (cat_desserts, 'Honey Cake', 'AED 35.00', 'Traditional layered honey cake.', true, 2),
    (cat_desserts, 'Cheese Cake', 'AED 50.00', 'Creamy cheesecake topped with berries.', true, 3),
    (cat_desserts, 'Loukomades', 'AED 36.75', 'Greek fried dough balls drizzled with honey.', true, 4),
    (cat_desserts, 'Fruit Platter', 'AED 55.00', 'Seasonal fresh fruits selection.', true, 5)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Bar Menu Items - Coffee
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_coffee, 'Espresso', 'AED 25.00', 'Classic Italian espresso shot.', true, 1),
    (cat_coffee, 'Americano', 'AED 26.00', 'Espresso with hot water.', true, 2),
    (cat_coffee, 'Café Latte', 'AED 28.00', 'Espresso with steamed milk.', true, 3),
    (cat_coffee, 'Cappuccino', 'AED 28.00', 'Espresso with foamed milk.', true, 4),
    (cat_coffee, 'Spanish Latte', 'AED 35.00', 'Latte with condensed milk.', true, 5),
    (cat_coffee, 'Matcha Latte', 'AED 40.00', 'Green tea latte with steamed milk.', true, 6),
    (cat_coffee, 'Turkish/Greek Coffee', 'AED 25.00', 'Traditional strong coffee.', true, 7),
    (cat_coffee, 'Iced Latte', 'AED 32.00', 'Cold latte with ice.', true, 8),
    (cat_coffee, 'Iced Cappuccino', 'AED 32.00', 'Cold cappuccino with ice.', true, 9),
    (cat_coffee, 'Iced Chocolate', 'AED 35.00', 'Cold chocolate drink with ice.', true, 10)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Bar Menu Items - Mocktails
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_mocktails, 'Passion Fruit', 'AED 45.00', 'Refreshing passion fruit mocktail.', true, 1),
    (cat_mocktails, 'Strawberry Mojito', 'AED 35.00', 'Fresh strawberry mojito with mint.', true, 2),
    (cat_mocktails, 'Blue Lagoon', 'AED 45.00', 'Tropical blue mocktail.', true, 3)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Bar Menu Items - Juices
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_juices, 'Orange Juice', 'AED 38.00', 'Freshly squeezed orange juice.', true, 1),
    (cat_juices, 'Lemon & Mint', 'AED 38.00', 'Fresh lemon juice with mint.', true, 2)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Bar Menu Items - Water
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_water, 'Still Water (Small)', 'AED 17.00', 'Still mineral water 330ml.', true, 1),
    (cat_water, 'Still Water (Large)', 'AED 27.00', 'Still mineral water 750ml.', true, 2),
    (cat_water, 'Sparkling Water (Small)', 'AED 20.00', 'Sparkling mineral water 330ml.', true, 3),
    (cat_water, 'Sparkling Water (Large)', 'AED 30.00', 'Sparkling mineral water 750ml.', true, 4)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Bar Menu Items - Soft Drinks
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_soft_drinks, 'Coca Cola', 'AED 18.00', 'Classic Coca Cola.', true, 1),
    (cat_soft_drinks, 'Red Bull', 'AED 35.00', 'Energy drink.', true, 2)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Bar Menu Items - Beer
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_beer, 'Corona Cero', 'AED 50.00', 'Non-alcoholic Corona beer.', true, 1),
    (cat_beer, 'Peroni Nastro Azzurro', 'AED 50.00', 'Italian premium lager.', true, 2)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Bar Menu Items - Wine
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_wine, 'Vistaneo Organic Terra', 'AED 200.00', 'Organic red wine bottle.', true, 1),
    (cat_wine, 'Vistaneo Capeja Syrah', 'AED 250.00', 'Premium Syrah wine bottle.', true, 2)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Shisha Menu Items - Arabic Shisha
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_arabic_shisha, 'Lemon Mint', 'AED 55.00', 'Classic lemon mint flavor.', true, 1),
    (cat_arabic_shisha, 'Gum', 'AED 55.00', 'Sweet gum flavor.', true, 2),
    (cat_arabic_shisha, 'Blueberry', 'AED 55.00', 'Fresh blueberry flavor.', true, 3),
    (cat_arabic_shisha, 'Grape', 'AED 55.00', 'Sweet grape flavor.', true, 4),
    (cat_arabic_shisha, 'Mint', 'AED 55.00', 'Pure mint flavor.', true, 5),
    (cat_arabic_shisha, 'Orange', 'AED 55.00', 'Citrus orange flavor.', true, 6),
    (cat_arabic_shisha, 'Gum Cinnamon', 'AED 55.00', 'Gum with cinnamon spice.', true, 7),
    (cat_arabic_shisha, 'Two Apples', 'AED 55.00', 'Classic double apple flavor.', true, 8),
    (cat_arabic_shisha, 'Two Apples (Nakhla)', 'AED 55.00', 'Premium Nakhla double apple.', true, 9)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Shisha Menu Items - Turkish Shisha
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_turkish_shisha, 'Istanbul Night', 'AED 75.00', 'Exotic Istanbul blend.', true, 1),
    (cat_turkish_shisha, 'Lady Killer', 'AED 75.00', 'Smooth Turkish blend.', true, 2),
    (cat_turkish_shisha, 'Marbella', 'AED 75.00', 'Mediterranean inspired flavor.', true, 3),
    (cat_turkish_shisha, 'Love 66', 'AED 75.00', 'Premium Turkish mix.', true, 4)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Shisha Menu Items - Russian Shisha
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_russian_shisha, 'Green Jelly', 'AED 95.00', 'Sweet green jelly flavor.', true, 1),
    (cat_russian_shisha, 'Peach Iced Tea', 'AED 95.00', 'Refreshing peach tea blend.', true, 2),
    (cat_russian_shisha, 'Strawberry Lemonade with Basil', 'AED 95.00', 'Fresh strawberry lemonade with basil.', true, 3),
    (cat_russian_shisha, 'Fruit and Citrus Lemonade', 'AED 95.00', 'Mixed fruit citrus blend.', true, 4),
    (cat_russian_shisha, 'Green Smoothie', 'AED 95.00', 'Healthy green smoothie flavor.', true, 5),
    (cat_russian_shisha, 'Blueberry Cake', 'AED 95.00', 'Sweet blueberry cake flavor.', true, 6),
    (cat_russian_shisha, 'MasterMix', 'AED 95.00', 'Premium Russian master blend.', true, 7)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Shisha Menu Items - Signature Shisha
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_signature_shisha, 'Colosseum', 'AED 200.00', 'Exclusive signature blend.', true, 1)
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert Shisha Menu Items - Extras
  INSERT INTO public.menu_items (category_id, name, price, description, available, display_order) VALUES
    (cat_shisha_extras, 'Shisha "Arima Smart"', 'AED 65.00', 'Premium Arima Smart shisha device.', true, 1),
    (cat_shisha_extras, 'Shisha "Maxx Royal Emerald Gold"', 'AED 45.00', 'Luxury Maxx Royal shisha device.', true, 2),
    (cat_shisha_extras, 'Change Bowl - Arabic', 'AED 30.00', 'Replace bowl for Arabic shisha.', true, 3),
    (cat_shisha_extras, 'Change Bowl - Turkish', 'AED 40.00', 'Replace bowl for Turkish shisha.', true, 4),
    (cat_shisha_extras, 'Change Bowl - Russian', 'AED 50.00', 'Replace bowl for Russian shisha.', true, 5)
  ON CONFLICT (id) DO NOTHING;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Menu data insertion failed: %', SQLERRM;
END $$;