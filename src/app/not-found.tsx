import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, LifeBuoy } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 bg-navy-950 text-slate-100 flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white">404 — Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The emergency sector coordinate or navigation page you requested could not be located in the current disaster operations database.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/sos"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Emergency SOS</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

