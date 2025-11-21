'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Offer from '@/components/Offer';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Packages from '@/components/Packages';
import Information from '@/components/Information';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-stone-50">
      <Header />
      <Hero />
      <Offer />
      <Menu />
      <Gallery />
      <Packages />
      <Information />
      <Footer />
    </main>
  );
}
