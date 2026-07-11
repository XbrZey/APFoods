"use client";

import React, { useRef } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Sparkles, User, HelpCircle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function MainContact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });

    tl.from('.animate-header > *', { y: 25, opacity: 0, stagger: 0.12 })
      .from('.animate-card', { x: -30, opacity: 0, stagger: 0.1 }, '-=0.6')
      .from('.animate-form', { x: 30, opacity: 0 }, '-=0.8');

    gsap.to('.blob-1', { scale: 1.2, x: '+=20', y: '-=30', duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.blob-2', { scale: 1.1, x: '-=30', y: '+=20', duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="w-full max-w-6xl mx-auto px-6 py-12 space-y-12 relative overflow-hidden select-none min-h-screen">
      
      <div className="blob-1 absolute -top-20 -left-20 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="blob-2 absolute -bottom-20 -right-20 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="animate-header text-center max-w-xl mx-auto space-y-4">
        <span className="text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Sparkles size={12} /> Hospitality & Flavors
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-[1.15]">
          Connect with Our <span className="text-orange-500">Kitchen Staff</span>
        </h1>
        <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
          Have queries about our traditional wood-fired setups, private catering, or ingredient sourcing across Kathmandu Valley? Drop us a line!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">

        <div className="lg:col-span-4 flex flex-col justify-between gap-6">

          <div className="animate-card flex-1 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex items-start gap-4 hover:border-orange-300 transition-colors">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Call the Kitchen</h4>
              <p className="text-sm font-bold text-neutral-800 mt-1">+977 (01) 4412345</p>
              <p className="text-xs text-neutral-500 mt-0.5">Hotline: 9801234567</p>
            </div>
          </div>

          <div className="animate-card flex-1 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex items-start gap-4 hover:border-orange-300 transition-colors">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Catering & Events</h4>
              <p className="text-sm font-bold text-neutral-800 mt-1">namaste@foodie.com</p>
              <p className="text-xs text-neutral-500 mt-0.5">Expect a reply within a few hours</p>
            </div>
          </div>

          <div className="animate-card flex-1 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex items-start gap-4 hover:border-orange-300 transition-colors">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Find Our Tables</h4>
              <p className="text-sm font-bold text-neutral-800 mt-1">Jhamsikhel-03, Lalitpur</p>
              <p className="text-xs text-neutral-500 mt-0.5">Kathmandu Valley, Nepal</p>
            </div>
          </div>

        </div>

        <div className="animate-form lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xl shadow-neutral-100/40">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 h-full flex flex-col justify-between">
            <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
              <MessageSquare size={18} className="text-orange-500" /> Share Your Culinary Inquiry
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700">Your Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Aayush Shrestha"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all bg-neutral-50/50 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700">Subject</label>
                <div className="relative">
                  <HelpCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <select className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all bg-neutral-50/50 shadow-sm appearance-none">
                    <option>Table Arrangements / Special Request</option>
                    <option>Private Hall Catering Inquiry</option>
                    <option>Feedback for the Head Chef</option>
                    <option>Other General Inquiry</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700">Your Message Details</label>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-4 top-4 text-neutral-400" />
                <textarea
                  rows={5}
                  placeholder="Let us know what special menu customizations or accommodations you need..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all bg-neutral-50/50 shadow-sm resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-orange-500 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-600/30 transition-all text-sm tracking-wide active:scale-[0.99]"
              >
                Send Message to Kitchen
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}