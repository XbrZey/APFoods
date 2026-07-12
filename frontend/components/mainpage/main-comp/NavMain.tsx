"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, Search, ShoppingBag, Heart, ShieldAlert, LogOut } from 'lucide-react';

export default function NavMain() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        // Safe Client-side Base64 decoding of the JWT payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        if (payload.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Failed parsing session token payload.", e);
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = '/';
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4">
      <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-lg shadow-neutral-100/20">
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-orange-500 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
            <UtensilsCrossed size={18} />
          </div>
          <span className="text-xl font-black text-neutral-800 tracking-tight">
            APFoods
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link href="/" className={`transition-colors relative pb-1 ${isActive('/') ? 'text-orange-500 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-orange-500' : 'hover:text-orange-500'}`}>Home</Link>
          <Link href="/menue" className={`transition-colors relative pb-1 ${isActive('/menue') ? 'text-orange-500 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-orange-500' : 'hover:text-orange-500'}`}>Menu</Link>
          <Link href="/reserve" className={`transition-colors relative pb-1 ${isActive('/reserve') ? 'text-orange-500 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-orange-500' : 'hover:text-orange-500'}`}>Reservation</Link>
          <Link href="/contact" className={`transition-colors relative pb-1 ${isActive('/contact') ? 'text-orange-500 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-orange-500' : 'hover:text-orange-500'}`}>Contact</Link>
          
          {/* Conditional Admin Portal Nav Link */}
          {isAdmin && (
            <Link href="/admin" className={`transition-colors text-red-500 font-bold flex items-center gap-1.5 relative pb-1 ${isActive('/admin') ? 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-red-500' : 'hover:text-red-600'}`}>
              <ShieldAlert size={14}/> Console
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-neutral-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-white/50" aria-label="Search"><Search size={18} /></button>
          <button className="p-2 text-neutral-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-white/50" aria-label="Favorites"><Heart size={18} /></button>
          <button className="p-2 text-neutral-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-white/50 relative" aria-label="Cart"><ShoppingBag size={18} /></button>
          
          {isLoggedIn ? (
            <button onClick={handleLogout} className="bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-red-600 transition-all ml-2 flex items-center gap-1">
              <LogOut size={12}/> Logout
            </button>
          ) : (
            <Link href="/sign" className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-neutral-800 transition-all ml-2 inline-block">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}