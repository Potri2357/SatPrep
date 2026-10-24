'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { INITIAL_TOPICS, INITIAL_EXAMS, INITIAL_QUESTIONS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import {
  Zap,
  SlidersHorizontal,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  BookOpen,
  Layers,
  HelpCircle,
} from 'lucide-react';

export default function NewTestBuilderPage() {
  const router = useRouter();

  // Test Creation State
  const [examId, setExamId] = useState<string>('ibps-po-prelims-2026');
  const [mode, setMode] = useState<'full_mock' | 'sectional' | 'topic_test'>('topic_test');
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
        // Direct to Building Your Test screen (Section 8.6)
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

  return (
    <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#0E1117] flex flex-col text-[#212835] dark:text-[#EAF1F8]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#151A23]/90 backdrop-blur-md border-b border-[#DDE4EE] dark:border-[#2E3746]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo size={34} showWordmark={true} />
          <div className="text-xs font-semibold text-slate-500">
            Test Builder // Backend-First Assembly
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#212835] dark:text-white">
              Create a Practice Test
            </h1>
            <p className="text-xs sm:text-sm text-[#5B6578] dark:text-slate-400 mt-1">
              Select your exam pattern, topics, and composition. Your test will be frozen and verified server-side.
            </p>
          </div>

          {/* Step 1: Exam & Mode Picker */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">1. Target Exam &amp; Mode</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {INITIAL_EXAMS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setExamId(e.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    examId === e.id
                      ? 'border-[#2D6BCB] bg-[#DCE8F8]/40 dark:bg-[#2D6BCB]/15 ring-1 ring-[#2D6BCB]'
                      : 'border-[#DDE4EE] dark:border-[#2E3746] hover:bg-slate-50 dark:hover:bg-[#1B212C]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#212835] dark:text-white">{e.name}</div>
                  <div className="text-[11px] text-[#5B6578] dark:text-slate-400 mt-1">35 Qs · 20 Mins · -0.25</div>
                </button>
              ))}
            </div>

            {/* Mode Selector */}
            <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-[#0E1117] border border-[#DDE4EE] dark:border-[#2E3746]">
              {[
                { id: 'topic_test', label: 'Topic Drill' },
                { id: 'sectional', label: 'Sectional (20m)' },
                { id: 'full_mock', label: 'Full Prelims Mock' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    mode === m.id
                      ? 'bg-white dark:bg-[#151A23] text-[#2D6BCB] shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Source Type (Auto vs Manual Segmented Control) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">2. Question Source</h2>
              
              {/* Segmented Control */}
              <div className="flex rounded-lg p-1 bg-slate-100 dark:bg-[#0E1117] border border-[#DDE4EE] dark:border-[#2E3746]">
                <button
                  onClick={() => setSourceType('auto')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
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
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
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
                {/* Topic selection chips */}
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-[#212835] dark:text-slate-300">
                    Select Topics to Include ({selectedTopics.length} selected):
                  </div>

                  {/* Number-based */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Number &amp; Calculation Speed</div>
                    <div className="flex flex-wrap gap-2">
                      {numberTopics.map((t) => {
                        const sel = selectedTopics.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTopic(t.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              sel
                                ? 'bg-[#DCE8F8] dark:bg-[#2D6BCB]/25 border-[#2D6BCB] text-[#1C458A] dark:text-[#8FB2EA] font-semibold'
                                : 'bg-slate-50 dark:bg-[#0E1117] border-[#DDE4EE] dark:border-[#2E3746] text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {t.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Arithmetic */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Arithmetic Fundamentals</div>
                    <div className="flex flex-wrap gap-2">
                      {arithmeticTopics.map((t) => {
                        const sel = selectedTopics.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTopic(t.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              sel
                                ? 'bg-[#DCE8F8] dark:bg-[#2D6BCB]/25 border-[#2D6BCB] text-[#1C458A] dark:text-[#8FB2EA] font-semibold'
                                : 'bg-slate-50 dark:bg-[#0E1117] border-[#DDE4EE] dark:border-[#2E3746] text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {t.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* DI */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Data Interpretation</div>
                    <div className="flex flex-wrap gap-2">
                      {diTopics.map((t) => {
                        const sel = selectedTopics.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTopic(t.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              sel
                                ? 'bg-[#DCE8F8] dark:bg-[#2D6BCB]/25 border-[#2D6BCB] text-[#1C458A] dark:text-[#8FB2EA] font-semibold'
                                : 'bg-slate-50 dark:bg-[#0E1117] border-[#DDE4EE] dark:border-[#2E3746] text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {t.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Question Count Slider */}
                <div className="pt-4 border-t border-[#DDE4EE] dark:border-[#2E3746] space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span>Question Count</span>
                    <span className="font-mono text-base text-[#2D6BCB] font-bold">{questionCount} questions</span>
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
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>5 Qs (Quick Drill)</span>
                    <span>15 Qs (Sectional Half)</span>
                    <span>35 Qs (Full Section)</span>
                  </div>
                </div>

                {/* Difficulty Mix Selector */}
                <div className="pt-4 border-t border-[#DDE4EE] dark:border-[#2E3746] space-y-2">
                  <label className="block text-xs font-semibold">Difficulty Calibration</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'easy', label: 'Level 1-2 Easy' },
                      { id: 'moderate', label: 'Level 3 Moderate' },
                      { id: 'hard', label: 'Level 4 Hard' },
                      { id: 'mixed', label: 'Mixed Exam Mix' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDifficultyMix(d.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold border text-center transition-all ${
                          difficultyMix === d.id
                            ? 'border-[#2D6BCB] bg-[#2D6BCB] text-white'
                            : 'border-[#DDE4EE] dark:border-[#2E3746] text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MANUAL QUESTION BROWSER (ST-20 to ST-26) */}
            {sourceType === 'manual' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={manualFilterTopic}
                    onChange={(e) => setManualFilterTopic(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] text-xs"
                  >
                    <option value="all">All Topics</option>
                    {INITIAL_TOPICS.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>

                  <select
                    value={manualFilterDiff}
                    onChange={(e) => setManualFilterDiff(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] text-xs"
                  >
                    <option value="all">All Difficulty Levels</option>
                    <option value="1">Level 1 - Easy</option>
                    <option value="2">Level 2 - Moderate-Easy</option>
                    <option value="3">Level 3 - Moderate</option>
                    <option value="4">Level 4 - Hard</option>
                  </select>
                </div>

                <div className="divide-y divide-[#DDE4EE] dark:divide-[#2E3746] max-h-96 overflow-y-auto pr-1">
                  {filteredQuestions.map((q) => {
                    const inBasket = basketQids.includes(q.id);
                    return (
                      <div key={q.id} className="py-3 flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#2E3746] text-slate-600 dark:text-slate-300">
                              Level {q.difficulty_assigned}
                            </span>
                            <span className="text-[10px] text-slate-400 capitalize">{q.topic_id}</span>
                          </div>
                          <div className="text-xs text-[#212835] dark:text-slate-200 line-clamp-2">
                            <MathRenderer content={q.stem} />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleBasket(q.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 transition-all ${
                            inBasket
                              ? 'bg-[#1F9D6B] text-white'
                              : 'bg-slate-100 dark:bg-[#2E3746] text-slate-700 dark:text-slate-200 hover:bg-[#DCE8F8]'
                          }`}
                        >
                          {inBasket ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{inBasket ? 'Added' : 'Add'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Live Summary Rail & Action */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm sticky top-24 space-y-5">
            <h2 className="text-base font-bold text-[#212835] dark:text-white">Test Specification</h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Exam Blueprint</span>
                <span className="font-semibold text-right">IBPS PO Prelims 2026</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Assembly Mode</span>
                <span className="font-semibold capitalize">{sourceType} Balanced</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Question Count</span>
                <span className="font-bold font-mono text-[#2D6BCB]">
                  {sourceType === 'manual' ? basketQids.length : questionCount} Questions
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Estimated Duration</span>
                <span className="font-semibold">{estimatedMinutes} Minutes</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Negative Marking</span>
                <span className="font-semibold text-red-500">-0.25 marks</span>
              </div>
            </div>

            {/* Freshness Badge (ST-14) */}
            <div className="p-3 rounded-xl bg-[#DCE8F8]/50 dark:bg-[#2D6BCB]/15 border border-[#2D6BCB]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2D6BCB]" />
                <span className="font-semibold text-[#1C458A] dark:text-[#8FB2EA]">Unseen Freshness</span>
              </div>
              <span className="font-bold font-mono text-[#2D6BCB]">92% new to you</span>
            </div>

            <button
              onClick={handleBuildTest}
              disabled={isSubmitting || (sourceType === 'manual' && basketQids.length === 0)}
              className="w-full h-12 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2D6BCB]/30 transition-all hover:scale-[1.01]"
            >
              <span>{isSubmitting ? 'Assembling Test...' : 'Assemble & Freeze Test'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Assembled instantly by the server before start. No client-side shuffling or generation.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
