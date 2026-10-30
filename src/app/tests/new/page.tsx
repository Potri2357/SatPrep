'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { BrandLogo } from '@/components/brand-logo';
import { INITIAL_TOPICS } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Zap,
  SlidersHorizontal,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  Award,
  Layers,
  BookOpen,
  Flame,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Calculator,
  Plus,
  Lightbulb,
  ShieldCheck,
  RotateCcw,
  Target,
  Compass,
} from 'lucide-react';

export interface MatrixTier {
  tierNumber: number;
  tierName: string;
  difficultyLabel: string;
  badgeClass: string;
  coreFocus: string;
  blueprintProfile: string;
  targetStrategy: string;
}

export const QUANT_DIFFICULTY_MATRIX: Record<number, MatrixTier> = {
  1: {
    tierNumber: 1,
    tierName: 'Tier 1: Pure Velocity',
    difficultyLabel: 'The Easiest',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    coreFocus: 'Raw Processing Speed — High school level math, Near-flawless execution needed',
    blueprintProfile: '10–15 Simplification / Approximations, 5 Direct Quadratic Equations, 5 Simple Missing/Wrong Series, 1 Standard, readable graph / chart',
    targetStrategy: 'Flawless Sprint: Solve systematically from question 1 to 35; absolute maximum speed.',
  },
  2: {
    tierNumber: 2,
    tierName: 'Tier 2: Calculation Stamina',
    difficultyLabel: 'Moderate',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
    coreFocus: 'Conceptual Speed & Endurance — Lengthy, calculated numbers, Brutal cut-offs for Assistant',
    blueprintProfile: '2–3 DI sets (including Caselets), 10–15 multi-step Word Problems, Minimal to no simple speed math, Lengthy calculation steps',
    targetStrategy: 'Balanced Flow: Secure the few speed math marks, then pick direct DI/Word problems.',
  },
  3: {
    tierNumber: 3,
    tierName: 'Tier 3: Conceptual Depth',
    difficultyLabel: 'Moderate-High',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
    coreFocus: 'Advanced Concept Application — Deep arithmetic mastery, Stringent sectional limits',
    blueprintProfile: 'Tough Arithmetic Word Problems, Logical Number Series, Calculated, multi-step DI tables, Data Sufficiency sets',
    targetStrategy: 'Accuracy: Focus on core strengths (Arithmetic/DI) with steady pacing.',
  },
  4: {
    tierNumber: 4,
    tierName: 'Tier 4: Advanced Analytics',
    difficultyLabel: 'The Toughest',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
    coreFocus: 'Logical Analysis & Interpretation — Extreme time pressure, Structurally unique problems',
    blueprintProfile: 'Missing Data Interpretation, Variable-based Arithmetic Caselets, Probability / Permutation charts, Multi-layered quantity comparisons',
    targetStrategy: 'Selectivity: Target 10–15 high-accuracy questions; skip the traps.',
  },
};

export interface ExamProfile {
  id: string;
  name: string;
  shortName: string;
  stage: string;
  tier: 1 | 2 | 3 | 4;
  badge: string;
  description: string;
  patterns: {
    full_mock: { questions: number; duration: number; negative: number; marks: number };
    sectional: { questions: number; duration: number; negative: number; marks: number };
    topic_test: { questions: number; duration: number; negative: number; marks: number };
  };
  recommendedTopics: string[];
}

