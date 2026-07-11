"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Star, ShoppingBag, Sparkles, Search, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = ['All Dishes', 'Momo', 'Main Course', 'Appetizers', 'Desserts', 'Beverages'];

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: string;
  img: string;
  tags: string[];
};

const MENU_ITEMS: MenuItem[] = [
  
  { id: 1, name: 'Steam Jhol Buff Momo', category: 'Momo', price: 'Rs. 280', rating: '5.0', img: '/images/menu/momo-jhol.jpg', tags: ['dumplings', 'jhol', 'buff', 'soup'] },
  { id: 2, name: 'Crunchy Kothey Chicken Momo', category: 'Momo', price: 'Rs. 320', rating: '4.9', img: '/images/menu/momo-kothey.jpg', tags: ['fried', 'chicken', 'dumplings', 'kothey'] },
  { id: 3, name: 'Vegetable Steam Momo', category: 'Momo', price: 'Rs. 250', rating: '4.7', img: '/images/menu/momo-veg.jpg', tags: ['veg', 'steamed', 'dumplings', 'healthy'] },

  
  { id: 4, name: 'Premium Thakali Khana Set', category: 'Main Course', price: 'Rs. 650', rating: '4.9', img: '/images/menu/thakali-set.jpg', tags: ['thali', 'dal bhat', 'rice', 'tarkari', 'nepali'] },
  { id: 5, name: 'Traditional Newari Samay Baji', category: 'Main Course', price: 'Rs. 550', rating: '4.8', img: '/images/menu/samay-baji.jpg', tags: ['newari', 'khaja', 'set', 'spicy'] },
  { id: 6, name: 'Chicken Chowmein', category: 'Main Course', price: 'Rs. 300', rating: '4.6', img: '/images/menu/chowmein.jpg', tags: ['noodles', 'stir fry', 'chicken', 'chinese'] },
  { id: 7, name: 'Mutton Curry with Rice', category: 'Main Course', price: 'Rs. 480', rating: '4.7', img: '/images/menu/mutton-rice.jpg', tags: ['curry', 'meat', 'gravy', 'lunch'] },

  
  { id: 8, name: 'Spicy Sukuti Sadheko', category: 'Appetizers', price: 'Rs. 350', rating: '4.8', img: '/images/menu/sukuti.jpg', tags: ['meat', 'dried', 'jerky', 'chilly', 'hot'] },
  { id: 9, name: 'Crispy Aloo Nimki Platter', category: 'Appetizers', price: 'Rs. 220', rating: '4.6', img: '/images/menu/aloo-nimki.jpg', tags: ['potato', 'snack', 'crispy', 'aloo'] },
  { id: 10, name: 'Chicken Pakoda', category: 'Appetizers', price: 'Rs. 260', rating: '4.7', img: '/images/menu/pakoda.jpg', tags: ['fritters', 'fried', 'chicken', 'crunchy'] },

  
  { id: 11, name: 'Newari Yomari (Chaku/Khoya)', category: 'Desserts', price: 'Rs. 180', rating: '4.7', img: '/images/menu/yomari.jpg', tags: ['sweet', 'rice flour', 'chaku', 'festival'] },
  { id: 12, name: 'Sweet Lalmohan with Ice Cream', category: 'Desserts', price: 'Rs. 240', rating: '4.9', img: '/images/menu/lalmohan.jpg', tags: ['gulab jamun', 'dessert', 'vanilla'] },
  { id: 13, name: 'Sel Roti Combo', category: 'Desserts', price: 'Rs. 150', rating: '4.5', img: '/images/menu/sel-roti.jpg', tags: ['donut', 'rice', 'sweet', 'fried'] },

  
  { id: 14, name: 'Himalayan Spiced Milk Tea', category: 'Beverages', price: 'Rs. 120', rating: '5.0', img: '/images/menu/chiya.jpg', tags: ['chai', 'tea', 'masala', 'hot'] },
  { id: 15, name: 'Sweet Mango Lassi', category: 'Beverages', price: 'Rs. 180', rating: '4.9', img: '/images/menu/lassi.jpg', tags: ['yogurt', 'shake', 'drink', 'mango'] },
  { id: 16, name: 'Black Filter Coffee', category: 'Beverages', price: 'Rs. 140', rating: '4.6', img: '/images/menu/coffee.jpg', tags: ['caffeine', 'hot', 'espresso'] },
];

function MenuCard({ item }: { item: MenuItem }) {
  const cardRef = useRef<HTMLDivElement>(null);

  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(cardRef.current, {
      rotateX: -y * 0.08,
      rotateY: x * 0.08,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="menu-card bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-2xl transition-shadow group flex flex-col h-full will-change-transform"
    >
      <div className="w-full h-52 relative overflow-hidden bg-neutral-100">
        <img
          src={item.img}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-neutral-800 shadow-sm">
          <Star size={12} fill="#f97316" color="#f97316" />
          <span>{item.rating}</span>
        </div>
        <span className="absolute bottom-4 right-4 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-lg uppercase">
          {item.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <h3 className="font-extrabold text-neutral-800 text-base md:text-lg tracking-tight group-hover:text-orange-500 transition-colors line-clamp-2">
          {item.name}
        </h3>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-black text-neutral-900">{item.price}</span>
          <button
            type="button"
            className="bg-orange-500 text-white p-2.5 rounded-xl shadow-md shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all"
            aria-label={`Add ${item.name} to order`}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MainMenu() {
  const [activeCategory, setActiveCategory] = useState('All Dishes');
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);


  const filteredItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'All Dishes' || item.category === activeCategory;
      const matchesName = item.name.toLowerCase().includes(cleanQuery);
      const matchesTags = item.tags.some(tag => tag.includes(cleanQuery));
      return matchesCategory && (matchesName || matchesTags);
    });
  }, [activeCategory, query]);

  useGSAP(() => {
    
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });
    tl.from('.menu-header-item', { y: 30, opacity: 0, stagger: 0.15 })
      .from('.menu-filter-pill', { scale: 0.9, opacity: 0, stagger: 0.04, ease: 'back.out(1.5)' }, '-=0.6');

    
    gsap.from('.menu-card', {
      scrollTrigger: {
        trigger: '.menu-grid-container',
        start: 'top 85%',
      },
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="w-full max-w-7xl mx-auto px-6 py-12 space-y-12 select-none">
      
      
      <div className="text-center max-w-xl mx-auto space-y-4">
        <span className="menu-header-item text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Sparkles size={12} /> Authentic Himalayan Flavors
        </span>
        <h1 className="menu-header-item text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-[1.15]">
          Our Special <span className="text-orange-500">Menu</span>
        </h1>
        <p className="menu-header-item text-neutral-500 text-sm sm:text-base leading-relaxed">
          Handcrafted locally with fresh organic ingredients, traditional spices, and timeless Himalayan recipes.
        </p>
      </div>

    
      <div className="menu-header-item max-w-md mx-auto relative group">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items, tags, ingredients..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-neutral-200 text-sm text-neutral-800 bg-neutral-50/50 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all shadow-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      
      <div className="flex flex-wrap justify-center items-center gap-2.5 max-w-3xl mx-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`menu-filter-pill px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${
              activeCategory === cat
                ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-orange-300 hover:text-orange-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      
      <div className="menu-grid-container min-h-[400px] pt-4">
        {filteredItems.length > 0 ? (
          <div key={`${activeCategory}-${query}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="text-4xl">🍽️</div>
            <p className="text-neutral-400 text-sm font-medium max-w-xs">
              No matching treats found for "{query}". Try checking your spelling or selecting another category!
            </p>
          </div>
        )}
      </div>

    </main>
  );
}