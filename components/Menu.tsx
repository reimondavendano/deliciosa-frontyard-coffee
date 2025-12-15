'use client';

import { Coffee, Droplet, Cake, Star, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase, MenuItem, MenuCategory } from '@/lib/supabase';

// Fallback data for when database is empty
const fallbackMenuData = {
  coffee: [
    { name: 'Americano', description: 'Rich and bold shot of pure coffee', image: '/images/deliciosa-coffee/americano.png' },
    { name: 'Cafe Latte', description: 'Smooth espresso with velvety steamed milk', image: '/images/deliciosa-coffee/cafe-latte.png' },
    { name: 'Salted Caramel', description: 'Sweet and salty caramel delight', image: '/images/deliciosa-coffee/salted-caramel.png' },
  ],
  'non-coffee': [
    { name: 'Dark Chocolate', description: 'Rich and creamy dark chocolate drink', image: '/images/deliciosa-coffee/dark-chocolate.png' },
    { name: 'Matcha Latte', description: 'Premium green tea with milk', image: '/images/deliciosa-coffee/matcha.png' },
  ],
  pastry: [
    { name: 'Crispy Croffles', description: 'Biscoff, Chocolate, Matcha Strawberry', image: '/images/pastry/crispy-croffles.png' },
    { name: 'Cinnamon Rolls', description: 'Original, Chocolate, Biscoff, Matcha', image: '/images/pastry/cinnamon-rolls.png' },
  ],
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('coffee');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'coffee' as MenuCategory, label: 'Coffee', icon: Coffee },
    { id: 'non-coffee' as MenuCategory, label: 'Non-Coffee', icon: Droplet },
    { id: 'pastry' as MenuCategory, label: 'Pastry', icon: Cake },
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('category')
        .order('name');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter items by category
  const getItemsByCategory = (category: MenuCategory) => {
    const dbItems = menuItems.filter(item => item.category === category);
    if (dbItems.length > 0) return dbItems;
    // Return fallback if no items in DB
    return fallbackMenuData[category]?.map((item, idx) => ({
      id: `fallback-${category}-${idx}`,
      name: item.name,
      description: item.description,
      image: item.image,
      price: 0,
      category,
      is_available: true,
      created_at: new Date().toISOString(),
    })) || [];
  };

  const currentItems = getItemsByCategory(activeCategory);

  return (
    <section id="menu" className="py-24 bg-stone-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rustic-blue/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rust/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-rust font-bold tracking-wider uppercase text-sm mb-2 block">Taste the Difference</span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-rustic-blue-dark mb-6">
            Our Menu
          </h2>
          <div className="w-24 h-1 bg-rust mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Handcrafted with passion, served with love. Explore our selection of premium drinks and artisan pastries.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1.5 bg-white rounded-full shadow-md border border-stone-100">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${isActive
                    ? 'bg-rustic-blue text-white shadow-sm'
                    : 'text-gray-600 hover:text-rustic-blue hover:bg-stone-50'
                    }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-rust'}`} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-rustic-blue" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-stone-100"
              >
                <div className="relative w-full h-64 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                      <Coffee className="w-12 h-12 text-stone-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6 relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-xl font-bold text-rustic-blue-dark group-hover:text-rust transition-colors">
                      {item.name}
                    </h3>
                    <Star className="h-5 w-5 text-rust opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100" />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description || 'Delicious handcrafted item'}
                  </p>
                  {/* Price hidden for now - uncomment when ready
                  {item.price > 0 && (
                    <p className="text-rust font-bold text-lg mt-3">₱{item.price.toFixed(2)}</p>
                  )}
                  */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
