'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { INITIAL_TOPICS, INITIAL_QUESTIONS, INITIAL_KEYS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import { Question, QuestionKey } from '@/lib/types';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  HelpCircle,
  Lightbulb,
  FileText,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  RotateCcw,
  ChevronRight,
  Flame,
  Award,
  Layers,
  GraduationCap,
  Calculator,
  ChevronDown,
  Info,
  Check,
} from 'lucide-react';

// Topic Shortcut & Formula Cheat Sheets
const TOPIC_CHEAT_SHEETS: Record<
  string,
  { title: string; summary: string; formulas: { name: string; latex: string; note: string }[] }
> = {
  'quadratic-equations': {
    title: 'Quadratic Equations Speed Rules',
    summary: 'Direct sign method enables solving 5 comparison questions in under 90 seconds.',
    formulas: [
      {
        name: 'The Golden Sign Method',
        latex: '(+, +) \\to (-, -) \\quad | \\quad (-, +) \\to (+, +) \\quad | \\quad (+, -) \\to (-, +) \\quad | \\quad (-, -) \\to (+, -)',
        note: 'First sign always flips. Second sign changes if the first was negative.',
      },
      {
        name: 'Free 5-Second Win Rule',
        latex: 'ax^2 + bx - c = 0 \\quad \\& \\quad py^2 + qy - r = 0 \\implies \\text{No Relation}',
        note: 'If both constant terms have negative signs, roots will be (+, -) and (+, -), which always leads to overlap.',
      },
    ],
  },
  'simplification': {
    title: 'Speed Math & Fraction Cheat Sheet',
    summary: 'Standard fraction percentage equivalents for rapid mental simplification.',
    formulas: [
      {
        name: 'Common Unit Fractions',
        latex: '\\frac{1}{6} = 16.67\\%, \\quad \\frac{1}{7} = 14.28\\%, \\quad \\frac{1}{8} = 12.5\\%, \\quad \\frac{1}{9} = 11.11\\%',
        note: 'Memorize up to 1/20 for clerical and PO numerical ability.',
      },
      {
        name: 'Difference of Squares Shortcut',
        latex: 'a^2 - b^2 = (a - b)(a + b)',
        note: 'Ideal for expressions like 47² - 43² = (4)(90) = 360.',
      },
    ],
  },
  'number-series': {
    title: 'Number Series Pattern Archetypes',
    summary: 'Recognize the 4 foundational sequence patterns immediately.',
    formulas: [
      {
        name: 'Difference of Differences',
        latex: '\\Delta_1, \\Delta_2, \\Delta_3 \\implies \\Delta^2 = \\text{constant or arithmetic progression}',
        note: 'Always compute first level differences before trying complex multiplicative rules.',
      },
      {
        name: 'Multiplication + Addition Pattern',
        latex: 'T_{n} = T_{n-1} \\times k \\pm c \\quad \\text{where } k \\in \\{0.5, 1, 1.5, 2, 2.5\\}',
        note: 'When values approximately double or triple each step, check this rule.',
      },
    ],
  },
  'profit-and-loss': {
    title: 'Profit, Loss & Successive Discount',
    summary: 'Eliminate multi-step equations using percentage multipliers.',
    formulas: [
      {
        name: 'Net Percentage Change (Successive)',
        latex: '\\text{Net } \\% = a + b + \\frac{ab}{100}',
        note: 'Use negative signs for discounts and losses.',
      },
      {
        name: 'Marked Price to Cost Price Ratio',
        latex: '\\frac{\\text{MP}}{\\text{CP}} = \\frac{100 + \\text{Profit}\\%}{100 - \\text{Discount}\\%}',
        note: 'Single-line solution when profit and discount percentages are both given.',
      },
    ],
  },
  'percentage': {
    title: 'Percentage Conversion & Reciprocal Rules',
    summary: 'Product constancy rule for price-consumption questions.',
    formulas: [
      {
        name: 'Product Constancy Rule',
        latex: '\\text{If } A \\text{ increases by } \\frac{1}{x}, \\text{ then } B \\text{ decreases by } \\frac{1}{x+1}',
        note: 'If price rises by 25% (+1/4), consumption must reduce by 1/5 (20%) to keep budget constant.',
      },
    ],
  },
  'si-ci': {
    title: 'Simple & Compound Interest Differences',
    summary: 'Instant formulas for bank exam 2-year and 3-year CI-SI differences.',
    formulas: [
      {
        name: '2-Year Difference Formula',
        latex: '\\text{Difference} = P \\left(\\frac{R}{100}\\right)^2',
        note: 'Extremely high frequency question in IBPS PO and SBI Clerk prelims.',
      },
      {
        name: '3-Year Difference Formula',
        latex: '\\text{Difference} = P \\left(\\frac{R}{100}\\right)^2 \\times \\left(3 + \\frac{R}{100}\\right)',
        note: 'Use effective percentage breakdown to avoid cubing large numbers.',
      },
    ],
  },
  'ratio-proportion': {
    title: 'Ratio & Mixture Replacement Rules',
    summary: 'Cross multiplication method for income-expenditure pairs.',
    formulas: [
      {
        name: 'Cross Multiplication for Savings',
        latex: '\\Delta = |(A_1 \\times B_2) - (A_2 \\times B_1)| = \\text{Units Difference}',
        note: 'Equate to the difference in cross products of savings.',
      },
    ],
  },
  'time-and-work': {
    title: 'LCM Total Work & Unit Efficiency Method',
    summary: 'Convert day-based rates into discrete work units.',
    formulas: [
      {
        name: 'LCM Unit Work Rule',
        latex: '\\text{Total Work} = \\text{LCM}(D_1, D_2, \\dots) \\implies \\text{Efficiency} = \\frac{\\text{Total Work}}{\\text{Days}}',
        note: 'Never use 1/x fractions; integers are 5x faster and prevent arithmetic mistakes.',
      },
      {
        name: 'Work & Wages Distribution',
        latex: '\\text{Wage Share} \\propto \\text{Efficiency} \\times \\text{Days Worked}',
        note: 'Divide total monetary compensation in the ratio of actual work units contributed.',
      },
    ],
  },
  'time-speed-distance': {
    title: 'Trains, Relative Speed & Streams',
    summary: 'Crucial unit conversions and relative velocity formulas.',
    formulas: [
      {
        name: 'Unit Conversion Factor',
        latex: '1 \\text{ km/h} = \\frac{5}{18} \\text{ m/s} \\quad | \\quad 1 \\text{ m/s} = \\frac{18}{5} \\text{ km/h}',
        note: 'Remember: 18 km/h = 5 m/s, 36 km/h = 10 m/s, 54 km/h = 15 m/s, 72 km/h = 20 m/s.',
      },
      {
        name: 'Relative Speed',
        latex: '\\text{Opposite Direction} = S_1 + S_2 \\quad | \\quad \\text{Same Direction} = |S_1 - S_2|',
        note: 'For trains passing a platform, Distance = Train Length + Platform Length.',
      },
    ],
  },
  'tabular-di': {
    title: 'Data Interpretation Speed Tactics',
    summary: 'Approximation and fast ratio techniques for table DI.',
    formulas: [
      {
        name: 'Percentage Change Calculation',
        latex: '\\% \\text{ Change} = \\frac{\\text{Final} - \\text{Initial}}{\\text{Initial}} \\times 100',
        note: 'Check options spread first. If options differ by >5%, round numbers to nearest tens.',
      },
    ],
  },
  'bar-pie-di': {
    title: 'Pie Chart Degrees to Percentage Conversion',
    summary: 'Angular ratio shortcuts for circular chart interpretation.',
    formulas: [
      {
        name: 'Degrees to Percent Conversion',
        latex: '360^\\circ = 100\\% \\implies 1\\% = 3.6^\\circ \\quad \\& \\quad 18^\\circ = 5\\%',
        note: 'Calculate angular differences first before converting to actual monetary or population values.',
      },
    ],
  },
};

