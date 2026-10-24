'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
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
} from 'lucide-react';

export default function ExamInstructionsPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.id as string;

  const [hasAgreed, setHasAgreed] = useState<boolean>(false);
  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    if (!hasAgreed) return;
    router.push(`/tests/${testId}/exam`);
  };

  const examName = testData?.bundle?.exam_name || 'Bank Exam Mock Test';
  const durationMin = testData?.bundle?.duration_min || 20;
  const questionCount = testData?.bundle?.total_questions || 10;
  const totalMarks = testData?.bundle?.total_marks || questionCount;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white shadow-md border-b border-blue-500/30 px-6 h-16 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <BrandLogo size={32} showWordmark={true} />
          <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md">
            Candidate Verification &amp; Instructions
          </span>
        </div>
        <div className="text-xs font-mono text-blue-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>PROCTORED EXAM ENVIRONMENT</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
        {/* Left 2 Cols: Instructions Body */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exam Summary Banner */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <Award className="w-3.5 h-3.5" />
                <span>Standard TCS-iON Examination Pattern</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {examName}
              </h1>
              <p className="text-xs text-slate-500">
                Quantitative Aptitude &amp; Data Interpretation Paper
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Duration</span>
                <span className="text-base font-extrabold font-mono text-blue-700">{durationMin} Mins</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Questions</span>
                <span className="text-base font-extrabold font-mono text-slate-900">{questionCount} Qs</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Total Marks</span>
                <span className="text-base font-extrabold font-mono text-slate-900">{totalMarks}.00</span>
              </div>
            </div>
          </div>

          {/* General Instructions */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>General Examination Guidelines</span>
            </h2>

            <div className="text-xs space-y-3.5 leading-relaxed text-slate-600">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">1. Server Clock:</strong> The countdown timer displayed at the top of the exam screen reflects the authoritative server clock. When the timer hits 00:00, your exam will be automatically submitted without manual intervention.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">2. Marking Scheme:</strong> You will be awarded <strong className="text-emerald-700">+1.00 mark</strong> for each correct answer. An incorrect response incurs a negative deduction of <strong className="text-rose-700">-0.25 marks</strong>. Unattempted questions carry zero penalties.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">3. Continuous Autosave:</strong> Every question response is transmitted and verified against the server. An active sync beacon confirms persistence on every selection.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">4. Saving Responses:</strong> To lock in your answer, you must click <strong className="text-blue-700">&quot;Save &amp; Next&quot;</strong>. Simply tapping on an option without proceeding does not save your choice.
                </div>
              </div>
            </div>
          </div>

          {/* Question Palette Legend */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Question Palette Symbol States
              </h2>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                5 State Standards
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                  1
                </div>
                <span className="text-slate-600">You have not visited the question yet.</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-rose-200 bg-rose-50/40 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  2
                </div>
                <span className="text-slate-700">You have not answered the question.</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  3
                </div>
                <span className="text-slate-700">You have answered the question.</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-purple-200 bg-purple-50/40 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  4
                </div>
                <span className="text-slate-700">Marked for review without answering.</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-purple-200 bg-purple-50/40 shadow-xs sm:col-span-2">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 ring-2 ring-emerald-400 shadow-sm">
                  5
                </div>
                <span className="text-slate-700 font-medium">Answered and marked for review (will be considered for final score evaluation).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Candidate Profile & Readiness Checkbox */}
        <div className="space-y-6">
          {/* Candidate Card */}
          <div className="glass-panel p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Candidate Profile Verification
            </h2>

            <div className="flex items-center gap-4 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-700 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-blue-500/20">
                AS
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-slate-900 text-sm">Aditya Sharma</div>
                <div className="text-[11px] text-slate-500 font-mono">Roll: 2026-IBPS-9021</div>
                <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-emerald-200">
                  Verified Candidate
                </div>
              </div>
            </div>

            {/* Device & Session Diagnostic */}
            <div className="pt-2 space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Monitor className="w-4 h-4 text-emerald-600" />
                  <span>Display Resolution</span>
                </div>
                <span className="font-bold text-emerald-700 font-mono">1920 x 1080 (HD)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span>Network Sync</span>
                </div>
                <span className="font-bold text-emerald-700 font-mono">24ms Latency</span>
              </div>
            </div>

            {/* Mandatory Declaration Checkbox */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 group-hover:text-slate-900 leading-snug">
                  I have read and understood all instructions. I declare that I will attempt the exam independently and without any unfair means.
                </span>
              </label>

              {/* Ready to Begin Button */}
              <button
                onClick={handleStartExam}
                disabled={!hasAgreed}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01]"
              >
                <span>I am ready to begin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-12 border-t border-blue-100 bg-white/80 px-6 flex items-center justify-center text-[11px] text-slate-400">
        SatPrep Exam Engine // Secure Testing Terminal
      </footer>
    </div>
  );
}
