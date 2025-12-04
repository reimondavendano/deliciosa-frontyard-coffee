'use client';

import { ChevronDown, ArrowRight, Coffee } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Hero() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [scrollY, setScrollY] = useState(0);

    const images = [
        '/assets/carousel/1.png',
        '/assets/carousel/2.png',
        '/assets/carousel/3.png',
        '/assets/carousel/4.jpg',
        '/assets/carousel/5.jpg',
        '/assets/carousel/6.jpg',
    ];

    // Auto-rotate images every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    // Parallax scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Images with Parallax */}
            {images.map((image, index) => (
                <div
                    key={image}
                    className="absolute inset-0 z-0 transition-opacity duration-1000"
                    style={{
                        opacity: currentImageIndex === index ? 1 : 0,
                        transform: `translateY(${scrollY * 0.5}px)`,
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Darker overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
                </div>
            ))}

            <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Content Container - No Background Card */}
                    <div className="relative p-4 md:p-8 lg:p-12 text-center animate-fade-in-up group">

                        <div className="relative z-10">
                            <div className="flex justify-center mb-8">
                                <div className="relative w-20 h-20 md:w-24 md:h-24">
                                    <Image
                                        src="/assets/deliciosa_log_only.png"
                                        alt="Deliciosa Logo"
                                        width={180}
                                        height={10}
                                        className="object-contain drop-shadow-lg"
                                        style={{ height: '10rem' }}
                                        priority
                                    />
                                </div>
                            </div>

                            <h1 className="font-montserrat text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black tracking-tight mb-6 drop-shadow-2xl uppercase bg-gradient-to-r from-[#DBEAFE] via-[#BFDBFE] to-[#93C5FD] bg-clip-text text-transparent">
                                Deliciosa
                                <span className="block text-2xl sm:text-3xl md:text-4xl font-light italic text-rustic-blue-light mt-4 font-sans text-white/90 normal-case">
                                    Frontyard Café
                                </span>
                            </h1>

                            {/* Decorative Divider */}
                            <div className="flex items-center justify-center gap-4 mb-8 opacity-70">
                                <div className="h-px w-12 bg-white"></div>
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                <div className="h-px w-12 bg-white"></div>
                            </div>

                            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed mb-10 font-light drop-shadow-md">
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
                                    className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 transition-all hover:border-white/50"
                                >
                                    View Menu
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
                <ChevronDown className="h-8 w-8 text-white/70" />
            </div>
        </section>
    );
}
