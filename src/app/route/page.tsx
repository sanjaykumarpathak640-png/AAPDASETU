'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { evaluateSafeRoutes, RouteOption } from '@/lib/algorithms/routeEngine';
import {
  Navigation,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Compass,
  ArrowRight,
  ShieldAlert,
  Car,
  Footprints,
  Info,
  Check,
  XCircle,
} from 'lucide-react';

const ORIGINS = [
  { name: 'Patna North (Ward 4 Lowlands)', lat: 25.6280, lng: 85.1320 },
  { name: 'Digha Old Riverfront Sector', lat: 25.6310, lng: 85.1180 },
  { name: 'Bailey Road Junction', lat: 25.6110, lng: 85.1250 },
  { name: 'Muzaffarpur Ramdayalu Nagar', lat: 26.1020, lng: 85.3850 },
];

const DESTINATIONS = [
  { name: 'Patna Community Hall Relief Center (Digha Elevated)', lat: 25.6210, lng: 85.1120 },
  { name: 'Muzaffarpur District Sports Complex Shelter', lat: 26.1150, lng: 85.3920 },
  { name: 'Darbhanga Raj High School Evacuation Center', lat: 26.1620, lng: 85.8980 },
  { name: 'AIIMS Trauma Emergency Center', lat: 25.5615, lng: 85.0442 },
];

function SafeRouteContent() {
  const searchParams = useSearchParams();
  const destNameParam = searchParams.get('name');
  const destLatParam = searchParams.get('destLat');
  const destLngParam = searchParams.get('destLng');

  const [origin, setOrigin] = useState(ORIGINS[0]);
  const [destination, setDestination] = useState(
    destNameParam && destLatParam && destLngParam
      ? {
          name: destNameParam,
          lat: parseFloat(destLatParam),
          lng: parseFloat(destLngParam),
        }
      : DESTINATIONS[0]
  );
  const [travelMode, setTravelMode] = useState<'VEHICLE' | 'WALKING'>('VEHICLE');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);

  useEffect(() => {
    const computed = evaluateSafeRoutes(origin.lat, origin.lng, destination.lat, destination.lng);
    setRoutes(computed);
    setSelectedRoute(computed[0]);
  }, [origin, destination]);

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
            Hazard-Aware Navigation Engine
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Elevation & Water-depth Corridors
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Safe Evacuation Route Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Compares candidate corridors against verified submerged underpasses, breached bunds, and high-water barriers. Highlights the safest route even when longer in distance.
        </p>
      </div>

      {/* Prominent Statutory Warning */}
      <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-800/50 text-xs text-amber-200 flex items-start sm:items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        <p className="leading-relaxed">
          <strong>CRITICAL SAFETY MANDATE:</strong> This route is a planning aid. Flood conditions can change quickly during cloudbursts and dam releases. Follow current official NDRF/DDMA instructions and <strong>never enter moving floodwater</strong> on foot or in vehicles (“Turn Around, Don’t Drown”).
        </p>
      </div>

      {/* Input Selector Box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Origin */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Origin Point</span>
          </label>
          <select
            value={origin.name}
            onChange={(e) => {
              const found = ORIGINS.find((o) => o.name === e.target.value);
              if (found) setOrigin(found);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {ORIGINS.map((o) => (
              <option key={o.name} value={o.name}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Destination Safe Shelter</span>
          </label>
          <select
            value={destination.name}
            onChange={(e) => {
              const found = DESTINATIONS.find((d) => d.name === e.target.value);
              if (found) setDestination(found);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {DESTINATIONS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Travel Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Travel Mode</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setTravelMode('VEHICLE')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                travelMode === 'VEHICLE'
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Rescue Vehicle</span>
            </button>
            <button
              onClick={() => setTravelMode('WALKING')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                travelMode === 'WALKING'
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Foot Evacuation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Routes Comparison (A, B, C) */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Evaluated Candidate Corridors (3 Options)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {routes.map((route) => {
            const isSelected = selectedRoute?.id === route.id;
            return (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-4 shadow-xl ${
                  route.isRecommended
                    ? 'bg-gradient-to-br from-slate-900 via-navy-900 to-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/40'
                    : route.blockedRoadEncountered
                    ? 'bg-red-950/20 border-red-900/50 opacity-80'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                } ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  {route.isRecommended ? (
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/60 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      RECOMMENDED SAFER ROUTE
                    </span>
                  ) : route.blockedRoadEncountered ? (
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-700/60 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      BLOCKED / DO NOT ENTER
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-700/60 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      CAUTION CORRIDOR
                    </span>
                  )}

                  <span className="text-xs font-mono font-bold text-white">
                    Score: {route.safetyScore}/100
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base leading-snug">
                    {route.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Profile: {route.elevationProfile.replace(/_/g, ' ')}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <span className="font-bold text-white font-mono">{route.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Time</span>
                    <span className="font-bold text-cyan-400 font-mono">
                      {route.estimatedTimeMinutes >= 999 ? 'Impassable' : `${route.estimatedTimeMinutes} mins`}
                    </span>
                  </div>
                </div>

                {/* Rationale explanation */}
                <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-100 block mb-1">Safety Analysis:</strong>
                  {route.rationale}
                </div>

                {/* Route Waypoints list preview */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Corridor Waypoints: {route.waypoints.length}</span>
                  <span className="text-cyan-400 font-semibold">
                    {isSelected ? 'Selected' : 'Click to select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SafeRoutePlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-slate-400 flex items-center justify-center">
          Loading route planner...
        </div>
      }
    >
      <SafeRouteContent />
    </Suspense>
  );
}
