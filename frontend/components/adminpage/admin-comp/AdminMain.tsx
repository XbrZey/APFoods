"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, CalendarCheck, ShoppingCart, LayoutDashboard, Sparkles, LogOut, ChevronRight, Phone, Calendar as CalendarIcon, Clock, Trash2, RefreshCw, User } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type AdminTab = 'messages' | 'reservations' | 'cart';

interface ReservationItem {
  id: number;
  name: string;
  mobile: string;
  date: string;
  booking_type: string;
  dynamic_selection: string;
  time_slot: string;
  special_requests: string | null;
}

interface MessageItem {
  id: number;
  name: string;
  subject: string;
  message: string;
}

// One line item inside a customer's cart/order
interface CartEntry {
  id: number;
  session_id: string;
  customer_label: string | null; // e.g. "Table 4" or a guest name, nullable
  item_name: string;
  price: number;
  qty: number;
  created_at: string;
}

export default function AdminMain() {
  const [activeTab, setActiveTab] = useState<AdminTab>('messages');
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [cartEntries, setCartEntries] = useState<CartEntry[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchData = async (tab: AdminTab) => {
    try {
      if (tab === 'reservations') {
        const res = await fetch('http://localhost:8000/api/reservations');
        if (res.ok) setReservations(await res.json());
      } else if (tab === 'messages') {
        const res = await fetch('http://localhost:8000/api/messages');
        if (res.ok) setMessages(await res.json());
      } else if (tab === 'cart') {
        const res = await fetch('http://localhost:8000/api/cart');
        if (res.ok) setCartEntries(await res.json());
      }
    } catch (err) {
      console.error("Data load failure:", err);
    }
  };

  const handleDeleteReservation = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/reservations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReservations(prev => prev.filter(item => item.id !== id));
        showNotification("Reservation row purged cleanly.");
      } else {
        showNotification("Failed to delete entry node.");
      }
    } catch (err) {
      console.error(err);
      showNotification("Network operation exception.");
    }
  };

  const handleRemoveCartEntry = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/cart/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCartEntries(prev => prev.filter(entry => entry.id !== id));
        showNotification("Item removed from customer cart.");
      } else {
        showNotification("Failed to remove cart item.");
      }
    } catch (err) {
      console.error(err);
      showNotification("Network removal error.");
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  useGSAP(() => {
    gsap.from('.animate-sidebar', { x: 50, opacity: 0, duration: 0.8, ease: 'power4.out' });
    gsap.from('.animate-content', { x: -30, opacity: 0, duration: 0.8, ease: 'power4.out', delay: 0.1 });
  }, { scope: containerRef });

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    gsap.fromTo('.tab-content-panel',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  };

  const safeCartEntries = Array.isArray(cartEntries) ? cartEntries : [];

  // Group flat cart entries into per-customer sessions
  const sessions = safeCartEntries.reduce<Record<string, CartEntry[]>>((acc, entry) => {
    acc[entry.session_id] = acc[entry.session_id] || [];
    acc[entry.session_id].push(entry);
    return acc;
  }, {});

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-neutral-50 flex font-['Plus_Jakarta_Sans'] select-none overflow-hidden">

      <main className="animate-content flex-1 p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto">
        <div className="tab-content-panel space-y-8">

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 w-fit">
                <Sparkles size={12} /> Management Console
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight capitalize">
                {activeTab === 'cart' ? 'Live Orders' : activeTab} <span className="text-orange-500">Dashboard</span>
              </h1>
            </div>

            {activeTab === 'cart' && (
              <button
                type="button"
                onClick={() => fetchData('cart')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-neutral-200 text-neutral-600 hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            )}
          </div>

          {notification && (
            <div className="p-4 bg-neutral-900 text-white rounded-xl text-xs font-bold transition-all shadow-md w-fit">
              {notification}
            </div>
          )}

          <div className="bg-white border border-neutral-200 rounded-3xl p-6 min-h-[500px] shadow-sm flex flex-col justify-start items-stretch gap-4">

            {activeTab === 'messages' && (
              messages.length === 0 ? (
                <div className="text-center py-20 space-y-3 m-auto">
                  <MessageSquare size={32} className="mx-auto text-neutral-300" />
                  <p className="text-neutral-400 text-sm font-medium">No messages yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-4 border border-neutral-100 bg-neutral-50/30 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-neutral-800 text-xs">{msg.name}</h4>
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">{msg.subject}</span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-normal">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'reservations' && (
              reservations.length === 0 ? (
                <div className="text-center py-20 space-y-3 m-auto">
                  <CalendarCheck size={32} className="mx-auto text-neutral-300" />
                  <p className="text-neutral-400 text-sm font-medium">No reservations yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reservations.map((res) => (
                    <div key={res.id} className="p-4 border border-neutral-100 bg-neutral-50/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-neutral-800 text-xs">{res.name}</h4>
                          <span className="flex items-center gap-1 text-[10px] text-neutral-400"><Phone size={10}/> {res.mobile}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 font-medium">
                          <span className="flex items-center gap-1"><CalendarIcon size={12}/> {res.date}</span>
                          <span className="flex items-center gap-1"><Clock size={12}/> {res.time_slot}</span>
                        </div>
                        <p className="text-xs text-neutral-400 italic bg-white p-2 rounded-xl border border-neutral-200/60 w-fit">{res.dynamic_selection}</p>
                      </div>

                      {res.special_requests && (
                        <div className="md:max-w-xs bg-orange-50/60 p-3 rounded-xl border border-orange-100 text-left">
                          <span className="text-[10px] font-bold text-orange-600 uppercase block mb-1">Guest Note</span>
                          <p className="text-xs text-neutral-600 leading-normal">{res.special_requests}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-end pl-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteReservation(res.id)}
                          className="p-2.5 bg-neutral-100 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100 active:scale-95"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'cart' && (
              Object.keys(sessions).length === 0 ? (
                <div className="text-center py-20 space-y-3 m-auto">
                  <ShoppingCart size={32} className="mx-auto text-neutral-300" />
                  <p className="text-neutral-400 text-sm font-medium">No active customer carts right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {Object.entries(sessions).map(([sessionId, entries]) => {
                    const sessionTotal = entries.reduce((sum, e) => sum + e.price * e.qty, 0);
                    return (
                      <div key={sessionId} className="border border-neutral-100 bg-neutral-50/30 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                            <User size={13} className="text-orange-500" />
                            {entries[0].customer_label || `Guest ${sessionId.slice(0, 6)}`}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase">
                            {entries.length} item{entries.length > 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {entries.map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-neutral-800 truncate">{entry.item_name}</p>
                                <p className="text-[11px] text-neutral-500">
                                  Rs. {entry.price} × {entry.qty}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveCartEntry(entry.id)}
                                aria-label={`Remove ${entry.item_name}`}
                                className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors shrink-0"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase">Total</span>
                          <span className="text-sm font-black text-neutral-900">Rs. {sessionTotal}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>

        </div>
      </main>

      <aside className="animate-sidebar w-64 md:w-72 bg-white border-l border-neutral-200 flex flex-col justify-between p-6 shadow-sm shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-orange-500 text-white p-2 rounded-xl shadow-lg shadow-orange-500/20">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h2 className="font-black text-neutral-900 text-base tracking-tight">Himalayan Hub</h2>
              <span className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>

          <nav className="space-y-2">
            {(['messages', 'reservations', 'cart'] as AdminTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all group ${
                  activeTab === tab
                    ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab === 'messages' && <MessageSquare size={16} />}
                  {tab === 'reservations' && <CalendarCheck size={16} />}
                  {tab === 'cart' && <ShoppingCart size={16} />}
                  <span className="capitalize">{tab === 'cart' ? 'Menu Cart' : tab}</span>
                </div>
                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === tab ? 'text-white' : 'text-neutral-400'}`} />
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-100">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

    </div>
  );
}