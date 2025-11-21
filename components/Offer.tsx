'use client';

import { Calendar, Coffee, Cake, UserCheck } from 'lucide-react';

export default function Offer() {
    const offers = [
        {
            title: 'We cater',
            icon: Calendar,
            items: [
                'Birthday',
                'Wedding',
                'Corporate Event',
                'Any other special gatherings',
            ],
        },
        {
            title: 'Coffee and Non-coffee',
            icon: Coffee,
            items: [
                '12 oz cold drinks',
                '8 oz hot drinks',
                '(4-8 flavors)',
            ],
        },
        {
            title: 'Pastries and Cakes',
            icon: Cake,
            items: [
                '(6 variety)',
                'Cookies, cakes, croffles',
                'Cinnamon rolls and snacks',
            ],
        },
        {
            title: 'Cart and Service',
            icon: UserCheck,
            items: [
                'Cart and well-trained staff',
                'Impress your guests with a coffee cart experience',
                '3-4 hours of service',
            ],
        },
    ];

    return (
        <section id="offer" className="py-20 bg-stone-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-rustic-blue-dark mb-4">
                        What we offer
                    </h2>
                    <div className="w-24 h-1 bg-rust mx-auto mb-6"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {offers.map((offer, index) => {
                        const Icon = offer.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-stone-100"
                            >
                                <div className="w-12 h-12 bg-rustic-blue/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <Icon className="h-6 w-6 text-rustic-blue" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-rustic-blue-dark mb-4 text-center">
                                    {offer.title}
                                </h3>
                                <ul className="space-y-3 text-center">
                                    {offer.items.map((item, idx) => (
                                        <li key={idx} className="text-gray-600">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
