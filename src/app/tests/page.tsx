'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';
import {
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  SlidersHorizontal,
  Flame,
  Target,
  BarChart3,
  Sparkles,
  BookOpen,
  Layers,
  Loader2,
  TrendingUp,
  AlertCircle,
  X,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface MockTestItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  category: 'full_mock' | 'sectional';
  examId: string;
  questionCount: number;
  durationMin: number;
  negativeMarks: number;
  totalMarks: number;
  difficulty: 'Standard' | 'Moderate' | 'Hard';
  topicsCovered: string[];
  cutoffHint: string;
  featured?: boolean;
}

const MOCK_TESTS_CATALOG: MockTestItem[] = [
  {
    id: 'ibps-po-mock-1',
    title: 'IBPS PO Prelims 2026 — All India Mock #1',
    subtitle: 'Standard IBPS PO Prelims blueprint matching actual exam distribution: 5 Quad, 5 Approx, 5 Series, 10 DI, 10 Arithmetic.',
    badge: 'All India Live Mock',
    badgeColor: 'bg-blue-100 text-[#005CE6] border-blue-200',
    category: 'full_mock',
    examId: 'ibps-po-prelims-2026',
    questionCount: 35,
    durationMin: 20,
    negativeMarks: 0.25,
    totalMarks: 35,
    difficulty: 'Standard',
    topicsCovered: ['Simplification', 'Quadratic', 'Number Series', 'Tabular DI', 'Arithmetic'],
    cutoffHint: 'Target Cutoff: 58.5 / 100 Overall (~21/35 in Quant)',
    featured: true,
  },
  {
    id: 'ibps-po-mock-2',
    title: 'IBPS PO Prelims 2026 — All India Mock #2',
    subtitle: 'High-yield prelims test with challenging Data Interpretation sets and multi-step commercial arithmetic word problems.',
    badge: 'Pro Mock Series',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    category: 'full_mock',
    examId: 'ibps-po-prelims-2026',
    questionCount: 35,
    durationMin: 20,
    negativeMarks: 0.25,
    totalMarks: 35,
    difficulty: 'Moderate',
    topicsCovered: ['Bar & Pie DI', 'Tabular DI', 'Profit & Loss', 'SI & CI', 'Time & Work'],
    cutoffHint: 'Target Cutoff: 56.0 / 100 Overall (~19/35 in Quant)',
  },
  {
    id: 'sbi-clerk-mock-1',
    title: 'SBI Clerk Prelims 2026 — Speed Crunch Mock #1',
    subtitle: 'High speed clerical numerical ability paper. Maximize attempt count with fast simplification and quadratic shortcuts.',
    badge: 'High Speed Focus',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    category: 'full_mock',
    examId: 'sbi-clerk-prelims-2026',
    questionCount: 35,
    durationMin: 20,
    negativeMarks: 0.25,
    totalMarks: 35,
    difficulty: 'Standard',
    topicsCovered: ['Simplification', 'Number Series', 'Tabular DI', 'Ratio & Proportion'],
    cutoffHint: 'Target Cutoff: 72.0+ Clerical Score (~28/35 in Quant)',
  },
  {
    id: 'rbi-assistant-mock-1',
    title: 'RBI Assistant Prelims 2026 — 90%+ Accuracy Mock #1',
    subtitle: 'Apex central bank prelims simulation requiring 90%+ accuracy and minimal negative mark deductions.',
    badge: '90%+ Accuracy Ramp',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    category: 'full_mock',
    examId: 'rbi-assistant-2026',
    questionCount: 35,
    durationMin: 20,
    negativeMarks: 0.25,
    totalMarks: 35,
    difficulty: 'Hard',
    topicsCovered: ['Simplification', 'Quadratic', 'Percentage', 'SI & CI', 'Tabular DI'],
    cutoffHint: 'Target Cutoff: 88.0+ Score (~32/35 in Quant)',
  },
  {
    id: 'sectional-speed-math-1',
    title: 'Quant Sectional Test 01 — Speed Math Blitz',
    subtitle: 'Focused sectional drill on high-speed calculation: Simplification, Missing/Wrong Series, and Quadratic Equations.',
    badge: 'Sectional Speed',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    category: 'sectional',
    examId: 'ibps-po-prelims-2026',
    questionCount: 20,
    durationMin: 12,
    negativeMarks: 0.25,
    totalMarks: 20,
    difficulty: 'Standard',
    topicsCovered: ['Simplification', 'Quadratic Equations', 'Number Series'],
    cutoffHint: 'Target: 18+ Attempts in 12 Mins',
  },
  {
    id: 'sectional-di-mastery-1',
    title: 'Quant Sectional Test 02 — Data Interpretation Mastery',
    subtitle: 'Pure DI sprint featuring 3 complete caselet/chart sets: Tabular, Bar Charts, and Pie Charts with speed calculation.',
    badge: 'DI Specialist',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    category: 'sectional',
    examId: 'ibps-po-prelims-2026',
    questionCount: 15,
    durationMin: 12,
    negativeMarks: 0.25,
    totalMarks: 15,
    difficulty: 'Moderate',
    topicsCovered: ['Tabular DI', 'Bar & Pie Chart DI'],
    cutoffHint: 'Target: 12+ Score in 12 Mins',
  },
  {
    id: 'sectional-arithmetic-word-1',
    title: 'Quant Sectional Test 03 — Arithmetic Word Problems',
    subtitle: 'Sharpen your conceptual edge on Profit & Loss, Simple/Compound Interest, Time & Work, and Time Speed Distance.',
    badge: 'Arithmetic Edge',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    category: 'sectional',
    examId: 'ibps-po-prelims-2026',
    questionCount: 15,
    durationMin: 15,
    negativeMarks: 0.25,
    totalMarks: 15,
    difficulty: 'Hard',
    topicsCovered: ['Profit & Loss', 'Percentage', 'SI & CI', 'Time & Work', 'TSD'],
    cutoffHint: 'Target: 11+ Score in 15 Mins',
  },
];

