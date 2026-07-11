"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, CalendarCheck, Database, LayoutDashboard, Sparkles, LogOut, ChevronRight, Phone, Calendar as CalendarIcon, Clock, Trash2, Plus, PlusCircle, Tag } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type AdminTab = 'messages' | 'reservations' | 'crud';

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

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: string;
  img: string;
  tags: string[];
}

export default function AdminMain() {
  const [activeTab, setActiveTab] = useState<AdminTab>('messages');
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Momo');
  const [newPrice, setNewPrice] = useState('');
  const [newTags, setNewTags] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchData = async (tab: AdminTab) => {
    try {
      if (tab === 'reservations') {
        const res = await fetch('http://localhost:8000/api/reservations');
        if (res.ok) setReservations(await res.json());
      } else if (tab === 'messages') {
        const res = await fetch('http://localhost:8000/api/messages');
        if (res.ok) setMessages(await res.json());
      } else if (tab === 'crud') {
        const res = await fetch('http://localhost:8000/api/menu');
        if (res.ok) setMenuItems(await res.json());
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

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) {
      showNotification("Please fill in item configurations completely.");
      return;
    }

    const itemPayload = {
      name: newName,
      category: newCategory,
      price: newPrice.startsWith('Rs.') ? newPrice : `Rs. ${newPrice}`,
      rating: "5.0",
      img: "/images/menu/momo-jhol.jpg",
      tags: newTags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    };

    try {
      const res = await fetch('http://localhost:8000/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemPayload)
      });
      if (res.ok) {
        const newItem = await res.json();
        setMenuItems(prev => Array.isArray(prev) ? [...prev, newItem] : [newItem]);
        setNewName('');
        setNewPrice('');
        setNewTags('');
        showNotification("Menu item registered into production.");
      } else {
        showNotification("Unable to register dish item.");
      }
    } catch (err) {
      console.error(err);
      showNotification("Network sync exception.");
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMenuItems(prev => prev.filter(item => item.id !== id));
        showNotification("Menu item removed successfully.");
      } else {
        showNotification("Failed to drop database catalog item.");
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

  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-neutral-50 flex font-['Plus_Jakarta_Sans'] select-none overflow-hidden">
      
      <main className="animate-content flex-1 p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto">
        <div className="tab-content-panel space-y-8">
          
          <div className="flex flex-col gap-2">
            <span className="text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 w-fit">
              <Sparkles size={12} /> Management Console
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight capitalize">
              {activeTab === 'crud' ? 'Menu CRUD' : activeTab} <span className="text-orange-500">Dashboard</span>
            </h1>
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
                  <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl w-fit mx-auto"><MessageSquare size={32} /></div>
                  <h3 className="text-lg font-bold text-neutral-800">Customer Communication Stream</h3>
                  <p className="text-sm text-neutral-400 max-w-sm">No active inbox items found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-5 border border-neutral-100 bg-neutral-50/50 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-neutral-800 text-sm">{msg.name}</h4>
                        <span className="text-xs text-orange-500 font-semibold bg-orange-50 px-2.5 py-1 rounded-lg">{msg.subject}</span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'reservations' && (
              reservations.length === 0 ? (
                <div className="text-center py-20 space-y-3 m-auto">
                  <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl w-fit mx-auto"><CalendarCheck size={32} /></div>
                  <h3 className="text-lg font-bold text-neutral-800">Active Bookings Registry</h3>
                  <p className="text-sm text-neutral-400 max-w-sm">No floor adjustments pending.</p>
                </div>
              ) : (
                <div className="space-y-3 w-full">
                  {reservations.map((res) => (
                    <div key={res.id} className="p-5 border border-neutral-100 bg-neutral-50/50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${res.booking_type === 'seat' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {res.booking_type}
                          </span>
                          <h4 className="font-bold text-neutral-800 text-sm">{res.name}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                          <span className="flex items-center gap-1"><Phone size={12}/> {res.mobile}</span>
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

            {activeTab === 'crud' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                <form onSubmit={handleAddMenuItem} className="lg:col-span-5 border border-neutral-200 p-5 rounded-2xl bg-neutral-50/50 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                    <PlusCircle size={16} className="text-orange-500" />
                    <h3 className="text-sm font-bold text-neutral-800">Add New Dish</h3>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-600 block">Item Name</label>
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)} 
                      placeholder="e.g., Spicy Fried Kothey Momo"
                      className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-orange-400 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-600 block">Category</label>
                      <select 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-2 py-2 text-xs text-neutral-700 focus:outline-none focus:border-orange-400 bg-white"
                      >
                        <option>Momo</option>
                        <option>Main Course</option>
                        <option>Appetizers</option>
                        <option>Desserts</option>
                        <option>Beverages</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-600 block">Price (Rs.)</label>
                      <input 
                        type="text" 
                        value={newPrice} 
                        onChange={(e) => setNewPrice(e.target.value)} 
                        placeholder="350"
                        className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-orange-400 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-600 block">Tags (Comma Separated)</label>
                    <input 
                      type="text" 
                      value={newTags} 
                      onChange={(e) => setNewTags(e.target.value)} 
                      placeholder="fried, spicy, appetizer"
                      className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-orange-400 bg-white"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Plus size={14} /> Add Item to Menu
                  </button>
                </form>

                <div className="lg:col-span-7 space-y-3 max-h-[550px] overflow-y-auto pr-1">
                  {safeMenuItems.map((item) => (
                    <div key={item.id} className="p-4 border border-neutral-100 bg-neutral-50/30 rounded-2xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded">
                            {item.category}
                          </span>
                          <h4 className="font-bold text-neutral-800 text-xs">{item.name}</h4>
                        </div>
                        <p className="text-xs font-black text-orange-600">{item.price}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.tags.map(t => (
                              <span key={t} className="text-[9px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Tag size={8}/>{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="p-2 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100"
                        title="Remove Item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
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
            {(['messages', 'reservations', 'crud'] as AdminTab[]).map((tab) => (
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
                  {tab === 'crud' && <Database size={16} />}
                  <span className="capitalize">{tab === 'crud' ? 'Menu System' : tab}</span>
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