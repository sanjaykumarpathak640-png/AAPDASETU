'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Users,
  ShieldCheck,
  LifeBuoy,
  Clock,
  Download,
  RefreshCw,
} from 'lucide-react';

const SEVERITY_COLORS: Record<string, string> = {
  EXTREME: '#ef4444',
  HIGH: '#f97316',
  MODERATE: '#f59e0b',
  LOW: '#10b981',
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = () => {
    setLoading(true);
    fetch('/api/analytics/overview')
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const summary = data?.summary;
  const charts = data?.charts;

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
              Operations Intelligence
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Database-Driven Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Disaster Operational Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time Recharts visualizations derived from verified incident records, water gauge telemetry, and shelter registries.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Computing chart aggregates from database...</p>
        </div>
      ) : (
        <>
          {/* TOP IMPACT METRICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
              <span className="text-xs font-semibold text-slate-400">Citizens Evacuated / Assisted</span>
              <div className="text-3xl font-black font-mono text-emerald-400">
                {summary?.peopleAssisted || 0}
              </div>
              <span className="text-[11px] text-slate-400">From resolved incidents</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
              <span className="text-xs font-semibold text-slate-400">Vulnerable People Assisted</span>
              <div className="text-3xl font-black font-mono text-purple-400">
                {summary?.vulnerablePeopleAssisted || 0}
              </div>
              <span className="text-[11px] text-purple-300">Elderly, children & mobility</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
              <span className="text-xs font-semibold text-slate-400">Resolved Rescue Missions</span>
              <div className="text-3xl font-black font-mono text-cyan-400">
                {summary?.resolvedRescues || 0}
              </div>
              <span className="text-[11px] text-slate-400">Cases cleared successfully</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
              <span className="text-xs font-semibold text-slate-400">Average Response Interval</span>
              <div className="text-3xl font-black font-mono text-amber-400">
                {summary?.avgResponseMinutes || 48} mins
              </div>
              <span className="text-[11px] text-slate-400">Dispatch to resolution</span>
            </div>
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Risk Zones by Severity (Pie Chart) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Risk Zones by Severity Tier
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Geographic Distribution</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts?.riskBySeverity || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {charts?.riskBySeverity?.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SEVERITY_COLORS[entry.name] || '#3b82f6'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Rescue Requests by Emergency Type (Bar Chart) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    SOS Requests by Emergency Type
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Incident Demand</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.rescuesByType || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="type" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" height={45} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Shelter Occupancy Percentages (Bar Chart) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Shelter Occupancy vs Total Capacity
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Beds Filled</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.shelterOccupancy || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" height={45} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="occupied" fill="#3b82f6" name="Occupied Beds" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="total" fill="#1e293b" name="Total Capacity" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: River Water Level & Rainfall Trends Over Time (Line Chart) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Hydrology Time-Series Telemetry
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Water Level (m) & Rain (mm)</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts?.waterLevelTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="waterLevel" stroke="#06b6d4" name="Water Level (m)" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="rainfall" stroke="#3b82f6" name="Rainfall (mm)" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

