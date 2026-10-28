'use client';

import React, { useState } from 'react';
import { INITIAL_TOPICS, globalStore } from '@/lib/store';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import { MathRenderer } from '@/lib/math-renderer';
import {
  Sparkles,
  CheckCircle2,
  Zap,
  Loader2,
  Lightbulb,
  BookOpen,
} from 'lucide-react';

export default function GenerationControlCentrePage() {
  const [jobs, setJobs] = useState<any[]>(globalStore.getJobs());
  const [topicId, setTopicId] = useState<string>('quadratic-equations');
  const [difficulty, setDifficulty] = useState<number>(3);
  const [count, setCount] = useState<number>(5);
  const [method, setMethod] = useState<'template' | 'llm_twist'>('llm_twist');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const topicOptions = INITIAL_TOPICS.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const difficultyOptions = [
    { value: 1, label: 'Level 1 - Easy' },
    { value: 2, label: 'Level 2 - Moderate-Easy' },
    { value: 3, label: 'Level 3 - Moderate' },
    { value: 4, label: 'Level 4 - Hard' },
    { value: 5, label: 'Level 5 - Advanced (Mains)' },
  ];

  const methodOptions = [
    { value: 'llm_twist', label: 'AI Smart Creative Twist' },
    { value: 'template', label: 'Standard Exam Formula' },
  ];

  const handleLaunchJob = async () => {
    setIsSubmitting(true);
    setGeneratedQuestions([]);
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
        if (data.generated_questions && Array.isArray(data.generated_questions)) {
          setGeneratedQuestions(data.generated_questions);
        } else if (data.generated_question) {
          setGeneratedQuestions([data.generated_question]);
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
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-xs space-y-5 relative z-20">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <span>Generate New Practice Questions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs relative z-30">
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Subject Topic</label>
            <CustomDropdown
              value={topicId}
              onChange={(val) => setTopicId(String(val))}
              options={topicOptions}
              placeholder="Select Topic"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Difficulty Level</label>
            <CustomDropdown
              value={difficulty}
              onChange={(val) => setDifficulty(Number(val))}
              options={difficultyOptions}
              placeholder="Select Difficulty"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Generation Style</label>
            <CustomDropdown
              value={method}
              onChange={(val) => setMethod(val as any)}
              options={methodOptions}
              placeholder="Select Style"
            />
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

        {/* Live Generated Questions Preview */}
        {generatedQuestions.length > 0 && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Successfully Created {generatedQuestions.length} Practice {generatedQuestions.length === 1 ? 'Question' : 'Questions'} &amp; Added to Live Question Bank!
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300 shrink-0">
                Level {difficulty} · All Verified
              </span>
            </div>

            <div className="space-y-4">
              {generatedQuestions.map((q: any, qIdx: number) => (
                <div
                  key={q.id || `gen-${qIdx}`}
                  className="p-5 bg-white rounded-2xl border border-emerald-200 text-xs text-slate-800 shadow-xs space-y-3.5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        Question {qIdx + 1} of {generatedQuestions.length}
                      </span>
                      <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {q.id}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 capitalize bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      {q.topic_id?.replace(/-/g, ' ')}
                    </span>
                  </div>

                  {/* Question Stem with MathRenderer */}
                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 font-medium text-slate-900 leading-relaxed">
                    <MathRenderer content={q.stem} />
                  </div>

                  {/* 5 Options Grid with MathRenderer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options?.map((opt: any) => {
                      const isCorrect = String(opt.id).toLowerCase() === String(q.correct_option).toLowerCase();
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-colors ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] uppercase font-bold shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 border border-slate-300 text-slate-700'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <div className="flex-1">
                            <MathRenderer content={opt.text} />
                          </div>
                          {isCorrect && (
                            <span className="ml-auto text-[9px] uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                              Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step-by-Step Solution with MathRenderer */}
                  {q.solution && (
                    <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-[11.5px] leading-relaxed text-slate-800 space-y-1">
                      <div className="font-bold text-blue-900 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Step-by-Step Solution:</span>
                      </div>
                      <MathRenderer content={q.solution} />
                    </div>
                  )}

                  {/* Speed Shortcut with MathRenderer */}
                  {q.shortcut && (
                    <div className="text-[11px] text-emerald-900 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 leading-relaxed flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="flex-1">
                        <strong className="mr-1 text-emerald-950">Speed Shortcut:</strong>
                        <MathRenderer content={q.shortcut} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Generation History */}
      <div className="rounded-3xl bg-white border border-blue-100 overflow-hidden shadow-xs relative z-10">
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
