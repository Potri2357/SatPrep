'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import {
  User,
  Shield,
  CreditCard,
  Sun,
  CheckCircle2,
  Sparkles,
  Download,
  Trash2,
  Bell,
  Target,
} from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('Aditya Sharma');
  const [email, setEmail] = useState('aditya.sharma@example.com');
  const [targetExams, setTargetExams] = useState('IBPS PO 2026, SBI PO 2026');
  const [dailyGoal, setDailyGoal] = useState('40 Questions');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6FF] via-[#F8FAFC] to-[#EFF6FF] flex flex-col text-[#0F172A] relative overflow-hidden selection:bg-[#2563EB] selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[#E2E8F0]/80 shadow-[0_4px_20px_rgb(37,99,235,0.03)] px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="transition-transform hover:scale-[1.02]">
          <BrandLogo size={34} showWordmark={true} />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-4 py-2 rounded-full bg-[#EFF6FF] text-[#1E40AF] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-6 z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] mb-2">
            <User className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Account &amp; Study Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Candidate Profile &amp; Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your personal profile, target bank exams, daily goals, and exam notification settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-blue-100 shadow-[0_4px_20px_rgb(37,99,235,0.04)] space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              AS
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{name}</h2>
              <div className="text-xs text-slate-500">{email}</div>
              <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified Aspirant</span>
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
                className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700">Target Examinations</label>
              <input
                type="text"
                value={targetExams}
                onChange={(e) => setTargetExams(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700">Daily Practice Target</label>
              <input
                type="text"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              {saveSuccess ? '✓ Profile Saved' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Study Preferences & Notifications */}
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-blue-100 shadow-[0_4px_20px_rgb(37,99,235,0.04)] space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
            <Target className="w-4 h-4 text-[#2563EB]" />
            <span>Preparation Tracking Preferences</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-2xl bg-[#EFF6FF]/60 border border-[#BFDBFE]/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Psychometric Analytics</div>
                <div className="text-[11px] text-slate-500">Record per-question speed and error diagnostics</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Enabled
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EFF6FF]/60 border border-[#BFDBFE]/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">KaTeX Instant Rendering</div>
                <div className="text-[11px] text-slate-500">Client-side mathematical equation rendering</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
