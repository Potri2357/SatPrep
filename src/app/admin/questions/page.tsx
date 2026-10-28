'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ALL_PRACTICE_QUESTIONS as INITIAL_QUESTIONS, INITIAL_TOPICS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import { Question } from '@/lib/types';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Check,
  Eye,
  X,
  Loader2,
  CheckCircle2,
  BookOpen,
  Lightbulb,
} from 'lucide-react';

interface ExtendedQuestion extends Question {
  correct_option?: string;
  solution?: string;
  shortcut?: string;
}

export default function QuestionBankManagementPage() {
  const [questions, setQuestions] = useState<ExtendedQuestion[]>(INITIAL_QUESTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [previewQ, setPreviewQ] = useState<ExtendedQuestion | null>(null);

  // Edit State
  const [editingQ, setEditingQ] = useState<ExtendedQuestion | null>(null);
  const [editStem, setEditStem] = useState<string>('');
  const [editTopic, setEditTopic] = useState<string>('');
  const [editDifficulty, setEditDifficulty] = useState<number>(2);
  const [editOptA, setEditOptA] = useState<string>('');
  const [editOptB, setEditOptB] = useState<string>('');
  const [editOptC, setEditOptC] = useState<string>('');
  const [editOptD, setEditOptD] = useState<string>('');
  const [editOptE, setEditOptE] = useState<string>('');
  const [editCorrectKey, setEditCorrectKey] = useState<string>('a');
  const [editSolution, setEditSolution] = useState<string>('');
  const [editShortcut, setEditShortcut] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Fetch updated questions from Supabase & API on mount
  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('/api/admin/questions');
        const data = await res.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    INITIAL_TOPICS.forEach((t) => set.add(t.id));
    questions.forEach((q) => {
      if (q.topic_id) set.add(q.topic_id);
    });
    return Array.from(set).sort();
  }, [questions]);

  const topicFilterOptions = useMemo(() => [
    { value: 'all', label: `All Topics (${questions.length})` },
    ...availableTopics.map((tId) => ({
      value: tId,
      label: tId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    })),
  ], [availableTopics, questions.length]);

  const editTopicOptions = useMemo(() =>
    availableTopics.map((tId) => ({
      value: tId,
      label: tId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    })),
  [availableTopics]);

  const difficultyOptions = [
    { value: 1, label: 'Level 1 (Easy)' },
    { value: 2, label: 'Level 2 (Moderate)' },
    { value: 3, label: 'Level 3 (Exam Standard)' },
    { value: 4, label: 'Level 4 (Hard / Mains)' },
    { value: 5, label: 'Level 5 (Advanced)' },
  ];

  const filtered = questions.filter((q) => {
    if (topicFilter !== 'all' && q.topic_id !== topicFilter) return false;
    if (search && !q.stem.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this question from circulation?')) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleStartEdit = (q: ExtendedQuestion) => {
    setEditingQ(q);
    setEditStem(q.stem || '');
    setEditTopic(q.topic_id || 'simplification');
    setEditDifficulty(q.difficulty_assigned || 2);
    setEditOptA(q.options?.find((o) => o.id === 'a')?.text || q.options?.[0]?.text || '');
    setEditOptB(q.options?.find((o) => o.id === 'b')?.text || q.options?.[1]?.text || '');
    setEditOptC(q.options?.find((o) => o.id === 'c')?.text || q.options?.[2]?.text || '');
    setEditOptD(q.options?.find((o) => o.id === 'd')?.text || q.options?.[3]?.text || '');
    setEditOptE(q.options?.find((o) => o.id === 'e')?.text || q.options?.[4]?.text || 'None of these');
    setEditCorrectKey(q.correct_option?.toLowerCase() || 'a');
    setEditSolution(q.solution || '');
    setEditShortcut(q.shortcut || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQ) return;
    setIsSaving(true);

    const updatedQuestion: ExtendedQuestion = {
      ...editingQ,
      stem: editStem,
      topic_id: editTopic,
      difficulty_assigned: Number(editDifficulty) || 2,
      options: [
        { id: 'a', text: editOptA },
        { id: 'b', text: editOptB },
        { id: 'c', text: editOptC },
        { id: 'd', text: editOptD },
        { id: 'e', text: editOptE },
      ],
      correct_option: editCorrectKey,
      solution: editSolution,
      shortcut: editShortcut,
    };

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: updatedQuestion,
          key: {
            correct_option: editCorrectKey,
            solution: editSolution,
            shortcut: editShortcut,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === editingQ.id ? updatedQuestion : q))
        );
        setEditingQ(null);
        setSuccessToast('Question updated successfully in live database!');
        setTimeout(() => setSuccessToast(null), 4000);
      } else {
        alert(data.error || 'Failed to update question');
      }
    } catch (err) {
      console.error('Error saving question edit:', err);
      alert('Error updating question');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Question Bank
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, preview, and edit practice questions ({questions.length} total in question bank).
          </p>
        </div>

        <a
          href="/admin/seed"
          className="px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Add Questions</span>
        </a>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Filter and Search Bar (without Status filter) */}
      <div className="p-4 rounded-3xl bg-white border border-blue-100 flex flex-col sm:flex-row gap-3 shadow-xs relative z-20">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stems, options, or formulas..."
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-blue-100 bg-blue-50/30 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div className="w-full sm:w-64 shrink-0">
          <CustomDropdown
            value={topicFilter}
            onChange={(val) => setTopicFilter(String(val))}
            options={topicFilterOptions}
            triggerClassName="h-10"
          />
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-8 text-center text-xs text-blue-600 flex items-center justify-center gap-2 bg-blue-50/50 rounded-3xl border border-blue-100">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Synchronizing live questions from database...</span>
        </div>
      )}

      {/* Question Table (Status & Source columns removed, Edit button added) */}
      <div className="rounded-3xl bg-white border border-blue-100 overflow-hidden shadow-xs relative z-10">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-blue-100 bg-blue-50/50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <th className="p-3.5 pl-5">Question Stem &amp; Details</th>
              <th className="p-3.5">Topic</th>
              <th className="p-3.5">Difficulty</th>
              <th className="p-3.5 pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="p-3.5 pl-5 max-w-xl">
                  <div className="font-semibold text-slate-900 space-y-1">
                    <MathRenderer content={q.stem} />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>{q.options?.length || 5} Options</span>
                    <span>•</span>
                    <span className="font-mono">{q.id}</span>
                    {q.correct_option && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold uppercase font-mono">
                          Key: Option {q.correct_option.toUpperCase()}
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-3.5 capitalize text-slate-700 font-medium whitespace-nowrap">
                  {q.topic_id.replace(/-/g, ' ')}
                </td>
                <td className="p-3.5 font-mono whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-bold">
                    Lvl {q.difficulty_assigned}
                  </span>
                </td>
                <td className="p-3.5 pr-5 text-right space-x-1 whitespace-nowrap">
                  {/* Edit Option */}
                  <button
                    onClick={() => handleStartEdit(q)}
                    className="p-1.5 rounded-xl hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                    title="Edit Question"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Preview Option */}
                  <button
                    onClick={() => setPreviewQ(q)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Preview Question"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Delete Option */}
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 rounded-xl hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT QUESTION MODAL */}
      {editingQ && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-blue-100 max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-slate-900">
                  Edit Question ({editingQ.id})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingQ(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Topic & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic</label>
                  <CustomDropdown
                    value={editTopic}
                    onChange={(val) => setEditTopic(String(val))}
                    options={editTopicOptions}
                    triggerClassName="h-10"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty Level</label>
                  <CustomDropdown
                    value={editDifficulty}
                    onChange={(val) => setEditDifficulty(Number(val))}
                    options={difficultyOptions}
                    triggerClassName="h-10"
                  />
                </div>
              </div>

              {/* Question Stem */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Question Stem (supports LaTeX math like $x^2 + y^2 = 100$ and markdown tables)
                </label>
                <textarea
                  rows={4}
                  value={editStem}
                  onChange={(e) => setEditStem(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-sans text-xs text-slate-900 focus:outline-none focus:border-blue-500 leading-relaxed"
                  required
                />
                {/* Live Formula Preview Box */}
                {editStem && (
                  <div className="mt-2 p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-slate-800">
                    <span className="text-[10px] uppercase font-bold text-blue-600 block mb-1">
                      Live Stem Preview
                    </span>
                    <MathRenderer content={editStem} />
                  </div>
                )}
              </div>

              {/* Options & Radio Picker for Correct Answer */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  Answer Options (Click radio button to mark as correct option)
                </label>
                {[
                  { key: 'a', val: editOptA, set: setEditOptA },
                  { key: 'b', val: editOptB, set: setEditOptB },
                  { key: 'c', val: editOptC, set: setEditOptC },
                  { key: 'd', val: editOptD, set: setEditOptD },
                  { key: 'e', val: editOptE, set: setEditOptE },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 text-xs font-bold uppercase font-mono">
                      <input
                        type="radio"
                        name="editCorrectKey"
                        value={item.key}
                        checked={editCorrectKey === item.key}
                        onChange={(e) => setEditCorrectKey(e.target.value)}
                        className="sr-only"
                      />
                      <span
                        className={`w-full h-full flex items-center justify-center rounded-lg transition-colors ${
                          editCorrectKey === item.key ? 'bg-blue-600 text-white' : 'text-slate-700'
                        }`}
                      >
                        {item.key}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      placeholder={`Option ${item.key.toUpperCase()} text...`}
                      className={`flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none ${
                        editCorrectKey === item.key
                          ? 'border-emerald-400 bg-emerald-50/30'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Solution & Shortcut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Step-by-Step Solution</label>
                  <textarea
                    rows={3}
                    value={editSolution}
                    onChange={(e) => setEditSolution(e.target.value)}
                    placeholder="Clear explanation and working..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Speed Shortcut</label>
                  <textarea
                    rows={3}
                    value={editShortcut}
                    onChange={(e) => setEditShortcut(e.target.value)}
                    placeholder="Shortcut trick (e.g. digital roots, split & merge)..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingQ(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECTION PREVIEW MODAL */}
      {previewQ && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-blue-100 max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div>
                <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {previewQ.id}
                </span>
                <span className="ml-2.5 text-xs text-slate-500 capitalize">
                  Topic: {previewQ.topic_id.replace(/-/g, ' ')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewQ(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider mb-1.5">
                Question &amp; Data / Diagram
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 text-sm text-slate-900 leading-relaxed">
                <MathRenderer content={previewQ.stem} />
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">Options</div>
              <div className="space-y-2">
                {previewQ.options?.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                      previewQ.correct_option?.toLowerCase() === opt.id
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-blue-100 bg-white text-slate-800'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold uppercase text-[10px] shrink-0 ${
                        previewQ.correct_option?.toLowerCase() === opt.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <MathRenderer content={opt.text} />
                    {previewQ.correct_option?.toLowerCase() === opt.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {previewQ.solution && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Step-by-Step Solution</span>
                </div>
                <div className="text-slate-700 leading-relaxed">
                  <MathRenderer content={previewQ.solution} />
                </div>
              </div>
            )}

            {previewQ.shortcut && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                <div className="font-bold text-amber-800 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                  <span>Speed Shortcut</span>
                </div>
                <div className="text-slate-700 leading-relaxed">
                  <MathRenderer content={previewQ.shortcut} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
