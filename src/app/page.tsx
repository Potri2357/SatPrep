'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles, BarChart3, Clock, Target } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0E1117] text-white selection:bg-[#2D6BCB] selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0E1117]/80 border-b border-[#2E3746]/60">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <BrandLogo size={38} showWordmark={true} />
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#test-window" className="hover:text-white transition-colors">Exam Environment</a>
            <a href="#pricing" className="hover:text-white transition-colors">Plans</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/admin" className="text-xs px-2.5 py-1 rounded bg-[#2E3746] hover:bg-[#46526A] text-slate-200 transition-colors">
              Admin Console
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/auth"
              className="text-sm font-medium text-slate-200 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#2D6BCB] hover:bg-[#2458AD] text-white shadow-lg shadow-[#2D6BCB]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Practicing Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-grid-pattern">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#2D6BCB]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151A23] border border-[#2E3746] text-xs font-medium text-[#8FB2EA] mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#2D6BCB]" />
            <span>Calibrated Quant & DI Engine for SBI, IBPS, RBI & RRB</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            Master Bank Exam Quant with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A8FDD] via-[#8FB2EA] to-white">
              Exam-Realistic Precision
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            No repeated questions. Every test is assembled server-side with verified keys, step-by-step shortcuts, and analysis that explains exactly why you lost marks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base bg-[#2D6BCB] hover:bg-[#2458AD] text-white shadow-xl shadow-[#2D6BCB]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Launch a Live Mock Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tests/new"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-base bg-[#151A23] hover:bg-[#1B212C] text-slate-200 border border-[#2E3746] flex items-center justify-center gap-2 transition-all"
            >
              Custom Topic Practice
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#2E3746]/50 max-w-3xl mx-auto text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">99.5%</div>
              <div className="text-xs text-slate-400 mt-1">Key Accuracy Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">&lt; 2s</div>
              <div className="text-xs text-slate-400 mt-1">P95 Test Start Latency</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">100%</div>
              <div className="text-xs text-slate-400 mt-1">Exam-Faithful Interface</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">5-Level</div>
              <div className="text-xs text-slate-400 mt-1">Calibrated Difficulty</div>
            </div>
          </div>
        </div>

        {/* Product Mockup of the Focus Mode Test Window */}
        <div id="test-window" className="max-w-6xl mx-auto px-6 mt-16">
          <div className="rounded-2xl border border-[#2E3746] bg-[#151A23] p-3 shadow-2xl shadow-black/80">
            {/* Mockup Window Bar */}
            <div className="h-10 bg-[#212835] rounded-xl flex items-center justify-between px-4 text-xs text-slate-300 mb-3 border border-[#2E3746]">
              <div className="flex items-center gap-3">
                <BrandLogo size={22} showWordmark={false} />
                <span className="font-semibold text-white">IBPS PO Prelims 2026 — Section: Quantitative Aptitude</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono bg-[#0E1117] px-2.5 py-1 rounded text-amber-400 border border-amber-500/30">
                  Time Remaining: 00:14:48
                </span>
                <span className="text-slate-400">Candidate: Aditya Sharma</span>
              </div>
            </div>

            {/* Mockup Question Canvas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#0E1117] rounded-xl border border-[#2E3746]">
              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-[#2E3746] pb-2">
                  <span className="font-semibold text-white">Question No. 4</span>
                  <div className="flex gap-3">
                    <span className="text-[#3DBE8B]">Marks: +1.00</span>
                    <span className="text-[#EC6A74]">Negative: -0.25</span>
                  </div>
                </div>

                <div className="text-slate-200 text-sm font-medium leading-relaxed">
                  In the following question, two quadratic equations are given. Solve both and determine the relation between $x$ and $y$:<br/>
                  <span className="text-white font-mono block mt-2">I. $x^2 - 11x + 30 = 0$</span>
                  <span className="text-white font-mono block">II. $y^2 - 17y + 72 = 0$</span>
                </div>

                <div className="space-y-2 pt-2">
                  {['x > y', 'x < y (Selected)', 'x ≥ y', 'x ≤ y', 'x = y or relationship cannot be established'].map((opt, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg text-xs font-medium border flex items-center gap-3 ${
                        i === 1
                          ? 'border-[#2D6BCB] bg-[#2D6BCB]/15 text-white'
                          : 'border-[#2E3746] text-slate-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        i === 1 ? 'bg-[#2D6BCB] text-white' : 'border border-slate-500 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mockup Palette */}
              <div className="border-l border-[#2E3746] pl-4 space-y-3">
                <div className="text-xs font-semibold text-slate-300">Question Palette</div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                    <div
                      key={n}
                      className={`h-8 rounded text-xs flex items-center justify-center font-mono font-medium ${
                        n === 4
                          ? 'bg-[#1F9D6B] text-white ring-2 ring-[#2D6BCB]'
                          : n < 4
                          ? 'bg-[#1F9D6B] text-white'
                          : n === 6
                          ? 'bg-[#7B5CD6] text-white'
                          : 'bg-[#2E3746] text-slate-300'
                      }`}
                    >
                      {n}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] space-y-1 text-slate-400 pt-2 border-t border-[#2E3746]">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-[#1F9D6B]" /> Answered: 3</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-[#7B5CD6]" /> Review: 1</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-[#2E3746]" /> Not Visited: 11</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 bg-[#151A23] border-t border-[#2E3746]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              Built Specifically for Bank Exam Aspirants
            </h2>
            <p className="text-slate-400 text-sm">
              Standard mock portals bundle generic questions. SatPrep is engineered exclusively for Quant and DI mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#0E1117] border border-[#2E3746] hover:border-[#2D6BCB]/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#2D6BCB]/15 text-[#5A8FDD] flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Backend-First Test Assembly</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every test paper is assembled, validated and frozen server-side before you start. No question generation in the render path.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E1117] border border-[#2E3746] hover:border-[#2D6BCB]/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#1F9D6B]/15 text-[#3DBE8B] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Wrong-Option Explanations</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Solutions don't just show the right answer; they explain why you mistakenly chose option A or C (e.g. inverted formula, discount on CP mistake).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E1117] border border-[#2E3746] hover:border-[#2D6BCB]/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#7B5CD6]/15 text-[#9B83E8] flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Speed & Time Calibration</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Per-question time tracking identifies where you gave up too early on hard questions or lost precious minutes on easy arithmetic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Access Plans (PRD Section 6.8) */}
      <section id="pricing" className="py-20 bg-[#0E1117]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">Straightforward Plans</h2>
            <p className="text-slate-400 text-sm">Start free, upgrade when you need unlimited full-length mocks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl bg-[#151A23] border border-[#2E3746] flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Free Starter</span>
                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-white">
                  ₹0 <span className="text-sm font-normal text-slate-400 ml-2">forever</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">Essential quant practice for daily preparation.</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3DBE8B]" /> 1 Full Mock per week</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3DBE8B]" /> 3 Topic Tests daily</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3DBE8B]" /> Basic scorecard and solution review</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3DBE8B]" /> KaTeX formatted question stems</li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="mt-8 w-full py-3 rounded-xl text-center text-sm font-semibold bg-[#2E3746] hover:bg-[#46526A] text-white transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-2xl bg-[#151A23] border-2 border-[#2D6BCB] relative flex flex-col justify-between shadow-xl shadow-[#2D6BCB]/10">
              <div className="absolute -top-3 right-6 bg-[#2D6BCB] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Recommended
              </div>
              <div>
                <span className="text-xs font-semibold text-[#8FB2EA] uppercase tracking-wider">Pro Aspirant</span>
                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-white">
                  ₹299 <span className="text-sm font-normal text-slate-400 ml-2">/ month</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">Full mock series and actionable weak-topic remediation.</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3DBE8B]" /> Unlimited Full Mocks & Sectionals</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3DBE8B]" /> Unlimited Custom Auto & Manual Tests</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3DBE8B]" /> Percentile, Rank & Topper comparisons</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3DBE8B]" /> Automatic Weak-Area practice builder</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3DBE8B]" /> Wrong-option psychometric explanations</li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="mt-8 w-full py-3 rounded-xl text-center text-sm font-semibold bg-[#2D6BCB] hover:bg-[#2458AD] text-white shadow-lg shadow-[#2D6BCB]/30 transition-all hover:scale-[1.01]"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2E3746] py-12 bg-[#0E1117] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <BrandLogo size={30} showWordmark={true} />
          <p>© 2026 SatPrep. Dedicated Bank Exam Quant & Aptitude Test Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/admin" className="hover:text-white transition-colors">Admin Console</Link>
            <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
            <Link href="/practice" className="hover:text-white transition-colors">Practice</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
