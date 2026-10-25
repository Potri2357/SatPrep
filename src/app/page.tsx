'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { BrandLogo } from '@/components/brand-logo';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
  Target,
  Layers,
  Award,
  Play,
  BookOpen,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F6FF] via-[#FFFFFF] to-[#F8FAFC] text-[#0F172A] selection:bg-[#2563EB] selection:text-white">
      {/* Consistent Unified Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-grid-pattern">
        {/* Soft Blue Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-400/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-300/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0F172A] mb-6 leading-[1.15]">
            Master Bank Exam Quant with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005CE6] via-[#0096D6] to-[#60CEF8]">
              Exam-Realistic Precision
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-10 leading-relaxed font-normal">
            Practice calibrated questions in an exact TCS-iON exam environment. Server-authoritative timer, psychometric distractor explanations, and zero mock latency.
          </p>

          {/* CTA Chip Buttons Strip (Large, Distinct & Prominent) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              href="/tests/new"
              className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl text-base sm:text-lg font-bold text-white bg-gradient-to-r from-[#005CE6] via-[#006DE6] to-[#0096D6] hover:from-[#004ec4] hover:to-[#0081ba] shadow-[0_8px_28px_rgba(0,92,230,0.38)] hover:shadow-[0_12px_36px_rgba(0,92,230,0.48)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group cursor-pointer"
            >
              <span>Launch Mock Test</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link
              href="/tests/result/sample-attempt-1"
              className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl text-base sm:text-lg font-bold text-[#005CE6] bg-white border-2 border-[#BCEBFC] hover:border-[#005CE6] hover:bg-[#F0FAFF] shadow-[0_4px_16px_rgba(0,92,230,0.06)] hover:shadow-[0_8px_24px_rgba(0,92,230,0.14)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group cursor-pointer"
            >
              <Award className="w-5 h-5 text-[#005CE6] group-hover:scale-110 transition-transform" />
              <span>View Exam Results</span>
            </Link>
          </div>

          {/* Trust Metrics Pill Strip */}
          <div className="mt-14 inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-600 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-[#BFDBFE]/60 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>100% Verified KaTeX Math</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Authentic TCS-iON 5-Symbol Palette</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Continuous Server Autosave</span>
            </div>
          </div>
        </div>

        {/* Exam Terminal Mockup Container */}
        <div className="max-w-6xl mx-auto px-6 mt-16 relative z-10">
          <div className="rounded-3xl bg-white border border-[#BCEBFC] shadow-[0_20px_50px_rgba(0,92,230,0.08)] overflow-hidden">
            {/* Window Top Bar */}
            <div className="h-14 bg-gradient-to-r from-[#005CE6] to-[#0096D6] px-6 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <BrandLogo size={24} showWordmark={false} />
                <span className="font-bold tracking-tight">IBPS PO Prelims 2026 — Quantitative Aptitude</span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold border border-white/20">
                  Sectional Test 01
                </span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <div className="flex items-center gap-1.5 bg-white text-[#005CE6] px-3 py-1 rounded-xl font-bold shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-[#005CE6]" />
                  <span>18:42</span>
                </div>
              </div>
            </div>

            {/* Split Screen Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 bg-[#F8FAFC]">
              {/* Question Stem Area */}
              <div className="lg:col-span-2 p-8 sm:p-10 bg-white flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-bold text-xs text-slate-500 uppercase tracking-wider">Question No. 4 of 35</span>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">+1.00</span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">-0.25</span>
                    </div>
                  </div>

                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                    A shopkeeper marked an article at $40\%$ above its cost price and offered two successive discounts of $10\%$ and $15\%$ respectively. If he made an overall profit of ₹$142.80$, calculate the cost price of the article.
                  </p>

                  {/* Options */}
                  <div className="space-y-3 pt-2">
                    {[
                      { id: 'A', text: '₹2,040' },
                      { id: 'B', text: '₹1,850' },
                      { id: 'C', text: '₹2,100', checked: true },
                      { id: 'D', text: '₹2,400' },
                      { id: 'E', text: 'None of these' },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-3 transition-colors ${
                          opt.checked
                            ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1E40AF] font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          opt.checked ? 'bg-[#2563EB] text-white' : 'border border-slate-300 text-slate-500'
                        }`}>
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-6">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200">
                    Mark for Review &amp; Next
                  </span>
                  <div className="flex gap-2.5">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full">
                      Clear Response
                    </span>
                    <span className="text-xs font-bold text-white bg-[#2563EB] px-5 py-1.5 rounded-full shadow-sm">
                      Save &amp; Next
                    </span>
                  </div>
                </div>
              </div>

              {/* Question Palette Rail */}
              <div className="p-6 bg-[#F8FAFC] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="font-bold text-xs text-slate-700 uppercase tracking-wider">Question Palette</div>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 15 }).map((_, i) => {
                      let color = 'bg-white text-slate-700 border-slate-200';
                      if (i === 0 || i === 1 || i === 3) color = 'bg-[#10B981] text-white border-transparent';
                      if (i === 2) color = 'bg-[#EF4444] text-white border-transparent';
                      if (i === 4) color = 'bg-[#8B5CF6] text-white border-transparent ring-2 ring-[#10B981]';
                      return (
                        <div
                          key={i}
                          className={`h-8 rounded-xl border flex items-center justify-center font-mono font-bold text-xs shadow-xs ${color}`}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200/80 space-y-2 text-[11px] font-semibold text-slate-600">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-[#10B981]" /> Answered: 3</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Review: 1</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-white border border-slate-300" /> Not Visited: 11</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neat Exam Modules Strip */}
      <section className="py-16 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mb-3">
              Comprehensive Quant &amp; DI Coverage
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Practice exactly the syllabus topics that dominate bank exam cutoffs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/tests/new"
              className="neu-glass-card p-7 rounded-3xl hover:scale-[1.02] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E0F4FD] text-[#005CE6] border border-[#BCEBFC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2 flex items-center justify-between">
                  <span>Full-Length Prelims Mocks</span>
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  35 questions in 20 minutes timed test. Real exam difficulty distribution and negative marking.
                </p>
              </div>
              <div className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#005CE6] to-[#007AE6] group-hover:from-[#004dc2] group-hover:to-[#0066cc] text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs group-hover:shadow transition-all">
                <span>Take 35-Q Full Mock</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>

            <Link
              href="/practice"
              className="neu-glass-card p-7 rounded-3xl hover:scale-[1.02] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#10B981] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2 flex items-center justify-between">
                  <span>Speed Drills &amp; Arithmetic</span>
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Topic-by-topic drills on Simplification, Quadratic Equations, Number Series, and Profit &amp; Loss.
                </p>
              </div>
              <div className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-emerald-700 group-hover:to-teal-700 text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs group-hover:shadow transition-all">
                <span>Practice Speed Drills</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>

            <Link
              href="/tests/new"
              className="neu-glass-card p-7 rounded-3xl hover:scale-[1.02] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#8B5CF6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2 flex items-center justify-between">
                  <span>Data Interpretation Sets</span>
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Tabular, Bar, Pie, and Caselet DI questions with step-by-step ratio and percentage calculations.
                </p>
              </div>
              <div className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:from-purple-700 group-hover:to-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs group-hover:shadow transition-all">
                <span>Solve DI Sets</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* High-Impact Bottom Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-[#061226] via-[#0B234F] to-[#005CE6] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#60CEF8]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to Benchmark Your Exam Readiness?
          </h2>
          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Experience authentic TCS-iON banking interface simulations with real-time analytics, percentile benchmarking, and detailed step-by-step explanations.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/tests/new"
              className="px-10 py-5 rounded-2xl text-base sm:text-lg font-extrabold text-[#005CE6] bg-white hover:bg-[#F0FAFF] shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group cursor-pointer"
            >
              <span>Start Free Prelims Mock Test</span>
              <ArrowRight className="w-5 h-5 text-[#005CE6] group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] py-10 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <BrandLogo size={32} showWordmark={true} />
          <p>© 2026 SatPrep. Bank Exam Quantitative Aptitude Platform. All rights reserved.</p>
          <div className="flex gap-6 font-semibold">
            <Link href="/tests/result/sample-attempt-1" className="hover:text-[#2563EB] transition-colors">Exam Results</Link>
            <Link href="/practice" className="hover:text-[#2563EB] transition-colors">Practice</Link>
            <Link href="/admin" className="hover:text-[#2563EB] transition-colors">Admin Console</Link>
            <Link href="/profile" className="hover:text-[#2563EB] transition-colors">Profile</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
