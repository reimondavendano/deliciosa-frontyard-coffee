'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase, GalleryItem, GalleryCategory } from '@/lib/supabase';

const ITEMS_PER_PAGE = 6;

// Fallback images
const fallbackImages = [
  { url: '/events/1.jpeg', category: 'events' },
  { url: '/events/2.jpeg', category: 'events' },
  { url: '/operations/1.jpg', category: 'operations' },
  { url: '/operations/2.jpg', category: 'operations' },
];

export default function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory | 'all'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use DB data or fallback
  const images = galleryItems.length > 0
    ? galleryItems.map(item => ({ url: item.image, category: item.category, title: item.title }))
    : fallbackImages.map(img => ({ ...img, title: null }));

  const filteredImages =
    filter === 'all'
      ? images
      : images.filter((img) => img.category === filter);

  // Calculate pagination
  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter: GalleryCategory | 'all') => {
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
              onClick={() => handleFilterChange('operations')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === 'operations'
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

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-rustic-blue" />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {currentImages.map((image, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-lg cursor-pointer aspect-square"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.title || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rustic-blue-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-semibold capitalize">{image.category}</p>
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
          </>
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
