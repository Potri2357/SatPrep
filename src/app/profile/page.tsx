'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import {
  User,
  Shield,
  CreditCard,
  Moon,
  Sun,
  CheckCircle2,
  Sparkles,
  Download,
  Trash2,
} from 'lucide-react';

export default function ProfilePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [name, setName] = useState('Aditya Sharma');
  const [email, setEmail] = useState('aditya.sharma@example.com');
  const [targetExams, setTargetExams] = useState('IBPS PO 2026, SBI PO 2026');
  const [isPro, setIsPro] = useState(true);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-blue-100 px-6 h-16 flex items-center justify-between">
        <BrandLogo size={34} showWordmark={true} />
        <Link
          href="/dashboard"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
        >
          Return to Dashboard
        </Link>
      </header>

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-8 z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <User className="w-3.5 h-3.5" />
            <span>Account &amp; Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Candidate Profile &amp; Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your account credentials, target bank exams, theme, and subscription entitlements.
          </p>
        </div>

        {/* Profile Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-blue-500/25">
              AS
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{name}</h2>
              <div className="text-xs text-slate-500">{email}</div>
              <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Candidate (Verified)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700">Target Examinations</label>
              <input
                type="text"
                value={targetExams}
                onChange={(e) => setTargetExams(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Appearance & Theme Switcher */}
        <div className="glass-panel p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Interface Theme Palette</h2>
            <p className="text-xs text-slate-500">Classic Blue &amp; White is currently active and optimized for high-speed focus.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => toggleTheme('light')}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                theme === 'light'
                  ? 'border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25'
                  : 'border-slate-200 text-slate-600 bg-white'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Blue &amp; White Theme</span>
            </button>
          </div>
        </div>

        {/* Subscription Plan & Entitlements */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Current Plan: Pro Aspirant</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">Active Plan Entitlements</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">Renews 25 Nov 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/40 border border-blue-100/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Unlimited Full-Length Mocks</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/40 border border-blue-100/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Unlimited Custom Auto/Manual Tests</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/40 border border-blue-100/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Actionable Weak-Topic Remediation</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/40 border border-blue-100/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Psychometric Distractor Explanations</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
