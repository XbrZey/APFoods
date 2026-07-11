// components/mainpage/MainPage.tsx
import React from 'react';
import { Star, ArrowLeft, ArrowRight, Clock } from 'lucide-react';

const POPULAR_DISHES = [
  { id: 1, name: 'Chinese Noodles Pasta', price: '$20.00', rating: '5.0', reviewCount: '5.6k', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Vegetable Chowmein', price: '$20.00', rating: '4.9', reviewCount: '4.2k', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Pasta al Pomodoro', price: '$20.00', rating: '4.8', reviewCount: '3.8k', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Rice and Curry', price: '$20.00', rating: '5.0', reviewCount: '6.1k', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80' },
];

export default function MainPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-6 py-8 space-y-28">
      
     
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative pt-4">
        
        
        <div className="space-y-6 max-w-xl z-10">
          <span className="text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1.5 rounded-full inline-block">
            Welcome to Foodie
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[1.15]">
            Foodie Restaurant <br />
            and Enjoy <span className="text-orange-500 relative inline-block after:absolute after:bottom-1 after:left-0 after:w-full after:h-2 after:bg-orange-100 after:-z-10">The Food</span>
          </h1>
          <p className="text-neutral-500 leading-relaxed text-sm md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis ante ante, ut tempor neque bibendum non. Ut enim lacus, auctor nec convallis sed, vehicula ut eros.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-600/30 transition-all text-sm">
              Reserve a Table
            </button>
            <button className="border-2 border-neutral-200 text-neutral-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-neutral-50 transition-all text-sm">
              Online Order
            </button>
          </div>

          <div className="text-xs font-medium text-neutral-500 flex items-center gap-2 pt-2">
            <Clock size={14} className="text-orange-500" />
            <span>Open: 11:00am - 11:00pm</span>
          </div>
        </div>

      
        <div className="relative flex justify-center items-center">
          
          <div className="absolute w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] rounded-full border-2 border-dashed border-orange-200/60 animate-[spin_100s_linear_infinite]"></div>
          
          
          <div className="relative w-[290px] h-[290px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden shadow-2xl border-8 border-white bg-white">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80" 
              alt="Premium Salad Platter"
              className="w-full h-full object-cover object-center"
            />
            <span className="absolute top-6 right-6 bg-neutral-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wider uppercase">
              Best Seller ✨
            </span>
          </div>

          
          <div className="absolute bottom-2 -left-2 sm:left-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-neutral-100 max-w-[210px] flex items-center gap-3 transition-transform hover:-translate-y-1">
            <img 
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80" 
              alt="Salad thumbnail" 
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h4 className="text-xs font-bold text-neutral-800">Salman Salad</h4>
              <div className="flex gap-0.5 my-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#f97316" color="#f97316" />)}
              </div>
              <p className="text-xs font-black text-neutral-900">$12.00</p>
            </div>
          </div>
        </div>
      </section>

    
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
              Our Popular <span className="text-orange-500">Dishes</span>
            </h2>
          </div>
          
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-all">
              <ArrowLeft size={16} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md hover:bg-orange-600 transition-all">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_DISHES.map((dish) => (
            <div key={dish.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-neutral-100 text-center relative group flex flex-col items-center">
              
             
              <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg">
                <Star size={12} fill="#f97316" color="#f97316" />
                <span>{dish.rating} <span className="text-neutral-400 font-normal">({dish.reviewCount})</span></span>
              </div>

             
              <div className="w-36 h-36 rounded-full overflow-hidden my-6 border-4 border-neutral-50 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <img src={dish.img} alt={dish.name} className="w-full h-full object-cover" />
              </div>

              
              <h3 className="font-bold text-neutral-800 text-sm mb-1 line-clamp-1">{dish.name}</h3>
              <p className="text-orange-500 font-extrabold text-sm mt-auto pt-2">{dish.price}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}