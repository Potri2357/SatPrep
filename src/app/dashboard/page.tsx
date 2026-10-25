'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { BrandLogo } from '@/components/brand-logo';
import {
  Play,
  RotateCcw,
  Target,
  Zap,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Award,
  ChevronRight,
  BarChart2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const [streakDays, setStreakDays] = useState(6);

  // Sample weak topics identified from past mock results (PRD Section 6.2)
  const weakTopics = [
    { id: 'profit-and-loss', name: 'Profit and Loss (Discount Schemes)', accuracy: 42, reason: 'Frequent negative marks on marked price vs CP' },
    { id: 'time-and-work', name: 'Pipes & Cisterns Alternate Work', accuracy: 48, reason: 'High time consumption (112s vs 75s ideal)' },
  ];

  const recentResults = [
    {
      id: 'res-101',
      title: 'IBPS PO Prelims 2026 — Quant Mock 3',
      date: 'Yesterday, 8:45 PM',
      score: 28.75,
      maxMarks: 35.0,
      accuracy: 86,
      percentile: 89.2,
      rank: 124,
    },
    {
      id: 'res-100',
      title: 'Quadratic & Simplification Speed Drill',
      date: '23 Oct 2026',
      score: 18.0,
      maxMarks: 20.0,
      accuracy: 94,
      percentile: 95.1,
      rank: 42,
    },
  ];

  const handleQuickMock = async (mode: string) => {
    try {
      const res = await fetch('/api/test/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: 'ibps-po-prelims-2026',
          mode: mode,
          topics: ['quadratic-equations', 'simplification', 'profit-and-loss'],
          question_count: mode === 'full_mock' ? 35 : 10,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/tests/building/${data.test_id}`);
      }
    } catch {
      router.push('/tests/new');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6FF] via-[#F8FAFC] to-[#EFF6FF] flex flex-col text-[#0F172A] relative selection:bg-[#2563EB] selection:text-white">
      {/* Decorative Light Blue Ambient Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Consistent Unified Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8 relative z-10">
        {/* Welcome & Exam Countdown Banner (Glassmorphism) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(37,99,235,0.05)]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Good morning, Aditya
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Target: <span className="font-bold text-[#2563EB]">IBPS PO 2026 Prelims</span> · 21 days remaining
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tests/new"
              className="px-6 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#2563EB]/25 transition-all hover:scale-[1.01]"
            >
              <Zap className="w-4 h-4" />
              <span>Build Custom Test</span>
            </Link>
          </div>
        </div>

        {/* Bento Grid: Today's Goal Ring + Quick Starts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Today's Goal & Mastery */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(37,99,235,0.05)] space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#0F172A]">Today&apos;s Quant Goal</h2>
              <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
                45 / 90 mins
              </span>
            </div>

            {/* Circular Progress Representation in Blue & White */}
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#2563EB]"
                    strokeDasharray="50, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xl font-extrabold font-mono text-[#2563EB]">50%</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-800">2 Tests Completed</div>
                <div className="text-slate-500">Target: 35 questions + 1 revision set</div>
                <div className="text-[#10B981] font-bold pt-1">On track for today!</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>Overall Accuracy: <strong className="text-slate-800">88.4%</strong></span>
              <span>Speed: <strong className="text-slate-800">54s/Q</strong></span>
            </div>
          </div>

          {/* Col 2 & 3: Quick Start Mocks in Clean White & Blue */}
          <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(37,99,235,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Instant Launch Modes</h2>
                <p className="text-xs text-slate-400">Pre-frozen server bundles ready to launch in under 2 seconds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Mock Card */}
              <div
                onClick={() => handleQuickMock('full_mock')}
                className="p-5 rounded-2xl border border-[#BFDBFE] bg-gradient-to-br from-[#EFF6FF] to-white hover:border-[#2563EB] cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#DBEAFE] text-[#1E40AF]">
                    Full Exam Pattern
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-[#2563EB]/25">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">Full Mock — IBPS PO Quant</h3>
                <p className="text-xs text-slate-500 mt-1">35 Questions · 20 Mins · Negative 0.25</p>
              </div>

              {/* Topic Speed Drill */}
              <div
                onClick={() => handleQuickMock('topic_test')}
                className="p-5 rounded-2xl border border-[#BFDBFE] bg-gradient-to-br from-[#EFF6FF] to-white hover:border-[#2563EB] cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#D1FAE5] text-[#065F46]">
                    Speed Ramp
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-[#10B981]/25">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">Quadratic &amp; Simplification</h3>
                <p className="text-xs text-slate-500 mt-1">10 Questions · 8 Mins · High Speed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Weak-Area Remediation Strip */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-white border border-red-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Weak Area Detected: Profit &amp; Loss Discounts
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  Your accuracy on marked price discount schemes is 42% (below 70% cutoff threshold). Practicing 8 calibrated questions will fix this mark leak.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleQuickMock('weak_area')}
              className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 flex items-center gap-2 shadow-md shadow-red-600/20 transition-all hover:scale-[1.02]"
            >
              <span>Practise Weak Topic Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Results & Progress in Clean White Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(37,99,235,0.05)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A]">Recent Test Results</h2>
            <Link href="/practice" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
              <span>View All Attempts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentResults.map((res) => (
              <div key={res.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-[#0F172A]">{res.title}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>{res.date}</span>
                    <span>·</span>
                    <span>Accuracy: <strong className="text-[#10B981]">{res.accuracy}%</strong></span>
                    <span>·</span>
                    <span>Percentile: <strong>{res.percentile}%ile</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-[#2563EB]">
                      {res.score.toFixed(2)} <span className="text-xs text-slate-400 font-sans">/ {res.maxMarks}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Rank #{res.rank}</div>
                  </div>

                  <Link
                    href={`/tests/result/sample-attempt-1`}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE] transition-colors"
                  >
                    View Analysis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
