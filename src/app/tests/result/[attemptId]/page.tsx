'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { BrandLogo } from '@/components/brand-logo';
import { MathRenderer } from '@/lib/math-renderer';
import { ResultSnapshot } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Zap,
  Bookmark,
  Flag,
  Share2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  ArrowLeft,
  BarChart3,
} from 'lucide-react';

export default function ResultAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params?.attemptId as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [snapshot, setSnapshot] = useState<ResultSnapshot | null>(null);

  // Filter for Questions Review
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'skipped' | 'slow'>('all');
  const [selectedQIndex, setSelectedQIndex] = useState<number>(0);
  const [explanationTab, setExplanationTab] = useState<'solution' | 'shortcut' | 'traps'>('solution');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  // Report Modal
  const [reportingQid, setReportingQid] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>('wrong_answer');
  const [reportText, setReportText] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  // Deduplicate questions by stem to ensure zero repetition in questions review (Unconditionally top-level)
  const uniqueQuestionsReview = React.useMemo(() => {
    if (!snapshot?.questions_review) return [];
    const seen = new Set<string>();
    const list: typeof snapshot.questions_review = [];
    snapshot.questions_review.forEach((q) => {
      const stemNorm = q.stem.trim();
      if (!seen.has(stemNorm)) {
        seen.add(stemNorm);
        list.push({ ...q, position: list.length + 1 });
      }
    });
    return list;
  }, [snapshot?.questions_review]);

  const filteredQuestions = React.useMemo(() => {
    return uniqueQuestionsReview.filter((q) => {
      if (filter === 'correct') return q.is_correct;
      if (filter === 'wrong') return !q.is_correct && !!q.your_answer;
      if (filter === 'skipped') return !q.your_answer;
      if (filter === 'slow') return q.time_taken_sec > q.ideal_time_sec;
      return true;
    });
  }, [uniqueQuestionsReview, filter]);

  useEffect(() => {
    let isMounted = true;

    const fetchResult = async () => {
      try {
        const cleanId = attemptId && attemptId !== 'undefined' ? attemptId : '';
        if (!cleanId) {
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/test/result/${cleanId}`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        const text = await res.text();
        if (!text) return;
        const data = JSON.parse(text);
        if (data.success && data.snapshot && isMounted) {
          setSnapshot(data.snapshot);
          const firstWrongIdx = data.snapshot.questions_review.findIndex((q: any) => !q.is_correct && q.your_answer);
          if (firstWrongIdx !== -1) {
            setSelectedQIndex(firstWrongIdx);
          }
        }
      } catch (e) {
        console.error('Fetch result error:', e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResult();

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  const toggleSolution = (qid: string) => {
    setExpandedSolutions((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const toggleBookmark = (qid: string) => {
    setBookmarked((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const handleReportSubmit = async () => {
    if (!reportingQid) return;
    try {
      await fetch('/api/admin/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: reportingQid,
          reason: reportReason,
          text: reportText,
        }),
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportingQid(null);
        setReportSubmitted(false);
        setReportText('');
      }, 1500);
    } catch {
      setReportingQid(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-[#0F172A]">
        <Navbar />
        <main className="max-w-md mx-auto w-full pt-20 pb-16 px-4 text-center space-y-4 my-auto">
          <div className="w-10 h-10 border-3 border-[#005CE6] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading test results...</p>
        </main>
        <footer className="py-6 text-xs text-center text-slate-400">
          SatPrep &bull; Official Examination Analytics
        </footer>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-[#0F172A]">
        <Navbar />
        <main className="max-w-md mx-auto w-full pt-16 pb-12 px-4 text-center space-y-6 my-auto">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Scorecard Not Found</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              We couldn&apos;t find this test attempt record. Take a mock test or review your overall results.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/tests"
              className="px-6 py-3 rounded-2xl bg-[#005CE6] hover:bg-[#004dc2] text-white font-bold text-xs sm:text-sm shadow-md inline-flex items-center gap-2"
            >
              <span>Take a Mock Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/results"
              className="px-6 py-3 rounded-2xl bg-white border border-[#BCEBFC] text-[#005CE6] hover:bg-[#F0FAFF] font-bold text-xs sm:text-sm shadow-2xs inline-flex items-center gap-2"
            >
              <span>View Overall Results</span>
            </Link>
          </div>
        </main>
        <footer className="py-6 text-xs text-center text-slate-400">
          SatPrep &bull; Official Examination Analytics
        </footer>
      </div>
    );
  }

  const sc = snapshot.score_card;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Consistent Unified Navbar */}
      <Navbar />

      {/* Main Body */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-8 z-10">
        {/* Quick Action Bar for Exam Results */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/results" className="hover:text-[#005CE6] transition-colors flex items-center gap-1 font-bold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Exam Results</span>
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-bold truncate max-w-md">{snapshot.test_name || 'Individual Test Scorecard'}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold neu-pill text-[#1E40AF] mb-1.5">
                <Award className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{snapshot.test_name || 'Exam Performance Scorecard'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                Test Result &amp; Diagnostic Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href="/results"
                className="px-4 py-2.5 rounded-xl bg-white border border-[#BCEBFC] text-[#005CE6] hover:bg-[#F0FAFF] font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Overall Results</span>
              </Link>
              <Link
                href="/tests"
                className="neu-chip-primary text-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Take Another Mock</span>
              </Link>
              <Link
                href="/practice"
                className="chip-btn text-xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Drill Topics</span>
              </Link>
            </div>
          </div>
        </div>

        {/* HERO SCORE CARD WITH IMPROVISED MULTI-SEGMENT PIE/DONUT CHART */}
        <div className="neu-glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Improvised Donut Pie Chart + Legend */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full">
              {/* Donut Chart SVG with Exact Proportional Segments */}
              {(() => {
                const totalQ = Math.max(1, sc.max_marks || (sc.correct + sc.wrong + sc.skipped) || 35);
                const C = 282.743; // 2 * PI * 45
                const correctArc = (sc.correct / totalQ) * C;
                const wrongArc = (sc.wrong / totalQ) * C;
                const skippedArc = Math.max(0, C - correctArc - wrongArc);

                return (
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90 drop-shadow-xs" viewBox="0 0 110 110">
                        {/* Background track */}
                        <circle
                          cx="55"
                          cy="55"
                          r="45"
                          stroke="#F1F5F9"
                          strokeWidth="9"
                          fill="none"
                        />
                        {/* Skipped arc (Slate) */}
                        <circle
                          cx="55"
                          cy="55"
                          r="45"
                          stroke="#CBD5E1"
                          strokeWidth="9"
                          strokeDasharray={`${skippedArc} ${C}`}
                          strokeDashoffset={`${-(correctArc + wrongArc)}`}
                          fill="none"
                        />
                        {/* Incorrect arc (Rose red) */}
                        <circle
                          cx="55"
                          cy="55"
                          r="45"
                          stroke="#EF4444"
                          strokeWidth="9"
                          strokeDasharray={`${wrongArc} ${C}`}
                          strokeDashoffset={`${-correctArc}`}
                          fill="none"
                        />
                        {/* Correct arc (Emerald green) */}
                        <circle
                          cx="55"
                          cy="55"
                          r="45"
                          stroke="#10B981"
                          strokeWidth="9"
                          strokeDasharray={`${correctArc} ${C}`}
                          strokeDashoffset="0"
                          fill="none"
                        />
                      </svg>

                      {/* Center Score Readout */}
                      <div className="absolute text-center flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Score
                        </span>
                        <div className="text-3xl font-black font-mono text-[#005CE6] leading-none my-0.5">
                          {sc.total_score.toFixed(2)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">
                          / {sc.max_marks}
                        </span>
                      </div>
                    </div>

                    {/* Chart Legend Chips */}
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>{sc.correct} Correct</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>{sc.wrong} Wrong</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        <span>{sc.skipped} Skipped</span>
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Analysis Header & Performance Summary (Unified, no separate bulky cards) */}
              <div className="space-y-2.5 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Accuracy: {sc.accuracy_percent}%</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  Quantitative Aptitude Analysis
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                  Time Spent: <strong className="text-slate-900">{Math.round(sc.total_time_spent_sec / 60)}m {sc.total_time_spent_sec % 60}s</strong> · Attempted: <strong className="text-slate-900">{sc.attempted}/{sc.max_marks}</strong> questions · Pace: <strong className="text-slate-900">{sc.attempted > 0 ? Math.round(sc.total_time_spent_sec / sc.attempted) : 0}s</strong>/Q.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Correct Marks:</span>
              <div className="text-base font-bold text-emerald-600 font-mono mt-0.5">+{sc.correct} ({sc.correct * 1.0} marks)</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Negative Marks Lost:</span>
              <div className="text-base font-bold text-rose-600 font-mono mt-0.5">-{sc.negative_marks_lost.toFixed(2)} marks ({sc.wrong} wrong)</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Skipped Questions:</span>
              <div className="text-base font-bold text-slate-700 font-mono mt-0.5">{sc.skipped} questions</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Average Pace:</span>
              <div className="text-base font-bold text-[#005CE6] font-mono mt-0.5">
                {sc.attempted > 0 ? Math.round(sc.total_time_spent_sec / sc.attempted) : 0}s per question
              </div>
            </div>
          </div>
        </div>

        {/* TOPIC BREAKDOWN & STRENGTH TAGS */}
        <div className="neu-glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Topic Mastery &amp; Accuracy Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">Target accuracy for bank mains: 80%+</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {snapshot.topic_breakdown.length} Topics Tested
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-blue-100 bg-blue-50/40 text-blue-900 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 rounded-l-xl">Topic</th>
                  <th className="py-3 px-3">Attempts</th>
                  <th className="py-3 px-3">Correct</th>
                  <th className="py-3 px-3">Accuracy</th>
                  <th className="py-3 px-3">Avg Time</th>
                  <th className="py-3 px-3 text-right rounded-r-xl">Diagnosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {snapshot.topic_breakdown.map((t) => (
                  <tr key={t.topic_id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{t.topic_name}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{t.attempts}</td>
                    <td className="py-3 px-3 font-mono text-emerald-600 font-bold">+{t.correct}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{t.accuracy}%</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{t.avg_time_sec}s / {t.ideal_time_sec}s</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                          t.strength === 'Strong'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : t.strength === 'Weak'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {t.strength}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SOLUTIONS & QUESTION EXPLANATIONS (Interactive & Uncluttered) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Question Performance &amp; Explanations</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect step-by-step solutions, exam speed shortcuts, and psychometric distractor analyses.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/tests/${snapshot.test_id}/exam?mode=review&attemptId=${attemptId}`}
                className="neu-chip-primary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Open in Exam Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Question Palette Bar (Clean Chip Navigator) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#BCEBFC] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'all', label: `All (${uniqueQuestionsReview.length})` },
                  { id: 'wrong', label: `Incorrect (${snapshot.score_card.wrong})` },
                  { id: 'correct', label: `Correct (${snapshot.score_card.correct})` },
                  { id: 'skipped', label: `Skipped (${snapshot.score_card.skipped})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id as any)}
                    className={`px-3 py-1 font-bold rounded-full transition-all text-xs cursor-pointer ${
                      filter === f.id
                        ? 'bg-[#005CE6] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Correct</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Incorrect</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span>Skipped</span>
                </span>
              </div>
            </div>

            {/* Questions Number Strip */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              {filteredQuestions.map((q) => {
                const isSelected = q.position === (uniqueQuestionsReview[selectedQIndex]?.position);
                let chipColor = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                if (q.is_correct) {
                  chipColor = 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100';
                } else if (q.your_answer) {
                  chipColor = 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100';
                }

                return (
                  <button
                    key={q.question_id}
                    onClick={() => {
                      const actualIdx = uniqueQuestionsReview.findIndex((item) => item.question_id === q.question_id);
                      if (actualIdx !== -1) {
                        setSelectedQIndex(actualIdx);
                        setExplanationTab('solution');
                      }
                    }}
                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${chipColor} ${
                      isSelected ? 'ring-2 ring-[#005CE6] ring-offset-2 scale-105 shadow-xs font-extrabold' : ''
                    }`}
                  >
                    {q.position}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focused Question Explanation Card (Compact, High-Density & Elegant) */}
          {uniqueQuestionsReview[selectedQIndex] && (() => {
            const activeQ = uniqueQuestionsReview[selectedQIndex];
            return (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#BCEBFC] shadow-sm space-y-4">
                {/* Compact Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#005CE6] text-white text-[11px]">
                      Q{activeQ.position} of {uniqueQuestionsReview.length}
                    </span>
                    <span className="text-slate-700 capitalize font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-md">
                      {activeQ.topic_name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium">
                      Level {activeQ.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeQ.is_correct ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 text-[11px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>+1.00 Correct</span>
                      </span>
                    ) : activeQ.your_answer ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1 text-[11px]">
                        <X className="w-3 h-3 stroke-[3]" />
                        <span>-0.25 Incorrect</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px]">
                        0.00 Skipped
                      </span>
                    )}
                    <span className="text-slate-400 font-mono text-[11px]">
                      Time: {activeQ.time_taken_sec}s
                    </span>
                  </div>
                </div>

                {/* Question Stem (Compact & Readable) */}
                <div className="py-1 text-sm sm:text-[15px] font-medium text-slate-900 leading-normal">
                  <MathRenderer content={activeQ.stem} />
                </div>

                {/* Options List (Sleek Compact Rows) */}
                <div className="space-y-2 pt-1">
                  {activeQ.options.map((opt) => {
                    const isCorrectOpt = opt.id === activeQ.correct_answer;
                    const isUserSelected = opt.id === activeQ.your_answer;

                    let optClass = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300';
                    if (isCorrectOpt) {
                      optClass = 'border-emerald-300 bg-emerald-50/60 text-emerald-950 font-semibold ring-1 ring-emerald-300';
                    } else if (isUserSelected && !isCorrectOpt) {
                      optClass = 'border-rose-300 bg-rose-50/60 text-rose-950 font-semibold ring-1 ring-rose-300';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`px-3.5 py-2 rounded-xl border text-xs flex items-center justify-between transition-all ${optClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "w-5 h-5 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 uppercase",
                              isCorrectOpt
                                ? "bg-emerald-600 text-white"
                                : isUserSelected
                                ? "bg-rose-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {opt.id}
                          </span>
                          <div className="leading-snug text-xs sm:text-[13px]">
                            <MathRenderer content={opt.text} />
                          </div>
                        </div>

                        <div className="text-[10px] font-bold shrink-0 ml-2">
                          {isCorrectOpt && (
                            <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> Correct Key
                            </span>
                          )}
                          {isUserSelected && !isCorrectOpt && (
                            <span className="text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <X className="w-2.5 h-2.5 stroke-[3]" /> Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sleek Segmented Solution & Explanation Panel */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setExplanationTab('solution')}
                        className={cn(
                          "px-3 py-1 rounded-lg transition-all text-xs cursor-pointer",
                          explanationTab === 'solution'
                            ? "bg-white text-[#005CE6] font-bold shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        Step-by-Step Derivation
                      </button>
                      {activeQ.shortcut && (
                        <button
                          type="button"
                          onClick={() => setExplanationTab('shortcut')}
                          className={cn(
                            "px-3 py-1 rounded-lg transition-all text-xs flex items-center gap-1 cursor-pointer",
                            explanationTab === 'shortcut'
                              ? "bg-white text-amber-700 font-bold shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          )}
                        >
                          <Lightbulb className="w-3 h-3 text-amber-500" />
                          <span>Speed Shortcut</span>
                        </button>
                      )}
                      {activeQ.option_rationales && (
                        <button
                          type="button"
                          onClick={() => setExplanationTab('traps')}
                          className={cn(
                            "px-3 py-1 rounded-lg transition-all text-xs cursor-pointer",
                            explanationTab === 'traps'
                              ? "bg-white text-purple-700 font-bold shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          )}
                        >
                          Trap Diagnosis
                        </button>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                      Switch tabs for shortcuts &amp; traps
                    </span>
                  </div>

                  {/* Active Explanation Content */}
                  {explanationTab === 'solution' && (
                    <div className="p-3.5 rounded-xl bg-[#F0FAFF] border border-[#BCEBFC] space-y-1.5 animate-in fade-in duration-150">
                      <div className="text-[11px] font-bold text-[#005CE6] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Official Step-by-Step Method</span>
                      </div>
                      <div className="text-xs text-slate-800 leading-relaxed">
                        <MathRenderer content={activeQ.solution} />
                      </div>
                    </div>
                  )}

                  {explanationTab === 'shortcut' && activeQ.shortcut && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1 animate-in fade-in duration-150">
                      <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>15–20 Seconds Speed Trick</span>
                      </div>
                      <p className="text-xs leading-relaxed">{activeQ.shortcut}</p>
                    </div>
                  )}

                  {explanationTab === 'traps' && activeQ.option_rationales && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 animate-in fade-in duration-150">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Why other choices were incorrect:
                      </div>
                      <div className="space-y-1">
                        {Object.entries(activeQ.option_rationales).map(([optId, rationale]) => (
                          <div key={optId} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <span className="font-mono font-bold uppercase text-slate-900 shrink-0 text-[11px]">
                              Option {optId}:
                            </span>
                            <span>{rationale}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Compact Navigation Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setSelectedQIndex((prev) => Math.max(0, prev - 1));
                      setExplanationTab('solution');
                    }}
                    disabled={selectedQIndex === 0}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 font-semibold text-slate-700 transition-colors cursor-pointer text-xs"
                  >
                    ← Previous
                  </button>

                  <Link
                    href={`/tests/${snapshot.test_id}/exam?mode=review&attemptId=${attemptId}`}
                    className="text-xs font-bold text-[#005CE6] hover:underline flex items-center gap-1"
                  >
                    <span>Open in Exam Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => {
                      setSelectedQIndex((prev) => Math.min(uniqueQuestionsReview.length - 1, prev + 1));
                      setExplanationTab('solution');
                    }}
                    disabled={selectedQIndex === uniqueQuestionsReview.length - 1}
                    className="neu-chip-primary px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
                  >
                    <span>Next →</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </main>

      {/* REPORT QUESTION MODAL */}
      {reportingQid && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-white/95 rounded-3xl border border-blue-100 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-500" />
              <span>Report Question Error</span>
            </h2>

            {reportSubmitted ? (
              <div className="text-center py-6 text-xs text-emerald-600 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Report logged successfully! Our content reviewers will inspect this question.</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600">
                  Help us maintain 99.5%+ key accuracy. If 3 reports are filed, this question will be auto-flagged and removed from circulation.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-800">Reason for report</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="wrong_answer">Wrong Answer Key</option>
                      <option value="unclear">Ambiguous / Unclear Question Stem</option>
                      <option value="wrong_solution">Incorrect Solution Steps</option>
                      <option value="typo">Typo or Formatting Glitch</option>
                      <option value="other">Other Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-800">Additional Notes</label>
                    <textarea
                      rows={3}
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="Specify your calculation or why the key is disputed..."
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setReportingQid(null)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportSubmit}
                    className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
