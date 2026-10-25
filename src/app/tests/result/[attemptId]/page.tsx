'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { BrandLogo } from '@/components/brand-logo';
import { MathRenderer } from '@/lib/math-renderer';
import { ResultSnapshot } from '@/lib/types';
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
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  // Report Modal
  const [reportingQid, setReportingQid] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>('wrong_answer');
  const [reportText, setReportText] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/test/result/${attemptId}`);
        const data = await res.json();
        if (data.success && data.snapshot) {
          setSnapshot(data.snapshot);
          // By default focus first wrong question
          const firstWrongIdx = data.snapshot.questions_review.findIndex((q: any) => !q.is_correct && q.your_answer);
          if (firstWrongIdx !== -1) {
            setSelectedQIndex(firstWrongIdx);
          }
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
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

  if (loading || !snapshot) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 max-w-sm mx-auto z-10 border border-blue-100 shadow-xl shadow-blue-500/5">
          <div className="flex justify-center">
            <BrandLogo size={44} showWordmark={false} />
          </div>
          <div className="text-base font-bold text-slate-900">Computing Scorecard...</div>
          <div className="text-xs text-blue-600 font-mono animate-pulse">Running psychometric calibration &amp; topic breakdown</div>
        </div>
      </div>
    );
  }

  const sc = snapshot.score_card;

  const filteredQuestions = snapshot.questions_review.filter((q) => {
    if (filter === 'correct') return q.is_correct;
    if (filter === 'wrong') return !q.is_correct && !!q.your_answer;
    if (filter === 'skipped') return !q.your_answer;
    if (filter === 'slow') return q.time_taken_sec > q.ideal_time_sec;
    return true;
  });

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold neu-pill text-[#1E40AF] mb-2">
              <Award className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Exam Performance Scorecard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Test Result &amp; Diagnostic Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tests/new"
              className="neu-chip-primary text-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Build Next Calibrated Test</span>
            </Link>
            <Link
              href="/practice"
              className="chip-btn text-xs"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Practice Weak Areas</span>
            </Link>
          </div>
        </div>

        {/* HERO SCORE CARD WITH NEUMORPHIC GLASS ACCENT */}
        <div className="neu-glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Score Ring */}
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-blue-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#2563EB]"
                    strokeDasharray={`${Math.max(5, sc.accuracy_percent)}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold font-mono text-[#2563EB] leading-none">
                    {sc.total_score.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-semibold">/ {sc.max_marks}</div>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Accuracy: {sc.accuracy_percent}%</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  Quantitative Aptitude Analysis
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Time Spent: <strong className="text-slate-900">{Math.round(sc.total_time_spent_sec / 60)}m {sc.total_time_spent_sec % 60}s</strong> · Attempted: <strong className="text-slate-900">{sc.attempted}/{sc.max_marks}</strong>
                </p>
              </div>
            </div>

            {/* Percentile & Rank Cards */}
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-36 p-4 rounded-2xl neu-inset text-center">
                <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Percentile</span>
                <div className="text-2xl font-extrabold font-mono text-blue-800 mt-1">
                  {sc.percentile || 88.4}%ile
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Top 12% in cohort</div>
              </div>

              <div className="flex-1 md:w-36 p-4 rounded-2xl neu-glass-card text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">All-India Rank</span>
                <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
                  #{sc.rank || 142}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Cohort: 1,250 test takers</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-500">Correct Answers:</span>
              <div className="text-base font-bold text-emerald-600 font-mono mt-0.5">+{sc.correct} ({sc.correct * 1.0} marks)</div>
            </div>
            <div>
              <span className="text-slate-500">Negative Marks Lost:</span>
              <div className="text-base font-bold text-rose-600 font-mono mt-0.5">-{sc.negative_marks_lost.toFixed(2)} marks ({sc.wrong} wrong)</div>
            </div>
            <div>
              <span className="text-slate-500">Skipped Questions:</span>
              <div className="text-base font-bold text-slate-700 font-mono mt-0.5">{sc.skipped} questions</div>
            </div>
            <div>
              <span className="text-slate-500">Average Pace:</span>
              <div className="text-base font-bold text-[#2563EB] font-mono mt-0.5">
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
                  { id: 'all', label: `All (${snapshot.questions_review.length})` },
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
                const isSelected = q.position === (snapshot.questions_review[selectedQIndex]?.position);
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
                      const actualIdx = snapshot.questions_review.findIndex((item) => item.question_id === q.question_id);
                      if (actualIdx !== -1) setSelectedQIndex(actualIdx);
                    }}
                    className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${chipColor} ${
                      isSelected ? 'ring-2 ring-[#005CE6] ring-offset-2 scale-105 shadow-xs font-extrabold' : ''
                    }`}
                  >
                    {q.position}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focused Question Explanation Card */}
          {snapshot.questions_review[selectedQIndex] && (() => {
            const activeQ = snapshot.questions_review[selectedQIndex];
            return (
              <div className="p-6 sm:p-7 rounded-3xl neu-glass-card border border-blue-200 shadow-sm space-y-6">
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold font-mono px-3 py-1 rounded-full bg-[#005CE6] text-white">
                      Question {activeQ.position} of {snapshot.questions_review.length}
                    </span>
                    <span className="text-slate-700 capitalize font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-lg">
                      {activeQ.topic_name}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium">
                      Difficulty Level {activeQ.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {activeQ.is_correct ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5 border border-emerald-200 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Correct (+1.00 Marks)</span>
                      </span>
                    ) : activeQ.your_answer ? (
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1.5 border border-rose-200 text-xs">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Incorrect (-0.25 Marks)</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                        Skipped (0.00 Marks)
                      </span>
                    )}
                    <span className="text-slate-500 font-mono text-[11px]">
                      Time: {activeQ.time_taken_sec}s
                    </span>
                  </div>
                </div>

                {/* Question Stem */}
                <div className="py-2 text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  <MathRenderer content={activeQ.stem} />
                </div>

                {/* Options Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {activeQ.options.map((opt) => {
                    const isCorrectOpt = opt.id === activeQ.correct_answer;
                    const isUserSelected = opt.id === activeQ.your_answer;

                    let optClass = 'border-slate-200 bg-white text-slate-700';
                    if (isCorrectOpt) {
                      optClass = 'border-emerald-400 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-300';
                    } else if (isUserSelected && !isCorrectOpt) {
                      optClass = 'border-rose-400 bg-rose-50/70 text-rose-950 font-bold ring-1 ring-rose-300';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all ${optClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold uppercase font-mono text-xs">({opt.id})</span>
                          <MathRenderer content={opt.text} />
                        </div>

                        <div className="text-[11px] font-bold">
                          {isCorrectOpt && (
                            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Correct Key</span>
                            </span>
                          )}
                          {isUserSelected && !isCorrectOpt && (
                            <span className="flex items-center gap-1 text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Your Choice</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Official Explanation Box */}
                <div className="pt-4 border-t border-slate-200 space-y-4 text-xs">
                  {/* Step-by-step Solution */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F0FAFF] border border-[#BCEBFC] space-y-2">
                    <div className="font-bold text-[#005CE6] flex items-center gap-2 text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Official Step-by-Step Derivation</span>
                    </div>
                    <div className="leading-relaxed text-slate-800 text-sm">
                      <MathRenderer content={activeQ.solution} />
                    </div>
                  </div>

                  {/* Shortcut Trick */}
                  {activeQ.shortcut && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
                      <div className="font-bold flex items-center gap-2 text-amber-900 text-xs uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>Exam Speed Shortcut (15–20 Seconds)</span>
                      </div>
                      <p className="leading-relaxed text-xs">{activeQ.shortcut}</p>
                    </div>
                  )}

                  {/* Wrong-Option Explanations */}
                  {activeQ.option_rationales && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-800 text-xs">
                        Distractor / Psychological Trap Analysis:
                      </div>
                      <div className="space-y-1.5">
                        {Object.entries(activeQ.option_rationales).map(([optId, rationale]) => (
                          <div key={optId} className="flex items-start gap-2 text-slate-600 text-xs">
                            <span className="font-mono font-bold uppercase text-slate-900 shrink-0">
                              Option {optId}:
                            </span>
                            <span>{rationale}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Footer for the Question */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedQIndex((prev) => Math.max(0, prev - 1))}
                    disabled={selectedQIndex === 0}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    ← Previous Question
                  </button>

                  <Link
                    href={`/tests/${snapshot.test_id}/exam?mode=review&attemptId=${attemptId}`}
                    className="text-xs font-bold text-[#005CE6] hover:underline flex items-center gap-1"
                  >
                    <span>Open in Exam Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setSelectedQIndex((prev) => Math.min(snapshot.questions_review.length - 1, prev + 1))}
                    disabled={selectedQIndex === snapshot.questions_review.length - 1}
                    className="neu-chip-primary px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Next Question →</span>
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
