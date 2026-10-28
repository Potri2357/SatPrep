'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { INITIAL_TOPICS, ALL_PRACTICE_QUESTIONS } from '@/lib/store';
import {
  HelpCircle,
  Flag,
  ArrowRight,
  ArrowLeft,
  Activity,
  Layers,
  BookOpen,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [questions, setQuestions] = useState<any[]>(ALL_PRACTICE_QUESTIONS);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [qRes, rRes] = await Promise.all([
          fetch('/api/admin/questions').catch(() => null),
          fetch('/api/admin/report').catch(() => null),
        ]);

        if (qRes && qRes.ok) {
          const qData = await qRes.json();
          if (qData.success && Array.isArray(qData.questions)) {
            setQuestions(qData.questions);
          }
        }

        if (rRes && rRes.ok) {
          const rData = await rRes.json();
          if (rData.success && Array.isArray(rData.reports)) {
            setReports(rData.reports);
          }
        }
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Compute live statistics
  const totalQuestions = questions.length;
  const liveCount = questions.filter((q) => q.status === 'live' || !q.status).length;

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const q of questions) {
      if (q.topic_id) {
        counts[q.topic_id] = (counts[q.topic_id] || 0) + 1;
      }
    }
    return counts;
  }, [questions]);

  const coveredTopicsCount = useMemo(() => {
    return INITIAL_TOPICS.filter((t) => (topicCounts[t.id] || 0) > 0).length;
  }, [topicCounts]);

  const openReportsCount = useMemo(() => {
    return reports.filter((r) => r.status === 'open' || !r.status).length;
  }, [reports]);

  return (
    <div className="space-y-8">
      {/* Page Header with Back to Home Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Overview &amp; Statistics</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor your question library, topic coverage, and student feedback.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-blue-50/70 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-bold shadow-xs transition-all w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* KPI Cards Strip (3 cards - Active Students removed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Available Questions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-3">
            {totalQuestions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {liveCount} verified live practice questions
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Topic Coverage</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-3">
            {coveredTopicsCount} / {INITIAL_TOPICS.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {INITIAL_TOPICS.length > 0
              ? `${Math.round((coveredTopicsCount / INITIAL_TOPICS.length) * 100)}% of quant topics active`
              : 'Quantitative Aptitude'}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Student Feedback</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 mt-3">
            {openReportsCount}{' '}
            <span className="text-xs text-slate-500 font-sans font-normal">
              {openReportsCount === 1 ? 'pending review' : 'pending review'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {reports.length} total feedback items logged
          </div>
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
              Live practice questions available per syllabus topic.
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
            const stock = topicCounts[topic.id] || 0;
            const target = 25;
            const pct = Math.min(100, Math.round((stock / target) * 100));
            const hasStock = stock > 0;

            return (
              <div
                key={topic.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800 truncate" title={topic.name}>
                    {topic.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                      hasStock
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                        : 'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {stock} {stock === 1 ? 'question' : 'questions'}
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      hasStock ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-slate-300'
                    }`}
                    style={{ width: `${Math.max(hasStock ? 15 : 0, pct)}%` }}
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
          <p className="text-xs text-slate-500 leading-relaxed">
            Import questions from Excel, CSV spreadsheets, or question papers.
          </p>
        </Link>

        <Link
          href="/admin/questions"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
            <span>Question Bank</span>
            <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Search, filter, edit, and manage all verified practice questions.
          </p>
        </Link>

        <Link
          href="/admin/reports"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
            <span>Student Feedback &amp; Reports</span>
            <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review questions flagged by students and update answer keys if needed.
          </p>
        </Link>
      </div>
    </div>
  );
}
