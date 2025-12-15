import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return new ImageResponse(<>ID Missing</>, { width: 1200, height: 630 });
        }

        // Fetch the inspiration data
        const { data: inspiration } = await supabase
            .from('weekly_inspirations')
            .select('*')
            .eq('id', id)
            .single();

        if (!inspiration) {
            return new ImageResponse(<>Not Found</>, { width: 1200, height: 630 });
        }

        const { title, quote, reference, image } = inspiration;

        // Load a font with fallback
        let fontData;
        try {
            const fontResponse = await fetch(new URL('https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2', import.meta.url));
            if (fontResponse.ok) {
                fontData = await fontResponse.arrayBuffer();
            }
        } catch (e) {
            console.error('Font load failed', e);
        }

        const imageOptions: any = {
            width: 1200,
            height: 1200,
        };

        if (fontData) {
            imageOptions.fonts = [{
                name: 'Playfair Display',
                data: fontData,
                style: 'italic',
            }];
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1E3A8A',
                        backgroundImage: 'linear-gradient(to bottom right, #1E3A8A, #172554, #1E3A8A)',
                        position: 'relative',
                        overflow: 'hidden',
                        fontFamily: fontData ? '"Playfair Display"' : 'serif',
                    }}
                >
                    {/* Background Image Overlay */}
                    {image && (
                        <img
                            src={image}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: 0.3,
                            }}
                        />
                    )}

                    {/* Content Container */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            zIndex: 10,
                            padding: '40px',
                            maxWidth: '80%',
                            color: 'white',
                        }}
                    >
                        {/* Header Badge */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                padding: '10px 24px',
                                borderRadius: '50px',
                                marginBottom: '40px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            {/* Sparkle Icon (SVG) */}
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FDF6E3"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginRight: '10px' }}
                            >
                                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                            </svg>
                            <span
                                style={{
                                    color: '#FDF6E3',
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {title || 'Deli-verse Wednesday'}
                            </span>
                        </div>

                        {/* Quote */}
                        <div
                            style={{
                                fontSize: '60px',
                                fontFamily: fontData ? '"Playfair Display"' : 'serif',
                                fontStyle: 'italic',
                                lineHeight: 1.2,
                                marginBottom: '40px',
                                textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            }}
                        >
                            "{quote}"
                        </div>

                        {/* Reference */}
                        {reference && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div
                                    style={{
                                        width: '60px',
                                        height: '4px',
                                        backgroundColor: '#FDF6E3',
                                        borderRadius: '2px',
                                        marginBottom: '20px',
                                    }}
                                />
                                <div
                                    style={{
                                        fontSize: '28px',
                                        fontWeight: 600,
                                        color: '#FDF6E3',
                                    }}
                                >
                                    {reference}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Branding */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '16px',
                            fontWeight: 300,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Deliciosa Frontyard Café
                    </div>
                </div>
            ),
            imageOptions
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new ImageResponse(<>Failed to generate image</>, { width: 1200, height: 630 });
    }
}
