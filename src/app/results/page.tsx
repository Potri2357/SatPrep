'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { OverallResultsData, TestAttemptSummary } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Award,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  Zap,
  ArrowRight,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';

export default function OverallResultsPage() {
  const [data, setData] = useState<OverallResultsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'full_mock' | 'sectional'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'score' | 'accuracy'>('latest');

  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/test/results', {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        const json = await res.json();
        if (json.success && json.data && isMounted) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load overall results:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      isMounted = false;
    };
  }, []);

  const testsList = data?.tests || [];

  const filteredTests = testsList
    .filter((test) => {
      if (selectedCategory !== 'all' && test.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          test.test_name.toLowerCase().includes(q) ||
          test.category.toLowerCase().includes(q) ||
          test.status.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="min-h-screen bg-[#F7FDFF] text-[#0F172A] flex flex-col selection:bg-[#005CE6] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#BCEBFC]">
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Overall Exam Results
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Consolidated performance record for all tests written. Review your test-by-test scores, accuracy progression, and topic-level breakdowns.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/tests"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#005CE6] to-[#007AE6] hover:from-[#004dc2] hover:to-[#0066cc] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Take Another Mock</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#005CE6] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Compiling overall test results...</p>
          </div>
        ) : (
          <>
            {/* Top Aggregate KPI Cards Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* Card 1: Total Tests Written */}
              <div className="neu-glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Tests Written
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-[#E0F4FD] text-[#005CE6] flex items-center justify-center border border-[#BCEBFC] shadow-2xs">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                    {data?.total_tests_written || 0}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>All attempts evaluated</span>
                  </p>
                </div>
              </div>

              {/* Card 2: Overall Average Score */}
              <div className="neu-glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Average Score
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-2xs">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-[#005CE6]">
                    {data?.avg_score ? data.avg_score.toFixed(2) : '0.00'}
                    <span className="text-xs font-normal text-slate-400 font-sans ml-1">
                      / {data?.max_possible_avg || 35} avg
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Peak Score: {data?.highest_score ? data.highest_score.toFixed(2) : '0.00'} Marks</span>
                  </p>
                </div>
              </div>

              {/* Card 3: Overall Accuracy */}
              <div className="neu-glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Overall Accuracy
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-2xs">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
                    {data?.overall_accuracy || 0}%
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{data?.total_correct || 0} Correct / {data?.total_questions_attempted || 0} Attempted</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Filter, Search & Controls Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              {/* Category Filter Tabs */}
              <div className="inline-flex p-1 rounded-2xl bg-[#E0F4FD]/60 border border-[#BCEBFC] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
                    selectedCategory === 'all'
                      ? "bg-white text-[#005CE6] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  All Tests ({testsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('full_mock')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
                    selectedCategory === 'full_mock'
                      ? "bg-white text-[#005CE6] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Full Mocks ({testsList.filter((t) => t.category === 'full_mock').length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('sectional')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
                    selectedCategory === 'sectional'
                      ? "bg-white text-[#005CE6] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Sectional Mocks ({testsList.filter((t) => t.category === 'sectional').length})
                </button>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by test name..."
                    className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-[#BCEBFC] text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#005CE6] focus:ring-2 focus:ring-[#005CE6]/20 transition-all"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3.5 py-2 rounded-2xl bg-white border border-[#BCEBFC] text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-[#005CE6] cursor-pointer"
                >
                  <option value="latest">Sort: Most Recent</option>
                  <option value="score">Sort: Highest Score</option>
                  <option value="accuracy">Sort: Highest Accuracy</option>
                </select>
              </div>
            </div>

            {/* Core Section: All Tests Written & Their Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Tests Written &amp; Performance Breakdown</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E0F4FD] text-[#005CE6] border border-[#BCEBFC]">
                    {filteredTests.length} Tests
                  </span>
                </h2>
              </div>

              {testsList.length === 0 ? (
                <div className="p-12 sm:p-16 rounded-3xl bg-white border border-[#BCEBFC] text-center space-y-5">
                  <div className="w-16 h-16 rounded-3xl bg-[#E0F4FD] text-[#005CE6] flex items-center justify-center mx-auto border border-[#BCEBFC] shadow-2xs">
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-xl font-black text-slate-900">No Tests Written Yet</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      You haven&apos;t taken any mock tests yet. Take your first test to see detailed section scores, accuracy, and topic-wise diagnostic breakdowns.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/tests"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#005CE6] to-[#007AE6] hover:from-[#004dc2] hover:to-[#0066cc] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Take Your First Mock Test</span>
                    </Link>
                  </div>
                </div>
              ) : filteredTests.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">No matching tests found</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Try adjusting your filter or search query.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#005CE6] text-white text-xs font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTests.map((test) => {
                    const isFullMock = test.category === 'full_mock';
                    return (
                      <div
                        key={test.attempt_id}
                        className="neu-glass-card rounded-3xl p-5 sm:p-6 transition-all hover:border-[#005CE6]/50 hover:shadow-[0_8px_30px_rgba(0,92,230,0.08)] group"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          {/* Test Info & Title */}
                          <div className="space-y-2.5 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span
                                className={cn(
                                  "px-2.5 py-0.5 rounded-full font-bold text-[11px] border",
                                  isFullMock
                                    ? "bg-blue-50 text-[#005CE6] border-blue-200"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                                )}
                              >
                                {isFullMock ? 'Full-Length Mock (35 Qs)' : 'Sectional Speed Mock'}
                              </span>

                              <span className="text-slate-400 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {test.date_formatted}
                              </span>

                              <span
                                className={cn(
                                  "px-2.5 py-0.5 rounded-full font-bold text-[11px] border",
                                  test.status === 'Target Exceeded'
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : test.status === 'Cleared Cutoff'
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                )}
                              >
                                {test.status}
                              </span>
                            </div>

                            {/* Prominent Test Name */}
                            <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#005CE6] transition-colors leading-snug">
                              {test.test_name}
                            </h3>

                            {/* Question & Marking Breakdown Pills */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{test.correct} Correct</span>
                              </span>

                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-200">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>{test.wrong} Wrong (-{test.negative_marks})</span>
                              </span>

                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                                <span>{test.skipped} Skipped</span>
                              </span>

                              <span className="text-[11px] text-slate-500 font-mono">
                                Time: {Math.floor(test.time_spent_sec / 60)}m {test.time_spent_sec % 60}s
                              </span>
                            </div>
                          </div>

                          {/* Scores & Actions Grid */}
                          <div className="flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center gap-4 lg:gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                            {/* Score Display Card */}
                            <div className="grid grid-cols-3 sm:flex sm:items-center gap-3 sm:gap-6 text-center">
                              {/* Marks */}
                              <div className="p-2 sm:p-0 rounded-2xl bg-slate-50 sm:bg-transparent">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Score
                                </div>
                                <div className="text-lg sm:text-xl font-black font-mono text-[#005CE6]">
                                  {test.score.toFixed(2)}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500">
                                  / {test.max_marks}
                                </div>
                              </div>

                              {/* Accuracy */}
                              <div className="p-2 sm:p-0 rounded-2xl bg-slate-50 sm:bg-transparent">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Accuracy
                                </div>
                                <div className="text-lg sm:text-xl font-black font-mono text-emerald-600">
                                  {test.accuracy}%
                                </div>
                                <div className="text-[10px] font-semibold text-slate-500">
                                  {test.attempted} Qs
                                </div>
                              </div>

                              {/* Time Spent */}
                              <div className="p-2 sm:p-0 rounded-2xl bg-slate-50 sm:bg-transparent">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Time Spent
                                </div>
                                <div className="text-lg sm:text-xl font-black font-mono text-slate-800">
                                  {Math.floor(test.time_spent_sec / 60)}m {test.time_spent_sec % 60}s
                                </div>
                                <div className="text-[10px] font-semibold text-slate-500">
                                  Cutoff: {test.cutoff.toFixed(1)}
                                </div>
                              </div>
                            </div>

                            {/* View Full Scorecard Action Button */}
                            <div className="shrink-0 flex items-center">
                              <Link
                                href={`/tests/result/${test.attempt_id}`}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#BCEBFC] hover:border-[#005CE6] hover:bg-[#F0FAFF] text-[#005CE6] font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                              >
                                <span>View Test Scorecard</span>
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Topic Mastery Summary Across All Written Tests */}
            {data?.topic_summary && data.topic_summary.length > 0 && (
              <div className="neu-glass-card rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Syllabus Topic Performance Across All Tests
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Aggregated accuracy across quantitative aptitude topics from your written mock tests.
                    </p>
                  </div>
                  <Link
                    href="/practice"
                    className="text-xs font-bold text-[#005CE6] hover:underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Practice Topic Drills</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.topic_summary.map((t) => {
                    const isStrong = t.strength === 'Strong';
                    const isWeak = t.strength === 'Weak';
                    return (
                      <div
                        key={t.topic_id}
                        className="p-4 rounded-2xl bg-white border border-[#BCEBFC]/80 shadow-2xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {t.topic_name}
                          </h4>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold border",
                              isStrong
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isWeak
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            )}
                          >
                            {t.strength}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-[11px] font-medium text-slate-500">
                              {t.total_correct} / {t.total_attempts} Correct
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              {t.accuracy}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                isStrong
                                  ? "bg-emerald-500"
                                  : isWeak
                                  ? "bg-rose-500"
                                  : "bg-[#005CE6]"
                              )}
                              style={{ width: `${t.accuracy}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] py-8 bg-white text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SatPrep. Banking Exam Performance Intelligence.</p>
          <div className="flex gap-6 font-semibold">
            <Link href="/results" className="text-[#005CE6]">Overall Results</Link>
            <Link href="/tests" className="hover:text-[#005CE6] transition-colors">Mock Tests</Link>
            <Link href="/practice" className="hover:text-[#005CE6] transition-colors">Topic Drills</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
