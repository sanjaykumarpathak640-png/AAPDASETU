'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  RefreshCw,
  TrendingDown,
  Edit2,
  Check,
  X,
  Truck,
  Droplets,
  Utensils,
  Pill,
  Clock,
  Info,
} from 'lucide-react';

export default function ReliefPredictionPage() {
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetDays, setTargetDays] = useState(7);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const fetchRelief = () => {
    setLoading(true);
    fetch('/api/resources')
      .then((r) => r.json())
      .then((data) => {
        setCenters(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRelief();
  }, []);

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/resources/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: editingItem.quantity,
          dailyConsumptionRate: editingItem.dailyConsumptionRate,
          restocked: true,
        }),
      });
      if (res.ok) {
        setEditingItem(null);
        fetchRelief();
      }
    } catch (err) {
      console.error(err);
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/40">
              Supply Chain Continuity
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Explainable Burn-Rate Projections
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Relief Resource Shortage Prediction
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Formula: <strong>Days Remaining = Available Stock &divide; Daily Burn Rate</strong>. Forecasts critical stockout points to schedule proactive replenishment convoys before supplies run dry.
          </p>
        </div>

        <button
          onClick={fetchRelief}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Target Coverage Setting Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Target Evacuee Coverage Horizon:</span>
          <select
            value={targetDays}
            onChange={(e) => setTargetDays(parseInt(e.target.value))}
            className="bg-slate-950 border border-slate-700 text-cyan-300 rounded-lg px-2.5 py-1 font-bold font-mono focus:outline-none"
          >
            <option value={3}>3 Days (Emergency Short)</option>
            <option value={5}>5 Days (Intermediate)</option>
            <option value={7}>7 Days Standard Buffer (+20% safety)</option>
            <option value={14}>14 Days (Extended Monsoon)</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-400 italic">
          “Demo projection — calculated from configured burn rate assumptions.”
        </span>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Computing stockpile burn rates and shortage windows...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {centers.map((center) => (
            <div
              key={center.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                      {center.centerType}
                    </span>
                    <h3 className="text-base font-bold text-white">{center.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{center.address}</p>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Contact: <strong>{center.contactPerson || 'Logistics Chief'}</strong>
                </div>
              </div>

              {/* Inventories Table / Responsive Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {center.inventories?.map((inv: any) => {
                  const pred = inv.prediction;
                  const isCritical = pred?.status === 'CRITICAL_SHORTAGE';
                  const isWarning = pred?.status === 'WARNING';

                  return (
                    <div
                      key={inv.id}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 ${
                        isCritical
                          ? 'bg-red-950/30 border-red-800/80 ring-1 ring-red-500/40'
                          : isWarning
                          ? 'bg-amber-950/30 border-amber-800/80'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">
                            {inv.resourceType.replace(/_/g, ' ')}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              isCritical
                                ? 'bg-red-600 text-white animate-pulse'
                                : isWarning
                                ? 'bg-amber-600 text-white'
                                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            }`}
                          >
                            {pred?.status?.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Stock vs Burn */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Stock on Hand</span>
                            <span className="font-bold text-white font-mono">
                              {inv.quantity.toLocaleString()} {inv.unit}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Daily Burn Rate</span>
                            <span className="font-bold text-slate-300 font-mono">
                              {inv.dailyConsumptionRate} {inv.unit}/day
                            </span>
                          </div>
                        </div>

                        {/* Projection Result */}
                        <div className="p-2 rounded-lg bg-navy-950 border border-slate-800 text-[11px] space-y-1">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-400">Coverage Window:</span>
                            <span
                              className={`font-mono ${
                                isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                              }`}
                            >
                              {pred?.daysRemaining !== null ? `${pred?.daysRemaining} days` : 'Infinite / 0 burn'}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Recommended Dispatch:</span>
                            <span className="font-bold text-cyan-300 font-mono">
                              +{pred?.suggestedReplenishment} {inv.unit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Update Button */}
                      <button
                        onClick={() => setEditingItem({ ...inv })}
                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Update Stock Quantity</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Inventory Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateStock}
            className="w-full max-w-md bg-navy-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Restock: {editingItem.resourceType.replace(/_/g, ' ')}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Available Stock ({editingItem.unit}) *</label>
              <input
                type="number"
                min={0}
                required
                value={editingItem.quantity}
                onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Daily Consumption Rate ({editingItem.unit}/day)</label>
              <input
                type="number"
                min={0}
                required
                value={editingItem.dailyConsumptionRate}
                onChange={(e) => setEditingItem({ ...editingItem, dailyConsumptionRate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="pt-2 flex gap-3 text-xs">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors"
              >
                {saving ? 'Updating...' : 'Save & Record Restock'}
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
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

