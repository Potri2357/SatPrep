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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 max-w-sm mx-auto z-10 border border-blue-100 shadow-xl shadow-blue-500/5">
          <div className="flex justify-center">
            <BrandLogo size={48} showWordmark={false} />
          </div>
          <div className="text-base font-bold text-slate-900">Synchronizing Exam Paper...</div>
          <div className="text-xs text-blue-600 font-mono animate-pulse">Loading question bank &amp; candidate session</div>
        </div>
      </div>
    );
  }

  // Timer Color logic (PRD Section 7.9: neutral until 10 mins remain -> amber, red in final minute)
  const isAmber = secondsRemaining <= 600 && secondsRemaining > 60;
  const isRed = secondsRemaining <= 60;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col select-none text-slate-800">
      {/* 1. TOP HEADER (Royal Blue Gradient with Ice White details) */}
      <header className="h-16 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white shadow-md border-b border-blue-500/30 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <BrandLogo size={34} showWordmark={false} />
          <div className="hidden sm:block">
            <span className="font-bold text-sm text-white tracking-tight">{examName}</span>
          </div>

          {/* Section Tab (Glass Pill Segmented Control) */}
          <div className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-bold text-white border border-white/30 backdrop-blur-md shadow-sm">
            Quantitative Aptitude
          </div>
        </div>

        {/* Center: Server-Authoritative Timer */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-100" />
          <div
            className={`font-mono text-sm sm:text-base font-bold tabular-nums px-4 py-1.5 rounded-xl border transition-all shadow-sm ${
              isRed
                ? 'bg-red-500 text-white border-red-400 animate-pulse'
                : isAmber
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-white text-blue-900 border-blue-200'
            }`}
          >
            {formatTimer(secondsRemaining)}
          </div>
        </div>

        {/* Right: Tools & Candidate Info */}
        <div className="flex items-center gap-3">
          {/* Autosave Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] text-white border border-white/20">
            <span className={`w-2 h-2 rounded-full ${isSaved ? 'bg-emerald-400' : 'bg-amber-300 animate-pulse'}`} />
            <span>{isSaved ? 'Synced' : 'Saving...'}</span>
          </div>

          {/* Online Monitor */}
          {!isOnline && (
            <div className="flex items-center gap-1 text-[11px] text-red-100 bg-red-600/80 px-2.5 py-1 rounded-full border border-red-400 shadow-sm">
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </div>
          )}

          {/* Calculator Button */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            title="On-screen Calculator"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Candidate Photo & Name */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/20">
            <div className="w-8 h-8 rounded-full bg-white text-blue-700 font-bold text-xs flex items-center justify-center shadow-sm">
              AS
            </div>
            <span className="hidden md:inline text-xs font-semibold text-white">Aditya S.</span>
          </div>

          {/* Mobile Palette Drawer Toggle */}
          <button
            onClick={() => setIsMobilePaletteOpen(true)}
            className="p-2 rounded-xl bg-white/20 text-white border border-white/30 lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN TEST CONTENT (Question Left, Palette Right) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Ambient Glow */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT / CENTER: Question Canvas */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full z-10">
          {currentQ ? (
            <div className="glass-panel bg-white/95 backdrop-blur-xl rounded-3xl border border-blue-100 p-6 sm:p-8 shadow-sm flex-1 flex flex-col justify-between">
              <div>
                {/* Question Header & Marks Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs">
                      Question {currentIdx + 1} of {questions.length}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium text-xs capitalize hidden sm:inline">
                      Topic: {currentQ.topic_id.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">+1.00 Mark</span>
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">-0.25 Negative</span>
                  </div>
                </div>

                {/* DI Stimulus if present */}
                {currentQ.stimulus && (
                  <div className="mb-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <div className="font-bold text-xs text-blue-900 mb-2">
                      Stimulus: {currentQ.stimulus.title || 'Data Table'}
                    </div>
                    {currentQ.stimulus.chart_type === 'table' && currentQ.stimulus.structured_data && (
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                          <thead>
                            <tr className="border-b border-blue-100 bg-blue-100/50 text-blue-900">
                              {currentQ.stimulus.structured_data.headers.map((h: string, i: number) => (
                                <th key={i} className="p-2.5 font-semibold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentQ.stimulus.structured_data.rows.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} className="border-b border-slate-100 hover:bg-blue-50/30">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className="p-2.5 font-mono text-slate-700">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Question Stem (KaTeX rendered) */}
                <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed mb-8">
                  <MathRenderer content={currentQ.stem} />
                </div>

                {/* Options (52px minimum height) */}
                <div className="space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        className={`min-h-[52px] p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all select-none ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500 shadow-sm'
                            : 'border-slate-200 bg-white/80 hover:border-blue-300 hover:bg-blue-50/30 shadow-xs'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'border border-slate-300 bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.id}
                        </div>
                        <div className={`text-sm sm:text-base font-medium flex-1 ${isSelected ? 'text-blue-950 font-semibold' : 'text-slate-800'}`}>
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Loading question...</div>
          )}
        </main>

        {/* RIGHT PANEL: Question Palette (Desktop View) */}
        <aside className="w-80 bg-white/95 backdrop-blur-xl border-l border-blue-100 p-6 hidden lg:flex flex-col justify-between shrink-0 z-20">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Question Palette
              </h2>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {questions.length} Items
              </span>
            </div>

            {/* 5-Column Grid of 40px Tiles */}
            <div className="grid grid-cols-5 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const state = ans?.state || 'not_visited';
                const isCurrent = idx === currentIdx;

                // Color & Shape based on 5 palette states
                let bgClass = 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-blue-50';
                if (state === 'answered') bgClass = 'bg-emerald-500 text-white shadow-sm';
                else if (state === 'not_answered') bgClass = 'bg-rose-500 text-white shadow-sm';
                else if (state === 'marked_for_review') bgClass = 'bg-purple-600 text-white rounded-full shadow-sm';
                else if (state === 'answered_and_marked') bgClass = 'bg-purple-600 text-white rounded-full ring-2 ring-emerald-400 shadow-sm';

                return (
                  <button
                    key={q.id}
                    onClick={() => handlePaletteJump(idx)}
                    className={`w-10 h-10 font-mono font-bold text-xs flex items-center justify-center transition-all ${bgClass} ${
                      state !== 'marked_for_review' && state !== 'answered_and_marked' ? 'rounded-xl' : ''
                    } ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 font-extrabold' : 'hover:opacity-90'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Counts Legend */}
            <div className="pt-4 border-t border-slate-100 text-[11px] space-y-2 text-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Answered</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{counts.answered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-rose-500" />
                  <span>Not Answered</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{counts.not_answered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-600" />
                  <span>Marked for Review</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{counts.marked_for_review + counts.answered_and_marked}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-200" />
                  <span>Not Visited</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{counts.not_visited}</span>
              </div>
            </div>
          </div>

          {/* Submit Test Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
            >
              Submit Exam
            </button>
          </div>
        </aside>
      </div>

      {/* 3. STICKY BOTTOM ACTION BAR */}
      <footer className="h-16 bg-white/95 backdrop-blur-xl border-t border-blue-100 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => currentIdx > 0 && setCurrentIdx((prev) => prev - 1)}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 transition-colors shadow-xs"
          >
            Previous
          </button>

          {/* Clear Response Button */}
          <button
            onClick={handleClearResponse}
            disabled={!selectedOption}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 hidden sm:block transition-colors shadow-xs"
          >
            Clear Response
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Mark for Review & Next */}
          <button
            onClick={handleMarkForReviewAndNext}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-purple-300 text-purple-700 bg-purple-50/60 hover:bg-purple-100/60 transition-colors"
          >
            Mark for Review &amp; Next
          </button>

          {/* Save & Next (Primary Blue Button) */}
          <button
            onClick={handleSaveAndNext}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02]"
          >
            Save &amp; Next
          </button>
        </div>
      </footer>

      {/* SUBMIT CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-white/95 rounded-3xl border border-blue-100 max-w-md w-full p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Exam Submission Confirmation</h2>
            <p className="text-xs text-slate-600">
              Are you sure you want to submit your exam? You cannot modify your answers once submitted.
            </p>

            {/* Summary Table */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-blue-100/60">
                <span className="text-emerald-700 font-semibold">Answered</span>
                <span className="font-mono font-bold text-slate-900">{counts.answered + counts.answered_and_marked}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-blue-100/60">
                <span className="text-rose-700 font-semibold">Not Answered</span>
                <span className="font-mono font-bold text-slate-900">{counts.not_answered}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-blue-100/60">
                <span className="text-purple-700 font-semibold">Marked for Review</span>
                <span className="font-mono font-bold text-slate-900">{counts.marked_for_review}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Not Visited</span>
                <span className="font-mono font-bold text-slate-900">{counts.not_visited}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Return to Exam
              </button>
              <button
                onClick={() => handleSubmitTest(false)}
                className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-bold shadow-md shadow-blue-500/25"
              >
                Yes, Submit Final
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ON-SCREEN CALCULATOR */}
      {showCalculator && (
        <div className="fixed bottom-20 right-6 z-50 w-64 glass-panel bg-white/95 rounded-2xl border border-blue-100 p-4 shadow-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-100 pb-2 text-slate-800">
            <span>Basic Calculator</span>
            <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-right font-mono font-bold text-base text-blue-900 truncate">
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
                      const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
                      setCalcInput(String(Function(`'use strict'; return (${sanitized})`)()));
                    } catch {
                      setCalcInput('Error');
                    }
                  } else {
                    setCalcInput((prev) => (prev === '0' ? btn : prev + btn));
                  }
                }}
                className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-800 border border-slate-100 text-center transition-colors"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE PALETTE SLIDE-OVER DRAWER */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-72 bg-white h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm text-slate-900">Question Palette</span>
                <button onClick={() => setIsMobilePaletteOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const state = answers[q.id]?.state || 'not_visited';
                  let bgClass = 'bg-slate-100 border border-slate-200 text-slate-700';
                  if (state === 'answered') bgClass = 'bg-emerald-500 text-white';
                  else if (state === 'not_answered') bgClass = 'bg-rose-500 text-white';
                  else if (state === 'marked_for_review' || state === 'answered_and_marked') bgClass = 'bg-purple-600 text-white rounded-full';

                  return (
                    <button
                      key={q.id}
                      onClick={() => handlePaletteJump(idx)}
                      className={`w-10 h-10 font-mono font-bold text-xs flex items-center justify-center rounded-xl ${bgClass}`}
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold uppercase tracking-wider mt-6 shadow-md shadow-blue-500/25"
            >
              Submit Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
