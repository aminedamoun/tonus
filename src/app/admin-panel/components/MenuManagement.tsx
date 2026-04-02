'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface MenuItem {
  id: string;
  name: string;
  category_id: string;
  price: string;
  description?: string;
  available: boolean;
  display_order: number;
  image_url?: string;
}

interface Category {
  id: string;
  name: string;
  menu_type: string;
  subcategory: string;
  display_order: number;
}

type MenuType = 'all' | 'food' | 'bar' | 'shisha';

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState<'categories' | 'items'>('items');
  const [menuTypeFilter, setMenuTypeFilter] = useState<MenuType>('all');
  const [categoryMenuTypeFilter, setCategoryMenuTypeFilter] = useState<MenuType>('all');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('All');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [activeTab, menuTypeFilter]);

  useEffect(() => {
    // Reset subcategory filter when menu type changes
    setActiveSubcategory('All');
  }, [menuTypeFilter]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'items') {
      await fetchMenuItems();
      await fetchCategories();
    } else {
      await fetchCategories();
    }
    setLoading(false);
  };

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories!inner(menu_type)
      `)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching menu items:', error);
    } else {
      setMenuItems(data || []);
    }
  };

  const fetchCategories = async () => {
    let query = supabase
      .from('menu_categories')
      .select('*')
      .order('display_order', { ascending: true });

    // Apply filter based on active tab
    const filterToUse = activeTab === 'categories' ? categoryMenuTypeFilter : menuTypeFilter;
    if (filterToUse !== 'all') {
      query = query.eq('menu_type', filterToUse);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ available: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating availability:', error);
    } else {
      await fetchMenuItems();
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from('menu_items').delete().eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
    } else {
      await fetchMenuItems();
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All items in this category will also be deleted.')) return;

    const { error } = await supabase.from('menu_categories').delete().eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
    } else {
      await fetchCategories();
    }
  };

  const saveMenuItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemData = {
      name: formData.get('name') as string,
      category_id: formData.get('category_id') as string,
      price: formData.get('price') as string,
      description: formData.get('description') as string,
      available: formData.get('available') === 'true',
      display_order: parseInt(formData.get('display_order') as string) || 0,
      image_url: currentImageUrl || null,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingItem.id);

      if (error) {
        console.error('Error updating item:', error);
      } else {
        setEditingItem(null);
        setShowItemForm(false);
        setImagePreview(null);
        setCurrentImageUrl('');
        await fetchMenuItems();
      }
    } else {
      const { error } = await supabase.from('menu_items').insert([itemData]);

      if (error) {
        console.error('Error creating item:', error);
      } else {
        setShowItemForm(false);
        setImagePreview(null);
        setCurrentImageUrl('');
        await fetchMenuItems();
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image: ' + (error as any).message);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update preview and form field
      setImagePreview(publicUrl);
      const imageUrlInput = document.querySelector('input[name="image_url"]') as HTMLInputElement;
      if (imageUrlInput) {
        imageUrlInput.value = publicUrl;
      }
      setCurrentImageUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowItemForm(true);
    setImagePreview(item.image_url || null);
    setCurrentImageUrl(item.image_url || '');
  };

  const handleCancelForm = () => {
    setEditingItem(null);
    setShowItemForm(false);
    setImagePreview(null);
    setCurrentImageUrl('');
  };

  const saveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryData = {
      name: formData.get('name') as string,
      menu_type: formData.get('menu_type') as string,
      subcategory: formData.get('subcategory') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    if (editingCategory) {
      const { error } = await supabase
        .from('menu_categories')
        .update(categoryData)
        .eq('id', editingCategory.id);

      if (error) {
        console.error('Error updating category:', error);
      } else {
        setEditingCategory(null);
        setShowCategoryForm(false);
        await fetchCategories();
      }
    } else {
      const { error } = await supabase.from('menu_categories').insert([categoryData]);

      if (error) {
        console.error('Error creating category:', error);
      } else {
        setShowCategoryForm(false);
        await fetchCategories();
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryMenuType = (categoryId: string): string => {
    return categories.find((cat) => cat.id === categoryId)?.menu_type || 'food';
  };

  const getItemCount = (categoryId: string) => {
    return menuItems.filter((item) => item.category_id === categoryId).length;
  };

  const getFilteredMenuItems = () => {
    if (menuTypeFilter === 'all') return menuItems;
    return menuItems.filter((item: any) => {
      const category = categories.find(cat => cat.id === item.category_id);
      if (category?.menu_type !== menuTypeFilter) return false;
      
      // Apply subcategory filter
      if (activeSubcategory !== 'All') {
        return category?.subcategory === activeSubcategory;
      }
      return true;
    });
  };

  const filteredMenuItems = getFilteredMenuItems();

  // Get unique subcategories for current menu type
  const getUniqueSubcategories = () => {
    if (menuTypeFilter === 'all') return [];
    const subcategories = categories
      .filter(cat => cat.menu_type === menuTypeFilter)
      .map(cat => cat.subcategory)
      .filter((value, index, self) => value && self.indexOf(value) === index);
    return ['All', ...subcategories];
  };

  const uniqueSubcategories = getUniqueSubcategories();

  const getMenuTypeBadgeColor = (menuType: string) => {
    switch (menuType) {
      case 'food':
        return 'bg-accent/20 text-accent border-accent/40';
      case 'bar':
        return 'bg-primary/20 text-primary border-primary/40';
      case 'shisha':
        return 'bg-warning/20 text-warning border-warning/40';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getMenuTypeIcon = (menuType: string) => {
    switch (menuType) {
      case 'food':
        return '🍽️';
      case 'bar':
        return '🍹';
      case 'shisha':
        return '💨';
      default:
        return '📋';
    }
  };

  const getMenuTypeTitle = (menuType: string) => {
    switch (menuType) {
      case 'food':
        return 'Food Menu';
      case 'bar':
        return 'Bar Menu';
      case 'shisha':
        return 'Shisha Menu';
      default:
        return menuType;
    }
  };

  const getCategoriesByMenuType = (menuType: string) => {
    return categories.filter(cat => cat.menu_type === menuType);
  };

  if (loading) {
    return (
      <div className="floating-card p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="floating-card p-8">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('items')}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider ${
            activeTab === 'items' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
          }`}
        >
          Menu Items
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider ${
            activeTab === 'categories' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
          }`}
        >
          Categories
        </button>
      </div>

      {/* Menu Type Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => {
            if (activeTab === 'categories') {
              setCategoryMenuTypeFilter('all');
            } else {
              setMenuTypeFilter('all');
            }
          }}
          className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider ${
            (activeTab === 'categories' ? categoryMenuTypeFilter : menuTypeFilter) === 'all' ? 'bg-primary text-white shadow-blue-glow' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary border border-border'
          }`}
        >
          All Menus
        </button>
        <button
          onClick={() => {
            if (activeTab === 'categories') {
              setCategoryMenuTypeFilter('food');
            } else {
              setMenuTypeFilter('food');
            }
          }}
          className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1 ${
            (activeTab === 'categories' ? categoryMenuTypeFilter : menuTypeFilter) === 'food' ? 'bg-accent text-white' : 'bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30'
          }`}
        >
          <Icon name="SparklesIcon" size={14} />
          Food Menu
        </button>
        <button
          onClick={() => {
            if (activeTab === 'categories') {
              setCategoryMenuTypeFilter('bar');
            } else {
              setMenuTypeFilter('bar');
            }
          }}
          className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1 ${
            (activeTab === 'categories' ? categoryMenuTypeFilter : menuTypeFilter) === 'bar' ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30'
          }`}
        >
          <Icon name="BeakerIcon" size={14} />
          Bar Menu
        </button>
        <button
          onClick={() => {
            if (activeTab === 'categories') {
              setCategoryMenuTypeFilter('shisha');
            } else {
              setMenuTypeFilter('shisha');
            }
          }}
          className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 ${
            (activeTab === 'categories' ? categoryMenuTypeFilter : menuTypeFilter) === 'shisha' ? 'bg-warning text-white shadow-orange-glow' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary border border-border'
          }`}
        >
          💨 Shisha Menu
        </button>
      </div>

      {/* Subcategory Filter - Only show in items tab when specific menu type is selected */}
      {activeTab === 'items' && menuTypeFilter !== 'all' && uniqueSubcategories.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-border">
          {uniqueSubcategories.map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => setActiveSubcategory(subcategory)}
              className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider ${
                activeSubcategory === subcategory
                  ? 'bg-primary text-white shadow-blue-glow'
                  : 'bg-secondary text-secondary-foreground border-2 border-primary/20'
              }`}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}

      {/* Menu Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-foreground">Menu Items ({filteredMenuItems.length})</h3>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowItemForm(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Icon name="PlusIcon" size={20} />
              Add Item
            </button>
          </div>

          {showItemForm && (
            <div className="bg-muted/50 p-6 rounded-2xl border-2 border-primary/40">
              <h4 className="text-lg font-bold mb-4">{editingItem ? 'Edit Item' : 'New Item'}</h4>
              <form onSubmit={saveMenuItem} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingItem?.name}
                      required
                      className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Category (Menu Type)</label>
                    <select
                      name="category_id"
                      defaultValue={editingItem?.category_id}
                      required
                      className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                    >
                      <option value="">Select Category</option>
                      <optgroup label="Food Menu">
                        {categories.filter(cat => cat.menu_type === 'food').map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.subcategory})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Bar Menu">
                        {categories.filter(cat => cat.menu_type === 'bar').map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.subcategory})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Shisha Menu">
                        {categories.filter(cat => cat.menu_type === 'shisha').map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.subcategory})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Price</label>
                    <input
                      type="text"
                      name="price"
                      defaultValue={editingItem?.price}
                      required
                      placeholder="AED 50"
                      className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Display Order</label>
                    <input
                      type="number"
                      name="display_order"
                      defaultValue={editingItem?.display_order || 0}
                      className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                  />
                </div>
                
                {/* Image Upload Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold mb-2">Item Image</label>
                  
                  {/* Image Preview */}
                  {(imagePreview || editingItem?.image_url) && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                      <Image
                        src={imagePreview || editingItem?.image_url || ''}
                        alt="Menu item preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex gap-3 items-center">
                    <label className="btn-primary cursor-pointer flex items-center gap-2">
                      <Icon name="PhotoIcon" size={20} />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    {(imagePreview || editingItem?.image_url) && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setCurrentImageUrl('');
                          const imageUrlInput = document.querySelector('input[name="image_url"]') as HTMLInputElement;
                          if (imageUrlInput) imageUrlInput.value = '';
                        }}
                        className="px-4 py-2 rounded-full bg-red-500/20 text-red-500 font-bold text-sm"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  
                  {/* Hidden input to store image URL */}
                  <input
                    type="hidden"
                    name="image_url"
                    value={currentImageUrl}
                  />
                  
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPEG, PNG, WebP, GIF (Max 5MB)
                  </p>
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="available"
                      value="true"
                      defaultChecked={editingItem?.available ?? true}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-bold">Available</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary">
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowItemForm(false);
                      setEditingItem(null);
                      setImagePreview(null);
                      setCurrentImageUrl('');
                    }}
                    className="px-6 py-3 rounded-full bg-muted text-foreground font-bold text-sm uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Image
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Menu Type
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMenuItems.map((item) => {
                  const menuType = getCategoryMenuType(item.category_id);
                  return (
                    <tr key={item.id} className="border-b border-border">
                      <td className="py-4 px-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Icon name="PhotoIcon" size={24} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-foreground">{item.name}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{getCategoryName(item.category_id)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getMenuTypeBadgeColor(menuType)}`}>
                          {menuType}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-primary">{item.price}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleAvailability(item.id, item.available)}
                          className={`availability-badge ${
                            item.available ? 'available' : 'unavailable'
                          }`}
                        >
                          {item.available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowItemForm(true);
                              setImagePreview(item.image_url || null);
                              setCurrentImageUrl(item.image_url || '');
                            }}
                            className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
                          >
                            <Icon name="PencilIcon" size={16} />
                          </button>
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive"
                          >
                            <Icon name="TrashIcon" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-foreground">Categories Management</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Organize subcategories within Food, Bar, and Shisha menus
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowCategoryForm(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Icon name="PlusIcon" size={20} />
              Add Subcategory
            </button>
          </div>

          {showCategoryForm && (
            <div className="bg-muted/50 p-6 rounded-2xl border-2 border-primary/40">
              <h4 className="text-lg font-bold mb-4">{editingCategory ? 'Edit Subcategory' : 'New Subcategory'}</h4>
              <form onSubmit={saveCategory} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingCategory?.name}
                      required
                      className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Parent Menu Type</label>
                    <select
                      name="menu_type"
                      defaultValue={editingCategory?.menu_type || 'food'}
                      required
                      className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                    >
                      <option value="food">🍽️ Food Menu</option>
                      <option value="bar">🍹 Bar Menu</option>
                      <option value="shisha">💨 Shisha Menu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Subcategory Name</label>
                    <input
                      type="text"
                      name="subcategory"
                      defaultValue={editingCategory?.subcategory}
                      required
                      placeholder="e.g., Breakfast, Coffee, Arabic Shisha"
                      className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Display Order</label>
                    <input
                      type="number"
                      name="display_order"
                      defaultValue={editingCategory?.display_order || 0}
                      className="w-full px-4 py-2 rounded-lg border-2 border-border focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary">
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(false);
                      setEditingCategory(null);
                    }}
                    className="px-6 py-3 rounded-full bg-muted text-foreground font-bold text-sm uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Button-Based Menu Structure */}
          <div className="space-y-6">
            {['food', 'bar', 'shisha'].map((menuType) => {
              const menuCategories = getCategoriesByMenuType(menuType);
              const totalItems = menuCategories.reduce((sum, cat) => sum + getItemCount(cat.id), 0);
              
              return (
                <div key={menuType} className="border-2 border-primary/30 rounded-2xl p-6 bg-card">
                  {/* Menu Type Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{getMenuTypeIcon(menuType)}</div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground">{getMenuTypeTitle(menuType)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {menuCategories.length} subcategories • {totalItems} items
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase border ${getMenuTypeBadgeColor(menuType)}`}>
                      {menuType}
                    </span>
                  </div>

                  {/* Subcategory Buttons */}
                  {menuCategories.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl">
                      <Icon name="FolderOpenIcon" size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No subcategories yet</p>
                      <p className="text-sm mt-1">Click "Add Subcategory" to create one</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {menuCategories.map((category) => (
                        <div
                          key={category.id}
                          className="group relative p-4 rounded-xl border-2 border-border bg-background"
                        >
                          {/* Category Button Content */}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h5 className="font-bold text-foreground text-sm mb-0.5">{category.name}</h5>
                                <p className="text-xs text-muted-foreground italic">{category.subcategory}</p>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs">
                                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Icon name="RectangleStackIcon" size={12} className="text-primary" />
                                </div>
                                <span className="font-bold text-foreground">{getItemCount(category.id)}</span>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setEditingCategory(category);
                                  setShowCategoryForm(true);
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center gap-1.5 text-primary font-bold text-xs"
                              >
                                <Icon name="PencilIcon" size={12} />
                                Edit
                              </button>
                              <button
                                onClick={() => deleteCategory(category.id)}
                                className="px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive"
                              >
                                <Icon name="TrashIcon" size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}