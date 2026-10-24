'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { INITIAL_TOPICS, INITIAL_QUESTIONS, INITIAL_KEYS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import {
  BookOpen,
  Bookmark,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function PracticeHubPage() {
  const [activeTab, setActiveTab] = useState<'topics' | 'bookmarks' | 'revision'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<string>('quadratic-equations');

  // Instant feedback practice state
  const [practiceIdx, setPracticeIdx] = useState<number>(0);
  const [chosenOpt, setChosenOpt] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const topicQuestions = INITIAL_QUESTIONS.filter((q) => q.topic_id === selectedTopic);
  const currentQ = topicQuestions[practiceIdx] || INITIAL_QUESTIONS[0];
  const currentKey = INITIAL_KEYS[currentQ.id];

  const handleSelectOption = (optId: string) => {
    if (chosenOpt) return; // Prevent change after answer
    setChosenOpt(optId);
    setShowSolution(true);
  };

  const handleNextPractice = () => {
    setChosenOpt(null);
    setShowSolution(false);
    if (practiceIdx < topicQuestions.length - 1) {
      setPracticeIdx((prev) => prev + 1);
    } else {
      setPracticeIdx(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#0E1117] flex flex-col text-[#212835] dark:text-[#EAF1F8]">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#151A23]/90 backdrop-blur-md border-b border-[#DDE4EE] dark:border-[#2E3746] px-6 h-16 flex items-center justify-between">
        <BrandLogo size={34} showWordmark={true} />
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
            Dashboard
          </Link>
          <Link href="/tests/new" className="px-3.5 py-1.5 rounded-lg bg-[#2D6BCB] text-white">
            Timed Mock Tests
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#212835] dark:text-white">
            Quant Practice &amp; Spaced Revision
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6578] dark:text-slate-400 mt-1">
            Untimed instant feedback mode and targeted review of previously bookmarked or wrong questions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-xl p-1 bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] max-w-md">
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'topics' ? 'bg-[#2D6BCB] text-white shadow-sm' : 'text-slate-500 hover:text-white'
            }`}
          >
            Topic Practice (Instant)
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'bookmarks' ? 'bg-[#2D6BCB] text-white shadow-sm' : 'text-slate-500 hover:text-white'
            }`}
          >
            Bookmarks (12)
          </button>
          <button
            onClick={() => setActiveTab('revision')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'revision' ? 'bg-[#2D6BCB] text-white shadow-sm' : 'text-slate-500 hover:text-white'
            }`}
          >
            Spaced Revision (5)
          </button>
        </div>

        {activeTab === 'topics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Topic Selector List */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Choose Topic</div>
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {INITIAL_TOPICS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTopic(t.id);
                      setPracticeIdx(0);
                      setChosenOpt(null);
                      setShowSolution(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      selectedTopic === t.id
                        ? 'border-[#2D6BCB] bg-white dark:bg-[#151A23] font-bold text-[#2D6BCB] shadow-sm'
                        : 'border-[#DDE4EE] dark:border-[#2E3746] bg-white/50 dark:bg-[#151A23]/50 text-slate-600 dark:text-slate-300 hover:bg-white'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Mastery: 78%</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Feedback Question Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-6">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="font-bold px-2 py-0.5 rounded bg-[#DCE8F8] dark:bg-[#2D6BCB]/20 text-[#2D6BCB]">
                    Instant Feedback Drill
                  </span>
                  <span className="text-slate-400">Question {practiceIdx + 1} of {Math.max(1, topicQuestions.length)}</span>
                </div>

                <div className="text-sm sm:text-base font-medium leading-relaxed">
                  <MathRenderer content={currentQ.stem} />
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt) => {
                    const isSelected = chosenOpt === opt.id;
                    const isCorrect = currentKey && opt.id === currentKey.correct_option;

                    let optStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#1B212C]';
                    if (chosenOpt) {
                      if (isCorrect) {
                        optStyle = 'border-[#1F9D6B] bg-[#1F9D6B]/15 text-[#1F9D6B] font-bold';
                      } else if (isSelected && !isCorrect) {
                        optStyle = 'border-red-500 bg-red-500/15 text-red-500 font-bold';
                      }
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`p-3.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${optStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold uppercase font-mono">{opt.id}.</span>
                          <MathRenderer content={opt.text} />
                        </div>

                        {chosenOpt && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#1F9D6B]" />}
                        {chosenOpt && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    );
                  })}
                </div>

                {/* Immediate Explanation Drawer */}
                {showSolution && currentKey && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1117] border border-[#DDE4EE] dark:border-[#2E3746] space-y-3 text-xs animate-in fade-in">
                    <div className="font-bold text-[#1F9D6B] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Correct Key: Option {currentKey.correct_option.toUpperCase()}</span>
                    </div>
                    <div className="leading-relaxed text-slate-700 dark:text-slate-300">
                      <MathRenderer content={currentKey.solution} />
                    </div>
                    {currentKey.shortcut && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300">
                        <strong>Shortcut:</strong> {currentKey.shortcut}
                      </div>
                    )}
                  </div>
                )}

                {/* Next Question Control */}
                {chosenOpt && (
                  <button
                    onClick={handleNextPractice}
                    className="w-full h-11 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#2D6BCB]/25"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'topics' && (
          <div className="p-8 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] text-center space-y-4">
            <Bookmark className="w-8 h-8 text-[#2D6BCB] mx-auto" />
            <h2 className="text-base font-bold">Your Saved Revision Collection</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Questions wrong 3+ days ago resurface automatically under our spaced repetition schedule.
            </p>
            <button
              onClick={() => setActiveTab('topics')}
              className="px-5 py-2 rounded-xl bg-[#2D6BCB] text-white text-xs font-bold"
            >
              Start Revision Drill
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
