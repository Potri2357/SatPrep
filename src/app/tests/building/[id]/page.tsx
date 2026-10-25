'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { CheckCircle2, ArrowRight, Clock, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6 sm:p-12 text-slate-800 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/dashboard" className="transition-transform hover:scale-[1.02]">
          <BrandLogo size={36} showWordmark={true} />
        </Link>
        <Link
          href="/dashboard"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 shadow-xs transition-colors"
        >
          Continue in background
        </Link>
      </header>

      <main className="max-w-lg mx-auto w-full my-auto py-12 text-center space-y-8 z-10">
        {/* Animated Brand Plus Motif Loader */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping opacity-40" />
          <div className="relative z-10 transition-transform duration-700 hover:rotate-180">
            <BrandLogo size={80} showWordmark={false} />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sub-Second Server Assembly</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {isReady ? 'Your Test is Ready!' : 'Assembling Your Test Paper'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
            {isReady
              ? 'The complete question bundle has been frozen and verified server-side.'
              : 'Our worker is selecting calibrated, unseen questions matching your pattern.'}
          </p>
        </div>

        {/* Stepped Progress List */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 text-left space-y-4 shadow-sm">
          {steps.map((st) => {
            const completed = isReady || currentStep > st.num;
            const active = !isReady && currentStep === st.num;
            return (
              <div key={st.num} className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0">
                  {completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : active ? (
                    <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300" />
                  )}
                </div>
                <div>
                  <div className={`text-xs font-bold ${completed || active ? 'text-slate-900' : 'text-slate-400'}`}>
                    {st.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
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
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01]"
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

      <footer className="text-xs text-center text-slate-400 z-10">
        SATPREP ENGINE // TA-20 BUILD PIPELINE // ZERO RUNTIME LATENCY
      </footer>
    </div>
  );
}
