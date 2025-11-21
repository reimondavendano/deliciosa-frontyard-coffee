'use client';

import { Coffee, Heart, Facebook, Instagram, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-rustic-blue-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-8 w-8 text-rust" />
              <span className="font-serif text-3xl font-bold">Deliciosa</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Creating memorable moments with handcrafted coffee and artisan pastries.
              Perfect for weddings, corporate events, and special celebrations.
            </p>
            <div className="flex gap-4">
              <a
                href="https://web.facebook.com/Deliciosaphilippines"
                className="w-10 h-10 bg-white/10 hover:bg-rust rounded-full flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/deliciosaphilippines?fbclid=IwY2xjawONmKNleHRuA2FlbQIxMABicmlkETFrc3F6WDg0NUN0RDJsRWFuc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHi3PG5LC3xz7y82jqOVyk8l5HZ_fwMss8qnyaUvCVx23OqXalJmXaFby304o_aem_ce5RVuJ4OItW2wxdoq-dfw"
                className="w-10 h-10 bg-white/10 hover:bg-rust rounded-full flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:deliciosafoodproducts@gmail.com"
                className="w-10 h-10 bg-white/10 hover:bg-rust rounded-full flex items-center justify-center transition-all"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#home" className="text-gray-300 hover:text-rust transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#menu" className="text-gray-300 hover:text-rust transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="text-gray-300 hover:text-rust transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="#packages" className="text-gray-300 hover:text-rust transition-colors">
                  Packages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Coffee Cart Rental</li>
              <li>Pastry Cart Rental</li>
              <li>Corporate Events</li>
              <li>Wedding Services</li>
              <li>Private Parties</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-sm">
              © {currentYear} Deliciosa. All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-300">
              Made with <Heart className="h-4 w-4 text-rust fill-rust" /> for coffee lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
