"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, ShoppingBag, ShieldAlert, LogOut, Menu, X } from 'lucide-react';

export default function NavMain() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
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
    <header className="sticky top-0 z-50 w-full px-4 md:px-6 py-4">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-lg shadow-[#EBE0E0]/40">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <div className="bg-red-800 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
            <UtensilsCrossed size={18} />
          </div>
          <span className="text-xl font-black text-neutral-800 tracking-tight">
            Mint & Moss
          </span>
        </Link>

        {/* Desktop Navigation Link View (PC/Tablet Landscape) */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link href="/" className={`transition-colors relative pb-1 ${isActive('/') ? 'text-red-800 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-red-800' : 'hover:text-green-700'}`}>Home</Link>
          <Link href="/menue" className={`transition-colors relative pb-1 ${isActive('/menue') ? 'text-red-800 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-red-800' : 'hover:text-green-700'}`}>Menu</Link>
          <Link href="/reserve" className={`transition-colors relative pb-1 ${isActive('/reserve') ? 'text-red-800 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-red-800' : 'hover:text-green-700'}`}>Reservation</Link>
          <Link href="/contact" className={`transition-colors relative pb-1 ${isActive('/contact') ? 'text-red-800 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-red-800' : 'hover:text-green-700'}`}>Contact</Link>
          
          {/* Conditional Admin Portal Nav Link */}
          {isAdmin && (
            <Link href="/admin" className={`transition-colors text-amber-600 font-bold flex items-center gap-1.5 relative pb-1 ${isActive('/admin') ? 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-amber-600' : 'hover:text-amber-700'}`}>
              <ShieldAlert size={14}/> Console
            </Link>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center gap-1 sm:gap-3 z-50">
          <button className="p-2 text-neutral-600 hover:text-green-700 transition-colors rounded-lg hover:bg-white/50 relative" aria-label="Cart"><ShoppingBag size={18} /></button>
          
          {/* Auth Button Hidden on small mobiles to maintain clean layout space */}
          <div className="hidden sm:block">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-red-800 transition-all ml-1 flex items-center gap-1">
                <LogOut size={12}/> Logout
              </button>
            ) : (
              <Link href="/sign" className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-neutral-800 transition-all ml-1 inline-block">
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger Menu Toggle Button for Mobile/Tablet */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 lg:hidden text-neutral-600 hover:text-green-700 transition-colors rounded-lg hover:bg-white/50"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile & Tablet Drawer Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4 md:mx-6 p-6 bg-white/95 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl flex flex-col gap-4 text-base font-medium text-neutral-600 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <Link href="/" className={`transition-colors py-2 border-b border-[#EBE0E0] ${isActive('/') ? 'text-red-800 font-semibold' : 'hover:text-green-700'}`}>Home</Link>
            <Link href="/menue" className={`transition-colors py-2 border-b border-[#EBE0E0] ${isActive('/menue') ? 'text-red-800 font-semibold' : 'hover:text-green-700'}`}>Menu</Link>
            <Link href="/reserve" className={`transition-colors py-2 border-b border-[#EBE0E0] ${isActive('/reserve') ? 'text-red-800 font-semibold' : 'hover:text-green-700'}`}>Reservation</Link>
            <Link href="/contact" className={`transition-colors py-2 ${isActive('/contact') ? 'text-red-800 font-semibold' : 'hover:text-green-700'}`}>Contact</Link>
            
            {isAdmin && (
              <Link href="/admin" className={`transition-colors text-amber-600 font-bold flex items-center gap-1.5 py-2 border-t border-[#EBE0E0] ${isActive('/admin') ? 'text-amber-700' : 'hover:text-amber-700'}`}>
                <ShieldAlert size={16}/> Console
              </Link>
            )}

            {/* Auth Button Fallback inside mobile container for small screen widths */}
            <div className="sm:hidden pt-2 border-t border-[#EBE0E0]">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full justify-center bg-neutral-900 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-sm hover:bg-red-800 transition-all flex items-center gap-2">
                  <LogOut size={14}/> Logout
                </button>
              ) : (
                <Link href="/sign" className="w-full text-center bg-neutral-900 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-sm hover:bg-neutral-800 transition-all block">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}