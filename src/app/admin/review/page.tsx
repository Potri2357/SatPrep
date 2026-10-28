'use client';

import React, { useState, useEffect } from 'react';
import { MathRenderer } from '@/lib/math-renderer';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
} from 'lucide-react';

export default function ContentReviewQueuePage() {
  const [items, setItems] = useState<any[]>([
    {
      id: 'gen-profit-9921',
      topic: 'profit-and-loss',
      stem: 'A dishonest merchant uses a weight of $920\\text{ g}$ instead of a standard $1\\text{ kg}$ weight for selling goods. Additionally, he marks his goods $15\\%$ above the cost price. What is his overall net percentage profit?',
      options: [
        { id: 'a', text: '22.5\\%' },
        { id: 'b', text: '25.0\\%' },
        { id: 'c', text: '24.2\\%' },
        { id: 'd', text: '23.8\\%' },
        { id: 'e', text: '26.1\\%' },
      ],
      correct_option: 'b',
      solver_output: 'Cost of 920g = 920 units. Selling price of 920g goods = 1.15 * 1000 = 1150 units. Profit = 1150 - 920 = 230 units. Net Profit % = (230 / 920) * 100 = 25.00%. Verified.',
      second_solver_output: 'Calculation verified: Result = 25.00%. Exactly 1 correct option among the 5 choices.',
      flags: ['Mathematical values validated', 'Multiple-choice options plausible', 'Formulas formatted cleanly'],
    },
    {
      id: 'gen-quad-4481',
      topic: 'quadratic-equations',
      stem: 'Two equations are given below: \\nI. $x^2 - 14x + 48 = 0$ \\nII. $y^2 - 17y + 72 = 0$ \\nEstablish the quantitative relationship between $x$ and $y$.',
      options: [
        { id: 'a', text: 'x > y' },
        { id: 'b', text: 'x < y' },
        { id: 'c', text: 'x \\ge y' },
        { id: 'd', text: 'x \\le y' },
        { id: 'e', text: 'x = y \\text{ or relationship cannot be established}' },
      ],
      correct_option: 'd',
      solver_output: 'Eq I roots: (x - 6)(x - 8) = 0 => x in {6, 8}. Eq II roots: (y - 8)(y - 9) = 0 => y in {8, 9}. Comparing: 6 < 8, 6 < 9, 8 = 8, 8 < 9 => x <= y. Verified.',
      second_solver_output: 'Relationship confirmed: root intervals overlap at 8, all other x < y. Result: x <= y. Matches Option D.',
      flags: ['All root combinations verified', 'Real numbers only', 'Formulas formatted cleanly'],
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentItem = items[currentIndex];

  const handleApprove = () => {
    alert(`Question ${currentItem.id} approved and published to live questions.`);
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleReject = () => {
    alert(`Question ${currentItem.id} rejected and removed from review.`);
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Keyboard shortcut listener: 'A' to Approve, 'R' to Reject
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'a' || e.key === 'A') {
        handleApprove();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentItem]);

  if (!currentItem) {
    return (
      <div className="p-12 text-center space-y-3 glass-panel bg-white/95 rounded-3xl border border-blue-100 max-w-md mx-auto">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Review Queue Complete!</h2>
        <p className="text-xs text-slate-500">All questions in the queue have been reviewed and approved.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quality Verification</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Question Review Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review {currentIndex + 1} of {items.length} pending questions. Quick keys: <kbd className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">A</kbd> to Approve, <kbd className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">R</kbd> to Reject.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex((prev) => prev - 1)}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl border border-blue-200 bg-white disabled:opacity-40 hover:bg-blue-50 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {currentIndex + 1} / {items.length}
          </span>
          <button
            onClick={() => currentIndex < items.length - 1 && setCurrentIndex((prev) => prev + 1)}
            disabled={currentIndex === items.length - 1}
            className="p-2 rounded-xl border border-blue-200 bg-white disabled:opacity-40 hover:bg-blue-50 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split Pane: Question on Left, Solutions & Verification on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Question & Options */}
        <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 space-y-5 shadow-xs">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-blue-100">
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">{currentItem.id}</span>
            <span className="capitalize text-slate-500 font-semibold">{currentItem.topic.replace('-', ' ')}</span>
          </div>

          <div className="text-sm font-semibold text-slate-900 leading-relaxed p-4 rounded-2xl bg-blue-50/30 border border-blue-100">
            <MathRenderer content={currentItem.stem} />
          </div>

          <div className="space-y-2">
            {currentItem.options.map((opt: any) => {
              const isKey = opt.id === currentItem.correct_option;
              return (
                <div
                  key={opt.id}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                    isKey
                      ? 'border-emerald-300 bg-emerald-50/80 font-bold text-emerald-900 shadow-xs'
                      : 'border-blue-100 bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold uppercase text-[10px] ${
                      isKey ? 'bg-emerald-600 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {opt.id}
                    </span>
                    <MathRenderer content={opt.text} />
                  </div>
                  {isKey && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Correct Answer</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Solution & Checks */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 space-y-4 shadow-xs text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Step-by-Step Solution &amp; Working</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/50 font-mono text-[11px] border border-blue-100 text-slate-800 leading-relaxed">
              {currentItem.solver_output}
            </div>

            <div className="flex items-center gap-2 font-bold text-slate-900 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Answer Verification</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 font-mono text-[11px] border border-emerald-200 text-emerald-900 font-bold leading-relaxed">
              {currentItem.second_solver_output}
            </div>

            <div className="pt-2">
              <span className="font-bold block mb-2 text-slate-400 text-[10px] uppercase tracking-wider">Quality Checks Passed</span>
              <div className="space-y-2">
                {currentItem.flags.map((flag: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Decision Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleReject}
              className="flex-1 py-3.5 rounded-2xl bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject (R)</span>
            </button>

            <button
              onClick={handleApprove}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve for Students (A)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
