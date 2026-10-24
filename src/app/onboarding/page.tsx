'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { ArrowRight, Check, Target, Clock, Award } from 'lucide-react';

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
    <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#0E1117] flex flex-col justify-between p-6 sm:p-12">
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between">
        <BrandLogo size={36} showWordmark={true} />
        {/* Step Capsule Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-[#2D6BCB]'
                  : s < step
                  ? 'w-2 bg-[#1F9D6B]'
                  : 'w-2 bg-[#DDE4EE] dark:bg-[#2E3746]'
              }`}
            />
          ))}
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full my-auto py-10">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE8F8] dark:bg-[#2D6BCB]/20 text-xs font-semibold text-[#1C458A] dark:text-[#8FB2EA] mb-3">
                <Target className="w-3.5 h-3.5" />
                <span>Step 1 of 3</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#212835] dark:text-white">
                Which exams are you targeting?
              </h1>
              <p className="text-sm text-[#5B6578] dark:text-slate-400 mt-1">
                We calibrate topic weights and difficulty to match these specific exam patterns.
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
                    className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-[#2D6BCB] bg-white dark:bg-[#151A23] shadow-md ring-1 ring-[#2D6BCB]'
                        : 'border-[#DDE4EE] dark:border-[#2E3746] bg-white/60 dark:bg-[#151A23]/60 hover:bg-white dark:hover:bg-[#151A23]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-[#212835] dark:text-white text-base">{exam.name}</div>
                      <div className="text-xs text-[#5B6578] dark:text-slate-400 mt-0.5">{exam.label}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#2D6BCB] text-white' : 'border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full h-12 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#2D6BCB]/25 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE8F8] dark:bg-[#2D6BCB]/20 text-xs font-semibold text-[#1C458A] dark:text-[#8FB2EA] mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Step 2 of 3</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#212835] dark:text-white">
                Set your study routine
              </h1>
              <p className="text-sm text-[#5B6578] dark:text-slate-400 mt-1">
                We pace your daily revision sets and countdown to target exam dates.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746]">
                <label className="block text-xs font-semibold text-[#212835] dark:text-slate-300 mb-2">
                  Expected Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] text-sm text-[#212835] dark:text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746]">
                <label className="block text-xs font-semibold text-[#212835] dark:text-slate-300 mb-2">
                  Daily Quant Practice Goal
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyTime(mins)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                        dailyTime === mins
                          ? 'border-[#2D6BCB] bg-[#2D6BCB] text-white shadow-sm'
                          : 'border-[#DDE4EE] dark:border-[#2E3746] text-[#5B6578] dark:text-slate-300'
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
                className="w-1/3 h-12 rounded-xl border border-[#DDE4EE] dark:border-[#2E3746] font-semibold text-sm text-[#5B6578] dark:text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 h-12 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#2D6BCB]/25"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE8F8] dark:bg-[#2D6BCB]/20 text-xs font-semibold text-[#1C458A] dark:text-[#8FB2EA] mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>Step 3 of 3</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#212835] dark:text-white">
                How would you rate your Quant level?
              </h1>
              <p className="text-sm text-[#5B6578] dark:text-slate-400 mt-1">
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
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selfLevel === item.level
                      ? 'border-[#2D6BCB] bg-white dark:bg-[#151A23] shadow-md ring-1 ring-[#2D6BCB]'
                      : 'border-[#DDE4EE] dark:border-[#2E3746] bg-white/60 dark:bg-[#151A23]/60'
                  }`}
                >
                  <div className="font-bold text-[#212835] dark:text-white text-sm">{item.title}</div>
                  <div className="text-xs text-[#5B6578] dark:text-slate-400 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 h-12 rounded-xl border border-[#DDE4EE] dark:border-[#2E3746] font-semibold text-sm text-[#5B6578] dark:text-slate-300"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 h-12 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#2D6BCB]/25"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-xs text-center text-[#8892A3]">
        You can update your target exams and difficulty settings anytime in your profile.
      </footer>
    </div>
  );
}
