'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { INITIAL_TOPICS, INITIAL_QUESTIONS, INITIAL_KEYS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import { Question, QuestionKey } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Lightbulb,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  Flame,
  RotateCcw,
  Maximize2,
  Minimize2,
  BarChart3,
  HelpCircle,
  Sparkles,
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
        note: 'Calculate angular differences first before converting to actual values.',
      },
    ],
  },
};

// Rich topic performance metadata for the sidebar
interface TopicMeta {
  status: 'In progress' | 'Needs review' | 'Mastered' | 'Not started';
  accuracy: number;
  badgeColor: string;
  subtext: string;
}

const TOPIC_METADATA: Record<string, TopicMeta> = {
  'quadratic-equations': {
    status: 'In progress',
    accuracy: 65,
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    subtext: 'Continue practice',
  },
  'simplification': {
    status: 'Mastered',
    accuracy: 94,
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    subtext: 'Speed mastery verified',
  },
  'number-series': {
    status: 'Needs review',
    accuracy: 42,
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    subtext: 'Review wrong patterns',
  },
  'profit-and-loss': {
    status: 'Needs review',
    accuracy: 55,
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    subtext: 'Distractor trap review',
  },
  'percentage': {
    status: 'In progress',
    accuracy: 70,
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    subtext: 'Vote & budget drills',
  },
  'si-ci': {
    status: 'Mastered',
    accuracy: 90,
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    subtext: 'Review due in 3 days',
  },
  'ratio-proportion': {
    status: 'In progress',
    accuracy: 80,
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    subtext: 'Cross-product mastery',
  },
  'time-and-work': {
    status: 'Needs review',
    accuracy: 50,
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    subtext: 'Remaining work trap',
  },
  'time-speed-distance': {
    status: 'Mastered',
    accuracy: 95,
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    subtext: 'Train relative speed',
  },
  'tabular-di': {
    status: 'In progress',
    accuracy: 75,
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    subtext: 'Ratio calculation speed',
  },
  'bar-pie-di': {
    status: 'Mastered',
    accuracy: 88,
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    subtext: 'Degree conversions',
  },
};

