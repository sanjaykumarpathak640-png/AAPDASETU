'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  MapPin,
  HelpCircle,
  ArrowRight,
  Home,
  Navigation,
  Layers,
  ChevronDown,
  Info,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

export default function WarningsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  useEffect(() => {
    fetch('/api/alerts')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAlerts(data);
          setSelectedAlert(data[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded border border-red-800/50">
            Emergency Advisory Stream
          </span>
          <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
            DEMO ALERT — NOT AN OFFICIAL WARNING
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Early Warning Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
          Explainable flood warnings with contributing hydrology parameters, official advisories, and immediate evacuation guidance.
        </p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Fetching active flood warning bulletins...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Bulletins List (1 col) */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Bulletins ({alerts.length})
            </h2>

            <div className="space-y-3">
              {alerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                return (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-xs space-y-2.5 ${
                      isSelected
                        ? 'bg-slate-900 border-red-500/50 shadow-lg shadow-red-950/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <RiskBadge level={alert.severity} size="sm" />
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.validFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm leading-snug">
                      {alert.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{alert.area}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Warning Deep-Dive & Explanation (2 cols) */}
          {selectedAlert && (
            <div className="lg:col-span-2 space-y-6">
              {/* Primary Advisory Card */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={selectedAlert.severity} size="md" />
                    <span className="text-xs text-slate-400 font-mono">
                      Issued by: <strong>{selectedAlert.issuingAuthority}</strong>
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Valid Until: {new Date(selectedAlert.validTo).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {selectedAlert.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-medium">
                    <MapPin className="w-4 h-4" />
                    <span>Targeted Sectors: {selectedAlert.area}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-2">
                    {selectedAlert.message}
                  </p>
                </div>

                {/* Directive Box */}
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 space-y-1.5">
                  <div className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Official Recommended Directive:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedAlert.recommendedAction}
                  </p>
                </div>

                {/* "Why am I seeing this warning?" - Explainable Section */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>Why am I seeing this warning? (Hydrological Rationale)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedAlert.reason}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      <strong className="text-cyan-400 block mb-0.5">Hydrologic Inflow</strong>
                      Active upstream release from barrage spillways creating localized river swell.
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      <strong className="text-amber-400 block mb-0.5">Topography & Drainage</strong>
                      Lowland depression prone to backwater flooding and road underpass blockages.
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <Link
                    href="/shelters"
                    className="p-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <Home className="w-4 h-4" />
                    <span>Find Safe Shelter</span>
                  </Link>

                  <Link
                    href="/route"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Navigation className="w-4 h-4 text-cyan-400" />
                    <span>Plan Safe Route</span>
                  </Link>

                  <Link
                    href="/map"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>View on Map</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

