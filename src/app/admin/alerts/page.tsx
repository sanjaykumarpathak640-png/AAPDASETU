'use client';

import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  AlertTriangle,
  Clock,
  MapPin,
  RefreshCw,
  Send,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

export default function AdminAlertManagementPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewAlert, setPreviewAlert] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [area, setArea] = useState('Patna Riparian Lowlands, Danapur');
  const [reason, setReason] = useState('Intense cloudburst rainfall exceeding 90mm with river swell.');
  const [recommendedAction, setRecommendedAction] = useState('Vertical evacuation to reinforced community shelters.');
  const [validHours, setValidHours] = useState(24);
  const [issuingAuthority, setIssuingAuthority] = useState('State Disaster Management Authority (SDMA - Bihar)');
  const [submitting, setSubmitting] = useState(false);

  const fetchAlerts = () => {
    setLoading(true);
    fetch('/api/alerts')
      .then((r) => r.json())
      .then((data) => {
        setAlerts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const validTo = new Date(Date.now() + validHours * 3600 * 1000).toISOString();
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          severity,
          area,
          reason,
          recommendedAction,
          validTo,
          issuingAuthority,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setTitle('');
        setMessage('');
        fetchAlerts();
      } else {
        alert('Failed to publish alert');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdrawAlert = async (id: string) => {
    if (!confirm('Withdraw and delete this public alert bulletin?')) return;
    try {
      const res = await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded border border-red-800/40">
              Broadcasting Command
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              DEMO ALERT LABELED
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Public Alert Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish, edit, preview, and expire authoritative emergency bulletins shown directly to affected citizens.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Emergency Alert</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading broadcast alerts...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Published Bulletins ({alerts.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <RiskBadge level={alert.severity} size="sm" />
                    <span className="text-[10px] text-slate-400 font-mono">
                      DEMO BULLETIN
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {alert.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{alert.area}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                    <strong className="text-red-400 block mb-0.5">Directive:</strong>
                    {alert.recommendedAction}
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1">
                    <span>Valid until: {new Date(alert.validTo).toLocaleDateString()}</span>
                    <span>{alert.issuingAuthority}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewAlert(alert)}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Citizen Preview</span>
                  </button>

                  <button
                    onClick={() => handleWithdrawAlert(alert.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                    title="Withdraw Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAlert}
            className="w-full max-w-lg bg-navy-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Draft Public Emergency Warning</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Alert Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. FLASH FLOOD: Extreme Inundation Threat for Supaul Lowlands"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="EXTREME">EXTREME (Red Warning)</option>
                  <option value="HIGH">HIGH (Orange Warning)</option>
                  <option value="MODERATE">MODERATE (Yellow Watch)</option>
                  <option value="LOW">LOW (Advisory)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Validity Horizon</label>
                <select
                  value={validHours}
                  onChange={(e) => setValidHours(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value={12}>12 Hours</option>
                  <option value={24}>24 Hours</option>
                  <option value={48}>48 Hours</option>
                  <option value={72}>72 Hours</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Target Area / District *</label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Supaul, Saharsa, Khagaria Riparian Lowlands"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Bulletin Message Body *</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Full public evacuation warning details..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Recommended Public Action *</label>
              <input
                type="text"
                required
                value={recommendedAction}
                onChange={(e) => setRecommendedAction(e.target.value)}
                placeholder="e.g. Immediate vertical evacuation. Do not cross culverts."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="pt-2 flex gap-3 text-xs border-t border-slate-800">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
              >
                {submitting ? 'Broadcasting...' : 'Broadcast Public Warning'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Citizen Preview Modal */}
      {previewAlert && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-navy-900 border border-red-500/50 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <RiskBadge level={previewAlert.severity} size="sm" />
                <span className="text-[11px] font-bold text-amber-400">
                  CITIZEN APPLICATION PREVIEW
                </span>
              </div>
              <button onClick={() => setPreviewAlert(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="text-lg font-black text-white">{previewAlert.title}</h3>
              <p className="text-slate-200 leading-relaxed">{previewAlert.message}</p>
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-slate-200">
                <strong className="text-red-400 block mb-1">Recommended Action:</strong>
                {previewAlert.recommendedAction}
              </div>
            </div>

            <button
              onClick={() => setPreviewAlert(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

