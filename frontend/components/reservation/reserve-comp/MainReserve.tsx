"use client";

import React, { useState, useRef } from 'react';
import { Calendar, Users, Clock, Home, Sparkles, User, Phone, MessageSquare, Utensils, CheckCircle2, XCircle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const SEAT_GUEST_OPTIONS = ['1 Person (Solo Dining)', '2 People (Couple Date)', '4 People (Standard Family)', '6+ People (Gathering)'];
const HALL_OCCASION_OPTIONS = ['Bratabandha / Nwaran Feast', 'Birthday / Anniversary Celebration', 'Corporate Dinner Gathering', 'Marriage Reception Banquet'];
const TIME_SLOTS = ['11:30 AM', '2:00 PM', '6:30 PM', '8:30 PM'];

type SubmitState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; bookingType: 'seat' | 'hall'; allocated: number }
  | { status: 'error'; message: string };

export default function MainReserve() {
  const [bookingType, setBookingType] = useState<'seat' | 'hall'>('seat');
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBgRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [date, setDate] = useState('');
  const [dynamicSelection, setDynamicSelection] = useState(SEAT_GUEST_OPTIONS[0]);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });
    tl.from('.animate-header > *', { y: 25, opacity: 0, stagger: 0.12 })
      .from('.animate-panel-left', { x: -40, opacity: 0 }, '-=0.6')
      .from('.animate-panel-right', { x: 40, opacity: 0 }, '-=0.8');
  }, { scope: containerRef });

  const handleTabChange = (type: 'seat' | 'hall', index: number) => {
    setBookingType(type);
    setDynamicSelection(type === 'seat' ? SEAT_GUEST_OPTIONS[0] : HALL_OCCASION_OPTIONS[0]);
    setSubmitState({ status: 'idle' });

    gsap.to(activeBgRef.current, {
      x: index * 100 + '%',
      duration: 0.4,
      ease: 'back.out(1.1)'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !date || !timeSlot) {
      setSubmitState({ status: 'error', message: 'Please select a time slot and complete all fields.' });
      return;
    }
    setSubmitState({ status: 'loading' });

    try {
      const res = await fetch(`${API_BASE}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          mobile,
          date,
          booking_type: bookingType,
          dynamic_selection: dynamicSelection,
          time_slot: timeSlot,
          special_requests: specialRequests || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitState({ status: 'error', message: data.detail || 'Allocation failed.' });
        return;
      }

      setSubmitState({ 
        status: 'success', 
        bookingType, 
        allocated: bookingType === 'seat' ? data.seat_number : data.hall_number 
      });
    } catch (err) {
      setSubmitState({ status: 'error', message: 'Could not connect to database configuration infrastructure.' });
    }
  };

  return (
    <main 
      ref={containerRef} 
      className="w-full max-w-6xl mx-auto px-6 py-12 space-y-12 relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-50 via-orange-50/10 to-amber-50/20 rounded-3xl border border-neutral-100/50 shadow-inner"
    >
      {/* Absolute ambient premium design accent glows */}
      <div className="absolute top-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-orange-100/30 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-amber-50/40 blur-[130px] pointer-events-none -z-10" />

      <div className="animate-header text-center max-w-xl mx-auto space-y-4 relative z-10">
        <h1 className="text-4xl font-black text-neutral-900">
          Book Your <span className="text-green-700">Space</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        {/* Info Left */}
        <div className="animate-panel-left lg:col-span-4 bg-white/95 backdrop-blur-sm border border-neutral-200/80 rounded-3xl p-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-bold">Reservation Rules</h2>
          <p className="text-xs text-neutral-500">We offer a 15-minute grace arrival holding period.</p>
        </div>

        {/* Input Form Right */}
        <div className="animate-panel-right lg:col-span-8 bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-neutral-200/80 space-y-6 shadow-sm">
          <div className="flex justify-center">
            <div className="bg-neutral-100/80 p-1.5 rounded-2xl flex relative w-full max-w-sm border border-neutral-200/40">
              <div ref={activeBgRef} className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow z-0" />
              <button type="button" onClick={() => handleTabChange('seat', 0)} className="flex-1 py-3 text-xs font-black relative z-10 text-center">Table Booking</button>
              <button type="button" onClick={() => handleTabChange('hall', 1)} className="flex-1 py-3 text-xs font-black relative z-10 text-center">Banquets & Halls</button>
            </div>
          </div>

          {submitState.status === 'success' && (
            <div className="p-4 bg-green-50/90 border border-green-200 text-green-800 text-sm font-bold rounded-2xl">
              Booking confirmed! Assigned Allocation Number: #{submitState.allocated}
            </div>
          )}

          {submitState.status === 'error' && (
            <div className="p-4 bg-red-50/90 border border-red-200 text-red-700 text-sm font-bold rounded-2xl">
              {submitState.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3.5 rounded-xl border text-sm bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700">Mobile Number</label>
              <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="w-full p-3.5 rounded-xl border text-sm bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700">Select Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-3.5 rounded-xl border text-sm bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700">Options</label>
              <select value={dynamicSelection} onChange={(e) => setDynamicSelection(e.target.value)} className="w-full p-3.5 rounded-xl border text-sm bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all">
                {bookingType === 'seat' 
                  ? SEAT_GUEST_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)
                  : HALL_OCCASION_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Time Slot Picker Block */}
            <div className="space-y-3 md:col-span-2 block">
              <label className="text-xs font-bold text-neutral-700 block">Available Dining Hours</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map((time) => {
                  const isSelected = timeSlot === time;
                  return (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setTimeSlot(time)}
                      className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all block w-full text-center ${
                        isSelected
                          ? 'border-green-700 text-green-700 bg-orange-50 font-black ring-2 ring-orange-500/20'
                          : 'border-neutral-200 text-neutral-600 bg-white/50 hover:border-neutral-400 hover:bg-white'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-neutral-700">Special Notes</label>
              <textarea rows={3} value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} className="w-full p-3.5 rounded-xl border text-sm resize-none bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all" />
            </div>

            <div className="md:col-span-2 pt-2">
              <button type="submit" className="w-full bg-green-700 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors text-sm shadow-md shadow-orange-500/20">
                Confirm Your Space
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}