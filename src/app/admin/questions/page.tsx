'use client';

import React, { useState } from 'react';
import { INITIAL_QUESTIONS, INITIAL_TOPICS, INITIAL_KEYS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import { Question } from '@/lib/types';
import { Search, Filter, Plus, Edit3, Trash2, Check, Eye, X } from 'lucide-react';

export default function QuestionBankManagementPage() {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [search, setSearch] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [previewQ, setPreviewQ] = useState<Question | null>(null);

  const filtered = questions.filter((q) => {
    if (topicFilter !== 'all' && q.topic_id !== topicFilter) return false;
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (search && !q.stem.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleRetire = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'retired' as const } : q))
    );
  };

  const handleApprove = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'live' as const } : q))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#212835] dark:text-white">
            Question Bank Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Search, filter, audit KaTeX math rendering, and manage live questions in circulation.
          </p>
        </div>

        <button
          onClick={() => alert('New Question Form modal opened')}
          className="px-4 py-2 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Single Question</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stems, options, or formulas..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] text-xs"
          />
        </div>

        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] text-xs"
        >
          <option value="all">All Topics</option>
          {INITIAL_TOPICS.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] text-xs"
        >
          <option value="all">All Statuses</option>
          <option value="live">Live</option>
          <option value="reviewed">Reviewed</option>
          <option value="auto_verified">Auto Verified</option>
          <option value="needs_review">Needs Review</option>
          <option value="flagged">Flagged</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      {/* Question Table (PRD Section 7.10: 36px-48px rows, tabular numerals) */}
      <div className="rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#1B212C] text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="p-3">Stem &amp; Details</th>
              <th className="p-3">Topic</th>
              <th className="p-3">Difficulty</th>
              <th className="p-3">Status</th>
              <th className="p-3">Source</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE4EE] dark:divide-[#2E3746]">
            {filtered.map((q) => {
              let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
              if (q.status === 'live') badgeColor = 'bg-[#1F9D6B]/15 text-[#1F9D6B] font-bold';
              else if (q.status === 'auto_verified') badgeColor = 'bg-[#2D6BCB]/15 text-[#2D6BCB] font-bold';
              else if (q.status === 'needs_review') badgeColor = 'bg-amber-500/15 text-amber-500 font-bold';
              else if (q.status === 'flagged') badgeColor = 'bg-red-500/15 text-red-500 font-bold';
              else if (q.status === 'retired') badgeColor = 'bg-slate-200 dark:bg-slate-700 text-slate-400';

              return (
                <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1B212C]/50 transition-colors">
                  <td className="p-3 max-w-md">
                    <div className="font-medium text-[#212835] dark:text-white line-clamp-2">
                      <MathRenderer content={q.stem} />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      ID: {q.id} · Options: {q.options.length} · Version: v{q.version}
                    </div>
                  </td>
                  <td className="p-3 capitalize text-slate-600 dark:text-slate-300 font-medium">
                    {q.topic_id.replace('-', ' ')}
                  </td>
                  <td className="p-3 font-mono font-bold">
                    Level {q.difficulty_assigned}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${badgeColor}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 capitalize">
                    {q.source}
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => setPreviewQ(q)}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-black dark:hover:text-white"
                      title="Inspect & KaTeX Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {q.status !== 'live' && (
                      <button
                        onClick={() => handleApprove(q.id)}
                        className="p-1.5 rounded hover:bg-[#1F9D6B]/10 text-[#1F9D6B]"
                        title="Approve to Live"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {q.status !== 'retired' && (
                      <button
                        onClick={() => handleRetire(q.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                        title="Retire from circulation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* INSPECTION PREVIEW MODAL */}
      {previewQ && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151A23] rounded-2xl border border-[#DDE4EE] dark:border-[#2E3746] max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="font-mono font-bold text-xs">{previewQ.id}</span>
                <span className="ml-2 text-xs text-slate-400 capitalize">Topic: {previewQ.topic_id}</span>
              </div>
              <button onClick={() => setPreviewQ(null)}>
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Question Stem (KaTeX Rendered)</div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1117] border border-[#DDE4EE] dark:border-[#2E3746] text-sm">
                <MathRenderer content={previewQ.stem} />
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Options List</div>
              <div className="space-y-1.5">
                {previewQ.options.map((opt) => (
                  <div key={opt.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold uppercase">{opt.id}.</span>
                    <MathRenderer content={opt.text} />
                  </div>
                ))}
              </div>
            </div>

            {INITIAL_KEYS[previewQ.id] && (
              <div className="p-4 rounded-xl bg-[#1F9D6B]/10 border border-[#1F9D6B]/30 text-xs space-y-2">
                <div className="font-bold text-[#1F9D6B]">
                  Correct Key: Option {INITIAL_KEYS[previewQ.id].correct_option.toUpperCase()}
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  <MathRenderer content={INITIAL_KEYS[previewQ.id].solution} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
