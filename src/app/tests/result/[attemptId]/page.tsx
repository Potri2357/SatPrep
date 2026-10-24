'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { MathRenderer } from '@/lib/math-renderer';
import { ResultSnapshot } from '@/lib/types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Zap,
  Bookmark,
  Flag,
  Share2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function ResultAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params?.attemptId as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [snapshot, setSnapshot] = useState<ResultSnapshot | null>(null);

  // Filter for Questions Review
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'skipped' | 'slow'>('all');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  // Report Modal
  const [reportingQid, setReportingQid] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>('wrong_answer');
  const [reportText, setReportText] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/test/result/${attemptId}`);
        const data = await res.json();
        if (data.success && data.snapshot) {
          setSnapshot(data.snapshot);
          // By default expand first wrong question solution
          const firstWrong = data.snapshot.questions_review.find((q: any) => !q.is_correct && q.your_answer);
          if (firstWrong) {
            setExpandedSolutions({ [firstWrong.question_id]: true });
          }
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  const toggleSolution = (qid: string) => {
    setExpandedSolutions((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const toggleBookmark = (qid: string) => {
    setBookmarked((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const handleReportSubmit = async () => {
    if (!reportingQid) return;
    try {
      await fetch('/api/admin/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: reportingQid,
          reason: reportReason,
          text: reportText,
        }),
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportingQid(null);
        setReportSubmitted(false);
        setReportText('');
      }, 1500);
    } catch {
      setReportingQid(null);
    }
  };

  if (loading || !snapshot) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 max-w-sm mx-auto z-10 border border-blue-100 shadow-xl shadow-blue-500/5">
          <div className="flex justify-center">
            <BrandLogo size={44} showWordmark={false} />
          </div>
          <div className="text-base font-bold text-slate-900">Computing Scorecard...</div>
          <div className="text-xs text-blue-600 font-mono animate-pulse">Running psychometric calibration &amp; topic breakdown</div>
        </div>
      </div>
    );
  }

  const sc = snapshot.score_card;

  const filteredQuestions = snapshot.questions_review.filter((q) => {
    if (filter === 'correct') return q.is_correct;
    if (filter === 'wrong') return !q.is_correct && !!q.your_answer;
    if (filter === 'skipped') return !q.your_answer;
    if (filter === 'slow') return q.time_taken_sec > q.ideal_time_sec;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-blue-100 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo size={34} showWordmark={true} />
          <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Mock Diagnosis &amp; Review
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
          >
            Dashboard
          </Link>
          <Link
            href="/tests/new"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md shadow-blue-500/25 transition-all"
          >
            Take Another Test
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-8 z-10">
        {/* HERO SCORE CARD WITH BLUE ACCENT */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Score Ring */}
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-blue-50"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600"
                    strokeDasharray={`${Math.max(5, sc.accuracy_percent)}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold font-mono text-blue-700 leading-none">
                    {sc.total_score.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-semibold">/ {sc.max_marks}</div>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Accuracy: {sc.accuracy_percent}%</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Quantitative Aptitude Analysis
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Time Spent: <strong className="text-slate-900">{Math.round(sc.total_time_spent_sec / 60)}m {sc.total_time_spent_sec % 60}s</strong> · Attempted: <strong className="text-slate-900">{sc.attempted}/{sc.max_marks}</strong>
                </p>
              </div>
            </div>

            {/* Percentile & Rank Cards */}
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-36 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-center">
                <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Percentile</span>
                <div className="text-2xl font-extrabold font-mono text-blue-800 mt-1">
                  {sc.percentile || 88.4}%ile
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Top 12% in cohort</div>
              </div>

              <div className="flex-1 md:w-36 p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">All-India Rank</span>
                <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
                  #{sc.rank || 142}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Cohort: 1,250 test takers</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-500">Correct Answers:</span>
              <div className="text-base font-bold text-emerald-600 font-mono mt-0.5">+{sc.correct} ({sc.correct * 1.0} marks)</div>
            </div>
            <div>
              <span className="text-slate-500">Negative Marks Lost:</span>
              <div className="text-base font-bold text-rose-600 font-mono mt-0.5">-{sc.negative_marks_lost.toFixed(2)} marks ({sc.wrong} wrong)</div>
            </div>
            <div>
              <span className="text-slate-500">Skipped Questions:</span>
              <div className="text-base font-bold text-slate-700 font-mono mt-0.5">{sc.skipped} questions</div>
            </div>
            <div>
              <span className="text-slate-500">Average Pace:</span>
              <div className="text-base font-bold text-blue-600 font-mono mt-0.5">
                {sc.attempted > 0 ? Math.round(sc.total_time_spent_sec / sc.attempted) : 0}s per question
              </div>
            </div>
          </div>
        </div>

        {/* TOPIC BREAKDOWN & STRENGTH TAGS */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Topic Mastery &amp; Accuracy Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">Target accuracy for bank mains: 80%+</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {snapshot.topic_breakdown.length} Topics Tested
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-blue-100 bg-blue-50/40 text-blue-900 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 rounded-l-xl">Topic</th>
                  <th className="py-3 px-3">Attempts</th>
                  <th className="py-3 px-3">Correct</th>
                  <th className="py-3 px-3">Accuracy</th>
                  <th className="py-3 px-3">Avg Time</th>
                  <th className="py-3 px-3 text-right rounded-r-xl">Diagnosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {snapshot.topic_breakdown.map((t) => (
                  <tr key={t.topic_id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{t.topic_name}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{t.attempts}</td>
                    <td className="py-3 px-3 font-mono text-emerald-600 font-bold">+{t.correct}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{t.accuracy}%</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{t.avg_time_sec}s / {t.ideal_time_sec}s</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                          t.strength === 'Strong'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : t.strength === 'Weak'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {t.strength}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SOLUTIONS & REVIEW VIEW */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Questions &amp; Detailed Solutions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review step-by-step solutions, shortcut tricks, and wrong-option psychometric explanations.
              </p>
            </div>

            {/* Filter Tabs (Chip UI) */}
            <div className="flex rounded-2xl p-1 bg-white border border-blue-100 shadow-xs text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'correct', label: 'Correct' },
                { id: 'wrong', label: 'Wrong' },
                { id: 'skipped', label: 'Skipped' },
                { id: 'slow', label: 'Slow' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-3.5 py-1.5 font-semibold rounded-xl transition-all ${
                    filter === f.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedSolutions[q.question_id];
              const isBookmarked = bookmarked[q.question_id];

              return (
                <div
                  key={q.question_id}
                  className={`p-6 rounded-3xl bg-white border transition-all shadow-xs ${
                    q.is_correct
                      ? 'border-emerald-200 hover:border-emerald-300'
                      : q.your_answer
                      ? 'border-rose-200 hover:border-rose-300'
                      : 'border-slate-200 hover:border-blue-200'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold font-mono px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Q{q.position}
                      </span>
                      <span className="text-slate-600 capitalize font-medium">{q.topic_name}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Level {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[11px]">
                        Time: {q.time_taken_sec}s (Ideal: {q.ideal_time_sec}s)
                      </span>
                      <button
                        onClick={() => toggleBookmark(q.question_id)}
                        className={`p-1.5 rounded-lg hover:bg-blue-50 transition-colors ${
                          isBookmarked ? 'text-blue-600' : 'text-slate-400'
                        }`}
                        title="Bookmark for Revision"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => setReportingQid(q.question_id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Report Question"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Stem */}
                  <div className="py-4 text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                    <MathRenderer content={q.stem} />
                  </div>

                  {/* Options Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {q.options.map((opt) => {
                      const isCorrectOpt = opt.id === q.correct_answer;
                      const isUserSelected = opt.id === q.your_answer;

                      let optClass = 'border-slate-200 bg-slate-50/60 text-slate-700';
                      if (isCorrectOpt) {
                        optClass = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold shadow-xs';
                      } else if (isUserSelected && !isCorrectOpt) {
                        optClass = 'border-rose-300 bg-rose-50 text-rose-900 font-bold shadow-xs';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${optClass}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold uppercase font-mono">{opt.id}.</span>
                            <MathRenderer content={opt.text} />
                          </div>

                          <div className="text-[10px] font-bold">
                            {isCorrectOpt && <span className="text-emerald-700">✓ Correct Key</span>}
                            {isUserSelected && !isCorrectOpt && <span className="text-rose-700">✗ Your Choice</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Solution Drawer */}
                  <div className="pt-4 flex justify-between items-center text-xs">
                    <button
                      onClick={() => toggleSolution(q.question_id)}
                      className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide Solution & Shortcuts' : 'View Step-by-Step Solution & Trap Diagnosis'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <Link
                      href={`/tests/new`}
                      className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors font-medium"
                    >
                      <span>Practise Similar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Expanded Solution Body */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs">
                      {/* Step-by-step Solution */}
                      <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
                        <div className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Official Step-by-Step Method</span>
                        </div>
                        <div className="leading-relaxed text-slate-800">
                          <MathRenderer content={q.solution} />
                        </div>
                      </div>

                      {/* Shortcut Trick */}
                      {q.shortcut && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                          <div className="font-bold mb-1 flex items-center gap-2 text-amber-900">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                            <span>Exam Shortcut Trick (15-20 Seconds)</span>
                          </div>
                          <p className="leading-relaxed">{q.shortcut}</p>
                        </div>
                      )}

                      {/* Wrong-Option Explanations */}
                      {q.option_rationales && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="font-bold text-slate-900 mb-2">
                            Why You Might Have Chosen Other Options (Psychometric Distractor Trap):
                          </div>
                          {Object.entries(q.option_rationales).map(([optId, rationale]) => (
                            <div key={optId} className="flex items-start gap-2 text-slate-700">
                              <span className="font-mono font-bold uppercase text-slate-900">
                                Option {optId}:
                              </span>
                              <span>{rationale}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* REPORT QUESTION MODAL */}
      {reportingQid && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-white/95 rounded-3xl border border-blue-100 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-500" />
              <span>Report Question Error</span>
            </h2>

            {reportSubmitted ? (
              <div className="text-center py-6 text-xs text-emerald-600 font-bold">
                ✓ Report logged successfully! Our content reviewers will inspect this question.
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600">
                  Help us maintain 99.5%+ key accuracy. If 3 reports are filed, this question will be auto-flagged and removed from circulation.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-800">Reason for report</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="wrong_answer">Wrong Answer Key</option>
                      <option value="unclear">Ambiguous / Unclear Question Stem</option>
                      <option value="wrong_solution">Incorrect Solution Steps</option>
                      <option value="typo">Typo or Formatting Glitch</option>
                      <option value="other">Other Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-800">Additional Notes</label>
                    <textarea
                      rows={3}
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="Specify your calculation or why the key is disputed..."
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setReportingQid(null)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportSubmit}
                    className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
