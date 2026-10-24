'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { ArrowRight, Check, Target, Clock, Award, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [selectedExams, setSelectedExams] = useState<string[]>(['IBPS PO', 'SBI PO']);
  const [examDate, setExamDate] = useState<string>('2026-11-15');
  const [dailyTime, setDailyTime] = useState<number>(90);
  const [selfLevel, setSelfLevel] = useState<number>(3);

  const toggleExam = (name: string) => {
    if (selectedExams.includes(name)) {
      if (selectedExams.length > 1) {
        setSelectedExams(selectedExams.filter((e) => e !== name));
      }
    } else {
      setSelectedExams([...selectedExams, name]);
    }
  };

  const handleFinish = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6 sm:p-12 text-slate-800 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-2xl mx-auto w-full flex items-center justify-between z-10">
        <BrandLogo size={36} showWordmark={true} />
        {/* Step Capsule Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-100 shadow-xs">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm'
                  : s < step
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full my-auto py-10 z-10">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-blue-700 border border-blue-200 mb-3">
                <Target className="w-3.5 h-3.5" />
                <span>Step 1 of 3</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Which exams are you targeting?
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                We calibrate topic weights and difficulty mix to match these specific exam patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'IBPS PO', label: 'Probationary Officer (Scale I)' },
                { name: 'SBI PO', label: 'State Bank Probationary Officer' },
                { name: 'SBI Clerk', label: 'Junior Associates (Clerical)' },
                { name: 'RBI Assistant', label: 'High Speed Numerical Ability' },
                { name: 'IBPS Clerk', label: 'Clerical Cadre Prelims & Mains' },
                { name: 'RRB Officer', label: 'Regional Rural Banks Scale I' },
              ].map((exam) => {
                const isSelected = selectedExams.includes(exam.name);
                return (
                  <button
                    key={exam.name}
                    type="button"
                    onClick={() => toggleExam(exam.name)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white/90 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-base">{exam.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{exam.label}</div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-300 bg-slate-50'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-blue-700 border border-blue-200 mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Step 2 of 3</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Set your study routine
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                We pace your daily revision sets and countdown to target exam dates.
              </p>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-3xl bg-white/95 border border-blue-100 shadow-sm space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Expected Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="glass-panel p-5 rounded-3xl bg-white/95 border border-blue-100 shadow-sm space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Daily Quant Practice Goal
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyTime(mins)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        dailyTime === mins
                          ? 'border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                          : 'border-slate-200 bg-white hover:border-blue-300 text-slate-600'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-sm text-slate-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-blue-700 border border-blue-200 mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>Step 3 of 3</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                How would you rate your Quant level?
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                This sets your initial difficulty mix while our empirical calibration engine tunes to your attempts.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { level: 1, title: 'Beginner (Level 1-2)', desc: 'Need fundamentals ramp, step-by-step shortcuts, easy simplification and arithmetic.' },
                { level: 3, title: 'Intermediate (Level 3)', desc: 'Comfortable with basic concepts, looking to build speed and accuracy under 20-min timing.' },
                { level: 5, title: 'Advanced / Repeater (Level 4-5)', desc: 'Scoring near cutoff, targeting high-complexity DI, caselets and Mains-level reasoning.' },
              ].map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setSelfLevel(item.level)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selfLevel === item.level
                      ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-sm text-slate-700"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01]"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-xs text-center text-slate-400 z-10">
        You can update your target exams and difficulty settings anytime in your profile.
      </footer>
    </div>
  );
}
