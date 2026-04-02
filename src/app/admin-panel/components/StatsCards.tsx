'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface Stat {
  id: string;
  icon: string;
  label: string;
  value: string;
  color: string;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stat[]>([
    {
      id: 'stat_items',
      icon: 'RectangleStackIcon',
      label: 'Active Menu Items',
      value: '0',
      color: 'bg-primary',
    },
    {
      id: 'stat_categories',
      icon: 'FolderIcon',
      label: 'Categories',
      value: '0',
      color: 'bg-accent',
    },
    {
      id: 'stat_images',
      icon: 'PhotoIcon',
      label: 'Total Images',
      value: '0',
      color: 'bg-success',
    },
  ]);
  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: itemsCount } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true })
      .eq('available', true);

    const { count: categoriesCount } = await supabase
      .from('menu_categories')
      .select('*', { count: 'exact', head: true });

    const { count: imagesCount } = await supabase
      .from('restaurant_images')
      .select('*', { count: 'exact', head: true });

    setStats([
      {
        id: 'stat_items',
        icon: 'RectangleStackIcon',
        label: 'Active Menu Items',
        value: String(itemsCount || 0),
        color: 'bg-primary',
      },
      {
        id: 'stat_categories',
        icon: 'FolderIcon',
        label: 'Categories',
        value: String(categoriesCount || 0),
        color: 'bg-accent',
      },
      {
        id: 'stat_images',
        icon: 'PhotoIcon',
        label: 'Total Images',
        value: String(imagesCount || 0),
        color: 'bg-success',
      },
    ]);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.id} className="floating-card p-6 flex items-center gap-4">
          <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
            <Icon name={stat.icon as any} size={28} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}