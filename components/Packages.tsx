'use client';

import { Coffee, Cake, Check } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const coffeePackages = [
  {
    name: 'Mini',
    pax: '50 pax',
    price: '₱6,500',
    image: '/packages/mini.png',
    features: [
      '4 flavors (coffee & non-coffee)',
      '3 hours of service',
      'Professional barista service',
      'Premium coffee beans',
      'Choice of espresso-based drinks',
      'Beautiful display presentation',
    ],
    popular: false,
  },
  {
    name: 'Classic',
    pax: '100 pax',
    price: '₱11,500',
    image: '/packages/classic.png',
    features: [
      '6 flavors (coffee & non-coffee)',
      '3 hours of service',
      'Professional barista service',
      'Premium coffee beans',
      'Choice of espresso-based drinks',
      'Beautiful display presentation',
    ],
    popular: true,
  },
  {
    name: 'Plus',
    pax: '150 pax',
    price: '₱16,500',
    image: '/packages/plus.png',
    features: [
      '8 flavors (coffee & non-coffee)',
      '4 hours of service',
      'Professional barista service',
      'Premium coffee beans',
      'Choice of espresso-based drinks',
      'Beautiful display presentation',
    ],
    popular: false,
  },
];

const pastryPackages = [
  {
    name: 'Starter',
    pax: '50 pax',
    price: '₱7,499',
    features: [
      '50 servings of our 6 variety of cakes & pastries',
      '2 hours of service',
      'Free toppers',
      'Fresh daily-baked pastries',
      'Variety of sweet treats',
      'Beautiful display presentation',
    ],
    popular: false,
  },
  {
    name: 'Crowd',
    pax: '100 pax',
    price: '₱14,499',
    features: [
      '100 servings of our 6 variety of cakes & pastries',
      '2 hours of service',
      'Free toppers',
      'Free 6x4 inches of our specialty cake',
      'Fresh daily-baked pastries',
      'Variety of sweet treats',
      'Beautiful display presentation',
    ],
    popular: true,
  },
  {
    name: 'Celebration',
    pax: '150 pax',
    price: '₱21,000',
    features: [
      '150 servings of our 6 variety of cakes & pastries',
      '2 hours of service',
      'Free toppers',
      'Free 6x4 inches of our specialty cake',
      'Fresh daily-baked pastries',
      'Variety of sweet treats',
      'Beautiful display presentation',
    ],
    popular: false,
  },
];

export default function Packages() {
  const [activeTab, setActiveTab] = useState<'coffee' | 'pastry'>('coffee');

  const currentPackages = activeTab === 'coffee' ? coffeePackages : pastryPackages;

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
              onClick={() => setActiveTab('coffee')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'coffee'
                ? 'bg-rustic-blue text-white shadow-md'
                : 'text-gray-600 hover:text-rustic-blue'
                }`}
            >
              <Coffee className="h-5 w-5" />
              Coffee Cart
            </button>
            <button
              onClick={() => setActiveTab('pastry')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'pastry'
                ? 'bg-rustic-blue text-white shadow-md'
                : 'text-gray-600 hover:text-rustic-blue'
                }`}
            >
              <Cake className="h-5 w-5" />
              Pastry Cart
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {currentPackages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-warm-cream/30 border-2 rounded-2xl p-8 transition-all hover:shadow-2xl hover:scale-105 flex flex-col ${pkg.popular
                ? 'border-rust shadow-xl'
                : 'border-warm-brown/20'
                }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rust text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}

              {/* Package Image - only for coffee packages */}
              {activeTab === 'coffee' && 'image' in pkg && (
                <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={pkg.image as string}
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
                <p className="text-rust font-semibold mb-4">{pkg.pax}</p>
                <p className="text-3xl font-bold text-gray-900">{pkg.price}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-sage shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full py-3 rounded-full text-center font-semibold transition-all ${pkg.popular
                  ? 'bg-rust text-white hover:bg-rust/90 shadow-lg'
                  : 'bg-rustic-blue text-white hover:bg-rustic-blue-dark'
                  }`}
              >
                Book Now
              </a>
            </div>
          ))}
        </div>

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
