'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LifeBuoy,
  AlertCircle,
  MapPin,
  Users,
  Compass,
  Phone,
  CheckCircle2,
  Clock,
  Shield,
  Send,
  WifiOff,
  Info,
} from 'lucide-react';
import { offlineDB } from '@/lib/offline/db';

const EMERGENCY_TYPES = [
  { key: 'TRAPPED_FLOODWATER', label: 'Trapped by Rising Floodwater', desc: 'Water entering ground/first floor; immediate boat or airlift needed' },
  { key: 'MEDICAL', label: 'Acute Medical Emergency', desc: 'Critical illness, injury, dialysis, oxygen, or insulin dependency' },
  { key: 'EVACUATION', label: 'Evacuation Assistance Required', desc: 'Need transport to safe shelter before nightfall or flood surge' },
  { key: 'FOOD_WATER_NEEDED', label: 'Food or Drinking Water Depleted', desc: 'Stranded without safe drinking water or food for >24 hours' },
  { key: 'ELDERLY_ASSISTANCE', label: 'Elderly Person Assistance', desc: 'Senior citizen with restricted mobility stranded' },
  { key: 'CHILD_ASSISTANCE', label: 'Infant / Child in Distress', desc: 'Young children or pregnant mother requiring rescue' },
  { key: 'OTHER', label: 'Other Flood Crisis', desc: 'Livestock danger, structural wall collapse, or utility hazard' },
];

