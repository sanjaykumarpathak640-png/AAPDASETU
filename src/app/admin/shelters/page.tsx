'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  Plus,
  Edit2,
  Check,
  X,
  MapPin,
  Users,
  Shield,
  RefreshCw,
  Phone,
  AlertTriangle,
} from 'lucide-react';

export default function AdminSheltersPage() {
  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingShelter, setEditingShelter] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchShelters = () => {
    setLoading(true);
    fetch('/api/shelters')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // data has item.shelter
          setShelters(data.map((item) => item.shelter || item));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const totalCap = parseInt(editingShelter.totalCapacity);
    const occCap = parseInt(editingShelter.occupiedCapacity);
    const availBeds = parseInt(editingShelter.availableBeds);

    if (isNaN(totalCap) || totalCap <= 0) {
      setErrorMsg('Total capacity must be a positive integer.');
      return;
    }
    if (isNaN(occCap) || occCap < 0) {
      setErrorMsg('Occupied capacity cannot be negative.');
      return;
    }
    if (occCap > totalCap) {
      setErrorMsg(`Occupied capacity (${occCap}) cannot exceed total capacity (${totalCap}).`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/shelters/${editingShelter.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingShelter.name,
          address: editingShelter.address,
          totalCapacity: totalCap,
          occupiedCapacity: occCap,
          availableBeds: availBeds,
          hasFood: editingShelter.hasFood,
          hasDrinkingWater: editingShelter.hasDrinkingWater,
          hasMedical: editingShelter.hasMedical,
          hasToilets: editingShelter.hasToilets,
          hasElectricity: editingShelter.hasElectricity,
          isAccessible: editingShelter.isAccessible,
          operationalStatus: editingShelter.operationalStatus,
        }),
      });

      if (res.ok) {
        setEditingShelter(null);
        fetchShelters();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to update shelter');
      }
    } catch (err) {
      setErrorMsg('Error contacting shelter API');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
              Capacity & Resource Allocation
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Instant Sync with Citizen App
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Shelter Management Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Authorized modifications to bed availability, water/food stockpiles, and operational statuses synchronize live with citizen routing.
          </p>
        </div>

        <button
          onClick={fetchShelters}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Shelters</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading operational shelters...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map((shelter) => {
            const occPct = shelter.totalCapacity
              ? Math.round((shelter.occupiedCapacity / shelter.totalCapacity) * 100)
              : 0;
            return (
              <div
                key={shelter.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        shelter.operationalStatus === 'OPEN'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : shelter.operationalStatus === 'FULL'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      {shelter.operationalStatus}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Last verified: {new Date(shelter.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{shelter.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{shelter.address}</p>
                  </div>

                  {/* Capacity Bar */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Occupancy</span>
                      <span className="font-bold text-white font-mono">
                        {shelter.occupiedCapacity} / {shelter.totalCapacity} ({occPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occPct > 85 ? 'bg-red-500' : occPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occPct}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold pt-0.5">
                      {shelter.availableBeds} Vacant Beds Ready
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                    <div>Food: {shelter.hasFood ? '✅ Available' : '❌ Depleted'}</div>
                    <div>Water: {shelter.hasDrinkingWater ? '✅ Available' : '❌ Depleted'}</div>
                    <div>Medical: {shelter.hasMedical ? '✅ On-site' : '❌ None'}</div>
                    <div>Toilets: {shelter.hasToilets ? '✅ Ready' : '❌ Out of order'}</div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setEditingShelter({ ...shelter });
                      setErrorMsg(null);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Capacity & Resources</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Shelter Modal */}
      {editingShelter && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg bg-navy-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Modify Shelter: {editingShelter.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingShelter(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Total Capacity *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={editingShelter.totalCapacity}
                  onChange={(e) =>
                    setEditingShelter({ ...editingShelter, totalCapacity: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Occupied *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={editingShelter.occupiedCapacity}
                  onChange={(e) => {
                    const occ = parseInt(e.target.value) || 0;
                    const tot = parseInt(editingShelter.totalCapacity) || 0;
                    setEditingShelter({
                      ...editingShelter,
                      occupiedCapacity: e.target.value,
                      availableBeds: Math.max(0, tot - occ),
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Available Beds</label>
                <input
                  type="number"
                  min={0}
                  value={editingShelter.availableBeds}
                  onChange={(e) =>
                    setEditingShelter({ ...editingShelter, availableBeds: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-300">Operational Status</label>
              <select
                value={editingShelter.operationalStatus}
                onChange={(e) =>
                  setEditingShelter({ ...editingShelter, operationalStatus: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="OPEN">OPEN — Accepting Evacuees</option>
                <option value="FULL">FULL — At Maximum Capacity</option>
                <option value="CLOSING">CLOSING — Transferring Inhabitants</option>
                <option value="CLOSED">CLOSED — Offline / Flooded</option>
              </select>
            </div>

            {/* Checkbox grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingShelter.hasFood}
                  onChange={(e) =>
                    setEditingShelter({ ...editingShelter, hasFood: e.target.checked })
                  }
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <span>Food Rations Stocked</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingShelter.hasDrinkingWater}
                  onChange={(e) =>
                    setEditingShelter({ ...editingShelter, hasDrinkingWater: e.target.checked })
                  }
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <span>Potable Drinking Water</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingShelter.hasMedical}
                  onChange={(e) =>
                    setEditingShelter({ ...editingShelter, hasMedical: e.target.checked })
                  }
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <span>On-site Medical Post</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingShelter.isAccessible}
                  onChange={(e) =>
                    setEditingShelter({ ...editingShelter, isAccessible: e.target.checked })
                  }
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <span>Wheelchair Accessible</span>
              </label>
            </div>

            <div className="pt-3 flex gap-3 text-xs border-t border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Validating & Saving...' : 'Save Shelter Updates'}
              </button>
              <button
                type="button"
                onClick={() => setEditingShelter(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

