'use client';

import React, { useState } from 'react';
import { INITIAL_TOPICS, globalStore } from '@/lib/store';
import {
  Sparkles,
  CheckCircle2,
  Zap,
  Loader2,
  Lightbulb,
} from 'lucide-react';

export default function GenerationControlCentrePage() {
  const [jobs, setJobs] = useState<any[]>(globalStore.getJobs());
  const [topicId, setTopicId] = useState<string>('quadratic-equations');
  const [difficulty, setDifficulty] = useState<number>(3);
  const [count, setCount] = useState<number>(10);
  const [method, setMethod] = useState<'template' | 'llm_twist'>('llm_twist');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastGeneratedQ, setLastGeneratedQ] = useState<any | null>(null);

  const handleLaunchJob = async () => {
    setIsSubmitting(true);
    setLastGeneratedQ(null);
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: topicId,
          difficulty,
          count,
          method,
        }),
      });
      const data = await res.json();
      if (data.success && data.job) {
        setJobs([data.job, ...jobs]);
        if (data.generated_question) {
          setLastGeneratedQ(data.generated_question);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Create Questions with AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Automatically generate curriculum-aligned practice questions with complete solutions and multiple-choice options.
        </p>
      </div>

      {/* Create Questions Form */}
      <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <span>Generate New Practice Questions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Subject Topic</label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              {INITIAL_TOPICS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="1">Level 1 - Easy</option>
              <option value="2">Level 2 - Moderate-Easy</option>
              <option value="3">Level 3 - Moderate</option>
              <option value="4">Level 4 - Hard</option>
              <option value="5">Level 5 - Advanced (Mains)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Generation Style</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="llm_twist">AI Smart Creative Twist</option>
              <option value="template">Standard Exam Formula</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Number of Questions</label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleLaunchJob}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Questions Now</span>
              </>
            )}
          </button>
        </div>

        {/* Live Generated Question Preview */}
        {lastGeneratedQ && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-3 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>New Question Created and Added to Live Question Bank</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                Level {difficulty} · Verified
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 font-medium space-y-2">
              <div className="font-semibold text-slate-900">Question:</div>
              <p className="leading-relaxed">{lastGeneratedQ.stem}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {lastGeneratedQ.options?.map((opt: any) => (
                  <div
                    key={opt.id}
                    className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                      opt.id === lastGeneratedQ.correct_option
                        ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] uppercase font-bold bg-white border border-slate-300">
                      {opt.id}
                    </span>
                    <span>{opt.text}</span>
                    {opt.id === lastGeneratedQ.correct_option && (
                      <span className="ml-auto text-[9px] uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {lastGeneratedQ.shortcut && (
              <div className="text-[11px] text-emerald-900 bg-white/70 p-2.5 rounded-xl border border-emerald-200 leading-relaxed flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span><strong>Speed Shortcut:</strong> {lastGeneratedQ.shortcut}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Generation History */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 overflow-hidden shadow-xs">
        <div className="p-4 px-6 border-b border-blue-100 bg-blue-50/30 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-900">Recent Generation Activity</span>
          <span className="text-[11px] text-slate-500 font-medium">
            Questions automatically saved to bank
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-blue-100 bg-blue-50/50 text-slate-500 uppercase text-[10px] font-bold">
              <th className="p-3.5 pl-6">Batch ID</th>
              <th className="p-3.5">Topic &amp; Level</th>
              <th className="p-3.5">Method</th>
              <th className="p-3.5">Questions Created</th>
              <th className="p-3.5 pr-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="p-3.5 pl-6 font-mono font-bold text-blue-700">{j.id}</td>
                <td className="p-3.5 font-semibold text-slate-800">{j.topic_name} (Lvl {j.difficulty})</td>
                <td className="p-3.5 text-slate-500 capitalize">{j.method === 'llm_twist' ? 'AI Smart' : 'Exam Formula'}</td>
                <td className="p-3.5 font-mono text-emerald-700 font-bold">
                  {j.accepted_count} questions
                </td>
                <td className="p-3.5 pr-6 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {j.status === 'completed' ? 'Completed' : j.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
