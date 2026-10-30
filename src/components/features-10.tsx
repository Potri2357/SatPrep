"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Zap,
  Target,
  BarChart3,
  ShieldCheck,
  Brain,
  Calculator,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Activity,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrbitNode {
  id: string;
  name: string;
  category: string;
  angle: number; // in degrees
  orbitRadius: number; // in pixels (base)
  speed: number; // in seconds
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  accentBg: string;
  accentBorder: string;
  metric: string;
  description: string;
}

const ORBIT_NODES: OrbitNode[] = [
  {
    id: "ibps-clock",
    name: "20-Min Sectional Timer",
    category: "Lockdown Engine",
    angle: 0,
    orbitRadius: 160,
    speed: 36,
    icon: Clock,
    color: "#005CE6",
    accentBg: "bg-blue-50",
    accentBorder: "border-[#BCEBFC]",
    metric: "00:20:00 Synchronized",
    description: "Strict 20-minute sectional clock auto-submits like real IBPS PO/Clerk server test centers."
  },
  {
    id: "speed-shortcuts",
    name: "Instant Speed Shortcuts",
    category: "Speed Solvers",
    angle: 72,
    orbitRadius: 240,
    speed: 48,
    icon: Zap,
    color: "#0096D6",
    accentBg: "bg-cyan-50",
    accentBorder: "border-[#BCEBFC]",
    metric: "15s Target Pace",
    description: "Instant step-by-step derivations using digital roots, base arithmetic, and successive percentage rules."
  },
  {
    id: "calibrated-questions",
    name: "35 Calibrated Questions",
    category: "Syllabus Matrix",
    angle: 144,
    orbitRadius: 160,
    speed: 36,
    icon: Target,
    color: "#10B981",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    metric: "-0.25 Authentic Penalty",
    description: "Real exam distribution across Simplification, Missing Series, Quadratic Equations, and DI sets."
  },
  {
    id: "empirical-analytics",
    name: "Empirical Cutoff Model",
    category: "Score Calibration",
    angle: 216,
    orbitRadius: 240,
    speed: 48,
    icon: BarChart3,
    color: "#8B5CF6",
    accentBg: "bg-purple-50",
    accentBorder: "border-purple-200",
    metric: "Live Cutoff Benchmark",
    description: "Dynamic percentiles and speed vs. accuracy tradeoff plots benchmarked against general category cutoffs."
  },
  {
    id: "di-caselets",
    name: "Interactive DI Rail",
    category: "Data Interpretation",
    angle: 288,
    orbitRadius: 160,
    speed: 36,
    icon: Layers,
    color: "#F59E0B",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200",
    metric: "Dual Pie & Missing Tables",
    description: "Authentic multi-table and missing data caselets designed to test quick ratio and percentage extraction."
  }
];

