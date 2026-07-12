"use client";

import React, { useState, useRef } from 'react';
import { Calendar, Users, Clock, Home, Sparkles, User, Phone, MessageSquare, Utensils, ShieldCheck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
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

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });

    tl.from('.animate-header > *', { y: 25, opacity: 0, stagger: 0.12 })
      .from('.animate-panel-left', { x: -40, opacity: 0 }, '-=0.6')
      .from('.animate-panel-right', { x: 40, opacity: 0 }, '-=0.8')
      .from('.time-pill', { scale: 0.9, opacity: 0, stagger: 0.05, ease: 'back.out(1.5)' }, '-=0.4');

    gsap.to('.blob-1', { scale: 1.2, x: '+=20', y: '-=30', duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.blob-2', { scale: 1.1, x: '-=30', y: '+=20', duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
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

    gsap.fromTo('.dynamic-field',
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  };

  const resetForm = () => {
    setName('');
    setMobile('');
    setDate('');
    setDynamicSelection(bookingType === 'seat' ? SEAT_GUEST_OPTIONS[0] : HALL_OCCASION_OPTIONS[0]);
    setTimeSlot(null);
    setSpecialRequests('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !mobile || !date || !timeSlot) {
      setSubmitState({ status: 'error', message: 'Please fill in your name, mobile number, date, and pick a time slot.' });
      return;
    }

    setSubmitState({ status: 'loading' });

    try {
      const res = await fetch('http://localhost:8000/api/reservations', {
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
        setSubmitState({ status: 'error', message: data.detail || 'Something went wrong. Please try a different time or date.' });
        return;
      }

      const allocated = bookingType === 'seat' ? data.seat_number : data.hall_number;
      setSubmitState({ status: 'success', bookingType, allocated });
      resetForm();
    } catch (err) {
      console.error(err);
      setSubmitState({ status: 'error', message: 'Could not reach the server. Please check your connection and try again.' });
    }
  };

  return (
    <main ref={containerRef} className="w-full max-w-6xl mx-auto px-6 py-12 space-y-12 relative overflow-hidden select-none min-h-screen">

      <div className="blob-1 absolute -top-20 -left-20 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="blob-2 absolute -bottom-20 -right-20 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="animate-header text-center max-w-xl mx-auto space-y-4">
        <span className="text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Sparkles size={12} /> Premium Reservation
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-[1.15]">
          Book Your <span className="text-orange-500">Culinary Space</span>
        </h1>
        <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
          Secure an intimate table for family dinner or reserve our premium traditional banquet hall for grand celebrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">

        <div className="animate-panel-left lg:col-span-4 bg-white border border-neutral-200 text-neutral-800 rounded-3xl p-8 flex flex-col justify-between gap-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-orange-600 block mb-1">Why book with us?</span>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-neutral-900">An Unmatched Himalayan Experience</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0"><Utensils size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Tailored Settings</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Custom spice routing, seating arrangements, and dietary preferences honored accurately.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0"><Clock size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">15-Min Grace Period</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">We hold allocations secure up to fifteen minutes past your slotted scheduling target.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0"><ShieldCheck size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Instant Approvals</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Receive immediate digital ledger configuration confirmation notes over SMS channels.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>Need Help? Call Us</span>
            <span className="font-bold text-orange-600">+977 1-4XXXXXX</span>
          </div>
        </div>

        <div className="animate-panel-right lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-8 flex flex-col justify-between">

          <div className="flex justify-center">
            <div className="bg-neutral-100/80 backdrop-blur-sm p-1.5 rounded-2xl flex relative w-full max-w-sm border border-neutral-200/40">

              <div ref={activeBgRef} className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md will-change-transform z-0" />

              <button
                type="button"
                onClick={() => handleTabChange('seat', 0)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-colors relative z-10 ${
                  bookingType === 'seat' ? 'text-orange-500' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Users size={14} /> Table Booking
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('hall', 1)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-colors relative z-10 ${
                  bookingType === 'hall' ? 'text-orange-500' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Home size={14} /> Banquets & Halls
              </button>
            </div>
          </div>

          {submitState.status === 'success' && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl">
              <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-800">
                  Booking confirmed! {submitState.bookingType === 'seat'
                    ? `You've been allocated Seat #${submitState.allocated}.`
                    : `You've been allocated Hall #${submitState.allocated}.`}
                </p>
                <p className="text-xs text-green-700 mt-0.5">We'll text you a confirmation shortly. See you soon!</p>
              </div>
            </div>
          )}

          {submitState.status === 'error' && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-red-700">{submitState.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rohan Adhikari"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all bg-neutral-50/50 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 block">Mobile Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all bg-neutral-50/50 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 block">Select Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all bg-neutral-50/50 shadow-sm text-left"
                />
              </div>
            </div>

            <div className="dynamic-field space-y-2">
              {bookingType === 'seat' ? (
                <>
                  <label className="text-xs font-bold text-neutral-700 block">Number of Guests</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <select
                      value={dynamicSelection}
                      onChange={(e) => setDynamicSelection(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all bg-neutral-50/50 shadow-sm appearance-none"
                    >
                      {SEAT_GUEST_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <label className="text-xs font-bold text-neutral-700 block">Occasion Type</label>
                  <div className="relative">
                    <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <select
                      value={dynamicSelection}
                      onChange={(e) => setDynamicSelection(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all bg-neutral-50/50 shadow-sm appearance-none"
                    >
                      {HALL_OCCASION_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-neutral-700 block">Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map((time) => (
                  <button
                    type="button"
                    key={time}
                    onClick={() => setTimeSlot(time)}
                    className={`time-pill py-3 border rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm ${
                      timeSlot === time
                        ? 'border-orange-500 text-orange-500 bg-orange-50/60'
                        : 'border-neutral-200 text-neutral-600 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/40 bg-neutral-50/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-neutral-700 block">Dietary Preferences or Structural Requests</label>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-4 top-4 text-neutral-400" />
                <textarea
                  rows={4}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Let us know if you need specific setup preferences, low-spice options for elders, or extra highchairs for kids."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all bg-neutral-50/50 shadow-sm resize-none"
                />
              </div>
            </div>

            <div className="pt-2 md:col-span-2">
              <button
                type="submit"
                disabled={submitState.status === 'loading'}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-600/30 transition-all text-sm tracking-wide active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitState.status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Allocating your {bookingType === 'seat' ? 'seat' : 'hall'}...
                  </>
                ) : (
                  `Confirm Your ${bookingType === 'seat' ? 'Table' : 'Hall'} Booking`
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}