'use client';

import { useState, useEffect, useMemo } from 'react';
import menuItemsData from '@/data/menu-items.json';
import menuCategoriesData from '@/data/menu-categories.json';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MenuCategoryEmbed {
  name: string;
  menu_type: string;
  subcategory: string;
}

interface MenuItem {
  id: string;
  name: string;
  category_id: string;
  price: string;
  description: string;
  available: boolean;
  display_order: number;
  image_url: string;
  menu_categories: MenuCategoryEmbed;
}

interface Category {
  id: string;
  name: string;
  menu_type: string;
  subcategory: string;
  display_order: number;
}

type SubTab = 'items' | 'categories';
type MenuFilter = 'all' | 'food' | 'bar' | 'shisha';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const MENU_TYPE_BADGE: Record<string, string> = {
  food: 'bg-blue-100 text-blue-700',
  bar: 'bg-teal-100 text-teal-700',
  shisha: 'bg-orange-100 text-orange-700',
};

const MENU_TYPE_LABEL: Record<string, string> = {
  food: 'FOOD',
  bar: 'BAR',
  shisha: 'SHISHA',
};

const MENU_TYPE_SECTION_ICON: Record<string, string> = {
  food: '🍽️',
  bar: '🍹',
  shisha: '💨',
};

function blankItem(category: Category): MenuItem {
  return {
    id: crypto.randomUUID(),
    name: '',
    category_id: category.id,
    price: 'AED 0.00',
    description: '',
    available: true,
    display_order: 0,
    image_url: '',
    menu_categories: {
      name: category.name,
      menu_type: category.menu_type,
      subcategory: category.subcategory,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MenuAdmin({ password }: { password: string }) {
  /* --- state --- */
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [subTab, setSubTab] = useState<SubTab>('items');
  const [menuFilter, setMenuFilter] = useState<MenuFilter>('all');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // items tab
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());

  // categories tab
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [addingCat, setAddingCat] = useState(false);
  const [newCatMenuType, setNewCatMenuType] = useState<string>('food');
  const [newCatName, setNewCatName] = useState('');
  const [newCatSubcategory, setNewCatSubcategory] = useState('');

  useEffect(() => {
    setItems(JSON.parse(JSON.stringify(menuItemsData)) as MenuItem[]);
    setCats(JSON.parse(JSON.stringify(menuCategoriesData)) as Category[]);
  }, []);

  const toggleCollapse = (catId: string) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  /* --- derived --- */
  const filteredItems = useMemo(() => {
    let result = items;
    if (menuFilter !== 'all')
      result = result.filter((i) => i.menu_categories.menu_type === menuFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.price.toLowerCase().includes(q) ||
          i.menu_categories.subcategory.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, menuFilter, searchQuery]);

  // Group filtered items by menu_type then subcategory
  const groupedByTypeAndCat = useMemo(() => {
    const types = menuFilter === 'all' ? ['food', 'bar', 'shisha'] : [menuFilter];
    return types
      .map((type) => {
        const typeItems = filteredItems.filter((i) => i.menu_categories.menu_type === type);
        const subcats = cats
          .filter((c) => c.menu_type === type)
          .sort((a, b) => a.display_order - b.display_order);
        const groups = subcats
          .map((cat) => ({
            category: cat,
            items: typeItems
              .filter((i) => i.category_id === cat.id)
              .sort((a, b) => a.display_order - b.display_order),
          }))
          .filter((g) => g.items.length > 0);
        return {
          type,
          label: type === 'food' ? 'Food Menu' : type === 'bar' ? 'Bar Menu' : 'Shisha Menu',
          groups,
          totalItems: typeItems.length,
        };
      })
      .filter((t) => t.totalItems > 0);
  }, [filteredItems, cats, menuFilter]);

  const filteredCats = useMemo(() => {
    if (menuFilter === 'all') return cats;
    return cats.filter((c) => c.menu_type === menuFilter);
  }, [cats, menuFilter]);

  const catsByType = useMemo(() => {
    const groups: Record<string, Category[]> = { food: [], bar: [], shisha: [] };
    filteredCats.forEach((c) => {
      if (groups[c.menu_type]) groups[c.menu_type].push(c);
    });
    Object.values(groups).forEach((arr) => arr.sort((a, b) => a.display_order - b.display_order));
    return groups;
  }, [filteredCats]);

  const itemCountForCat = (catId: string) => items.filter((i) => i.category_id === catId).length;
  const itemCountForType = (type: string) =>
    items.filter((i) => i.menu_categories.menu_type === type).length;

  /* --- mutations: items --- */
  const updateItem = (id: string, field: keyof MenuItem, value: string | boolean | number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const updateItemCategory = (id: string, catId: string) => {
    const cat = cats.find((c) => c.id === catId);
    if (!cat) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              category_id: catId,
              menu_categories: {
                name: cat.name,
                menu_type: cat.menu_type,
                subcategory: cat.subcategory,
              },
            }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItemId === id) setEditingItemId(null);
  };

  const startAddItem = () => {
    const firstCat = cats[0];
    if (!firstCat) return;
    setNewItem(blankItem(firstCat));
    setAddingItem(true);
  };

  const confirmAddItem = () => {
    if (!newItem) return;
    setItems((prev) => [...prev, newItem]);
    setAddingItem(false);
    setNewItem(null);
  };

  const cancelAddItem = () => {
    setAddingItem(false);
    setNewItem(null);
  };

  /* --- mutations: categories --- */
  const updateCat = (id: string, field: keyof Category, value: string | number) => {
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const deleteCat = (id: string) => {
    if (!confirm('Delete this category? Items in this category will NOT be deleted.')) return;
    setCats((prev) => prev.filter((c) => c.id !== id));
    if (editingCatId === id) setEditingCatId(null);
  };

  const confirmAddCat = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: crypto.randomUUID(),
      name: newCatName.trim(),
      menu_type: newCatMenuType,
      subcategory: newCatSubcategory.trim() || newCatName.trim(),
      display_order: cats.filter((c) => c.menu_type === newCatMenuType).length + 1,
    };
    setCats((prev) => [...prev, newCat]);
    setAddingCat(false);
    setNewCatName('');
    setNewCatSubcategory('');
  };

  /* --- save --- */
  const handleSave = async () => {
    setSaveStatus('saving');
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          files: [
            { file: 'src/data/menu-items.json', data: items },
            { file: 'src/data/menu-categories.json', data: cats },
          ],
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Save failed (${res.status})`);
      }
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err: unknown) {
      setSaveStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="relative min-h-screen bg-gray-50 pb-24">
      {/* =================== SUB-TABS =================== */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex gap-8 px-6 pt-4">
          {(['items', 'categories'] as SubTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`pb-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                subTab === t
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t === 'items' ? 'Menu Items' : 'Categories'}
            </button>
          ))}
        </div>
      </div>

      {/* =================== FILTER PILLS =================== */}
      <div className="flex gap-2 px-6 py-4">
        {(
          [
            { label: 'ALL MENUS', value: 'all' },
            { label: 'FOOD MENU', value: 'food' },
            { label: 'BAR MENU', value: 'bar' },
            { label: 'SHISHA MENU', value: 'shisha' },
          ] as { label: string; value: MenuFilter }[]
        ).map((f) => (
          <button
            key={f.value}
            onClick={() => setMenuFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
              menuFilter === f.value
                ? 'bg-[#89CFF0] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* =================== MENU ITEMS TAB =================== */}
      {subTab === 'items' && (
        <div className="px-6">
          {/* header + search */}
          <div className="flex items-center justify-between mb-4 gap-4">
            <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">
              Menu Items ({filteredItems.length})
            </h2>
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items by name, description, category..."
                className="w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={startAddItem}
              className="rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              + ADD ITEM
            </button>
          </div>

          {/* add item form */}
          {addingItem && newItem && (
            <div className="bg-white border border-blue-200 rounded-xl p-5 mb-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                New Menu Item
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                  <input
                    type="text"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                    placeholder="AED 0.00"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                  placeholder="Item description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={newItem.image_url}
                    onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                    placeholder="/assets/images/menu/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select
                    value={newItem.category_id}
                    onChange={(e) => {
                      const cat = cats.find((c) => c.id === e.target.value);
                      if (cat)
                        setNewItem({
                          ...newItem,
                          category_id: cat.id,
                          menu_categories: {
                            name: cat.name,
                            menu_type: cat.menu_type,
                            subcategory: cat.subcategory,
                          },
                        });
                    }}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                  >
                    {cats
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.menu_type.toUpperCase()}] {c.subcategory}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={newItem.available}
                    onChange={(e) => setNewItem({ ...newItem, available: e.target.checked })}
                    className="accent-[#89CFF0]"
                  />{' '}
                  Available
                </label>
                <div className="flex-1" />
                <button
                  onClick={confirmAddItem}
                  className="rounded-full bg-gray-900 text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800"
                >
                  Save Item
                </button>
                <button
                  onClick={cancelAddItem}
                  className="rounded-full border border-gray-300 text-gray-600 px-5 py-2 text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Grouped by menu type → subcategory */}
          {filteredItems.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-10 text-center text-sm text-gray-400">
              {searchQuery ? `No items matching "${searchQuery}"` : 'No menu items found.'}
            </div>
          )}

          <div className="space-y-6">
            {groupedByTypeAndCat.map(({ type, label, groups }) => (
              <div key={type}>
                {/* Menu type header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{MENU_TYPE_SECTION_ICON[type]}</span>
                  <h3 className="text-base font-bold text-gray-900">{label}</h3>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold uppercase ${MENU_TYPE_BADGE[type]}`}
                  >
                    {groups.reduce((sum, g) => sum + g.items.length, 0)} items
                  </span>
                </div>

                {/* Subcategory sections */}
                <div className="space-y-3">
                  {groups.map(({ category, items: catItems }) => (
                    <div
                      key={category.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                    >
                      {/* Subcategory header - clickable to collapse */}
                      <button
                        onClick={() => toggleCollapse(category.id)}
                        className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">
                            {collapsedCats.has(category.id) ? '▶' : '▼'}
                          </span>
                          <span className="text-sm font-bold text-gray-800">
                            {category.subcategory}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">
                            {catItems.length} items
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${MENU_TYPE_BADGE[type]}`}
                        >
                          {MENU_TYPE_LABEL[type]}
                        </span>
                      </button>

                      {/* Items in this subcategory */}
                      {!collapsedCats.has(category.id) && (
                        <div>
                          {catItems.map((item) => (
                            <div key={item.id}>
                              <div className="flex items-center gap-4 px-5 py-3 border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                                {/* image */}
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  {item.image_url ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                      src={item.image_url}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                      🖼
                                    </div>
                                  )}
                                </div>
                                {/* name + desc */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate">
                                    {item.description}
                                  </p>
                                </div>
                                {/* price */}
                                <span className="text-sm font-semibold text-[#89CFF0] whitespace-nowrap">
                                  {item.price}
                                </span>
                                {/* status */}
                                {item.available ? (
                                  <span className="rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 text-xs font-semibold">
                                    Active
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-red-100 text-red-600 px-2.5 py-0.5 text-xs font-semibold">
                                    Off
                                  </span>
                                )}
                                {/* actions */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      setEditingItemId(editingItemId === item.id ? null : item.id)
                                    }
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                                    title="Edit"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => deleteItem(item.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                                    title="Delete"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              {/* inline edit */}
                              {editingItemId === item.id && (
                                <div className="bg-blue-50/40 border-t border-blue-100 px-5 py-4">
                                  <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Name
                                      </label>
                                      <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) =>
                                          updateItem(item.id, 'name', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Price
                                      </label>
                                      <input
                                        type="text"
                                        value={item.price}
                                        onChange={(e) =>
                                          updateItem(item.id, 'price', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Description
                                    </label>
                                    <textarea
                                      value={item.description}
                                      onChange={(e) =>
                                        updateItem(item.id, 'description', e.target.value)
                                      }
                                      rows={2}
                                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Image URL
                                      </label>
                                      <input
                                        type="text"
                                        value={item.image_url}
                                        onChange={(e) =>
                                          updateItem(item.id, 'image_url', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Category
                                      </label>
                                      <select
                                        value={item.category_id}
                                        onChange={(e) =>
                                          updateItemCategory(item.id, e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                                      >
                                        {cats
                                          .sort((a, b) => a.display_order - b.display_order)
                                          .map((c) => (
                                            <option key={c.id} value={c.id}>
                                              [{c.menu_type.toUpperCase()}] {c.subcategory}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                      <input
                                        type="checkbox"
                                        checked={item.available}
                                        onChange={(e) =>
                                          updateItem(item.id, 'available', e.target.checked)
                                        }
                                        className="accent-[#89CFF0]"
                                      />{' '}
                                      Available
                                    </label>
                                    <div className="flex-1" />
                                    <button
                                      onClick={() => setEditingItemId(null)}
                                      className="rounded-full bg-gray-900 text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================== CATEGORIES TAB =================== */}
      {subTab === 'categories' && (
        <div className="px-6">
          {/* header */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Categories Management</h2>
              <p className="text-sm text-gray-500">
                Organize subcategories within Food, Bar, and Shisha menus
              </p>
            </div>
            <button
              onClick={() => setAddingCat(true)}
              className="rounded-full bg-gray-900 text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              + ADD SUBCATEGORY
            </button>
          </div>

          {/* add category form */}
          {addingCat && (
            <div className="bg-white border border-blue-200 rounded-xl p-5 mb-4 mt-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                New Subcategory
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Menu Type</label>
                  <select
                    value={newCatMenuType}
                    onChange={(e) => setNewCatMenuType(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                  >
                    <option value="food">Food</option>
                    <option value="bar">Bar</option>
                    <option value="shisha">Shisha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Subcategory Label
                  </label>
                  <input
                    type="text"
                    value={newCatSubcategory}
                    onChange={(e) => setNewCatSubcategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                    placeholder="Same as name if blank"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={confirmAddCat}
                  className="rounded-full bg-gray-900 text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => setAddingCat(false)}
                  className="rounded-full border border-gray-300 text-gray-600 px-5 py-2 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* sections by menu type */}
          <div className="space-y-8 mt-6">
            {(['food', 'bar', 'shisha'] as string[]).map((type) => {
              const typeCats = catsByType[type] || [];
              if (menuFilter !== 'all' && menuFilter !== type) return null;
              if (typeCats.length === 0 && menuFilter !== type && menuFilter !== 'all') return null;

              const sectionLabel =
                type === 'food' ? 'Food Menu' : type === 'bar' ? 'Bar Menu' : 'Shisha Menu';
              const totalItems = itemCountForType(type);

              return (
                <div key={type}>
                  {/* section header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">{MENU_TYPE_SECTION_ICON[type]}</span>
                    <h3 className="text-base font-bold text-gray-900">{sectionLabel}</h3>
                    <span className="text-sm text-gray-400">
                      {typeCats.length} subcategories &middot; {totalItems} items
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${MENU_TYPE_BADGE[type]}`}
                    >
                      {MENU_TYPE_LABEL[type]}
                    </span>
                  </div>

                  {/* cards grid */}
                  {typeCats.length === 0 ? (
                    <p className="text-sm text-gray-400 pl-9">No subcategories yet.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {typeCats.map((cat) => {
                        const count = itemCountForCat(cat.id);
                        const isEditing = editingCatId === cat.id;

                        return (
                          <div
                            key={cat.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                          >
                            {isEditing ? (
                              /* editing state */
                              <div>
                                <div className="mb-3">
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    value={cat.name}
                                    onChange={(e) => updateCat(cat.id, 'name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Subcategory
                                  </label>
                                  <input
                                    type="text"
                                    value={cat.subcategory}
                                    onChange={(e) =>
                                      updateCat(cat.id, 'subcategory', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
                                  />
                                </div>
                                <button
                                  onClick={() => setEditingCatId(null)}
                                  className="rounded-full bg-gray-900 text-white px-4 py-1.5 text-xs font-semibold hover:bg-gray-800 transition-colors"
                                >
                                  Done
                                </button>
                              </div>
                            ) : (
                              /* display state */
                              <div>
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                                    <p className="text-xs text-gray-500">{cat.subcategory}</p>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                                    <span>📚</span>
                                    <span className="font-semibold text-gray-600">{count}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() => setEditingCatId(cat.id)}
                                    className="rounded-full border border-gray-300 text-gray-600 px-4 py-1.5 text-xs font-semibold hover:bg-gray-50 transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteCat(cat.id)}
                                    className="rounded-full border border-red-200 text-red-500 px-4 py-1.5 text-xs font-semibold hover:bg-red-50 transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================== STICKY SAVE BAR =================== */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3">
          <span className="text-sm text-gray-500">
            {items.length} items &middot; {cats.length} categories
          </span>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
              saveStatus === 'saving'
                ? 'bg-gray-300 text-gray-500 cursor-wait'
                : saveStatus === 'success'
                  ? 'bg-green-600 text-white'
                  : saveStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'success'
                ? '✓ Deployed!'
                : saveStatus === 'error'
                  ? errorMessage || 'Error'
                  : 'Save & Deploy'}
          </button>
        </div>
      </div>
    </div>
  );
}
