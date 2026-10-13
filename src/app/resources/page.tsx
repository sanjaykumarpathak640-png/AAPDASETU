'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  Filter,
  MapPin,
  Phone,
  Hospital as HospitalIcon,
  Truck,
  Droplets,
  Utensils,
  Pill,
  Zap,
  ShieldAlert,
  Clock,
  ExternalLink,
  LifeBuoy,
} from 'lucide-react';

const CATEGORIES = [
  { key: 'ALL', label: 'All Resources', icon: Package },
  { key: 'FOOD', label: 'Food Rations', icon: Utensils },
  { key: 'DRINKING_WATER', label: 'Potable Water', icon: Droplets },
  { key: 'MEDICINES', label: 'Emergency Medicines', icon: Pill },
  { key: 'CHARGING_POWER', label: 'Charging & Power', icon: Zap },
  { key: 'BEDDING', label: 'Bedding & Mats', icon: Package },
  { key: 'RESCUE_EQUIPMENT', label: 'Rescue Boats & Rafts', icon: LifeBuoy },
];

export default function ReliefResourcesPage() {
  const [centers, setCenters] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/resources').then((r) => r.json()),
      fetch('/api/hospitals').then((r) => r.json()),
    ])
      .then(([resData, hospData]) => {
        setCenters(Array.isArray(resData) ? resData : []);
        setHospitals(Array.isArray(hospData) ? hospData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCenters = centers.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === 'ALL' ||
      c.inventories?.some((inv: any) => inv.resourceType === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/40">
            Humanitarian Logistics Directory
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Real-time Inventory Tracking
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Relief Resource & Hospital Finder
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Locate stockpiles of potable water, emergency dry food rations, medications, power generator points, and emergency hospitals across the flood impact sector.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search depot name or location..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Relief Depots Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Relief Distribution Centers ({filteredCenters.length})
        </h2>

        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading verified inventory records...</p>
          </div>
        ) : filteredCenters.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No relief centers matching this category or search query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                      {center.centerType} DEPOT
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(center.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{center.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{center.address}</span>
                    </div>
                  </div>

                  {/* Stock Inventory Items */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Current Stock on Hand
                    </span>
                    <div className="space-y-1.5">
                      {center.inventories
                        ?.filter(
                          (inv: any) =>
                            selectedCategory === 'ALL' || inv.resourceType === selectedCategory
                        )
                        .map((inv: any) => {
                          const isWarning =
                            inv.prediction?.status === 'WARNING' ||
                            inv.prediction?.status === 'CRITICAL_SHORTAGE';
                          return (
                            <div
                              key={inv.id}
                              className="p-2 rounded-xl bg-slate-950 border border-slate-800/90 text-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="font-semibold text-slate-200">
                                  {inv.resourceType.replace(/_/g, ' ')}
                                </span>
                                <div className="text-[10px] text-slate-400">
                                  Est. drain: {inv.dailyConsumptionRate} {inv.unit}/day
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-white font-mono">
                                  {inv.quantity.toLocaleString()} {inv.unit}
                                </span>
                                {isWarning && (
                                  <div className="text-[10px] text-red-400 font-bold">
                                    {inv.prediction?.daysRemaining !== null
                                      ? `${inv.prediction?.daysRemaining} days left`
                                      : 'Low'}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Footer contact info */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400">
                    Officer: <strong>{center.contactPerson || 'Dispatch Unit'}</strong>
                  </div>
                  {center.contactPhone && (
                    <a
                      href={`tel:${center.contactPhone}`}
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{center.contactPhone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Hospitals Section (Separate dedicated section) */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HospitalIcon className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold text-white">
              Emergency Trauma & Field Hospitals ({hospitals.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Call 108 for Emergency Ambulance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="p-4 rounded-xl bg-slate-900 border border-red-900/40 space-y-2 text-xs shadow-lg"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white text-sm">{hosp.name}</h4>
                {hosp.traumaCareAvailable && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                    TRAUMA 24/7
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">{hosp.address}</p>
              <div className="p-2 rounded bg-slate-950 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Emergency Beds</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {hosp.availableBeds} / {hosp.emergencyBeds} available
                </span>
              </div>
              <div className="pt-1 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Phone: {hosp.contactPhone || '108'}</span>
                <a
                  href={`tel:${hosp.contactPhone || '108'}`}
                  className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

