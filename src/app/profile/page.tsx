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
    <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#0E1117] flex flex-col text-[#212835] dark:text-[#EAF1F8]">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#151A23]/90 backdrop-blur-md border-b border-[#DDE4EE] dark:border-[#2E3746] px-6 h-16 flex items-center justify-between">
        <BrandLogo size={34} showWordmark={true} />
        <Link href="/dashboard" className="text-xs font-semibold text-[#2D6BCB] hover:underline">
          Return to Dashboard
        </Link>
      </header>

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#212835] dark:text-white">
            Candidate Profile &amp; Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6578] dark:text-slate-400 mt-1">
            Manage your account credentials, target bank exams, theme, and subscription entitlements.
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#DCE8F8] dark:bg-[#2D6BCB]/30 border-2 border-[#2D6BCB] text-xl font-bold text-[#1C458A] dark:text-[#8FB2EA] flex items-center justify-center">
              AS
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#212835] dark:text-white">{name}</h2>
              <div className="text-xs text-slate-400">{email}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1F9D6B]/15 text-[#1F9D6B]">
                Active Candidate (Verified)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <label className="font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117]"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Target Examinations</label>
              <input
                type="text"
                value={targetExams}
                onChange={(e) => setTargetExams(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117]"
              />
            </div>
          </div>
        </div>

        {/* Appearance & Theme Switcher (PRD Section 7.3) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#212835] dark:text-white">Interface Theme</h2>
            <p className="text-xs text-slate-400">Select Classic Light or Focus Dark theme.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => toggleTheme('light')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                theme === 'light'
                  ? 'border-[#2D6BCB] bg-[#2D6BCB] text-white shadow-sm'
                  : 'border-[#DDE4EE] dark:border-[#2E3746] text-slate-500'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Classic Light</span>
            </button>
            <button
              onClick={() => toggleTheme('dark')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'border-[#2D6BCB] bg-[#2D6BCB] text-white shadow-sm'
                  : 'border-[#DDE4EE] dark:border-[#2E3746] text-slate-500'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Focus Dark</span>
            </button>
          </div>
        </div>

        {/* Subscription Plan & Entitlements (PRD Section 6.8) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2D6BCB]/15 text-[#2D6BCB] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Current Plan: Pro Aspirant</span>
              </div>
              <h2 className="text-base font-bold text-[#212835] dark:text-white">Active Plan Entitlements</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Renews on 25 Nov 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1F9D6B]" /> Unlimited Full-Length Mocks</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1F9D6B]" /> Unlimited Custom Auto/Manual Tests</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1F9D6B]" /> Actionable Weak-Topic Remediation</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1F9D6B]" /> Psychometric Distractor Explanations</div>
          </div>
        </div>
      </main>
    </div>
  );
}
