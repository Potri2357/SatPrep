'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles, BarChart3, Clock, Target } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F6FF] via-[#FFFFFF] to-[#F8FAFC] text-[#0F172A] selection:bg-[#2563EB] selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-[#E2E8F0]/80 shadow-[0_4px_20px_rgb(37,99,235,0.03)]">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <BrandLogo size={38} showWordmark={true} />
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#2563EB] transition-colors">Features</a>
            <a href="#test-window" className="hover:text-[#2563EB] transition-colors">Exam Environment</a>
            <a href="#pricing" className="hover:text-[#2563EB] transition-colors">Plans</a>
            <Link href="/admin" className="text-xs px-3 py-1.5 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] font-bold border border-[#BFDBFE] transition-colors">
              Admin Console
            </Link>
          </nav>

          <div className="flex items-center gap-3.5">
            <Link
              href="/auth"
              className="text-sm font-semibold text-slate-700 hover:text-[#2563EB] transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-lg shadow-[#2563EB]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Practicing Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden bg-grid-pattern">
        {/* Soft Blue Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-400/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-300/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#BFDBFE] text-xs font-bold text-[#1E40AF] shadow-sm mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Calibrated Quant &amp; DI Engine for SBI, IBPS, RBI &amp; RRB</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0F172A] mb-6 leading-[1.15]">
            Master Bank Exam Quant with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#3B82F6]">
              Exam-Realistic Precision
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            No repeated questions. Every test is assembled server-side with verified keys, step-by-step shortcuts, and analysis that explains exactly why you lost marks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xl shadow-[#2563EB]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Launch a Live Mock Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tests/new"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm bg-white hover:bg-slate-50 text-[#1E40AF] border border-[#BFDBFE] shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              Custom Topic Practice
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#E2E8F0] max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] tabular-nums">99.5%</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Key Accuracy Rate</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] tabular-nums">&lt; 2s</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">P95 Test Start Latency</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] tabular-nums">100%</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Exam-Faithful Interface</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] tabular-nums">5-Level</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Calibrated Difficulty</div>
            </div>
          </div>
        </div>

        {/* Product Mockup of the Focus Mode Test Window in Blue & White */}
        <div id="test-window" className="max-w-6xl mx-auto px-6 mt-16">
          <div className="rounded-3xl border border-white/80 bg-white/80 backdrop-blur-xl p-3 shadow-2xl shadow-blue-900/10">
            {/* Mockup Header Bar (Royal Blue) */}
            <div className="h-11 bg-gradient-to-r from-[#1E40AF] to-[#2563EB] rounded-2xl flex items-center justify-between px-4 text-xs text-white mb-3 shadow-md">
              <div className="flex items-center gap-3">
                <BrandLogo size={22} showWordmark={false} />
                <span className="font-bold">IBPS PO Prelims 2026 — Section: Quantitative Aptitude</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white font-bold">
                  Time Remaining: 00:14:48
                </span>
                <span className="text-blue-100 hidden sm:inline">Candidate: Aditya Sharma</span>
              </div>
            </div>

            {/* Mockup Question Canvas (Pure White with Crisp Blue accents) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-[#E2E8F0] pb-2">
                  <span className="font-bold text-[#0F172A]">Question No. 4</span>
                  <div className="flex gap-3 font-semibold">
                    <span className="text-[#10B981]">+1.00 Mark</span>
                    <span className="text-[#EF4444]">-0.25 Negative</span>
                  </div>
                </div>

                <div className="text-slate-800 text-sm font-medium leading-relaxed">
                  In the following question, two quadratic equations are given. Solve both and determine the relation between $x$ and $y$:<br/>
                  <span className="text-[#1E40AF] font-mono block mt-2 font-bold">I. $x^2 - 11x + 30 = 0$</span>
                  <span className="text-[#1E40AF] font-mono block font-bold">II. $y^2 - 17y + 72 = 0$</span>
                </div>

                <div className="space-y-2 pt-2">
                  {['x > y', 'x < y (Selected)', 'x ≥ y', 'x ≤ y', 'x = y or relationship cannot be established'].map((opt, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl text-xs font-semibold border flex items-center gap-3 transition-all ${
                        i === 1
                          ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E40AF] shadow-sm ring-1 ring-[#2563EB]'
                          : 'border-[#E2E8F0] bg-white text-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        i === 1 ? 'bg-[#2563EB] text-white font-bold' : 'border border-slate-300 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mockup Palette */}
              <div className="border-l border-[#E2E8F0] pl-4 space-y-3">
                <div className="text-xs font-bold text-slate-700">Question Palette</div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                    <div
                      key={n}
                      className={`h-8 rounded-lg text-xs flex items-center justify-center font-mono font-bold ${
                        n === 4
                          ? 'bg-[#10B981] text-white ring-2 ring-[#2563EB] scale-105'
                          : n < 4
                          ? 'bg-[#10B981] text-white'
                          : n === 6
                          ? 'bg-[#8B5CF6] text-white rounded-full'
                          : 'bg-white border border-[#E2E8F0] text-slate-700'
                      }`}
                    >
                      {n}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] space-y-1 text-slate-500 pt-2 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-[#10B981]" /> Answered: 3</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Review: 1</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-white border border-slate-300" /> Not Visited: 11</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid (White & Blue) */}
      <section id="features" className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A] mb-4">
              Built Exclusively for Bank Exam Quant Aspirants
            </h2>
            <p className="text-slate-600 text-sm">
              Standard mock portals bundle generic questions. SatPrep is engineered exclusively for Quant and DI speed mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#F0F6FF] to-white border border-[#BFDBFE] hover:shadow-xl hover:shadow-blue-500/5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Backend-First Test Assembly</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Every test paper is assembled, validated and frozen server-side before you start. Zero question generation delay in the render path.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#F0F6FF] to-white border border-[#BFDBFE] hover:shadow-xl hover:shadow-blue-500/5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#10B981] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Wrong-Option Explanations</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Solutions don't just show the right answer; they diagnose why you mistakenly chose option A or C (e.g. inverted formula, discount on CP mistake).
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#F0F6FF] to-white border border-[#BFDBFE] hover:shadow-xl hover:shadow-blue-500/5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#8B5CF6] flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Speed &amp; Pace Calibration</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Per-question time tracking identifies where you gave up too early on hard questions or lost precious minutes on easy arithmetic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Access Plans */}
      <section id="pricing" className="py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A] mb-3">Straightforward Access Plans</h2>
            <p className="text-slate-600 text-sm">Start free, upgrade when you need unlimited full-length mocks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Starter</span>
                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-[#0F172A]">
                  ₹0 <span className="text-sm font-normal text-slate-500 ml-2">forever</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">Essential quant practice for daily preparation.</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 1 Full Mock per week</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 3 Topic Tests daily</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Scorecard &amp; basic solutions</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> KaTeX formatted question stems</li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="mt-8 w-full py-3 rounded-full text-center text-sm font-bold bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE] transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier (Blue & White Hero Card) */}
            <div className="p-8 rounded-3xl bg-white border-2 border-[#2563EB] relative flex flex-col justify-between shadow-xl shadow-blue-500/10">
              <div className="absolute -top-3.5 right-6 bg-[#2563EB] text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Recommended
              </div>
              <div>
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Pro Aspirant</span>
                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-[#0F172A]">
                  ₹299 <span className="text-sm font-normal text-slate-500 ml-2">/ month</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">Full mock series and actionable weak-topic remediation.</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Unlimited Full Mocks &amp; Sectionals</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Unlimited Custom Auto &amp; Manual Tests</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Percentile, Rank &amp; Topper comparisons</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Automatic Weak-Area practice builder</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Wrong-option psychometric explanations</li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="mt-8 w-full py-3 rounded-full text-center text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-lg shadow-[#2563EB]/25 transition-all hover:scale-[1.01]"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] py-12 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <BrandLogo size={30} showWordmark={true} />
          <p>© 2026 SatPrep. Bank Exam Quantitative Aptitude Platform. All rights reserved.</p>
          <div className="flex gap-6 font-semibold">
            <Link href="/admin" className="hover:text-[#2563EB] transition-colors">Admin Console</Link>
            <Link href="/profile" className="hover:text-[#2563EB] transition-colors">Profile</Link>
            <Link href="/practice" className="hover:text-[#2563EB] transition-colors">Practice</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
