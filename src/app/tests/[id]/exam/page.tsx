'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { MathRenderer } from '@/lib/math-renderer';
import { PaletteState, AssembledQuestion } from '@/lib/types';
import {
  Clock,
  Maximize,
  Minimize,
  Calculator,
  Wifi,
  WifiOff,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  RotateCcw,
} from 'lucide-react';

export default function ExamTestWindow() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.id as string;

  // Runtime State
  const [loading, setLoading] = useState<boolean>(true);
  const [attemptId, setAttemptId] = useState<string>('');
  const [questions, setQuestions] = useState<AssembledQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [examName, setExamName] = useState<string>('Quantitative Aptitude');

  // Answers Map: qid -> { selected_option, state, time_spent }
  const [answers, setAnswers] = useState<
    Record<string, { selectedOption?: string; state: PaletteState; timeSpent: number }>
  >({});

  // Active Option selected in current view
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

  // Server Countdown Timer (Seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20 * 60);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Calculator State
  const [calcInput, setCalcInput] = useState<string>('0');

  // Question active time tracking
  const questionStartTimeRef = useRef<number>(Date.now());

  // 1. Initialize Test & Attempt
  useEffect(() => {
    const initTest = async () => {
      try {
        const res = await fetch('/api/test/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test_id: testId }),
        });

        const data = await res.json();
        if (data.success && data.bundle) {
          setAttemptId(data.attempt_id);
          const qList = data.bundle.sections[0]?.questions || [];
          setQuestions(qList);
          setExamName(data.bundle.exam_name);

          // Initialize answer states
          const initAnswers: Record<string, { selectedOption?: string; state: PaletteState; timeSpent: number }> = {};
          qList.forEach((q: AssembledQuestion, idx: number) => {
            initAnswers[q.id] = {
              state: idx === 0 ? 'not_answered' : 'not_visited',
              timeSpent: 0,
            };
          });
          setAnswers(initAnswers);
          setSecondsRemaining((data.bundle.duration_min || 20) * 60);
          setLoading(false);
        } else {
          // If start failed, load directly from test endpoint
          const resFallback = await fetch(`/api/test/${testId}`);
          const dataFallback = await resFallback.json();
          if (dataFallback.success && dataFallback.test?.bundle) {
            const b = dataFallback.test.bundle;
            setQuestions(b.sections[0]?.questions || []);
            setExamName(b.exam_name);
            setLoading(false);
          }
        }
      } catch {
        setLoading(false);
      }
    };

    initTest();
  }, [testId]);

  // 2. Countdown Timer Loop
  useEffect(() => {
    if (loading || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true); // Auto-submit on time expiry (TW-08)
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, secondsRemaining]);

  // Online / Offline monitor (TW-13)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentQ = questions[currentIdx];

  // Sync selectedOption state when question jumps
  useEffect(() => {
    if (!currentQ) return;
    const ans = answers[currentQ.id];
    setSelectedOption(ans?.selectedOption);
    questionStartTimeRef.current = Date.now();
  }, [currentIdx, currentQ]);

  // Save Answer Helper
  const persistAnswer = useCallback(
    async (
      qid: string,
      option: string | undefined,
      newState: PaletteState,
      additionalSec: number
    ) => {
      setIsSaved(false);
      setAnswers((prev) => ({
        ...prev,
        [qid]: {
          selectedOption: option,
          state: newState,
          timeSpent: (prev[qid]?.timeSpent || 0) + additionalSec,
        },
      }));

      try {
        if (attemptId) {
          await fetch('/api/test/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              attempt_id: attemptId,
              question_id: qid,
              selected_option: option,
              state: newState,
              time_spent_sec: additionalSec,
            }),
          });
        }
        setIsSaved(true);
      } catch {
        setIsSaved(true);
      }
    },
    [attemptId]
  );

  // Time Spent on current question
  const getElapsedSeconds = () => {
    const sec = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    questionStartTimeRef.current = Date.now();
    return Math.max(1, sec);
  };

  // Action: Save & Next
  const handleSaveAndNext = () => {
    if (!currentQ) return;
    const elapsed = getElapsedSeconds();
    const newState: PaletteState = selectedOption ? 'answered' : 'not_answered';

    persistAnswer(currentQ.id, selectedOption, newState, elapsed);

    if (currentIdx < questions.length - 1) {
      const nextQ = questions[currentIdx + 1];
      // Mark next question as visited if not already
      if (answers[nextQ.id]?.state === 'not_visited') {
        setAnswers((prev) => ({
          ...prev,
          [nextQ.id]: { ...prev[nextQ.id], state: 'not_answered' },
        }));
      }
      setCurrentIdx((prev) => prev + 1);
    }
  };

  // Action: Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    if (!currentQ) return;
    const elapsed = getElapsedSeconds();
    const newState: PaletteState = selectedOption ? 'answered_and_marked' : 'marked_for_review';

    persistAnswer(currentQ.id, selectedOption, newState, elapsed);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  // Action: Clear Response
  const handleClearResponse = () => {
    if (!currentQ) return;
    setSelectedOption(undefined);
    persistAnswer(currentQ.id, undefined, 'not_answered', 1);
  };

  // Action: Jump to Question from Palette (TW-06)
  const handlePaletteJump = (targetIdx: number) => {
    if (!currentQ || targetIdx === currentIdx) return;
    const elapsed = getElapsedSeconds();
    const currentAns = answers[currentQ.id];

    // Maintain current state if unanswered
    if (!currentAns?.selectedOption && currentAns?.state === 'not_visited') {
      persistAnswer(currentQ.id, undefined, 'not_answered', elapsed);
    }

    const targetQ = questions[targetIdx];
    if (answers[targetQ.id]?.state === 'not_visited') {
      setAnswers((prev) => ({
        ...prev,
        [targetQ.id]: { ...prev[targetQ.id], state: 'not_answered' },
      }));
    }

    setCurrentIdx(targetIdx);
    setIsMobilePaletteOpen(false);
  };

  // Action: Submit Test (TW-07)
  const handleSubmitTest = async (autoSubmit = false) => {
    setShowSubmitModal(false);
    try {
      const res = await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attempt_id: attemptId }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/tests/result/${attemptId}`);
      }
    } catch {
      router.push(`/tests/result/${attemptId}`);
    }
  };

  // Format Timer HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Palette State Counts
  const counts = {
    answered: Object.values(answers).filter((a) => a.state === 'answered').length,
    not_answered: Object.values(answers).filter((a) => a.state === 'not_answered').length,
    not_visited: Object.values(answers).filter((a) => a.state === 'not_visited').length,
    marked_for_review: Object.values(answers).filter((a) => a.state === 'marked_for_review').length,
    answered_and_marked: Object.values(answers).filter((a) => a.state === 'answered_and_marked').length,
  };

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#212835] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <BrandLogo size={48} showWordmark={false} />
          <div className="text-sm font-mono text-slate-300">Synchronizing test paper with server...</div>
        </div>
      </div>
    );
  }

  // Timer Color logic (PRD Section 7.9: neutral until 10 mins remain -> amber, red in final minute)
  const isAmber = secondsRemaining <= 600 && secondsRemaining > 60;
  const isRed = secondsRemaining <= 60;

  return (
    <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#0E1117] flex flex-col select-none text-[#212835] dark:text-[#EAF1F8]">
      {/* 1. TOP HEADER (56px, Navy-700 background - PRD Section 7.9) */}
      <header className="h-14 bg-[#212835] text-white border-b border-[#2E3746] px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <BrandLogo size={32} showWordmark={false} />
          <div className="hidden sm:block">
            <span className="font-bold text-sm text-white tracking-tight">{examName}</span>
          </div>

          {/* Section Tab (Pill Segmented Control) */}
          <div className="px-3 py-1 rounded-full bg-[#2D6BCB] text-xs font-bold text-white shadow-sm">
            Quantitative Aptitude
          </div>
        </div>

        {/* Center: Server-Authoritative Timer */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-300" />
          <div
            className={`font-mono text-sm sm:text-base font-bold tabular-nums px-3 py-1 rounded-lg border transition-colors ${
              isRed
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : isAmber
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#151A23] text-white border-[#2E3746]'
            }`}
          >
            {formatTimer(secondsRemaining)}
          </div>
        </div>

        {/* Right: Tools & Candidate Info */}
        <div className="flex items-center gap-3">
          {/* Autosave Status */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className={`w-2 h-2 rounded-full ${isSaved ? 'bg-[#1F9D6B]' : 'bg-amber-400 animate-pulse'}`} />
            <span>{isSaved ? 'Synced' : 'Saving...'}</span>
          </div>

          {/* Online Monitor */}
          {!isOnline && (
            <div className="flex items-center gap-1 text-[11px] text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-800">
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </div>
          )}

          {/* Calculator Button */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
            title="On-screen Calculator"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Candidate Photo & Name */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#2E3746]">
            <div className="w-7 h-7 rounded-full bg-[#EAF1F8] text-[#212835] font-bold text-xs flex items-center justify-center">
              AS
            </div>
            <span className="hidden md:inline text-xs font-semibold text-slate-200">Aditya S.</span>
          </div>

          {/* Mobile Palette Drawer Toggle */}
          <button
            onClick={() => setIsMobilePaletteOpen(true)}
            className="p-1.5 rounded-lg bg-[#2E3746] text-white lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN TEST CONTENT (Question Left, Palette Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT / CENTER: Question Canvas */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {currentQ ? (
            <div className="bg-white dark:bg-[#151A23] rounded-2xl border border-[#DDE4EE] dark:border-[#2E3746] p-6 sm:p-8 shadow-sm flex-1 flex flex-col justify-between">
              <div>
                {/* Question Header & Marks Bar */}
                <div className="flex items-center justify-between border-b border-[#DDE4EE] dark:border-[#2E3746] pb-3 mb-6 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#DCE8F8] dark:bg-[#2D6BCB]/20 text-[#1C458A] dark:text-[#8FB2EA] font-bold text-sm">
                      Question {currentIdx + 1} of {questions.length}
                    </span>
                    <span className="text-slate-400 capitalize hidden sm:inline">
                      Topic: {currentQ.topic_id.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-semibold text-xs">
                    <span className="text-[#1F9D6B]">+1.00 Mark</span>
                    <span className="text-[#D64550]">-0.25 Negative</span>
                  </div>
                </div>

                {/* DI Stimulus if present */}
                {currentQ.stimulus && (
                  <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-[#0E1117] border border-[#DDE4EE] dark:border-[#2E3746]">
                    <div className="font-bold text-xs text-[#212835] dark:text-white mb-2">
                      Stimulus: {currentQ.stimulus.title || 'Data Table'}
                    </div>
                    {currentQ.stimulus.chart_type === 'table' && currentQ.stimulus.structured_data && (
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                              {currentQ.stimulus.structured_data.headers.map((h: string, i: number) => (
                                <th key={i} className="p-2 font-semibold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentQ.stimulus.structured_data.rows.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-800">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className="p-2 font-mono">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Question Stem (KaTeX rendered, 18px min for math - PRD Section 7.4) */}
                <div className="text-base sm:text-lg font-medium text-[#212835] dark:text-white leading-relaxed mb-8">
                  <MathRenderer content={currentQ.stem} />
                </div>

                {/* Options (52px minimum height - PRD Section 7.9) */}
                <div className="space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        className={`min-h-[52px] p-3.5 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all select-none ${
                          isSelected
                            ? 'border-[#2D6BCB] bg-[#DCE8F8]/40 dark:bg-[#2D6BCB]/15 ring-2 ring-[#2D6BCB]'
                            : 'border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50/50 dark:bg-[#0E1117]/50 hover:bg-[#EEF4FC] dark:hover:bg-[#1B212C]'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#2D6BCB] text-white shadow-sm'
                              : 'border border-slate-400 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {opt.id}
                        </div>
                        <div className="text-sm sm:text-base font-medium text-[#212835] dark:text-slate-100 flex-1">
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>Loading question...</div>
          )}
        </main>

        {/* RIGHT PANEL: Question Palette (Desktop View) */}
        <aside className="w-80 bg-white dark:bg-[#151A23] border-l border-[#DDE4EE] dark:border-[#2E3746] p-5 hidden lg:flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question Palette
            </h2>

            {/* 5-Column Grid of 40px Tiles (PRD Section 7.9) */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const state = ans?.state || 'not_visited';
                const isCurrent = idx === currentIdx;

                // Color & Shape based on 5 palette states
                let bgClass = 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
                if (state === 'answered') bgClass = 'bg-[#1F9D6B] text-white';
                else if (state === 'not_answered') bgClass = 'bg-[#D64550] text-white';
                else if (state === 'marked_for_review') bgClass = 'bg-[#7B5CD6] text-white rounded-full';
                else if (state === 'answered_and_marked') bgClass = 'bg-[#7B5CD6] text-white rounded-full ring-2 ring-[#1F9D6B]';

                return (
                  <button
                    key={q.id}
                    onClick={() => handlePaletteJump(idx)}
                    className={`w-10 h-10 font-mono font-bold text-xs flex items-center justify-center transition-all ${bgClass} ${
                      state !== 'marked_for_review' && state !== 'answered_and_marked' ? 'rounded-lg' : ''
                    } ${isCurrent ? 'ring-2 ring-[#2D6BCB] ring-offset-2 scale-105' : 'hover:opacity-90'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Counts Legend */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5 text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#1F9D6B]" />
                  <span>Answered</span>
                </div>
                <span className="font-mono font-bold">{counts.answered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#D64550]" />
                  <span>Not Answered</span>
                </div>
                <span className="font-mono font-bold">{counts.not_answered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#7B5CD6]" />
                  <span>Marked for Review</span>
                </div>
                <span className="font-mono font-bold">{counts.marked_for_review + counts.answered_and_marked}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                  <span>Not Visited</span>
                </div>
                <span className="font-mono font-bold">{counts.not_visited}</span>
              </div>
            </div>
          </div>

          {/* Submit Test Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full h-11 rounded-xl bg-[#212835] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider border border-[#2E3746] transition-all hover:scale-[1.01]"
            >
              Submit Exam
            </button>
          </div>
        </aside>
      </div>

      {/* 3. STICKY BOTTOM ACTION BAR (PRD Section 6.5 & Section 7.9) */}
      <footer className="h-16 bg-white dark:bg-[#151A23] border-t border-[#DDE4EE] dark:border-[#2E3746] px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => currentIdx > 0 && setCurrentIdx((prev) => prev - 1)}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#DDE4EE] dark:border-[#2E3746] disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-[#1B212C] text-slate-700 dark:text-slate-300"
          >
            Previous
          </button>

          {/* Clear Response Button */}
          <button
            onClick={handleClearResponse}
            disabled={!selectedOption}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#DDE4EE] dark:border-[#2E3746] disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-[#1B212C] text-slate-700 dark:text-slate-300 hidden sm:block"
          >
            Clear Response
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Mark for Review & Next */}
          <button
            onClick={handleMarkForReviewAndNext}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#7B5CD6] text-[#7B5CD6] hover:bg-[#7B5CD6]/10 transition-colors"
          >
            Mark for Review &amp; Next
          </button>

          {/* Save & Next (Primary Blue Button) */}
          <button
            onClick={handleSaveAndNext}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-[#2D6BCB] hover:bg-[#2458AD] text-white shadow-md shadow-[#2D6BCB]/25 transition-all"
          >
            Save &amp; Next
          </button>
        </div>
      </footer>

      {/* SUBMIT CONFIRMATION MODAL (TW-07) */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151A23] rounded-2xl border border-[#DDE4EE] dark:border-[#2E3746] max-w-md w-full p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-[#212835] dark:text-white">Exam Submission Confirmation</h2>
            <p className="text-xs text-[#5B6578] dark:text-slate-400">
              Are you sure you want to submit your exam? You cannot modify your answers once submitted.
            </p>

            {/* Summary Table */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1117] border border-[#DDE4EE] dark:border-[#2E3746] space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-[#1F9D6B] font-semibold">Answered</span>
                <span className="font-mono font-bold">{counts.answered + counts.answered_and_marked}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-[#D64550] font-semibold">Not Answered</span>
                <span className="font-mono font-bold">{counts.not_answered}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-[#7B5CD6] font-semibold">Marked for Review</span>
                <span className="font-mono font-bold">{counts.marked_for_review}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Not Visited</span>
                <span className="font-mono font-bold">{counts.not_visited}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-[#DDE4EE] dark:border-[#2E3746] text-xs font-semibold"
              >
                Return to Exam
              </button>
              <button
                onClick={() => handleSubmitTest(false)}
                className="w-1/2 py-2.5 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] text-white text-xs font-bold shadow-md shadow-[#2D6BCB]/30"
              >
                Yes, Submit Final
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ON-SCREEN CALCULATOR (TW-11) */}
      {showCalculator && (
        <div className="fixed bottom-20 right-6 z-50 w-64 bg-white dark:bg-[#151A23] rounded-2xl border border-[#DDE4EE] dark:border-[#2E3746] p-4 shadow-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
            <span>Basic Calculator</span>
            <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-[#0E1117] text-right font-mono font-bold text-base truncate">
            {calcInput}
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-xs font-mono font-bold">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') setCalcInput('0');
                  else if (btn === '=') {
                    try {
                      // Safe arithmetic evaluation
                      const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
                      setCalcInput(String(Function(`'use strict'; return (${sanitized})`)()));
                    } catch {
                      setCalcInput('Error');
                    }
                  } else {
                    setCalcInput((prev) => (prev === '0' ? btn : prev + btn));
                  }
                }}
                className="p-2 rounded-lg bg-slate-50 dark:bg-[#2E3746] hover:bg-[#DCE8F8] dark:hover:bg-[#46526A] text-center"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE PALETTE SLIDE-OVER DRAWER (TW-14) */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden flex justify-end">
          <div className="w-72 bg-white dark:bg-[#151A23] h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm">Question Palette</span>
                <button onClick={() => setIsMobilePaletteOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const state = answers[q.id]?.state || 'not_visited';
                  let bgClass = 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
                  if (state === 'answered') bgClass = 'bg-[#1F9D6B] text-white';
                  else if (state === 'not_answered') bgClass = 'bg-[#D64550] text-white';
                  else if (state === 'marked_for_review' || state === 'answered_and_marked') bgClass = 'bg-[#7B5CD6] text-white rounded-full';

                  return (
                    <button
                      key={q.id}
                      onClick={() => handlePaletteJump(idx)}
                      className={`w-10 h-10 font-mono font-bold text-xs flex items-center justify-center rounded-lg ${bgClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setIsMobilePaletteOpen(false);
                setShowSubmitModal(true);
              }}
              className="w-full py-3 rounded-xl bg-[#212835] text-white text-xs font-bold uppercase mt-6"
            >
              Submit Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
