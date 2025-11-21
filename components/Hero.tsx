'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url(../assets/1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-rustic-blue-dark/50 via-rustic-blue/50 to-rustic-blue-dark/50"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-block mb-4">
            {/* <div className="flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-rust rounded-full animate-pulse"></div>
              <span className="text-sm tracking-wider uppercase">
                Artisan Coffee & Pastries
              </span>
            </div> */}
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            Deliciosa
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-warm-cream">
            Crafting Memorable Moments
          </p>

          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-gray-100">
            Bring the perfect blend of handcrafted coffee and artisan pastries
            to your special events. From intimate gatherings to grand
            celebrations, we create unforgettable experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="#packages"
              className="px-8 py-4 bg-rust hover:bg-rust/90 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              View Packages
            </Link>
            <Link
              href="#menu"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/30 transition-all hover:border-white/50"
            >
              Explore Menu
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/80" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 to-transparent z-10"></div>
    </section>
  );
}
