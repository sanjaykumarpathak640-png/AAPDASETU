'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  MapPin,
  Shield,
  Phone,
  Check,
  X,
  Search,
  Filter,
  Navigation,
  Accessibility,
  HeartPulse,
  Droplets,
  Utensils,
  Zap,
  Info,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';

export default function ShelterFinderPage() {
  const [shelterResults, setShelterResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('safest'); // safest, nearest, occupancy
  const [filterMedical, setFilterMedical] = useState(false);
  const [filterAccessible, setFilterAccessible] = useState(false);
  const [selectedShelterModal, setSelectedShelterModal] = useState<any>(null);

  const fetchShelters = () => {
    setLoading(true);
    const params = new URLSearchParams({
      lat: '25.6154',
      lng: '85.1212',
      sort: sortBy,
      medical: filterMedical ? 'true' : 'false',
      accessible: filterAccessible ? 'true' : 'false',
    });

    fetch(`/api/shelters?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setShelterResults(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchShelters();
  }, [sortBy, filterMedical, filterAccessible]);

  const filtered = shelterResults.filter((item) => {
    const s = item.shelter;
    const q = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
  });

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
            Evacuation Destination Finder
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Multi-factor Safety Ranking Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Smart Shelter Finder
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Shelters ranked using a transparent 4-factor safety formula: <strong>Proximity (30%)</strong>, <strong>Available Capacity (20%)</strong>, <strong>Basin Inundation Buffer (20%)</strong>, and <strong>Essential Resources & Accessibility (30%)</strong>.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-lg">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by shelter name or sector (e.g. Digha, Stadium, School)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="safest" className="bg-slate-900">Highest Safety Score (Recommended)</option>
              <option value="nearest" className="bg-slate-900">Nearest Distance (km)</option>
              <option value="occupancy" className="bg-slate-900">Lowest Occupancy (%)</option>
            </select>
          </div>

          <button
            onClick={() => setFilterMedical(!filterMedical)}
            className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 transition-colors ${
              filterMedical
                ? 'bg-red-950/80 text-red-300 border-red-700'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Medical Post</span>
          </button>

          <button
            onClick={() => setFilterAccessible(!filterAccessible)}
            className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 transition-colors ${
              filterAccessible
                ? 'bg-blue-950/80 text-blue-300 border-blue-700'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>Accessible</span>
          </button>
        </div>
      </div>

      {/* Shelter Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Ranking verified shelters against local flood parameters...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
          No shelters match your current search or filters. Try clearing filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => {
            const s = item.shelter;
            const isTopRanked = idx === 0 && sortBy === 'safest';
            return (
              <div
                key={s.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all space-y-4 shadow-xl ${
                  isTopRanked
                    ? 'bg-gradient-to-br from-slate-900 via-navy-900 to-cyan-950/40 border-cyan-500/50 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-mono">
                      Safety Score: {item.safetyScore}/100
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        s.operationalStatus === 'OPEN'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : s.operationalStatus === 'FULL'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                          : 'bg-red-950 text-red-400 border border-red-800/40'
                      }`}
                    >
                      {s.operationalStatus}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {s.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{s.address}</span>
                    </div>
                  </div>

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Distance</div>
                      <div className="font-bold text-white font-mono">{item.distanceKm} km</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Free Beds</div>
                      <div className="font-bold text-emerald-400 font-mono">{s.availableBeds}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Occupancy</div>
                      <div className="font-bold text-white font-mono">{item.occupancyPercent}%</div>
                    </div>
                  </div>

                  {/* Resource Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${s.hasDrinkingWater ? 'bg-slate-800 text-cyan-300' : 'bg-slate-950 text-slate-500'}`}>
                      <Droplets className="w-3 h-3" /> Potable Water
                    </span>
                    <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${s.hasFood ? 'bg-slate-800 text-emerald-300' : 'bg-slate-950 text-slate-500'}`}>
                      <Utensils className="w-3 h-3" /> Food
                    </span>
                    <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${s.hasMedical ? 'bg-red-950/80 text-red-300' : 'bg-slate-950 text-slate-500'}`}>
                      <HeartPulse className="w-3 h-3" /> Medical
                    </span>
                    {s.isAccessible && (
                      <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 flex items-center gap-1">
                        <Accessibility className="w-3 h-3" /> Accessible
                      </span>
                    )}
                  </div>

                  {/* Recommendation Reason */}
                  <div className="p-2.5 rounded-lg bg-navy-950/60 border border-slate-800/80 text-[11px] text-slate-300">
                    <strong className="text-cyan-400">Ranking Rationale: </strong>
                    {item.recommendationReason}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedShelterModal(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    View Details
                  </button>
                  <Link
                    href={`/route?destLat=${s.latitude}&destLng=${s.longitude}&name=${encodeURIComponent(s.name)}`}
                    className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Route</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedShelterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-navy-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Verified Shelter Profile
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedShelterModal.shelter.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedShelterModal.shelter.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedShelterModal(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Total Beds & Capacity</span>
                  <span className="font-bold text-white text-base">
                    {selectedShelterModal.shelter.occupiedCapacity} / {selectedShelterModal.shelter.totalCapacity}
                  </span>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                    {selectedShelterModal.shelter.availableBeds} Free Beds
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Safety Breakdown (100)</span>
                  <span className="font-bold text-cyan-400 text-base font-mono">
                    {selectedShelterModal.safetyScore}/100
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Dist: {selectedShelterModal.breakdown.distancePoints} • Cap: {selectedShelterModal.breakdown.occupancyPoints} • Res: {selectedShelterModal.breakdown.resourcePoints}
                  </div>
                </div>
              </div>

              {selectedShelterModal.shelter.contactPhone && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Shelter Direct Helpline</span>
                    <span className="text-white font-bold">{selectedShelterModal.shelter.contactPhone}</span>
                  </div>
                  <a
                    href={`tel:${selectedShelterModal.shelter.contactPhone}`}
                    className="p-2 rounded-lg bg-cyan-600 text-white font-bold"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                href={`/route?destLat=${selectedShelterModal.shelter.latitude}&destLng=${selectedShelterModal.shelter.longitude}&name=${encodeURIComponent(selectedShelterModal.shelter.name)}`}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold text-center transition-colors"
              >
                Proceed to Safe Route
              </Link>
              <button
                onClick={() => setSelectedShelterModal(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

