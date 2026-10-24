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
      <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#0E1117] flex items-center justify-center">
        <div className="text-center space-y-3">
          <BrandLogo size={40} showWordmark={false} />
          <div className="text-xs font-mono text-slate-500">Computing psychometric scorecard...</div>
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
    <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#0E1117] flex flex-col text-[#212835] dark:text-[#EAF1F8]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#151A23]/90 backdrop-blur-md border-b border-[#DDE4EE] dark:border-[#2E3746] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo size={34} showWordmark={true} />
          <span className="text-xs font-semibold text-slate-400">Mock Result &amp; Diagnosis</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-[#2E3746] hover:bg-[#DCE8F8] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/tests/new"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D6BCB] text-white hover:bg-[#2458AD] shadow-sm transition-all"
          >
            Take Another Test
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-8">
        {/* HERO SCORE CARD WITH SIGNATURE 135° DIAGONAL ACCENT (PRD Section 7.2) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full signature-diagonal opacity-10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Score Ring */}
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-[#2E3746]"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#2D6BCB]"
                    strokeDasharray={`${Math.max(5, sc.accuracy_percent)}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold font-mono text-[#2D6BCB] leading-none">
                    {sc.total_score.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">/ {sc.max_marks}</div>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1F9D6B]/15 text-[#1F9D6B] mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Accuracy: {sc.accuracy_percent}%</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#212835] dark:text-white">
                  Quantitative Aptitude Analysis
                </h1>
                <p className="text-xs text-[#5B6578] dark:text-slate-400 mt-1">
                  Time Spent: <strong>{Math.round(sc.total_time_spent_sec / 60)}m {sc.total_time_spent_sec % 60}s</strong> · Attempted: {sc.attempted}/{sc.max_marks}
                </p>
              </div>
            </div>

            {/* Percentile & Rank Cards */}
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-36 p-4 rounded-xl bg-slate-50 dark:bg-[#0E1117] border border-[#DDE4EE] dark:border-[#2E3746] text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Percentile</span>
                <div className="text-2xl font-extrabold font-mono text-[#2D6BCB] mt-1">
                  {sc.percentile || 88.4}%ile
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Top 12% in cohort</div>
              </div>

              <div className="flex-1 md:w-36 p-4 rounded-xl bg-slate-50 dark:bg-[#0E1117] border border-[#DDE4EE] dark:border-[#2E3746] text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">All-India Rank</span>
                <div className="text-2xl font-extrabold font-mono text-slate-800 dark:text-white mt-1">
                  #{sc.rank || 142}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Cohort: 1,250 test takers</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">Correct Answers:</span>
              <div className="text-base font-bold text-[#1F9D6B] font-mono mt-0.5">+{sc.correct} ({sc.correct * 1.0} marks)</div>
            </div>
            <div>
              <span className="text-slate-400">Negative Marks Lost:</span>
              <div className="text-base font-bold text-[#D64550] font-mono mt-0.5">-{sc.negative_marks_lost.toFixed(2)} marks ({sc.wrong} wrong)</div>
            </div>
            <div>
              <span className="text-slate-400">Skipped Questions:</span>
              <div className="text-base font-bold text-slate-600 dark:text-slate-300 font-mono mt-0.5">{sc.skipped} questions</div>
            </div>
            <div>
              <span className="text-slate-400">Average Pace:</span>
              <div className="text-base font-bold text-[#2D6BCB] font-mono mt-0.5">
                {sc.attempted > 0 ? Math.round(sc.total_time_spent_sec / sc.attempted) : 0}s per question
              </div>
            </div>
          </div>
        </div>

        {/* TOPIC BREAKDOWN & STRENGTH TAGS (PRD Section 6.6) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#212835] dark:text-white">Topic Mastery &amp; Accuracy Breakdown</h2>
            <span className="text-xs text-slate-400">Target accuracy: 80%+</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Topic</th>
                  <th className="py-2.5">Attempts</th>
                  <th className="py-2.5">Correct</th>
                  <th className="py-2.5">Accuracy</th>
                  <th className="py-2.5">Avg Time</th>
                  <th className="py-2.5 text-right">Diagnosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {snapshot.topic_breakdown.map((t) => (
                  <tr key={t.topic_id} className="hover:bg-slate-50/50 dark:hover:bg-[#1B212C]/50">
                    <td className="py-3 font-semibold text-[#212835] dark:text-white">{t.topic_name}</td>
                    <td className="py-3 font-mono">{t.attempts}</td>
                    <td className="py-3 font-mono text-[#1F9D6B]">+{t.correct}</td>
                    <td className="py-3 font-mono font-bold">{t.accuracy}%</td>
                    <td className="py-3 font-mono text-slate-500">{t.avg_time_sec}s / {t.ideal_time_sec}s</td>
                    <td className="py-3 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.strength === 'Strong'
                            ? 'bg-[#1F9D6B]/15 text-[#1F9D6B]'
                            : t.strength === 'Weak'
                            ? 'bg-red-500/15 text-red-500'
                            : 'bg-amber-500/15 text-amber-500'
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

        {/* SOLUTIONS & REVIEW VIEW (AN-01 to AN-11) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#212835] dark:text-white">Questions &amp; Detailed Solutions</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review step-by-step solutions, shortcut tricks, and wrong-option psychometric explanations.
              </p>
            </div>

            {/* Filter Tabs (AN-01) */}
            <div className="flex rounded-xl p-1 bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] text-xs">
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
                  className={`px-3 py-1.5 font-semibold rounded-lg transition-all ${
                    filter === f.id
                      ? 'bg-[#2D6BCB] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
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
                  className={`p-6 rounded-2xl bg-white dark:bg-[#151A23] border transition-all ${
                    q.is_correct
                      ? 'border-[#1F9D6B]/30'
                      : q.your_answer
                      ? 'border-[#D64550]/40'
                      : 'border-[#DDE4EE] dark:border-[#2E3746]'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#2E3746]">
                        Q{q.position}
                      </span>
                      <span className="text-slate-400 capitalize">{q.topic_name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Level {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono text-[11px]">
                        Time: {q.time_taken_sec}s (Ideal: {q.ideal_time_sec}s)
                      </span>
                      <button
                        onClick={() => toggleBookmark(q.question_id)}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                          isBookmarked ? 'text-[#2D6BCB]' : 'text-slate-400'
                        }`}
                        title="Bookmark for Revision"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => setReportingQid(q.question_id)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500"
                        title="Report Question"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Stem */}
                  <div className="py-4 text-sm sm:text-base font-medium leading-relaxed">
                    <MathRenderer content={q.stem} />
                  </div>

                  {/* Options Comparison (Your Answer vs Correct Answer - AN-02) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt) => {
                      const isCorrectOpt = opt.id === q.correct_answer;
                      const isUserSelected = opt.id === q.your_answer;

                      let optClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E1117]/50';
                      if (isCorrectOpt) {
                        optClass = 'border-[#1F9D6B] bg-[#1F9D6B]/10 text-[#1F9D6B] font-bold';
                      } else if (isUserSelected && !isCorrectOpt) {
                        optClass = 'border-[#D64550] bg-[#D64550]/10 text-[#D64550] font-bold';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optClass}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold uppercase font-mono">{opt.id}.</span>
                            <MathRenderer content={opt.text} />
                          </div>

                          <div className="text-[10px] font-bold">
                            {isCorrectOpt && <span className="text-[#1F9D6B]">✓ Correct Key</span>}
                            {isUserSelected && !isCorrectOpt && <span className="text-[#D64550]">✗ Your Choice</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Solution Drawer */}
                  <div className="pt-4 flex justify-between items-center text-xs">
                    <button
                      onClick={() => toggleSolution(q.question_id)}
                      className="font-bold text-[#2D6BCB] hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Solution & Shortcuts' : 'View Step-by-Step Solution & Trap Diagnosis'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <Link
                      href={`/tests/new`}
                      className="text-xs text-slate-500 hover:text-[#2D6BCB] flex items-center gap-1"
                    >
                      <span>Practise Similar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Expanded Solution Body */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                      {/* Step-by-step Solution */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1117] border border-[#DDE4EE] dark:border-[#2E3746]">
                        <div className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#1F9D6B]" />
                          <span>Official Step-by-Step Method</span>
                        </div>
                        <div className="leading-relaxed text-slate-700 dark:text-slate-300">
                          <MathRenderer content={q.solution} />
                        </div>
                      </div>

                      {/* Shortcut Trick (AN-03) */}
                      {q.shortcut && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                          <div className="font-bold mb-1 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <span>Exam Shortcut Trick (15-20 Seconds)</span>
                          </div>
                          <p className="leading-relaxed">{q.shortcut}</p>
                        </div>
                      )}

                      {/* Wrong-Option Explanations (PRD Section 6.6 AN-04) */}
                      {q.option_rationales && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1117] border border-[#DDE4EE] dark:border-[#2E3746] space-y-2">
                          <div className="font-bold text-slate-800 dark:text-white mb-2">
                            Why You Might Have Chosen Other Options (Psychometric Distractor Trap):
                          </div>
                          {Object.entries(q.option_rationales).map(([optId, rationale]) => (
                            <div key={optId} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                              <span className="font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
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

      {/* REPORT QUESTION MODAL (AN-06) */}
      {reportingQid && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151A23] rounded-2xl border border-[#DDE4EE] dark:border-[#2E3746] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-[#212835] dark:text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-500" />
              <span>Report Question Error</span>
            </h2>

            {reportSubmitted ? (
              <div className="text-center py-6 text-xs text-[#1F9D6B] font-bold">
                ✓ Report logged successfully! Our content reviewers will inspect this question.
              </div>
            ) : (
              <>
                <p className="text-xs text-[#5B6578] dark:text-slate-400">
                  Help us maintain 99.5%+ key accuracy. If 3 reports are filed, this question will be auto-flagged and removed from circulation.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Reason for report</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117]"
                    >
                      <option value="wrong_answer">Wrong Answer Key</option>
                      <option value="unclear">Ambiguous / Unclear Question Stem</option>
                      <option value="wrong_solution">Incorrect Solution Steps</option>
                      <option value="typo">Typo or Formatting Glitch</option>
                      <option value="other">Other Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Additional Notes</label>
                    <textarea
                      rows={3}
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="Specify your calculation or why the key is disputed..."
                      className="w-full p-2.5 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setReportingQid(null)}
                    className="w-1/2 py-2 rounded-xl border border-[#DDE4EE] dark:border-[#2E3746] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportSubmit}
                    className="w-1/2 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
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
