'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  LifeBuoy,
  Home,
  Package,
  BellRing,
  AlertTriangle,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

export default function AdminCommandCenterPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentSOS, setRecentSOS] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/analytics/overview').then((r) => r.json()),
      fetch('/api/sos').then((r) => r.json()),
      fetch('/api/shelters').then((r) => r.json()),
    ])
      .then(([analyticsData, sosData, shelterData]) => {
        setAnalytics(analyticsData);
        setRecentSOS(Array.isArray(sosData) ? sosData.slice(0, 5) : []);
        setShelters(Array.isArray(shelterData) ? shelterData.slice(0, 5) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summary = analytics?.summary;

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/40">
              Joint Operations Command
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              NDRF / SDRF Incident Command Post
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Disaster Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time emergency telemetry, rescue queue dispatch, shelter bed vacancies, and relief inventory shortages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Aggregating district emergency operations data...</p>
        </div>
      ) : (
        <>
          {/* SIX TOP-LEVEL OPERATIONAL METRICS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Metric 1 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Alerts</span>
              <div className="text-2xl font-black font-mono text-red-400">
                {summary?.activeAlerts || 0}
              </div>
              <span className="text-[10px] text-slate-400">Public advisories</span>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High Risk Zones</span>
              <div className="text-2xl font-black font-mono text-orange-400">
                {summary?.highRiskAreas || 0}
              </div>
              <span className="text-[10px] text-slate-400">High / Extreme sectors</span>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Open SOS Cases</span>
              <div className="text-2xl font-black font-mono text-rose-400">
                {summary?.openRescues || 0}
              </div>
              <span className="text-[10px] text-rose-300 font-semibold">{summary?.unassignedRescues} unassigned</span>
            </div>

            {/* Metric 4 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shelter Occupancy</span>
              <div className="text-2xl font-black font-mono text-blue-400">
                {summary?.avgShelterOccupancy || 0}%
              </div>
              <span className="text-[10px] text-slate-400">{summary?.totalOccupiedCap} / {summary?.totalShelterCap} beds</span>
            </div>

            {/* Metric 5 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">People Assisted</span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {summary?.peopleAssisted || 0}
              </div>
              <span className="text-[10px] text-slate-400">{summary?.resolvedRescues} resolved cases</span>
            </div>

            {/* Metric 6 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock Warnings</span>
              <div className="text-2xl font-black font-mono text-amber-400">
                {summary?.shortageWarningsCount || 0}
              </div>
              <span className="text-[10px] text-amber-300">Depleting &lt; 3 days</span>
            </div>
          </div>

          {/* MAIN TWO-COLUMN DASHBOARD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: High Priority Incident Triage Queue */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-red-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    Emergency Rescue Queue (Urgent First)
                  </h2>
                </div>
                <Link
                  href="/admin/rescue"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  <span>Full Rescue Manager</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {recentSOS.map((sos) => (
                  <div
                    key={sos.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400 text-sm">
                          {sos.requestNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-300 border border-red-800">
                          {sos.priorityLevel} ({sos.priorityScore} pts)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950 text-slate-300">
                          {sos.emergencyType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-medium">
                        {sos.description}
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>Cluster: <strong>{sos.peopleCount} persons</strong></span>
                        <span>Location: <strong>{sos.address}</strong></span>
                        {sos.responder && (
                          <span className="text-cyan-300 font-semibold">
                            Assigned: {sos.responder.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                          sos.status === 'REPORTED'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                            : sos.status === 'ASSIGNED'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : sos.status === 'EN_ROUTE'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {sos.status}
                      </span>
                      <Link
                        href={`/admin/rescue`}
                        className="py-1 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                      >
                        Triage Case
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Shelter Capacities & Critical Shortages */}
            <div className="space-y-6">
              {/* Shelter Capacities Overview */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Shelter Occupancy
                    </h3>
                  </div>
                  <Link href="/admin/shelters" className="text-xs text-cyan-400 hover:underline">
                    Manage
                  </Link>
                </div>

                <div className="space-y-3">
                  {shelters.map((item) => {
                    const s = item.shelter || item;
                    const occPct = s.totalCapacity ? Math.round((s.occupiedCapacity / s.totalCapacity) * 100) : 0;
                    return (
                      <div key={s.id} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white truncate max-w-[180px]">{s.name}</span>
                          <span className="font-mono text-slate-300">{occPct}% ({s.availableBeds} free)</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              occPct > 85 ? 'bg-red-500' : occPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${occPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resource Stock Shortages Alert */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Critical Stock Warnings
                    </h3>
                  </div>
                  <Link href="/admin/relief" className="text-xs text-amber-400 hover:underline">
                    Projections
                  </Link>
                </div>

                {analytics?.criticalShortages?.length === 0 ? (
                  <p className="text-xs text-slate-400">All relief centers maintain &gt;3 days coverage.</p>
                ) : (
                  <div className="space-y-2">
                    {analytics?.criticalShortages?.slice(0, 3).map((sh: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950 border border-amber-900/50 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-white">{sh.resourceType.replace(/_/g, ' ')}</div>
                          <div className="text-[10px] text-red-400 font-semibold">{sh.statusText}</div>
                        </div>
                        <span className="font-mono text-cyan-300 font-bold">
                          +{sh.suggestedReplenishment} needed
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

