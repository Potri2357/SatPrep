'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Consistent Unified Navbar */}
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-8 z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Targeted Skill Mastery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Quant Practice &amp; Spaced Revision
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Untimed instant feedback drill and targeted review of previously bookmarked or wrong questions.
          </p>
        </div>

        {/* Navigation Tabs (Chips) */}
        <div className="flex rounded-2xl p-1 bg-white border border-blue-100 shadow-xs max-w-md">
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'topics'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Topic Practice (Instant)
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Bookmarks (12)
          </button>
          <button
            onClick={() => setActiveTab('revision')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'revision'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Spaced Revision (5)
          </button>
        </div>

        {activeTab === 'topics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Topic Selector List */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Choose Topic</div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {INITIAL_TOPICS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTopic(t.id);
                      setPracticeIdx(0);
                      setChosenOpt(null);
                      setShowSolution(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                      selectedTopic === t.id
                        ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 text-slate-700'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className="text-[10px] text-blue-600 font-mono font-bold bg-blue-100/60 px-2 py-0.5 rounded-full">
                      78%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Feedback Question Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-4">
                  <span className="font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Instant Feedback Drill
                  </span>
                  <span className="text-slate-500 font-mono">Question {practiceIdx + 1} of {Math.max(1, topicQuestions.length)}</span>
                </div>

                <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  <MathRenderer content={currentQ.stem} />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = chosenOpt === opt.id;
                    const isCorrect = currentKey && opt.id === currentKey.correct_option;

                    let optStyle = 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 text-slate-800';
                    if (chosenOpt) {
                      if (isCorrect) {
                        optStyle = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold shadow-xs';
                      } else if (isSelected && !isCorrect) {
                        optStyle = 'border-rose-300 bg-rose-50 text-rose-900 font-bold shadow-xs';
                      }
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${optStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold uppercase font-mono text-xs ${
                            chosenOpt && isCorrect
                              ? 'bg-emerald-600 text-white'
                              : chosenOpt && isSelected && !isCorrect
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {opt.id}
                          </span>
                          <MathRenderer content={opt.text} />
                        </div>

                        {chosenOpt && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {chosenOpt && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                      </div>
                    );
                  })}
                </div>

                {/* Immediate Explanation Drawer */}
                {showSolution && currentKey && (
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3 text-xs animate-in fade-in">
                    <div className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Correct Key: Option {currentKey.correct_option.toUpperCase()}</span>
                    </div>
                    <div className="leading-relaxed text-slate-800 text-sm">
                      <MathRenderer content={currentKey.solution} />
                    </div>
                    {currentKey.shortcut && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
                        <strong>Shortcut:</strong> {currentKey.shortcut}
                      </div>
                    )}
                  </div>
                )}

                {/* Next Question Control */}
                {chosenOpt && (
                  <button
                    onClick={handleNextPractice}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.01]"
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
          <div className="p-12 rounded-3xl glass-panel bg-white/95 border border-blue-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
              <Bookmark className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Your Saved Revision Collection</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
              Questions wrong 3+ days ago resurface automatically under our spaced repetition schedule.
            </p>
            <button
              onClick={() => setActiveTab('topics')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25"
            >
              Start Revision Drill
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
