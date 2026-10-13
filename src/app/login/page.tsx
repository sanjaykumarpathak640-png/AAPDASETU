'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Shield, User, Key, ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPass }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user?.role === 'ADMIN' || data.user?.role === 'RESPONDER') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg(data.error || 'Authentication failed');
      }
    } catch (err) {
      setErrorMsg('Network error connecting to login service');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (role: 'CITIZEN' | 'RESPONDER' | 'ADMIN') => {
    if (role === 'CITIZEN') {
      setEmail('citizen@aapdasetu.gov.in');
      setPassword('Citizen@12345');
      handleLogin(undefined, 'citizen@aapdasetu.gov.in', 'Citizen@12345');
    } else if (role === 'RESPONDER') {
      setEmail('responder@aapdasetu.gov.in');
      setPassword('Rescue@12345');
      handleLogin(undefined, 'responder@aapdasetu.gov.in', 'Rescue@12345');
    } else if (role === 'ADMIN') {
      setEmail('admin@aapdasetu.gov.in');
      setPassword('Admin@12345');
      handleLogin(undefined, 'admin@aapdasetu.gov.in', 'Admin@12345');
    }
  };

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center" />
          <h2 className="text-xl font-bold text-white pt-2">Sign in to AAPDASETU</h2>
          <p className="text-xs text-slate-400">
            Role-based authentication for citizens, responders, and disaster commanders.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Demo Switcher */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            One-Click Demo Evaluator Sign In
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => setDemoAccount('CITIZEN')}
              className="p-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900/60 font-bold transition-all"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('RESPONDER')}
              className="p-2 rounded-xl bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900/60 font-bold transition-all"
            >
              Responder
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('ADMIN')}
              className="p-2 rounded-xl bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900/60 font-bold transition-all"
            >
              Commander
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. citizen@aapdasetu.gov.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Need a citizen safety account?{' '}
          <Link href="/register" className="text-cyan-400 hover:underline font-semibold">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}

