'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';

export default function GenerationControlCentrePage() {
  const [jobs, setJobs] = useState<any[]>(globalStore.getJobs());
  const [topicId, setTopicId] = useState<string>('quadratic-equations');
  const [difficulty, setDifficulty] = useState<number>(3);
  const [count, setCount] = useState<number>(20);
  const [method, setMethod] = useState<'template' | 'llm_twist'>('llm_twist');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);
  const [aiStatus, setAiStatus] = useState<{ success: boolean; model?: string; message?: string; error?: string } | null>(null);
  const [checkingAi, setCheckingAi] = useState<boolean>(true);
  const [lastGeneratedQ, setLastGeneratedQ] = useState<any | null>(null);

  const checkConnection = async () => {
    setCheckingAi(true);
    try {
      const res = await fetch('/api/admin/ai-status');
      const data = await res.json();
      setAiStatus(data);
    } catch (e: any) {
      setAiStatus({ success: false, error: e.message });
    } finally {
      setCheckingAi(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Pipeline &amp; Synthesis</span>
            </div>

            {/* Live AI Status Pill */}
            {checkingAi ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Loader2 className="w-3 h-3 animate-spin text-[#005CE6]" />
                <span>Checking Gemini API...</span>
              </span>
            ) : aiStatus?.success ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Google Gemini ({aiStatus.model}): Connected &amp; Ready</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Gemini API: {aiStatus?.error || 'Offline'}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Question Generation Control Centre
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage parametric templates, dispatch live Gemini generation jobs, and supervise calibrated test packs.
          </p>
        </div>

        {/* Global Kill Switch (AD-35) */}
        <div className="flex items-center gap-2">
          <button
            onClick={checkConnection}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
            title="Refresh Gemini Connection Status"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setKillSwitchActive(!killSwitchActive)}
            className={`px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              killSwitchActive
                ? 'bg-red-600 text-white animate-pulse'
                : 'border border-blue-200 bg-white text-slate-700 hover:border-red-400 hover:text-red-600'
            }`}
          >
            {killSwitchActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-600" />}
            <span>{killSwitchActive ? 'Kill Switch ACTIVE (Paused)' : 'Generation Pipeline Normal'}</span>
          </button>
        </div>
      </div>

      {/* Launch Job Creator Card */}
      <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <span>Dispatch New Question Generation Batch</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Target Topic</label>
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
            <label className="font-semibold text-slate-700 block mb-1.5">Target Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="1">Level 1 - Easy</option>
              <option value="2">Level 2 - Moderate-Easy</option>
              <option value="3">Level 3 - Moderate</option>
              <option value="4">Level 4 - Hard</option>
              <option value="5">Level 5 - Very Hard (Mains)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Generation Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="template">Parametric Template (100% Math Verified)</option>
              <option value="llm_twist">Gemini Blueprint Twist + Sandbox</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Batch Count</label>
            <input
              type="number"
              min="5"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleLaunchJob}
            disabled={isSubmitting || killSwitchActive}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Calling Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Dispatch Generation Job</span>
              </>
            )}
          </button>
        </div>

        {/* Live AI Question Generation Success Showcase */}
        {lastGeneratedQ && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Live Gemini AI Synthesis Successful — Question Added to Active Pool!</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Correct: Option {lastGeneratedQ.correct_option?.toUpperCase()}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 font-medium">
              <div className="font-semibold text-slate-900 mb-1">Question Stem:</div>
              <p>{lastGeneratedQ.stem}</p>
            </div>
            {lastGeneratedQ.shortcut && (
              <div className="text-[11px] text-emerald-800 bg-white/60 p-2.5 rounded-xl border border-emerald-200">
                <strong>Vedic Speed Shortcut:</strong> {lastGeneratedQ.shortcut}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Job Monitor Table (AD-32) */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 overflow-hidden shadow-xs">
        <div className="p-4 px-6 border-b border-blue-100 bg-blue-50/30 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-900">Generation Job Monitor</span>
          <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            POLLING: FOR UPDATE SKIP LOCKED
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-blue-100 bg-blue-50/50 text-slate-500 uppercase text-[10px] font-bold">
              <th className="p-3.5 pl-6">Job ID</th>
              <th className="p-3.5">Topic</th>
              <th className="p-3.5">Method</th>
              <th className="p-3.5">Accepted / Target</th>
              <th className="p-3.5">Runtime</th>
              <th className="p-3.5 pr-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="p-3.5 pl-6 font-mono font-bold text-blue-700">{j.id}</td>
                <td className="p-3.5 font-semibold text-slate-800">{j.topic_name} (Lvl {j.difficulty})</td>
                <td className="p-3.5 text-slate-500 capitalize">{j.method.replace('_', ' ')}</td>
                <td className="p-3.5 font-mono text-emerald-700 font-bold">
                  {j.accepted_count} / {j.count} items
                </td>
                <td className="p-3.5 font-mono text-slate-400">{j.runtime_sec}s</td>
                <td className="p-3.5 pr-6 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
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
