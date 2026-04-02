'use client';
import { useState } from 'react';
import MenuItemCard from './MenuItemCard';
import allMenuItemsStatic from '@/data/menu-items.json';
import allCategoriesStatic from '@/data/menu-categories.json';
import { useLiveData } from '@/lib/useLiveData';
import Icon from '@/components/ui/AppIcon';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  subcategory: string;
  available: boolean;
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
  menu_type: string;
  subcategory: string;
  display_order: number;
}

type MenuType = 'food' | 'bar' | 'shisha';

// Ordered category lists for each menu type
const FOOD_CATEGORY_ORDER = [
  'Most Liked',
  'Breakfast',
  'Soup',
  'Salads',
  'Sandwich',
  'Burger',
  'Appetizers',
  'Grill Sea Food',
  'Meat Lovers',
  'Pasta',
  'Sides',
  'Veggies',
  'Desserts',
];

const BAR_CATEGORY_ORDER = [
  'Coffee (Hot)',
  'Coffee (Iced)',
  'Speciality Organic Tea',
  'Mocktails',
  "Tono's Signature",
  'Freshly Squeezed Juices',
  'Water',
  'Soft Drinks',
  'Beer',
  'Wine',
];

const SHISHA_CATEGORY_ORDER = [
  'Most Liked',
  'Arabic Shisha',
  'Turkish Shisha',
  'Russian Shisha',
  'Signature Shisha',
  'Extras',
];

function getCategoryOrder(menuType: MenuType): string[] {
  switch (menuType) {
    case 'food':
      return FOOD_CATEGORY_ORDER;
    case 'bar':
      return BAR_CATEGORY_ORDER;
    case 'shisha':
      return SHISHA_CATEGORY_ORDER;
    default:
      return [];
  }
}

function sortCategories(categories: string[], menuType: MenuType): string[] {
  const order = getCategoryOrder(menuType);
  const sorted = [...categories].sort((a, b) => {
    const idxA = order.findIndex((o) => o.toLowerCase() === a.toLowerCase());
    const idxB = order.findIndex((o) => o.toLowerCase() === b.toLowerCase());
    const posA = idxA === -1 ? 9999 : idxA;
    const posB = idxB === -1 ? 9999 : idxB;
    return posA - posB;
  });
  return sorted;
}

export default function MenuInteractive() {
  const allMenuItems = useLiveData('menu-items.json', allMenuItemsStatic);
  const allCategories = useLiveData('menu-categories.json', allCategoriesStatic);

  const [menuType, setMenuType] = useState<MenuType>('food');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter directly from imported JSON — no hooks needed for static data
  const categories = (allCategories as Category[])
    .filter((cat) => cat.menu_type === menuType)
    .sort((a, b) => a.display_order - b.display_order);

  const menuItems: MenuItem[] = allMenuItems
    .filter((item) => item.menu_categories.menu_type === menuType)
    .sort((a, b) => a.display_order - b.display_order)
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.menu_categories.name,
      subcategory: item.menu_categories.subcategory,
      available: item.available,
      imageUrl: item.image_url,
    }));

  const uniqueSubcategories = [
    'All',
    ...sortCategories([...new Set(categories.map((cat) => cat.name))], menuType),
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSubcategory =
      activeSubcategory === 'All' || item.subcategory === activeSubcategory;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubcategory && matchesSearch;
  });

  // Group filtered items by category, sorted in the defined order
  const groupedItems = (() => {
    const groups: { category: string; items: MenuItem[] }[] = [];
    const categoryMap = new Map<string, MenuItem[]>();

    filteredItems.forEach((item) => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, []);
      }
      categoryMap.get(item.category)!.push(item);
    });

    const sortedCategoryNames = sortCategories(Array.from(categoryMap.keys()), menuType);
    sortedCategoryNames.forEach((cat) => {
      const items = categoryMap.get(cat);
      if (items && items.length > 0) {
        groups.push({ category: cat, items });
      }
    });

    return groups;
  })();

  const getMenuIcon = (type: MenuType) => {
    switch (type) {
      case 'food':
        return 'SparklesIcon';
      case 'bar':
        return 'BeakerIcon';
      case 'shisha':
        return 'FireIcon';
      default:
        return 'SparklesIcon';
    }
  };

  const getMenuTitle = (type: MenuType) => {
    switch (type) {
      case 'food':
        return 'Food Menu';
      case 'bar':
        return 'Bar Menu';
      case 'shisha':
        return 'Shisha Menu';
      default:
        return 'Menu';
    }
  };

  return (
    <div className="space-y-12">
      {/* Menu Type Tabs */}
      <div className="flex justify-center px-4">
        <div className="inline-flex bg-secondary/50 rounded-full p-1.5 sm:p-2 gap-1 sm:gap-1.5 border border-primary/20 shadow-md w-full sm:w-auto max-w-full">
          {(['food', 'bar', 'shisha'] as MenuType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setMenuType(type);
                setActiveSubcategory('All');
              }}
              className={`flex-1 sm:flex-none px-3 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2.5 min-w-0 ${
                menuType === type
                  ? 'bg-primary text-white shadow-blue-glow-lg scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-hover-light-blue'
              }`}
            >
              <Icon name={getMenuIcon(type)} size={18} className="shrink-0" />
              <span className="hidden sm:inline">{getMenuTitle(type)}</span>
              <span className="sm:hidden truncate">
                {type === 'food' ? 'Dishes' : type === 'bar' ? 'Drinks' : 'Shisha'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-primary/20 focus:border-primary outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Animated content wrapper */}
      <div key={menuType} className="animate-menu-fade space-y-12">
        {/* Subcategory Filter */}
        {uniqueSubcategories.length > 1 && (
          <div className="flex flex-wrap justify-start md:justify-center gap-2">
            {uniqueSubcategories.map((subcategory) => (
              <button
                key={subcategory}
                onClick={() => setActiveSubcategory(subcategory)}
                className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeSubcategory === subcategory
                    ? 'bg-primary text-white shadow-blue-glow'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2 border-primary/20'
                }`}
              >
                {subcategory}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items Grouped by Category */}
        {groupedItems.length > 0 ? (
          <div className="space-y-16">
            {groupedItems.map(({ category, items }) => (
              <div key={category}>
                {/* Category Heading */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-primary/20" />
                  <h2 className="text-2xl md:text-3xl font-serif italic text-foreground whitespace-nowrap px-2">
                    {category}
                  </h2>
                  <div className="h-px flex-1 bg-primary/20" />
                </div>
                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <MenuItemCard {...item} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Icon
              name="InformationCircleIcon"
              size={48}
              className="mx-auto text-muted-foreground mb-4"
            />
            <p className="text-xl text-muted-foreground">
              {searchQuery
                ? `No items found matching "${searchQuery}"`
                : 'No items found in this category.'}
            </p>
          </div>
        )}

        {/* Footer with helpful info */}
        <div className="text-center py-8 border-t border-primary/20">
          <p className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {menuItems.length} items
          </p>
        </div>
      </div>
    </div>
  );
}
