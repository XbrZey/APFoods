"use client";

import React, { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CATEGORIES = ['All Dishes', 'Momo', 'Main Course', 'Appetizers', 'Desserts', 'Beverages'];

export default function MainMenu() {
  const [activeCategory, setActiveCategory] = useState('All Dishes');
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial entrance animations
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });
    tl.from('.menu-header-item', { y: 30, opacity: 0, stagger: 0.15 })
      .from('.menu-filter-pill', { scale: 0.9, opacity: 0, stagger: 0.04, ease: 'back.out(1.5)' }, '-=0.6')
      .from('.menu-banner-image', { y: 40, opacity: 0, duration: 0.8 }, '-=0.4')
      /* Added pop-out effect: Scales the inner menu card seamlessly from small to big */
      .from('.menu-card-pop', { 
        scale: 0.3, 
        opacity: 0, 
        duration: 1.2, 
        ease: 'back.out(1.2)' 
      }, '-=0.5');
  }, { scope: containerRef });

  // GSAP Interactive 3D Pop-out Hover Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the card
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(cardRef.current, {
      rotateX: -y * 0.05, // Subtle vertical tilt
      rotateY: x * 0.05,  // Subtle horizontal tilt
      scale: 1.04,        // Scale up to pop out on hover
      z: 50,              // Push out along the Z-axis
      transformPerspective: 1200,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    // Reset the card smoothly to its original position
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      z: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
  };

  return (
    <main 
      ref={containerRef} 
      className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-16 space-y-10 select-none relative overflow-hidden bg-[#EAF2EC] min-h-[140vh] md:min-h-[120vh] rounded-[3.5rem] border border-emerald-955/5 shadow-inner"
    >
      
      {/* Background ambient layout glows */}
      <div className="absolute top-[-10%] right-[-15%] w-[600px] h-[600px] rounded-full bg-emerald-800/5 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[700px] h-[700px] rounded-full bg-amber-700/5 blur-[150px] pointer-events-none -z-10" />
      
      <div className="text-center max-w-xl mx-auto space-y-4 relative z-10">
        <span className="menu-header-item text-green-800 font-bold tracking-wider text-xs uppercase bg-green-100/60 border border-green-200/40 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 backdrop-blur-sm">
          <Sparkles size={12} /> Authentic Himalayan Flavors
        </span>
        <h1 className="menu-header-item text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-[1.15]">
          Our Special <span className="text-green-800">Menu</span>
        </h1>
        <p className="menu-header-item text-neutral-600/90 text-sm sm:text-base leading-relaxed font-medium">
          Handcrafted locally with fresh organic ingredients, traditional spices, and timeless Himalayan recipes.
        </p>
      </div>

      {/* Category filter controls */}
      <div className="flex flex-wrap justify-center items-center gap-2.5 max-w-3xl mx-auto relative z-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`menu-filter-pill px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${
              activeCategory === cat
                ? 'bg-green-800 border-green-800 text-white shadow-lg shadow-green-950/20'
                : 'bg-white/80 backdrop-blur-sm border-neutral-200 text-neutral-600 hover:border-green-300 hover:text-green-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* Shifted the entire image frame upward using negative margins (-mt-6 md:-mt-10) */}
      <div className="menu-banner-image flex justify-center items-center -mt-6 md:-mt-10 relative z-10 [perspective:1500px] w-full">
        <div className="w-full max-w-9xl h-[110vh] overflow-hidden rounded-[2.5rem] shadow-2xl border border-emerald-900/10 bg-neutral-50 relative">
          
          {/* Background spice image */}
          <img 
            src="images/masala.jpeg" 
            alt="Traditional Himalayan Masala Spices" 
            className="w-full h-full object-cover object-center"
          />

          {/* Foreground overlay frame */}
          <div className="absolute inset-0 flex justify-center items-center p-6 bg-black/15 backdrop-blur-[2px]">
            
            {/* Pop-out Menu card container */}
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="menu-card-pop w-full max-w-2xl max-h-[120%] rounded-[1.5rem] overflow-hidden shadow-2xl bg-white border border-white/20 will-change-transform cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img 
                src="images/mintmen.jpeg" 
                alt="Menu Card" 
                className="w-full h-full object-contain mx-auto select-none pointer-events-none"
              />
            </div>

          </div>

        </div>
      </div>

    </main>
  );
}