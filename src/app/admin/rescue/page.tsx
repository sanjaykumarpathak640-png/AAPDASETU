'use client';

import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Shield,
  UserCheck,
  Send,
  History,
  AlertTriangle,
  RefreshCw,
  X,
} from 'lucide-react';

export default function RescueManagementPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchCases = () => {
    setLoading(true);
    fetch(`/api/sos?status=${statusFilter}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests(data);
          if (data.length > 0 && !selectedCase) {
            setSelectedCase(data[0]);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter]);

  const handleUpdateStatus = async (caseId: string, nextStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/sos/${caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          responderNotes: actionNotes || `Status advanced to ${nextStatus}`,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedCase(updated);
        setActionNotes('');
        fetchCases();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignToMe = async (caseId: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/sos/${caseId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedCase(updated);
        fetchCases();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = requests.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.requestNumber.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-800/40">
            Emergency Dispatch & Case Triage
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Human Command Decision Support
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Rescue Request Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Incident workflow: <strong>Reported &rarr; Assigned &rarr; En Route &rarr; Resolved</strong>. Prioritizes cases using automated vulnerability weighting with full audit trail logging.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <span className="italic">
          ℹ️ &ldquo;AI-assisted priority recommendation — human responder makes the final dispatch decision.&rdquo;
        </span>
        <button
          onClick={fetchCases}
          className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by SOS-ID, sector, description..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {['ALL', 'REPORTED', 'ASSIGNED', 'EN_ROUTE', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                statusFilter === st
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: Case List & Case Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cases List (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Loading incident queue...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              No rescue cases currently match this status filter.
            </div>
          ) : (
            filtered.map((sos) => {
              const isSelected = selectedCase?.id === sos.id;
              const isCritical = sos.priorityLevel === 'CRITICAL';
              return (
                <div
                  key={sos.id}
                  onClick={() => setSelectedCase(sos)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50 shadow-xl'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">
                        {sos.requestNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          isCritical
                            ? 'bg-red-950 text-red-300 border-red-700 animate-pulse'
                            : sos.priorityLevel === 'HIGH'
                            ? 'bg-orange-950 text-orange-300 border-orange-700'
                            : 'bg-slate-950 text-slate-300 border-slate-800'
                        }`}
                      >
                        {sos.priorityLevel} ({sos.priorityScore} pts)
                      </span>
                      <span className="text-[11px] font-semibold text-cyan-300">
                        {sos.emergencyType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                        sos.status === 'REPORTED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : sos.status === 'ASSIGNED'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : sos.status === 'EN_ROUTE'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {sos.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {sos.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <span>People: <strong>{sos.peopleCount}</strong></span>
                      {sos.hasVulnerable && <span className="text-red-400 font-bold">⚠️ Vulnerable Flag</span>}
                      <span>Location: <strong className="text-slate-300">{sos.address}</strong></span>
                    </div>
                    <span className="font-mono">
                      {new Date(sos.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Case Management Inspector & Status Transition */}
        {selectedCase ? (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 h-fit sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Incident Action Plan
                </span>
                <h3 className="text-lg font-black text-white font-mono">
                  {selectedCase.requestNumber}
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  selectedCase.status === 'REPORTED'
                    ? 'bg-amber-950 text-amber-300'
                    : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {selectedCase.status}
              </span>
            </div>

            {/* Case Details */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Category</span>
                <div className="text-white font-bold text-sm mt-0.5">
                  {selectedCase.emergencyType.replace(/_/g, ' ')}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Description</span>
                <p className="text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 mt-1">
                  {selectedCase.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Contact Name</span>
                  <span className="font-bold text-white">{selectedCase.contactName || 'Anonymous'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Contact Phone</span>
                  <span className="font-bold text-cyan-400">{selectedCase.contactPhone || 'None'}</span>
                </div>
              </div>

              {/* Responder Assignment */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Field Unit</span>
                  <span className="font-bold text-cyan-300">
                    {selectedCase.responder?.name || 'Unassigned'}
                  </span>
                </div>
                {!selectedCase.responder && (
                  <button
                    onClick={() => handleAssignToMe(selectedCase.id)}
                    disabled={updating}
                    className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    Assign to My Unit (NDRF-04)
                  </button>
                )}
              </div>

              {/* Status Transition Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Advance Incident Status Workflow
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedCase.id, 'ASSIGNED')}
                    disabled={updating}
                    className={`py-2 rounded-xl font-bold text-[11px] transition-colors ${
                      selectedCase.status === 'ASSIGNED'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    Assigned
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedCase.id, 'EN_ROUTE')}
                    disabled={updating}
                    className={`py-2 rounded-xl font-bold text-[11px] transition-colors ${
                      selectedCase.status === 'EN_ROUTE'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    En Route
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedCase.id, 'RESOLVED')}
                    disabled={updating}
                    className={`py-2 rounded-xl font-bold text-[11px] transition-colors ${
                      selectedCase.status === 'RESOLVED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              {/* Case History / Audit Trail */}
              {selectedCase.statusHistory && selectedCase.statusHistory.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <History className="w-3.5 h-3.5" /> Audit History
                  </span>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {selectedCase.statusHistory.map((h: any) => (
                      <div key={h.id} className="text-[10px] text-slate-400 p-1.5 rounded bg-slate-950 flex justify-between">
                        <span>{h.status}: {h.note || 'Status updated'}</span>
                        <span className="font-mono">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

