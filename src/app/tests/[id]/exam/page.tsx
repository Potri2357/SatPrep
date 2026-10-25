'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { MathRenderer } from '@/lib/math-renderer';
import { PaletteState, AssembledQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Clock,
  Maximize,
  Minimize,
  Wifi,
  WifiOff,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Languages,
  CheckCircle2,
  XCircle,
  Lock,
  Layers,
  Award,
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
  const [examName, setExamName] = useState<string>('IBPS PO Prelims 2026');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi'>('English');

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
  const [showQuestionPaper, setShowQuestionPaper] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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
          setExamName(data.bundle.exam_name || 'IBPS PO Prelims 2026');

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
            setExamName(b.exam_name || 'IBPS PO Prelims 2026');
            setSecondsRemaining((b.duration_min || 20) * 60);
            setLoading(false);
          }
        }
      } catch {
        setLoading(false);
      }
    };

    initTest();
  }, [testId]);

  // 2. Countdown Timer Loop (Auto-submit on expiry)
  useEffect(() => {
    if (loading || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, secondsRemaining]);

  // Online / Offline monitor
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

  // Action: Save & Next (Official Banking Exam Save flow)
  const handleSaveAndNext = () => {
    if (!currentQ) return;
    const elapsed = getElapsedSeconds();
    const newState: PaletteState = selectedOption ? 'answered' : 'not_answered';

    persistAnswer(currentQ.id, selectedOption, newState, elapsed);

    if (currentIdx < questions.length - 1) {
      const nextQ = questions[currentIdx + 1];
      if (answers[nextQ.id]?.state === 'not_visited') {
        setAnswers((prev) => ({
          ...prev,
          [nextQ.id]: { ...prev[nextQ.id], state: 'not_answered' },
        }));
      }
      setCurrentIdx((prev) => prev + 1);
    }
  };

  // Action: Mark for Review & Next (Official TCS iON flow)
  const handleMarkForReviewAndNext = () => {
    if (!currentQ) return;
    const elapsed = getElapsedSeconds();
    const newState: PaletteState = selectedOption ? 'answered_and_marked' : 'marked_for_review';

    persistAnswer(currentQ.id, selectedOption, newState, elapsed);

    if (currentIdx < questions.length - 1) {
      const nextQ = questions[currentIdx + 1];
      if (answers[nextQ.id]?.state === 'not_visited') {
        setAnswers((prev) => ({
          ...prev,
          [nextQ.id]: { ...prev[nextQ.id], state: 'not_answered' },
        }));
      }
      setCurrentIdx((prev) => prev + 1);
    }
  };

  // Action: Clear Response
  const handleClearResponse = () => {
    if (!currentQ) return;
    setSelectedOption(undefined);
    persistAnswer(currentQ.id, undefined, 'not_answered', 1);
  };

  // Action: Jump to Question from Palette
  const handlePaletteJump = (targetIdx: number) => {
    if (!currentQ || targetIdx === currentIdx) return;
    const elapsed = getElapsedSeconds();
    const currentAns = answers[currentQ.id];

    // Mark current as not_answered if visited without picking
    if (!currentAns?.selectedOption && (currentAns?.state === 'not_visited' || currentAns?.state === 'not_answered')) {
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

  // Action: Submit Test
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
      } else {
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3 max-w-sm shadow-md">
          <BrandLogo size={42} showWordmark={false} />
          <div className="text-base font-bold text-slate-900">Synchronizing Examination Console</div>
          <div className="text-xs text-slate-500 font-mono">Loading question bundle &amp; session timer...</div>
        </div>
      </div>
    );
  }

  // Timer Color Thresholds
  const isAmber = secondsRemaining <= 300 && secondsRemaining > 60; // <= 5 mins
  const isRed = secondsRemaining <= 60; // <= 1 min

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col select-none text-slate-800 font-sans">
      {/* 1. TOP CANDIDATE & EXAM HEADER (Official TCS iON Architecture) */}
      <header className="h-14 sm:h-16 bg-[#005CE6] text-white px-4 sm:px-6 flex items-center justify-between border-b border-blue-700 shrink-0 z-30">
        <div className="flex items-center gap-3 sm:gap-4">
          <BrandLogo size={32} showWordmark={false} />
          <div>
            <div className="font-bold text-xs sm:text-sm text-white tracking-tight leading-tight">
              {examName}
            </div>
            <div className="text-[10px] text-blue-200 font-mono flex items-center gap-2">
              <span>Terminal: C-042</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isSaved ? 'bg-emerald-400' : 'bg-amber-300 animate-ping'}`} />
                <span>{isSaved ? 'Autosaved' : 'Syncing...'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Authoritative Sectional Countdown Clock */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-blue-100">
            <Clock className="w-3.5 h-3.5" />
            <span>Time Left:</span>
          </div>
          <div
            className={cn(
              "font-mono text-sm sm:text-base font-bold tabular-nums px-3.5 py-1 rounded-lg border transition-all shadow-xs",
              isRed
                ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                : isAmber
                ? "bg-amber-400 text-slate-950 border-amber-300 font-extrabold"
                : "bg-white text-slate-900 border-blue-200"
            )}
          >
            {formatTimer(secondsRemaining)}
          </div>
        </div>

        {/* Right: Candidate Details & Language Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-blue-700/80 px-2.5 py-1 rounded-lg border border-blue-500/60 text-xs">
            <Languages className="w-3.5 h-3.5 text-blue-200" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="English" className="text-slate-900">English</option>
              <option value="Hindi" className="text-slate-900">Hindi</option>
            </select>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-blue-700/80 hover:bg-blue-600 text-white border border-blue-500/60 hidden md:block transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Candidate Card */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-blue-500/50">
            <div className="w-8 h-8 rounded-lg bg-white text-[#005CE6] font-extrabold text-xs flex items-center justify-center shadow-xs">
              AS
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-xs font-bold text-white">Aditya Sharma</div>
              <div className="text-[10px] text-blue-200 font-mono">Roll: 2601094821</div>
            </div>
          </div>

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setIsMobilePaletteOpen(true)}
            className="p-2 rounded-lg bg-blue-700/80 text-white border border-blue-500/60 lg:hidden cursor-pointer"
            aria-label="Open Question Palette"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. SECTION TABS BAR (Official Bank Prelims 3-Section Format) */}
      <div className="h-11 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20 text-xs">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 hidden sm:inline">
            Sections:
          </span>

          {/* Active Section: Quantitative Aptitude */}
          <button
            className="px-3.5 py-1 rounded-md bg-[#005CE6] text-white font-bold flex items-center gap-1.5 shadow-2xs shrink-0"
          >
            <span>Quantitative Aptitude ({questions.length})</span>
          </button>

          {/* Locked Section 2: Reasoning Ability */}
          <div
            className="px-3 py-1 rounded-md bg-slate-100 text-slate-400 font-medium flex items-center gap-1.5 border border-slate-200 shrink-0 cursor-not-allowed opacity-80"
            title="Section locked: Complete Quantitative Aptitude section first"
          >
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Reasoning (35)</span>
          </div>

          {/* Locked Section 3: English Language */}
          <div
            className="px-3 py-1 rounded-md bg-slate-100 text-slate-400 font-medium flex items-center gap-1.5 border border-slate-200 shrink-0 cursor-not-allowed opacity-80"
            title="Section locked: Complete Quantitative Aptitude section first"
          >
            <Lock className="w-3 h-3 text-slate-400" />
            <span>English (30)</span>
          </div>
        </div>

        {/* Section Utilities: Question Paper & Instructions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowQuestionPaper(true)}
            className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#005CE6]" />
            <span className="hidden sm:inline">Question Paper</span>
          </button>

          <button
            onClick={() => setShowInstructions(true)}
            className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Instructions</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: Question Canvas (Left) + Question Palette (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT / CENTER: Question Canvas */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-7 max-w-5xl mx-auto w-full">
          {currentQ ? (
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex-1 flex flex-col justify-between space-y-6">
              <div>
                {/* Question Info Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      Question No. {currentIdx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px] capitalize">
                      {currentQ.topic_id.replace(/-/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      +1.00 Marks
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                      -0.25 Negative
                    </span>
                  </div>
                </div>

                {/* DI Stimulus Table if applicable */}
                {currentQ.stimulus && (
                  <div className="mt-4 mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-800">
                      {currentQ.stimulus.title || 'Data Interpretation Table'}
                    </div>
                    {currentQ.stimulus.chart_type === 'table' && currentQ.stimulus.structured_data && (
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden border border-slate-200">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                              {currentQ.stimulus.structured_data.headers.map((h: string, i: number) => (
                                <th key={i} className="p-2 font-bold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentQ.stimulus.structured_data.rows.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className={cn("p-2", cIdx === 0 ? "font-bold text-slate-800" : "font-mono text-slate-600")}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Question Stem (KaTeX mathematical typography) */}
                <div className="text-[17px] sm:text-[18px] font-medium text-slate-900 leading-[1.65] my-5">
                  <MathRenderer content={currentQ.stem} />
                </div>

                {/* Options List (Authentic Banking Radio Selection) */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        className={cn(
                          "min-h-[50px] p-3.5 sm:p-4 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all select-none",
                          isSelected
                            ? "border-[#005CE6] bg-blue-50/60 font-semibold ring-1 ring-[#005CE6]"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                        )}
                      >
                        {/* Radio Disc */}
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                            isSelected
                              ? "border-[#005CE6] bg-[#005CE6] text-white"
                              : "border-slate-300 bg-white"
                          )}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>

                        {/* Option Tag */}
                        <span className="font-bold text-xs font-mono uppercase text-slate-500">
                          ({opt.id})
                        </span>

                        {/* Option Text */}
                        <div className="text-sm font-medium text-slate-800 leading-normal flex-1">
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Loading question...</div>
          )}
        </main>

        {/* RIGHT PALETTE RAIL (Authentic TCS iON 5-State Legend & Grid) */}
        <aside className="w-80 bg-white border-l border-slate-200 p-5 hidden lg:flex flex-col justify-between shrink-0 z-20">
          <div className="space-y-4">
            {/* Palette Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Question Palette
              </span>
              <span className="text-xs font-mono font-bold text-[#005CE6]">
                Quant: {questions.length} Qs
              </span>
            </div>

            {/* TCS iON 5-Symbol Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {counts.answered}
                </span>
                <span>Answered</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-rose-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {counts.not_answered}
                </span>
                <span>Not Answered</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">
                  {counts.not_visited}
                </span>
                <span>Not Visited</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {counts.marked_for_review}
                </span>
                <span>Marked for Review</span>
              </div>

              <div className="col-span-2 flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                <div className="relative">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                    {counts.answered_and_marked}
                  </span>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Ans &amp; Marked for Review (Evaluated)
                </span>
              </div>
            </div>

            {/* 5-Column Question Grid */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Choose a Question:
              </div>
              <div className="grid grid-cols-5 gap-2 max-h-[calc(100vh-420px)] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const ans = answers[q.id];
                  const state = ans?.state || 'not_visited';
                  const isCurrent = idx === currentIdx;

                  // Official TCS iON Color & Shape
                  let tileStyle = 'bg-slate-100 text-slate-700 border border-slate-200 rounded-md';
                  if (state === 'answered') {
                    tileStyle = 'bg-emerald-600 text-white rounded-md';
                  } else if (state === 'not_answered') {
                    tileStyle = 'bg-rose-600 text-white rounded-md';
                  } else if (state === 'marked_for_review') {
                    tileStyle = 'bg-purple-600 text-white rounded-full';
                  } else if (state === 'answered_and_marked') {
                    tileStyle = 'bg-purple-600 text-white rounded-full ring-2 ring-emerald-400';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handlePaletteJump(idx)}
                      className={cn(
                        "w-10 h-10 font-mono font-bold text-xs flex items-center justify-center transition-all cursor-pointer relative",
                        tileStyle,
                        isCurrent && "ring-2 ring-blue-600 ring-offset-2 scale-105 font-extrabold"
                      )}
                    >
                      {idx + 1}
                      {state === 'answered_and_marked' && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Exam Button */}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              Submit Exam
            </button>
          </div>
        </aside>
      </div>

      {/* 4. FOOTER CONTROLS ACTION BAR (Official TCS iON Action Sequencing) */}
      <footer className="h-16 bg-white border-t border-slate-200 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        {/* Left Side: Mark For Review & Clear Response */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkForReviewAndNext}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold border border-purple-300 text-purple-700 bg-purple-50/60 hover:bg-purple-100/60 transition-colors cursor-pointer"
          >
            Mark for Review &amp; Next
          </button>

          <button
            onClick={handleClearResponse}
            disabled={!selectedOption}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 transition-colors cursor-pointer"
          >
            Clear Response
          </button>
        </div>

        {/* Right Side: Previous & Save & Next */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => currentIdx > 0 && setCurrentIdx((prev) => prev - 1)}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 transition-colors cursor-pointer"
          >
            Previous
          </button>

          <button
            onClick={handleSaveAndNext}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#005CE6] hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
          >
            Save &amp; Next
          </button>
        </div>
      </footer>

      {/* MODAL 1: QUESTION PAPER MODAL (Official TCS iON Skim View) */}
      {showQuestionPaper && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Entire Question Paper View</h2>
                <p className="text-xs text-slate-500">Quantitative Aptitude • {questions.length} Questions</p>
              </div>
              <button
                onClick={() => setShowQuestionPaper(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Q{idx + 1}. Topic: {q.topic_id}</span>
                    <span className="text-slate-500 font-mono">+1.00 / -0.25</span>
                  </div>
                  <div className="text-slate-800 text-sm">
                    <MathRenderer content={q.stem} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 text-slate-600">
                    {q.options.map((opt) => (
                      <div key={opt.id} className="p-1.5 rounded bg-white border border-slate-200 text-xs">
                        <span className="font-bold mr-1.5">({opt.id})</span>
                        <MathRenderer content={opt.text} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowQuestionPaper(false)}
                className="px-5 py-2 rounded-xl bg-[#005CE6] text-white text-xs font-bold"
              >
                Close &amp; Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INSTRUCTIONS MODAL */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Examination Instructions</h2>
              <button onClick={() => setShowInstructions(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3 leading-relaxed text-slate-600 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900">Navigating to a Question:</strong> Click on the question number in the Question Palette to go directly to that question.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900">Answering a Question:</strong> Select your desired radio option. Click <strong className="text-[#005CE6]">&quot;Save &amp; Next&quot;</strong> to save your answer and move to the next question.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900">Marked for Review:</strong> To flag a question for later checking, click <strong className="text-purple-700">&quot;Mark for Review &amp; Next&quot;</strong>. If an option is selected, it will be evaluated unless changed.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900">Negative Marking:</strong> Each correct response scores +1.00. Each incorrect response incurs -0.25 marks penalty.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-5 py-2 rounded-xl bg-[#005CE6] text-white text-xs font-bold"
              >
                Close Instructions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: OFFICIAL SUBMISSION CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in duration-150">
            <h2 className="text-base font-bold text-slate-900">Exam Submission Summary</h2>
            <p className="text-xs text-slate-500">
              Please review your question response statistics before final submission.
            </p>

            {/* Official TCS iON Summary Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <td className="p-2.5 font-medium text-slate-700">Total Questions</td>
                    <td className="p-2.5 font-bold font-mono text-slate-900 text-right">{questions.length}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 font-medium text-emerald-700">Answered</td>
                    <td className="p-2.5 font-bold font-mono text-emerald-800 text-right">{counts.answered}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 font-medium text-rose-700">Not Answered</td>
                    <td className="p-2.5 font-bold font-mono text-rose-800 text-right">{counts.not_answered}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 font-medium text-purple-700">Marked for Review</td>
                    <td className="p-2.5 font-bold font-mono text-purple-800 text-right">{counts.marked_for_review}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 font-medium text-purple-900">Ans &amp; Marked for Review (Evaluated)</td>
                    <td className="p-2.5 font-bold font-mono text-purple-900 text-right">{counts.answered_and_marked}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-500">Not Visited</td>
                    <td className="p-2.5 font-bold font-mono text-slate-700 text-right">{counts.not_visited}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Return to Exam
              </button>
              <button
                onClick={() => handleSubmitTest(false)}
                className="w-1/2 py-2.5 rounded-xl bg-[#005CE6] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Yes, Submit Final
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE PALETTE SLIDE-OVER DRAWER */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs lg:hidden flex justify-end">
          <div className="w-80 bg-white h-full p-5 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-900">Question Palette</span>
                <button onClick={() => setIsMobilePaletteOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* 5 Column Grid */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const state = answers[q.id]?.state || 'not_visited';
                  let tileStyle = 'bg-slate-100 text-slate-700 border border-slate-200 rounded-md';
                  if (state === 'answered') tileStyle = 'bg-emerald-600 text-white rounded-md';
                  else if (state === 'not_answered') tileStyle = 'bg-rose-600 text-white rounded-md';
                  else if (state === 'marked_for_review') tileStyle = 'bg-purple-600 text-white rounded-full';
                  else if (state === 'answered_and_marked') tileStyle = 'bg-purple-600 text-white rounded-full ring-2 ring-emerald-400';

                  return (
                    <button
                      key={q.id}
                      onClick={() => handlePaletteJump(idx)}
                      className={cn("w-10 h-10 font-mono font-bold text-xs flex items-center justify-center", tileStyle)}
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
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider mt-6 shadow-sm"
            >
              Submit Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
