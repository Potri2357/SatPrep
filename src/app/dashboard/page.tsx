'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#0E1117] flex flex-col text-[#212835] dark:text-[#EAF1F8]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#151A23]/90 backdrop-blur-md border-b border-[#DDE4EE] dark:border-[#2E3746]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <BrandLogo size={34} showWordmark={true} />
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
              <Link href="/dashboard" className="text-[#2D6BCB] border-b-2 border-[#2D6BCB] pb-1">
                Dashboard
              </Link>
              <Link href="/tests/new" className="text-[#5B6578] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Create Test
              </Link>
              <Link href="/practice" className="text-[#5B6578] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Practice
              </Link>
              <Link href="/profile" className="text-[#5B6578] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Profile & Plan
              </Link>
              <Link href="/admin" className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-[#2E3746] text-[#46526A] dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">
                Admin Console
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{streakDays} Day Streak</span>
            </div>

            {/* Candidate Avatar */}
            <Link href="/profile" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#DCE8F8] dark:bg-[#2D6BCB]/30 border border-[#2D6BCB] text-xs font-bold text-[#1C458A] dark:text-[#8FB2EA] flex items-center justify-center">
                AS
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Welcome & Exam Countdown Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#212835] dark:text-white">
              Good morning, Aditya
            </h1>
            <p className="text-xs sm:text-sm text-[#5B6578] dark:text-slate-400 mt-1">
              Target: <span className="font-semibold text-[#2D6BCB]">IBPS PO 2026 Prelims</span> · 21 days remaining
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tests/new"
              className="px-5 py-2.5 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-[#2D6BCB]/25 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Build Custom Test</span>
            </Link>
          </div>
        </div>

        {/* Bento Grid: Today's Goal Ring + Quick Starts + Weak Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Today's Goal & Mastery */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#212835] dark:text-white">Today&apos;s Quant Goal</h2>
              <span className="text-xs font-medium text-[#2D6BCB]">45 / 90 mins</span>
            </div>

            {/* Circular Progress Representation */}
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-[#2E3746]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#2D6BCB]"
                    strokeDasharray="50, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xl font-bold font-mono">50%</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">2 Tests Completed</div>
                <div className="text-slate-500">Target: 35 questions + 1 revision set</div>
                <div className="text-[#1F9D6B] font-medium pt-1">On track for today!</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Overall Accuracy: <strong className="text-slate-800 dark:text-slate-200">88.4%</strong></span>
              <span>Speed: <strong className="text-slate-800 dark:text-slate-200">54s/Q</strong></span>
            </div>
          </div>

          {/* Col 2 & 3: Quick Start Mocks (PRD Section 6.2) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#212835] dark:text-white">Instant Launch Modes</h2>
                <p className="text-xs text-slate-400">Pre-frozen server bundles ready to launch in under 2 seconds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Mock Card */}
              <div
                onClick={() => handleQuickMock('full_mock')}
                className="p-5 rounded-xl border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] hover:border-[#2D6BCB] cursor-pointer transition-all hover:scale-[1.01] group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCE8F8] dark:bg-[#2D6BCB]/20 text-[#2D6BCB]">
                    Exam Pattern
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#2D6BCB] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                </div>
                <h3 className="font-bold text-sm text-[#212835] dark:text-white">Full Mock — IBPS PO Quant</h3>
                <p className="text-xs text-slate-500 mt-1">35 Questions · 20 Mins · Negative 0.25</p>
              </div>

              {/* Topic Speed Drill */}
              <div
                onClick={() => handleQuickMock('topic_test')}
                className="p-5 rounded-xl border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] hover:border-[#2D6BCB] cursor-pointer transition-all hover:scale-[1.01] group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1F9D6B]/10 text-[#1F9D6B]">
                    Speed Ramp
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#1F9D6B] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                </div>
                <h3 className="font-bold text-sm text-[#212835] dark:text-white">Quadratic & Simplification</h3>
                <p className="text-xs text-slate-500 mt-1">10 Questions · 8 Mins · High Speed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Weak-Area Remediation Strip (PRD Section 2.3 G5 & Section 6.2) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent border border-red-500/20 dark:border-red-500/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Weak Area Detected: Profit &amp; Loss Discounts
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Your accuracy on marked price discount schemes is 42% (below 70% cutoff threshold). Practicing 8 calibrated questions will fix this mark leak.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleQuickMock('weak_area')}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
            >
              <span>Practise Weak Topic Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Results & Progress */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#212835] dark:text-white">Recent Test Results</h2>
            <Link href="/practice" className="text-xs font-semibold text-[#2D6BCB] hover:underline flex items-center gap-1">
              <span>View All Attempts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#DDE4EE] dark:divide-[#2E3746]">
            {recentResults.map((res) => (
              <div key={res.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-[#212835] dark:text-white">{res.title}</div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>{res.date}</span>
                    <span>·</span>
                    <span>Accuracy: <strong className="text-[#1F9D6B]">{res.accuracy}%</strong></span>
                    <span>·</span>
                    <span>Percentile: <strong>{res.percentile}%ile</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-[#2D6BCB]">
                      {res.score.toFixed(2)} <span className="text-xs text-slate-400">/ {res.maxMarks}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Rank #{res.rank}</div>
                  </div>

                  <Link
                    href={`/tests/result/sample-attempt-1`}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#2E3746] hover:bg-[#DCE8F8] dark:hover:bg-[#2D6BCB]/30 text-[#212835] dark:text-white transition-colors"
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
