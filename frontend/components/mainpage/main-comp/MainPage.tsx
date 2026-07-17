"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Star,
  ArrowLeft,
  ArrowRight,
  Clock,
  Leaf,
  ChefHat,
  Truck,
  Quote,
  Sprout,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// ---------------------------------------------------------------------------
// Static content
// ---------------------------------------------------------------------------
interface Dish {
  id: number;
  name: string;
  image: string;
  price: string;
  rating: string;
  reviewCount: string;
}

const POPULAR_DISHES: Dish[] = [
  { id: 1, name: "Margherita Pizza", image: "/images/pizza.jpg", price: "Rs.180.00", rating: "4.9", reviewCount: "7.2k" },
  { id: 2, name: "Pasta al Pomodoro", image: "/images/pasta.jpg", price: "Rs.200.00", rating: "4.8", reviewCount: "3.8k" },
  { id: 3, name: "Butter Chicken Curry", image: "/images/butter-chicken.jpg", price: "Rs.220.00", rating: "4.9", reviewCount: "5.1k" },
  { id: 4, name: "Chicken Biryani", image: "/images/chicken-biryani.jpg", price: "Rs.210.00", rating: "5.0", reviewCount: "6.1k" },
  { id: 5, name: "Golden Fried Rice", image: "/images/rice.jpg", price: "Rs.160.00", rating: "4.7", reviewCount: "2.9k" },
  { id: 6, name: "Classic Burger", image: "/images/burger.jpg", price: "Rs.170.00", rating: "4.8", reviewCount: "4.4k" },
];

const STATS = [
  { value: "12+", label: "Years Serving Kathmandu" },
  { value: "120+", label: "Dishes On Rotation" },
  { value: "40k+", label: "Guests Fed This Year" },
  { value: "4.9", label: "Average Guest Rating" },
];

const FEATURES = [
  {
    icon: Leaf,
    title: "Sourced Daily",
    desc: "Produce and spices arrive each morning from local Kathmandu Valley farms — nothing sits in a cold store.",
  },
  {
    icon: ChefHat,
    title: "Chef-Led Menu",
    desc: "Every plate is designed and finished by our head chef, not assembled from a central commissary kitchen.",
  },
  {
    icon: Truck,
    title: "30-Minute Delivery",
    desc: "Order ahead or walk in — our kitchen is built to get a hot plate to your table or door fast.",
  },
];

const TESTIMONIALS = [
  {
    quote: "The butter chicken tastes like someone's grandmother made it — rich, unhurried, no shortcuts.",
    name: "Sujata R.",
    role: "Regular guest",
  },
  {
    quote: "Booked a table for eight with two hours' notice and they still nailed every course.",
    name: "Bikash T.",
    role: "Weekend regular",
  },
  {
    quote: "Best biryani in Sifal, full stop. The saffron isn't shy about it either.",
    name: "Anisha M.",
    role: "First-time visitor",
  },
];

