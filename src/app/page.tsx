'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, CandidateAvatar } from '@/components/navbar';
import { BrandLogo } from '@/components/brand-logo';
import { Features10 } from '@/components/features-10';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
  Target,
  Layers,
  Award,
  Play,
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Check,
  TrendingUp,
  Calculator,
  Flame,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

export default function LandingPage() {
  const [mockupTab, setMockupTab] = useState<'mock' | 'practice'>('mock');
  const [selectedOpt, setSelectedOpt] = useState<string>('C');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F6FF] via-[#FFFFFF] to-[#F8FAFC] dark:from-[#090E17] dark:via-[#0D1524] dark:to-[#090E17] text-[#0F172A] dark:text-[#F8FAFC] selection:bg-[#005CE6] selection:text-white transition-colors">
      {/* Consistent Unified Navbar */}
      <Navbar />

      {/* ================================================================
          HERO SECTION — Compact, Premium
          ================================================================ */}
      <section className="relative pt-20 pb-14 sm:pt-24 sm:pb-18 overflow-hidden">

        {/* Background base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EEF6FF] via-[#F7FDFF] to-white dark:from-[#080E1A] dark:via-[#0D1629] dark:to-[#090E17] transition-colors" />

        {/* Top-centre radial aurora */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[380px] pointer-events-none"
          style={{background:"radial-gradient(ellipse 80% 70% at 50% 0%, rgba(0,92,230,0.20) 0%, rgba(0,150,214,0.08) 50%, transparent 78%)"}} />

        {/* Corner glows */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[260px] pointer-events-none"
          style={{background:"radial-gradient(ellipse 80% 70% at 0% 100%, rgba(96,206,248,0.14) 0%, transparent 70%)"}} />
        <div className="absolute bottom-0 right-0 w-[360px] h-[240px] pointer-events-none"
          style={{background:"radial-gradient(ellipse 80% 70% at 100% 100%, rgba(0,92,230,0.12) 0%, transparent 70%)"}} />

        {/* Dot grid with radial fade */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:"radial-gradient(rgba(0,92,230,0.15) 1px, transparent 1px)",
            backgroundSize:"26px 26px",
            maskImage:"radial-gradient(ellipse 75% 80% at 50% 40%, black 20%, transparent 75%)",
            WebkitMaskImage:"radial-gradient(ellipse 75% 80% at 50% 40%, black 20%, transparent 75%)"
          }} />

        {/* Ambient Mathematical Symbols Etched into Background Canvas */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* Subtle Math Typographic Watermarks */}
          <span className="absolute top-[8%] left-[6%] font-serif text-[6.5rem] font-bold leading-none text-[#005CE6]/[0.08] dark:text-blue-400/[0.12] hidden lg:block">∑</span>
          <span className="absolute top-[6%] right-[7%] font-serif text-[6.5rem] font-bold leading-none text-[#005CE6]/[0.08] dark:text-blue-400/[0.12] hidden lg:block">π</span>
          <span className="absolute top-[48%] left-[4%] font-serif text-[4rem] font-bold leading-none text-[#0096D6]/[0.09] dark:text-cyan-400/[0.12] hidden xl:block">√x</span>
          <span className="absolute top-[44%] right-[5%] font-serif text-[4.5rem] font-bold leading-none text-[#005CE6]/[0.09] dark:text-blue-400/[0.12] hidden xl:block">%</span>
          <span className="absolute bottom-[8%] left-[10%] font-mono text-[13px] font-bold tracking-widest text-[#005CE6]/[0.12] dark:text-blue-400/[0.15] hidden md:block">P(1+r/n)ⁿ</span>
          <span className="absolute bottom-[8%] right-[10%] font-mono text-[13px] font-bold tracking-widest text-[#0096D6]/[0.12] dark:text-cyan-400/[0.15] hidden md:block">ax²+bx+c=0</span>
          <span className="absolute top-[28%] left-[22%] font-serif text-[2.5rem] font-bold text-[#60CEF8]/[0.14] dark:text-cyan-400/[0.14] hidden 2xl:block">÷</span>
          <span className="absolute top-[26%] right-[22%] font-serif text-[2.5rem] font-bold text-[#005CE6]/[0.12] dark:text-blue-400/[0.14] hidden 2xl:block">≈</span>
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center gap-6">

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-[-0.025em] leading-[1.08] text-slate-900 dark:text-white">
            Master Bank Exam Quant{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005CE6] via-[#0074F0] to-[#00A8E8] dark:from-[#38BDF8] dark:via-[#60A5FA] dark:to-[#818CF8]">
              with Real Exam Speed.
            </span>
          </h1>

          {/* Subheading with high contrast */}
          <p className="max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-[1.7]">
            The precision training platform for banking aspirants —{' '}
            <strong className="text-slate-900 dark:text-white font-bold">full-fidelity IBPS simulations</strong>,{' '}
            <strong className="text-slate-900 dark:text-white font-bold">calibrated sectional speed</strong>, and{' '}
            <strong className="text-slate-900 dark:text-white font-bold">deep score telemetry</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/tests"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              style={{background:"linear-gradient(135deg, #005CE6 0%, #0074F0 50%, #0096D6 100%)", boxShadow:"0 6px 24px rgba(0,92,230,0.36), inset 0 1px 0 rgba(255,255,255,0.15)"}}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Mock Tests</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/results"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-[#005CE6] dark:text-blue-400 bg-white dark:bg-slate-800 border border-[#C5E4F8] dark:border-slate-700 hover:border-[#005CE6]/40 hover:bg-[#F4FBFF] dark:hover:bg-slate-750 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>View Exam Results</span>
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 pt-1">
            {[
              { icon: <ShieldCheck className="w-3 h-3" />, label: "Exact IBPS Interface" },
              { icon: <Zap className="w-3 h-3" />, label: "Instant Speed Shortcuts" },
              { icon: <Target className="w-3 h-3" />, label: "35 Calibrated Questions" },
              { icon: <Clock className="w-3 h-3" />, label: "20-Min Sectional Timer" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-600 dark:text-slate-400">
                <span className="text-[#005CE6] dark:text-blue-400">{icon}</span>
                {label}
              </div>
            ))}
          </div>

        </div>
      </section>



      {/* Interactive Dual-Mode Exam Terminal Mockup — Below Hero */}

      <section className="relative pb-16 sm:pb-24 bg-gradient-to-b from-[#F0F8FF] to-white dark:from-[#090E17] dark:to-[#0D1524] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

          <div className="rounded-3xl bg-white dark:bg-[#111A2E] border border-[#BCEBFC] dark:border-slate-800 shadow-[0_20px_60px_rgba(0,92,230,0.1)] overflow-hidden transition-colors">
            {/* Terminal Window Header Bar */}
            <div className="bg-gradient-to-r from-[#005CE6] via-[#006DE6] to-[#0096D6] px-4 sm:px-6 py-3 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <BrandLogo size={24} showWordmark={false} />
                <span className="font-bold tracking-tight text-white sm:text-sm">
                  {mockupTab === 'mock' ? 'IBPS PO Prelims 2026 — Quantitative Aptitude' : 'Topic Drill: Profit, Loss & Successive Discounts'}
                </span>
                <span className={cn(
                  "hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                  mockupTab === 'mock' ? "bg-white/20 border-white/30 text-white" : "bg-emerald-400/30 border-emerald-300 text-white"
                )}>
                  {mockupTab === 'mock' ? 'Sectional Test 01' : 'Instant Practice Mode'}
                </span>
              </div>

              {/* Mode Switcher Tabs right in the Terminal Header */}
              <div className="flex items-center gap-2">
                <div className="inline-flex p-0.5 rounded-xl bg-black/20 border border-white/20">
                  <button
                    type="button"
                    onClick={() => setMockupTab('mock')}
                    className={cn(
                      "px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer",
                      mockupTab === 'mock' ? "bg-white text-[#005CE6] shadow-xs" : "text-white/80 hover:text-white"
                    )}
                  >
                    Mock Simulation
                  </button>
                  <button
                    type="button"
                    onClick={() => setMockupTab('practice')}
                    className={cn(
                      "px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer",
                      mockupTab === 'practice' ? "bg-emerald-500 text-white shadow-xs" : "text-white/80 hover:text-white"
                    )}
                  >
                    Instant Practice
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-slate-900 text-[#005CE6] dark:text-blue-400 px-3 py-1 rounded-xl font-bold font-mono shadow-xs border border-white/40 dark:border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-[#005CE6] dark:text-blue-400" />
                  <span>{mockupTab === 'mock' ? '18:42 Left' : '00:24 Pace'}</span>
                </div>
              </div>
            </div>

            {/* Split Screen Terminal View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800 bg-[#F8FAFC] dark:bg-[#0D1524]">
              {/* Question Stem Area */}
              <div className="lg:col-span-2 p-6 sm:p-8 bg-white dark:bg-[#111A2E] flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Question No. 4 of {mockupTab === 'mock' ? '35' : '10'}
                    </span>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        +1.00 Correct
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded border",
                        mockupTab === 'mock' ? "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800" : "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800"
                      )}>
                        {mockupTab === 'mock' ? '-0.25 Penalty' : '0 Penalty'}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed font-medium">
                    A shopkeeper marked an article at <strong className="text-slate-900 dark:text-white font-bold">40%</strong> above its cost price and offered two successive discounts of <strong className="text-slate-900 dark:text-white font-bold">10%</strong> and <strong className="text-slate-900 dark:text-white font-bold">15%</strong> respectively. If he made an overall profit of <strong className="text-slate-900 dark:text-white font-bold">₹142.80</strong>, calculate the cost price of the article.
                  </p>

                  {/* Interactive Options */}
                  <div className="space-y-2.5 pt-1">
                    {[
                      { id: 'A', text: '₹2,040' },
                      { id: 'B', text: '₹1,850' },
                      { id: 'C', text: '₹2,100', isCorrect: true },
                      { id: 'D', text: '₹2,400' },
                      { id: 'E', text: 'None of these' },
                    ].map((opt) => {
                      const isSelected = selectedOpt === opt.id;
                      const isPractice = mockupTab === 'practice';
                      let cardStyle = 'bg-white dark:bg-[#162238] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-500';
                      let badgeStyle = 'border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400';

                      if (isSelected) {
                        if (isPractice) {
                          cardStyle = 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-xs ring-1 ring-emerald-500';
                          badgeStyle = 'bg-emerald-600 text-white border-transparent';
                        } else {
                          cardStyle = 'bg-[#EFF6FF] dark:bg-blue-950/60 border-[#2563EB] text-[#1E40AF] dark:text-blue-300 font-semibold shadow-xs';
                          badgeStyle = 'bg-[#2563EB] text-white border-transparent';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedOpt(opt.id)}
                          className={cn(
                            "w-full p-3 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between transition-all cursor-pointer text-left",
                            cardStyle
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0", badgeStyle)}>
                              {opt.id}
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          {isSelected && isPractice && (
                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Correct Option</span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Instant Solution Drawer (When Practice Tab Active) */}
                  {mockupTab === 'practice' && (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>15-Second Speed Derivation</span>
                      </div>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 font-mono leading-relaxed">
                        CP = 100 → MP = 140. Successive discount: 10% &amp; 15% → Net multiplier = 0.9 × 0.85 = 0.765. SP = 140 × 0.765 = 107.10. Profit = 7.10 units = ₹142.80 → 1 unit = ₹20.11 → CP = ₹2,100.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] sm:text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-800">
                    Mark for Review &amp; Next
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                      Clear Response
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-white bg-[#005CE6] px-4 sm:px-5 py-1.5 rounded-full shadow-xs">
                      Save &amp; Next
                    </span>
                  </div>
                </div>
              </div>

              {/* Question Palette Rail */}
              <div className="p-6 bg-[#F8FAFC] dark:bg-[#0D1524] flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">Question Palette</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Active Section
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 15 }).map((_, i) => {
                      let color = 'bg-white dark:bg-[#162238] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                      if (i === 0 || i === 1 || i === 3) color = 'bg-emerald-600 text-white border-transparent';
                      if (i === 2) color = 'bg-rose-500 text-white border-transparent';
                      if (i === 4) color = 'bg-purple-600 text-white border-transparent ring-2 ring-emerald-500';
                      return (
                        <div
                          key={i}
                          className={cn(
                            "h-8 rounded-xl border flex items-center justify-center font-mono font-bold text-xs shadow-2xs",
                            color
                          )}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-emerald-600" /> Answered: 3</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Marked for Review: 1</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Not Answered: 1</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-white dark:bg-[#162238] border border-slate-300 dark:border-slate-600" /> Not Visited: 10</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Exam Modules Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#090E17] border-t border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              Comprehensive Bank Quant Coverage
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Practice exactly the syllabus topics that determine banking prelims &amp; mains cutoffs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/tests"
              className="p-7 rounded-3xl bg-white dark:bg-[#111A2E] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:scale-[1.02] hover:border-[#005CE6]/40 dark:hover:border-blue-500/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E0F4FD] dark:bg-blue-950/80 text-[#005CE6] dark:text-blue-400 border border-[#BCEBFC] dark:border-blue-900 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
                  Full-Length Prelims Mocks
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  35 questions in 20 minutes timed test. Real exam difficulty distribution and authentic negative marking.
                </p>
              </div>
              <div className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#005CE6] to-[#007AE6] group-hover:from-[#004dc2] group-hover:to-[#0066cc] text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs group-hover:shadow transition-all">
                <span>View Mock Test Series</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>

            <Link
              href="/practice"
              className="p-7 rounded-3xl bg-white dark:bg-[#111A2E] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:scale-[1.02] hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
                  Speed Drills &amp; Arithmetic
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Chapter-wise drills on Simplification, Quadratic Equations, Number Series, and Profit &amp; Loss with instant solutions.
                </p>
              </div>
              <div className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-emerald-700 group-hover:to-teal-700 text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs group-hover:shadow transition-all">
                <span>Explore Topic Drills</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>

            <Link
              href="/practice"
              className="p-7 rounded-3xl bg-white dark:bg-[#111A2E] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:scale-[1.02] hover:border-purple-400 dark:hover:border-purple-500/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
                  Data Interpretation Sets
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Tabular, Missing Tables, Dual Pie Charts, and Stacked Bar questions with step-by-step ratio and percentage derivations.
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

      {/* Features 10 Block: Interconnected Exam Ecosystem with Orbiting Nodes */}
      <Features10 />


      {/* High-Impact Bottom Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-[#061226] via-[#0B234F] to-[#005CE6] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#60CEF8]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to Benchmark Your Exam Readiness?
          </h2>
          <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Experience authentic banking interface simulations with real-time analytics, percentile benchmarking, and detailed step-by-step explanations.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/tests"
              className="px-10 py-5 rounded-2xl text-base sm:text-lg font-extrabold text-[#005CE6] bg-white hover:bg-[#F0FAFF] shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group cursor-pointer"
            >
              <span>Explore Mock Tests Series</span>
              <ArrowRight className="w-5 h-5 text-[#005CE6] group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] dark:border-slate-800 py-10 bg-white dark:bg-[#090E17] text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <BrandLogo size={32} showWordmark={true} />
          <p>© 2026 SwS. Bank Exam Quantitative Aptitude Platform. All rights reserved.</p>
          <div className="flex gap-6 font-semibold">
            <Link href="/results" className="hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors">Exam Results</Link>
            <Link href="/practice" className="hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors">Topic Drills</Link>
            <Link href="/tests" className="hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors">Mock Tests</Link>
            <Link href="/admin" className="hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors">Admin Console</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
