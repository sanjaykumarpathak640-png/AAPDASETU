'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Map,
  LifeBuoy,
  Home,
  Package,
  BellRing,
  BarChart3,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const links = [
    { href: '/admin', label: 'Command Center', icon: LayoutDashboard },
    { href: '/admin/map', label: 'Live Ops Map', icon: Map },
    { href: '/admin/rescue', label: 'Rescue Management', icon: LifeBuoy },
    { href: '/admin/shelters', label: 'Shelter Ops', icon: Home },
    { href: '/admin/relief', label: 'Relief Prediction', icon: Package },
    { href: '/admin/alerts', label: 'Alert Manager', icon: BellRing },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleResetDemo = async () => {
    if (!confirm('Are you sure you want to restore demo disaster data to its clean initial state?')) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch('/api/admin/reset-demo', { method: 'POST' });
      if (res.ok) {
        setResetSuccess(true);
        setTimeout(() => {
          setResetSuccess(false);
          window.location.reload();
        }, 1200);
      } else {
        alert('Reset error');
      }
    } catch (err) {
      alert('Error contacting reset endpoint');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-navy-950 border-b border-amber-900/40">
      {/* Top operational bar */}
      <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-navy-900 px-4 py-1.5 text-xs text-amber-200 border-b border-amber-800/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="font-bold tracking-wide uppercase text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
            INCIDENT COMMAND SYSTEM (ICS)
          </span>
          <span className="hidden md:inline text-slate-300 text-xs">
            Operational Region: Bihar Riparian Zone | NDRF / SDRF / DDMA Unified Control
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Reset Demo Button */}
          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-all disabled:opacity-50"
            title="Reset sample shelters, SOS cases, and inventory"
          >
            {resetSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Reset Done!</span>
              </>
            ) : (
              <>
                <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${resetting ? 'animate-spin' : ''}`} />
                <span>{resetting ? 'Resetting...' : 'Reset Demo Data'}</span>
              </>
            )}
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-medium"
          >
            <span>Citizen View</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Admin Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Logo size="sm" showTagline={false} />
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              COMMAND CENTER
            </span>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto py-1">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;

