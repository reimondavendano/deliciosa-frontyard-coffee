'use client';

import { useEffect, useState } from 'react';
import { supabase, WeeklyInspiration } from '@/lib/supabase';
import { Sparkles, Quote } from 'lucide-react';

export default function WeeklyInspirations() {
    const [inspiration, setInspiration] = useState<WeeklyInspiration | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInspiration();
    }, []);

    const fetchInspiration = async () => {
        try {
            // Get the most recent active inspiration
            const { data, error } = await supabase
                .from('weekly_inspirations')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setInspiration(data);
        } catch (error) {
            console.error('Error fetching inspiration:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !inspiration) return null;

    return (
        <section className="py-20 bg-gradient-to-br from-rustic-blue via-rustic-blue-dark to-rustic-blue relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white rounded-full"></div>
            </div>

            {/* Background Image if available */}
            {inspiration.image && (
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `url(${inspiration.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Title Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-8">
                        <Sparkles className="w-5 h-5 text-warm-cream" />
                        <span className="text-warm-cream font-semibold tracking-wide">
                            {inspiration.title || 'Deli-verse Wednesday'}
                        </span>
                        <Sparkles className="w-5 h-5 text-warm-cream" />
                    </div>

                    {/* Quote */}
                    <div className="relative">
                        <Quote className="w-12 h-12 text-white/20 absolute -top-6 -left-4" />
                        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-relaxed mb-8 italic">
                            "{inspiration.quote}"
                        </blockquote>
                        <Quote className="w-12 h-12 text-white/20 absolute -bottom-6 -right-4 rotate-180" />
                    </div>

                    {/* Reference */}
                    {inspiration.reference && (
                        <p className="text-warm-cream text-lg sm:text-xl font-medium">
                            — {inspiration.reference}
                        </p>
                    )}

                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-3 mt-10">
                        <div className="h-px w-16 bg-white/30"></div>
                        <div className="w-2 h-2 bg-warm-cream rounded-full"></div>
                        <div className="h-px w-16 bg-white/30"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