export default function PracticeHubPage() {
  const [activeTab, setActiveTab] = useState<'topics' | 'bookmarks' | 'revision'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<string>('quadratic-equations');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Number-based' | 'Arithmetic' | 'DI'>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'weak' | 'in_progress' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Practice Drill States
  const [practiceIdx, setPracticeIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [showDistractorRationales, setShowDistractorRationales] = useState<boolean>(false);
  const [timerSec, setTimerSec] = useState<number>(0);

  // Extras
  const [focusMode, setFocusMode] = useState<boolean>(false);
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

  // Filter topics based on search, category, and status filter
  const filteredTopics = useMemo(() => {
    return INITIAL_TOPICS.filter((t) => {
      const matchesCat = selectedCategory === 'all' || t.group_name === selectedCategory;
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const meta = TOPIC_METADATA[t.id];
      let matchesFilter = true;
      if (selectedFilter === 'weak') matchesFilter = meta?.status === 'Needs review';
      if (selectedFilter === 'in_progress') matchesFilter = meta?.status === 'In progress';
      if (selectedFilter === 'mastered') matchesFilter = meta?.status === 'Mastered';

      return matchesCat && matchesSearch && matchesFilter;
    });
  }, [selectedCategory, searchQuery, selectedFilter]);

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
        reason: 'Distractor trap in successive discount',
      },
      {
        question: INITIAL_QUESTIONS.find((q) => q.id === 'q-series-1') || INITIAL_QUESTIONS[0],
        due: 'Due Tomorrow',
        dueColor: 'text-amber-600 bg-amber-50 border-amber-200',
        interval: 'Interval: 3 Days',
        accuracyRetention: '88% retention',
        reason: 'Speed recap on quadratic differences',
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
    if (!isAnswerSubmitted) {
      interval = setInterval(() => {
        setTimerSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAnswerSubmitted]);

  // Handle Option Select (Before submission)
  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOpt(optId);
  };

  // Submit Answer
  const handleCheckAnswer = useCallback(() => {
    if (!selectedOpt || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = currentKey && selectedOpt === currentKey.correct_option;
    setSessionStats((prev) => ({
      attempted: prev.attempted + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      streak: isCorrect ? prev.streak + 1 : 0,
      totalTimeSec: prev.totalTimeSec + timerSec,
    }));
  }, [selectedOpt, isAnswerSubmitted, currentKey, timerSec]);

  // Next Question
  const handleNextPractice = useCallback(() => {
    setSelectedOpt(null);
    setIsAnswerSubmitted(false);
    setShowDistractorRationales(false);
    setTimerSec(0);
    if (practiceIdx < topicQuestions.length - 1) {
      setPracticeIdx((prev) => prev + 1);
    } else {
      setPracticeIdx(0);
    }
  }, [practiceIdx, topicQuestions.length]);

  // Keyboard navigation listener (A-E to pick, Enter to submit/next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in scratchpad textarea or search
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (!isAnswerSubmitted) {
        if (key === 'a' || key === '1') setSelectedOpt('a');
        if (key === 'b' || key === '2') setSelectedOpt('b');
        if (key === 'c' || key === '3') setSelectedOpt('c');
        if (key === 'd' || key === '4') setSelectedOpt('d');
        if (key === 'e' || key === '5') setSelectedOpt('e');
        if (e.key === 'Enter' && selectedOpt) {
          handleCheckAnswer();
        }
      } else {
        if (e.key === 'Enter') {
          handleNextPractice();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerSubmitted, selectedOpt, handleCheckAnswer, handleNextPractice]);

  // Toggle Bookmark
  const toggleBookmark = (qId: string) => {
    setBookmarks((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const isCurrentBookmarked = bookmarks.includes(currentQ.id);
  const activeTopic = INITIAL_TOPICS.find((t) => t.id === selectedTopic) || INITIAL_TOPICS[0];
  const activeCheatSheet = TOPIC_CHEAT_SHEETS[selectedTopic] || {
    title: 'Quantitative Formula Rule',
    summary: 'Standard exam calculations and unit shortcuts.',
    formulas: [
      {
        name: 'General Arithmetic Rule',
        latex: '\\text{Rate} \\times \\text{Time} = \\text{Total Units}',
        note: 'Break down problem into unit rates.',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 selection:bg-blue-100">
      {/* Primary Navigation System */}
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex-1 space-y-5">
        {/* Level 1: Compact Page Header with Integrated Quick Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Quantitative Practice
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#005CE6] border border-blue-200">
                Prelims Drill
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Untimed instant-feedback practice with step-by-step solutions and speed techniques.
            </p>
          </div>

          {/* Compact Session Metrics */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 shadow-xs">
              <span className="text-slate-400 font-medium">Accuracy:</span>
              <span className="font-bold text-[#005CE6]">
                {sessionStats.attempted > 0
                  ? `${Math.round((sessionStats.correct / sessionStats.attempted) * 100)}%`
                  : '—'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-slate-400 font-medium">Streak:</span>
              <span className="font-bold text-slate-900">{sessionStats.streak}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 shadow-xs">
              <span className="text-slate-400 font-medium">Solved:</span>
              <span className="font-bold text-slate-900">{sessionStats.attempted}</span>
            </div>
          </div>
        </div>

        {/* Level 2: Mode Navigation (Single Clean Tab Bar with Secondary Utilities) */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Practice Mode Tabs */}
          <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/70" role="tablist">
            <button
              onClick={() => setActiveTab('topics')}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeTab === 'topics'
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#005CE6]" />
              <span>Topic Practice ({INITIAL_TOPICS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeTab === 'bookmarks'
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Bookmark className="w-3.5 h-3.5 text-[#005CE6]" />
              <span>Saved Bookmarks ({bookmarks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('revision')}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeTab === 'revision'
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#005CE6]" />
              <span>Spaced Revision ({spacedRevisionItems.length})</span>
            </button>
          </div>

          {/* Secondary Utilities */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer",
                showCheatSheet
                  ? "bg-amber-50 border-amber-300 text-amber-900"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Formula Sheet</span>
            </button>

            <button
              onClick={() => setShowScratchpad(!showScratchpad)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer",
                showScratchpad
                  ? "bg-slate-800 border-slate-800 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <FileText className="w-3.5 h-3.5 text-[#005CE6]" />
              <span>Scratchpad</span>
            </button>

            <button
              onClick={() => setFocusMode(!focusMode)}
              className={cn(
                "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer",
                focusMode
                  ? "bg-blue-50 border-[#005CE6] text-[#005CE6]"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
              title={focusMode ? "Exit Focus Mode" : "Focus Mode (Hide Sidebar)"}
            >
              {focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{focusMode ? "Sidebar" : "Focus"}</span>
            </button>
          </div>
        </div>

        {/* Topic Formula Sheet Drawer */}
        {showCheatSheet && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-amber-200/70 pb-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>{activeCheatSheet.title}</span>
              </div>
              <span className="text-[11px] text-amber-800 font-medium">Exam Speed Reference</span>
            </div>

            <p className="text-xs text-amber-900/80">{activeCheatSheet.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {activeCheatSheet.formulas.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-amber-200/80 space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900">{item.name}</div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 overflow-x-auto text-xs">
                    <MathRenderer content={`$$${item.latex}$$`} />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{item.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scratchpad Area */}
        {showScratchpad && (
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <FileText className="w-3.5 h-3.5 text-[#60CEF8]" />
                <span>Candidate Rough Scratchpad</span>
              </div>
              <button
                onClick={() => setScratchNotes('')}
                className="text-[11px] font-medium text-slate-400 hover:text-rose-400"
              >
                Clear
              </button>
            </div>
            <textarea
              value={scratchNotes}
              onChange={(e) => setScratchNotes(e.target.value)}
              placeholder="Rough steps, factorizations, or calculations..."
              rows={3}
              className="w-full bg-slate-800 text-slate-100 placeholder:text-slate-500 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#005CE6] font-mono"
            />
          </div>
        )}

        {/* TAB 1: TOPIC PRACTICE */}
        {activeTab === 'topics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: Rebalanced, Sticky, Clean Hierarchy */}
            {!focusMode && (
              <aside className="lg:col-span-4 space-y-3 sticky top-20">
                {/* Search & Category Filter Header */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Topics</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {filteredTopics.length} available
                    </span>
                  </div>

                  {/* Search Field */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search topics..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005CE6]"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1 flex-wrap">
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
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer",
                          selectedCategory === cat.id
                            ? "bg-[#005CE6] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Cards List - Distinct, Informative, Non-repetitive */}
                <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {filteredTopics.map((topic) => {
                    const isSelected = selectedTopic === topic.id;
                    const meta = TOPIC_METADATA[topic.id] || {
                      status: 'In progress',
                      accuracy: 75,
                      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
                      subtext: 'Practice available',
                    };
                    const qCount = INITIAL_QUESTIONS.filter((q) => q.topic_id === topic.id).length;

                    return (
                      <button
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopic(topic.id);
                          setPracticeIdx(0);
                          setSelectedOpt(null);
                          setIsAnswerSubmitted(false);
                          setShowDistractorRationales(false);
                          setTimerSec(0);
                        }}
                        className={cn(
                          "w-full p-3 rounded-xl border text-left transition-all cursor-pointer block",
                          isSelected
                            ? "bg-blue-50/80 border-[#005CE6]/60 shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={cn(
                            "text-xs font-semibold",
                            isSelected ? "text-[#005CE6] font-bold" : "text-slate-800"
                          )}>
                            {topic.name}
                          </span>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", meta.badgeColor)}>
                            {meta.accuracy}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{qCount > 0 ? `${qCount} question${qCount > 1 ? 's' : ''}` : '1 question'}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{meta.subtext}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>
            )}

            {/* Right Question Area: The Dominant Visual Workspace */}
            <div className={cn(focusMode ? "lg:col-span-12 max-w-3xl mx-auto w-full" : "lg:col-span-8", "space-y-4")}>
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
                {/* Question Status Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {activeTopic.group_name} · {activeTopic.name}
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      Question {practiceIdx + 1} of {topicQuestions.length}
                    </div>
                  </div>

                  {/* Compact Status Indicators */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 font-mono text-xs">
                      <Clock className="w-3.5 h-3.5 text-[#005CE6]" />
                      <span>{timerSec}s</span>
                    </div>

                    <button
                      onClick={() => toggleBookmark(currentQ.id)}
                      className={cn(
                        "p-1.5 rounded-md border transition-colors cursor-pointer",
                        isCurrentBookmarked
                          ? "bg-blue-50 border-[#005CE6] text-[#005CE6]"
                          : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                      )}
                      title={isCurrentBookmarked ? "Bookmarked" : "Bookmark this question"}
                      aria-label="Bookmark"
                    >
                      {isCurrentBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Stimulus Table for DI Questions if applicable */}
                {currentQ.stimulus && currentQ.stimulus.chart_type === 'table' && (
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#005CE6]" />
                      <span>{currentQ.stimulus.title}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200">
                            {currentQ.stimulus.structured_data.headers.map((h: string, idx: number) => (
                              <th key={idx} className="p-2 font-semibold text-slate-700">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentQ.stimulus.structured_data.rows.map((row: string[], rIdx: number) => (
                            <tr key={rIdx} className="border-b border-slate-200/60 hover:bg-white">
                              {row.map((cell: string, cIdx: number) => (
                                <td key={cIdx} className={cn("p-2", cIdx === 0 ? "font-semibold text-slate-800" : "font-mono text-slate-600")}>
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

                {/* Question Statement (Comfortable 17-18px typography with clear line-height) */}
                <div className="text-[17px] sm:text-[18px] font-medium text-slate-900 leading-[1.65]">
                  <MathRenderer content={currentQ.stem} />
                </div>

                {/* Answer Options: Neutral Before, Clear Selection, Restrained Green/Red After */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {isAnswerSubmitted ? "Result & Answer Verification" : "Select one answer (or press A–E)"}
                  </div>

                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOpt === opt.id;
                    const isCorrect = currentKey && opt.id === currentKey.correct_option;

                    // Option styling states
                    let optStyle = "border-slate-200 bg-white hover:border-slate-300 text-slate-800";

                    if (!isAnswerSubmitted) {
                      if (isSelected) {
                        optStyle = "border-[#005CE6] bg-blue-50/50 text-[#005CE6] font-semibold ring-1 ring-[#005CE6]";
                      }
                    } else {
                      if (isCorrect) {
                        optStyle = "border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold ring-1 ring-emerald-500";
                      } else if (isSelected && !isCorrect) {
                        optStyle = "border-rose-400 bg-rose-50 text-rose-950 font-semibold ring-1 ring-rose-400";
                      } else {
                        optStyle = "border-slate-200 bg-slate-50/60 text-slate-400";
                      }
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={cn(
                          "p-3.5 sm:p-4 rounded-xl border text-sm flex items-center justify-between cursor-pointer transition-all",
                          optStyle
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center font-bold font-mono text-xs uppercase shrink-0 transition-colors",
                              !isAnswerSubmitted && isSelected
                                ? "bg-[#005CE6] text-white"
                                : isAnswerSubmitted && isCorrect
                                ? "bg-emerald-600 text-white"
                                : isAnswerSubmitted && isSelected && !isCorrect
                                ? "bg-rose-600 text-white"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            )}
                          >
                            {opt.id}
                          </span>
                          <div className="leading-normal">
                            <MathRenderer content={opt.text} />
                          </div>
                        </div>

                        {/* Status Icon */}
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Primary Action Button Before Submission: Check Answer */}
                {!isAnswerSubmitted && (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Shortcut: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-600">Enter</kbd> to confirm
                    </span>
                    <button
                      onClick={handleCheckAnswer}
                      disabled={!selectedOpt}
                      className={cn(
                        "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer",
                        selectedOpt
                          ? "bg-[#005CE6] text-white hover:bg-blue-700 shadow-sm"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      Check Answer
                    </button>
                  </div>
                )}

                {/* Structured Explanation Levels (After Submission) */}
                {isAnswerSubmitted && currentKey && (
                  <div className="space-y-4 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                    {/* Level 1: Quick Explanation Banner */}
                    <div
                      className={cn(
                        "p-3.5 rounded-xl border flex items-center justify-between flex-wrap gap-2 text-xs",
                        selectedOpt === currentKey.correct_option
                          ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                          : "bg-rose-50/80 border-rose-200 text-rose-900"
                      )}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {selectedOpt === currentKey.correct_option ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Correct answer: Option {currentKey.correct_option.toUpperCase()}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Incorrect. Correct answer is Option {currentKey.correct_option.toUpperCase()}</span>
                          </>
                        )}
                      </div>
                      <span className="font-mono text-[11px] font-semibold opacity-80">
                        Pace: {timerSec} seconds
                      </span>
                    </div>

                    {/* Level 2: Complete Step-by-Step Derivation */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-800">
                        Step-by-Step Solution
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed">
                        <MathRenderer content={currentKey.solution} />
                      </div>
                    </div>

                    {/* Level 3: Exam Shortcut (Speed Technique) */}
                    {currentKey.shortcut && (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                          <span>Bank Exam Shortcut Technique</span>
                        </div>
                        <div className="leading-relaxed text-slate-800">
                          <MathRenderer content={currentKey.shortcut} />
                        </div>
                      </div>
                    )}

                    {/* Level 4: Why Other Options Are Wrong (Collapsed by default) */}
                    {currentKey.option_rationales && (
                      <div className="pt-1">
                        <button
                          onClick={() => setShowDistractorRationales(!showDistractorRationales)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#005CE6] transition-colors cursor-pointer"
                        >
                          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showDistractorRationales && "rotate-180")} />
                          <span>{showDistractorRationales ? "Hide" : "Show"} distractor mistake analysis</span>
                        </button>

                        {showDistractorRationales && (
                          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in duration-150">
                            {Object.entries(currentKey.option_rationales).map(([optId, rationale]) => (
                              <div
                                key={optId}
                                className={cn(
                                  "p-2.5 rounded-lg border text-xs",
                                  optId === currentKey.correct_option
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-900 font-medium"
                                    : "bg-slate-50 border-slate-200 text-slate-600"
                                )}
                              >
                                <span className="font-bold uppercase font-mono mr-1.5">[{optId}]:</span>
                                <span>{rationale}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Solid Next Question Button */}
                    <div className="pt-2">
                      <button
                        onClick={handleNextPractice}
                        className="w-full py-3 rounded-xl bg-[#005CE6] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="text-[10px] opacity-75 font-normal ml-1">(or press Enter ↵)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Saved Bookmarks</h2>
                <p className="text-xs text-slate-500">
                  Questions flagged for recap of tricky steps, traps, and exam shortcuts.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                {bookmarkedQuestions.length} Questions
              </span>
            </div>

            {bookmarkedQuestions.length === 0 ? (
              <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-2.5">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Questions Bookmarked Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the bookmark icon on any question in the Practice drill to save it here for quick review.
                </p>
                <button
                  onClick={() => setActiveTab('topics')}
                  className="px-4 py-2 rounded-lg bg-[#005CE6] text-white text-xs font-semibold cursor-pointer"
                >
                  Go to Practice
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
                      className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#005CE6] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                          {topic?.name || q.topic_id}
                        </span>
                        <button
                          onClick={() => toggleBookmark(q.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed line-clamp-3">
                        <MathRenderer content={q.stem} />
                      </div>

                      {key && (
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="font-semibold text-emerald-800">
                            Key: Option {key.correct_option.toUpperCase()}
                          </div>
                          {key.shortcut && (
                            <div className="text-[11px] text-slate-600 line-clamp-2">
                              {key.shortcut}
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setSelectedTopic(q.topic_id);
                          setActiveTab('topics');
                        }}
                        className="w-full py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#005CE6]" />
                  <h2 className="text-base font-bold text-slate-900">Spaced Repetition Schedule</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Questions answered incorrectly automatically resurface at optimal intervals (1d, 3d, 7d).
                </p>
              </div>

              <button
                onClick={() => setActiveTab('topics')}
                className="px-4 py-2 rounded-xl bg-[#005CE6] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Launch Spaced Drill (3 Qs)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {spacedRevisionItems.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", item.dueColor)}>
                      {item.due}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{item.interval}</span>
                  </div>

                  <div className="text-xs font-medium text-slate-900 leading-relaxed line-clamp-3">
                    <MathRenderer content={item.question.stem} />
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] space-y-0.5">
                    <div className="font-medium text-slate-700">{item.reason}</div>
                    <div className="text-slate-500 font-mono text-[10px]">{item.accuracyRetention}</div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTopic(item.question.topic_id);
                      setActiveTab('topics');
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
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
