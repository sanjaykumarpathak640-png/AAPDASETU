'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  WifiOff,
  Wifi,
  Phone,
  Home,
  HeartPulse,
  LifeBuoy,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Compass,
  FileText,
  Send,
  Database,
} from 'lucide-react';
import { offlineDB, OfflineSOSRecord, CachedShelter } from '@/lib/offline/db';

export default function OfflineEmergencyPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [cachedTime, setCachedTime] = useState<string | null>(null);
  const [cachedShelters, setCachedShelters] = useState<CachedShelter[]>([]);
  const [pendingDrafts, setPendingDrafts] = useState<OfflineSOSRecord[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Load from Dexie IndexedDB
  const loadLocalData = async () => {
    if (!offlineDB) return;
    try {
      const bundleRecord = await offlineDB.bundle.get('emergency_bundle');
      if (bundleRecord) {
        setCachedTime(bundleRecord.cachedAt);
      }

      const shelters = await offlineDB.shelters.toArray();
      setCachedShelters(shelters);

      const drafts = await offlineDB.offlineSOS.toArray();
      setPendingDrafts(drafts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        triggerSync();
      };
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      loadLocalData();

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const triggerSync = async () => {
    if (!navigator.onLine || !offlineDB) return;
    setSyncing(true);
    setSyncMessage('Synchronizing local drafts with server...');

    try {
      // 1. Fetch fresh bundle
      const res = await fetch('/api/offline-bundle');
      const bundle = await res.json();
      await offlineDB.bundle.put({
        key: 'emergency_bundle',
        data: bundle,
        cachedAt: bundle.syncedAt,
      });
      if (bundle.shelters && Array.isArray(bundle.shelters)) {
        await offlineDB.shelters.clear();
        await offlineDB.shelters.bulkPut(bundle.shelters);
      }

      // 2. Sync pending offline SOS drafts
      const unsynced = await offlineDB.offlineSOS.where('synced').equals(0).toArray();
      for (const draft of unsynced) {
        const postRes = await fetch('/api/sos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emergencyType: draft.emergencyType,
            description: `[SYNCED FROM OFFLINE QUEUE] ${draft.description}`,
            latitude: draft.latitude,
            longitude: draft.longitude,
            address: draft.address,
            peopleCount: draft.peopleCount,
            hasVulnerable: draft.hasVulnerable,
            contactName: draft.contactName,
            contactPhone: draft.contactPhone,
          }),
        });
        if (postRes.ok) {
          const result = await postRes.json();
          await offlineDB.offlineSOS.update(draft.id!, {
            synced: true,
            serverRequestId: result.data.requestNumber,
          });
        }
      }

      await loadLocalData();
      setSyncMessage('All offline drafts & shelters successfully updated!');
      setTimeout(() => setSyncMessage(null), 3500);
    } catch (err) {
      setSyncMessage('Sync failed. Will retry when connection stabilizes.');
    } finally {
      setSyncing(false);
    }
  };

  const nearestCachedShelter = cachedShelters[0] || {
    name: 'Patna Community Hall Relief Center (Default Cached)',
    address: 'Near Digha Elevated Road, Patna',
    availableBeds: 220,
    totalCapacity: 500,
    contactPhone: '+91 612 254 9911',
  };

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Top Offline Status Hero */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-navy-900 to-slate-950 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl flex items-center justify-center ${
                isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5 animate-pulse" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Network Connection State
              </span>
              <span className="text-base font-black text-white">
                {isOnline ? 'ONLINE — Connected to Emergency Cloud' : 'OFFLINE — Zero Internet Connection'}
              </span>
            </div>
          </div>

          <button
            onClick={triggerSync}
            disabled={syncing || !isOnline}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Fresh Data'}</span>
          </button>
        </div>

        {/* Sync message feedback */}
        {syncMessage && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300">
            {syncMessage}
          </div>
        )}

        {/* Freshness Timestamp notice */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Last Sync Time: {cachedTime ? new Date(cachedTime).toLocaleString() : 'Pre-cached install package'}</span>
          </div>
          <span className="text-[11px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 font-medium">
            Stored in Device IndexedDB (PWA Shell)
          </span>
        </div>
      </div>

      {/* SIX LARGE QUICK-ACCESS CARDS (Master Prompt Spec) */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Critical Offline Action Center (6 Pillars)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Nearest Downloaded Shelter */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Home className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400">
                  {nearestCachedShelter.availableBeds} Free Beds
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">1. Nearest Downloaded Shelter</h3>
              <p className="text-xs font-semibold text-cyan-300">{nearestCachedShelter.name}</p>
              <p className="text-[11px] text-slate-400">{nearestCachedShelter.address}</p>
            </div>
            {nearestCachedShelter.contactPhone && (
              <a
                href={`tel:${nearestCachedShelter.contactPhone}`}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Call Shelter: {nearestCachedShelter.contactPhone}</span>
              </a>
            )}
          </div>

          {/* 2. Emergency Contacts (112, 1077, 108) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-red-900/50 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-red-500/20 text-red-400">
                  <Phone className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300">
                  Tap to Dial 24x7
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">2. Verified Helplines</h3>
              <div className="space-y-1.5 text-xs">
                <a
                  href="tel:112"
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 flex justify-between items-center text-red-300 font-bold"
                >
                  <span>112 (National Emergency)</span>
                  <Phone className="w-3 h-3" />
                </a>
                <a
                  href="tel:1077"
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 flex justify-between items-center text-cyan-300 font-bold"
                >
                  <span>1077 (District Control)</span>
                  <Phone className="w-3 h-3" />
                </a>
                <a
                  href="tel:108"
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 flex justify-between items-center text-emerald-300 font-bold"
                >
                  <span>108 (Disaster Ambulance)</span>
                  <Phone className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* 3. Saved Safe Locations & Rerouting */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 inline-block">
                <Compass className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-white text-sm">3. Previously Saved Safe Zones</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elevated embankment corridors and pre-surveyed high-elevation schools in your sector stored offline.
              </p>
              <div className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg">
                Patna Elevated AIIMS Link • Zero waterlogging
              </div>
            </div>
            <Link
              href="/route"
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center transition-colors"
            >
              Check Offline Corridors
            </Link>
          </div>

          {/* 4. Medical Assistance Guidelines */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 inline-block">
                <HeartPulse className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-white text-sm">4. Medical Emergency Rules</h3>
              <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                <div>• Treat open wounds immediately with antiseptic to avoid leptospirosis.</div>
                <div>• Boil or chlorinate all water; never drink raw flood runoff.</div>
                <div>• Keep medications in double sealable plastic bags.</div>
              </div>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">
              AIIMS Patna Trauma Center (Cached)
            </div>
          </div>

          {/* 5. "I'M SAFE" Quick Broadcast */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 inline-block">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-white text-sm">5. Record &ldquo;I&apos;M SAFE&rdquo;</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Marks your local status as safe. When internet returns, broadcasts timestamp to your family circle.
              </p>
            </div>
            <Link
              href="/family"
              className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center transition-colors"
            >
              Update Family Circle
            </Link>
          </div>

          {/* 6. "NEED HELP" Offline SOS Queue */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-red-800/80 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="p-2 rounded-xl bg-red-500/20 text-red-400 inline-block">
                <LifeBuoy className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-white text-sm">6. Draft Offline SOS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Creates a queued rescue ticket on this phone. Automatic transmission triggers as soon as signal recovers.
              </p>
            </div>
            <Link
              href="/sos"
              className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center transition-colors"
            >
              Draft Offline Rescue SOS
            </Link>
          </div>
        </div>
      </div>

      {/* PENDING OFFLINE SOS QUEUE STATUS TABLE */}
      {pendingDrafts.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Locally Queued SOS Requests ({pendingDrafts.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Auto-sync active on reconnection
            </span>
          </div>

          <div className="space-y-2">
            {pendingDrafts.map((d) => (
              <div
                key={d.localId}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400">{d.localId}</span>
                    <span className="text-white font-semibold">{d.emergencyType.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{d.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      d.synced
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {d.synced ? `DELIVERED (${d.serverRequestId})` : 'Saved on this device — NOT YET SENT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

