import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, Quote, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
    params: { id: string };
};

// 1. Generate Metadata for Facebook (The Image & Title)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { data: inspiration } = await supabase
        .from('weekly_inspirations')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!inspiration) {
        return {
            title: 'Weekly Inspiration - Deliciosa',
        };
    }

    // Determine the base URL
    // In production, we need the deployment URL. In dev, localhost.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deliciosa-frontyard-coffee.vercel.app';

    const ogImageUrl = `${baseUrl}/api/og?id=${inspiration.id}`;

    return {
        title: inspiration.title || 'Deli-verse Wednesday',
        description: `"${inspiration.quote}" — ${inspiration.reference || 'Deliciosa Frontyard Café'}`,
        openGraph: {
            title: inspiration.title || 'Deli-verse Wednesday',
            description: `"${inspiration.quote}"`,
            images: [
                {
                    url: ogImageUrl, // Priority 1: Beautiful Text Card
                    width: 1200,
                    height: 1200,
                    alt: inspiration.title || 'Inspiration Card',
                },
                ...(inspiration.image ? [{ // Priority 2: Raw Photo (Backup)
                    url: inspiration.image,
                    width: 1200,
                    height: 630,
                    alt: 'Inspiration Background',
                }] : [])
            ],
            type: 'article',
        },
    };
}

// 2. The Page UI (What people see if they click the link)
export default async function InspirationPage({ params }: Props) {
    const { data: inspiration } = await supabase
        .from('weekly_inspirations')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!inspiration) return <div className="p-10 text-center">Inspiration not found</div>;

    return (
        <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <Link href="/" className="inline-flex items-center gap-2 text-rustic-blue hover:underline mb-6 font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* The Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                    <div className="bg-gradient-to-br from-rustic-blue via-rustic-blue-dark to-rustic-blue p-8 md:p-12 text-white relative min-h-[400px] flex flex-col justify-center text-center">
                        {/* Background Image */}
                        {inspiration.image && (
                            <div
                                className="absolute inset-0 z-0 opacity-40"
                                style={{
                                    backgroundImage: `url(${inspiration.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 z-0"></div>

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-2 rounded-full backdrop-blur-md border border-white/20 mb-8">
                                <Sparkles className="w-5 h-5 text-warm-cream" />
                                <span className="text-warm-cream font-bold tracking-widest uppercase text-sm">
                                    {inspiration.title || 'Deli-verse Wednesday'}
                                </span>
                            </div>

                            <blockquote className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-tight italic drop-shadow-lg mb-8">
                                "{inspiration.quote}"
                            </blockquote>

                            {inspiration.reference && (
                                <div className="relative inline-block">
                                    <div className="w-12 h-1 bg-warm-cream mx-auto mb-4 rounded-full"></div>
                                    <p className="text-xl md:text-2xl font-semibold tracking-wide text-warm-cream">
                                        {inspiration.reference}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer Branding */}
                        <div className="absolute bottom-6 left-0 right-0 text-white/50 text-xs font-light tracking-widest uppercase">
                            Deliciosa Frontyard Café
                        </div>
                    </div>

                    <div className="p-8 bg-white text-center">
                        <p className="text-gray-600 mb-6">Explore more delights at our café!</p>
                        <Link
                            href="/"
                            className="inline-block px-8 py-3 bg-rustic-blue text-white font-semibold rounded-full hover:bg-rustic-blue-dark transition-all shadow-lg hover:-translate-y-1"
                        >
                            Visit Website
                        </Link>
                    </div>

                </div>
            </div>
        </main>
    );
}
