'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { INITIAL_TOPICS } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Lightbulb,
  ShieldCheck,
  Loader2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  X,
  Play,
  ChevronDown,
  Check,
  Calculator,
  Hash,
  Activity,
  IndianRupee,
  Percent,
  Scale,
  Hourglass,
  Gauge,
  Table,
  PieChart,
} from 'lucide-react';
import { Topic } from '@/lib/types';

interface TopicMeta {
  id: string;
  name: string;
  group: 'Number-based' | 'Arithmetic' | 'DI';
  examWeight: string;
  targetPace: string;
  conceptSummary: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  shortcuts: string[];
}

const TOPICS_METADATA: Record<string, TopicMeta> = {
  'simplification': {
    id: 'simplification',
    name: 'Simplification & Approximation',
    group: 'Number-based',
    examWeight: '5 - 10 Qs in Prelims',
    targetPace: '20 - 25s per Q',
    conceptSummary: 'BODMAS priority, percentage-fraction equivalence, unit digit filtering, and square/cube roots.',
    difficulty: 'Easy',
    shortcuts: ['Unit digit check', 'Fraction table shortcuts', 'Digital sum elimination'],
  },
  'quadratic-equations': {
    id: 'quadratic-equations',
    name: 'Quadratic Equations',
    group: 'Number-based',
    examWeight: '5 Qs in Prelims',
    targetPace: '30s per Q',
    conceptSummary: 'Root comparison between X and Y without quadratic formula using direct sign-inversion methods.',
    difficulty: 'Easy',
    shortcuts: ['Sign method rule', 'Constant negative rule', 'Co-efficient cross-multiply'],
  },
  'number-series': {
    id: 'number-series',
    name: 'Number Series',
    group: 'Number-based',
    examWeight: '5 Qs in Prelims',
    targetPace: '35 - 45s per Q',
    conceptSummary: 'Missing number and wrong term identification via multi-layer difference, primes, and alternating powers.',
    difficulty: 'Moderate',
    shortcuts: ['Double difference tree', 'Prime squares pattern', 'Alternating decimal multiply'],
  },
  'profit-and-loss': {
    id: 'profit-and-loss',
    name: 'Profit and Loss',
    group: 'Arithmetic',
    examWeight: '1 - 2 Qs in Prelims',
    targetPace: '45 - 60s per Q',
    conceptSummary: 'Cost price, selling price, marked price, successive discounts, and dishonest dealer ratios.',
    difficulty: 'Moderate',
    shortcuts: ['CP to MP ratio formula', 'Net successive discount rule', 'Base ratio equating'],
  },
  'percentage': {
    id: 'percentage',
    name: 'Percentage',
    group: 'Arithmetic',
    examWeight: '1 - 2 Qs in Prelims',
    targetPace: '30 - 40s per Q',
    conceptSummary: 'Fractional equivalents (1/2 to 1/20), percentage change, population growth, and revenue expenditure.',
    difficulty: 'Easy',
    shortcuts: ['AB-rule for inverse change', 'Fraction conversion chart', 'Multiplying factor method'],
  },
  'si-ci': {
    id: 'si-ci',
    name: 'Simple & Compound Interest',
    group: 'Arithmetic',
    examWeight: '1 - 2 Qs in Prelims',
    targetPace: '50 - 60s per Q',
    conceptSummary: 'CI vs SI difference formula for 2 and 3 years, effective interest rates, and compounding periods.',
    difficulty: 'Hard',
    shortcuts: ['Effective rate chart (e.g. 10% for 2 yrs = 21%)', 'CI-SI 2-year difference formula', 'Tree ratio method'],
  },
  'ratio-proportion': {
    id: 'ratio-proportion',
    name: 'Ratio and Proportion',
    group: 'Arithmetic',
    examWeight: '1 - 2 Qs in Prelims',
    targetPace: '40s per Q',
    conceptSummary: 'Direct & inverse variation, mean/third/fourth proportional, mixture replacement, and partnership profit shares.',
    difficulty: 'Moderate',
    shortcuts: ['Compound ratio multiplication', 'Alligation cross-rule', 'Investment-time product rule'],
  },
  'time-and-work': {
    id: 'time-and-work',
    name: 'Time and Work',
    group: 'Arithmetic',
    examWeight: '1 - 2 Qs in Prelims',
    targetPace: '45 - 55s per Q',
    conceptSummary: 'LCM efficiency method, wages division by work, alternate day working, and pipes & cisterns emptying.',
    difficulty: 'Moderate',
    shortcuts: ['LCM total units assumption', 'Efficiency ratio inversion', 'Negative work method for leaks'],
  },
  'time-speed-distance': {
    id: 'time-speed-distance',
    name: 'Time, Speed and Distance',
    group: 'Arithmetic',
    examWeight: '1 - 2 Qs in Prelims',
    targetPace: '50 - 60s per Q',
    conceptSummary: 'Relative speed in opposite and same directions, train crossing pole vs platform, and boat upstream/downstream.',
    difficulty: 'Hard',
    shortcuts: ['km/h to m/s conversion (x 5/18)', 'Harmonic mean average speed', 'Boats upstream/downstream shortcut'],
  },
  'tabular-di': {
    id: 'tabular-di',
    name: 'Tabular Data Interpretation',
    group: 'DI',
    examWeight: '5 Qs in Prelims',
    targetPace: '35s per Q',
    conceptSummary: 'Multi-column data tables, missing table values, ratio comparison, and percentage growth calculations.',
    difficulty: 'Moderate',
    shortcuts: ['Approximate division', 'Cross-multiplication comparison', 'Columnar summation trick'],
  },
  'bar-pie-di': {
    id: 'bar-pie-di',
    name: 'Bar & Pie Chart DI',
    group: 'DI',
    examWeight: '5 Qs in Prelims',
    targetPace: '35s per Q',
    conceptSummary: 'Degree to percentage conversions (360° = 100%), dual pie charts, stacked bar comparisons, and trend extraction.',
    difficulty: 'Moderate',
    shortcuts: ['1% = 3.6° degree factor', 'Direct percentage ratio comparison', 'Visual bar delta estimation'],
  },
};

