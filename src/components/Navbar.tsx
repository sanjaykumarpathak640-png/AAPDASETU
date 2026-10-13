'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { useLanguage } from './LanguageContext';
import {
  Menu,
  X,
  AlertCircle,
  Map,
  Shield,
  Layers,
  Truck,
  Navigation,
  Users,
  WifiOff,
  CheckSquare,
  LayoutDashboard,
  ShieldAlert,
  User,
  Globe,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { href: '/map', label: t('nav_map'), icon: Map },
    { href: '/warnings', label: t('nav_warnings'), icon: ShieldAlert },
    { href: '/shelters', label: t('nav_shelters'), icon: Shield },
    { href: '/resources', label: t('nav_resources'), icon: Truck },
    { href: '/route', label: t('nav_route'), icon: Navigation },
    { href: '/family', label: t('nav_family'), icon: Users },
    { href: '/checklist', label: t('nav_checklist'), icon: CheckSquare },
    { href: '/offline', label: t('nav_offline'), icon: WifiOff },
  ];

  const isAdminPage = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-navy-950/95 backdrop-blur-md">
      {/* Top emergency status ticker */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border-b border-red-900/40 px-3 py-1 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-red-600 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
            DEMO MODE
          </span>
          <span className="truncate">
            Simulated Flood Response Scenario: Kosi & Ganga Riparian Basin (Bihar Demo). Helplines: <strong>112</strong> | <strong>1077</strong>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-[11px]"
            title="Toggle English / Hindi"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Logo size="md" showTagline={true} />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: SOS Button + Admin Switch / Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Prominent Emergency SOS CTA */}
            <Link
              href="/sos"
              className="relative group inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-900/50 hover:shadow-red-700/60 hover:from-red-500 hover:to-rose-600 border border-red-400/40 transition-all scale-100 hover:scale-[1.03] active:scale-95"
            >
              <AlertCircle className="w-4 h-4 animate-bounce" />
              <span>{t('btn_sos')}</span>
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />
            </Link>

            {/* Admin or Profile */}
            <Link
              href="/admin"
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isAdminPage
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700 hover:border-slate-600'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('nav_admin')}</span>
            </Link>

            {/* Profile or Login */}
            <Link
              href={user ? '/profile' : '/login'}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700"
              title={user ? `Signed in as ${user.name} (${user.role})` : 'Sign in'}
            >
              <User className="w-4 h-4 text-cyan-400" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-navy-900/98 px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/40 px-3 py-2 rounded-lg border border-amber-600/30"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Command Center</span>
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              {user ? user.name : 'Sign in / Switch Role'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

