'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: '1', title: 'Drinking water (minimum 3–4 liters per person per day for 72 hours)', category: 'Vitals', completed: true },
  { id: '2', title: 'Non-perishable food supplies (ready-to-eat rations, roasted grains, energy bars)', category: 'Vitals', completed: true },
  { id: '3', title: 'Essential prescription medicines (insulin, inhalers, blood pressure drugs in zip pouches)', category: 'Medical', completed: true },
  { id: '4', title: 'Identity & legal documents sealed in waterproof dry bags (Aadhaar, property deed, insurance)', category: 'Documents', completed: false },
  { id: '5', title: 'High-lumen waterproof torch with 2 sets of spare dry-cell batteries', category: 'Gear', completed: false },
  { id: '6', title: 'Fully charged mobile phone and 20,000mAh external power bank with charging cables', category: 'Communications', completed: true },
  { id: '7', title: 'First-aid kit (sterile bandages, antiseptic ointment, ORS packets, iodine tablets)', category: 'Medical', completed: false },
  { id: '8', title: 'Emergency contacts & helpline numbers (112, 1077, doctor) written on laminated paper', category: 'Documents', completed: false },
  { id: '9', title: 'Essential clothing, waterproof rain poncho, sturdy boots, and sanitary supplies', category: 'Sanitation', completed: false },
];

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_ITEMS);
  const [customTitle, setCustomTitle] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aapdasetu_checklist');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  const saveItems = (newItems: ChecklistItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aapdasetu_checklist', JSON.stringify(newItems));
    }
  };

  const toggleItem = (id: string) => {
    const updated = items.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it));
    saveItems(updated);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    const newItem: ChecklistItem = {
      id: `c-${Date.now()}`,
      title: customTitle.trim(),
      category: 'Custom Item',
      completed: false,
    };
    saveItems([...items, newItem]);
    setCustomTitle('');
  };

  const removeItem = (id: string) => {
    saveItems(items.filter((it) => it.id !== id));
  };

  const completedCount = items.filter((it) => it.completed).length;
  const totalCount = items.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex-1 bg-navy-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
              Personal Readiness
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Offline Local Storage Persistent
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Flood Preparedness Checklist
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Essential 9-point household survival kit checklist. Works 100% offline and stays saved across browser reloads.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors shrink-0"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Progress Metric Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-navy-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Preparedness Completion
            </span>
            <div className="text-3xl font-black font-mono text-white mt-0.5">
              {percentage}%
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-cyan-400 font-mono">
              {completedCount} of {totalCount} Completed
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {percentage === 100
                ? 'Household fully prepared for evacuation!'
                : `${totalCount - completedCount} vital items remaining`}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Add Custom Item */}
      <form onSubmit={addItem} className="flex gap-2 text-xs">
        <input
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Add custom item (e.g. Infant formula, pet leash, rubber boots)..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Checklist Items List */}
      <div className="space-y-3">
        {items.map((it) => (
          <div
            key={it.id}
            onClick={() => toggleItem(it.id)}
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
              it.completed
                ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-100 shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                className={`mt-0.5 p-1 rounded-lg shrink-0 transition-colors ${
                  it.completed ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-500 hover:text-white'
                }`}
              >
                {it.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
              </button>
              <div>
                <span
                  className={`text-xs font-semibold leading-relaxed block ${
                    it.completed ? 'line-through text-slate-400' : 'text-white'
                  }`}
                >
                  {it.title}
                </span>
                <span className="text-[10px] text-cyan-400/80 font-mono">
                  Category: {it.category}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(it.id);
              }}
              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