export default function PracticeHubPage() {
  const [activeTab, setActiveTab] = useState<'topics' | 'bookmarks' | 'revision'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<string>('quadratic-equations');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Number-based' | 'Arithmetic' | 'DI'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Practice Drill States
  const [practiceIdx, setPracticeIdx] = useState<number>(0);
  const [chosenOpt, setChosenOpt] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [timerSec, setTimerSec] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  // Extras
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  const [scratchNotes, setScratchNotes] = useState<string>('');
  const [bookmarks, setBookmarks] = useState<string[]>(['q-profit-1', 'q-series-1']);

  // Session Statistics
  const [sessionStats, setSessionStats] = useState({
    attempted: 0,
    correct: 0,
    streak: 0,
    totalTimeSec: 0,
  });

  // Filter topics based on search & category
  const filteredTopics = useMemo(() => {
    return INITIAL_TOPICS.filter((t) => {
      const matchesCat = selectedCategory === 'all' || t.group_name === selectedCategory;
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Questions for active topic
  const topicQuestions = useMemo(() => {
    const list = INITIAL_QUESTIONS.filter((q) => q.topic_id === selectedTopic);
    return list.length > 0 ? list : [INITIAL_QUESTIONS[0]];
  }, [selectedTopic]);

  const currentQ: Question = topicQuestions[practiceIdx] || topicQuestions[0];
  const currentKey: QuestionKey | undefined = INITIAL_KEYS[currentQ.id];

  // Questions for bookmarks tab
  const bookmarkedQuestions = useMemo(() => {
    return INITIAL_QUESTIONS.filter((q) => bookmarks.includes(q.id));
  }, [bookmarks]);

  // Spaced revision mock schedule
  const spacedRevisionItems = useMemo(() => {
    return [
      {
        question: INITIAL_QUESTIONS.find((q) => q.id === 'q-profit-1') || INITIAL_QUESTIONS[0],
        due: 'Due Today',
        dueColor: 'text-rose-600 bg-rose-50 border-rose-200',
        interval: 'Interval: 1 Day',
        accuracyRetention: '72% retention',
        reason: 'Wrong on 24 Oct (Distractor Trap)',
      },
      {
        question: INITIAL_QUESTIONS.find((q) => q.id === 'q-series-1') || INITIAL_QUESTIONS[0],
        due: 'Due Tomorrow',
        dueColor: 'text-amber-600 bg-amber-50 border-amber-200',
        interval: 'Interval: 3 Days',
        accuracyRetention: '88% retention',
        reason: 'Bookmarked for speed recap',
      },
      {
        question: INITIAL_QUESTIONS.find((q) => q.id === 'q-quad-1') || INITIAL_QUESTIONS[0],
        due: 'In 3 Days',
        dueColor: 'text-blue-600 bg-blue-50 border-blue-200',
        interval: 'Interval: 7 Days',
        accuracyRetention: '95% retention',
        reason: 'Mastery check',
      },
    ];
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && !showSolution) {
      interval = setInterval(() => {
        setTimerSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, showSolution]);

  // Handle Option Selection
  const handleSelectOption = (optId: string) => {
    if (chosenOpt) return;
    setChosenOpt(optId);
    setShowSolution(true);

    const isCorrect = currentKey && optId === currentKey.correct_option;
    setSessionStats((prev) => ({
      attempted: prev.attempted + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      streak: isCorrect ? prev.streak + 1 : 0,
      totalTimeSec: prev.totalTimeSec + timerSec,
    }));
  };

  // Next Question
  const handleNextPractice = () => {
    setChosenOpt(null);
    setShowSolution(false);
    setTimerSec(0);
    if (practiceIdx < topicQuestions.length - 1) {
      setPracticeIdx((prev) => prev + 1);
    } else {
      setPracticeIdx(0);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (qId: string) => {
    setBookmarks((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const isCurrentBookmarked = bookmarks.includes(currentQ.id);
  const activeCheatSheet = TOPIC_CHEAT_SHEETS[selectedTopic] || {
    title: 'Quantitative Aptitude Formula Rule',
    summary: 'Standard mental calculations and unit shortcuts.',
    formulas: [
      {
        name: 'General Arithmetic Rule',
        latex: '\\text{Rate} \\times \\text{Time} = \\text{Total Units}',
        note: 'Break down problem into unit rates.',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 relative selection:bg-[#BCEBFC]">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#60CEF8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#005CE6]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Unified Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-6 z-10">
        {/* Practice Hub Header & Live Session Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-2xl border border-[#BCEBFC] shadow-[0_12px_36px_rgba(0,92,230,0.06)]">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0FAFF] text-[#005CE6] border border-[#BCEBFC]">
              <Sparkles className="w-3.5 h-3.5 text-[#005CE6]" />
              <span>Targeted Quantitative Skill Mastery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Quant Practice &amp; Spaced Drill
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Untimed instant-feedback drills with step-by-step LaTeX derivations, exam shortcuts, and smart spaced revision for Banking Exams.
            </p>
          </div>

          {/* Session Performance Stats Strip */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap bg-[#F8FAFC] p-2 sm:p-2.5 rounded-2xl border border-slate-200/80">
            {/* Accuracy */}
            <div className="px-3 py-1.5 rounded-xl bg-white border border-[#BCEBFC]/60 text-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</div>
              <div className="text-sm font-extrabold text-[#005CE6]">
                {sessionStats.attempted > 0
                  ? `${Math.round((sessionStats.correct / sessionStats.attempted) * 100)}%`
                  : '100%'}
              </div>
            </div>

            {/* Streak */}
            <div className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-center shadow-xs">
              <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3 fill-amber-500" />
                Streak
              </div>
              <div className="text-sm font-extrabold text-amber-600">
                {sessionStats.streak} in a row
              </div>
            </div>

            {/* Solved */}
            <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Solved</div>
              <div className="text-sm font-extrabold text-slate-800">
                {sessionStats.attempted} Qs
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Chips with Neumorphic Inset) */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex rounded-full p-1.5 neu-inset bg-slate-100/90 max-w-xl">
            <button
              onClick={() => setActiveTab('topics')}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === 'topics'
                  ? 'neu-chip-primary text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Topic Practice ({INITIAL_TOPICS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === 'bookmarks'
                  ? 'neu-chip-primary text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Bookmarks ({bookmarks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('revision')}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === 'revision'
                  ? 'neu-chip-primary text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Spaced Revision ({spacedRevisionItems.length})</span>
            </button>
          </div>

          {/* Quick Actions (Formulas & Scratchpad) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              className={`chip-btn text-xs font-bold flex items-center gap-1.5 px-3.5 py-2 transition-all cursor-pointer ${
                showCheatSheet
                  ? 'bg-[#005CE6] text-white border-[#005CE6] shadow-sm'
                  : 'bg-white text-slate-700 hover:border-[#005CE6] hover:text-[#005CE6]'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Topic Shortcuts</span>
            </button>

            <button
              onClick={() => setShowScratchpad(!showScratchpad)}
              className={`chip-btn text-xs font-bold flex items-center gap-1.5 px-3.5 py-2 transition-all cursor-pointer ${
                showScratchpad
                  ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                  : 'bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#005CE6]" />
              <span>Scratchpad</span>
            </button>
          </div>
        </div>

        {/* Collapsible Topic Formula Cheat Sheet */}
        {showCheatSheet && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#F0FAFF] via-white to-[#E0F4FD] border border-[#BCEBFC] shadow-[0_12px_36px_rgba(0,92,230,0.08)] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-[#BCEBFC]/60 pb-3">
              <div className="flex items-center gap-2 text-[#005CE6] font-extrabold text-sm sm:text-base">
                <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>{activeCheatSheet.title}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-[#BCEBFC]">
                Target: 40–50s per Question
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium">{activeCheatSheet.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {activeCheatSheet.formulas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#BCEBFC]/80 space-y-2 shadow-xs"
                >
                  <div className="text-xs font-bold text-[#005CE6]">{item.name}</div>
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200/80 overflow-x-auto text-xs sm:text-sm">
                    <MathRenderer content={`$$${item.latex}$$`} />
                  </div>
                  <div className="text-[11px] text-slate-500 italic">💡 {item.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collapsible Scratchpad */}
        {showScratchpad && (
          <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-700 shadow-xl space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <FileText className="w-4 h-4 text-[#60CEF8]" />
                <span>Candidate Rough Scratchpad (Untimed Calculations)</span>
              </div>
              <button
                onClick={() => setScratchNotes('')}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear Notes
              </button>
            </div>
            <textarea
              value={scratchNotes}
              onChange={(e) => setScratchNotes(e.target.value)}
              placeholder="Jot down rough steps, equations, factorizations or notes here..."
              rows={3}
              className="w-full bg-slate-800/90 text-slate-100 placeholder:text-slate-500 text-xs p-3 rounded-2xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#60CEF8] font-mono resize-y"
            />
          </div>
        )}

        {/* TAB 1: TOPIC PRACTICE */}
        {activeTab === 'topics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 4 Cols: Topic Directory & Category Filter */}
            <div className="lg:col-span-4 space-y-4">
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'Number-based', label: 'Speed Math' },
                    { id: 'Arithmetic', label: 'Arithmetic' },
                    { id: 'DI', label: 'DI' },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#005CE6] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-[#005CE6]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Topic Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quantitative topics..."
                  className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white border border-[#BCEBFC] text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005CE6]/20 transition-all"
                />
              </div>

              {/* Topic Selector List */}
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {filteredTopics.map((topic) => {
                  const isSelected = selectedTopic === topic.id;
                  const qCount = INITIAL_QUESTIONS.filter((q) => q.topic_id === topic.id).length;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopic(topic.id);
                        setPracticeIdx(0);
                        setChosenOpt(null);
                        setShowSolution(false);
                        setTimerSec(0);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer group ${
                        isSelected
                          ? 'border-[#005CE6] bg-gradient-to-r from-[#F0FAFF] to-[#E0F4FD] font-bold text-[#005CE6] shadow-[0_4px_16px_rgba(0,92,230,0.12)] ring-1 ring-[#005CE6]'
                          : 'border-slate-200/90 bg-white hover:border-[#005CE6]/60 hover:bg-[#F0FAFF]/40 text-slate-700 shadow-xs'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 group-hover:text-[#005CE6] transition-colors">
                            {topic.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{topic.group_name}</span>
                          <span>•</span>
                          <span>{qCount > 0 ? `${qCount} Question${qCount > 1 ? 's' : ''}` : '1 Question'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-[#005CE6] font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-[#BCEBFC]">
                          85%
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected ? 'text-[#005CE6] translate-x-0.5' : 'text-slate-300'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 8 Cols: Instant Feedback Drill Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl neu-glass-card space-y-6">
                {/* Question Top Action Bar */}
                <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold px-3 py-1 rounded-full neu-pill text-[#005CE6] text-xs">
                      Instant Feedback Drill
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      Level {currentQ.difficulty_assigned || 2}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Live Speed Pace Meter */}
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-[#005CE6]" />
                      <span>{timerSec}s</span>
                      <span className="text-[10px] text-slate-400 font-sans">
                        {timerSec <= 45 ? '⚡ On Target' : 'Pace Alert'}
                      </span>
                    </div>

                    {/* Bookmark Toggle Button */}
                    <button
                      onClick={() => toggleBookmark(currentQ.id)}
                      className={`p-2 rounded-full border transition-all cursor-pointer ${
                        isCurrentBookmarked
                          ? 'bg-[#005CE6] text-white border-[#005CE6] shadow-xs'
                          : 'bg-white text-slate-400 border-slate-200 hover:text-[#005CE6] hover:border-[#005CE6]'
                      }`}
                      title={isCurrentBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
                      aria-label="Toggle Bookmark"
                    >
                      {isCurrentBookmarked ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    {/* Question Jump Counter */}
                    <span className="text-xs text-slate-500 font-mono font-bold">
                      Q {practiceIdx + 1} of {topicQuestions.length}
                    </span>
                  </div>
                </div>

                {/* Stimulus Table for DI Questions if applicable */}
                {currentQ.stimulus && currentQ.stimulus.chart_type === 'table' && (
                  <div className="p-4 rounded-2xl bg-white border border-[#BCEBFC] space-y-3 shadow-xs">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#005CE6]" />
                      <span>{currentQ.stimulus.title}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-[#F0FAFF] border-b border-[#BCEBFC]">
                            {currentQ.stimulus.structured_data.headers.map((h: string, idx: number) => (
                              <th key={idx} className="p-2.5 font-bold text-slate-700">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentQ.stimulus.structured_data.rows.map((row: string[], rIdx: number) => (
                            <tr key={rIdx} className="border-b border-slate-100 hover:bg-[#F8FAFC]">
                              {row.map((cell: string, cIdx: number) => (
                                <td
                                  key={cIdx}
                                  className={`p-2.5 ${
                                    cIdx === 0 ? 'font-bold text-slate-800' : 'font-mono text-slate-600'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Question Stem (typeset with KaTeX) */}
                <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  <MathRenderer content={currentQ.stem} />
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = chosenOpt === opt.id;
                    const isCorrect = currentKey && opt.id === currentKey.correct_option;

                    let optStyle =
                      'border-slate-200/90 bg-white hover:border-[#005CE6] hover:bg-[#F0FAFF]/30 text-slate-800 shadow-[3px_3px_10px_rgba(0,92,230,0.04),-3px_-3px_10px_rgba(255,255,255,0.9)]';

                    if (chosenOpt) {
                      if (isCorrect) {
                        optStyle =
                          'border-emerald-400 bg-emerald-50 text-emerald-950 font-bold shadow-[inset_2px_2px_6px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500';
                      } else if (isSelected && !isCorrect) {
                        optStyle =
                          'border-rose-400 bg-rose-50 text-rose-950 font-bold shadow-[inset_2px_2px_6px_rgba(239,68,68,0.15)] ring-1 ring-rose-500';
                      }
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${optStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold uppercase font-mono text-xs ${
                              chosenOpt && isCorrect
                                ? 'bg-emerald-600 text-white'
                                : chosenOpt && isSelected && !isCorrect
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <MathRenderer content={opt.text} />
                        </div>

                        {chosenOpt && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                        {chosenOpt && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Immediate Explanation Drawer */}
                {showSolution && currentKey && (
                  <div className="p-6 rounded-3xl neu-inset bg-gradient-to-br from-[#F8FAFC] to-[#F0FAFF] border border-[#BCEBFC] space-y-4 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#BCEBFC]/60 pb-3">
                      <div className="font-extrabold text-emerald-700 flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Correct Key: Option {currentKey.correct_option.toUpperCase()}</span>
                      </div>
                      <div className="text-[11px] font-bold text-[#005CE6] bg-white px-3 py-1 rounded-full border border-[#BCEBFC]">
                        Solved in {timerSec} seconds
                      </div>
                    </div>

                    {/* Step-by-step Math Solution */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Step-by-Step Derivation
                      </div>
                      <div className="leading-relaxed text-slate-800 text-sm bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                        <MathRenderer content={currentKey.solution} />
                      </div>
                    </div>

                    {/* Exam Shortcut Method */}
                    {currentKey.shortcut && (
                      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 font-medium space-y-1">
                        <div className="flex items-center gap-1.5 font-extrabold text-amber-900 text-xs">
                          <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
                          <span>Bank Exam Speed Shortcut:</span>
                        </div>
                        <div className="text-xs leading-relaxed">
                          <MathRenderer content={currentKey.shortcut} />
                        </div>
                      </div>
                    )}

                    {/* Distractor Mistake Rationales */}
                    {currentKey.option_rationales && (
                      <div className="space-y-2 pt-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Why other options are incorrect:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(currentKey.option_rationales).map(([optId, rationale]) => (
                            <div
                              key={optId}
                              className={`p-2.5 rounded-xl border text-[11px] ${
                                optId === currentKey.correct_option
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-semibold'
                                  : 'bg-white border-slate-200/80 text-slate-600'
                              }`}
                            >
                              <span className="font-bold uppercase font-mono mr-1.5">[{optId}]:</span>
                              <span>{rationale}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Next Question Control */}
                {chosenOpt && (
                  <button
                    onClick={handleNextPractice}
                    className="w-full neu-chip-primary uppercase tracking-wider text-xs py-3.5 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Next Practice Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#BCEBFC] shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Bookmarked Questions Collection</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Questions marked during tests or practice for review of tricky calculations and traps.
                </p>
              </div>
              <div className="text-xs font-bold px-3 py-1 rounded-full bg-[#F0FAFF] text-[#005CE6] border border-[#BCEBFC]">
                {bookmarkedQuestions.length} Questions Saved
              </div>
            </div>

            {bookmarkedQuestions.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Questions Bookmarked Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the bookmark icon on any question in the Practice drill to save it here for instant review.
                </p>
                <button
                  onClick={() => setActiveTab('topics')}
                  className="px-5 py-2 rounded-xl bg-[#005CE6] text-white text-xs font-bold"
                >
                  Explore Practice Questions
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarkedQuestions.map((q) => {
                  const key = INITIAL_KEYS[q.id];
                  const topic = INITIAL_TOPICS.find((t) => t.id === q.topic_id);
                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-3xl bg-white border border-[#BCEBFC] space-y-4 shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#005CE6] bg-[#F0FAFF] px-2.5 py-0.5 rounded-full border border-[#BCEBFC]">
                          {topic?.name || q.topic_id}
                        </span>
                        <button
                          onClick={() => toggleBookmark(q.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed line-clamp-3">
                        <MathRenderer content={q.stem} />
                      </div>

                      {key && (
                        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs space-y-1">
                          <div className="font-bold text-emerald-700">
                            Key: Option {key.correct_option.toUpperCase()}
                          </div>
                          {key.shortcut && (
                            <div className="text-[11px] text-slate-600 line-clamp-2">
                              <strong>Shortcut:</strong> {key.shortcut}
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setSelectedTopic(q.topic_id);
                          setActiveTab('topics');
                        }}
                        className="w-full py-2 rounded-xl border border-[#BCEBFC] bg-[#F0FAFF] hover:bg-[#005CE6] hover:text-white text-[#005CE6] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Practice in Topic Drill</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SPACED REVISION */}
        {activeTab === 'revision' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#BCEBFC] shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-[#005CE6]" />
                  <h2 className="text-lg font-bold text-slate-900">Spaced Repetition Review Engine</h2>
                </div>
                <p className="text-xs text-slate-600 max-w-xl">
                  Questions answered incorrectly or flagged for review resurface at scientific intervals (Day 1, Day 3, Day 7) to guarantee long-term retention for the exam.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('topics')}
                className="neu-chip-primary text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Launch Spaced Drill (3 Qs)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {spacedRevisionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.dueColor}`}
                    >
                      {item.due}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{item.interval}</span>
                  </div>

                  <div className="text-xs font-semibold text-slate-900 leading-relaxed line-clamp-3">
                    <MathRenderer content={item.question.stem} />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-[11px] space-y-1">
                    <div className="font-bold text-slate-700">{item.reason}</div>
                    <div className="text-slate-500 font-mono">{item.accuracyRetention}</div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTopic(item.question.topic_id);
                      setActiveTab('topics');
                    }}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#005CE6] hover:text-white text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Solve Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