// ---------------------------------------------------------------------------
// Dish card
// ---------------------------------------------------------------------------
const DishCard = React.memo(function DishCard({ dish }: { dish: Dish }) {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(card, {
      rotateX: -y * 0.15,
      rotateY: x * 0.15,
      transformPerspective: 1000,
      scale: 1.03,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="dish-card snap-start shrink-0 w-[250px] bg-[#FFFCF5] rounded-[2rem] p-6 shadow-md hover:shadow-2xl transition-shadow border border-[#E3DAC4] text-center relative group flex flex-col items-center will-change-transform focus-within:ring-2 focus-within:ring-emerald-700"
    >
      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[11px] font-bold text-[#2B2214] bg-[#F3EFDF] border border-[#E3DAC4] px-2.5 py-1 rounded-xl">
        <Star size={12} fill="#92400e" color="#92400e" />
        <span>
          {dish.rating} <span className="text-[#9C9075] font-medium">({dish.reviewCount})</span>
        </span>
      </div>
      <div className="w-36 h-36 rounded-full overflow-hidden my-5 border-[8px] border-[#F3EFDF] shadow-inner group-hover:scale-105 transition-transform duration-300 bg-[#E3DAC4]">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          decoding="async"
          width={144}
          height={144}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-bold text-[#2B2214] text-base mb-1.5 line-clamp-1 group-hover:text-emerald-800 transition-colors">
        {dish.name}
      </h3>
      <p className="text-emerald-800 font-black text-sm mt-auto pt-2">{dish.price}</p>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MainPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [mounted, setMounted] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    setMounted(true);
    updateScrollState();
    
    const el = scrollerRef.current;
    if (!el) return;
    
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        updateScrollState();
        raf = 0;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [updateScrollState]);

  const scrollDishes = useCallback((direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }, []);

  const dishes = useMemo(() => POPULAR_DISHES, []);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".reveal-text", {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
      });

      gsap.from(".hero-sub-stagger", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.4,
      });

      const heroTl = gsap.timeline({ defaults: { ease: "elastic.out(1, 0.75)", duration: 1.2 } });
      heroTl
        .from(".hero-photo-wrapper", { scale: 0, rotation: -15, delay: 0.2 })
        .from(".hero-ring", { scale: 1.4, opacity: 0, duration: 1.5 }, "-=1")
        .from(".hero-float-badge", { y: 60, x: -30, opacity: 0 }, "-=0.8");

      gsap.to(".hero-float-badge", {
        y: "+=10",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const cards = gsap.utils.toArray(".dish-card");
      cards.forEach((card: any, i: number) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
          y: 80 + (i % 3) * 40,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
        });
      });

      gsap.from(".section-title-mask", {
        scrollTrigger: { trigger: ".dishes-section-header", start: "top 85%" },
        yPercent: 100,
        duration: 1,
        ease: "power3.out",
      });

      gsap.utils.toArray(".feature-card").forEach((card: any, i: number) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 90%" },
          y: 40,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });

      gsap.from(".testimonial-card", {
        scrollTrigger: { trigger: ".testimonial-section", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".stat-item", {
        scrollTrigger: { trigger: ".stats-strip", start: "top 90%" },
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-32 overflow-hidden relative bg-[#F5EFDD] rounded-[3rem] border border-[#E3DAC4] shadow-[0_30px_100px_rgba(43,34,20,0.08)]"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Background lowlight image layer                                  */}
      {/* ---------------------------------------------------------------- */}
      <div className="absolute inset-0 -z-30 pointer-events-none overflow-hidden rounded-[3rem]">
        <img
          src="/images/lowlight.jpeg"
          alt=""
          className="w-full h-full object-cover opacity-40 filter brightness-95 saturate-75"
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Wood-grain texture layer */}
      <div
        className="absolute inset-0 pointer-events-none -z-20 opacity-[0.05]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(120,72,25,0.7) 0px,
            rgba(120,72,25,0.7) 1px,
            transparent 1px,
            transparent 7px,
            rgba(120,72,25,0.35) 7px,
            rgba(120,72,25,0.35) 8px,
            transparent 8px,
            transparent 22px
          )`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none -z-20 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            rgba(120,72,25,0.5) 0px,
            rgba(120,72,25,0.5) 1px,
            transparent 1px,
            transparent 140px
          )`,
        }}
      />

      {/* Panflip ambient overlay */}
      <img
        src="/images/panflip.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute -top-[8%] -left-[10%] w-[560px] h-[560px] object-cover rounded-full scale-x-[-1] blur-2xl opacity-20 pointer-events-none -z-10 saturate-[0.85]"
      />

      <div className="absolute top-[-15%] right-[-10%] w-[650px] h-[650px] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[750px] h-[750px] rounded-full bg-amber-100/30 blur-[180px] pointer-events-none -z-10" />

      {/* Scattered leaf accents */}
      <Leaf className="hidden lg:block absolute top-10 right-[38%] w-10 h-10 text-emerald-800/10 rotate-12 pointer-events-none -z-10" />
      <Sprout className="hidden lg:block absolute bottom-24 right-[8%] w-14 h-14 text-emerald-800/10 -rotate-6 pointer-events-none -z-10" />
      <Leaf className="hidden lg:block absolute bottom-10 left-[6%] w-8 h-8 text-amber-800/10 -rotate-45 pointer-events-none -z-10" />

      {/* ---------------------------------------------------------------- */}
      {/* Hero Section                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative pt-4">
        <div className="space-y-8 max-w-2xl z-10">
          <div className="overflow-hidden inline-block">
            <span className="hero-sub-stagger text-emerald-800 font-extrabold tracking-[0.2em] text-[11px] uppercase bg-emerald-100/60 border border-emerald-200/50 px-4 py-2 rounded-full inline-flex items-center gap-2 backdrop-blur-sm">
              <Leaf size={12} /> Welcome to Mint & Moss
            </span>
          </div>
          <div className="space-y-1">
            <div className="overflow-hidden h-14 sm:h-20">
              <h1 className="reveal-text text-5xl sm:text-7xl font-black text-[#2B2214] tracking-tight leading-none">
                Mint & Moss
              </h1>
            </div>
            <h1 className="hero-sub-stagger text-2xl sm:text-4xl lg:text-5xl font-black text-[#2B2214] tracking-tight leading-tight">
              We don't believe in love at first sight,
            </h1>
            <h1 className="hero-sub-stagger text-2xl sm:text-4xl lg:text-5xl font-black text-red-800 tracking-tight leading-tight">
              We believe in love at first bite.
            </h1>
          </div>
          <p className="hero-sub-stagger text-[#5C543F] leading-relaxed text-base font-medium max-w-lg">
            Experience food redefined by luxury craftsmanship. We combine dynamic
            organic flavors with master culinary design to present plates that
            taste as exquisite as they look.
          </p>
          <div className="hero-sub-stagger flex flex-wrap gap-4 pt-3">
            <Link
              href="/reserve"
              className="bg-emerald-800 text-white px-9 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/15 hover:bg-emerald-900 hover:shadow-emerald-900/35 transition-all text-sm block text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900 focus-visible:ring-offset-2"
            >
              Reserve a Table
            </Link>
            <Link
              href="/menue"
              className="border-2 border-[#D9CBAB] bg-white/40 backdrop-blur-sm text-[#2B2214] px-9 py-4 rounded-2xl font-bold hover:bg-[#F3EFDF] hover:border-[#C9B98C] transition-all text-sm block text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2214] focus-visible:ring-offset-2"
            >
              Menu
            </Link>
          </div>
          <div className="hero-sub-stagger text-xs font-bold text-[#7A6F53] flex items-center gap-2.5 pt-3">
            <div className="p-2 rounded-xl bg-emerald-100/60 border border-emerald-200/40">
              <Clock size={15} className="text-emerald-800" />
            </div>
            <span>Open: 11:00am - 11:00pm</span>
          </div>
        </div>

        <div className="relative flex justify-center items-center h-[400px] sm:h-[520px]">
          <div className="hero-ring absolute w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] rounded-full border-2 border-dashed border-emerald-700/25 motion-safe:animate-[spin_120s_linear_infinite]" />
          <div className="hero-float-badge absolute top-4 right-0 sm:right-6 bg-white/95 backdrop-blur-md border border-[#D9CBAB] p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <div>
              <p className="text-[10px] text-[#9C9075] uppercase tracking-widest font-black">Fresh Today</p>
              <p className="text-xs font-bold text-[#2B2214]">Chef's Signature Bowl</p>
            </div>
          </div>
          <div className="hero-photo-wrapper relative w-[290px] h-[290px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden shadow-2xl border-8 border-white bg-[#E3DAC4]">
            <img
              src="/images/extrashots.jpeg"
              alt="Fresh vegetable salad bowl"
              className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Popular dishes                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="space-y-12 relative z-10">
        <div className="dishes-section-header flex justify-between items-end border-b border-[#E3DAC4] pb-6 overflow-hidden">
          <div>
            <span className="text-emerald-800 font-extrabold tracking-widest text-[11px] uppercase block mb-1">
              Our Recommendations
            </span>
            <div className="overflow-hidden h-10">
              <h2 className="section-title-mask text-3xl font-black text-[#2B2214] tracking-tight">
                Our Popular <span className="text-emerald-800">Dishes</span>
              </h2>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              aria-label="Scroll dishes left"
              disabled={mounted ? !canScrollLeft : false}
              onClick={() => scrollDishes(-1)}
              className="w-12 h-12 rounded-2xl border border-[#D9CBAB] bg-white text-[#5C543F] flex items-center justify-center hover:bg-[#F3EFDF] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Scroll dishes right"
              disabled={mounted ? !canScrollRight : false}
              onClick={() => scrollDishes(1)}
              className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div
          ref={scrollerRef}
          className="dish-card-container flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </section>

           {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-[#241A0F] rounded-[2.5rem] px-10 py-14 sm:py-20 text-center space-y-6 relative overflow-hidden z-10">
        <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-700/20 blur-[140px] pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight relative">
          Hungry Already?
        </h2>
        <p className="text-[#CFC3A8] max-w-md mx-auto relative">
          Reserve a table for tonight, or reach out if you're planning something bigger.
        </p>
        <div className="flex flex-wrap justify-center gap-4 relative">
          <Link
            href="/reserve"
            className="bg-emerald-700 text-white px-9 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-600 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#241A0F]"
          >
            Reserve a Table
          </Link>
          <Link
            href="/contact"
            className="border-2 border-white/20 text-white px-9 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#241A0F]"
          >
            Contact Us
          </Link>
        </div>
      </section>
      

      {/* ---------------------------------------------------------------- */}
      {/* Why APFoods                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="space-y-12 relative z-10">
        <div className="max-w-xl">
          <span className="text-emerald-800 font-extrabold tracking-widest text-[11px] uppercase block mb-2">
            Why Guests Come Back
          </span>
          <h2 className="text-3xl font-black text-[#2B2214] tracking-tight">
            Built Around The Kitchen, Not The Marketing
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="feature-card bg-[#FFFCF5] border border-[#E3DAC4] rounded-[2rem] p-8 space-y-4 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/60 border border-emerald-200/50 flex items-center justify-center">
                  <Icon size={20} className="text-emerald-800" />
                </div>
                <h3 className="font-bold text-[#2B2214] text-lg">{feature.title}</h3>
                <p className="text-sm text-[#7A6F53] leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Testimonials                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="testimonial-section space-y-12 relative z-10">
        <div className="max-w-xl">
          <span className="text-emerald-800 font-extrabold tracking-widest text-[11px] uppercase block mb-2">
            From Our Guests
          </span>
          <h2 className="text-3xl font-black text-[#2B2214] tracking-tight">What People Are Saying</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="testimonial-card bg-[#FFFCF5] border border-[#E3DAC4] rounded-[2rem] p-8 space-y-5 shadow-sm flex flex-col"
            >
              <Quote size={22} className="text-emerald-600" aria-hidden="true" />
              <blockquote className="text-sm text-[#5C543F] leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="text-xs font-bold text-[#2B2214]">
                {t.name}
                <span className="block font-medium text-[#9C9075] mt-0.5">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>


      {/* ---------------------------------------------------------------- */}
      {/* Trust strip                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="stats-strip grid grid-cols-2 sm:grid-cols-4 gap-6 border-y border-[#E3DAC4] py-10 relative z-10">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat-item text-center space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#2B2214]">{stat.value}</p>
            <p className="text-xs font-bold text-[#7A6F53] uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </section>

    </main>
  );
}