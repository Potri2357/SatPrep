'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar, CandidateAvatar } from '@/components/navbar';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';
import {
  Check,
  ShieldCheck,
  Monitor,
  Wifi,
  ArrowRight,
  Clock,
  HelpCircle,
  FileText,
  AlertTriangle,
  Award,
  ChevronRight,
  ChevronLeft,
  Loader2,
  WifiOff,
  Lightbulb,
} from 'lucide-react';

export default function ExamInstructionsPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.id as string;

  const [hasAgreed, setHasAgreed] = useState<boolean>(false);
  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Real-time system & network diagnostics
  const [systemStatus, setSystemStatus] = useState<{
    state: 'checking' | 'compatible' | 'warning';
    label: string;
  }>({ state: 'checking', label: 'Checking...' });

  const [networkStatus, setNetworkStatus] = useState<{
    state: 'checking' | 'stable' | 'slow' | 'offline';
    label: string;
  }>({ state: 'checking', label: 'Checking...' });

  // 1. Real System Compatibility Check (Screen, Storage, Modern APIs)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const hasLocalStorage = (() => {
        try {
          const key = '__satprep_test__';
          localStorage.setItem(key, '1');
          localStorage.removeItem(key);
          return true;
        } catch {
          return false;
        }
      })();
      const hasFetch = typeof window.fetch === 'function';
      const screenWidth = window.screen.width;

      if (!hasLocalStorage || !hasFetch) {
        setSystemStatus({ state: 'warning', label: 'Browser Outdated' });
      } else if (screenWidth < 640) {
        setSystemStatus({ state: 'compatible', label: 'Compatible (Mobile)' });
      } else {
        setSystemStatus({ state: 'compatible', label: 'Compatible' });
      }
    } catch {
      setSystemStatus({ state: 'compatible', label: 'Compatible' });
    }
  }, []);

  // 2. Real Network Connection & Ping Latency Check
  useEffect(() => {
    let isMounted = true;

    const measurePing = async () => {
      if (typeof window === 'undefined') return;

      if (!navigator.onLine) {
        if (isMounted) setNetworkStatus({ state: 'offline', label: 'Offline' });
        return;
      }

      try {
        const start = performance.now();
        const res = await fetch(`/api/ping?t=${Date.now()}`, { cache: 'no-store' });
        const latency = Math.round(performance.now() - start);

        if (!res.ok) throw new Error('Ping failed');

        if (isMounted) {
          if (latency < 250) {
            setNetworkStatus({
              state: 'stable',
              label: `Stable (${latency}ms)`,
            });
          } else {
            setNetworkStatus({
              state: 'slow',
              label: `Slow (${latency}ms)`,
            });
          }
        }
      } catch {
        if (isMounted) {
          if (!navigator.onLine) {
            setNetworkStatus({ state: 'offline', label: 'Offline' });
          } else {
            setNetworkStatus({ state: 'slow', label: 'Unstable' });
          }
        }
      }
    };

    measurePing();

    const onOnline = () => measurePing();
    const onOffline = () => {
      if (isMounted) setNetworkStatus({ state: 'offline', label: 'Offline' });
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    const interval = setInterval(measurePing, 12000);

    return () => {
      isMounted = false;
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!testId) return;
    const fetchBundle = async () => {
      try {
        const res = await fetch(`/api/test/${testId}`);
        const data = await res.json();
        if (data.success && data.test) {
          setTestData(data.test);
        }
      } catch {
        // Fallback handled gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, [testId]);

  const handleStartExam = () => {
    router.push(`/tests/${testId}/exam`);
  };

  const examName = testData?.bundle?.exam_name || 'Bank Exam Mock Test';
  const durationMin = testData?.bundle?.duration_min || 20;
  const questionCount = testData?.bundle?.total_questions || 10;
  const totalMarks = testData?.bundle?.total_marks || questionCount;

  const isPracticeMode = testData?.bundle?.feedback_mode === 'practice' || testData?.config?.feedback_mode === 'practice';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6FF] via-[#F8FAFC] to-[#EFF6FF] flex flex-col justify-between text-[#0F172A] relative selection:bg-[#2563EB] selection:text-white">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Consistent Unified Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 items-start">
        {/* Left 2 Cols: Instructions Body (Scrollable Section) */}
        <div className="lg:col-span-2 space-y-6 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-3 custom-scrollbar">
          {/* Exam Summary Banner */}
          <div className="p-6 sm:p-7 rounded-3xl neu-glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold neu-pill text-[#1E40AF]">
                <Award className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{isPracticeMode ? 'Topic Practice & Instant Solutions Drill' : 'Official Examination Pattern'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {examName}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {isPracticeMode ? 'Instant Step-by-Step Derivations & Speed Shortcuts' : 'Quantitative Aptitude & Data Interpretation Paper'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-3 rounded-2xl neu-pill text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mode</span>
                <span className="text-base font-extrabold font-mono text-[#2563EB]">
                  {isPracticeMode ? 'Practice' : `${durationMin} Mins`}
                </span>
              </div>
              <div className="px-4 py-3 rounded-2xl neu-pill text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Questions</span>
                <span className="text-base font-extrabold font-mono text-slate-900">{questionCount} Qs</span>
              </div>
              <div className="px-4 py-3 rounded-2xl neu-pill text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Neg. Penalty</span>
                <span className={cn("text-base font-extrabold font-mono", isPracticeMode ? "text-emerald-700" : "text-slate-900")}>
                  {isPracticeMode ? '0.00' : '-0.25'}
                </span>
              </div>
            </div>
          </div>

          {/* General Instructions */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-blue-100 shadow-[0_4px_20px_rgb(37,99,235,0.04)] space-y-4">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563EB]" />
              <span>{isPracticeMode ? 'Practice Drill Learning Guidelines' : 'General Examination Guidelines'}</span>
            </h2>

            <div className="text-xs space-y-3 leading-relaxed text-slate-600">
              {isPracticeMode ? (
                <>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">1. Instant Derivations &amp; Shortcuts:</strong> As soon as you select an option, the system verifies your answer and immediately reveals full step-by-step mathematical solutions, speed derivation shortcuts, and distractor trap analysis.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                    <Clock className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">2. Untimed &amp; Self-Paced:</strong> No countdown timer stress. An ambient per-question stopwatch lets you track your natural solving speed while you master formulas and arithmetic shortcuts.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">3. Zero Negative Penalties:</strong> Wrong answers incur 0 negative marks. Practice is meant for learning and exploring options without fear of penalty deductions.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">4. Built-in Scratchpad &amp; Bookmarks:</strong> Use the interactive rough scratchpad for calculations and star tricky questions for automated spaced repetition review.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                    <Clock className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">1. Server Clock:</strong> The countdown timer displayed at the top of the exam screen reflects the authoritative server clock. When the timer hits 00:00, your exam will be automatically submitted without manual intervention.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">2. Marking Scheme:</strong> You will be awarded <strong className="text-emerald-700 font-bold">+1.00 mark</strong> for each correct answer. An incorrect response incurs a negative deduction of <strong className="text-rose-700 font-bold">-0.25 marks</strong>. Unattempted questions carry zero penalties.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">3. Continuous Autosave:</strong> Every question response is transmitted and verified against the server. An active sync beacon confirms persistence on every selection.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">4. Saving Responses:</strong> To lock in your answer, you must click <strong className="text-[#2563EB]">&quot;Save &amp; Next&quot;</strong>. Simply tapping on an option without proceeding does not save your choice.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Question Status Legend */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-blue-100 shadow-[0_4px_20px_rgb(37,99,235,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                Question Status Legend
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#005CE6] border border-[#BFDBFE]">
                Status Reference
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-slate-800">Not Visited</div>
                  <div className="text-slate-500 text-[11px]">You have not visited this question yet.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-rose-200 bg-rose-50/50 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  2
                </div>
                <div>
                  <div className="font-bold text-rose-900">Not Answered</div>
                  <div className="text-slate-600 text-[11px]">You have not answered this question.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  3
                </div>
                <div>
                  <div className="font-bold text-emerald-900">Answered</div>
                  <div className="text-slate-600 text-[11px]">You have answered this question.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-purple-200 bg-purple-50/50 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  4
                </div>
                <div>
                  <div className="font-bold text-purple-900">Marked for Review</div>
                  <div className="text-slate-600 text-[11px]">Marked for review without answering.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-purple-200 bg-purple-50/50 shadow-xs sm:col-span-2">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 ring-2 ring-emerald-400 shadow-sm">
                  5
                </div>
                <div>
                  <div className="font-bold text-purple-900">Answered &amp; Marked for Review</div>
                  <div className="text-slate-600 text-[11px]">Answered and marked for review (will be evaluated).</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Candidate Profile & Readiness Checkbox */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          {/* Candidate Card */}
          <div className="p-6 rounded-3xl neu-glass-card space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Candidate Information
            </h2>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl neu-inset">
              <CandidateAvatar size={44} />
              <div className="overflow-hidden">
                <div className="font-bold text-slate-900 text-sm">Sathyamoorthi M</div>
                <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  Quantitative Aptitude Paper
                </div>
              </div>
            </div>

            {/* System Compatibility & Connection Status (Real-time Dynamic Checks) */}
            <div className="pt-1 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/70 border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Monitor className="w-4 h-4 text-slate-500" />
                  <span>System Compatibility</span>
                </div>
                {systemStatus.state === 'checking' && (
                  <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </span>
                )}
                {systemStatus.state === 'compatible' && (
                  <span className="font-bold text-emerald-700 text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{systemStatus.label}</span>
                  </span>
                )}
                {systemStatus.state === 'warning' && (
                  <span className="font-bold text-amber-700 text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{systemStatus.label}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/70 border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  {networkStatus.state === 'offline' ? (
                    <WifiOff className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Wifi className="w-4 h-4 text-slate-500" />
                  )}
                  <span>Network Connection</span>
                </div>
                {networkStatus.state === 'checking' && (
                  <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Measuring...</span>
                  </span>
                )}
                {networkStatus.state === 'stable' && (
                  <span className="font-bold text-emerald-700 text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{networkStatus.label}</span>
                  </span>
                )}
                {networkStatus.state === 'slow' && (
                  <span className="font-bold text-amber-700 text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{networkStatus.label}</span>
                  </span>
                )}
                {networkStatus.state === 'offline' && (
                  <span className="font-bold text-rose-700 text-xs flex items-center gap-1">
                    <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                    <span>Offline</span>
                  </span>
                )}
              </div>
            </div>

            {/* Direct Launch Exam Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleStartExam}
                className="w-full neu-chip-primary uppercase tracking-wider text-xs py-3.5 cursor-pointer shadow-md flex items-center justify-center gap-2 font-bold hover:shadow-lg transition-all"
              >
                <span>{isPracticeMode ? 'Launch Practice Drill' : 'I am ready to begin the exam — Start Test'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-12 border-t border-blue-100 bg-white/80 px-6 flex items-center justify-center text-[11px] text-slate-400">
        SwS Exam Engine // Secure Testing Terminal
      </footer>
    </div>
  );
}
