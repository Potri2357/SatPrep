'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { Check, ShieldAlert, Monitor, Wifi, ArrowRight } from 'lucide-react';

export default function ExamInstructionsPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.id as string;

  const [hasAgreed, setHasAgreed] = useState<boolean>(false);
  const [testData, setTestData] = useState<any>(null);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const res = await fetch(`/api/test/${testId}`);
        const data = await res.json();
        if (data.success && data.test) {
          setTestData(data.test);
        }
      } catch {
        // Fallback
      }
    };
    fetchBundle();
  }, [testId]);

  const handleStartExam = () => {
    if (!hasAgreed) return;
    router.push(`/tests/${testId}/exam`);
  };

  return (
    <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#0E1117] flex flex-col justify-between text-[#212835] dark:text-[#EAF1F8]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#212835] text-white border-b border-[#2E3746] px-6 h-14 flex items-center justify-between">
        <BrandLogo size={30} showWordmark={true} />
        <div className="text-xs font-mono text-slate-300">
          EXAM INSTRUCTIONS // CANDIDATE VERIFICATION
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Instructions Body */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
            <h1 className="text-xl font-bold text-[#212835] dark:text-white">
              General Examination Instructions
            </h1>

            <div className="prose dark:prose-invert text-xs space-y-3 leading-relaxed text-[#5B6578] dark:text-slate-300">
              <p>
                <strong>1. Server Clock:</strong> The countdown timer in the top right corner of the test screen displays the time remaining for you to complete the examination. When the timer reaches zero, the examination will automatically submit.
              </p>
              <p>
                <strong>2. Marking Scheme:</strong> For each correct response, you will be awarded <strong>1.00 mark</strong>. For each incorrect response, <strong>0.25 marks</strong> will be deducted. No marks are deducted for unattempted questions.
              </p>
              <p>
                <strong>3. Sectional Lock:</strong> Once a section time expires, it will be locked and you cannot return to it. Answers are automatically synced with the server on every action.
              </p>
              <p>
                <strong>4. Saving Answers:</strong> To save your chosen option, you must click on the <strong>&quot;Save &amp; Next&quot;</strong> button. Simply clicking on a radio button does not save the answer.
              </p>
            </div>
          </div>

          {/* Question Palette Legend (PRD Section 6.4) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Question Palette Symbol States
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                  1
                </div>
                <span>You have not visited the question yet.</span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded bg-[#D64550] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <span>You have not answered the question.</span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded bg-[#1F9D6B] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <span>You have answered the question.</span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-[#7B5CD6] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <span>Marked for Review without answer.</span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 sm:col-span-2">
                <div className="w-8 h-8 rounded-full bg-[#7B5CD6] text-white flex items-center justify-center font-bold relative">
                  5
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1F9D6B] absolute -top-0.5 -right-0.5 border border-white" />
                </div>
                <span>The question is answered and marked for review (will be evaluated).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Readiness & Declaration Checkbox */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Device &amp; Session Check</h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#1F9D6B]" />
                  <span>Display Resolution</span>
                </div>
                <span className="font-semibold text-[#1F9D6B]">Optimal</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#1F9D6B]" />
                  <span>Network Sync</span>
                </div>
                <span className="font-semibold text-[#1F9D6B]">Connected</span>
              </div>
            </div>

            {/* Mandatory Checkbox */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#2D6BCB] focus:ring-[#2D6BCB]"
                />
                <span className="text-xs text-[#5B6578] dark:text-slate-300 leading-snug">
                  I have read and understood all instructions. I declare that I will attempt the exam without any unfair means.
                </span>
              </label>
            </div>

            <button
              onClick={handleStartExam}
              disabled={!hasAgreed}
              className="w-full h-12 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] disabled:opacity-40 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2D6BCB]/30 transition-all hover:scale-[1.01]"
            >
              <span>I am ready to begin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
