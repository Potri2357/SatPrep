'use client';

import React, { useState } from 'react';
import { globalStore, INITIAL_QUESTIONS, INITIAL_KEYS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import {
  Flag,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
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
        <h1 className="text-xl font-bold tracking-tight text-[#212835] dark:text-white">
          Question Quality Inbox &amp; Re-grade Tool
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Triage reported answer keys, monitor auto-flagged items, and recalculate historical attempts upon key corrections.
        </p>
      </div>

      {/* RE-GRADE TOOL CARD (AD-53) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-[#2D6BCB]" />
          <div>
            <h2 className="text-sm font-bold text-[#212835] dark:text-white">
              Historical Attempt Re-grade Engine
            </h2>
            <p className="text-xs text-slate-400">
              When an expert reviewer verifies a contested key, this tool recalculates scores and accuracy for all candidate attempts that contained this question.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div>
            <label className="font-semibold block mb-1">Target Question ID</label>
            <input
              type="text"
              value={regradeQid}
              onChange={(e) => setRegradeQid(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] font-mono"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Corrected Key</label>
            <select
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] uppercase font-bold"
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
              className="w-full h-10 rounded-lg bg-[#2D6BCB] hover:bg-[#2458AD] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isProcessing ? 'Recalculating...' : 'Execute Re-grade'}</span>
            </button>
          </div>
        </div>

        {regradeResult && (
          <div className="p-4 rounded-xl bg-[#1F9D6B]/10 border border-[#1F9D6B]/30 text-xs text-[#1F9D6B] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Re-grade Completed! Question {regradeResult.question_id} key changed to {regradeResult.new_correct_option.toUpperCase()}. Recalculated {regradeResult.affected_attempts} student test attempts.
            </span>
          </div>
        )}
      </div>

      {/* STUDENT REPORTS INBOX (AD-50 to AD-52) */}
      <div className="rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#DDE4EE] dark:border-[#2E3746] flex items-center justify-between">
          <span className="font-bold text-xs">Student-Reported Questions Inbox</span>
          <span className="text-[10px] text-slate-400">Auto-flag rule: ≥ 3 reports moves item to flagged</span>
        </div>

        <div className="divide-y divide-[#DDE4EE] dark:divide-[#2E3746]">
          {reports.map((rep) => (
            <div key={rep.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{rep.question_id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/15 text-amber-500">
                    {rep.reason.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400">Reported by {rep.user_name}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-medium">{rep.text}</div>
                {rep.question_stem && (
                  <div className="text-[11px] text-slate-400 line-clamp-1 italic">{rep.question_stem}</div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert(`Report ${rep.id} dismissed.`)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-black dark:hover:text-white"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setRegradeQid(rep.question_id);
                    alert(`Loaded ${rep.question_id} into Re-grade Engine above.`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#2D6BCB] text-white font-semibold"
                >
                  Inspect &amp; Fix Key
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
