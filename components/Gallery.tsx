'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  // Events
  {
    url: '/events/1.jpeg',
    alt: 'Event 1',
    category: 'events',
  },
  {
    url: '/events/2.jpeg',
    alt: 'Event 2',
    category: 'events',
  },
  {
    url: '/events/3.jpeg',
    alt: 'Event 3',
    category: 'events',
  },
  {
    url: '/events/4.jpg',
    alt: 'Event 4',
    category: 'events',
  },
  {
    url: '/events/5.jpg',
    alt: 'Event 5',
    category: 'events',
  },
  {
    url: '/events/6.jpg',
    alt: 'Event 6',
    category: 'events',
  },
  {
    url: '/events/7.jpg',
    alt: 'Event 7',
    category: 'events',
  },
  // Operations
  {
    url: '/operations/1.jpg',
    alt: 'Operations 1',
    category: 'operation',
  },
  {
    url: '/operations/2.jpg',
    alt: 'Operations 2',
    category: 'operation',
  },
  {
    url: '/operations/3.jpg',
    alt: 'Operations 3',
    category: 'operation',
  },
  {
    url: '/operations/4.jpg',
    alt: 'Operations 4',
    category: 'operation',
  },
  {
    url: '/operations/5.jpg',
    alt: 'Operations 5',
    category: 'operation',
  },
  {
    url: '/operations/6.jpeg',
    alt: 'Operations 6',
    category: 'operation',
  },
  {
    url: '/operations/7.jpg',
    alt: 'Operations 7',
    category: 'operation',
  },
  {
    url: '/operations/8.jpg',
    alt: 'Operations 8',
    category: 'operation',
  },
];

const ITEMS_PER_PAGE = 6;

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredImages =
    filter === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  // Calculate pagination
  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
              onClick={() => handleFilterChange('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === 'all'
                ? 'bg-rustic-blue text-white'
                : 'bg-white text-gray-700 hover:bg-stone-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('operation')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === 'operation'
                ? 'bg-rustic-blue text-white'
                : 'bg-white text-gray-700 hover:bg-stone-200'
                }`}
            >
              Operations
            </button>
            <button
              onClick={() => handleFilterChange('events')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === 'events'
                ? 'bg-rustic-blue text-white'
                : 'bg-white text-gray-700 hover:bg-stone-200'
                }`}
            >
              Events
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {currentImages.map((image, index) => (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 font-semibold hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === page
                      ? 'bg-rustic-blue text-white'
                      : 'bg-white text-gray-700 hover:bg-stone-200'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 font-semibold hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
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
