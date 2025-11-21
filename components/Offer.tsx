'use client';

import { Calendar, Coffee, Cake, UserCheck, Star } from 'lucide-react';

export default function Offer() {
    const offers = [
        {
            title: 'We Cater To',
            icon: Calendar,
            description: 'Making every occasion memorable',
            items: [
                'Birthday Celebrations',
                'Wedding Receptions',
                'Corporate Events',
                'Special Gatherings',
            ],
        },
        {
            title: 'Beverage Selection',
            icon: Coffee,
            description: 'Handcrafted with premium beans',
            items: [
                '12oz Iced Drinks',
                '8oz Hot Drinks',
                '4-8 Signature Flavors',
                'Coffee & Non-Coffee Options',
            ],
        },
        {
            title: 'Pastries & Sweets',
            icon: Cake,
            description: 'Freshly baked daily',
            items: [
                '6 Varieties of Pastries',
                'Cookies & Cakes',
                'Croffles & Cinnamon Rolls',
                'Premium Snacks',
            ],
        },
        {
            title: 'Premium Service',
            icon: UserCheck,
            description: 'Professional coffee cart experience',
            items: [
                'Elegant Cart Setup',
                'Well-Trained Baristas',
                '3-4 Hours Service',
                'Interactive Experience',
            ],
        },
    ];

    return (
        <section id="offer" className="py-24 bg-stone-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-rustic-blue/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-rust/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-rust font-bold tracking-wider uppercase text-sm mb-2 block">Why Choose Us</span>
                    <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-rustic-blue-dark mb-6">
                        What We Offer
                    </h2>
                    <div className="w-24 h-1 bg-rust mx-auto mb-8 rounded-full"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Elevate your event with our premium mobile coffee and pastry service, designed to create unforgettable moments for you and your guests.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {offers.map((offer, index) => {
                        const Icon = offer.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-stone-100 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-rustic-blue/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white border-2 border-rustic-blue/10 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:border-rustic-blue/30 transition-colors">
                                        <Icon className="h-7 w-7 text-rustic-blue group-hover:text-rust transition-colors duration-300" />
                                    </div>

                                    <h3 className="font-serif text-xl font-bold text-rustic-blue-dark mb-2">
                                        {offer.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 mb-6 italic">
                                        {offer.description}
                                    </p>

                                    <ul className="space-y-3">
                                        {offer.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
                                                <Star className="h-4 w-4 text-rust shrink-0 mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
