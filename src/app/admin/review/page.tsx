'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_QUESTIONS, INITIAL_KEYS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import { CheckCircle2, XCircle, Code, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ReviewQueuePage() {
  const [items, setItems] = useState<any[]>([
    {
      id: 'rev-201',
      type: 'auto_verified',
      topic: 'quadratic-equations',
      stem: 'Solve both equations and find the relation between $x$ and $y$:\n\n**I.** $x^2 - 13x + 40 = 0$\n\n**II.** $y^2 - 15y + 56 = 0$',
      options: [
        { id: 'a', text: 'x > y' },
        { id: 'b', text: 'x < y' },
        { id: 'c', text: 'x ≥ y' },
        { id: 'd', text: 'x ≤ y' },
        { id: 'e', text: 'x = y or relationship cannot be established' },
      ],
      correct_option: 'b',
      solver_output: 'x < y (Roots: x=[5,8], y=[7,8] -> overlapping equality x <= y)',
      second_solver_output: 'x ≤ y (Match)',
      flags: ['Ambiguity check passed', 'Distinct options verified', 'KaTeX verified'],
    },
    {
      id: 'rev-202',
      type: 'auto_verified',
      topic: 'simplification',
      stem: '$60\\% \\text{ of } 1250 + \\sqrt{784} \\times 5 - 45 = ?$',
      options: [
        { id: 'a', text: '845' },
        { id: 'b', text: '855' },
        { id: 'c', text: '835' },
        { id: 'd', text: '865' },
        { id: 'e', text: '825' },
      ],
      correct_option: 'a',
      solver_output: '845 (Step: 750 + 140 - 45 = 845)',
      second_solver_output: '845 (Match)',
      flags: ['Solver confirmed single match', 'Distractors checked'],
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentItem = items[currentIndex];

  // Keyboard Shortcuts (A approve, R reject, arrow keys to navigate - AD-23)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'a' || e.key === 'A') {
        handleApprove();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReject();
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < items.length - 1) setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items]);

  const handleApprove = () => {
    alert(`Approved item ${currentItem?.id} to Live status!`);
    if (currentIndex < items.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handleReject = () => {
    alert(`Rejected item ${currentItem?.id} with regeneration flag.`);
    if (currentIndex < items.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  if (!currentItem) {
    return (
      <div className="p-12 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-[#1F9D6B] mx-auto" />
        <h2 className="text-base font-bold">Review Queue Clean!</h2>
        <p className="text-xs text-slate-400">All questions in the queue have been reviewed and verified.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#212835] dark:text-white">
            Unified Content Review Queue
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review {currentIndex + 1} of {items.length} items. Keyboard shortcuts enabled: <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px]">A</kbd> Approve, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px]">R</kbd> Reject.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex((prev) => prev - 1)}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs font-bold px-2">
            {currentIndex + 1} / {items.length}
          </span>
          <button
            onClick={() => currentIndex < items.length - 1 && setCurrentIndex((prev) => prev + 1)}
            disabled={currentIndex === items.length - 1}
            className="p-2 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] disabled:opacity-40"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split Pane: Left Question & Options, Right Solver Code & Second-Opinion (PRD Section 9.4 AD-21) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Question Stem & Options */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] space-y-5 shadow-sm">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono font-bold">{currentItem.id}</span>
            <span className="capitalize text-slate-400">{currentItem.topic}</span>
          </div>

          <div className="text-sm font-medium leading-relaxed">
            <MathRenderer content={currentItem.stem} />
          </div>

          <div className="space-y-2">
            {currentItem.options.map((opt: any) => {
              const isKey = opt.id === currentItem.correct_option;
              return (
                <div
                  key={opt.id}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    isKey ? 'border-[#1F9D6B] bg-[#1F9D6B]/10 font-bold text-[#1F9D6B]' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono uppercase font-bold">{opt.id}.</span>
                    <MathRenderer content={opt.text} />
                  </div>
                  {isKey && <span>✓ Stated Key</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Solver Code Output & Quality Verification Flags */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] space-y-4 shadow-sm text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
              <Code className="w-4 h-4 text-[#2D6BCB]" />
              <span>Sandbox Solver Execution Verification</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1117] font-mono text-[11px] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              {currentItem.solver_output}
            </div>

            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white pt-2">
              <ShieldCheck className="w-4 h-4 text-[#1F9D6B]" />
              <span>Independent Blind Re-Solve Model</span>
            </div>

            <div className="p-3 rounded-xl bg-[#1F9D6B]/10 font-mono text-[11px] border border-[#1F9D6B]/30 text-[#1F9D6B] font-bold">
              {currentItem.second_solver_output}
            </div>

            <div className="pt-2">
              <span className="font-semibold block mb-2 text-slate-400 text-[10px] uppercase">Validation Gates</span>
              <div className="space-y-1.5">
                {currentItem.flags.map((flag: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1F9D6B]" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Decision Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleReject}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject (R)</span>
            </button>

            <button
              onClick={handleApprove}
              className="flex-1 py-3 rounded-xl bg-[#1F9D6B] hover:bg-[#178559] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#1F9D6B]/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Live (A)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