export default function EmergencySOSPage() {
  const [emergencyType, setEmergencyType] = useState(EMERGENCY_TYPES[0].key);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Ward 4 Lowlands, Near Digha Canal, Patna');
  const [latitude, setLatitude] = useState(25.6280);
  const [longitude, setLongitude] = useState(85.1320);
  const [peopleCount, setPeopleCount] = useState(3);
  const [hasVulnerable, setHasVulnerable] = useState(true);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [offlineNotice, setOfflineNotice] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setAddress(`GPS Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`);
        },
        () => alert('Could not retrieve GPS coordinates. Please enter your location manually.')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe your emergency situation.');
      return;
    }

    setSubmitting(true);
    const payload = {
      emergencyType,
      description,
      address,
      latitude,
      longitude,
      peopleCount,
      hasVulnerable,
      contactName,
      contactPhone,
      nearbyRiskLevel: 'HIGH',
    };

    // If browser is offline, save to IndexedDB
    if (typeof window !== 'undefined' && !navigator.onLine) {
      const localId = `DRAFT-SOS-${Math.floor(1000 + Math.random() * 9000)}`;
      if (offlineDB) {
        await offlineDB.offlineSOS.add({
          localId,
          emergencyType,
          description,
          latitude,
          longitude,
          address,
          peopleCount,
          hasVulnerable,
          contactName: contactName || 'Anonymous',
          contactPhone: contactPhone || 'Offline',
          synced: false,
          createdAt: new Date().toISOString(),
        });
      }
      setSubmitting(false);
      setOfflineNotice(true);
      setSubmittedResult({
        requestNumber: localId,
        priorityLevel: 'CRITICAL (QUEUED LOCALLY)',
        priorityReason: 'Request saved on device storage. Will automatically synchronize when mobile network or Wi-Fi reconnects.',
        isOfflineDraft: true,
      });
      return;
    }

    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedResult(data.data);
      } else {
        alert(data.error || 'Failed to submit SOS');
      }
    } catch (err) {
      // Network failed during send -> save offline
      const localId = `DRAFT-SOS-${Math.floor(1000 + Math.random() * 9000)}`;
      if (offlineDB) {
        await offlineDB.offlineSOS.add({
          localId,
          emergencyType,
          description,
          latitude,
          longitude,
          address,
          peopleCount,
          hasVulnerable,
          contactName: contactName || 'Anonymous',
          contactPhone: contactPhone || 'Offline',
          synced: false,
          createdAt: new Date().toISOString(),
        });
      }
      setOfflineNotice(true);
      setSubmittedResult({
        requestNumber: localId,
        priorityLevel: 'HIGH (OFFLINE QUEUE)',
        priorityReason: 'Saved on local storage due to connection timeout. Not yet delivered to server.',
        isOfflineDraft: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded border border-red-800/50 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Rapid Dispatch Protocol
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Emergency Service Tier
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Emergency SOS Request
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Submits your precise location and group status directly into the Responder Incident Command System (ICS). Automatically prioritizes cases based on vulnerability and rising water threat.
        </p>
      </div>

      {/* Immediate Phone Helpline Reminder */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border border-red-800/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0">
            <Phone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Immediate Danger? Call Helplines Directly</h3>
            <p className="text-xs text-slate-300">
              National Emergency: <strong>112</strong> | District Disaster Operations: <strong>1077</strong>
            </p>
          </div>
        </div>
        <a
          href="tel:112"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors shrink-0"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call 112 Now</span>
        </a>
      </div>

      {submittedResult ? (
        /* SUCCESS CONFIRMATION VIEW */
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-2xl space-y-6 text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">
              {submittedResult.isOfflineDraft ? 'SOS Saved on This Device' : 'Emergency Request Confirmed'}
            </h2>
            <div className="inline-block px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono font-bold text-lg">
              Case Tracking ID: {submittedResult.requestNumber}
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto pt-1 leading-relaxed">
              {submittedResult.isOfflineDraft
                ? '⚠️ You are currently offline. This draft is safely recorded on your phone and will transmit as soon as connectivity resumes.'
                : 'Your incident details have been registered into the responder command dashboard. Keep your mobile phone dry and stay on the highest available elevation.'}
            </p>
          </div>

          {/* AI Prioritization Explanation Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">AI-Assisted Suggested Priority:</span>
              <span className="font-bold text-red-400 font-mono px-2 py-0.5 rounded bg-red-950 border border-red-800">
                {submittedResult.priorityLevel || 'HIGH'}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {submittedResult.priorityReason || 'Vulnerability factors evaluated.'}
            </p>
            <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-900 italic">
              Notice: AI priority is an advisory calculation; human incident commanders confirm final rescue boat dispatch.
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedResult(null);
                setDescription('');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Submit Another Report
            </button>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
            >
              Return to Safety Dashboard
            </Link>
          </div>
        </div>
      ) : (
        /* SOS SUBMISSION FORM */
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          {/* Emergency Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              1. Select Emergency Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EMERGENCY_TYPES.map((t) => {
                const isSelected = emergencyType === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setEmergencyType(t.key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-red-950/60 border-red-500 text-white shadow-md shadow-red-950/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{t.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              2. Situation Description & Urgent Needs *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 5 people stranded on rooftop; water level at 4 feet and rising; grandmother is diabetic and needs insulin..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 leading-relaxed"
            />
          </div>

          {/* Location & GPS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Current Location / Sector *
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Auto-Detect GPS Coordinates</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address, landmark, house number, or GPS coordinates"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Group size & Vulnerability checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                4. Number of People Stranded
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                5. Vulnerable Persons Present
              </label>
              <label className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/80 transition-colors">
                <input
                  type="checkbox"
                  checked={hasVulnerable}
                  onChange={(e) => setHasVulnerable(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-red-500 focus:ring-0"
                />
                <span className="text-xs text-slate-200">
                  Infants, pregnant mother, elderly, or injured persons
                </span>
              </label>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Contact Person Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Contact Phone Number</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-950/60 border border-red-400/40 transition-all scale-100 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LifeBuoy className={`w-5 h-5 ${submitting ? 'animate-spin' : 'animate-bounce'}`} />
              <span>{submitting ? 'Registering Emergency Case...' : 'TRANSMIT EMERGENCY SOS NOW'}</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-2.5">
              Demo Platform Note: Demo requests will create verified tracking cases in the Responder Command Portal.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

