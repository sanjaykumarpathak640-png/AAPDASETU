'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapComponent } from '@/components/MapComponent';
import {
  Layers,
  MapPin,
  LifeBuoy,
  Home,
  AlertTriangle,
  Activity,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

export default function AdminLiveOpsMapPage() {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [sosCases, setSosCases] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/sos')
      .then((r) => r.json())
      .then((data) => setSosCases(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 flex flex-col">
      {/* Top Banner */}
      <div className="border-b border-amber-900/40 bg-navy-900/90 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h1 className="text-sm sm:text-base font-bold text-white">
              Incident Command Live Operational Map
            </h1>
            <span className="text-[10px] bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded border border-red-800">
              Active SOS Overlay Enabled
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">
              Open Incidents: <strong>{sosCases.filter((s) => s.status !== 'RESOLVED').length}</strong>
            </span>
            <Link
              href="/admin/rescue"
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors"
            >
              Dispatch Center
            </Link>
          </div>
        </div>
      </div>

      {/* Main Map View */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-h-[550px] lg:min-h-[700px]">
          <MapComponent
            center={[25.75, 85.75]}
            zoom={9}
            showAdminLayers={true}
            onSelectZone={(zone) => setSelectedZone(zone)}
          />
        </div>

        {/* Side Panel: Incident Inspector */}
        <div className="w-full lg:w-96 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Operational Sector Inspector
                </h3>
              </div>
              {selectedZone && (
                <RiskBadge level={selectedZone.riskLevel} score={selectedZone.riskScore} size="sm" />
              )}
            </div>

            {selectedZone ? (
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="text-base font-bold text-white">{selectedZone.name}</h4>
                  <div className="text-[11px] text-slate-400">
                    District Jurisdiction: {selectedZone.district} DEOC
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Population Exposed</span>
                    <span className="font-bold text-white text-sm font-mono">
                      {selectedZone.population.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Water Level / Rain</span>
                    <span className="font-bold text-white text-sm font-mono">
                      {selectedZone.waterLevelM}m / {selectedZone.rainfallMm}mm
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-slate-300">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Command Directives</div>
                  <p className="text-[11px] leading-relaxed">
                    Prioritize high-clearance amphibious rescue boat movement along elevated national highways. Avoid low-lying riverfront bridges.
                  </p>
                </div>

                <Link
                  href="/admin/rescue"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LifeBuoy className="w-4 h-4" />
                  <span>Review Sector SOS Incidents</span>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                Click any colored risk sector or SOS marker on the map to inspect operational telemetry.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

