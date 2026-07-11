"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Star, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
const POPULAR_DISHES = [
  { id: 1, name: 'Margherita Pizza', image: '/images/pizza.jpg', price: 'Rs.18.00', rating: '4.9', reviewCount: '7.2k' },
  { id: 2, name: 'Pasta al Pomodoro', image: '/images/pasta.jpg', price: 'Rs.20.00', rating: '4.8', reviewCount: '3.8k' },
  { id: 3, name: 'Butter Chicken Curry', image: '/images/butter-chicken.jpg', price: 'Rs.22.00', rating: '4.9', reviewCount: '5.1k' },
  { id: 4, name: 'Chicken Biryani', image: '/images/chicken-biryani.jpg', price: 'Rs.21.00', rating: '5.0', reviewCount: '6.1k' },
  { id: 5, name: 'Golden Fried Rice', image: '/images/rice.jpg', price: 'Rs.16.00', rating: '4.7', reviewCount: '2.9k' },
  { id: 6, name: 'Classic Burger', image: '/images/burger.jpg', price: 'Rs.17.00', rating: '4.8', reviewCount: '4.4k' },
];

export default function MainPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scrollDishes = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  useGSAP(() => {
  
    gsap.from('.hero-text > *', {
      x: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power4.out'
    });

    
    const heroTl = gsap.timeline({ defaults: { ease: 'elastic.out(1, 0.75)', duration: 1.2 } });
    heroTl.from('.hero-photo-wrapper', { scale: 0, rotation: -15, delay: 0.2 })
          .from('.hero-ring', { scale: 1.4, opacity: 0, duration: 1.5 }, '-=1')
          .from('.hero-badge', { scale: 0, rotation: 45 }, '-=0.8')
          .from('.hero-float-card', { y: 60, x: -30, opacity: 0 }, '-=0.8');

    
    gsap.to('.hero-float-card', {
      y: '+=10',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });


    gsap.from('.dishes-section-header', {
      scrollTrigger: {
        trigger: '.dishes-section-header',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.dish-card', {
      scrollTrigger: {
        trigger: '.dish-card-container',
        start: 'top 80%',
      },
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.7,
      stagger: 0.1,
      ease: 'back.out(1.2)'
    });

  }, { scope: containerRef });

  
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(card, {
      rotateX: -y * 0.15,
      rotateY: x * 0.15,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  return (
    <main ref={containerRef} className="w-full max-w-7xl mx-auto px-6 py-8 space-y-28 overflow-hidden">

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative pt-4">
        
        <div className="hero-text space-y-6 max-w-xl z-10">
          <span className="text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1.5 rounded-full inline-block">
            Welcome to Foodie
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-neutral-900 leading-[1.15]">
            APFoods Awesome &
            Delicious <span className="text-orange-500 relative inline-block after:absolute after:bottom-1 after:left-0 after:w-full after:h-2 after:bg-orange-100 after:-z-10">Food</span>
          </h1>
          <p className="text-neutral-500 leading-relaxed text-sm md:text-base">
            
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button type="button" className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-600/30 transition-all text-sm">
              Reserve a Table
            </button>
            <button type="button" className="border-2 border-neutral-200 text-neutral-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-neutral-50 transition-all text-sm">
              Contact Us
            </button>
          </div>

          <div className="text-xs font-medium text-neutral-500 flex items-center gap-2 pt-2">
            <Clock size={14} className="text-orange-500" />
            <span>Open: 11:00am - 11:00pm</span>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          {/* Animated background dotted circle */}
          <div className="hero-ring absolute w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] rounded-full border-2 border-dashed border-orange-200/60 animate-[spin_120s_linear_infinite]"></div>

          {/* Core Hero Photo Container */}
          <div className="hero-photo-wrapper relative w-[290px] h-[290px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden shadow-2xl border-8 border-white bg-neutral-100">
            <img
              src="/images/freshvegeta.jpg" 
              alt="Fresh vegetable salad bowl"
              className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
            />
          </div>

          {/* Floating Widget Card */}
          <div className="hero-float-card absolute bottom-2 -left-2 sm:left-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-neutral-100 max-w-[210px] flex items-center gap-3">
            <img
              src="/images/hero-salad.jpg" 
              alt="Fresh vegetable salad, close up"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h4 className="text-xs font-bold text-neutral-800">Garden Salad</h4>
              <div className="flex gap-0.5 my-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#f97316" color="#f97316" />)}
              </div>
              <p className="text-xs font-black text-neutral-900">NRP 240</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="space-y-8">
        <div className="dishes-section-header flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
              Our Popular <span className="text-orange-500">Dishes</span>
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Scroll dishes left"
              disabled={!canScrollLeft}
              onClick={() => scrollDishes(-1)}
              className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Scroll dishes right"
              disabled={!canScrollRight}
              onClick={() => scrollDishes(1)}
              className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md hover:bg-orange-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollerRef}
          className="dish-card-container flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {POPULAR_DISHES.map((dish) => (
            <div
              key={dish.id}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="dish-card snap-start shrink-0 w-[calc(50%-0.75rem)] sm:w-[220px] bg-white rounded-2xl p-4 shadow-sm hover:shadow-2xl transition-shadow border border-neutral-100 text-center relative group flex flex-col items-center will-change-transform"
            >
              <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg">
                <Star size={12} fill="#f97316" color="#f97316" />
                <span>{dish.rating} <span className="text-neutral-400 font-normal">({dish.reviewCount})</span></span>
              </div>

              <div className="w-36 h-36 rounded-full overflow-hidden my-6 border-4 border-neutral-50 shadow-inner group-hover:scale-105 transition-transform duration-300 bg-neutral-100">
                <img src={dish.image} alt={dish.name} loading="lazy" className="w-full h-full object-cover" />
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