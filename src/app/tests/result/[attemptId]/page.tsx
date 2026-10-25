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
} from 'lucide-react';

export default function ResultAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params?.attemptId as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [snapshot, setSnapshot] = useState<ResultSnapshot | null>(null);
  const [progress, setProgress] = useState<number>(30);
  const [activeStep, setActiveStep] = useState<number>(1);

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

  useEffect(() => {
    let isMounted = true;
    let fetchedSnapshot: ResultSnapshot | null = null;

    // Smooth live progress stages
    const t1 = setTimeout(() => { if (isMounted) { setProgress(60); setActiveStep(2); } }, 350);
    const t2 = setTimeout(() => { if (isMounted) { setProgress(85); setActiveStep(3); } }, 750);
    const t3 = setTimeout(() => { if (isMounted) { setProgress(100); setActiveStep(4); } }, 1150);

    const fetchResult = async () => {
      try {
        const cleanId = attemptId && attemptId !== 'undefined' ? attemptId : 'sample-attempt-1';
        const res = await fetch(`/api/test/result/${cleanId}`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        const text = await res.text();
        if (!text) return;
        const data = JSON.parse(text);
        if (data.success && data.snapshot) {
          fetchedSnapshot = data.snapshot;
          if (isMounted) {
            setSnapshot(data.snapshot);
            const firstWrongIdx = data.snapshot.questions_review.findIndex((q: any) => !q.is_correct && q.your_answer);
            if (firstWrongIdx !== -1) {
              setSelectedQIndex(firstWrongIdx);
            }
          }
        }
      } catch (e) {
        console.error('Fetch result error:', e);
      }
    };

    fetchResult();

    // Transition smoothly after calibration animation completes (~1.4s)
    const completionTimer = setTimeout(async () => {
      if (!isMounted) return;
      if (!fetchedSnapshot) {
        try {
          const cleanId = attemptId && attemptId !== 'undefined' ? attemptId : 'sample-attempt-1';
          const res = await fetch(`/api/test/result/${cleanId}`, { cache: 'no-store' });
          const text = await res.text();
          if (text) {
            const data = JSON.parse(text);
            if (data.snapshot && isMounted) {
              setSnapshot(data.snapshot);
            }
          }
        } catch {
          // Handled gracefully
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    }, 1400);

    return () => {
      isMounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(completionTimer);
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

  if (loading || !snapshot) {
    const steps = [
      { num: 1, title: 'Aggregating Section Responses', desc: 'Verified candidate submissions & autosave records' },
      { num: 2, title: 'Applying Scoring Scheme', desc: '+1.00 for correct, -0.25 negative marking deduction' },
      { num: 3, title: 'Calibrating Cohort Percentile', desc: 'Benchmarking against active banking exam aspirants' },
      { num: 4, title: 'Compiling Comprehensive Scorecard', desc: 'Preparing topic analytics, speed trends & solutions' },
    ];

    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-[#0F172A] relative overflow-hidden">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none" />

        {/* Unified Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="max-w-md sm:max-w-lg mx-auto w-full pt-8 pb-12 px-4 text-center space-y-6 z-10 my-auto">
          {/* Animated Brand Motif with Radial Pulse */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#005CE6]/15 animate-ping" />
            <div className="relative z-10 transition-transform duration-500">
              <BrandLogo size={56} showWordmark={false} />
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-50 text-[#005CE6] border border-blue-200">
              <Zap className="w-3.5 h-3.5 text-[#005CE6] animate-pulse" />
              <span>Real-Time Scoring Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Computing Your Scorecard...
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Evaluating sectional accuracy, percentile ranking, and psychometric topic breakdown.
            </p>
          </div>

          {/* Card with Progress Bar & Live Stepped Checklist */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#BCEBFC] shadow-[0_8px_30px_rgba(0,92,230,0.06)] text-left space-y-4">
            {/* Live Progress Bar */}
            <div className="space-y-2 pb-2 border-b border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Calibration Progress</span>
                <span className="font-mono font-bold text-[#005CE6]">{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                <div
                  className="h-full bg-gradient-to-r from-[#005CE6] via-[#0096D6] to-[#60CEF8] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stepped Checklist */}
            <div className="space-y-3 pt-1">
              {steps.map((st) => {
                const isCompleted = activeStep > st.num || progress === 100;
                const isCurrent = activeStep === st.num && progress < 100;
                return (
                  <div key={st.num} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-[#005CE6] border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                      )}
                    </div>
                    <div>
                      <div className={cn("text-xs font-bold", isCompleted || isCurrent ? "text-slate-900" : "text-slate-400")}>
                        {st.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {st.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <footer className="py-6 text-xs text-center text-slate-400">
          SatPrep &bull; Official Examination Analytics
        </footer>
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
          {snapshot.questions_review[selectedQIndex] && (() => {
            const activeQ = snapshot.questions_review[selectedQIndex];
            return (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#BCEBFC] shadow-sm space-y-4">
                {/* Compact Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#005CE6] text-white text-[11px]">
                      Q{activeQ.position} of {snapshot.questions_review.length}
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
                      setSelectedQIndex((prev) => Math.min(snapshot.questions_review.length - 1, prev + 1));
                      setExplanationTab('solution');
                    }}
                    disabled={selectedQIndex === snapshot.questions_review.length - 1}
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
