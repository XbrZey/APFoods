'use client'

import React from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function MainContact() {
  return (
    <main className="w-full max-w-6xl mx-auto px-6 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-4xl font-black text-neutral-900 tracking-tight">
          Get in Touch with <span className="text-orange-500">Us</span>
        </h1>
        <p className="text-neutral-500 text-sm">
          Have a question about our menu, events, or sourcing? Drop us a line and our management team will reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Contact Info Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Info Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 text-orange-500 p-3 rounded-xl">
              <Phone size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Call Us</h4>
              <p className="text-sm font-bold text-neutral-800 mt-1">+1 (555) 234-5678</p>
              <p className="text-xs text-neutral-500 mt-0.5">Mon - Sun, 11am - 11pm</p>
            </div>
          </div>

          {/* Info Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 text-orange-500 p-3 rounded-xl">
              <Mail size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email Support</h4>
              <p className="text-sm font-bold text-neutral-800 mt-1">management@foodie.com</p>
              <p className="text-xs text-neutral-500 mt-0.5">Expect response within 24hrs</p>
            </div>
          </div>

          {/* Info Card 3 */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 text-orange-500 p-3 rounded-xl">
              <MapPin size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Location</h4>
              <p className="text-sm font-bold text-neutral-800 mt-1">742 Evergreen Terrace</p>
              <p className="text-xs text-neutral-500 mt-0.5">Springfield, USA</p>
            </div>
          </div>

        </div>

        {/* Message Input Box Form Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-neutral-100 shadow-xl shadow-neutral-100/40">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
              <MessageSquare size={18} className="text-orange-500" /> Send a Direct Message
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700">Your Name</label>
                <input 
                  type="text" 
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 transition-colors bg-neutral-50/30" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700">Subject</label>
                <input 
                  type="text" 
                  placeholder="Catering Inquiry"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 transition-colors bg-neutral-50/30" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700">Your Message</label>
              <textarea 
                rows={5} 
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 transition-colors bg-neutral-50/30 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="bg-neutral-900 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}