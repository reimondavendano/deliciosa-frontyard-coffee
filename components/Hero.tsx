'use client';

import { ChevronDown, ArrowRight, Coffee } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax-like feel */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(../assets/1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Glassmorphism Card for Content */}
          <div className="relative bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-2xl animate-fade-in-up border border-white/10 overflow-hidden group">
            {/* Decorative Coffee Watermark */}
            <div className="absolute -top-12 -right-12 text-white/5 transform rotate-12 pointer-events-none">
              <Coffee className="w-64 h-64" />
            </div>
            <div className="absolute -bottom-12 -left-12 text-white/5 transform -rotate-12 pointer-events-none">
              <Coffee className="w-48 h-48" />
            </div>

            {/* Inner Border Frame */}
            <div className="absolute inset-4 border border-white/10 rounded-2xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-rust/20 border border-rust/40 text-rust-light text-sm font-medium tracking-widest uppercase mb-8 backdrop-blur-sm">
                <Coffee className="w-4 h-4" />
                <span>Est. 2024</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
                Deliciosa
                <span className="block text-2xl sm:text-3xl md:text-4xl font-light italic text-rustic-blue mt-4 font-sans">
                  Frontyard Café
                </span>
              </h1>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-4 mb-8 opacity-50">
                <div className="h-px w-12 bg-warm-cream"></div>
                <div className="w-2 h-2 rounded-full bg-warm-cream"></div>
                <div className="h-px w-12 bg-warm-cream"></div>
              </div>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-10 font-light">
                Delight your guest with quality coffee or pastry.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="#contact"
                  className="group px-8 py-4 bg-rust hover:bg-rust-dark text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-rust/50 hover:-translate-y-1 flex items-center gap-2"
                >
                  Book Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#menu"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 transition-all hover:border-white/40"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <ChevronDown className="h-8 w-8 text-white/70" />
      </div>
    </section>
  );
}
