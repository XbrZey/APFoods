"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, CalendarCheck, LayoutDashboard, Sparkles, LogOut, ChevronRight, Phone, Calendar as CalendarIcon, Clock, Trash2, User, Send, ShieldX } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type AdminTab = 'messages' | 'reservations';

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
  session_id: string;
  name: string;
  sender: 'user' | 'admin';
  message: string;
  created_at: string;
}

export default function AdminMain() {
  const [activeTab, setActiveTab] = useState<AdminTab>('messages');
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  
  // Guard access restriction flags
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

  // --- Security Check Gate ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      if (payload.role === 'admin') {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch {
      setIsAuthorized(false);
    }
  }, []);

  const fetchData = async (tab: AdminTab) => {
    if (!isAuthorized) return;
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      if (tab === 'reservations') {
        const res = await fetch(`${API_BASE}/api/reservations`, { headers });
        if (res.ok) setReservations(await res.json());
      } else if (tab === 'messages') {
        const res = await fetch(`${API_BASE}/api/messages`, { headers });
        if (res.ok) {
          const data: MessageItem[] = await res.json();
          setMessages(data);
          if (data.length > 0 && !activeSessionId) {
            setActiveSessionId(data[0].session_id);
          }
        }
      }
    } catch (err) {
      console.error("Data load failure:", err);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      const ws = new WebSocket(`${WS_BASE}/api/ws/admin`);
      socketRef.current = ws;

      ws.onmessage = (event) => {
        const liveMsg: MessageItem = JSON.parse(event.data);
        setMessages((prev) => {
          if (prev.some(m => m.id === liveMsg.id)) return prev;
          return [...prev, liveMsg];
        });
      };

      return () => ws.close();
    }
  }, [WS_BASE, isAuthorized]);

  useEffect(() => {
    if (isAuthorized) fetchData(activeTab);
  }, [activeTab, isAuthorized]);

  useGSAP(() => {
    if (isAuthorized) {
      gsap.from('.animate-sidebar', { x: 50, opacity: 0, duration: 0.8, ease: 'power4.out' });
      gsap.from('.animate-content', { x: -30, opacity: 0, duration: 0.8, ease: 'power4.out', delay: 0.1 });
    }
  }, { scope: containerRef, dependencies: [isAuthorized] });

  const terminateSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    window.location.href = '/';
  };

  // Safe loading spinner gap handler 
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-['Plus_Jakarta_Sans']">
        <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Unauthorized Warning View Layout Block
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 font-['Plus_Jakarta_Sans'] text-center">
        <div className="bg-white border border-neutral-200 rounded-[32px] p-8 max-w-sm space-y-6 shadow-sm">
          <div className="w-12 h-12 bg-red-50 text-red-500 flex items-center justify-center mx-auto rounded-2xl border border-red-100">
            <ShieldX size={22} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-neutral-900 tracking-tight">Access Restricted</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your profile credentials lack management elevation scopes required to enter this console layer.
            </p>
          </div>
          <button onClick={() => window.location.href = '/'} className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-3.5 rounded-xl transition-all">
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteReservation = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/reservations/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setReservations(prev => prev.filter(item => item.id !== id));
        showNotification("Reservation row purged cleanly.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeSessionId) return;

    const userDisplayName = messages.find(m => m.session_id === activeSessionId)?.name || "Customer";
    const outgoingPayload = {
      session_id: activeSessionId,
      name: userDisplayName,
      sender: 'admin' as const,
      message: replyText
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(outgoingPayload));
      setMessages(prev => [...prev, { ...outgoingPayload, id: Date.now(), created_at: new Date().toISOString() }]);
      setReplyText('');
    } else {
      try {
        const res = await fetch(`${API_BASE}/api/messages`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(outgoingPayload)
        });
        if (res.ok) {
          const newMsg = await res.json();
          setMessages(prev => [...prev, newMsg]);
          setReplyText('');
        }
      } catch (err) {
        console.error("Message transmission failure:", err);
      }
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    gsap.fromTo('.tab-content-panel', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
  };

  const groupedThreads = messages.reduce<Record<string, MessageItem[]>>((acc, msg) => {
    acc[msg.session_id] = acc[msg.session_id] || [];
    acc[msg.session_id].push(msg);
    return acc;
  }, {});

  const currentChatHistory = activeSessionId ? groupedThreads[activeSessionId] || [] : [];

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
                {activeTab} <span className="text-orange-500">Dashboard</span>
              </h1>
            </div>
          </div>

          {notification && (
            <div className="p-4 bg-neutral-900 text-white rounded-xl text-xs font-bold shadow-md w-fit">
              {notification}
            </div>
          )}

          <div className="bg-white border border-neutral-200 rounded-3xl p-6 min-h-[550px] shadow-sm flex flex-col justify-start items-stretch gap-4">
            {activeTab === 'messages' && (
              Object.keys(groupedThreads).length === 0 ? (
                <div className="text-center py-20 space-y-3 m-auto">
                  <MessageSquare size={32} className="mx-auto text-neutral-300" />
                  <p className="text-neutral-400 text-sm font-medium">No conversation threads found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
                  <div className="border border-neutral-100 rounded-2xl overflow-y-auto p-2 space-y-1 bg-neutral-50/50">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 block my-2">Active Conversations</span>
                    {Object.entries(groupedThreads).map(([sessionId, msgs]) => {
                      const latestMsg = msgs[msgs.length - 1];
                      const isSelected = sessionId === activeSessionId;
                      return (
                        <button key={sessionId} type="button" onClick={() => setActiveSessionId(sessionId)} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${isSelected ? 'bg-white border border-neutral-200 shadow-sm' : 'hover:bg-neutral-100/70'}`}>
                          <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><User size={14} /></div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-neutral-800 text-xs truncate">{latestMsg.name}</h4>
                            <p className="text-[11px] text-neutral-400 truncate mt-0.5">{latestMsg.message}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="md:col-span-2 border border-neutral-100 rounded-2xl flex flex-col justify-between overflow-hidden bg-white">
                    {activeSessionId ? (
                      <>
                        <div className="p-4 border-b border-neutral-100 bg-neutral-50/40 flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                            Conversation Thread: <span className="text-orange-500">{currentChatHistory[0]?.name}</span>
                          </span>
                          <span className="text-[10px] bg-neutral-200/60 font-mono text-neutral-500 px-2 py-0.5 rounded">
                            ID: {activeSessionId.slice(0, 8)}
                          </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
                          {currentChatHistory.map((msg) => {
                            const isAdmin = msg.sender === 'admin';
                            return (
                              <div key={msg.id} className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${isAdmin ? 'bg-neutral-900 text-white rounded-br-none self-end' : 'bg-neutral-100 text-neutral-800 rounded-bl-none self-start'}`}>
                                <p>{msg.message}</p>
                              </div>
                            );
                          })}
                        </div>

                        <form onSubmit={handleSendReply} className="p-3 border-t border-neutral-100 flex items-center gap-2 bg-neutral-50/30">
                          <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type an official response..." className="flex-1 bg-white text-xs border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 text-neutral-800" />
                          <button type="submit" className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors shrink-0"><Send size={14} /></button>
                        </form>
                      </>
                    ) : (
                      <div className="m-auto text-neutral-400 text-xs">Select a user thread to begin replying.</div>
                    )}
                  </div>
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
                        <button type="button" onClick={() => handleDeleteReservation(res.id)} className="p-2.5 bg-neutral-100 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100 active:scale-95"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <aside className="animate-sidebar w-64 md:w-72 bg-white border-l border-neutral-200 flex flex-col justify-between p-6 shadow-sm shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-orange-500 text-white p-2 rounded-xl shadow-lg shadow-orange-500/20"><LayoutDashboard size={20} /></div>
            <div>
              <h2 className="font-black text-neutral-900 text-base tracking-tight">Himalayan Hub</h2>
              <span className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>

          <nav className="space-y-2">
            {(['messages', 'reservations'] as AdminTab[]).map((tab) => (
              <button key={tab} type="button" onClick={() => handleTabChange(tab)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all group ${activeTab === tab ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'}`}>
                <div className="flex items-center gap-3">
                  {tab === 'messages' && <MessageSquare size={16} />}
                  {tab === 'reservations' && <CalendarCheck size={16} />}
                  <span className="capitalize">{tab}</span>
                </div>
                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === tab ? 'text-white' : 'text-neutral-400'}`} />
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-100">
          <button onClick={terminateSession} type="button" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>
    </div>
  );
}