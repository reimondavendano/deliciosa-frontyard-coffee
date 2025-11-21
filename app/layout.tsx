import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Lato, Poppins } from 'next/font/google';


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // pick the weights you need
  variable: "--font-poppins",           // optional: CSS variable
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Deliciosa Frontyard Café',
  description: 'Experience handcrafted coffee and artisan pastries at your special events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${lato.variable} font-sans`}>{children}</body>
    </html>
  );
}
