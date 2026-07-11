"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, Search, ShoppingBag, Heart } from 'lucide-react';

export default function MainMenue() {
  const pathname = usePathname();

  // Helper function to check if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4">
      <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-lg shadow-neutral-100/20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-orange-500 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
            <UtensilsCrossed size={18} />
          </div>
          <span className="text-xl font-black text-neutral-800 tracking-tight">
            Foodie
          </span>
        </Link>

        {/* Dynamic Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link 
            href="/" 
            className={`transition-colors relative pb-1 ${isActive('/') ? 'text-orange-500 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-orange-500' : 'hover:text-orange-500'}`}
          >
            Home
          </Link>
          <Link 
            href="/menue" 
            className={`transition-colors relative pb-1 ${isActive('/menue') ? 'text-orange-500 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-orange-500' : 'hover:text-orange-500'}`}
          >
            Menu
          </Link>
          <Link 
            href="/reserve" 
            className={`transition-colors relative pb-1 ${isActive('/reserve') ? 'text-orange-500 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-orange-500' : 'hover:text-orange-500'}`}
          >
            Reservation
          </Link>
          <Link 
            href="/contact" 
            className={`transition-colors relative pb-1 ${isActive('/contact') ? 'text-orange-500 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-orange-500' : 'hover:text-orange-500'}`}
          >
            Contact
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-neutral-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-white/50" aria-label="Search">
            <Search size={18} />
          </button>
          <button className="p-2 text-neutral-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-white/50" aria-label="Favorites">
            <Heart size={18} />
          </button>
          <button className="p-2 text-neutral-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-white/50 relative" aria-label="Cart">
            <ShoppingBag size={18} />
          </button>
          <button className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-neutral-800 transition-all ml-2">
            Log In
          </button>
        </div>
      </nav>
    </header>
  );
}