const TOOLBAR_TOPIC_GROUPS = [
  {
    category: 'Speed Math & Number Systems',
    items: [
      { id: 'simplification', name: 'Simplification & Approx', badge: '5 - 10 Qs in Prelims', icon: Calculator, color: 'text-blue-600 bg-blue-50' },
      { id: 'quadratic-equations', name: 'Quadratic Equations', badge: '5 Qs in Prelims', icon: Hash, color: 'text-indigo-600 bg-indigo-50' },
      { id: 'number-series', name: 'Number Series', badge: '5 Qs in Prelims', icon: Activity, color: 'text-cyan-600 bg-cyan-50' },
      { id: 'all_mixed', name: 'Mixed Speed Math Drill', badge: 'Randomized fast set', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
    ],
  },
  {
    category: 'Commercial Arithmetic',
    items: [
      { id: 'profit-and-loss', name: 'Profit and Loss', badge: 'Markup & Discounts', icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50' },
      { id: 'percentage', name: 'Percentage', badge: 'Fractions & Base Change', icon: Percent, color: 'text-teal-600 bg-teal-50' },
      { id: 'si-ci', name: 'Simple & Compound Interest', badge: 'Effective Rate Formula', icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
      { id: 'ratio-proportion', name: 'Ratio & Proportion', badge: 'Partnership & Mixtures', icon: Scale, color: 'text-sky-600 bg-sky-50' },
      { id: 'time-and-work', name: 'Time and Work', badge: 'LCM Efficiency Method', icon: Hourglass, color: 'text-rose-600 bg-rose-50' },
      { id: 'time-speed-distance', name: 'Time, Speed & Distance', badge: 'Trains & Boats/Streams', icon: Gauge, color: 'text-orange-600 bg-orange-50' },
    ],
  },
  {
    category: 'Data Interpretation',
    items: [
      { id: 'tabular-di', name: 'Tabular Data Interpretation', badge: '5 Qs in Prelims', icon: Table, color: 'text-blue-700 bg-blue-50' },
      { id: 'bar-pie-di', name: 'Bar & Pie Chart DI', badge: '5 Qs in Prelims', icon: PieChart, color: 'text-violet-600 bg-violet-50' },
    ],
  },
];

export default function TopicDrillsHubPage() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<'All' | 'Number-based' | 'Arithmetic' | 'DI'>('All');
  const [feedbackMode, setFeedbackMode] = useState<'practice' | 'exam'>('practice');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [toolbarTopic, setToolbarTopic] = useState<string>('simplification');
  const [topicDropdownOpen, setTopicDropdownOpen] = useState<boolean>(false);
  const topicDropdownRef = useRef<HTMLDivElement>(null);
  const [loadingTopicId, setLoadingTopicId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(event.target as Node)) {
        setTopicDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTopicItem = useMemo(() => {
    for (const group of TOOLBAR_TOPIC_GROUPS) {
      const found = group.items.find((item) => item.id === toolbarTopic);
      if (found) return found;
    }
    return TOOLBAR_TOPIC_GROUPS[0].items[0];
  }, [toolbarTopic]);

  // Customizer Modal State (Replaces redirecting to mock tests)
  const [customizingTopic, setCustomizingTopic] = useState<Topic | null>(null);
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(10);
  const [customFeedbackMode, setCustomFeedbackMode] = useState<'practice' | 'exam'>('practice');
  const [customDurationMin, setCustomDurationMin] = useState<number>(10);
  const [isStartingCustom, setIsStartingCustom] = useState<boolean>(false);

  const filteredTopics = INITIAL_TOPICS.filter((t) => {
    if (selectedGroup === 'All') return true;
    return t.group_name === selectedGroup;
  });

  const handleStartDrill = async (topicId: string, count = questionCount, mode = feedbackMode, duration?: number) => {
    setLoadingTopicId(topicId);
    setErrorMsg(null);
    try {
      const topicList = topicId === 'all_mixed'
        ? ['simplification', 'quadratic-equations', 'number-series', 'profit-and-loss']
        : [topicId];

      const res = await fetch('/api/test/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: 'ibps-po-prelims-2026',
          mode: 'topic_test',
          topics: topicList,
          question_count: count,
          duration_min: duration !== undefined ? duration : (mode === 'practice' ? undefined : Math.ceil(count * 0.8)),
          feedback_mode: mode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to start topic drill');
      }

      router.push(`/tests/${data.test_id}/instructions`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error initializing drill. Please try again.');
      setLoadingTopicId(null);
    }
  };

  const openCustomizer = (topic: Topic) => {
    setCustomizingTopic(topic);
    setCustomQuestionCount(questionCount);
    setCustomFeedbackMode(feedbackMode);
    setCustomDurationMin(Math.ceil(questionCount * 0.8));
  };

  const handleLaunchCustomDrill = async () => {
    if (!customizingTopic) return;
    setIsStartingCustom(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/test/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: 'ibps-po-prelims-2026',
          mode: 'topic_test',
          topics: [customizingTopic.id],
          question_count: customQuestionCount,
          duration_min: customFeedbackMode === 'practice' ? undefined : customDurationMin,
          feedback_mode: customFeedbackMode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to launch customized drill');
      }

      router.push(`/tests/${data.test_id}/instructions`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error initializing custom drill. Please try again.');
      setIsStartingCustom(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FDFF] dark:bg-[#121212] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#BCEBFC] dark:border-slate-800">
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Topic Drills &amp; Practice
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Drill down into individual chapters with instant step-by-step mathematical derivations, speed shortcuts, and 0 negative penalty deductions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/tests"
              className="px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#BCEBFC] dark:border-slate-700 text-[#005CE6] dark:text-blue-400 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Full Mock Exams (35 Qs)</span>
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Global Drill Settings & Quick Launch Toolbar (Directly Leads to Test) */}
        <div className="p-4 sm:p-6 rounded-3xl neu-glass-card space-y-5 border border-blue-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
              {/* Feedback Mode Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">Mode:</span>
                <div className="inline-flex p-1 rounded-xl bg-[#E0F4FD]/70 dark:bg-[#181818] border border-[#BCEBFC] dark:border-[#2C2C2C]">
                  <button
                    onClick={() => setFeedbackMode('practice')}
                    className={cn(
                      "px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                      feedbackMode === 'practice'
                        ? "bg-[#005CE6] dark:bg-[#333333] text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>Practice Mode</span>
                    <span className="hidden sm:inline">(Instant Solutions)</span>
                  </button>
                  <button
                    onClick={() => setFeedbackMode('exam')}
                    className={cn(
                      "px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                      feedbackMode === 'exam'
                        ? "bg-[#005CE6] dark:bg-[#333333] text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Timed Exam Clock</span>
                  </button>
                </div>
              </div>

              {/* Question Count Preset */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Questions:</span>
                <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                        questionCount === num
                          ? "bg-white text-[#005CE6] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Modern Topic Dropdown with Topic Icons */}
              <div className="relative" ref={topicDropdownRef}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Topic:</span>
                  <button
                    type="button"
                    onClick={() => setTopicDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#005CE6] shadow-2xs text-xs font-bold text-slate-800 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#005CE6]/30"
                    aria-expanded={topicDropdownOpen}
                  >
                    <div className={cn("w-5 h-5 rounded-md flex items-center justify-center shrink-0", currentTopicItem.color)}>
                      <currentTopicItem.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate max-w-[150px] sm:max-w-[190px] text-slate-900">
                      {currentTopicItem.name}
                    </span>
                    <ChevronDown className={cn(
                      "w-3.5 h-3.5 text-slate-400 group-hover:text-[#005CE6] transition-transform duration-200",
                      topicDropdownOpen && "rotate-180 text-[#005CE6]"
                    )} />
                  </button>
                </div>

                {/* Dropdown Menu Popup with Topic Icons */}
                {topicDropdownOpen && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 max-h-[390px] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-[#BCEBFC] shadow-[0_12px_40px_rgba(0,92,230,0.18)] p-2 z-50 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
                    {TOOLBAR_TOPIC_GROUPS.map((group) => (
                      <div key={group.category} className="py-1.5 first:pt-0.5 last:pb-0.5">
                        <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          {group.category}
                        </div>
                        <div className="space-y-0.5 mt-0.5">
                          {group.items.map((item) => {
                            const isSelected = toolbarTopic === item.id;
                            const IconComp = item.icon;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setToolbarTopic(item.id);
                                  setTopicDropdownOpen(false);
                                }}
                                className={cn(
                                  "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer group",
                                  isSelected
                                    ? "bg-[#F0FAFF] text-[#005CE6] font-bold"
                                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                )}
                              >
                                <div className="flex items-center gap-2.5 pr-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border border-slate-100/80 group-hover:scale-105 transition-transform",
                                    item.color
                                  )}>
                                    <IconComp className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="space-y-0.5">
                                    <div className="text-xs leading-snug">{item.name}</div>
                                    <div className="text-[10px] text-slate-400 group-hover:text-slate-500 font-normal">
                                      {item.badge}
                                    </div>
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-[#005CE6] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                    <Check className="w-3 h-3 stroke-[2.5]" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Test Launch Button in Toolbar */}
            <button
              onClick={() => handleStartDrill(toolbarTopic, questionCount, feedbackMode)}
              disabled={loadingTopicId === toolbarTopic}
              className="w-full lg:w-auto py-2.5 px-6 rounded-2xl bg-gradient-to-r from-[#005CE6] via-[#006DE6] to-[#0096D6] hover:from-[#004dc2] hover:to-[#007cd6] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {loadingTopicId === toolbarTopic ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Launching Drill...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Drill Now ({questionCount} Qs)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-[11.5px] text-slate-600 dark:text-slate-400 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#2C2C2C]">
            {feedbackMode === 'practice' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#005CE6] dark:text-blue-400 shrink-0" />
                <span>
                  <strong>Instant Practice Active:</strong> Real-time option verification, speed calculation shortcuts, distractor trap analysis, ambient per-question stopwatch, and 0 negative penalty deductions.
                </span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-[#005CE6] dark:text-blue-400 shrink-0" />
                <span>
                  <strong>Timed Exam Active:</strong> Strict {Math.ceil(questionCount * 0.8)}-minute countdown timer with -0.25 negative marks. Full solutions revealed on the final results page.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedGroup('All')}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer",
              selectedGroup === 'All'
                ? "bg-[#005CE6] text-white border-[#005CE6] shadow-xs"
                : "bg-white text-slate-700 border-[#BCEBFC] hover:bg-slate-50"
            )}
          >
            All Topics ({INITIAL_TOPICS.length})
          </button>
          <button
            onClick={() => setSelectedGroup('Number-based')}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer",
              selectedGroup === 'Number-based'
                ? "bg-[#005CE6] text-white border-[#005CE6] shadow-xs"
                : "bg-white text-slate-700 border-[#BCEBFC] hover:bg-slate-50"
            )}
          >
            Speed Math &amp; Number Series (3)
          </button>
          <button
            onClick={() => setSelectedGroup('Arithmetic')}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer",
              selectedGroup === 'Arithmetic'
                ? "bg-[#005CE6] text-white border-[#005CE6] shadow-xs"
                : "bg-white text-slate-700 border-[#BCEBFC] hover:bg-slate-50"
            )}
          >
            Commercial Arithmetic (6)
          </button>
          <button
            onClick={() => setSelectedGroup('DI')}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer",
              selectedGroup === 'DI'
                ? "bg-[#005CE6] text-white border-[#005CE6] shadow-xs"
                : "bg-white text-slate-700 border-[#BCEBFC] hover:bg-slate-50"
            )}
          >
            Data Interpretation (2)
          </button>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
            const meta = TOPICS_METADATA[topic.id] || {
              id: topic.id,
              name: topic.name,
              group: topic.group_name as any,
              examWeight: 'Prelims Topic',
              targetPace: '30s per Q',
              conceptSummary: 'Essential bank exam quantitative aptitude problem set.',
              difficulty: 'Moderate',
              shortcuts: ['Standard speed shortcut'],
            };

            const isLoading = loadingTopicId === topic.id;

            return (
              <div
                key={topic.id}
                className="neu-glass-card rounded-3xl p-6 flex flex-col justify-between hover:shadow-md hover:border-[#005CE6]/40 dark:hover:border-blue-500/50 transition-all group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-end">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {meta.targetPace}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#005CE6] dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {meta.conceptSummary}
                    </p>
                  </div>

                  {/* Improvised Exam Weightage & Difficulty Metrics Card */}
                  <div className="grid grid-cols-2 gap-2 p-2 rounded-2xl bg-gradient-to-b from-[#F8FCFF] via-[#F1F8FD] to-[#EAF5FC] dark:from-[#181818] dark:via-[#232323] dark:to-[#181818] border border-[#BCEBFC] dark:border-[#2C2C2C] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,92,230,0.03)] dark:shadow-none">
                    {/* Weightage Block */}
                    <div className="px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#252525] border border-[#D6EEFC] dark:border-[#2C2C2C] flex flex-col justify-center shadow-2xs">
                      <div className="flex items-center gap-1 text-[9.5px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                        <Target className="w-3 h-3 text-[#005CE6] dark:text-blue-400" />
                        <span>Weightage</span>
                      </div>
                      <span className="text-xs font-black text-[#005CE6] dark:text-blue-400 tracking-tight truncate">
                        {meta.examWeight}
                      </span>
                    </div>

                    {/* Difficulty Block */}
                    <div className="px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#252525] border border-[#D6EEFC] dark:border-[#2C2C2C] flex flex-col justify-center shadow-2xs">
                      <div className="flex items-center gap-1 text-[9.5px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                        <Flame className={cn(
                          "w-3 h-3",
                          meta.difficulty === 'Easy' ? "text-emerald-500" : meta.difficulty === 'Moderate' ? "text-amber-500" : "text-rose-500"
                        )} />
                        <span>Difficulty</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          meta.difficulty === 'Easy' ? "bg-emerald-500" : meta.difficulty === 'Moderate' ? "bg-amber-500" : "bg-rose-500"
                        )} />
                        <span className={cn(
                          "text-xs font-black tracking-tight",
                          meta.difficulty === 'Easy' ? "text-emerald-700 dark:text-emerald-400" : meta.difficulty === 'Moderate' ? "text-amber-700 dark:text-amber-400" : "text-rose-700 dark:text-rose-400"
                        )}>
                          {meta.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shortcuts preview */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                      Speed Shortcuts Covered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {meta.shortcuts.map((sc, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-[#252525] border border-slate-200 dark:border-[#2C2C2C] text-[10.5px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleStartDrill(topic.id, questionCount, feedbackMode)}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#005CE6] to-[#007AE6] hover:from-[#004dc2] hover:to-[#0066cc] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Starting Drill...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Start {questionCount}-Q Drill</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Customization Setting Button (Now opens dedicated Topic Drill Settings Modal without redirecting) */}
                  <button
                    type="button"
                    onClick={() => openCustomizer(topic)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-[#2C2C2C] hover:border-[#005CE6]/40 hover:bg-blue-50/50 dark:hover:bg-[#282828] dark:hover:border-blue-500/40 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title={`Configure custom drill settings for ${topic.name}`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Topic Drill Customizer Modal */}
        {customizingTopic && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#2C2C2C] p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2C2C2C] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#005CE6] dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customize Drill Settings</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{customizingTopic.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setCustomizingTopic(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Setting */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Learning Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomFeedbackMode('practice')}
                    className={cn(
                      "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                      customFeedbackMode === 'practice'
                        ? "bg-blue-50 dark:bg-[#282828] border-blue-400 dark:border-[#404040] text-blue-900 dark:text-white ring-2 ring-blue-400/20 dark:ring-white/10 shadow-xs"
                        : "bg-white dark:bg-[#252525] border-slate-200 dark:border-[#333333] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-[#444444]"
                    )}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-[#005CE6] dark:text-blue-400" />
                      <span>Practice Mode</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Instant solutions, shortcuts &amp; 0 negative marking penalty.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomFeedbackMode('exam')}
                    className={cn(
                      "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                      customFeedbackMode === 'exam'
                        ? "bg-blue-50 dark:bg-[#282828] border-blue-400 dark:border-[#404040] text-blue-900 dark:text-white ring-2 ring-blue-400/20 dark:ring-white/10 shadow-xs"
                        : "bg-white dark:bg-[#252525] border-slate-200 dark:border-[#333333] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-[#444444]"
                    )}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#005CE6] dark:text-blue-400" />
                      <span>Timed Exam</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Countdown timer with -0.25 negative marks &amp; final score report.
                    </p>
                  </button>
                </div>
              </div>

              {/* Question Count Setting */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCustomQuestionCount(num)}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                        customQuestionCount === num
                          ? "bg-[#005CE6] dark:bg-[#333333] text-white border-[#005CE6] dark:border-[#444444] shadow-xs"
                          : "bg-white dark:bg-[#252525] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#333333] hover:bg-slate-50 dark:hover:bg-[#2c2c2c]"
                      )}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Setting (For Exam Mode) */}
              {customFeedbackMode === 'exam' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Countdown Duration
                    </label>
                    <span className="text-xs font-mono font-bold text-[#005CE6] dark:text-blue-400">{customDurationMin} Minutes</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 8, 12, 15].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setCustomDurationMin(mins)}
                        className={cn(
                          "py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                          customDurationMin === mins
                            ? "bg-slate-900 dark:bg-[#333333] text-white border-slate-900 dark:border-[#444444] shadow-xs"
                            : "bg-white dark:bg-[#252525] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#333333] hover:bg-slate-50 dark:hover:bg-[#2c2c2c]"
                        )}
                      >
                        {mins} Mins
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCustomizingTopic(null)}
                  className="w-1/3 py-3 rounded-2xl border border-slate-200 dark:border-[#333333] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#282828] font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLaunchCustomDrill}
                  disabled={isStartingCustom}
                  className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-[#005CE6] to-[#007AE6] hover:from-[#004dc2] hover:to-[#0066cc] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isStartingCustom ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Launching Drill...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Launch Custom Drill</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