export const EXAM_PROFILES: Record<string, ExamProfile> = {
  // Tier 1: Pure Velocity (The Easiest)
  'sbi-clerk-prelims': {
    id: 'sbi-clerk-prelims',
    name: 'SBI Clerk Prelims',
    shortName: 'SBI Clerk Pre',
    stage: 'Prelims',
    tier: 1,
    badge: 'Pure Velocity',
    description: 'Raw processing speed mock with speed math, quadratic roots, and single-table DI.',
    patterns: {
      full_mock: { questions: 35, duration: 20, negative: 0.25, marks: 35 },
      sectional: { questions: 25, duration: 15, negative: 0.25, marks: 25 },
      topic_test: { questions: 10, duration: 8, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['simplification', 'quadratic-equations', 'number-series', 'ratio-proportion'],
  },
  'ibps-clerk-prelims': {
    id: 'ibps-clerk-prelims',
    name: 'IBPS Clerk Prelims',
    shortName: 'IBPS Clerk Pre',
    stage: 'Prelims',
    tier: 1,
    badge: 'Pure Velocity',
    description: '10–15 Simplification, 5 Quadratic Equations, 5 Series, 1 standard graph.',
    patterns: {
      full_mock: { questions: 35, duration: 20, negative: 0.25, marks: 35 },
      sectional: { questions: 25, duration: 15, negative: 0.25, marks: 25 },
      topic_test: { questions: 10, duration: 8, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['simplification', 'quadratic-equations', 'number-series', 'percentage'],
  },
  'rbi-assistant-prelims': {
    id: 'rbi-assistant-prelims',
    name: 'RBI Assistant Prelims',
    shortName: 'RBI Assistant Pre',
    stage: 'Prelims',
    tier: 1,
    badge: '90%+ Cut-off Sprint',
    description: 'High school level math requiring near-flawless execution and blistering speed.',
    patterns: {
      full_mock: { questions: 35, duration: 20, negative: 0.25, marks: 35 },
      sectional: { questions: 25, duration: 15, negative: 0.25, marks: 25 },
      topic_test: { questions: 10, duration: 8, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['simplification', 'quadratic-equations', 'percentage', 'tabular-di'],
  },
  'ibps-rrb-clerk-mains': {
    id: 'ibps-rrb-clerk-mains',
    name: 'IBPS RRB Clerk Mains',
    shortName: 'RRB Clerk Mains',
    stage: 'Mains',
    tier: 1,
    badge: 'Speed Clerical Mains',
    description: 'High-speed clerical numerical ability mock series with speed shortcuts and DI sets.',
    patterns: {
      full_mock: { questions: 40, duration: 30, negative: 0.25, marks: 50 },
      sectional: { questions: 25, duration: 20, negative: 0.25, marks: 30 },
      topic_test: { questions: 10, duration: 10, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['simplification', 'number-series', 'percentage', 'tabular-di', 'profit-and-loss'],
  },

  // Tier 2: Calculation Stamina (Moderate)
  'sbi-po-prelims': {
    id: 'sbi-po-prelims',
    name: 'SBI PO Prelims',
    shortName: 'SBI PO Pre',
    stage: 'Prelims',
    tier: 2,
    badge: 'Calculation Stamina',
    description: '2–3 DI sets, 10–15 multi-step Word Problems, minimal simple speed math.',
    patterns: {
      full_mock: { questions: 35, duration: 20, negative: 0.25, marks: 35 },
      sectional: { questions: 20, duration: 15, negative: 0.25, marks: 20 },
      topic_test: { questions: 10, duration: 10, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['tabular-di', 'profit-and-loss', 'time-and-work', 'si-ci', 'quadratic-equations'],
  },
  'ibps-po-prelims-2026': {
    id: 'ibps-po-prelims-2026',
    name: 'IBPS PO Prelims 2026',
    shortName: 'IBPS PO Pre',
    stage: 'Prelims',
    tier: 2,
    badge: 'Scale I Officer Standard',
    description: '35 Questions Quantitative Aptitude, 20 Minutes sectional timing, -0.25 negative marks.',
    patterns: {
      full_mock: { questions: 35, duration: 20, negative: 0.25, marks: 35 },
      sectional: { questions: 20, duration: 15, negative: 0.25, marks: 20 },
      topic_test: { questions: 10, duration: 10, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['quadratic-equations', 'simplification', 'number-series', 'profit-and-loss', 'tabular-di'],
  },
  'sbi-clerk-mains': {
    id: 'sbi-clerk-mains',
    name: 'SBI Clerk Mains',
    shortName: 'SBI Clerk Mains',
    stage: 'Mains',
    tier: 2,
    badge: 'Lengthy Calculations',
    description: 'Calculated multi-step questions, Caselet DI, and arithmetic word problems.',
    patterns: {
      full_mock: { questions: 50, duration: 45, negative: 0.25, marks: 50 },
      sectional: { questions: 25, duration: 25, negative: 0.25, marks: 25 },
      topic_test: { questions: 10, duration: 12, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['tabular-di', 'bar-pie-di', 'profit-and-loss', 'time-speed-distance', 'si-ci'],
  },
  'ibps-clerk-mains': {
    id: 'ibps-clerk-mains',
    name: 'IBPS Clerk Mains',
    shortName: 'IBPS Clerk Mains',
    stage: 'Mains',
    tier: 2,
    badge: 'Moderate DI & Arithmetic',
    description: 'Balanced Flow: Secure the few speed math marks, then pick direct DI and word problems.',
    patterns: {
      full_mock: { questions: 50, duration: 45, negative: 0.25, marks: 50 },
      sectional: { questions: 25, duration: 25, negative: 0.25, marks: 25 },
      topic_test: { questions: 10, duration: 12, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['tabular-di', 'percentage', 'ratio-proportion', 'time-and-work', 'number-series'],
  },
  'rbi-assistant-mains': {
    id: 'rbi-assistant-mains',
    name: 'RBI Assistant Mains',
    shortName: 'RBI Assistant Mains',
    stage: 'Mains',
    tier: 2,
    badge: 'High Precision Cut-off',
    description: 'High cut-offs requiring high stamina and fast arithmetic problem selection.',
    patterns: {
      full_mock: { questions: 40, duration: 30, negative: 0.25, marks: 40 },
      sectional: { questions: 20, duration: 18, negative: 0.25, marks: 20 },
      topic_test: { questions: 10, duration: 10, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['tabular-di', 'profit-and-loss', 'si-ci', 'quadratic-equations', 'percentage'],
  },

  // Tier 3: Conceptual Depth (Moderate-High)
  'rbi-grade-b-phase-1': {
    id: 'rbi-grade-b-phase-1',
    name: 'RBI Grade B Phase 1',
    shortName: 'RBI Grade B',
    stage: 'Phase 1',
    tier: 3,
    badge: 'Conceptual Depth',
    description: 'Tough Arithmetic Word Problems, Logical Number Series, Calculated DI tables, Data Sufficiency.',
    patterns: {
      full_mock: { questions: 30, duration: 25, negative: 0.25, marks: 30 },
      sectional: { questions: 15, duration: 15, negative: 0.25, marks: 15 },
      topic_test: { questions: 10, duration: 12, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['tabular-di', 'profit-and-loss', 'time-speed-distance', 'time-and-work', 'si-ci'],
  },
  'ibps-rrb-po-mains': {
    id: 'ibps-rrb-po-mains',
    name: 'IBPS RRB PO Mains',
    shortName: 'RRB PO Mains',
    stage: 'Mains',
    tier: 3,
    badge: 'Advanced Concept Application',
    description: 'Deep arithmetic mastery, multi-step DI tables, and stringent sectional pacing.',
    patterns: {
      full_mock: { questions: 40, duration: 35, negative: 0.25, marks: 50 },
      sectional: { questions: 20, duration: 20, negative: 0.25, marks: 25 },
      topic_test: { questions: 10, duration: 12, negative: 0.25, marks: 10 },
    },
    recommendedTopics: ['tabular-di', 'bar-pie-di', 'profit-and-loss', 'time-and-work', 'ratio-proportion'],
  },

  // Tier 4: Advanced Analytics (The Toughest)
  'sbi-po-mains': {
    id: 'sbi-po-mains',
    name: 'SBI PO Mains',
    shortName: 'SBI PO Mains',
    stage: 'Mains',
    tier: 4,
    badge: 'Advanced Analytics',
    description: 'Missing DI, Variable-based Arithmetic Caselets, probability charts, multi-layered quantity comparisons.',
    patterns: {
      full_mock: { questions: 30, duration: 45, negative: 0.33, marks: 50 },
      sectional: { questions: 15, duration: 25, negative: 0.33, marks: 25 },
      topic_test: { questions: 8, duration: 15, negative: 0.33, marks: 15 },
    },
    recommendedTopics: ['tabular-di', 'bar-pie-di', 'profit-and-loss', 'time-speed-distance', 'si-ci'],
  },
  'ibps-po-mains': {
    id: 'ibps-po-mains',
    name: 'IBPS PO Mains',
    shortName: 'IBPS PO Mains',
    stage: 'Mains',
    tier: 4,
    badge: 'Extreme Time Pressure',
    description: 'Structurally unique problems. Selectivity Strategy: Target 10–15 high-accuracy questions; skip the traps.',
    patterns: {
      full_mock: { questions: 35, duration: 45, negative: 0.25, marks: 60 },
      sectional: { questions: 20, duration: 25, negative: 0.25, marks: 35 },
      topic_test: { questions: 10, duration: 15, negative: 0.25, marks: 15 },
    },
    recommendedTopics: ['tabular-di', 'bar-pie-di', 'time-and-work', 'profit-and-loss', 'si-ci'],
  },
};

function TestBuilderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL query parameters
  const queryMode = searchParams.get('mode');
  const queryFeedback = searchParams.get('feedback');
  const queryTopic = searchParams.get('topic');

  // Test Creation State
  const [examId, setExamId] = useState<string>('ibps-po-prelims-2026');
  const [tierFilter, setTierFilter] = useState<number | 'all'>('all');
  const [mode, setMode] = useState<'full_mock' | 'sectional' | 'topic_test'>(
    queryMode === 'topic_test' || queryMode === 'sectional' ? queryMode : 'full_mock'
  );
  const [feedbackMode, setFeedbackMode] = useState<'exam' | 'practice'>(
    queryFeedback === 'practice' || queryMode === 'topic_test' ? 'practice' : 'exam'
  );
  const [difficultyMix, setDifficultyMix] = useState<string>('mixed');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active exam profile
  const currentExam = useMemo(() => {
    return EXAM_PROFILES[examId] || EXAM_PROFILES['ibps-po-prelims-2026'];
  }, [examId]);

  // Active tier matrix specification
  const currentTierMatrix = useMemo(() => {
    return QUANT_DIFFICULTY_MATRIX[currentExam.tier];
  }, [currentExam.tier]);

  // Filtered exams according to selected Tier
  const visibleExams = useMemo(() => {
    const list = Object.values(EXAM_PROFILES);
    if (tierFilter === 'all') return list;
    return list.filter((e) => e.tier === tierFilter);
  }, [tierFilter]);

  // Selected topics
  const [selectedTopics, setSelectedTopics] = useState<string[]>(() => {
    if (queryTopic) {
      const matched = queryTopic.split(',').filter(Boolean);
      if (matched.length > 0) return matched;
    }
    return EXAM_PROFILES['ibps-po-prelims-2026'].recommendedTopics;
  });

  const handleExamChange = (newExamId: string) => {
    setExamId(newExamId);
    const profile = EXAM_PROFILES[newExamId] || EXAM_PROFILES['ibps-po-prelims-2026'];
    if (!queryTopic) {
      setSelectedTopics(profile.recommendedTopics);
    }
  };

  const handleModeChange = (newMode: 'full_mock' | 'sectional' | 'topic_test') => {
    setMode(newMode);
    if (newMode === 'topic_test') {
      setFeedbackMode('practice');
    } else {
      setFeedbackMode('exam');
    }
  };

  const pattern = currentExam.patterns[mode];

  const handleToggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.length > 1
          ? prev.filter((t) => t !== topicId)
          : prev
        : [...prev, topicId]
    );
  };

  const selectAllInGroup = (groupTopics: typeof INITIAL_TOPICS) => {
    const ids = groupTopics.map((t) => t.id);
    const allSelected = ids.every((id) => selectedTopics.includes(id));
    if (allSelected) {
      const remaining = selectedTopics.filter((t) => !ids.includes(t));
      setSelectedTopics(remaining.length > 0 ? remaining : [ids[0]]);
    } else {
      setSelectedTopics((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const handleCreateTest = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/test/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${currentExam.name} - ${mode === 'full_mock' ? 'Full Mock' : mode === 'sectional' ? 'Sectional' : 'Drill'}`,
          exam_id: examId,
          mode,
          topics: selectedTopics,
          question_count: pattern.questions,
          duration_min: feedbackMode === 'practice' ? undefined : pattern.duration,
          feedback_mode: feedbackMode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to assemble exam');
      }

      router.push(`/tests/${data.test_id}/instructions`);
    } catch (err: any) {
      alert(err.message || 'Error creating test. Please try again.');
      setIsSubmitting(false);
    }
  };

  const numberTopics = INITIAL_TOPICS.filter((t) => t.group_name === 'Number-based');
  const arithTopics = INITIAL_TOPICS.filter((t) => t.group_name === 'Arithmetic');
  const diTopics = INITIAL_TOPICS.filter((t) => t.group_name === 'DI');

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090E17] flex flex-col justify-between text-slate-800 dark:text-slate-100 selection:bg-[#005CE6] selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left 2 Cols: Exam & Mode Configuration */}
        <div className="lg:col-span-2 space-y-7">
          {/* Title Area */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              {mode === 'topic_test' ? 'Configure Topic Drill' : 'Create Bank Quant Practice Test'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Select your target bank examination from the calibrated 4-Tier Difficulty Matrix. Every test is systematically assembled to mirror authentic IBPS and SBI exam patterns.
            </p>
          </div>

          {/* Section 1: Target Exam Picker & Matrix Filter */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111A2E] border border-[#BCEBFC] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,92,230,0.05)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#005CE6] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>The Bank-Only Quant Difficulty Matrix</span>
              </span>
            </div>

            {/* Matrix Tier Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Exams (13)' },
                { id: 1, label: 'Tier 1: Velocity' },
                { id: 2, label: 'Tier 2: Stamina' },
                { id: 3, label: 'Tier 3: Depth' },
                { id: 4, label: 'Tier 4: Analytics' },
              ].map((tab) => {
                const active = tierFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTierFilter(tab.id as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                      active
                        ? "bg-[#005CE6] text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 hover:text-slate-900"
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Exam Selection Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {visibleExams.map((e) => {
                const isSelected = examId === e.id;
                const ePattern = e.patterns[mode];
                const tierInfo = QUANT_DIFFICULTY_MATRIX[e.tier];
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => handleExamChange(e.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      isSelected
                        ? 'border-[#005CE6] bg-[#F0FAFF] dark:bg-blue-950/40 text-[#005CE6] shadow-sm ring-2 ring-[#005CE6]/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-[#005CE6]/50 hover:bg-[#F0FAFF]/40 text-slate-700 dark:text-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-xs text-[#0F172A] dark:text-white group-hover:text-[#005CE6] transition-colors">
                          {e.name}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                          isSelected ? 'bg-[#005CE6] text-white shadow-sm' : 'border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${tierInfo.badgeClass}`}>
                        Tier {e.tier}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {e.stage}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium font-mono">
                      {ePattern.questions} Qs · {ePattern.duration} Mins · -{ePattern.negative}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Matrix Blueprint Profile Card (The Bank-Only Quant Difficulty Matrix) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 via-white to-blue-50/30 dark:from-slate-900 dark:via-[#111A2E] dark:to-slate-900 border border-blue-200/80 dark:border-blue-900 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#005CE6]" />
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {currentTierMatrix.tierName} <span className="font-normal text-slate-500 italic">({currentTierMatrix.difficultyLabel})</span>
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#005CE6] text-white w-fit">
                  Blueprint Profile
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Target className="w-3 h-3 text-[#005CE6]" /> Core Focus &amp; Challenge
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    {currentTierMatrix.coreFocus}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-purple-600" /> Question Blueprint Profile
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    {currentTierMatrix.blueprintProfile}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-100/80 dark:border-slate-800 flex items-start gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] shrink-0 uppercase tracking-wider">
                  Target Strategy
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                  {currentTierMatrix.targetStrategy}
                </span>
              </div>
            </div>

            {/* Mode Selector (Pill Segmented Chips) */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Drill &amp; Test Format
              </label>
              <div className="p-1 rounded-full neu-inset flex gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {[
                  { id: 'full_mock', label: 'Full Prelims Mock (35 Qs)', desc: 'Official Pattern' },
                  { id: 'sectional', label: 'Sectional Speed Test', desc: '15 Mins' },
                  { id: 'topic_test', label: 'Topic Drill', desc: '10 Qs' },
                ].map((m) => {
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleModeChange(m.id as any)}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'neu-chip-primary text-white scale-[1.01]'
                          : 'chip-btn bg-transparent border-transparent shadow-none hover:bg-white/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Learning Style Selector */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#005CE6]" />
                  <span>Feedback &amp; Learning Mode</span>
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  {feedbackMode === 'practice' ? 'Instant derivations on' : 'Exam hall simulation'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Practice Mode Card */}
                <button
                  type="button"
                  onClick={() => setFeedbackMode('practice')}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all cursor-pointer relative",
                    feedbackMode === 'practice'
                      ? "border-[#005CE6] bg-[#F0FAFF] dark:bg-blue-950/40 ring-2 ring-[#005CE6]/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-[#005CE6]/40 hover:bg-[#F0FAFF]/20 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                        <Lightbulb className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-xs text-[#0F172A] dark:text-white">
                        Practice Mode (Instant Feedback)
                      </span>
                    </div>
                    {feedbackMode === 'practice' && (
                      <span className="w-4 h-4 rounded-full bg-[#005CE6] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Immediate step-by-step derivation, 15-second shortcut, and option trap review after each question. Untimed, zero negative marks.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                      Recommended for Topic Drills
                    </span>
                  </div>
                </button>

                {/* Exam Mode Card */}
                <button
                  type="button"
                  onClick={() => setFeedbackMode('exam')}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all cursor-pointer relative",
                    feedbackMode === 'exam'
                      ? "border-[#005CE6] bg-[#F0FAFF] dark:bg-blue-950/40 ring-2 ring-[#005CE6]/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-[#005CE6]/40 hover:bg-[#F0FAFF]/20 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#005CE6] dark:text-blue-400 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-xs text-[#0F172A] dark:text-white">
                        Exam Mode (Strict Countdown)
                      </span>
                    </div>
                    {feedbackMode === 'exam' && (
                      <span className="w-4 h-4 rounded-full bg-[#005CE6] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Simulates actual IBPS/SBI exam hall. Strict countdown timer, -0.25 negative marking penalty, all solutions unlocked upon final submission.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      Standard Prelims Exam
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Syllabus Topics Selection */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111A2E] border border-[#BCEBFC] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,92,230,0.05)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#005CE6] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Included Syllabus Topics ({selectedTopics.length} selected)</span>
              </span>
              <span className="text-[11px] text-slate-500">Tap chips to toggle topics</span>
            </div>

            <div className="space-y-4">
              {/* 1. Number & Calculation Speed */}
              <div className="p-4 rounded-2xl bg-[#F0FAFF]/60 dark:bg-blue-950/20 border border-[#BCEBFC]/60 dark:border-blue-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#005CE6] dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#005CE6]" />
                    <span>Number &amp; Calculation Speed</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => selectAllInGroup(numberTopics)}
                    className="text-[10px] font-bold text-[#005CE6] dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Toggle Group
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {numberTopics.map((t) => {
                    const sel = selectedTopics.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleTopic(t.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none flex items-center gap-1.5",
                          sel
                            ? "bg-[#005CE6] text-white shadow-2xs scale-[1.02]"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300"
                        )}
                      >
                        {sel && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Commercial Arithmetic */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-blue-600" />
                    <span>Commercial Arithmetic</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => selectAllInGroup(arithTopics)}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Toggle Group
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {arithTopics.map((t) => {
                    const sel = selectedTopics.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleTopic(t.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none flex items-center gap-1.5",
                          sel
                            ? "bg-[#005CE6] text-white shadow-2xs scale-[1.02]"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300"
                        )}
                      >
                        {sel && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Data Interpretation */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Data Interpretation</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => selectAllInGroup(diTopics)}
                    className="text-[10px] font-bold text-purple-700 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Toggle Group
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {diTopics.map((t) => {
                    const sel = selectedTopics.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleTopic(t.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none flex items-center gap-1.5",
                          sel
                            ? "bg-[#005CE6] text-white shadow-2xs scale-[1.02]"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300"
                        )}
                      >
                        {sel && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Test Summary & Launch Blueprint */}
        <div className="space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111A2E] border border-[#BCEBFC] dark:border-slate-800 shadow-[0_4px_24px_rgba(0,92,230,0.06)] space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-[#005CE6]" />
                <span>Test Specification</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                OFFICIAL PATTERN
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500">Selected Exam</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentExam.name}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500">Difficulty Matrix Tier</span>
                <span className="font-bold text-[#005CE6] dark:text-blue-400">Tier {currentExam.tier} ({currentTierMatrix.difficultyLabel})</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500">Question Volume</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{pattern.questions} Questions</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500">Duration &amp; Timing</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {feedbackMode === 'practice' ? 'Untimed (Self-Paced)' : `${pattern.duration} Minutes Sectional`}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500">Negative Penalty</span>
                <span className="font-bold text-rose-600 font-mono">
                  {feedbackMode === 'practice' ? '0.00 (Zero Penalty)' : `-${pattern.negative} per wrong MCQ`}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500">Derivations &amp; Shortcuts</span>
                <span className="font-bold text-emerald-600">
                  {feedbackMode === 'practice' ? 'Instant Step-by-Step' : 'Post-Exam Solution Book'}
                </span>
              </div>
            </div>

            {/* Launch Button */}
            <button
              type="button"
              onClick={handleCreateTest}
              disabled={isSubmitting || selectedTopics.length === 0}
              className="w-full neu-chip-primary uppercase tracking-wider text-xs py-4 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Assembling Bank Drill...</span>
                </>
              ) : (
                <>
                  <span>Launch Practice Test</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NewTestPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading exam builder...</div>}>
      <TestBuilderForm />
    </Suspense>
  );
}
