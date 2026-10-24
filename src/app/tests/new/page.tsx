'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { INITIAL_TOPICS, INITIAL_EXAMS, INITIAL_QUESTIONS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import {
  Zap,
  SlidersHorizontal,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  BookOpen,
  Layers,
  HelpCircle,
  Award,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export default function NewTestBuilderPage() {
  const router = useRouter();

  // Test Creation State
  const [examId, setExamId] = useState<string>('ibps-po-prelims-2026');
  const [mode, setMode] = useState<'topic_test' | 'sectional' | 'full_mock'>('topic_test');
  const [sourceType, setSourceType] = useState<'auto' | 'manual'>('auto');

  // Auto Source Options
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'quadratic-equations',
    'simplification',
  ]);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficultyMix, setDifficultyMix] = useState<string>('mixed');

  // Manual Source State
  const [manualFilterTopic, setManualFilterTopic] = useState<string>('all');
  const [manualFilterDiff, setManualFilterDiff] = useState<string>('all');
  const [basketQids, setBasketQids] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const toggleBasket = (qid: string) => {
    if (basketQids.includes(qid)) {
      setBasketQids(basketQids.filter((id) => id !== qid));
    } else {
      setBasketQids([...basketQids, qid]);
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
          source_type: sourceType,
          topics: selectedTopics,
          question_count: sourceType === 'manual' ? basketQids.length : questionCount,
          selected_qids: sourceType === 'manual' ? basketQids : undefined,
          difficulty_mix: difficultyMix,
        }),
      });

      const data = await res.json();
      if (data.success && data.test_id) {
        router.push(`/tests/building/${data.test_id}`);
      } else {
        alert(data.error || 'Failed to assemble test');
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  // Filtered questions for Manual mode
  const filteredQuestions = INITIAL_QUESTIONS.filter((q) => {
    if (manualFilterTopic !== 'all' && q.topic_id !== manualFilterTopic) return false;
    if (manualFilterDiff !== 'all' && q.difficulty_assigned !== Number(manualFilterDiff)) return false;
    return true;
  });

  const estimatedMinutes = Math.ceil((sourceType === 'manual' ? basketQids.length : questionCount) * 1.2);

  // Quick preset counts
  const countPresets = [5, 10, 15, 20, 35];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FC] via-[#EAF1F8] to-[#E2ECF7] dark:from-[#0E1117] dark:via-[#151A23] dark:to-[#0A0D12] flex flex-col text-[#212835] dark:text-[#EAF1F8] relative overflow-x-hidden selection:bg-[#2D6BCB] selection:text-white">
      {/* Decorative Glassmorphism Ambient Glow Orbs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-[450px] h-[450px] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Glassmorphic Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#151A23]/70 backdrop-blur-xl border-b border-white/60 dark:border-[#2E3746]/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo size={34} showWordmark={true} />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#2D6BCB]/10 text-[#2D6BCB] border border-[#2D6BCB]/20">
              <Sparkles className="w-3 h-3 text-[#2D6BCB]" />
              <span>Custom Test Setup</span>
            </span>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#2D6BCB] bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-white/80 dark:border-slate-700 shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left 2 Cols: Glassmorphism Form Card */}
        <div className="lg:col-span-2 space-y-7">
          {/* Title Area */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#212835] dark:text-white">
              Create a Practice Test
            </h1>
            <p className="text-xs sm:text-sm text-[#5B6578] dark:text-slate-400 mt-1">
              Select your exam pattern, topics, and composition. Your paper is assembled and verified before you start.
            </p>
          </div>

          {/* Section 1: Exam & Mode Picker (Glass Card) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-[#151A23]/80 backdrop-blur-xl border border-white/90 dark:border-[#2E3746] shadow-[0_8px_30px_rgb(45,107,203,0.05)] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#2D6BCB] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Target Exam &amp; Pattern</span>
              </span>
            </div>

            {/* Exam Selection Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {INITIAL_EXAMS.map((e) => {
                const isSelected = examId === e.id;
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setExamId(e.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#2D6BCB] bg-gradient-to-br from-[#DCE8F8]/70 to-[#EEF4FC]/90 text-[#1C458A] shadow-md shadow-[#2D6BCB]/15 ring-2 ring-[#2D6BCB]/30'
                        : 'border-white/80 dark:border-[#2E3746] bg-white/60 dark:bg-[#0E1117]/60 hover:bg-white dark:hover:bg-[#1B212C] text-slate-700 dark:text-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-[#212835] dark:text-white group-hover:text-[#2D6BCB] transition-colors">
                        {e.name}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#2D6BCB] text-white' : 'border border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      35 Questions · 20 Mins · -0.25 Mark
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mode Selector (Pill Segmented Chips) */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                Test Mode
              </label>
              <div className="p-1 rounded-full bg-slate-200/60 dark:bg-[#0E1117] backdrop-blur-md border border-white/80 dark:border-[#2E3746] flex gap-1">
                {[
                  { id: 'topic_test', label: 'Topic Drill' },
                  { id: 'sectional', label: 'Sectional (20 min)' },
                  { id: 'full_mock', label: 'Full Prelims Mock' },
                ].map((m) => {
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id as any)}
                      className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-white dark:bg-[#212835] text-[#2D6BCB] shadow-md shadow-black/5 scale-[1.01]'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Question Source & Chips Configuration (Glass Card) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-[#151A23]/80 backdrop-blur-xl border border-white/90 dark:border-[#2E3746] shadow-[0_8px_30px_rgb(45,107,203,0.05)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#2D6BCB] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Question Selection &amp; Content Mix</span>
              </span>

              {/* Source Toggle Pills */}
              <div className="p-1 rounded-full bg-slate-200/60 dark:bg-[#0E1117] backdrop-blur-md border border-white/80 dark:border-[#2E3746] flex gap-1 self-start sm:self-auto">
                <button
                  onClick={() => setSourceType('auto')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    sourceType === 'auto'
                      ? 'bg-[#2D6BCB] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto Balanced</span>
                </button>
                <button
                  onClick={() => setSourceType('manual')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    sourceType === 'manual'
                      ? 'bg-[#2D6BCB] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Manual Pick</span>
                </button>
              </div>
            </div>

            {/* AUTO SOURCE CONFIGURATION */}
            {sourceType === 'auto' && (
              <div className="space-y-6">
                {/* Topic selection chips UI */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Included Topics ({selectedTopics.length} selected)
                    </span>
                    <span className="text-[11px] text-slate-500">Tap chips to toggle</span>
                  </div>

                  {/* 1. Number & Calculation Speed */}
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-[#0E1117]/50 border border-white/80 dark:border-[#2E3746] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#2D6BCB] uppercase tracking-wider">
                        ⚡ Number &amp; Calculation Speed
                      </span>
                      <button
                        type="button"
                        onClick={() => selectAllInGroup(numberTopics)}
                        className="text-[10px] font-semibold text-slate-500 hover:text-[#2D6BCB]"
                      >
                        Toggle All
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
                            className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 select-none ${
                              sel
                                ? 'bg-[#2D6BCB] border-[#2D6BCB] text-white shadow-md shadow-[#2D6BCB]/25 scale-[1.02]'
                                : 'bg-white/80 dark:bg-[#151A23] border-[#DDE4EE] dark:border-[#2E3746] text-slate-700 dark:text-slate-300 hover:bg-white hover:border-[#2D6BCB]/40 hover:shadow-sm'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                              sel ? 'bg-white text-[#2D6BCB] font-bold' : 'border border-slate-300'
                            }`}>
                              {sel ? '✓' : '+'}
                            </span>
                            <span>{t.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Arithmetic Fundamentals */}
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-[#0E1117]/50 border border-white/80 dark:border-[#2E3746] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#1F9D6B] uppercase tracking-wider">
                        🎯 Arithmetic Fundamentals
                      </span>
                      <button
                        type="button"
                        onClick={() => selectAllInGroup(arithmeticTopics)}
                        className="text-[10px] font-semibold text-slate-500 hover:text-[#1F9D6B]"
                      >
                        Toggle All
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
                            className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 select-none ${
                              sel
                                ? 'bg-[#1F9D6B] border-[#1F9D6B] text-white shadow-md shadow-[#1F9D6B]/25 scale-[1.02]'
                                : 'bg-white/80 dark:bg-[#151A23] border-[#DDE4EE] dark:border-[#2E3746] text-slate-700 dark:text-slate-300 hover:bg-white hover:border-[#1F9D6B]/40 hover:shadow-sm'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                              sel ? 'bg-white text-[#1F9D6B] font-bold' : 'border border-slate-300'
                            }`}>
                              {sel ? '✓' : '+'}
                            </span>
                            <span>{t.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Data Interpretation */}
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-[#0E1117]/50 border border-white/80 dark:border-[#2E3746] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#7B5CD6] uppercase tracking-wider">
                        📊 Data Interpretation
                      </span>
                      <button
                        type="button"
                        onClick={() => selectAllInGroup(diTopics)}
                        className="text-[10px] font-semibold text-slate-500 hover:text-[#7B5CD6]"
                      >
                        Toggle All
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
                            className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 select-none ${
                              sel
                                ? 'bg-[#7B5CD6] border-[#7B5CD6] text-white shadow-md shadow-[#7B5CD6]/25 scale-[1.02]'
                                : 'bg-white/80 dark:bg-[#151A23] border-[#DDE4EE] dark:border-[#2E3746] text-slate-700 dark:text-slate-300 hover:bg-white hover:border-[#7B5CD6]/40 hover:shadow-sm'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                              sel ? 'bg-white text-[#7B5CD6] font-bold' : 'border border-slate-300'
                            }`}>
                              {sel ? '✓' : '+'}
                            </span>
                            <span>{t.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Question Count Preset Chips + Range Slider */}
                <div className="pt-5 border-t border-slate-200/60 dark:border-slate-800 space-y-3.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Question Volume</span>
                    <span className="font-mono text-base text-[#2D6BCB] font-extrabold bg-[#2D6BCB]/10 px-3 py-0.5 rounded-full border border-[#2D6BCB]/20">
                      {questionCount} Questions
                    </span>
                  </div>

                  {/* Preset Count Chips */}
                  <div className="flex flex-wrap gap-2">
                    {countPresets.map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          questionCount === cnt
                            ? 'bg-[#2D6BCB] text-white border-[#2D6BCB] shadow-sm'
                            : 'bg-white/80 dark:bg-[#151A23] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white'
                        }`}
                      >
                        {cnt} Qs
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="5"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2D6BCB]"
                  />
                </div>

                {/* Difficulty Mix Chips */}
                <div className="pt-5 border-t border-slate-200/60 dark:border-slate-800 space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Difficulty Level Calibration
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'easy', label: 'Easy (Lvl 1-2)' },
                      { id: 'moderate', label: 'Moderate (Lvl 3)' },
                      { id: 'hard', label: 'Hard (Lvl 4)' },
                      { id: 'mixed', label: 'Exam Mix' },
                    ].map((d) => {
                      const isSel = difficultyMix === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setDifficultyMix(d.id)}
                          className={`py-2 px-3 rounded-full text-xs font-bold border text-center transition-all ${
                            isSel
                              ? 'border-[#2D6BCB] bg-[#2D6BCB] text-white shadow-md shadow-[#2D6BCB]/20'
                              : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-[#151A23] text-slate-600 dark:text-slate-300 hover:bg-white'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* MANUAL QUESTION BROWSER */}
            {sourceType === 'manual' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={manualFilterTopic}
                    onChange={(e) => setManualFilterTopic(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl border border-white/80 dark:border-[#2E3746] bg-white/80 dark:bg-[#0E1117] text-xs font-medium"
                  >
                    <option value="all">All Topics</option>
                    {INITIAL_TOPICS.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>

                  <select
                    value={manualFilterDiff}
                    onChange={(e) => setManualFilterDiff(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl border border-white/80 dark:border-[#2E3746] bg-white/80 dark:bg-[#0E1117] text-xs font-medium"
                  >
                    <option value="all">All Difficulty Levels</option>
                    <option value="1">Level 1 - Easy</option>
                    <option value="2">Level 2 - Moderate-Easy</option>
                    <option value="3">Level 3 - Moderate</option>
                    <option value="4">Level 4 - Hard</option>
                  </select>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-[#2E3746] max-h-96 overflow-y-auto pr-1">
                  {filteredQuestions.map((q) => {
                    const inBasket = basketQids.includes(q.id);
                    return (
                      <div key={q.id} className="py-3.5 flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCE8F8] dark:bg-[#2E3746] text-[#1C458A] dark:text-slate-300">
                              Level {q.difficulty_assigned}
                            </span>
                            <span className="text-[10px] text-slate-500 capitalize">{q.topic_id}</span>
                          </div>
                          <div className="text-xs text-[#212835] dark:text-slate-200 line-clamp-2">
                            <MathRenderer content={q.stem} />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleBasket(q.id)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                            inBasket
                              ? 'bg-[#1F9D6B] text-white shadow-sm'
                              : 'bg-white dark:bg-[#2E3746] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-[#DCE8F8]'
                          }`}
                        >
                          {inBasket ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{inBasket ? 'Added' : 'Add to Test'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Glassmorphic Live Summary Rail */}
        <div className="space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-[#151A23]/80 backdrop-blur-xl border border-white/90 dark:border-[#2E3746] shadow-[0_12px_40px_rgb(45,107,203,0.08)] sticky top-24 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#212835] dark:text-white">
                Test Summary
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F9D6B] animate-pulse" title="Ready to freeze" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Target Exam</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right">
                  {INITIAL_EXAMS.find((e) => e.id === examId)?.name || 'IBPS PO Prelims 2026'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Selection Mode</span>
                <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">
                  {sourceType} Selection
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Total Questions</span>
                <span className="font-extrabold font-mono text-[#2D6BCB] text-sm">
                  {sourceType === 'manual' ? basketQids.length : questionCount} Questions
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Estimated Duration</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{estimatedMinutes} Minutes</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Negative Marking</span>
                <span className="font-bold text-[#D64550]">-0.25 marks per wrong</span>
              </div>
            </div>

            {/* Freshness Chip Badge */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#DCE8F8]/80 to-[#EEF4FC] dark:from-[#2D6BCB]/20 dark:to-transparent border border-[#2D6BCB]/25 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2D6BCB]" />
                <span className="font-bold text-[#1C458A] dark:text-[#8FB2EA]">Unseen Questions</span>
              </div>
              <span className="font-extrabold font-mono text-[#2D6BCB] bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full shadow-sm">
                92% Fresh
              </span>
            </div>

            {/* Launch Action */}
            <button
              onClick={handleBuildTest}
              disabled={isSubmitting || (sourceType === 'manual' && basketQids.length === 0)}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#2D6BCB] to-[#2458AD] hover:from-[#2458AD] hover:to-[#1C458A] disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2D6BCB]/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{isSubmitting ? 'Freezing Bundle...' : 'Assemble & Freeze Test'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 leading-tight">
              Pre-assembled server-side before the clock starts for zero runtime latency.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
