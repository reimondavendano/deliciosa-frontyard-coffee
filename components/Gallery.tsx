'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const galleryImages = [
  {
    url: '../operations/ops_1.jpg',
    alt: 'Coffee preparation',
    category: 'operation',
  },
  {
    url: '../events/1.jpeg',
    alt: 'Wedding event setup',
    category: 'events',
  },
  {
    url: '../operations/ops_2.jpg',
    alt: 'Barista making latte',
    category: 'operation',
  },
  {
    url: '../events/2.jpeg',
    alt: 'Corporate event',
    category: 'events',
  },
  {
    url: '../operations/ops_3.jpg',
    alt: 'Fresh pastries',
    category: 'operation',
  },
  {
    url: '../events/3.jpeg',
    alt: 'Birthday celebration',
    category: 'events',
  },
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages =
    filter === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  return (
    <section id="gallery" className="py-20 bg-stone-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-rustic-blue-dark mb-4">
            Gallery
          </h2>
          <div className="w-24 h-1 bg-rust mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Moments from our operations and events
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === 'all'
                ? 'bg-rustic-blue text-white'
                : 'bg-white text-gray-700 hover:bg-stone-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('operation')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === 'operation'
                ? 'bg-rustic-blue text-white'
                : 'bg-white text-gray-700 hover:bg-stone-200'
                }`}
            >
              Operations
            </button>
            <button
              onClick={() => setFilter('events')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === 'events'
                ? 'bg-rustic-blue text-white'
                : 'bg-white text-gray-700 hover:bg-stone-200'
                }`}
            >
              Events
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg cursor-pointer aspect-square"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rustic-blue-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-semibold">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-rust transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </section>
  );
}
