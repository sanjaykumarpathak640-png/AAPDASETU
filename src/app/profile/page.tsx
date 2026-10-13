'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Shield,
  Phone,
  Mail,
  LogOut,
  RotateCcw,
  Check,
  ExternalLink,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-8">
      <div className="pb-6 border-b border-slate-800 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white">User Session & Roles</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Account details and role-based permissions in the AAPDASETU network.
        </p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400">Loading session details...</div>
      ) : user ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                Role: {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Email: <strong>{user.email}</strong></span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Phone: <strong>{user.phone}</strong></span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Switch Demo Account Role</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <p className="text-xs text-slate-300">You are browsing as an unauthenticated guest.</p>
          <Link
            href="/login"
            className="inline-block px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
          >
            Sign in with a Demo Account
          </Link>
        </div>
      )}
    </div>
  );
}

