'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { BrandLogo } from '@/components/brand-logo';
import { INITIAL_TOPICS } from '@/lib/store';
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
} from 'lucide-react';

interface ExamProfile {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  patterns: {
    full_mock: { questions: number; duration: number; negative: number; marks: number };
    sectional: { questions: number; duration: number; negative: number; marks: number };
    topic_test: { questions: number; duration: number; negative: number; marks: number };
  };
  recommendedTopics: string[];
}

const EXAM_PROFILES: Record<string, ExamProfile> = {
  'ibps-po-prelims-2026': {
    id: 'ibps-po-prelims-2026',
    name: 'IBPS PO Prelims 2026',
    shortName: 'IBPS PO',
    badge: 'Scale I Officer',
    description: '35 Questions Quantitative Aptitude, 20 Minutes sectional timing, -0.25 negative marks.',
    patterns: {
      full_mock: { questions: 35, duration: 20, negative: 0.25, marks: 35 },
      sectional: { questions: 20, duration: 15, negative: 0.25, marks: 20 },
      topic_test: { questions: 10, duration: 10, negative: 0.25, marks: 10 },
    },
    recommendedTopics: [
      'quadratic-equations',
      'simplification',
      'number-series',
      'profit-and-loss',
      'tabular-di',
      'bar-pie-di',
    ],
  },
  'sbi-clerk-prelims-2026': {
    id: 'sbi-clerk-prelims-2026',
    name: 'SBI Clerk Prelims 2026',
    shortName: 'SBI Clerk',
    badge: 'High Speed Junior Associate',
    description: 'High-speed clerical numerical ability mock series with speed shortcuts and DI sets.',
    patterns: {
      full_mock: { questions: 35, duration: 20, negative: 0.25, marks: 35 },
      sectional: { questions: 25, duration: 15, negative: 0.25, marks: 25 },
      topic_test: { questions: 15, duration: 10, negative: 0.25, marks: 15 },
    },
    recommendedTopics: [
      'simplification',
      'number-series',
      'percentage',
      'ratio-proportion',
      'tabular-di',
    ],
  },
  'rbi-assistant-2026': {
    id: 'rbi-assistant-2026',
    name: 'RBI Assistant Prelims 2026',
    shortName: 'RBI Assistant',
    badge: 'Apex Bank 90%+ Cutoff',
    description: 'Accuracy ramp with speed calculation shortcuts for Reserve Bank of India Assistant.',
    patterns: {
      full_mock: { questions: 35, duration: 20, negative: 0.25, marks: 35 },
      sectional: { questions: 20, duration: 15, negative: 0.25, marks: 20 },
      topic_test: { questions: 10, duration: 8, negative: 0.25, marks: 10 },
    },
    recommendedTopics: [
      'simplification',
      'quadratic-equations',
      'percentage',
      'si-ci',
      'time-and-work',
      'bar-pie-di',
    ],
  },
};