export function Features10() {
  const [activeNode, setActiveNode] = useState<OrbitNode>(ORBIT_NODES[0]);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-white via-[#F7FDFF] to-white dark:from-[#090E17] dark:via-[#0D1524] dark:to-[#090E17] border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#005CE6]/6 via-[#60CEF8]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 hero-dot-pattern opacity-40" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F4FD] dark:bg-blue-950/80 border border-[#BCEBFC] dark:border-blue-900 text-[#005CE6] dark:text-blue-400 text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERCONNECTED EXAM ECOSYSTEM</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
            The Live Banking Quant Engine Map
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every submodule in SwS syncs directly with the central IBPS timing and penalty algorithms — giving you authentic exam velocity before test day.
          </p>
        </div>

        {/* Integration Map Visualizer with Orbiting Nodes */}
        <div className="relative rounded-3xl bg-white/80 dark:bg-[#111A2E]/90 backdrop-blur-xl border border-[#BCEBFC]/80 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,92,230,0.08)] p-6 sm:p-10 mb-12 overflow-hidden transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left / Center: Interactive Orbital System (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[360px] sm:min-h-[500px] scale-[0.75] sm:scale-95 lg:scale-100 origin-center my-[-24px] sm:my-0">
              
              {/* Outer Orbit Track (Radius: 240px) */}
              <div
                className="absolute w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] rounded-full border border-dashed border-[#0096D6]/30 pointer-events-none"
                style={{
                  boxShadow: "0 0 40px rgba(0, 150, 214, 0.05)"
                }}
              />

              {/* Inner Orbit Track (Radius: 160px) */}
              <div
                className="absolute w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] rounded-full border border-slate-200/90 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 30px rgba(0, 92, 230, 0.04)"
                }}
              />

              {/* Core Central Hub */}
              <div
                className="relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-[#005CE6] via-[#0074F0] to-[#0096D6] shadow-[0_10px_35px_rgba(0,92,230,0.35)] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setIsPaused(!isPaused)}
                title="Click to pause / resume orbits"
              >
                <div className="w-full h-full rounded-[22px] bg-white flex flex-col items-center justify-center text-center p-2 border border-white/40 shadow-inner">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#005CE6] to-[#0096D6] flex items-center justify-center text-white mb-1 shadow-xs">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-extrabold text-[#005CE6] tracking-tight leading-tight">
                    QUANT CORE
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 font-mono">
                    35Q / 20M
                  </span>
                </div>

                {/* Radar Ripple Effect */}
                <span className="absolute -inset-3 rounded-3xl border border-[#005CE6]/30 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
              </div>

              {/* Orbiting Satellite Container */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center pointer-events-none",
                  isPaused ? "" : "animate-spin-very-slow"
                )}
                style={{ animationDuration: "50s" }}
              >
                {ORBIT_NODES.map((node) => {
                  const Icon = node.icon;
                  const isSelected = activeNode.id === node.id;
                  
                  // Compute positions based on radius and angle
                  // Adjust radius for mobile vs desktop
                  const rad = (node.angle * Math.PI) / 180;
                  // We position via translate on the wrapper
                  return (
                    <div
                      key={node.id}
                      className="absolute pointer-events-auto"
                      style={{
                        transform: `rotate(${node.angle}deg) translate(${node.orbitRadius > 180 ? 190 : 130}px) rotate(-${node.angle}deg)`
                      }}
                    >
                      {/* Counter-rotation to keep the node upright! */}
                      <div
                        className={cn(
                          "transition-transform duration-200",
                          isPaused ? "" : "animate-spin-reverse-slow"
                        )}
                        style={{ animationDuration: "50s" }}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveNode(node)}
                          onMouseEnter={() => {
                            setActiveNode(node);
                            setIsPaused(true);
                          }}
                          onMouseLeave={() => setIsPaused(false)}
                          className={cn(
                            "group relative flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-[#162238] border shadow-md transition-all duration-300 hover:scale-115 cursor-pointer text-left",
                            isSelected
                              ? "border-[#005CE6] ring-3 ring-[#005CE6]/20 shadow-[0_8px_25px_rgba(0,92,230,0.22)] scale-110"
                              : "border-slate-200/90 dark:border-slate-700 hover:border-[#0096D6]/60"
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs",
                              node.accentBg,
                              node.accentBorder
                            )}
                          >
                            <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" style={{ color: node.color }} />
                          </div>

                          <div className="hidden sm:block pr-1">
                            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight whitespace-nowrap">
                              {node.name}
                            </p>
                            <span className="text-[9px] font-medium text-slate-400 dark:text-slate-400 block whitespace-nowrap font-mono">
                              {node.category}
                            </span>
                          </div>

                          {/* Active Ping Dot */}
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005CE6] opacity-75" />
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#005CE6]" />
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating controls hint */}
              <div className="absolute bottom-2 text-center pointer-events-none">
                <span className="text-[11px] font-medium text-slate-400 bg-slate-50/80 px-3 py-1 rounded-full border border-slate-200/60">
                  {isPaused ? "⏸ Orbiting Paused" : "✨ Orbiting Active — Hover any node to inspect"}
                </span>
              </div>
            </div>

            {/* Right: Active Node Detail Inspector Card (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
              <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-white via-[#F8FBFF] to-white dark:from-[#162238] dark:via-[#111A2E] dark:to-[#162238] border border-[#BCEBFC] dark:border-slate-700 shadow-sm space-y-5">
                
                {/* Node Status Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 font-mono uppercase tracking-wider">
                      Live Subsystem
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#005CE6] dark:text-blue-300 bg-[#E0F4FD] dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-[#BCEBFC] dark:border-blue-800">
                    {activeNode.metric}
                  </span>
                </div>

                {/* Node Title & Icon */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs",
                      activeNode.accentBg,
                      activeNode.accentBorder
                    )}
                  >
                    {React.createElement(activeNode.icon, {
                      className: "w-6 h-6",
                      style: { color: activeNode.color }
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0F172A] dark:text-white leading-snug">
                      {activeNode.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                      {activeNode.category}
                    </p>
                  </div>
                </div>

                {/* Node Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeNode.description}
                </p>

                {/* Integration Checklist Points */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                  {[
                    "Zero latency synchronized countdown timer",
                    "IBPS Prelims standard -0.25 penalty weighting",
                    "Instant step-by-step breakdown with digital roots & unit digit rules"
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA for Active Module */}
                <div className="pt-2">
                  <Link
                    href="/tests"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#005CE6] to-[#0096D6] hover:from-[#004ecc] hover:to-[#007cb3] transition-all duration-200 shadow-xs hover:shadow cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Launch Calibrated Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Quick Topic Drills selector pills */}
              <div className="flex flex-wrap gap-2">
                {ORBIT_NODES.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setActiveNode(n)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                      activeNode.id === n.id
                        ? "bg-[#005CE6] text-white border-[#005CE6] shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:border-[#005CE6]/30 hover:bg-slate-50"
                    )}
                  >
                    {n.name}
                  </button>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Feature Cards Grid (4 Columns) matching project palette */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Clock,
              title: "Sectional Clock Sync",
              desc: "Authentic 20-minute per-section lockdown. Auto-locks section upon timeout without manual override.",
              color: "#005CE6",
              accent: "bg-blue-50 text-[#005CE6] border-[#BCEBFC]"
            },
            {
              icon: Zap,
              title: "Instant Speed Shortcuts",
              desc: "Calculated digital root checks, split percentages, and quadratic sign shortcuts on every solution.",
              color: "#0096D6",
              accent: "bg-cyan-50 text-[#0096D6] border-[#BCEBFC]"
            },
            {
              icon: Target,
              title: "Exact IBPS Interface",
              desc: "Identical 5-color palette question rail (Answered, Not Answered, Marked for Review, Not Visited).",
              color: "#10B981",
              accent: "bg-emerald-50 text-emerald-600 border-emerald-200"
            },
            {
              icon: Brain,
              title: "AI Attempt Diagnostics",
              desc: "Pinpoint whether marks were lost to time depletion, calculation slips, or question selection traps.",
              color: "#8B5CF6",
              accent: "bg-purple-50 text-purple-600 border-purple-200"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#005CE6]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border mb-4 group-hover:scale-110 transition-transform", item.accent)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#0F172A] mb-1.5 group-hover:text-[#005CE6] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#005CE6] group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Features10;
