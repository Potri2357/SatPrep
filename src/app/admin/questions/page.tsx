'use client';

import React, { useState } from 'react';
import { INITIAL_QUESTIONS, INITIAL_TOPICS, INITIAL_KEYS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import { Question } from '@/lib/types';
import { Search, Filter, Plus, Edit3, Trash2, Check, Eye, X, BookOpen } from 'lucide-react';

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Calibrated Items Inventory</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Question Bank Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, audit KaTeX math rendering, and manage live questions in circulation.
          </p>
        </div>

        <button
          onClick={() => alert('New Question Form modal opened')}
          className="px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all shadow-blue-500/20 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Single Question</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 flex flex-col sm:flex-row gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stems, options, or formulas..."
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-blue-100 bg-blue-50/30 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="h-10 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-700 text-xs font-medium focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Topics</option>
          {INITIAL_TOPICS.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-700 text-xs font-medium focus:outline-none focus:border-blue-500"
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

      {/* Question Table */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-blue-100 bg-blue-50/50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <th className="p-3.5 pl-5">Stem &amp; Details</th>
              <th className="p-3.5">Topic</th>
              <th className="p-3.5">Difficulty</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Source</th>
              <th className="p-3.5 pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {filtered.map((q) => {
              let badgeColor = 'bg-slate-100 text-slate-600 border border-slate-200';
              if (q.status === 'live') badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold';
              else if (q.status === 'auto_verified') badgeColor = 'bg-blue-50 text-blue-700 border border-blue-200 font-bold';
              else if (q.status === 'needs_review') badgeColor = 'bg-amber-50 text-amber-700 border border-amber-200 font-bold';
              else if (q.status === 'flagged') badgeColor = 'bg-red-50 text-red-700 border border-red-200 font-bold';
              else if (q.status === 'retired') badgeColor = 'bg-slate-100 text-slate-400 border border-slate-200';

              return (
                <tr key={q.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="p-3.5 pl-5 max-w-md">
                    <div className="font-semibold text-slate-900 line-clamp-2">
                      <MathRenderer content={q.stem} />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      ID: {q.id} · Options: {q.options.length} · Version: v{q.version}
                    </div>
                  </td>
                  <td className="p-3.5 capitalize text-slate-700 font-medium">
                    {q.topic_id.replace('-', ' ')}
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-bold">
                      Lvl {q.difficulty_assigned}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono ${badgeColor}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 capitalize">
                    {q.source}
                  </td>
                  <td className="p-3.5 pr-5 text-right space-x-1">
                    <button
                      onClick={() => setPreviewQ(q)}
                      className="p-1.5 rounded-xl hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                      title="Inspect & KaTeX Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {q.status !== 'live' && (
                      <button
                        onClick={() => handleApprove(q.id)}
                        className="p-1.5 rounded-xl hover:bg-emerald-50 text-emerald-600 transition-colors"
                        title="Approve to Live"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {q.status !== 'retired' && (
                      <button
                        onClick={() => handleRetire(q.id)}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
                        title="Retire from circulation"
                      >
                        <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-blue-100 max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div>
                <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {previewQ.id}
                </span>
                <span className="ml-2.5 text-xs text-slate-500 capitalize">Topic: {previewQ.topic_id}</span>
              </div>
              <button onClick={() => setPreviewQ(null)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider mb-1.5">Question Stem (KaTeX Rendered)</div>
              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 text-sm text-slate-900 leading-relaxed">
                <MathRenderer content={previewQ.stem} />
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">Options List</div>
              <div className="space-y-2">
                {previewQ.options.map((opt) => (
                  <div key={opt.id} className="p-3 rounded-xl border border-blue-100 bg-white flex items-center gap-2.5 text-xs text-slate-800">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-mono font-bold uppercase text-[10px]">
                      {opt.id}
                    </span>
                    <MathRenderer content={opt.text} />
                  </div>
                ))}
              </div>
            </div>

            {INITIAL_KEYS[previewQ.id] && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Correct Key: Option {INITIAL_KEYS[previewQ.id].correct_option.toUpperCase()}</span>
                </div>
                <div className="text-slate-700">
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
