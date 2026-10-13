import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Phone, Shield, ExternalLink, AlertTriangle, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-navy-950 text-slate-400 text-sm">
      {/* Prominent Statutory / Safety Disclaimer */}
      <div className="bg-amber-950/40 border-b border-amber-900/40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong>STATUTORY SAFETY NOTICE:</strong> This demonstration platform uses simulated sensor telemetry, model indicators, and sample logistics data for operational training and evaluation. It is <strong>not</strong> an official government flood declaration or a replacement for National Disaster Management Authority (NDMA) directives. In a life-threatening crisis, dial <strong>112</strong> or <strong>1077</strong> immediately.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified disaster response ecosystem connecting flood-affected citizens with verified shelters, hazard-free navigation, family welfare tracking, and emergency incident dispatch.
            </p>
            <div className="pt-2 text-[11px] text-cyan-400 font-mono">
              Demo Geography: Bihar Riverine Basin
            </div>
          </div>

          {/* Quick Citizen Links */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Citizen Safety</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Risk Assessment Dashboard</Link></li>
              <li><Link href="/map" className="hover:text-cyan-400 transition-colors">Interactive Hazard Map</Link></li>
              <li><Link href="/shelters" className="hover:text-cyan-400 transition-colors">Smart Shelter Finder</Link></li>
              <li><Link href="/route" className="hover:text-cyan-400 transition-colors">Safe Evacuation Route</Link></li>
              <li><Link href="/sos" className="text-red-400 font-semibold hover:text-red-300">Submit Emergency SOS</Link></li>
              <li><Link href="/offline" className="hover:text-cyan-400 transition-colors">Offline Emergency Mode</Link></li>
            </ul>
          </div>

          {/* Command & Responder */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Responder ICS</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/admin" className="hover:text-amber-400 transition-colors">Incident Command Center</Link></li>
              <li><Link href="/admin/rescue" className="hover:text-amber-400 transition-colors">SOS Dispatch & Triage</Link></li>
              <li><Link href="/admin/shelters" className="hover:text-amber-400 transition-colors">Shelter Capacity Manager</Link></li>
              <li><Link href="/admin/relief" className="hover:text-amber-400 transition-colors">Relief Shortage Prediction</Link></li>
              <li><Link href="/admin/alerts" className="hover:text-amber-400 transition-colors">Public Warning System</Link></li>
              <li><Link href="/admin/analytics" className="hover:text-amber-400 transition-colors">Operational Analytics</Link></li>
            </ul>
          </div>

          {/* 24x7 Emergency Helplines */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">24x7 Emergency Helplines</h4>
            <div className="space-y-2">
              <a
                href="tel:112"
                className="flex items-center gap-2 p-2 rounded-lg bg-red-950/40 border border-red-800/40 hover:bg-red-900/50 transition-colors text-white"
              >
                <Phone className="w-4 h-4 text-red-400" />
                <div>
                  <div className="text-xs font-bold">112 — National Emergency</div>
                  <div className="text-[10px] text-slate-400">Police, Fire, Disaster Dispatch</div>
                </div>
              </a>
              <a
                href="tel:1077"
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800/80 transition-colors text-white"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold">1077 — District Disaster Control</div>
                  <div className="text-[10px] text-slate-400">Flood Boat Rescue & DEOC Operations</div>
                </div>
              </a>
              <a
                href="tel:108"
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800/80 transition-colors text-white"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold">108 — Ambulance Helpline</div>
                  <div className="text-[10px] text-slate-400">Trauma & Emergency Medical Transport</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 AAPDASETU Disaster Management Platform. Built for humanitarian resilience.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/checklist" className="hover:text-slate-300">Preparedness Checklist</Link>
            <span>•</span>
            <Link href="/offline" className="hover:text-slate-300">PWA Offline Shell</Link>
            <span>•</span>
            <Link href="/profile" className="hover:text-slate-300">Demo Accounts</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

