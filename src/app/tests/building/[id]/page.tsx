'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { CheckCircle2, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export default function BuildingTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.id as string;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [testSummary, setTestSummary] = useState<any>(null);

  useEffect(() => {
    // Stepped progression mimicking server assembly and validation
    const timer1 = setTimeout(() => setCurrentStep(2), 700);
    const timer2 = setTimeout(() => setCurrentStep(3), 1400);
    const timer3 = setTimeout(() => {
      setIsReady(true);
      fetchTestDetails();
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [testId]);

  const fetchTestDetails = async () => {
    try {
      const res = await fetch(`/api/test/${testId}`);
      const data = await res.json();
      if (data.success && data.test) {
        setTestSummary(data.test);
      }
    } catch {
      // Proceed with defaults
    }
  };

  const steps = [
    { num: 1, title: 'Selecting candidate questions from verified stock', desc: 'Matching topic weights and calibrating difficulty mix' },
    { num: 2, title: 'Validating keys, distractors and DI stimuli', desc: 'Checking embedding uniqueness and solver consistency' },
    { num: 3, title: 'Freezing immutable test bundle & computing checksum', desc: 'Preparing sub-second delivery payload' },
  ];

  return (
    <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#0E1117] flex flex-col justify-between p-6 sm:p-12 text-[#212835] dark:text-[#EAF1F8]">
      <header className="max-w-xl mx-auto w-full flex items-center justify-between">
        <BrandLogo size={36} showWordmark={true} />
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-[#5B6578] dark:text-slate-400 hover:text-[#2D6BCB] transition-colors"
        >
          Continue in background
        </Link>
      </header>

      <main className="max-w-lg mx-auto w-full my-auto py-12 text-center space-y-8">
        {/* Animated Brand Plus Motif Loader (PRD Section 7.2) */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#2D6BCB]/15 animate-ping opacity-30" />
          <div className="relative z-10 transition-transform duration-700 hover:rotate-180">
            <BrandLogo size={72} showWordmark={false} />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#212835] dark:text-white">
            {isReady ? 'Your Test is Ready!' : 'Assembling Your Test Paper'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6578] dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {isReady
              ? 'The complete question bundle has been frozen and verified server-side.'
              : 'Our worker is selecting calibrated, unseen questions matching your pattern.'}
          </p>
        </div>

        {/* Stepped Progress List (PRD Section 8.6 TA-20) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] text-left space-y-4 shadow-sm">
          {steps.map((st) => {
            const completed = isReady || currentStep > st.num;
            const active = !isReady && currentStep === st.num;
            return (
              <div key={st.num} className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0">
                  {completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#1F9D6B]" />
                  ) : active ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#2D6BCB] border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700" />
                  )}
                </div>
                <div>
                  <div className={`text-xs font-semibold ${completed || active ? 'text-[#212835] dark:text-white' : 'text-slate-400'}`}>
                    {st.title}
                  </div>
                  <div className="text-[11px] text-[#5B6578] dark:text-slate-400">{st.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button once Ready */}
        {isReady && (
          <div className="space-y-3 pt-2">
            <button
              onClick={() => router.push(`/tests/${testId}/instructions`)}
              className="w-full h-12 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2D6BCB]/30 transition-all hover:scale-[1.01]"
            >
              <span>View Exam Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-400">
              Your server timer will not begin until you click &quot;I am ready to begin&quot;.
            </p>
          </div>
        )}
      </main>

      <footer className="text-xs text-center text-[#8892A3]">
        SATPREP ENGINE // TA-20 BUILD PIPELINE // ZERO RUNTIME LATENCY
      </footer>
    </div>
  );
}
