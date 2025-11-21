'use client';

import { Coffee, Droplet, Cake } from 'lucide-react';
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
    <section id="menu" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-rustic-blue-dark mb-4">
            Our Menu
          </h2>
          <div className="w-24 h-1 bg-rust mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handcrafted with passion, served with love
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeCategory === category.id
                  ? 'bg-rustic-blue text-white shadow-lg'
                  : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
                  }`}
              >
                <Icon className="h-5 w-5" />
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {menuData[activeCategory as keyof typeof menuData].map((item, index) => (
            <div
              key={index}
              className="bg-warm-cream/30 border border-warm-brown/20 rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 flex flex-col"
            >
              <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-xl font-bold text-rustic-blue-dark">
                  {item.name}
                </h3>
              </div>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