export default function NewTestBuilderPage() {
  const router = useRouter();

  // Test Creation State
  const [examId, setExamId] = useState<string>('ibps-po-prelims-2026');
  const [mode, setMode] = useState<'full_mock' | 'sectional' | 'topic_test'>('full_mock');
  const [difficultyMix, setDifficultyMix] = useState<string>('mixed');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active exam profile
  const currentExam = useMemo(() => {
    return EXAM_PROFILES[examId] || EXAM_PROFILES['ibps-po-prelims-2026'];
  }, [examId]);

  // Selected topics initialize from the current exam recommendation
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    EXAM_PROFILES['ibps-po-prelims-2026'].recommendedTopics
  );

  // When exam changes, update topics and pattern
  const handleExamChange = (newExamId: string) => {
    setExamId(newExamId);
    const profile = EXAM_PROFILES[newExamId] || EXAM_PROFILES['ibps-po-prelims-2026'];
    setSelectedTopics(profile.recommendedTopics);
  };

  // Dynamic parameters based on exam + mode
  const currentPattern = currentExam.patterns[mode];
  const questionCount = currentPattern.questions;
  const durationMinutes = currentPattern.duration;
  const negativeMarking = `-${currentPattern.negative} marks per wrong`;
  const totalMarks = `${currentPattern.marks}.00`;

  // Group topics for easy selection
  const arithmeticTopics = INITIAL_TOPICS.filter((t) => t.group_name === 'Arithmetic');
  const numberTopics = INITIAL_TOPICS.filter((t) => t.group_name === 'Number-based');
  const diTopics = INITIAL_TOPICS.filter((t) => t.group_name === 'DI');

  const toggleTopic = (id: string) => {
    if (selectedTopics.includes(id)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== id));
      }
    } else {
      setSelectedTopics([...selectedTopics, id]);
    }
  };

  const selectAllInGroup = (topics: typeof INITIAL_TOPICS) => {
    const ids = topics.map((t) => t.id);
    const allSelected = ids.every((id) => selectedTopics.includes(id));
    if (allSelected) {
      const remaining = selectedTopics.filter((id) => !ids.includes(id));
      setSelectedTopics(remaining.length > 0 ? remaining : [ids[0]]);
    } else {
      const merged = Array.from(new Set([...selectedTopics, ...ids]));
      setSelectedTopics(merged);
    }
  };

  const handleBuildTest = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/test/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: examId,
          mode: mode,
          source_type: 'auto',
          topics: selectedTopics,
          question_count: questionCount,
          duration_min: durationMinutes,
          difficulty_mix: difficultyMix,
        }),
      });

      const data = await res.json();
      if (data.success && data.test_id) {
        router.push(`/tests/${data.test_id}/instructions`);
      } else {
        alert(data.error || 'Failed to assemble test');
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FDFF] flex flex-col text-[#0F172A] relative selection:bg-[#005CE6] selection:text-white">
      {/* Unified Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left 2 Cols: Exam Configuration */}
        <div className="lg:col-span-2 space-y-7">
          {/* Title Area */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Create a Practice Test
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select your exam pattern, test mode, and syllabus topics. Your paper is calibrated and assembled server-side.
            </p>
          </div>

          {/* Section 1: Target Exam Picker */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#BCEBFC] shadow-[0_4px_20px_rgba(0,92,230,0.05)] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#005CE6] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Choose Target Exam Pattern</span>
              </span>
              <span className="text-xs font-bold text-[#005CE6] bg-[#F0FAFF] px-2.5 py-0.5 rounded-full border border-[#BCEBFC]">
                {currentExam.shortName} Active
              </span>
            </div>

            {/* Exam Selection Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.values(EXAM_PROFILES).map((e) => {
                const isSelected = examId === e.id;
                const pattern = e.patterns[mode];
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => handleExamChange(e.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      isSelected
                        ? 'border-[#005CE6] bg-[#F0FAFF] text-[#005CE6] shadow-sm ring-2 ring-[#005CE6]/30'
                        : 'border-slate-200 bg-white hover:border-[#005CE6]/50 hover:bg-[#F0FAFF]/40 text-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-sm text-[#0F172A] group-hover:text-[#005CE6] transition-colors">
                        {e.name}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#005CE6] text-white shadow-sm' : 'border border-slate-300 bg-slate-50'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {pattern.questions} Qs · {pattern.duration} Mins · -{pattern.negative} Mark
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-[#005CE6] bg-white px-2 py-0.5 rounded-md inline-block border border-[#BCEBFC]">
                      {e.badge}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mode Selector (Pill Segmented Chips) */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Exam Mode
              </label>
              <div className="p-1 rounded-full neu-inset flex gap-1">
                {[
                  { id: 'full_mock', label: 'Full Prelims Mock (35 Qs)', desc: 'Official Pattern' },
                  { id: 'sectional', label: 'Sectional Speed Test', desc: '15 Mins' },
                  { id: 'topic_test', label: 'Topic Sprint Drill', desc: '10 Mins' },
                ].map((m) => {
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id as any)}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'neu-chip-primary text-white scale-[1.01]'
                          : 'chip-btn bg-transparent border-transparent shadow-none hover:bg-white/60'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Syllabus Topics Selection (Replaces old manual basket) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#BCEBFC] shadow-[0_4px_20px_rgba(0,92,230,0.05)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#005CE6] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Included Syllabus Topics ({selectedTopics.length} selected)</span>
              </span>
              <span className="text-[11px] text-slate-500">Tap chips to toggle topics</span>
            </div>

            <div className="space-y-4">
              {/* 1. Number & Calculation Speed */}
              <div className="p-4 rounded-2xl bg-[#F0FAFF]/60 border border-[#BCEBFC]/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#005CE6] uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#005CE6]" />
                    <span>Number &amp; Calculation Speed</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => selectAllInGroup(numberTopics)}
                    className="text-[10px] font-bold text-[#005CE6] hover:underline cursor-pointer"
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
                        onClick={() => toggleTopic(t.id)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                          sel
                            ? 'bg-gradient-to-r from-[#005CE6] to-[#0076F5] border-[#005CE6] text-white shadow-sm scale-[1.02]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-[#F0FAFF] hover:border-[#BCEBFC]'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          sel ? 'bg-white text-[#005CE6]' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {sel ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Plus className="w-2.5 h-2.5 stroke-[2.5]" />}
                        </span>
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Data Interpretation */}
              <div className="p-4 rounded-2xl bg-[#F0FAFF]/60 border border-[#BCEBFC]/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#005CE6] uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-[#005CE6]" />
                    <span>Data Interpretation Sets (10–15 Marks)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => selectAllInGroup(diTopics)}
                    className="text-[10px] font-bold text-[#005CE6] hover:underline cursor-pointer"
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
                        onClick={() => toggleTopic(t.id)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                          sel
                            ? 'bg-gradient-to-r from-[#005CE6] to-[#0076F5] border-[#005CE6] text-white shadow-sm scale-[1.02]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-[#F0FAFF] hover:border-[#BCEBFC]'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          sel ? 'bg-white text-[#005CE6]' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {sel ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Plus className="w-2.5 h-2.5 stroke-[2.5]" />}
                        </span>
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Arithmetic Word Problems */}
              <div className="p-4 rounded-2xl bg-[#F0FAFF]/60 border border-[#BCEBFC]/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#005CE6] uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-[#005CE6]" />
                    <span>Core Arithmetic Modules (10–12 Marks)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => selectAllInGroup(arithmeticTopics)}
                    className="text-[10px] font-bold text-[#005CE6] hover:underline cursor-pointer"
                  >
                    Toggle Group
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {arithmeticTopics.map((t) => {
                    const sel = selectedTopics.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTopic(t.id)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                          sel
                            ? 'bg-gradient-to-r from-[#005CE6] to-[#0076F5] border-[#005CE6] text-white shadow-sm scale-[1.02]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-[#F0FAFF] hover:border-[#BCEBFC]'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          sel ? 'bg-white text-[#005CE6]' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {sel ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Plus className="w-2.5 h-2.5 stroke-[2.5]" />}
                        </span>
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Updating Summary Rail (Changes according to exam & mode chosen!) */}
        <div className="space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#BCEBFC] shadow-[0_8px_30px_rgba(0,92,230,0.08)] sticky top-24 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#0F172A]">
                Test Summary
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Ready to assemble" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Target Exam</span>
                <span className="font-extrabold text-[#005CE6] text-right">
                  {currentExam.name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Selection Mode</span>
                <span className="font-bold capitalize text-slate-800">
                  {mode === 'full_mock' ? 'Full Prelims Mock' : mode === 'sectional' ? 'Sectional Speed Test' : 'Topic Drill'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Total Questions</span>
                <span className="font-extrabold font-mono text-[#005CE6] text-sm">
                  {questionCount} Questions
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Estimated Duration</span>
                <span className="font-extrabold font-mono text-slate-900">{durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Total Marks</span>
                <span className="font-bold font-mono text-slate-900">{totalMarks} Marks</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Negative Marking</span>
                <span className="font-bold text-rose-600">{negativeMarking}</span>
              </div>
            </div>

            {/* Freshness Chip Badge */}
            <div className="p-3.5 rounded-2xl neu-inset flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#005CE6]" />
                <span className="font-bold text-slate-800">Unseen Questions</span>
              </div>
              <span className="font-extrabold font-mono text-[#005CE6] bg-white px-2.5 py-0.5 rounded-full shadow-xs border border-[#BCEBFC]">
                92% Fresh
              </span>
            </div>

            {/* Launch Action (Chip UI Primary with Arrow) */}
            <button
              onClick={handleBuildTest}
              disabled={isSubmitting || selectedTopics.length === 0}
              className="w-full neu-chip-primary uppercase tracking-wider text-xs py-3.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Freezing Bundle...' : 'Assemble & Freeze Test'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-400 leading-tight">
              Pre-assembled server-side before the clock starts for zero runtime latency.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
