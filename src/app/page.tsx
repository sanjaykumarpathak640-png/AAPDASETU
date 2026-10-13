import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Navigation,
  MapPin,
  Home,
  Truck,
  WifiOff,
  LifeBuoy,
  Phone,
  ArrowRight,
  CheckCircle2,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col bg-navy-950 text-slate-100">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80">
        {/* Ambient background glow & grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.18),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Live scenario badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs text-cyan-300 shadow-lg shadow-cyan-950/40">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold">Interactive Flood Defense Platform</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Bihar Riparian Demonstration</span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              When Floods Rise, <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                Every Second Matters.
              </span>
            </h1>

            {/* Tagline & Supporting Copy */}
            <p className="text-lg sm:text-xl font-medium text-cyan-200/90">
              “Warn Early. Navigate Safely. Survive Smarter.”
            </p>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Real-time localized flood risk scoring, transparent shelter safety rankings, hazard-avoiding evacuation routing, and an offline survival hub designed to operate even when cell towers fail.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-900/30 border border-cyan-400/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Check My Flood Risk</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shelters"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Find Safe Shelter</span>
              </Link>

              <Link
                href="/sos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-red-950/60 border border-red-400/40 transition-all hover:scale-[1.02] active:scale-95"
              >
                <AlertCircle className="w-4 h-4 animate-bounce" />
                <span>Emergency SOS</span>
              </Link>
            </div>

            {/* Quick Live Helplines Strip */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <span className="text-slate-500">Immediate Rescue Helplines:</span>
              <a href="tel:112" className="inline-flex items-center gap-1.5 text-red-400 font-bold hover:underline">
                <Phone className="w-3.5 h-3.5" /> 112 (National Emergency)
              </a>
              <span className="text-slate-700">|</span>
              <a href="tel:1077" className="inline-flex items-center gap-1.5 text-cyan-400 font-bold hover:underline">
                <Phone className="w-3.5 h-3.5" /> 1077 (Disaster Control Room)
              </a>
              <span className="text-slate-700">|</span>
              <a href="tel:108" className="inline-flex items-center gap-1.5 text-emerald-400 font-bold hover:underline">
                <Phone className="w-3.5 h-3.5" /> 108 (Ambulance)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIX PILLARS / CORE FEATURES */}
      <section className="py-16 md:py-24 bg-navy-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Integrated Capabilities
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              Complete Protection from Inundation to Recovery
            </p>
            <p className="text-sm text-slate-400">
              Designed specifically for extreme monsoon events where conventional infrastructure fails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Early Flood Warning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explainable risk calculations combining rainfall telemetry, river gauge thresholds, basin proximity, and historical inundation patterns.
              </p>
              <Link href="/warnings" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 pt-1">
                <span>View Early Warnings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Offline Emergency Mode</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                PWA caching and IndexedDB storage guarantee instant access to downloaded shelters, emergency numbers, checklists, and local SOS drafts during power cuts.
              </p>
              <Link href="/offline" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 pt-1">
                <span>Explore Offline Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Smart Shelter Finder</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Algorithmic 4-factor ranking prioritizing proximity (30%), free bed capacity (20%), lower flood exposure (20%), and vital resources (30%).
              </p>
              <Link href="/shelters" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-1">
                <span>Search 8+ Seeded Shelters</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">4. Safer Route Planning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare candidate corridors evaluated against verified blocked roads, submerged underpasses, and dangerous water surges.
              </p>
              <Link href="/route" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-1">
                <span>Plan Evacuation Corridor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">5. Relief Resource Finder</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track distribution points for potable water, food packets, emergency medicines, phone charging generators, and medical centers with live inventory status.
              </p>
              <Link href="/resources" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 pt-1">
                <span>Locate Relief Centers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">6. Emergency Rescue</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rapid SOS reporting with automatic vulnerability prioritization, unique tracking numbers (e.g. SOS-2045), and direct triage assignment for response units.
              </p>
              <Link href="/sos" className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 pt-1">
                <span>Report Emergency Incident</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISUAL "HOW IT WORKS" JOURNEY */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Survival Workflow
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            The 5-Step AAPDASETU Journey
          </p>
          <p className="text-xs sm:text-sm text-slate-400">
            From initial river swell warning to post-flood relief rehabilitation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
            <span className="text-3xl font-black text-cyan-500/30">01</span>
            <h4 className="text-sm font-bold text-white">ALERT</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated telemetry detects cloudburst or gauge threshold breach.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
            <span className="text-3xl font-black text-blue-500/30">02</span>
            <h4 className="text-sm font-bold text-white">ASSESS</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Normalized scoring delivers explainable 0–100 risk score for your sector.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
            <span className="text-3xl font-black text-indigo-500/30">03</span>
            <h4 className="text-sm font-bold text-white">NAVIGATE</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart algorithm maps safe elevated corridors around inundated roads.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
            <span className="text-3xl font-black text-emerald-500/30">04</span>
            <h4 className="text-sm font-bold text-white">SURVIVE</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reach equipped shelter or dispatch priority rescue with family status synced.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
            <span className="text-3xl font-black text-amber-500/30">05</span>
            <h4 className="text-sm font-bold text-white">RECOVER</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access emergency relief rations, clean water, medical aid, and family reunion.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SAMPLE MAP PREVIEW & PREPAREDNESS SECTION */}
      <section className="py-14 bg-navy-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Map Preview Card */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-600/30">
                <Layers className="w-3.5 h-3.5" />
                <span>DEMO GEOSPATIAL ENGINE</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Live Spatial Awareness for Every Citizen & Dispatcher
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Filter risk polygons, open shelters with occupancy counts, trauma hospitals, waterlogged road barriers, and river stations across the flood-prone Bihar river network.
              </p>
              <div className="pt-2">
                <Link
                  href="/map"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <span>Launch Full Interactive Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual Preview Box */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold text-white">Bihar Riparian Sector (Demo)</span>
                </div>
                <span className="text-slate-400">8 Shelters • 6 Risk Zones</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-red-300">Kosi River Catchment Supaul</div>
                    <div className="text-[11px] text-slate-400">Breached Danger Mark (+0.4m) • 92/100 Extreme</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">EXTREME</span>
                </div>
                <div className="p-3 rounded-lg bg-orange-950/40 border border-orange-800/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-orange-300">North Patna Lowland Riparian Zone</div>
                    <div className="text-[11px] text-slate-400">Ganga Surge 50.8m • 78/100 High Risk</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-orange-600 text-white font-bold text-[10px]">HIGH</span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-300">Patna Community Hall Relief Center</div>
                    <div className="text-[11px] text-slate-400">220 Free Beds • Food & Medical Ready</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">RECOMMENDED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PREPAREDNESS CALLOUT */}
      <section className="py-14 border-t border-slate-800 bg-gradient-to-b from-navy-950 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <CheckCircle2 className="w-10 h-10 text-cyan-400 mx-auto" />
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Is Your Household Ready Before Water Reaches the Porch?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Pack water, non-perishable rations, power banks, and waterproof document sleeves. Track your readiness with our interactive offline checklist.
          </p>
          <div className="pt-2">
            <Link
              href="/checklist"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
            >
              <span>Open 9-Point Preparedness Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

