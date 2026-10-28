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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>Overview &amp; Statistics</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your question library, student test participation, and topic coverage.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Available Questions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-3">
            1,480 <span className="text-xs text-emerald-600 font-sans font-semibold">+45 today</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Target: 2,500 questions total</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Question Accuracy Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-3">
            94.8%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Verified answers &amp; explanations</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Student Feedback</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 mt-3">
            1 <span className="text-xs text-slate-500 font-sans font-normal">pending review</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Flagged question items</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Active Students</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-3">
            342 <span className="text-xs text-slate-500 font-sans font-normal">taking tests right now</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Fast system response time</div>
        </div>
      </div>

      {/* Content Health Distribution by Topic */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Topic Question Coverage
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Number of practice questions available for each subject topic.
            </p>
          </div>
          <Link
            href="/admin/generation"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 w-fit"
          >
            Create Questions
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">
          {INITIAL_TOPICS.map((topic) => {
            const stock = topic.is_template_eligible ? 142 : 88;
            const target = 150;
            const pct = Math.min(100, Math.round((stock / target) * 100));
            const isLow = stock < 50;

            return (
              <div
                key={topic.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800 truncate">{topic.name}</span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${isLow ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
                    {stock} / {target}
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isLow ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}
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
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
            <span>Upload Questions</span>
            <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">Import questions from Excel, CSV spreadsheets, or question papers.</p>
        </Link>

        <Link
          href="/admin/questions"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
            <span>Question Bank</span>
            <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">Search, filter, edit, and manage all verified practice questions.</p>
        </Link>

        <Link
          href="/admin/reports"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
            <span>Student Feedback &amp; Reports</span>
            <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">Review questions flagged by students and update answer keys if needed.</p>
        </Link>
      </div>
    </div>
  );
}
