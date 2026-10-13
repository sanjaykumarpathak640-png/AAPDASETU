'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapComponent } from '@/components/MapComponent';
import {
  Layers,
  MapPin,
  Shield,
  Activity,
  Home,
  Hospital,
  Truck,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

export default function FloodRiskMapPage() {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/risk-zones')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setZones(data);
          setSelectedZone(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-navy-900/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white">
                Interactive Flood Risk Map
              </h1>
              <p className="text-[11px] text-slate-400">
                OpenStreetMap GIS Telemetry • Real-time Multi-hazard Layers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60">
              DEMO GEOSPATIAL DATA
            </span>
            <Link
              href="/shelters"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            >
              Shelter Directory
            </Link>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Map Column */}
        <div className="flex-1 min-h-[550px] lg:min-h-[680px] flex flex-col">
          <MapComponent
            center={[25.75, 85.75]}
            zoom={9}
            showAdminLayers={false}
            onSelectZone={(zone) => setSelectedZone(zone)}
          />
        </div>

        {/* Side Panel: Selected Zone Details & Critical Text Alternative */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          {/* Active Sector Summary */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Zone Details
                </h3>
              </div>
              {selectedZone && (
                <RiskBadge level={selectedZone.riskLevel} score={selectedZone.riskScore} size="sm" />
              )}
            </div>

            {selectedZone ? (
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedZone.name}</h4>
                  <div className="text-[11px] text-slate-400">
                    District: {selectedZone.district}, {selectedZone.state}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Rainfall</span>
                    <span className="font-bold text-white text-sm font-mono">{selectedZone.rainfallMm} mm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Water Level</span>
                    <span className="font-bold text-white text-sm font-mono">{selectedZone.waterLevelM} m</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Waterbody</span>
                  <span className="text-white font-medium">{selectedZone.primaryRiver || 'Basin Channel'}</span>
                  <div className="text-[11px] text-slate-400 pt-0.5">
                    Est. Affected Population: <strong>{selectedZone.population.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <Link
                    href={`/shelters`}
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs text-center transition-colors"
                  >
                    Find Nearby Shelters
                  </Link>
                  <Link
                    href={`/route`}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Safe Route
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">
                Click any colored risk circle on the map to inspect telemetry.
              </div>
            )}
          </div>

          {/* Accessible Text Alternative Directory */}
          <div className="flex-1 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 overflow-y-auto max-h-[380px]">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Info className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Text-Based Sector Index (Accessible)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              High-contrast text summary for screen readers & low-bandwidth conditions:
            </p>

            <div className="space-y-2">
              {zones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedZone?.id === z.id
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{z.name}</span>
                    <RiskBadge level={z.riskLevel} size="sm" showIcon={false} />
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{z.district} • {z.primaryRiver}</span>
                    <span className="font-mono">{z.riskScore}/100</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

