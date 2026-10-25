'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
  Lightbulb,
  ArrowRight,
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

  // Review Mode state
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [reviewAttemptId, setReviewAttemptId] = useState<string>('');
  const [reviewQuestions, setReviewQuestions] = useState<any[]>([]);
  const [reviewSolutionTab, setReviewSolutionTab] = useState<'step' | 'shortcut' | 'traps'>('step');

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
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const revMode = urlParams?.get('mode') === 'review';
        const revAttempt = urlParams?.get('attemptId') || '';

        // Handle Review Mode
        if (revMode && revAttempt) {
          setIsReviewMode(true);
          setReviewAttemptId(revAttempt);
          const resRev = await fetch(`/api/test/result/${revAttempt}`);
          const dataRev = await resRev.json();
          if (dataRev.success && dataRev.snapshot) {
            const revList = dataRev.snapshot.questions_review || [];
            setReviewQuestions(revList);
            const mappedQs = revList.map((rq: any) => ({
              id: rq.question_id,
              stem: rq.stem,
              options: rq.options,
              type: 'mcq' as const,
              topic_id: rq.topic_name,
              difficulty_assigned: rq.difficulty,
              status: 'live' as const,
              source: 'seed' as const,
              version: 1,
            }));
            setQuestions(mappedQs);
            setExamName(dataRev.snapshot.exam_name || 'IBPS PO Prelims 2026 (Review)');
            const initAnswers: Record<string, { selectedOption?: string; state: PaletteState; timeSpent: number }> = {};
            revList.forEach((rq: any) => {
              initAnswers[rq.question_id] = {
                selectedOption: rq.your_answer,
                state: rq.is_correct ? 'answered' : rq.your_answer ? 'not_answered' : 'not_visited',
                timeSpent: rq.time_taken_sec || 0,
              };
            });
            setAnswers(initAnswers);
            setSecondsRemaining(0);
            setLoading(false);
            return;
          }
        }

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

  // 2. Countdown Timer Loop (Auto-submit on expiry, disabled in review mode)
  useEffect(() => {
    if (loading || isReviewMode || secondsRemaining <= 0) return;

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
  const currentRevQ = isReviewMode ? reviewQuestions[currentIdx] : null;

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
    marked_for_review: Object.values(answers).filter((a) => a.state === 'marked_for_review').length,
    answered_and_marked: Object.values(answers).filter((a) => a.state === 'answered_and_marked').length,
    get not_visited() {
      return Math.max(0, questions.length - (this.answered + this.not_answered + this.marked_for_review + this.answered_and_marked));
    },
  };

  // Reusable Question Palette Button Renderer
  const renderPaletteButton = (q: AssembledQuestion, idx: number) => {
    const isCurrent = idx === currentIdx;

    if (isReviewMode && reviewQuestions.length > 0) {
      const revQ = reviewQuestions[idx];
      const isCorrect = revQ?.is_correct;
      const answered = !!revQ?.your_answer;

      let baseStyle = "bg-slate-100 text-slate-500 border border-slate-200/90";
      if (isCorrect) {
        baseStyle = "bg-emerald-500 text-white border border-emerald-600 shadow-2xs font-bold";
      } else if (answered) {
        baseStyle = "bg-rose-500 text-white border border-rose-600 shadow-2xs font-bold";
      }

      return (
        <button
          key={q.id}
          onClick={() => {
            handlePaletteJump(idx);
            setIsMobilePaletteOpen(false);
          }}
          className={cn(
            "h-10 w-full rounded-xl font-mono text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative",
            baseStyle,
            isCurrent && "relative z-10 border-2 border-[#005CE6] ring-2 ring-[#005CE6]/30 shadow-xs font-black"
          )}
        >
          {idx + 1}
        </button>
      );
    }

    const ans = answers[q.id];
    const state = ans?.state || 'not_visited';

    let stateStyle = "bg-[#F8FAFC] text-slate-700 border border-slate-200/90 hover:bg-[#F0FAFF] hover:border-[#60CEF8] hover:text-[#005CE6] shadow-2xs";

    if (state === 'answered') {
      stateStyle = "bg-emerald-600 text-white font-bold border border-emerald-700/80 shadow-2xs hover:bg-emerald-700";
    } else if (state === 'not_answered') {
      stateStyle = "bg-rose-600 text-white font-bold border border-rose-700/80 shadow-2xs hover:bg-rose-700";
    } else if (state === 'marked_for_review') {
      stateStyle = "bg-purple-600 text-white font-bold border border-purple-700/80 shadow-2xs hover:bg-purple-700";
    } else if (state === 'answered_and_marked') {
      stateStyle = "bg-purple-600 text-white font-bold border border-purple-700/80 shadow-2xs hover:bg-purple-700";
    }

    return (
      <button
        key={q.id}
        onClick={() => {
          handlePaletteJump(idx);
          setIsMobilePaletteOpen(false);
        }}
        className={cn(
          "h-10 w-full rounded-xl font-mono text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative",
          stateStyle,
          isCurrent && (
            state === 'not_visited'
              ? "relative z-10 bg-[#F0FAFF] text-[#005CE6] border-2 border-[#005CE6] ring-2 ring-[#005CE6]/30 font-black shadow-xs"
              : "relative z-10 border-2 border-white ring-2 ring-[#005CE6] font-black shadow-xs"
          )
        )}
      >
        {idx + 1}
        {state === 'answered_and_marked' && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1.5 ring-white" />
        )}
      </button>
    );
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
      {/* 1. TOP CANDIDATE & EXAM HEADER */}
      <header className="h-14 sm:h-16 bg-[#005CE6] text-white px-4 sm:px-6 flex items-center justify-between border-b border-blue-700 shrink-0 z-30">
        <div className="flex items-center gap-3 sm:gap-4">
          <BrandLogo size={32} showWordmark={false} />
          <div>
            <div className="font-bold text-xs sm:text-sm text-white tracking-tight leading-tight">
              {examName}
            </div>
          </div>
        </div>

        {/* Center: Authoritative Sectional Countdown Clock */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-blue-100">
            <Clock className="w-4 h-4 text-white" />
            <span>Time Left:</span>
          </div>
          <div
            className={cn(
              "font-mono text-sm sm:text-base font-bold tabular-nums px-3.5 py-1 rounded-xl border transition-all shadow-xs",
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

        {/* Right: Candidate Details */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#005CE6] font-extrabold text-xs flex items-center justify-center shadow-xs">
              SM
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-xs font-bold text-white">Sathyamoorthi M</div>
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
        <main className="flex-1 flex flex-col overflow-y-auto p-3 sm:p-4 lg:p-5 max-w-4xl mx-auto w-full">
          {currentQ ? (
            <div className="rounded-2xl bg-white border border-[#BCEBFC]/90 shadow-[0_4px_24px_rgba(0,92,230,0.06)] flex flex-col justify-between overflow-hidden">
              <div className="p-4 sm:p-5 lg:p-6 space-y-3.5 flex-1">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#005CE6]/10 text-[#005CE6] font-bold text-xs">
                      <span>Question {currentIdx + 1}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px] capitalize border border-slate-200/50">
                      {currentQ.topic_id.replace(/-/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                    {isReviewMode && currentRevQ ? (
                      currentRevQ.is_correct ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200">
                          <Check className="w-3 h-3 stroke-[3]" /> +1.00 Marks (Correct)
                        </span>
                      ) : currentRevQ.your_answer ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1 border border-rose-200">
                          <X className="w-3 h-3 stroke-[3]" /> -0.25 Marks (Incorrect)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
                          0.00 Marks (Skipped)
                        </span>
                      )
                    ) : (
                      <>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          +1.00 Marks
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/70">
                          -0.25 Negative
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* DI Stimulus Table if applicable */}
                {currentQ.stimulus && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="text-xs font-bold text-slate-800">
                      {currentQ.stimulus.title || 'Data Interpretation Table'}
                    </div>
                    {currentQ.stimulus.chart_type === 'table' && currentQ.stimulus.structured_data && (
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden border border-slate-200">
                          <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                              {currentQ.stimulus.structured_data.headers.map((h: string, i: number) => (
                                <th key={i} className="px-2.5 py-1.5 font-bold text-[11px]">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentQ.stimulus.structured_data.rows.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className={cn("px-2.5 py-1.5 text-xs", cIdx === 0 ? "font-bold text-slate-800" : "font-mono text-slate-600")}>
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
                <div className="text-[14.5px] sm:text-[15.5px] font-medium text-slate-900 leading-relaxed my-2 sm:my-3 select-text">
                  <MathRenderer content={currentQ.stem} />
                </div>

                {/* Options List (Compact Authentic Selection or Review Highlight) */}
                <div className="space-y-2 pt-1">
                  {currentQ.options.map((opt) => {
                    if (isReviewMode && currentRevQ) {
                      const isCorrect = opt.id === currentRevQ.correct_answer;
                      const isSelected = opt.id === currentRevQ.your_answer;
                      return (
                        <div
                          key={opt.id}
                          className={cn(
                            "px-3.5 py-2.5 rounded-xl border flex items-center justify-between transition-all select-none text-xs sm:text-[13.5px]",
                            isCorrect
                              ? "border-emerald-400 bg-emerald-50/80 font-semibold text-emerald-950 ring-1 ring-emerald-300 shadow-2xs"
                              : isSelected
                              ? "border-rose-400 bg-rose-50/80 font-semibold text-rose-950 ring-1 ring-rose-300 shadow-2xs"
                              : "border-slate-200 bg-white/70 opacity-75 text-slate-600 hover:opacity-100"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={cn(
                                "w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs font-mono uppercase shrink-0",
                                isCorrect
                                  ? "bg-emerald-600 text-white"
                                  : isSelected
                                  ? "bg-rose-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              )}
                            >
                              {opt.id}
                            </span>
                            <div className="font-medium leading-snug">
                              <MathRenderer content={opt.text} />
                            </div>
                          </div>
                          <div className="shrink-0 pl-2">
                            {isCorrect && (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                                <Check className="w-3 h-3 stroke-[3]" /> Correct Key
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="text-[11px] font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full flex items-center gap-1 border border-rose-200">
                                <X className="w-3 h-3 stroke-[3]" /> Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }

                    const isSelected = selectedOption === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        className={cn(
                          "group px-3.5 py-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all select-none text-xs sm:text-[13.5px]",
                          isSelected
                            ? "border-[#005CE6] bg-[#F0FAFF] font-semibold text-[#003B99] ring-1 ring-[#005CE6]/30 shadow-2xs"
                            : "border-slate-200 bg-white hover:border-[#60CEF8] hover:bg-[#F0FAFF]/40 text-slate-800"
                        )}
                      >
                        {/* Radio Disc */}
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                            isSelected
                              ? "border-[#005CE6] bg-[#005CE6]"
                              : "border-slate-300 bg-white group-hover:border-[#005CE6]"
                          )}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>

                        {/* Letter Chip */}
                        <span
                          className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs font-mono uppercase shrink-0 transition-colors",
                            isSelected
                              ? "bg-[#005CE6] text-white"
                              : "bg-slate-100 text-slate-600 group-hover:bg-[#BCEBFC]/40 group-hover:text-[#005CE6]"
                          )}
                        >
                          {opt.id}
                        </span>

                        {/* Option Text */}
                        <div className="font-medium leading-snug flex-1">
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* In Review Mode: Compact Tabbed Solution Drawer */}
                {isReviewMode && currentRevQ && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200/60 w-fit text-xs">
                      <button
                        onClick={() => setReviewSolutionTab('step')}
                        className={cn(
                          "px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                          reviewSolutionTab === 'step'
                            ? "bg-white text-[#005CE6] shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Step-by-Step Derivation</span>
                      </button>

                      {currentRevQ.shortcut && (
                        <button
                          onClick={() => setReviewSolutionTab('shortcut')}
                          className={cn(
                            "px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                            reviewSolutionTab === 'shortcut'
                              ? "bg-white text-amber-900 shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          )}
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>Speed Shortcut</span>
                        </button>
                      )}

                      {currentRevQ.option_rationales && (
                        <button
                          onClick={() => setReviewSolutionTab('traps')}
                          className={cn(
                            "px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                            reviewSolutionTab === 'traps'
                              ? "bg-white text-slate-900 shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          )}
                        >
                          <Layers className="w-3.5 h-3.5 text-[#0096D6]" />
                          <span>Trap Diagnosis</span>
                        </button>
                      )}
                    </div>

                    {/* Tab Contents */}
                    {reviewSolutionTab === 'step' && (
                      <div className="p-3.5 rounded-xl bg-[#F0FAFF] border border-[#BCEBFC] space-y-1.5 text-xs text-slate-800 leading-relaxed animate-in fade-in duration-150">
                        <div className="font-bold text-[#005CE6] text-[11px] uppercase tracking-wider">
                          Official Mathematical Breakdown
                        </div>
                        <div className="leading-relaxed">
                          <MathRenderer content={currentRevQ.solution} />
                        </div>
                      </div>
                    )}

                    {reviewSolutionTab === 'shortcut' && currentRevQ.shortcut && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1 text-xs leading-relaxed animate-in fade-in duration-150">
                        <div className="font-bold text-amber-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          <span>Exam Speed Shortcut (15–20 Seconds)</span>
                        </div>
                        <p className="leading-relaxed">{currentRevQ.shortcut}</p>
                      </div>
                    )}

                    {reviewSolutionTab === 'traps' && currentRevQ.option_rationales && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs animate-in fade-in duration-150">
                        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                          Option Trap Breakdown
                        </div>
                        <div className="space-y-1.5">
                          {Object.entries(currentRevQ.option_rationales).map(([optId, rationale]: [string, any]) => (
                            <div key={optId} className="flex items-start gap-2 text-slate-600 text-[11.5px]">
                              <span className="font-mono font-bold uppercase text-slate-900 shrink-0">Option {optId}:</span>
                              <span>{rationale}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CARD ACTION FOOTER (Integrated inside the card seamlessly) */}
              <div className="px-4 sm:px-5 py-2.5 bg-slate-50/90 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
                {isReviewMode ? (
                  <>
                    <Link
                      href={`/tests/result/${reviewAttemptId}`}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back to Scorecard</span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => currentIdx > 0 && setCurrentIdx((prev) => prev - 1)}
                        disabled={currentIdx === 0}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>

                      <button
                        onClick={() => currentIdx < questions.length - 1 && setCurrentIdx((prev) => prev + 1)}
                        disabled={currentIdx === questions.length - 1}
                        className="neu-chip-primary px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left Side: Mark For Review & Clear Response */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleMarkForReviewAndNext}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Mark for Review &amp; Next</span>
                      </button>

                      <button
                        onClick={handleClearResponse}
                        disabled={!selectedOption}
                        className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        Clear Response
                      </button>
                    </div>

                    {/* Right Side: Previous & Save & Next */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => currentIdx > 0 && setCurrentIdx((prev) => prev - 1)}
                        disabled={currentIdx === 0}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 text-slate-700 transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>

                      <button
                        onClick={handleSaveAndNext}
                        className="neu-chip-primary px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow transition-all"
                      >
                        <span>Save &amp; Next</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Loading question...</div>
          )}
        </main>

        {/* RIGHT PALETTE RAIL (Improved Modern Status Legend & Grid) */}
        <aside className="w-80 bg-white border-l border-slate-200 p-4 sm:p-5 hidden lg:flex flex-col justify-between shrink-0 z-20">
          <div className="space-y-4">
            {/* Status Summary & Counts Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Question Status</span>
                <span className="font-mono text-[11px] font-semibold text-[#005CE6] bg-[#005CE6]/10 px-2 py-0.5 rounded-md border border-[#005CE6]/20">
                  {counts.answered} / {questions.length} Attempted
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#005CE6] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${questions.length > 0 ? (counts.answered / questions.length) * 100 : 0}%` }}
                />
              </div>

              {/* 5 Status Legend Chips */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 pt-0.5">
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
                  <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {counts.answered}
                  </span>
                  <span className="truncate font-medium">Answered</span>
                </div>

                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
                  <span className="w-5 h-5 rounded-md bg-rose-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {counts.not_answered}
                  </span>
                  <span className="truncate font-medium">Not Answered</span>
                </div>

                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
                  <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {counts.not_visited}
                  </span>
                  <span className="truncate font-medium">Not Visited</span>
                </div>

                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
                  <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {counts.marked_for_review}
                  </span>
                  <span className="truncate font-medium">Review</span>
                </div>

                <div className="col-span-2 flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
                  <div className="relative shrink-0">
                    <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      {counts.answered_and_marked}
                    </span>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white" />
                  </div>
                  <span className="text-[10px] text-slate-600 truncate font-medium">
                    Ans &amp; Review (Evaluated)
                  </span>
                </div>
              </div>
            </div>

            {/* 5-Column Question Grid */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                <span>Select Question:</span>
                <span className="font-mono text-[10px] font-normal text-slate-400">{questions.length} Qs</span>
              </div>
              <div className="grid grid-cols-5 gap-2 max-h-[calc(100vh-420px)] overflow-y-auto p-1.5 rounded-2xl border border-slate-200/70 bg-slate-50/50">
                {questions.map((q, idx) => renderPaletteButton(q, idx))}
              </div>
            </div>
          </div>

          {/* Submit Exam Button or Back to Scorecard */}
          <div className="pt-3 border-t border-slate-100">
            {isReviewMode ? (
              <Link
                href={`/tests/result/${reviewAttemptId}`}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm text-center block"
              >
                Back to Scorecard
              </Link>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-2.5 rounded-xl bg-[#005CE6] hover:bg-[#0047b3] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs hover:shadow"
              >
                Submit Examination
              </button>
            )}
          </div>
        </aside>
      </div>

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
              <div className="grid grid-cols-5 gap-2 p-1.5 rounded-2xl border border-slate-200/70 bg-slate-50/50">
                {questions.map((q, idx) => renderPaletteButton(q, idx))}
              </div>
            </div>

            <button
              onClick={() => {
                setIsMobilePaletteOpen(false);
                setShowSubmitModal(true);
              }}
              className="w-full py-2.5 rounded-xl bg-[#005CE6] hover:bg-[#0047b3] text-white text-xs font-bold uppercase tracking-wider mt-6 shadow-xs"
            >
              Submit Examination
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
