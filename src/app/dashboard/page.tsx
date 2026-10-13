'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  AlertTriangle,
  Droplets,
  Activity,
  Compass,
  Home,
  Navigation,
  Shield,
  LifeBuoy,
  Users,
  WifiOff,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

const SAMPLE_LOCATIONS = [
  { name: 'Patna North (Riparian Lowlands)', lat: 25.6280, lng: 85.1320 },
  { name: 'Supaul East (Kosi Basin)', lat: 26.1260, lng: 86.6025 },
  { name: 'Muzaffarpur South (Bagmati Catchment)', lat: 26.0980, lng: 85.3850 },
  { name: 'Darbhanga Central (Urban Ward)', lat: 26.1540, lng: 85.8910 },
  { name: 'Bhagalpur South Ridge (Highground)', lat: 25.2420, lng: 86.9840 },
];

export default function DashboardPage() {
  const [selectedLoc, setSelectedLoc] = useState(SAMPLE_LOCATIONS[0]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const fetchRisk = (lat: number, lng: number) => {
    setLoading(true);
    fetch(`/api/risk?lat=${lat}&lng=${lng}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRisk(selectedLoc.lat, selectedLoc.lng);
  }, [selectedLoc]);

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const customLoc = {
          name: 'Current Device Location',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setSelectedLoc(customLoc);
        fetchRisk(customLoc.lat, customLoc.lng);
      },
      (error) => {
        setGpsError('GPS permission denied or unavailable. Using manual selector.');
        setLoading(false);
      }
    );
  };

  const assessment = data?.assessment;
  const sensor = data?.sensor;
  const shelter = data?.recommendedShelter;

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header & Location Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
              Personal Flood Safety Terminal
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Demo Assessment Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Flood Risk Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time normalized hazard calculations based on water level, precipitation, and barrier distance.
          </p>
        </div>

        {/* Location Dropdown & GPS Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative">
            <select
              value={selectedLoc.name}
              onChange={(e) => {
                const found = SAMPLE_LOCATIONS.find((l) => l.name === e.target.value);
                if (found) setSelectedLoc(found);
              }}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-cyan-400 appearance-none font-medium"
            >
              {SAMPLE_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  📍 {loc.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUseGPS}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Use My GPS</span>
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Computing multi-factor flood assessment index...</p>
        </div>
      ) : (
        <>
          {/* PRIMARY RISK HERO CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Score Card (2 Cols) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-navy-900 to-slate-950 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>{data?.location?.district}, Bihar • Lat: {selectedLoc.lat.toFixed(4)}, Lng: {selectedLoc.lng.toFixed(4)}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Updated: {new Date(data?.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {/* Big Score Display */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 rounded-2xl bg-navy-950/80 border border-slate-800/80">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    Assessed Hazard Level
                  </div>
                  <div className="flex items-center gap-3">
                    <RiskBadge
                      level={assessment?.level || 'LOW'}
                      size="lg"
                      className="text-base py-1.5 px-4 font-bold"
                    />
                  </div>
                  <p className="text-xs text-slate-300 pt-1 font-medium">
                    {assessment?.label}
                  </p>
                </div>

                {/* Circular / Big Metric */}
                <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-black font-mono text-white">
                      {assessment?.score}
                      <span className="text-lg text-slate-500 font-normal">/100</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Unified Risk Score
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/30 space-y-1">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Recommended Action for Inhabitants:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {assessment?.recommendedAction}
                </p>
              </div>

              {/* Contributing Factors Breakdown */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-white uppercase tracking-wider">
                    Contributing Normalized Factors (Formula: 0–100)
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Explainable Assessment
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assessment?.contributingFactors?.map((f: any) => (
                    <div
                      key={f.key}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-200">{f.name}</span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {f.points} / {f.maxPoints} pts
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full rounded-full"
                          style={{ width: `${(f.points / f.maxPoints) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>{f.description}</span>
                        <span className="font-mono">{f.rawValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Column: Nearest River Sensor & Recommended Shelter */}
            <div className="space-y-6">
              {/* Telemetry Sensor Card */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      River Gauge Telemetry
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {sensor?.status || 'NORMAL'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">{sensor?.name}</div>
                    <div className="text-[11px] text-slate-400">{sensor?.river} • ~{sensor?.distanceKm?.toFixed(1)} km away</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Current Level</div>
                      <div className="text-sm font-bold text-white font-mono">
                        {sensor?.currentWaterLevelM} m
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Danger Mark</div>
                      <div className="text-sm font-bold text-red-400 font-mono">
                        {sensor?.dangerThresholdM} m
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Shelter Card */}
              {shelter && (
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Recommended Evacuation Shelter
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Safest Pick
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{shelter.name}</div>
                      <div className="text-[11px] text-slate-400">{shelter.address}</div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                      <span>Proximity: <strong>{shelter.distanceKm?.toFixed(1)} km</strong></span>
                      <span>Free Beds: <strong>{shelter.availableBeds}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        href={`/route?destLat=${selectedLoc.lat}&destLng=${selectedLoc.lng}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate Safe Route</span>
                      </Link>
                      <Link
                        href="/shelters"
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                      >
                        All Shelters
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QUICK SAFETY ACTION TILES */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Emergency Action Hub
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Link
                href="/sos"
                className="p-4 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-800/50 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <LifeBuoy className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Emergency SOS</span>
                <span className="text-[10px] text-red-300">Request Rescue</span>
              </Link>

              <Link
                href="/map"
                className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <Layers className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Interactive Map</span>
                <span className="text-[10px] text-slate-400">View Hazards</span>
              </Link>

              <Link
                href="/shelters"
                className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <Home className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Safe Shelters</span>
                <span className="text-[10px] text-slate-400">8+ Centers</span>
              </Link>

              <Link
                href="/route"
                className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <Navigation className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Safe Routes</span>
                <span className="text-[10px] text-slate-400">Bypass Floods</span>
              </Link>

              <Link
                href="/family"
                className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <Users className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Family Safety</span>
                <span className="text-[10px] text-slate-400">Status Circle</span>
              </Link>

              <Link
                href="/offline"
                className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex flex-col items-center text-center gap-2 transition-all group"
              >
                <WifiOff className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Offline Hub</span>
                <span className="text-[10px] text-slate-400">PWA Cached</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

