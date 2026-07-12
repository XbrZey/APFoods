"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Sparkles, User, HelpCircle, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ChatMessage {
  id?: number;
  session_id: string;
  name: string;
  sender: 'user' | 'admin';
  message: string;
  created_at?: string;
}

export default function MainContact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Table Arrangements / Special Request');
  const [messageText, setMessageText] = useState('');
  const [sessionId, setSessionId] = useState('');
  
  // Real-Time Interaction UI States
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [liveConversation, setLiveConversation] = useState<ChatMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Environmental definitions falling back to local if undefined
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

  // 1. Initialize session and fetch history
  useEffect(() => {
    let localSessionId = localStorage.getItem('himalayan_hub_session');
    if (!localSessionId) {
      localSessionId = `client_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('himalayan_hub_session', localSessionId);
    }
    setSessionId(localSessionId);

    const fetchThreadHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/messages/thread/${localSessionId}`);
        if (res.ok) {
          const historicalLogs = await res.json();
          if (historicalLogs.length > 0) {
            setLiveConversation(historicalLogs);
            setIsSubmitted(true);
            setName(historicalLogs[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to load conversation context:", err);
      }
    };
    fetchThreadHistory();

    // 2. Open Persistent WebSocket Targeted to production/local backend url
    const ws = new WebSocket(`${WS_BASE}/api/ws/${localSessionId}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const incomingMsg: ChatMessage = JSON.parse(event.data);
      setLiveConversation((prev) => {
        if (prev.some(m => m.id === incomingMsg.id)) return prev;
        return [...prev, incomingMsg];
      });
    };

    ws.onerror = (error) => {
      console.error("User transmission stream offline:", error);
    };

    return () => {
      ws.close();
    };
  }, [API_BASE, WS_BASE]);

  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });

    tl.from('.animate-header > *', { y: 25, opacity: 0, stagger: 0.12 })
      .from('.animate-card', { x: -30, opacity: 0, stagger: 0.1 }, '-=0.6')
      .from('.animate-form', { x: 30, opacity: 0 }, '-=0.8');

    gsap.to('.blob-1', { scale: 1.2, x: '+=20', y: '-=30', duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.blob-2', { scale: 1.1, x: '-=30', y: '+=20', duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
  }, { scope: containerRef });

  // 3. Dispatch Initial Form Submission
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim() || !sessionId) return;

    const consolidatedMessage = `[${subject}] ${messageText}`;
    const payload: ChatMessage = {
      session_id: sessionId,
      name: name,
      sender: 'user',
      message: consolidatedMessage
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      setLiveConversation([{ ...payload, id: Date.now(), created_at: new Date().toISOString() }]);
      setIsSubmitted(true);
      setMessageText('');
    } else {
      fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then((res) => {
        if (res.ok) {
          setIsSubmitted(true);
          setMessageText('');
        }
      });
    }
  };

  // 4. Send follow-up messages
  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !sessionId) return;

    const payload: ChatMessage = {
      session_id: sessionId,
      name: name,
      sender: 'user',
      message: adminReplyText
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      setLiveConversation(prev => [...prev, { ...payload, id: Date.now(), created_at: new Date().toISOString() }]);
      setAdminReplyText('');
    }
  };

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
        {/* Sidebar Info */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="animate-card flex-1 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex items-start gap-4 hover:border-orange-300 transition-colors">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shrink-0"><Phone size={18} /></div>
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Call the Kitchen</h4>
              <p className="text-sm font-bold text-neutral-800 mt-1">+977 (01) 4412345</p>
            </div>
          </div>

          <div className="animate-card flex-1 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex items-start gap-4 hover:border-orange-300 transition-colors">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shrink-0"><Mail size={18} /></div>
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Catering & Events</h4>
              <p className="text-sm font-bold text-neutral-800 mt-1">namaste@foodie.com</p>
            </div>
          </div>

          <div className="animate-card flex-1 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex items-start gap-4 hover:border-orange-300 transition-colors">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shrink-0"><MapPin size={18} /></div>
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Find Our Tables</h4>
              <p className="text-sm font-bold text-neutral-800 mt-1">Jhamsikhel-03, Lalitpur</p>
            </div>
          </div>
        </div>

        {/* Dynamic Panel */}
        <div className="animate-form lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xl min-h-[420px] flex flex-col">
          {!isSubmitted ? (
            <form onSubmit={handleInitialSubmit} className="space-y-6 h-full flex flex-col justify-between flex-1">
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
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Aayush Shrestha"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 bg-neutral-50/50 shadow-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700">Subject</label>
                  <div className="relative">
                    <HelpCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <select 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 bg-neutral-50/50 shadow-sm focus:outline-none appearance-none"
                    >
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
                    rows={4}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Let us know what configuration accommodations you need..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 bg-neutral-50/50 shadow-sm resize-none focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full sm:w-auto bg-orange-500 text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-orange-600 transition-all text-sm">
                  Send Message to Kitchen
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col justify-between flex-1 h-full max-h-[450px]">
              <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-900">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-sm font-black">Live Concierge Pipeline Active</span>
                </div>
                <span className="text-[10px] bg-orange-50 text-orange-600 font-bold px-2 py-0.5 rounded-full">Logged as: {name}</span>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3 flex flex-col min-h-[220px]">
                {liveConversation.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={idx}
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isUser ? 'bg-orange-500 text-white rounded-br-none self-end' : 'bg-neutral-100 text-neutral-800 rounded-bl-none self-start'
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendFollowUp} className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                <input
                  type="text"
                  required
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  placeholder="Type an additional message directly to our staff..."
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs focus:outline-none text-neutral-800"
                />
                <button type="submit" className="bg-neutral-900 hover:bg-neutral-800 text-white p-3 rounded-xl transition-colors text-xs font-bold">
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}