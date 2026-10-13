'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WifiOff, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { offlineDB } from '@/lib/offline/db';

export const ClientOfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [cachedTime, setCachedTime] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Pre-cache emergency bundle in IndexedDB when online
      if (navigator.onLine && offlineDB) {
        fetch('/api/offline-bundle')
          .then((res) => res.json())
          .then(async (bundle) => {
            await offlineDB.bundle.put({
              key: 'emergency_bundle',
              data: bundle,
              cachedAt: bundle.syncedAt,
            });
            // Also cache shelters in shelter table
            if (bundle.shelters && Array.isArray(bundle.shelters)) {
              await offlineDB.shelters.bulkPut(bundle.shelters);
            }
            setCachedTime(new Date(bundle.syncedAt).toLocaleTimeString());
          })
          .catch(() => {});
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-red-950/95 border-b border-red-700 text-white px-4 py-2.5 text-xs flex items-center justify-between sticky top-0 z-50 animate-in fade-in">
      <div className="flex items-center gap-2.5">
        <WifiOff className="w-4 h-4 text-red-400 animate-pulse" />
        <span>
          <strong>OFFLINE EMERGENCY MODE ACTIVE:</strong> No active internet detected. Using locally cached shelters & contacts.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/offline"
          className="flex items-center gap-1 bg-red-800 hover:bg-red-700 text-white px-2.5 py-1 rounded font-bold transition-colors"
        >
          <span>Open Offline Hub</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default ClientOfflineBanner;

