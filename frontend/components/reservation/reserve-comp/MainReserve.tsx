"use client";

// components/reservation/MainReserve.tsx
import React, { useState } from 'react';
import { Calendar, Users, Clock, Home, Layers } from 'lucide-react';

export default function MainReserve() {
  const [bookingType, setBookingType] = useState<'seat' | 'hall'>('seat');

  return (
    <main className="w-full max-w-4xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-4xl font-black text-neutral-900 tracking-tight">
          Book Your <span className="text-orange-500">Experience</span>
        </h1>
        <p className="text-neutral-500 text-sm">
          Secure a cozy table for tonight or reserve our grand hall for your next big celebration.
        </p>
      </div>

      {/* Switcher Tabs */}
      <div className="flex justify-center">
        <div className="bg-neutral-100 p-1.5 rounded-2xl flex gap-2 border border-neutral-200/50">
          <button
            onClick={() => setBookingType('seat')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              bookingType === 'seat'
                ? 'bg-white text-orange-500 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Users size={14} />
            Table Booking
          </button>
          <button
            onClick={() => setBookingType('hall')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              bookingType === 'hall'
                ? 'bg-white text-orange-500 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Home size={14} />
            Hall Reservation
          </button>
        </div>
      </div>

      {/* Interactive Booking Form */}
      <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-xl shadow-neutral-100/40 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 block">Full Name</label>
            <input 
              type="text" 
              placeholder="Alex Mercer"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 transition-colors bg-neutral-50/30" 
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 block">Email Address</label>
            <input 
              type="email" 
              placeholder="alex@example.com"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 transition-colors bg-neutral-50/30" 
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 block">Select Date</label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 transition-colors bg-neutral-50/30 text-neutral-700" 
              />
            </div>
          </div>

          {/* Dynamic Field based on Booking Type */}
          {bookingType === 'seat' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 block">Number of Guests</label>
              <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 transition-colors bg-neutral-50/30 text-neutral-600">
                <option>1 Person</option>
                <option>2 People</option>
                <option>4 People</option>
                <option>6+ People</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 block">Event Type</label>
              <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 transition-colors bg-neutral-50/30 text-neutral-600">
                <option>Birthday Party</option>
                <option>Corporate Gathering</option>
                <option>Wedding / Reception</option>
                <option>Other Private Event</option>
              </select>
            </div>
          )}

          {/* Time Slot Picker */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-neutral-700 block">Preferred Time Window</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['12:00 PM', '2:00 PM', '6:00 PM', '8:00 PM'].map((time) => (
                <button 
                  type="button" 
                  key={time}
                  className="py-3 border border-neutral-200 rounded-xl text-xs font-medium hover:border-orange-500 hover:text-orange-500 transition-all bg-neutral-50/30"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-neutral-700 block">Special Requests / Notes</label>
            <textarea 
              rows={3} 
              placeholder="Any dietary restrictions, seating preferences, or decorations we should know about?"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 transition-colors bg-neutral-50/30 resize-none"
            ></textarea>
          </div>

        </div>

        {/* Submit Action */}
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors text-sm tracking-wide"
          >
            Confirm {bookingType === 'seat' ? 'Table' : 'Hall'} Booking
          </button>
        </div>
      </form>
    </main>
  );
}