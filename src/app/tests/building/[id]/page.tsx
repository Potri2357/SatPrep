'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { BrandLogo } from '@/components/brand-logo';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function BuildingTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.id as string;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  useEffect(() => {
    // Stepped progression mimicking server assembly and validation
    const timer1 = setTimeout(() => setCurrentStep(2), 700);
    const timer2 = setTimeout(() => setCurrentStep(3), 1400);
    const timer3 = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [testId]);

  const steps = [
    { num: 1, title: 'Questions prepared', desc: 'Your test set is ready.' },
    { num: 2, title: 'Answer key verified', desc: 'Validation completed.' },
    { num: 3, title: 'Delivery system ready', desc: 'Ready to load your exam.' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Consistent Unified Navbar */}
      <Navbar />

      <main className="max-w-md sm:max-w-lg mx-auto w-full pt-8 sm:pt-10 pb-12 px-4 text-center space-y-6 z-10">
        {/* Compact Refined Hero Icon */}
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#005CE6]/10 animate-pulse" />
          <div className="relative z-10 transition-transform duration-500 hover:scale-105">
            <BrandLogo size={52} showWordmark={false} />
          </div>
        </div>

        {/* Status Badge & Headings */}
        <div className="space-y-2">
          <div>
            {isReady ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Test Ready</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span>Preparing Exam</span>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            {isReady ? "You're all set." : 'Assembling Your Test'}
          </h1>
          
          <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            {isReady
              ? 'Your exam is prepared. Review the instructions before you begin.'
              : 'Calibrating unseen questions matching your syllabus.'}
          </p>
        </div>

        {/* Readiness Checklist Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#BCEBFC] shadow-[0_4px_20px_rgba(0,92,230,0.04)] text-left space-y-4">
          {/* Card Header with All Systems Ready Status */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Exam Readiness
            </span>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isReady ? 'All systems ready' : 'Verifying environment...'}</span>
            </div>
          </div>

          {/* Stepped Checklist with Student-Friendly Copy */}
          <div className="space-y-3.5">
            {steps.map((st) => {
              const completed = isReady || currentStep > st.num;
              const active = !isReady && currentStep === st.num;
              return (
                <div key={st.num} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : active ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#005CE6] border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                    )}
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${completed || active ? 'text-[#0F172A]' : 'text-slate-400'}`}>
                      {st.title}
                    </div>
                    <div className="text-[12px] text-slate-500 mt-0.5">
                      {st.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional System Details Disclosure (Keeps main card student-friendly) */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="flex items-center justify-between w-full py-1 text-[11px] font-semibold text-slate-500 hover:text-[#005CE6] transition-colors cursor-pointer select-none"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Technical &amp; Verification Details</span>
              </span>
              {showTechnicalDetails ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showTechnicalDetails && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] space-y-1.5 text-slate-600 font-mono animate-in fade-in duration-150">
                <div className="flex justify-between">
                  <span className="text-slate-400">Integrity Checksum:</span>
                  <span className="font-semibold text-slate-700">SHA256: 9f8a3c...e4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Autosave Protocol:</span>
                  <span className="font-semibold text-emerald-600">Continuous Server Sync</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Exam Blueprint:</span>
                  <span className="font-semibold text-slate-700">Calibrated Bank Test Bundle</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Primary CTA Button once Ready */}
        {isReady && (
          <div className="space-y-3 pt-1">
            <button
              onClick={() => router.push(`/tests/${testId}/instructions`)}
              className="group w-full h-13 rounded-2xl bg-gradient-to-r from-[#005CE6] via-[#006DE6] to-[#0096D6] hover:from-[#004ec4] hover:to-[#0081ba] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(0,92,230,0.35)] hover:shadow-[0_12px_32px_rgba(0,92,230,0.45)] focus:outline-none focus:ring-4 focus:ring-[#005CE6]/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Review Exam Instructions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-slate-600 font-medium">
              Your timer starts only when you confirm that you&apos;re ready.
            </p>
          </div>
        )}
      </main>

      <footer className="py-6 text-xs text-center text-slate-500 font-medium z-10">
        <div>SatPrep &bull; Secure Examination Environment</div>
        <div className="text-[11px] text-slate-400 mt-1">
          Illustrative layout concept, not a live exam screen.
        </div>
      </footer>
    </div>
  );
}
