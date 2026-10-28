'use client';

import React, { useState } from 'react';
import { globalStore } from '@/lib/store';
import {
  Flag,
  RotateCcw,
  CheckCircle2,
  Check,
} from 'lucide-react';

export default function ReportsAndRegradePage() {
  const [reports, setReports] = useState<any[]>(globalStore.getReports());
  const [regradeQid, setRegradeQid] = useState<string>('q-profit-1');
  const [newKey, setNewKey] = useState<string>('c');
  const [regradeResult, setRegradeResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleExecuteRegrade = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/regrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: regradeQid,
          new_correct_option: newKey,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRegradeResult(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
          <Flag className="w-3.5 h-3.5" />
          <span>Student Feedback &amp; Corrections</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Student Feedback &amp; Score Adjustments
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review questions flagged by students during practice tests and update answer keys with automatic score recalculation.
        </p>
      </div>

      {/* RE-GRADE TOOL CARD */}
      <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Update Answer Key &amp; Recalculate Past Scores
            </h2>
            <p className="text-xs text-slate-500">
              If an answer key was incorrect, selecting the correct option here will automatically recalculate scores and analytics for all students who took this question.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Target Question ID</label>
            <input
              type="text"
              value={regradeQid}
              onChange={(e) => setRegradeQid(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Correct Answer</label>
            <select
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 uppercase font-bold text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="a">Option A</option>
              <option value="b">Option B</option>
              <option value="c">Option C</option>
              <option value="d">Option D</option>
              <option value="e">Option E</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExecuteRegrade}
              disabled={isProcessing}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isProcessing ? 'Recalculating...' : 'Update Key & Recalculate Scores'}</span>
            </button>
          </div>
        </div>

        {regradeResult && (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>
              Updated successfully! Question {regradeResult.question_id} correct answer changed to Option {regradeResult.new_correct_option.toUpperCase()}. Recalculated {regradeResult.affected_attempts} student test results.
            </span>
          </div>
        )}
      </div>

      {/* STUDENT REPORTS INBOX */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 overflow-hidden shadow-xs">
        <div className="p-4 px-6 border-b border-blue-100 bg-blue-50/30 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-900">Student Reports &amp; Flagged Questions</span>
          <span className="text-[10px] text-amber-800 font-medium bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Questions with 3 or more reports are flagged for review
          </span>
        </div>

        <div className="divide-y divide-blue-50">
          {reports.map((rep) => (
            <div key={rep.id} className="p-4 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{rep.question_id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {rep.reason.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400">Reported by {rep.user_name}</span>
                </div>
                <div className="text-slate-800 font-medium">{rep.text}</div>
                {rep.question_stem && (
                  <div className="text-[11px] text-slate-500 line-clamp-1 italic">{rep.question_stem}</div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert(`Report ${rep.id} dismissed.`)}
                  className="px-3.5 py-1.5 rounded-full border border-blue-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setRegradeQid(rep.question_id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Select to Correct
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
