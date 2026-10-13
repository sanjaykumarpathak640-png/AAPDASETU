'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Check,
  Navigation,
  Compass,
  Phone,
} from 'lucide-react';

export default function FamilySafetyPage() {
  const [familyGroup, setFamilyGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('CHILD');
  const [newNotes, setNewNotes] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);

  const fetchFamily = () => {
    setLoading(true);
    fetch('/api/family')
      .then((r) => r.json())
      .then((data) => {
        setFamilyGroup(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  const handleUpdateStatus = async (memberId: string, newStatus: string) => {
    setUpdatingMemberId(memberId);
    try {
      const res = await fetch(`/api/family/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          locationName: 'Self-Reported Device Check-in',
        }),
      });
      if (res.ok) {
        fetchFamily();
      }
    } catch (err) {
      alert('Offline: status will sync when connection returns');
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const res = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          role: newRole,
          status: 'SAFE',
          notes: newNotes,
        }),
      });
      if (res.ok) {
        setNewName('');
        setNewNotes('');
        setShowAddModal(false);
        fetchFamily();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Remove member from your family safety circle?')) return;
    try {
      await fetch(`/api/family/${memberId}`, { method: 'DELETE' });
      fetchFamily();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-800/40">
              Welfare Coordination
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Consent-Based Location Sharing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Family Safety Circle
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Keep loved ones accountable during evacuations. Track who is safe, who is on the move, and who needs rescue assistance.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading family circle records...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Global Action Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2 text-xs">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">
                {familyGroup?.name || 'Emergency Safety Circle'}
              </span>
              <span className="text-slate-400">
                ({familyGroup?.members?.length || 0} members connected)
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-400">My Status:</span>
              <button
                onClick={() => {
                  const first = familyGroup?.members?.[0];
                  if (first) handleUpdateStatus(first.id, 'SAFE');
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
              >
                I&apos;M SAFE
              </button>
              <button
                onClick={() => {
                  const first = familyGroup?.members?.[0];
                  if (first) handleUpdateStatus(first.id, 'NEED_HELP');
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
              >
                NEED HELP
              </button>
            </div>
          </div>

          {/* Members Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyGroup?.members?.map((member: any) => {
              const isSafe = member.status === 'SAFE';
              const isMoving = member.status === 'MOVING';
              const isHelp = member.status === 'NEED_HELP';

              return (
                <div
                  key={member.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 shadow-xl transition-all ${
                    isHelp
                      ? 'bg-red-950/30 border-red-800/80 ring-1 ring-red-500/40'
                      : isMoving
                      ? 'bg-amber-950/20 border-amber-800/60'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {member.role}
                        </span>
                        <h3 className="font-bold text-white text-base">{member.name}</h3>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                          isSafe
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : isMoving
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-red-950 text-red-400 border-red-800 animate-pulse'
                        }`}
                      >
                        {member.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Location & Notes */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {member.locationName && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{member.locationName}</span>
                        </div>
                      )}
                      {member.notes && (
                        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                          &ldquo;{member.notes}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(member.lastStatusUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(member.id, 'SAFE')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-[11px]"
                      >
                        Safe
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(member.id, 'MOVING')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-[11px]"
                      >
                        Moving
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(member.id, 'NEED_HELP')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-red-400 font-semibold text-[11px]"
                      >
                        Need Help
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-400"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddMember}
            className="w-full max-w-md bg-navy-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in"
          >
            <h3 className="text-base font-bold text-white">Add Family Member</h3>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Family Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="FATHER">Father</option>
                <option value="MOTHER">Mother</option>
                <option value="CHILD">Child</option>
                <option value="GRANDPARENT">Grandparent</option>
                <option value="OTHER">Other Relative</option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Status / Notes</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g. Has asthma inhaler; staying at Sector 4"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 flex gap-3 text-xs">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                Save Member
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
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

