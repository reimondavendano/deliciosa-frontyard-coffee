'use client';

import { Coffee, Droplet, Cake, Star } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const menuData = {
  coffee: [
    { name: 'Hazelnut Latte', description: 'Rich and bold shot of pure coffee', image: '/images/menu/hazelnut-latte.png' },
    { name: 'Cafe Latte', description: 'Smooth espresso with velvety steamed milk', image: '/images/menu/latte.png' },
    { name: 'Salted Caramel', description: 'Sweet and salty caramel delight', image: '/images/menu/macchiato.png' },
    { name: 'French Vanilla', description: 'Classic vanilla infused latte', image: '/images/menu/latte.png' },
    { name: 'Mocha Latte', description: 'Espresso with chocolate and steamed milk', image: '/images/menu/mocha.png' },
    { name: 'Vanilla Latte', description: 'Smooth espresso with vanilla syrup', image: '/images/menu/latte.png' },
    { name: 'Caramel Macchiato', description: 'Espresso marked with caramel and foam', image: '/images/menu/macchiato.png' },
    { name: 'Spanish Latte', description: 'Sweet and creamy condensed milk latte', image: '/images/menu/latte.png' },
  ],
  nonCoffee: [
    { name: 'Dark Chocolate', description: 'Rich and creamy dark chocolate drink', image: '/images/menu/mocha.png' },
    { name: 'Matcha Latte', description: 'Premium green tea with milk', image: '/images/menu/latte.png' },
    { name: 'Orange Matcha', description: 'Zesty orange meets earthy matcha', image: '/images/menu/latte.png' },
    { name: 'Strawberry Matcha', description: 'Sweet strawberry blended with matcha', image: '/images/menu/latte.png' },
    { name: 'Chocolate Mint', description: 'Refreshing mint with rich chocolate', image: '/images/menu/mocha.png' },
    { name: 'Thai Tea Latte', description: 'Spiced Thai tea with sweetened milk', image: '/images/menu/chai-latte.png' },
    { name: 'Blueberry Cucumber Soda', description: 'Refreshing sparkling soda', image: '/images/menu/americano.png' },
    { name: 'Lychee Lemon Ginger Soda', description: 'Zesty and sweet sparkling drink', image: '/images/menu/americano.png' },
  ],
  pastry: [
    { name: 'Croissant', description: 'Buttery, flaky French pastry', image: '/images/menu/latte.png' },
    { name: 'Pain au Chocolat', description: 'Croissant filled with chocolate', image: '/images/menu/latte.png' },
    { name: 'Almond Tart', description: 'Sweet almond cream in pastry shell', image: '/images/menu/latte.png' },
    { name: 'Berry Danish', description: 'Pastry with seasonal berries', image: '/images/menu/latte.png' },
    { name: 'Cinnamon Roll', description: 'Soft roll with cinnamon and icing', image: '/images/menu/latte.png' },
    { name: 'Scones', description: 'Traditional with clotted cream', image: '/images/menu/latte.png' },
  ],
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('coffee');

  const categories = [
    { id: 'coffee', label: 'Coffee', icon: Coffee },
    { id: 'nonCoffee', label: 'Non-Coffee', icon: Droplet },
    { id: 'pastry', label: 'Pastry', icon: Cake },
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {menuData[activeCategory as keyof typeof menuData].map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-stone-100"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
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
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
