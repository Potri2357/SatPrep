'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ALL_PRACTICE_QUESTIONS as INITIAL_QUESTIONS, INITIAL_TOPICS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import { Question } from '@/lib/types';
import { cn } from '@/lib/utils';
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
  Columns,
  Table as TableIcon,
  Copy,
  Sparkles,
  Layers,
  Award,
  ChevronRight,
  Compass,
} from 'lucide-react';

interface ExtendedQuestion extends Question {
  correct_option?: string;
  solution?: string;
  shortcut?: string;
  option_rationales?: Record<string, string>;
}

export default function QuestionBankManagementPage() {
  const [questions, setQuestions] = useState<ExtendedQuestion[]>(INITIAL_QUESTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'finder' | 'table'>('finder');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch updated questions from Supabase & API on mount
  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('/api/admin/questions');
        const data = await res.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
          if (!selectedQuestionId) {
            setSelectedQuestionId(data.questions[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  // Sync selected question if list loads
  useEffect(() => {
    if (!selectedQuestionId && questions.length > 0) {
      setSelectedQuestionId(questions[0].id);
    }
  }, [questions, selectedQuestionId]);

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

  const difficultyFilterOptions = [
    { value: 'all', label: 'All Difficulty Levels' },
    { value: '1', label: 'Level 1 (Easy / Pure Velocity)' },
    { value: '2', label: 'Level 2 (Moderate / Stamina)' },
    { value: '3', label: 'Level 3 (Exam Standard)' },
    { value: '4', label: 'Level 4 (Hard / Mains)' },
    { value: '5', label: 'Level 5 (Advanced Analytics)' },
  ];

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

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (topicFilter !== 'all' && q.topic_id !== topicFilter) return false;
      if (difficultyFilter !== 'all' && String(q.difficulty_assigned) !== difficultyFilter) return false;
      if (search) {
        const qSearch = search.toLowerCase();
        const inStem = q.stem.toLowerCase().includes(qSearch);
        const inId = q.id.toLowerCase().includes(qSearch);
        const inTopic = q.topic_id.toLowerCase().includes(qSearch);
        const inOpts = q.options?.some((o) => o.text.toLowerCase().includes(qSearch));
        if (!inStem && !inId && !inTopic && !inOpts) return false;
      }
      return true;
    });
  }, [questions, topicFilter, difficultyFilter, search]);

  // Currently inspected question in Finder Preview
  const selectedQuestion = useMemo(() => {
    return filtered.find((q) => q.id === selectedQuestionId) || filtered[0] || null;
  }, [filtered, selectedQuestionId]);

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
          question: {
            id: editingQ.id,
            stem: editStem,
            topic_id: editTopic,
            difficulty_assigned: Number(editDifficulty) || 2,
            options: updatedQuestion.options,
            status: editingQ.status,
            source: editingQ.source,
          },
          key: {
            question_id: editingQ.id,
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
        setSuccessToast(`Question "${editingQ.id}" successfully updated in live bank!`);
        setTimeout(() => setSuccessToast(null), 4000);
      } else {
        alert(data.error || 'Failed to update question');
      }
    } catch (err: any) {
      alert('Error updating question');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLatex = (q: ExtendedQuestion) => {
    navigator.clipboard.writeText(q.stem);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, inspect, and manage verified quantitative aptitude practice questions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setViewMode('finder')}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all",
                viewMode === 'finder'
                  ? "bg-white dark:bg-slate-900 text-[#005CE6] dark:text-blue-400 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
              title="Mac Finder Split Preview Mode"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Finder Preview</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all",
                viewMode === 'table'
                  ? "bg-white dark:bg-slate-900 text-[#005CE6] dark:text-blue-400 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
              title="Classic Table Mode"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <Link
            href="/admin/seed"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-transform flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Questions</span>
          </Link>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Modern Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#111A2E] border border-blue-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 shadow-xs relative z-20">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stems, options, LaTeX formulas, or question IDs..."
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-blue-100 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div className="w-full md:w-60 shrink-0">
          <CustomDropdown
            value={topicFilter}
            onChange={(val) => setTopicFilter(String(val))}
            options={topicFilterOptions}
            triggerClassName="h-10 text-xs"
          />
        </div>

        <div className="w-full md:w-56 shrink-0">
          <CustomDropdown
            value={difficultyFilter}
            onChange={(val) => setDifficultyFilter(String(val))}
            options={difficultyFilterOptions}
            triggerClassName="h-10 text-xs"
          />
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-8 text-center text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2 bg-blue-50/50 dark:bg-blue-950/20 rounded-3xl border border-blue-100 dark:border-blue-900">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
          <span>Synchronizing live question bank from database...</span>
        </div>
      )}

      {/* VIEW 1: MAC FINDER SPLIT PREVIEW MODE */}
      {viewMode === 'finder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left / Middle Pane: The Question Browser List (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#111A2E] border border-blue-100 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col h-[760px]">
            {/* Finder List Header */}
            <div className="p-3.5 px-5 bg-slate-50/90 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {filtered.length} {filtered.length === 1 ? 'Question' : 'Questions'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Click any row to inspect
              </span>
            </div>

            {/* Scrollable Questions Column */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No questions match your current filters.
                </div>
              ) : (
                filtered.map((q, idx) => {
                  const isSelected = selectedQuestion?.id === q.id;
                  return (
                    <div
                      key={q.id}
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={cn(
                        "p-4 transition-all cursor-pointer relative group text-left select-none",
                        isSelected
                          ? "bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-l-[#005CE6] ring-inset"
                          : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40 border-l-4 border-l-transparent"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "font-mono font-bold text-[11px] px-2 py-0.5 rounded-md",
                            isSelected
                              ? "bg-[#005CE6] text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          )}>
                            #{idx + 1}
                          </span>
                          <span className="font-semibold text-[11px] text-slate-600 dark:text-slate-400 capitalize">
                            {q.topic_id.replace(/-/g, ' ')}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          Lvl {q.difficulty_assigned}
                        </span>
                      </div>

                      {/* Snippet */}
                      <div className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed font-medium">
                        <MathRenderer content={q.stem} />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                        <span className="truncate max-w-[160px]">{q.id}</span>
                        {q.correct_option && (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase font-sans">
                            Key: {q.correct_option.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: Mac Finder Quick Look / Inspector (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#111A2E] border border-blue-100 dark:border-slate-800 shadow-md overflow-hidden sticky top-20 h-[760px] flex flex-col">
            {selectedQuestion ? (
              <>
                {/* Mac Finder Window Header Bar with Traffic Light Dots */}
                <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    {/* Traffic Light Dots */}
                    <div className="flex items-center gap-1.5 mr-2">
                      <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/50 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/50 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/50 inline-block" />
                    </div>

                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
                      {selectedQuestion.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Live Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLatex(selectedQuestion)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                      title="Copy LaTeX stem to clipboard"
                    >
                      {copiedId === selectedQuestion.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy LaTeX</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleStartEdit(selectedQuestion)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-[#005CE6] hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Question</span>
                    </button>
                  </div>
                </div>

                {/* Inspector Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                  {/* Metadata Chips */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#005CE6] dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 capitalize">
                      {selectedQuestion.topic_id.replace(/-/g, ' ')}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold border border-slate-200 dark:border-slate-700">
                      Difficulty Level {selectedQuestion.difficulty_assigned} / 5
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                      {selectedQuestion.options?.length || 5} Options
                    </span>
                  </div>

                  {/* Question Stem Canvas */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Question Stem (Mathematical Rendering)
                    </span>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                      <MathRenderer content={selectedQuestion.stem} />
                    </div>
                  </div>

                  {/* Answer Options Grid */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Answer Options
                    </span>
                    <div className="space-y-2">
                      {selectedQuestion.options?.map((opt) => {
                        const isCorrect = opt.id.toLowerCase() === selectedQuestion.correct_option?.toLowerCase();
                        return (
                          <div
                            key={opt.id}
                            className={cn(
                              "p-3 rounded-xl border flex items-center justify-between transition-all text-xs",
                              isCorrect
                                ? "border-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 font-semibold shadow-2xs"
                                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={cn(
                                  "w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs uppercase shrink-0",
                                  isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                )}
                              >
                                {opt.id}
                              </span>
                              <div className="leading-snug">
                                <MathRenderer content={opt.text} />
                              </div>
                            </div>

                            {isCorrect && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 flex items-center gap-1 border border-emerald-300 shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" /> Correct Key
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step-by-Step Derivation */}
                  {selectedQuestion.solution && (
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#005CE6] dark:text-blue-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Step-by-Step Mathematical Derivation</span>
                      </div>
                      <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                        <MathRenderer content={selectedQuestion.solution} />
                      </div>
                    </div>
                  )}

                  {/* Speed Shortcut */}
                  {selectedQuestion.shortcut && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900 text-amber-950 dark:text-amber-200 space-y-1 text-xs leading-relaxed">
                      <div className="font-bold text-amber-900 dark:text-amber-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>Exam Speed Shortcut (15–20s Trick)</span>
                      </div>
                      <p>{selectedQuestion.shortcut}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400 my-auto">
                Select a question from the list to preview details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: CLASSIC TABLE MODE */}
      {viewMode === 'table' && (
        <div className="rounded-3xl bg-white dark:bg-[#111A2E] border border-blue-100 dark:border-slate-800 overflow-hidden shadow-xs relative z-10">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-blue-100 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-3.5 pl-5">Question Stem &amp; Details</th>
                <th className="p-3.5">Topic</th>
                <th className="p-3.5">Difficulty</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50 dark:divide-slate-800">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 pl-5 max-w-xl">
                    <div className="font-semibold text-slate-900 dark:text-white space-y-1">
                      <MathRenderer content={q.stem} />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2 font-mono">
                      <span>{q.options?.length || 5} Options</span>
                      <span>•</span>
                      <span>{q.id}</span>
                      {q.correct_option && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase font-sans">
                            Key: Option {q.correct_option.toUpperCase()}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 capitalize text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                    {q.topic_id.replace(/-/g, ' ')}
                  </td>
                  <td className="p-3.5 font-mono whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900 text-[11px] font-bold">
                      Lvl {q.difficulty_assigned}
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => handleStartEdit(q)}
                      className="p-1.5 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-800 text-blue-600 transition-colors cursor-pointer"
                      title="Edit Question"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedQuestionId(q.id);
                        setViewMode('finder');
                      }}
                      className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      title="Inspect Question"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingQ && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-white dark:bg-[#111A2E] rounded-3xl border border-blue-100 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#005CE6]" />
                <span>Edit Practice Question: <span className="font-mono text-[#005CE6]">{editingQ.id}</span></span>
              </div>
              <button
                type="button"
                onClick={() => setEditingQ(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Question Stem (LaTeX supported)</label>
                <textarea
                  rows={3}
                  value={editStem}
                  onChange={(e) => setEditStem(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Topic</label>
                  <CustomDropdown
                    value={editTopic}
                    onChange={(val) => setEditTopic(String(val))}
                    options={editTopicOptions}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Difficulty Level</label>
                  <CustomDropdown
                    value={editDifficulty}
                    onChange={(val) => setEditDifficulty(Number(val))}
                    options={difficultyOptions}
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">Answer Options &amp; Correct Key</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500 w-4">A:</span>
                    <input
                      value={editOptA}
                      onChange={(e) => setEditOptA(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500 w-4">B:</span>
                    <input
                      value={editOptB}
                      onChange={(e) => setEditOptB(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500 w-4">C:</span>
                    <input
                      value={editOptC}
                      onChange={(e) => setEditOptC(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500 w-4">D:</span>
                    <input
                      value={editOptD}
                      onChange={(e) => setEditOptD(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <span className="font-mono font-bold text-slate-500 w-4">E:</span>
                    <input
                      value={editOptE}
                      onChange={(e) => setEditOptE(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Correct Answer Option Key</label>
                  <div className="flex gap-2">
                    {['a', 'b', 'c', 'd', 'e'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setEditCorrectKey(opt)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg font-bold font-mono uppercase text-xs cursor-pointer transition-all",
                          editCorrectKey === opt
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        )}
                      >
                        Option {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Step-by-step Solution</label>
                <textarea
                  rows={2}
                  value={editSolution}
                  onChange={(e) => setEditSolution(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Speed Shortcut Tip</label>
                <input
                  value={editShortcut}
                  onChange={(e) => setEditShortcut(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingQ(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#005CE6] hover:bg-blue-700 text-white font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
