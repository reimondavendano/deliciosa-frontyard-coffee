'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Offer from '@/components/Offer';
import WeeklyInspirations from '@/components/WeeklyInspirations';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Packages from '@/components/Packages';
import Information from '@/components/Information';
import Footer from '@/components/Footer';
import PreloadModal from '@/components/PreloadModal';

export default function Home() {
  return (
    <main className="bg-stone-50">
      <Header />
      <Hero />
      <Offer />
      <WeeklyInspirations />
      <Menu />
      <Gallery />
      <Packages />
      <Information />
      <Footer />
      <PreloadModal />
    </main>
  );
}
