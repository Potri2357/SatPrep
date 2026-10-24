'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_TOPICS, INITIAL_QUESTIONS } from '@/lib/store';
import {
  HelpCircle,
  Cpu,
  Flag,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const totalQuestions = INITIAL_QUESTIONS.length;
  const liveCount = INITIAL_QUESTIONS.filter((q) => q.status === 'live').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#212835] dark:text-white">
          Admin Executive Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time content inventory health, question generation pipeline status, and quality metrics.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Verified Stock</span>
            <HelpCircle className="w-4 h-4 text-[#2D6BCB]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#212835] dark:text-white mt-2">
            1,480 <span className="text-xs text-[#1F9D6B] font-sans font-normal">+45 today</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Target: 2,500 active calibrated items</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pipeline Pass Rate</span>
            <Cpu className="w-4 h-4 text-[#1F9D6B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#1F9D6B] mt-2">
            94.8%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sandbox solver &amp; blind re-solve verified</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Open Question Reports</span>
            <Flag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-2">
            1 <span className="text-xs text-slate-400 font-sans font-normal">pending review</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Report rate: 0.12% (target &lt; 0.5%)</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Test Takers</span>
            <Activity className="w-4 h-4 text-[#7B5CD6]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#212835] dark:text-white mt-2">
            342 <span className="text-xs text-slate-400 font-sans font-normal">live right now</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Zero latency spikes reported</div>
        </div>
      </div>

      {/* Content Health Matrix by Topic (PRD Section 9.1) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#212835] dark:text-white">
              Topic Inventory Coverage &amp; Health Matrix
            </h2>
            <p className="text-[11px] text-slate-400">
              Live questions vs target stock (150 per topic). Red indicates bucket is below safety threshold.
            </p>
          </div>
          <Link
            href="/admin/generation"
            className="px-3 py-1.5 rounded-lg bg-[#2D6BCB] text-white text-xs font-semibold"
          >
            Trigger Auto Top-Up
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {INITIAL_TOPICS.map((topic) => {
            // Simulated inventory levels
            const stock = topic.is_template_eligible ? 142 : 88;
            const target = 150;
            const pct = Math.min(100, Math.round((stock / target) * 100));
            const isLow = stock < 50;

            return (
              <div
                key={topic.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E1117]/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs truncate">{topic.name}</span>
                  <span className={`text-[10px] font-bold font-mono ${isLow ? 'text-red-500' : 'text-[#1F9D6B]'}`}>
                    {stock} / {target}
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-[#2D6BCB]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links to Core Operations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/seed"
          className="p-5 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] hover:border-[#2D6BCB] transition-colors space-y-2"
        >
          <div className="font-bold text-sm text-[#212835] dark:text-white">Import PYQ Seed Questions</div>
          <p className="text-xs text-slate-400">Bulk upload CSV or extract stems from previous year PDFs with Gemini.</p>
        </Link>

        <Link
          href="/admin/review"
          className="p-5 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] hover:border-[#2D6BCB] transition-colors space-y-2"
        >
          <div className="font-bold text-sm text-[#212835] dark:text-white">Review Queue (14 Pending)</div>
          <p className="text-xs text-slate-400">Side-by-side solver inspection and single-key (A/R) rapid approval.</p>
        </Link>

        <Link
          href="/admin/reports"
          className="p-5 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] hover:border-[#2D6BCB] transition-colors space-y-2"
        >
          <div className="font-bold text-sm text-[#212835] dark:text-white">Re-grade Tool &amp; Reports</div>
          <p className="text-xs text-slate-400">Correct contested answer keys and recompute affected attempt scores automatically.</p>
        </Link>
      </div>
    </div>
  );
}