export default function MockTestsHubPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'full_mock' | 'sectional'>('all');
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Settings Modal State
  const [configuringTest, setConfiguringTest] = useState<MockTestItem | null>(null);
  const [configFeedbackMode, setConfigFeedbackMode] = useState<'exam' | 'practice'>('exam');
  const [configDuration, setConfigDuration] = useState<number>(20);
  const [configPenalty, setConfigPenalty] = useState<number>(0.25);
  const [configQuestionCount, setConfigQuestionCount] = useState<number>(35);
  const [configShuffle, setConfigShuffle] = useState<boolean>(true);

  const filteredTests = MOCK_TESTS_CATALOG.filter((test) => {
    if (selectedCategory === 'all') return true;
    return test.category === selectedCategory;
  });

  const handleOpenSettings = (test: MockTestItem) => {
    setConfiguringTest(test);
    setConfigFeedbackMode('exam');
    setConfigDuration(test.durationMin);
    setConfigPenalty(test.negativeMarks);
    setConfigQuestionCount(test.questionCount);
    setConfigShuffle(true);
  };

  const handleStartMock = async (
    test: MockTestItem,
    overrides?: {
      duration_min?: number;
      question_count?: number;
      feedback_mode?: 'exam' | 'practice';
      negative_marks?: number;
    }
  ) => {
    setLoadingTestId(test.id);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/test/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: test.title,
          exam_id: test.examId,
          mode: test.category,
          question_count: overrides?.question_count ?? test.questionCount,
          duration_min: overrides?.duration_min ?? test.durationMin,
          feedback_mode: overrides?.feedback_mode ?? 'exam',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize mock test');
      }

      router.push(`/tests/${data.test_id}/instructions`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating test. Please try again.');
      setLoadingTestId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FDFF] text-[#0F172A] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#BCEBFC]">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0F4FD] border border-[#BCEBFC] text-[#005CE6] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Real IBPS Exam Simulator 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Mock Tests Series
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Experience the actual 20-minute sectional speed crunch with 35 questions, authentic negative marking (-0.25), server-synchronized timers, and live percentile benchmarking.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/tests/new?mode=full_mock"
              className="px-5 py-2.5 rounded-2xl bg-[#005CE6] hover:bg-[#004dc2] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Customize Mock</span>
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#E0F4FD]/60 border border-[#BCEBFC]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
                selectedCategory === 'all'
                  ? "bg-white text-[#005CE6] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              All Tests ({MOCK_TESTS_CATALOG.length})
            </button>
            <button
              onClick={() => setSelectedCategory('full_mock')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
                selectedCategory === 'full_mock'
                  ? "bg-white text-[#005CE6] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Full-Length Prelims (35 Qs)
            </button>
            <button
              onClick={() => setSelectedCategory('sectional')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
                selectedCategory === 'sectional'
                  ? "bg-white text-[#005CE6] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Sectional Speed Mocks
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Exact IBPS PO & Clerk Question Blueprint</span>
          </div>
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const isLoading = loadingTestId === test.id;
            return (
              <div
                key={test.id}
                className="neu-glass-card rounded-3xl p-6 flex flex-col justify-between transition-all relative overflow-hidden group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-end">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {test.durationMin} Mins
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#005CE6] transition-colors leading-snug">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {test.subtitle}
                    </p>
                  </div>

                  {/* Test Metrics Pill Bar — Improvised Aesthetic Design */}
                  <div className="grid grid-cols-3 gap-1 p-2 rounded-2xl bg-gradient-to-b from-[#F8FCFF] via-[#F1F8FD] to-[#EAF5FC] border border-[#BCEBFC] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,92,230,0.03)] text-center divide-x divide-[#D6EEFC]">
                    <div className="px-1.5 py-1 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                        <Target className="w-2.5 h-2.5 text-[#005CE6]" />
                        <span>Questions</span>
                      </div>
                      <span className="text-[13px] font-black text-slate-900 font-mono tracking-tight">{test.questionCount} Qs</span>
                    </div>
                    <div className="px-1.5 py-1 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                        <Award className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Marks</span>
                      </div>
                      <span className="text-[13px] font-black text-[#005CE6] font-mono tracking-tight">{test.totalMarks}</span>
                    </div>
                    <div className="px-1.5 py-1 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                        <AlertCircle className="w-2.5 h-2.5 text-rose-500" />
                        <span>Penalty</span>
                      </div>
                      <span className="text-[13px] font-black text-rose-600 font-mono tracking-tight">-{test.negativeMarks}</span>
                    </div>
                  </div>

                  {/* Topics Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {test.topicsCovered.map((topic, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-600">
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Cutoff Hint */}
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 pt-1">
                    <Target className="w-3.5 h-3.5 text-[#005CE6]" />
                    <span>{test.cutoffHint}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleStartMock(test)}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#005CE6] to-[#007AE6] hover:from-[#004dc2] hover:to-[#0066cc] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Starting Test...</span>
                      </>
                    ) : (
                      <>
                        <span>Start Mock Exam</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenSettings(test)}
                    className="p-3 rounded-xl border border-[#BCEBFC] hover:border-[#005CE6] hover:bg-[#F0FAFF] text-[#005CE6] transition-all cursor-pointer shadow-2xs hover:shadow-xs group/btn flex items-center justify-center"
                    title="Configure mock test settings & options"
                  >
                    <SlidersHorizontal className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mock Test Settings & Options Modal */}
        {configuringTest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#BCEBFC] shadow-[0_20px_60px_rgba(0,92,230,0.18)] p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E0F4FD] border border-[#BCEBFC] flex items-center justify-center text-[#005CE6] shadow-2xs">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Test Settings &amp; Options
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-sm mt-0.5">
                      {configuringTest.title}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setConfiguringTest(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Option 1: Feedback & Exam Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Feedback &amp; Scoring Mode
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setConfigFeedbackMode('exam');
                      setConfigPenalty(configuringTest.negativeMarks);
                    }}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2",
                      configFeedbackMode === 'exam'
                        ? "bg-[#F0FAFF] border-[#005CE6] text-[#005CE6] ring-2 ring-[#005CE6]/20 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-extrabold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Exam Mode
                      </span>
                      {configFeedbackMode === 'exam' && <CheckCircle2 className="w-3.5 h-3.5 text-[#005CE6]" />}
                    </div>
                    <span className="text-[11px] text-slate-500 leading-tight">
                      Strict timer, solutions at end, authentic -0.25 penalty.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfigFeedbackMode('practice');
                      setConfigPenalty(0);
                    }}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2",
                      configFeedbackMode === 'practice'
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-extrabold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Practice Mode
                      </span>
                      {configFeedbackMode === 'practice' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 leading-tight">
                      Instant option verification, derivations revealed, 0 penalty.
                    </span>
                  </button>
                </div>
              </div>

              {/* Option 2: Countdown Timer Duration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Sectional Timer Duration
                  </label>
                  <span className="text-xs font-mono font-bold text-[#005CE6]">
                    {configDuration === 0 ? "Untimed" : `${configDuration} Minutes`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: `${configuringTest.durationMin}m (Official)`, val: configuringTest.durationMin },
                    { label: `${configuringTest.durationMin + 5}m (Extended)`, val: configuringTest.durationMin + 5 },
                    { label: `${Math.max(10, configuringTest.durationMin - 5)}m (Sprint)`, val: Math.max(10, configuringTest.durationMin - 5) },
                    { label: "Untimed", val: 0 },
                  ].map((dur) => (
                    <button
                      key={dur.label}
                      type="button"
                      onClick={() => setConfigDuration(dur.val)}
                      className={cn(
                        "py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center",
                        configDuration === dur.val
                          ? "bg-[#005CE6] text-white border-[#005CE6] shadow-xs"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      )}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Negative Penalty Rule */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Negative Penalty Deduction
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConfigPenalty(configuringTest.negativeMarks)}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer",
                      configPenalty > 0
                        ? "bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-200"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span>-{configuringTest.negativeMarks} Penalty (Official)</span>
                    {configPenalty > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigPenalty(0)}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer",
                      configPenalty === 0
                        ? "bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span>0 Negative Marks (Relaxed)</span>
                    {configPenalty === 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              </div>

              {/* Option 4: Question Count */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Question Quantity
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConfigQuestionCount(configuringTest.questionCount)}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer",
                      configQuestionCount === configuringTest.questionCount
                        ? "bg-[#005CE6] text-white border-[#005CE6] shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span>Full Blueprint ({configuringTest.questionCount} Questions)</span>
                    {configQuestionCount === configuringTest.questionCount && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigQuestionCount(15)}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer",
                      configQuestionCount === 15
                        ? "bg-[#005CE6] text-white border-[#005CE6] shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span>Short Sprint (15 Questions)</span>
                    {configQuestionCount === 15 && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setConfiguringTest(null)}
                  className="w-1/3 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={loadingTestId === configuringTest.id}
                  onClick={() => {
                    handleStartMock(configuringTest, {
                      duration_min: configDuration,
                      question_count: configQuestionCount,
                      feedback_mode: configFeedbackMode,
                      negative_marks: configPenalty,
                    });
                  }}
                  className="w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#005CE6] to-[#007AE6] hover:from-[#004dc2] hover:to-[#0066cc] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingTestId === configuringTest.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initializing Test...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch with Custom Settings</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Custom Test Callout Banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#005CE6] via-[#006DE6] to-[#0096D6] text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold inline-block">
              Customized Test Blueprint
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Want a custom duration, question set, or specific topics?
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl">
              Use our interactive Test Builder to handpick exact subtopics, adjust question counts, select difficulty tiers, and simulate unique test conditions.
            </p>
          </div>
          <Link
            href="/tests/new"
            className="px-6 py-3.5 rounded-2xl bg-white text-[#005CE6] hover:bg-blue-50 font-extrabold text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Open Custom Test Builder</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
