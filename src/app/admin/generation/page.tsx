'use client';

import React, { useState } from 'react';
import { INITIAL_TOPICS, globalStore } from '@/lib/store';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Zap,
  Layers,
} from 'lucide-react';

export default function GenerationControlCentrePage() {
  const [jobs, setJobs] = useState<any[]>(globalStore.getJobs());
  const [topicId, setTopicId] = useState<string>('quadratic-equations');
  const [difficulty, setDifficulty] = useState<number>(3);
  const [count, setCount] = useState<number>(20);
  const [method, setMethod] = useState<'template' | 'llm_twist'>('template');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);

  const handleLaunchJob = async () => {
    setIsSubmitting(true);
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
      }
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#212835] dark:text-white">
            Question Generation &amp; Assembly Control Centre
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage parametric templates, dispatch Gemini generation jobs, and supervise pre-built test packs.
          </p>
        </div>

        {/* Global Kill Switch (AD-35) */}
        <button
          onClick={() => setKillSwitchActive(!killSwitchActive)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            killSwitchActive
              ? 'bg-red-600 text-white animate-pulse'
              : 'border border-[#DDE4EE] dark:border-[#2E3746] bg-white dark:bg-[#151A23] text-slate-700 dark:text-slate-300 hover:border-red-500'
          }`}
        >
          {killSwitchActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{killSwitchActive ? 'Kill Switch ACTIVE (Paused)' : 'Generation Pipeline Normal'}</span>
        </button>
      </div>

      {/* Launch Job Creator Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#212835] dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#2D6BCB]" />
          <span>Dispatch New Question Generation Batch</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Target Topic</label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117]"
            >
              {INITIAL_TOPICS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Target Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117]"
            >
              <option value="1">Level 1 - Easy</option>
              <option value="2">Level 2 - Moderate-Easy</option>
              <option value="3">Level 3 - Moderate</option>
              <option value="4">Level 4 - Hard</option>
              <option value="5">Level 5 - Very Hard (Mains)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Generation Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117]"
            >
              <option value="template">Parametric Template (100% Math Verified)</option>
              <option value="llm_twist">Gemini Blueprint Twist + Sandbox</option>
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Batch Count</label>
            <input
              type="number"
              min="5"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleLaunchJob}
            disabled={isSubmitting || killSwitchActive}
            className="px-6 py-2.5 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#2D6BCB]/25"
          >
            <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Generation Job'}</span>
          </button>
        </div>
      </div>

      {/* Job Monitor Table (AD-32) */}
      <div className="rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#DDE4EE] dark:border-[#2E3746] flex items-center justify-between">
          <span className="font-bold text-xs">Generation Job Monitor</span>
          <span className="text-[10px] text-slate-400 font-mono">POLLING: FOR UPDATE SKIP LOCKED</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#1B212C] text-slate-400 uppercase text-[10px]">
              <th className="p-3">Job ID</th>
              <th className="p-3">Topic</th>
              <th className="p-3">Method</th>
              <th className="p-3">Accepted / Target</th>
              <th className="p-3">Runtime</th>
              <th className="p-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE4EE] dark:divide-[#2E3746]">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1B212C]/50">
                <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{j.id}</td>
                <td className="p-3 font-semibold">{j.topic_name} (Lvl {j.difficulty})</td>
                <td className="p-3 text-slate-500 capitalize">{j.method.replace('_', ' ')}</td>
                <td className="p-3 font-mono text-[#1F9D6B] font-bold">
                  {j.accepted_count} / {j.count} items
                </td>
                <td className="p-3 font-mono text-slate-400">{j.runtime_sec}s</td>
                <td className="p-3 text-right">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-[#1F9D6B]/15 text-[#1F9D6B]">
                    {j.status}
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
