'use client';

import { useState, useEffect } from 'react';
import rawItems from '@/data/menu-items.json';
import categories from '@/data/menu-categories.json';

interface MenuCategory {
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
  menu_categories: MenuCategory;
}

interface Category {
  id: string;
  name: string;
  menu_type: string;
  subcategory: string;
  display_order: number;
}

type MenuType = 'food' | 'bar' | 'shisha';

const TABS: { label: string; value: MenuType }[] = [
  { label: 'Food', value: 'food' },
  { label: 'Bar', value: 'bar' },
  { label: 'Shisha', value: 'shisha' },
];

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function MenuAdmin({ password }: { password: string }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<MenuType>('food');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setItems(JSON.parse(JSON.stringify(rawItems)) as MenuItem[]);
  }, []);

  const categoriesForTab = (categories as Category[])
    .filter((c) => c.menu_type === activeTab)
    .sort((a, b) => a.display_order - b.display_order);

  const itemsForCategory = (categoryId: string) =>
    items
      .filter((item) => item.category_id === categoryId)
      .sort((a, b) => a.display_order - b.display_order);

  const updateItem = (id: string, field: keyof MenuItem, value: string | boolean | number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = (category: Category) => {
    const newItem: MenuItem = {
      id: generateId(),
      name: '',
      category_id: category.id,
      price: 'AED 0.00',
      description: '',
      available: true,
      display_order: itemsForCategory(category.id).length + 1,
      image_url: '',
      menu_categories: {
        name: category.name,
        menu_type: category.menu_type,
        subcategory: category.subcategory,
      },
    };
    setItems((prev) => [...prev, newItem]);
  };

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
        body: JSON.stringify({ file: 'src/data/menu-items.json', data: items }),
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

  return (
    <div className="relative">
      {/* Floating Save Button */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold text-foreground">Menu Manager</h2>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`rounded-xl px-5 py-2 text-sm font-medium transition-colors ${
            saveStatus === 'saving'
              ? 'bg-muted text-muted-foreground cursor-wait'
              : saveStatus === 'success'
                ? 'bg-green-600 text-white'
                : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {saveStatus === 'saving'
            ? 'Saving...'
            : saveStatus === 'success'
              ? 'Saved!'
              : saveStatus === 'error'
                ? errorMessage || 'Error'
                : 'Save & Deploy'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:opacity-80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Sections */}
      <div className="px-4 pb-8 space-y-6 mt-2">
        {categoriesForTab.map((category) => {
          const catItems = itemsForCategory(category.id);
          return (
            <div key={category.id} className="border border-border rounded-xl overflow-hidden">
              {/* Category Header */}
              <div className="bg-muted px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground">{category.subcategory}</h3>
                <span className="text-xs text-muted-foreground">
                  {catItems.length} item{catItems.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-border">
                {catItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 items-start bg-background">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      {item.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Fields */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          placeholder="Item name"
                          className="flex-1 min-w-0 rounded-lg border border-border bg-background text-foreground px-2 py-1 text-sm"
                        />
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          placeholder="AED 0.00"
                          className="w-28 rounded-lg border border-border bg-background text-foreground px-2 py-1 text-sm"
                        />
                      </div>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Description"
                        rows={2}
                        className="w-full rounded-lg border border-border bg-background text-foreground px-2 py-1 text-sm resize-none"
                      />
                      <input
                        type="text"
                        value={item.image_url}
                        onChange={(e) => updateItem(item.id, 'image_url', e.target.value)}
                        placeholder="Image URL"
                        className="w-full rounded-lg border border-border bg-background text-foreground px-2 py-1 text-xs text-muted-foreground"
                      />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
                      <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.available}
                          onChange={(e) => updateItem(item.id, 'available', e.target.checked)}
                          className="accent-primary"
                        />
                        Avail
                      </label>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="rounded-xl w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors text-lg font-bold"
                        title="Delete item"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Item */}
              <div className="px-4 py-3 border-t border-border bg-background">
                <button
                  onClick={() => addItem(category)}
                  className="rounded-xl px-4 py-2 text-sm font-medium bg-muted text-muted-foreground hover:opacity-80 transition-colors"
                >
                  + Add Item
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
