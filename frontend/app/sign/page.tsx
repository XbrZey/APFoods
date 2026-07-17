"use client";

import React, { useState, useRef } from 'react';
import { User, Mail, Lock, Sparkles, LogIn, UserPlus, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type AuthMode = 'signin' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Status tracking states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeBgRef = useRef<HTMLDivElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Entry GSAP structural animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });
    tl.from('.animate-card', { y: 40, opacity: 0, scale: 0.98 })
      .from('.animate-input', { y: 15, opacity: 0, stagger: 0.08 }, '-=0.6');
  }, { scope: containerRef });

  const handleModeToggle = (targetMode: AuthMode, index: number) => {
    if (mode === targetMode) return;
    setMode(targetMode);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Slide selection background pillar
    gsap.to(activeBgRef.current, {
      x: index * 100 + '%',
      duration: 0.4,
      ease: 'back.out(1.1)'
    });

    // Content fade stagger flipper
    gsap.fromTo('.animate-input', 
      { opacity: 0, x: targetMode === 'signup' ? 20 : -20 },
      { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out' }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/signin';
    const payload = mode === 'signup' 
      ? { email, full_name: fullName, password }
      : { email, password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Authentication operation failed.');
      }

      if (mode === 'signup') {
        setSuccessMsg("Account successfully registered! Switching to Sign In...");
        setFullName('');
        setTimeout(() => handleModeToggle('signin', 0), 2000);
      } else {
        setSuccessMsg("Logged in successfully! Redirecting...");
        // Save Access Bearer Authentication Token
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('token_type', data.token_type);
        setTimeout(() => window.location.href = '/', 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not connect to authentication services.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-neutral-50 flex flex-col justify-center items-center p-6 font-['Plus_Jakarta_Sans'] select-none">
      
      <div className="animate-card w-full max-w-md bg-white border border-neutral-200 rounded-[32px] p-8 shadow-sm space-y-8 relative">
        
        {/* Upper Title Identity Block */}
        <div className="text-center space-y-2">
          <span className="text-green-700 font-bold tracking-wider text-[10px] uppercase bg-orange-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mx-auto">
            <Sparkles size={11} /> Guest Portals
          </span>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            {mode === 'signin' ? 'Welcome Back to' : 'Join'} <span className="text-green-700">APFoods</span>
          </h1>
          <p className="text-xs text-neutral-400">
            {mode === 'signin' ? 'Enter credentials to manage active culinary tables' : 'Create an account to track your orders and spaces'}
          </p>
        </div>

        {/* Sliding Slider Mode Toggle */}
        <div className="bg-neutral-100 p-1.5 rounded-2xl flex relative border border-neutral-200/40">
          <div 
            ref={activeBgRef} 
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm z-0 transition-transform" 
          />
          <button 
            type="button" 
            onClick={() => handleModeToggle('signin', 0)} 
            className={`flex-1 py-3 text-xs font-black relative z-10 text-center transition-colors ${mode === 'signin' ? 'text-green-700' : 'text-neutral-500'}`}
          >
            Sign In
          </button>
          <button 
            type="button" 
            onClick={() => handleModeToggle('signup', 1)} 
            className={`flex-1 py-3 text-xs font-black relative z-10 text-center transition-colors ${mode === 'signup' ? 'text-green-700' : 'text-neutral-500'}`}
          >
            Create Account
          </button>
        </div>

        {/* Status Prompt Elements */}
        {errorMsg && (
          <div className="p-4 bg-red-50/70 border border-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2.5 animate-input">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-green-50/70 border border-green-100 text-green-800 text-xs font-bold rounded-xl flex items-center gap-2.5 animate-input">
            <CheckCircle2 size={14} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Input Fields Form Grid */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <div className="space-y-1.5 animate-input">
              <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"><User size={15} /></span>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rohan Adhikari" 
                  required={mode === 'signup'}
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-green-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 animate-input">
            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"><Mail size={15} /></span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@example.com" 
                required 
                className="w-full pl-11 pr-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-green-600 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5 animate-input">
            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Password Signature</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"><Lock size={15} /></span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                required 
                className="w-full pl-11 pr-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-green-600 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {mode === 'signin' && (
            <div className="text-right animate-input">
              <button type="button" className="text-[11px] font-bold text-green-700 hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <div className="pt-4 animate-input">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-700 text-white py-4 rounded-xl font-bold transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-2 text-xs active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Verify Credentials' : 'Create Guest Profile'}</span>
                  {mode === 'signin' ? <LogIn size={14} /> : <UserPlus size={14} />}
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}