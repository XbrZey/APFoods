// components/menuepage/MainMenue.tsx
import React from 'react';
import { Star, ShoppingBag } from 'lucide-react';

const CATEGORIES = ['All Dishesh', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Drinks'];

const MENU_ITEMS = [
  { id: 1, name: 'Gourmet Beef Burger', category: 'Lunch', price: '$15.00', rating: '4.9', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Crispy Caesar Salad', category: 'Lunch', price: '$12.00', rating: '4.7', img: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Truffle Mushroom Pasta', category: 'Dinner', price: '$22.00', rating: '5.0', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Fluffy Berry Pancakes', category: 'Breakfast', price: '$10.50', rating: '4.8', img: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Classic Margherita Pizza', category: 'Dinner', price: '$18.00', rating: '4.9', img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Matcha Lava Cake', category: 'Desserts', price: '$8.50', rating: '5.0', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=80' },
];

export default function MainMenue() {
  return (
    <main className="w-full max-w-7xl mx-auto px-6 py-12 space-y-12">
      
      {/* Title Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
          Our Special <span className="text-orange-500">Menu</span>
        </h1>
        <p className="text-neutral-500 text-sm sm:text-base">
          Fresh ingredients, exquisite flavors, curated masterfully by our exceptional chefs.
        </p>
      </div>

      {/* Category Pills Slider/Container */}
      <div className="flex flex-wrap justify-center items-center gap-3 pt-4">
        {CATEGORIES.map((cat, idx) => (
          <button 
            key={cat} 
            className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border ${
              idx === 0 
                ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/10' 
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-orange-200 hover:text-orange-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
        {MENU_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
          >
            {/* Food Image Frame */}
            <div className="w-full h-56 relative overflow-hidden bg-neutral-100">
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-neutral-800 shadow-sm">
                <Star size={12} fill="#f97316" color="#f97316" />
                <span>{item.rating}</span>
              </div>
              <span className="absolute bottom-4 right-4 bg-neutral-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                {item.category}
              </span>
            </div>

            {/* Description / Content Body */}
            <div className="p-6 flex flex-col flex-grow space-y-4">
              <h3 className="font-extrabold text-neutral-800 text-lg tracking-tight group-hover:text-orange-500 transition-colors line-clamp-1">
                {item.name}
              </h3>
              
              <div className="flex items-center justify-between pt-2 mt-auto">
                <span className="text-xl font-black text-neutral-900">{item.price}</span>
                <button 
                  className="bg-orange-500 text-white p-2.5 rounded-xl shadow-md shadow-orange-500/10 hover:bg-orange-600 transition-colors"
                  aria-label="Add to cart"
                >
                  <ShoppingBag size={16} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </main>
  );
}