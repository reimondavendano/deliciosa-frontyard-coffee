'use client';

import { Coffee, Cake, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase, Package, PackageCategory } from '@/lib/supabase';

// Fallback packages
const fallbackCoffeePackages = [
  {
    name: 'Mini',
    description: '50 pax',
    price: 6500,
    image: '/packages/mini.png',
    inclusions: [
      '4 flavors (coffee & non-coffee)',
      '3 hours of service',
      'Professional barista service',
    ],
  },
  {
    name: 'Classic',
    description: '100 pax',
    price: 11500,
    image: '/packages/classic.png',
    inclusions: [
      '6 flavors (coffee & non-coffee)',
      '3 hours of service',
      'Professional barista service',
    ],
  },
];

const fallbackPastryPackages = [
  {
    name: 'Starter',
    description: '50 pax',
    price: 7499,
    inclusions: [
      '50 servings of our 6 variety of cakes & pastries',
      '2 hours of service',
      'Free toppers',
    ],
  },
];

export default function Packages() {
  const [activeTab, setActiveTab] = useState<'coffee cart' | 'pastry cart'>('coffee cart');
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPackagesByCategory = (category: PackageCategory) => {
    const dbPackages = packages.filter(pkg => pkg.category === category);
    if (dbPackages.length > 0) return dbPackages;

    // Return fallbacks
    if (category === 'coffee cart') {
      return fallbackCoffeePackages.map((pkg, idx) => ({
        ...pkg,
        id: `fallback-coffee-${idx}`,
        category: 'coffee cart' as PackageCategory,
        is_active: true,
        created_at: new Date().toISOString(),
      }));
    }
    return fallbackPastryPackages.map((pkg, idx) => ({
      ...pkg,
      id: `fallback-pastry-${idx}`,
      category: 'pastry cart' as PackageCategory,
      image: null,
      is_active: true,
      created_at: new Date().toISOString(),
    }));
  };

  const currentPackages = getPackagesByCategory(activeTab);

  // Mark the middle package as popular if there are 3+
  const markPopular = (pkg: Package, index: number, arr: Package[]) => {
    if (arr.length >= 3 && index === 1) return true;
    return false;
  };

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-rustic-blue-dark mb-4">
            Our Packages
          </h2>
          <div className="w-24 h-1 bg-rust mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the perfect package for your special occasion
          </p>

          <div className="inline-flex p-1 bg-stone-100 rounded-full">
            <button
              onClick={() => setActiveTab('coffee cart')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'coffee cart'
                ? 'bg-rustic-blue text-white shadow-md'
                : 'text-gray-600 hover:text-rustic-blue'
                }`}
            >
              <Coffee className="h-5 w-5" />
              Coffee Cart
            </button>
            <button
              onClick={() => setActiveTab('pastry cart')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'pastry cart'
                ? 'bg-rustic-blue text-white shadow-md'
                : 'text-gray-600 hover:text-rustic-blue'
                }`}
            >
              <Cake className="h-5 w-5" />
              Pastry Cart
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-rustic-blue" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {currentPackages.map((pkg, index) => {
              const isPopular = markPopular(pkg, index, currentPackages);
              return (
                <div
                  key={pkg.id}
                  className={`relative bg-warm-cream/30 border-2 rounded-2xl p-8 transition-all hover:shadow-2xl hover:scale-105 flex flex-col ${isPopular
                    ? 'border-rust shadow-xl'
                    : 'border-warm-brown/20'
                    }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rust text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Package Image */}
                  {pkg.image && (
                    <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden">
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="font-serif text-2xl font-bold text-rustic-blue-dark mb-2">
                      {pkg.name}
                    </h3>
                    {pkg.description && (
                      <p className="text-rust font-semibold mb-4">{pkg.description}</p>
                    )}
                    {/* Price hidden for now - uncomment when ready
                    {pkg.price && (
                      <p className="text-3xl font-bold text-gray-900">
                        ₱{pkg.price.toLocaleString()}
                      </p>
                    )}
                    */}
                  </div>

                  {pkg.inclusions && pkg.inclusions.length > 0 && (
                    <ul className="space-y-3 mb-8 flex-grow">
                      {pkg.inclusions.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-sage shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    href="#contact"
                    className={`block w-full py-3 rounded-full text-center font-semibold transition-all ${isPopular
                      ? 'bg-rust text-white hover:bg-rust/90 shadow-lg'
                      : 'bg-rustic-blue text-white hover:bg-rustic-blue-dark'
                      }`}
                  >
                    Book Now
                  </a>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            All packages can be customized to fit your event needs
          </p>
          <p className="text-sm text-gray-500">
            Prices may vary based on location, guest count, and additional services
          </p>
        </div>
      </div>
    </section>
  );
}
