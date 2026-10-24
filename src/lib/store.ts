import {
  UserProfile,
  Exam,
  ExamSection,
  Topic,
  Subtopic,
  Question,
  QuestionKey,
  TestRecord,
  FrozenTestBundle,
  Attempt,
  AttemptAnswer,
  ResultSnapshot,
  SeedRecord,
  GenerationJob,
  ReportItem,
  PaletteState,
} from './types';

// Initial Seed Topics
export const INITIAL_TOPICS: Topic[] = [
  { id: 'quadratic-equations', name: 'Quadratic Equations', group_name: 'Number-based', is_template_eligible: true, is_di: false },
  { id: 'simplification', name: 'Simplification & Approximation', group_name: 'Number-based', is_template_eligible: true, is_di: false },
  { id: 'number-series', name: 'Number Series', group_name: 'Number-based', is_template_eligible: true, is_di: false },
  { id: 'profit-and-loss', name: 'Profit and Loss', group_name: 'Arithmetic', is_template_eligible: true, is_di: false },
  { id: 'percentage', name: 'Percentage', group_name: 'Arithmetic', is_template_eligible: true, is_di: false },
  { id: 'si-ci', name: 'Simple & Compound Interest', group_name: 'Arithmetic', is_template_eligible: true, is_di: false },
  { id: 'ratio-proportion', name: 'Ratio and Proportion', group_name: 'Arithmetic', is_template_eligible: true, is_di: false },
  { id: 'time-and-work', name: 'Time and Work', group_name: 'Arithmetic', is_template_eligible: true, is_di: false },
  { id: 'time-speed-distance', name: 'Time, Speed and Distance', group_name: 'Arithmetic', is_template_eligible: true, is_di: false },
  { id: 'tabular-di', name: 'Tabular Data Interpretation', group_name: 'DI', is_template_eligible: false, is_di: true },
  { id: 'bar-pie-di', name: 'Bar & Pie Chart DI', group_name: 'DI', is_template_eligible: false, is_di: true },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'ibps-po-prelims-2026',
    name: 'IBPS PO Prelims 2026',
    family: 'Bank',
    year_label: '2026',
    description: '35 Questions Quantitative Aptitude, 20 Minutes sectional timing, 0.25 negative marks.',
    calculator_enabled: false,
    options_count: 5,
    status: 'active',
    instructions_html: '<p>The clock has been set at the server and the countdown timer at the top right corner of screen will display the time remaining for you to complete the exam. Each question carries 1.00 mark and an incorrect answer will deduct 0.25 marks.</p>',
  },
  {
    id: 'sbi-clerk-prelims-2026',
    name: 'SBI Clerk Prelims 2026',
    family: 'Bank',
    year_label: '2026',
    description: 'High speed clerical numerical ability mock series with instant rank and percentile.',
    calculator_enabled: false,
    options_count: 5,
    status: 'active',
  },
  {
    id: 'rbi-assistant-2026',
    name: 'RBI Assistant Prelims 2026',
    family: 'Bank',
    year_label: '2026',
    description: 'Accuracy ramp with speed calculation shortcuts for Reserve Bank of India Assistant.',
    calculator_enabled: false,
    options_count: 5,
    status: 'active',
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-quad-1',
    topic_id: 'quadratic-equations',
    subtopic_id: 'root-comparison',
    type: 'quadratic',
    difficulty_assigned: 2,
    status: 'live',
    source: 'ai_twist',
    version: 1,
    stem: 'In the following question, two equations (I) and (II) are given. You have to solve both the equations and establish the relation between $x$ and $y$.\n\n**I.** $x^2 - 11x + 30 = 0$\n\n**II.** $y^2 - 17y + 72 = 0$',
    options: [
      { id: 'a', text: 'x > y' },
      { id: 'b', text: 'x < y' },
      { id: 'c', text: 'x ≥ y' },
      { id: 'd', text: 'x ≤ y' },
      { id: 'e', text: 'x = y or relationship cannot be established' },
    ],
  },
  {
    id: 'q-simp-1',
    topic_id: 'simplification',
    type: 'mcq',
    difficulty_assigned: 1,
    status: 'live',
    source: 'template',
    version: 1,
    stem: 'What value should come in place of the question mark ($?$) in the given expression?\n\n$45\\% \\text{ of } 800 + \\sqrt{625} \\times 4 - 36 = ?$',
    options: [
      { id: 'a', text: '424' },
      { id: 'b', text: '436' },
      { id: 'c', text: '414' },
      { id: 'd', text: '460' },
      { id: 'e', text: '398' },
    ],
  },
  {
    id: 'q-series-1',
    topic_id: 'number-series',
    type: 'mcq',
    difficulty_assigned: 3,
    status: 'live',
    source: 'ai_twist',
    version: 1,
    stem: 'Find the missing number in the pattern:\n\n**6, 14, 30, 62, 126, ?**',
    options: [
      { id: 'a', text: '248' },
      { id: 'b', text: '254' },
      { id: 'c', text: '252' },
      { id: 'd', text: '260' },
      { id: 'e', text: '242' },
    ],
  },
  {
    id: 'q-profit-1',
    topic_id: 'profit-and-loss',
    type: 'mcq',
    difficulty_assigned: 3,
    status: 'live',
    source: 'seed',
    version: 1,
    stem: 'A shopkeeper marks his goods **30%** above the cost price and allows a discount of **15%** for cash payment. Find his net gain percentage.',
    options: [
      { id: 'a', text: '15.00%' },
      { id: 'b', text: '12.50%' },
      { id: 'c', text: '10.50%' },
      { id: 'd', text: '14.25%' },
      { id: 'e', text: '11.75%' },
    ],
  },
  {
    id: 'q-work-1',
    topic_id: 'time-and-work',
    type: 'mcq',
    difficulty_assigned: 3,
    status: 'live',
    source: 'ai_twist',
    version: 1,
    stem: '$A$ can complete a piece of work in **12 days** and $B$ can complete it in **18 days**. If they work together for **4 days**, what fraction of the work remains uncompleted?',
    options: [
      { id: 'a', text: '4/9' },
      { id: 'b', text: '5/9' },
      { id: 'c', text: '1/3' },
      { id: 'd', text: '2/5' },
      { id: 'e', text: '7/18' },
    ],
  },
  {
    id: 'q-di-1',
    topic_id: 'tabular-di',
    type: 'di_set',
    difficulty_assigned: 4,
    status: 'live',
    source: 'seed',
    version: 1,
    stimulus: {
      id: 'stim-di-1',
      title: 'Monthly Loan Sanctions by Five Public Sector Banks (in Crores INR)',
      chart_type: 'table',
      structured_data: {
        headers: ['Bank', 'January', 'February', 'March', 'April'],
        rows: [
          ['SBI', '450', '520', '610', '580'],
          ['PNB', '320', '380', '410', '390'],
          ['BOB', '280', '310', '360', '340'],
          ['Canara', '210', '260', '300', '290'],
          ['Union', '190', '220', '250', '240'],
        ],
      },
    },
    stem: 'What is the ratio of the total loans sanctioned by **SBI** in February and March together to that of **BOB** in March and April together?',
    options: [
      { id: 'a', text: '113 : 70' },
      { id: 'b', text: '111 : 70' },
      { id: 'c', text: '53 : 35' },
      { id: 'd', text: '57 : 35' },
      { id: 'e', text: '109 : 68' },
    ],
  },
];

export const INITIAL_KEYS: Record<string, QuestionKey> = {
  'q-quad-1': {
    question_id: 'q-quad-1',
    correct_option: 'b',
    solution: 'Solve equation I: $x^2 - 11x + 30 = 0 \\implies (x - 5)(x - 6) = 0 \\implies x = 5, 6$.\nSolve equation II: $y^2 - 17y + 72 = 0 \\implies (y - 8)(y - 9) = 0 \\implies y = 8, 9$.\nComparing values: both roots of $x$ (5, 6) are strictly less than both roots of $y$ (8, 9). Hence $x < y$.',
    shortcut: 'Both equations have positive product terms and negative sum terms, so all roots are positive. Notice $30 < 72$ and $11 < 17$, roots of y are strictly larger.',
    option_rationales: {
      a: 'Mistake: swapped inequality direction.',
      b: 'Correct answer.',
      c: 'Mistake: assumed partial overlap of roots.',
      d: 'Mistake: included equal condition when roots are strictly distinct.',
      e: 'Mistake: failed to solve second equation correctly.',
    },
    solver_code: 'def solve(): return "x < y"',
  },
  'q-simp-1': {
    question_id: 'q-simp-1',
    correct_option: 'a',
    solution: '$45\\% \\text{ of } 800 = 0.45 \\times 800 = 360$.\n$\\sqrt{625} \\times 4 = 25 \\times 4 = 100$.\nTotal = $360 + 100 - 36 = 460 - 36 = 424$.',
    shortcut: '$45\\% \\text{ of } 800 = (50\\% - 5\\%) = 400 - 40 = 360$. Then $360 + 100 - 36 = 424$.',
    option_rationales: {
      a: 'Correct answer.',
      b: 'Mistake: added 36 instead of subtracting.',
      c: 'Mistake: calculated 25 x 4 as 90.',
      d: 'Mistake: forgot the final subtraction of 36.',
      e: 'Mistake: calculated 45% of 800 as 334.',
    },
    solver_code: 'def solve(): return 424',
  },
  'q-series-1': {
    question_id: 'q-series-1',
    correct_option: 'b',
    solution: 'Look at differences: $14 - 6 = 8$, $30 - 14 = 16$, $62 - 30 = 32$, $126 - 62 = 64$.\nDifferences are doubling: $8, 16, 32, 64, 128$.\nNext term = $126 + 128 = 254$.',
    shortcut: 'Pattern is $T_{n+1} = 2 \\times T_n + 2$.\n$126 \\times 2 + 2 = 252 + 2 = 254$.',
    option_rationales: {
      a: 'Mistake: added 122 instead of 128.',
      b: 'Correct answer.',
      c: 'Mistake: doubled 126 without adding 2.',
      d: 'Mistake: jumped to 134 diff.',
      e: 'Mistake: simple arithmetic subtraction error.',
    },
    solver_code: 'def solve(): return 254',
  },
  'q-profit-1': {
    question_id: 'q-profit-1',
    correct_option: 'c',
    solution: 'Let Cost Price ($CP$) = Rs. 100.\nMarked Price ($MP$) = $100 + 30\\% = 130$.\nSelling Price ($SP$) = $130 - 15\\% \\text{ of } 130 = 130 - 19.5 = 110.5$.\nNet Gain = $110.5 - 100 = 10.5\\%$.',
    shortcut: 'Use net percentage change formula: $a + b + \\frac{ab}{100} = +30 - 15 - \\frac{30 \\times 15}{100} = 15 - 4.5 = 10.5\\%$.',
    option_rationales: {
      a: 'Mistake: directly subtracted $30 - 15 = 15\\%$, ignoring that discount applies to marked price.',
      b: 'Mistake: applied 15% discount to CP rather than MP.',
      c: 'Correct answer.',
      d: 'Mistake: calculation error in $450/100$.',
      e: 'Mistake: inverted calculation.',
    },
    solver_code: 'def solve(): return "10.50%"',
  },
  'q-work-1': {
    question_id: 'q-work-1',
    correct_option: 'a',
    solution: 'A 1 day work = $1/12$. B 1 day work = $1/18$.\nCombined 1 day work = $1/12 + 1/18 = (3+2)/36 = 5/36$.\nWork done in 4 days = $4 \\times 5/36 = 20/36 = 5/9$.\nRemaining work = $1 - 5/9 = 4/9$.',
    shortcut: 'LCM of 12 and 18 is 36 units total work. Rate of A = 3, Rate of B = 2. Together = 5 units/day. In 4 days = 20 units. Remaining = 16 units out of 36 = $16/36 = 4/9$.',
    option_rationales: {
      a: 'Correct answer (remaining work).',
      b: 'Common trap: selected work completed ($5/9$) instead of uncompleted ($4/9$).',
      c: 'Mistake: estimated $1/3$.',
      d: 'Mistake: inverted ratio.',
      e: 'Mistake: denominator calculation error.',
    },
    solver_code: 'def solve(): return "4/9"',
  },
  'q-di-1': {
    question_id: 'q-di-1',
    correct_option: 'a',
    solution: 'SBI in Feb + March = $520 + 610 = 1130$ Crores.\nBOB in March + April = $360 + 340 = 700$ Crores.\nRequired ratio = $1130 : 700 = 113 : 70$.',
    shortcut: 'Sum digits: $520+610=1130$ and $360+340=700$. Zeroes cancel out directly to give $113 : 70$.',
    option_rationales: {
      a: 'Correct answer.',
      b: 'Mistake: misread BOB March as 340.',
      c: 'Mistake: divided by 20 without matching numerator.',
      d: 'Mistake: took Canara instead of BOB.',
      e: 'Mistake: added April SBI instead of March.',
    },
    solver_code: 'def solve(): return "113 : 70"',
  },
};

// Global In-Memory Store
class SatPrepStore {
  private user: UserProfile = {
    id: 'user-default-1',
    name: 'Aditya Sharma',
    email: 'aditya.sharma@example.com',
    role: 'student',
    target_exams: ['IBPS PO', 'SBI PO'],
    exam_date: '2026-11-15',
    daily_study_time_min: 90,
    self_rated_level: 3,
    plan_id: 'pro',
    created_at: new Date().toISOString(),
  };

  private questions: Map<string, Question> = new Map();
  private keys: Map<string, QuestionKey> = new Map();
  private tests: Map<string, TestRecord> = new Map();
  private attempts: Map<string, Attempt> = new Map();
  private attemptAnswers: Map<string, Map<string, AttemptAnswer>> = new Map();
  private snapshots: Map<string, ResultSnapshot> = new Map();
  private reports: ReportItem[] = [];
  private seeds: SeedRecord[] = [];
  private jobs: GenerationJob[] = [];

  constructor() {
    INITIAL_QUESTIONS.forEach((q) => this.questions.set(q.id, q));
    Object.entries(INITIAL_KEYS).forEach(([qid, k]) => this.keys.set(qid, k));

    // Seed sample reports
    this.reports.push({
      id: 'rep-1',
      question_id: 'q-profit-1',
      user_id: 'user-default-1',
      user_name: 'Pooja Verma',
      reason: 'unclear',
      text: 'Option explanation states net change without showing alternative CP assumed 100 method.',
      status: 'open',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      question_stem: 'A shopkeeper marks his goods 30% above the cost price...',
    });

    // Seed sample generation jobs
    this.jobs.push({
      id: 'job-101',
      topic_id: 'quadratic-equations',
      topic_name: 'Quadratic Equations',
      difficulty: 3,
      count: 20,
      method: 'template',
      status: 'completed',
      accepted_count: 20,
      rejected_count: 0,
      cost_usd: 0.0,
      runtime_sec: 1.4,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    });
  }

  getUser(): UserProfile {
    return this.user;
  }

  updateUser(updates: Partial<UserProfile>): UserProfile {
    this.user = { ...this.user, ...updates };
    return this.user;
  }

  getQuestions(): Question[] {
    return Array.from(this.questions.values());
  }

  getQuestion(id: string): Question | undefined {
    return this.questions.get(id);
  }

  addQuestion(q: Question, key?: QuestionKey) {
    this.questions.set(q.id, q);
    if (key) {
      this.keys.set(q.id, key);
    }
  }

  // Backend-First Test Assembly (PRD Section 8)
  assembleTest(config: {
    exam_id: string;
    mode: 'full_mock' | 'sectional' | 'topic_test' | 'weak_area' | 'revision';
    source_type?: 'auto' | 'manual' | 'curated';
    topics: string[];
    question_count: number;
    difficulty_mix?: string;
    selected_qids?: string[];
  }): TestRecord {
    const testId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const exam = INITIAL_EXAMS.find((e) => e.id === config.exam_id) || INITIAL_EXAMS[0];

    // Filter questions
    let pool = Array.from(this.questions.values()).filter((q) => q.status === 'live' || q.status === 'reviewed');

    if (config.source_type === 'manual' && config.selected_qids && config.selected_qids.length > 0) {
      pool = pool.filter((q) => config.selected_qids!.includes(q.id));
    } else if (config.topics && config.topics.length > 0) {
      pool = pool.filter((q) => config.topics.includes(q.topic_id));
    }

    // If pool is smaller than question_count, replicate/twist existing to meet count
    let selected: Question[] = [];
    if (pool.length === 0) {
      selected = Array.from(this.questions.values()).slice(0, config.question_count);
    } else {
      while (selected.length < config.question_count) {
        for (const q of pool) {
          if (selected.length < config.question_count) {
            selected.push(q);
          }
        }
      }
    }

    // Freeze bundle
    const assembledQuestions = selected.map((q, idx) => ({
      position: idx + 1,
      id: q.id,
      stem: q.stem,
      options: q.options,
      type: q.type,
      topic_id: q.topic_id,
      subtopic_id: q.subtopic_id,
      difficulty: q.difficulty_assigned,
      stimulus: q.stimulus,
      marks_positive: 1.0,
      marks_negative: 0.25,
    }));

    const bundle: FrozenTestBundle = {
      test_id: testId,
      assembled_at: new Date().toISOString(),
      exam_name: exam.name,
      duration_min: 20,
      total_questions: assembledQuestions.length,
      total_marks: assembledQuestions.length * 1.0,
      negative_marks: 0.25,
      section_lock: true,
      freshness_percent: 92,
      sections: [
        {
          id: 'quant-section-1',
          name: 'Quantitative Aptitude',
          duration_min: 20,
          questions: assembledQuestions,
        },
      ],
    };

    const record: TestRecord = {
      id: testId,
      owner: this.user.id,
      exam_id: config.exam_id,
      mode: config.mode,
      source_type: config.source_type || 'auto',
      config: {
        exam_id: config.exam_id,
        mode: config.mode,
        source_type: config.source_type || 'auto',
        topics: config.topics,
        question_count: config.question_count,
      },
      status: 'ready',
      bundle,
      checksum: `sha256-${Math.random().toString(36).substring(2, 15)}`,
      ready_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
    };

    this.tests.set(testId, record);
    return record;
  }

  getTest(testId: string): TestRecord | undefined {
    return this.tests.get(testId);
  }

  startAttempt(testId: string): { attempt: Attempt; bundle: FrozenTestBundle } {
    const test = this.tests.get(testId);
    if (!test || !test.bundle) {
      throw new Error('Test not found or not in ready state');
    }

    const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const durationMs = (test.bundle.duration_min || 20) * 60 * 1000;
    const deadline = new Date(Date.now() + durationMs).toISOString();

    const attempt: Attempt = {
      id: attemptId,
      test_id: testId,
      user_id: this.user.id,
      started_at: new Date().toISOString(),
      current_section_id: test.bundle.sections[0].id,
      section_deadlines: {
        [test.bundle.sections[0].id]: deadline,
      },
      status: 'in_progress',
    };

    this.attempts.set(attemptId, attempt);
    this.attemptAnswers.set(attemptId, new Map());

    // Initialize answers with 'not_visited' for first question -> 'not_answered'
    test.bundle.sections[0].questions.forEach((q, idx) => {
      this.attemptAnswers.get(attemptId)!.set(q.id, {
        question_id: q.id,
        state: idx === 0 ? 'not_answered' : 'not_visited',
        time_spent_sec: 0,
        visits: idx === 0 ? 1 : 0,
        saved_at: new Date().toISOString(),
      });
    });

    return { attempt, bundle: test.bundle };
  }

  saveAnswer(
    attemptId: string,
    questionId: string,
    selectedOption: string | undefined,
    state: PaletteState,
    timeSpentSec: number
  ): AttemptAnswer {
    const attempt = this.attempts.get(attemptId);
    if (!attempt || attempt.status !== 'in_progress') {
      throw new Error('Attempt not active or already submitted');
    }

    let userAnswers = this.attemptAnswers.get(attemptId);
    if (!userAnswers) {
      userAnswers = new Map();
      this.attemptAnswers.set(attemptId, userAnswers);
    }

    const existing = userAnswers.get(questionId);
    const updated: AttemptAnswer = {
      question_id: questionId,
      selected_option: selectedOption,
      state: state,
      time_spent_sec: (existing?.time_spent_sec || 0) + timeSpentSec,
      visits: (existing?.visits || 0) + 1,
      saved_at: new Date().toISOString(),
    };

    userAnswers.set(questionId, updated);
    return updated;
  }

  getAttemptAnswers(attemptId: string): Record<string, AttemptAnswer> {
    const userAnswers = this.attemptAnswers.get(attemptId);
    if (!userAnswers) return {};
    const res: Record<string, AttemptAnswer> = {};
    userAnswers.forEach((val, key) => {
      res[key] = val;
    });
    return res;
  }

  submitAttempt(attemptId: string): ResultSnapshot {
    const attempt = this.attempts.get(attemptId);
    if (!attempt) throw new Error('Attempt not found');

    const test = this.tests.get(attempt.test_id);
    if (!test || !test.bundle) throw new Error('Test bundle missing');

    const userAnswers = this.attemptAnswers.get(attemptId) || new Map();
    const questions = test.bundle.sections[0].questions;

    let attempted = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let totalScore = 0;
    let totalTimeSpent = 0;

    const reviewItems: ResultSnapshot['questions_review'] = [];
    const topicStats: Record<string, { attempts: number; correct: number; totalTime: number; count: number }> = {};
    const difficultyStats: Record<number, { attempts: number; correct: number }> = {
      1: { attempts: 0, correct: 0 },
      2: { attempts: 0, correct: 0 },
      3: { attempts: 0, correct: 0 },
      4: { attempts: 0, correct: 0 },
      5: { attempts: 0, correct: 0 },
    };
    const timeAnalysis: ResultSnapshot['time_analysis'] = [];

    questions.forEach((q, idx) => {
      const ans = userAnswers.get(q.id);
      const key = this.keys.get(q.id);
      const userSelected = ans?.selected_option;
      const timeSpent = ans?.time_spent_sec || 15;
      totalTimeSpent += timeSpent;

      const idealTime = q.difficulty <= 2 ? 45 : q.difficulty === 3 ? 75 : 110;
      const isSlow = timeSpent > idealTime;

      const correctOpt = key?.correct_option || 'a';
      const isAnswered = ans && (ans.state === 'answered' || ans.state === 'answered_and_marked') && !!userSelected;

      let isCorrect = false;
      let qResult: 'correct' | 'wrong' | 'skipped' = 'skipped';

      if (isAnswered) {
        attempted++;
        difficultyStats[q.difficulty].attempts++;
        if (userSelected === correctOpt) {
          correct++;
          isCorrect = true;
          totalScore += 1.0;
          qResult = 'correct';
          difficultyStats[q.difficulty].correct++;
        } else {
          wrong++;
          totalScore -= 0.25;
          qResult = 'wrong';
        }
      } else {
        skipped++;
      }

      // Topic aggregation
      if (!topicStats[q.topic_id]) {
        topicStats[q.topic_id] = { attempts: 0, correct: 0, totalTime: 0, count: 0 };
      }
      topicStats[q.topic_id].count++;
      if (isAnswered) topicStats[q.topic_id].attempts++;
      if (isCorrect) topicStats[q.topic_id].correct++;
      topicStats[q.topic_id].totalTime += timeSpent;

      timeAnalysis.push({
        question_position: idx + 1,
        actual_time_sec: timeSpent,
        ideal_time_sec: idealTime,
        is_slow: isSlow,
        result: qResult,
      });

      const topicObj = INITIAL_TOPICS.find((t) => t.id === q.topic_id);

      reviewItems.push({
        position: idx + 1,
        question_id: q.id,
        stem: q.stem,
        options: q.options,
        your_answer: userSelected,
        correct_answer: correctOpt,
        time_taken_sec: timeSpent,
        ideal_time_sec: idealTime,
        is_correct: isCorrect,
        solution: key?.solution || 'Solution calculation steps in review.',
        shortcut: key?.shortcut,
        option_rationales: key?.option_rationales,
        topic_name: topicObj ? topicObj.name : q.topic_id,
        difficulty: q.difficulty,
      });
    });

    attempt.status = 'submitted';
    attempt.score = Math.max(0, totalScore);
    attempt.submitted_at = new Date().toISOString();

    const accuracyPercent = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    const topicBreakdown = Object.entries(topicStats).map(([tId, stat]) => {
      const tObj = INITIAL_TOPICS.find((t) => t.id === tId);
      const acc = stat.attempts > 0 ? Math.round((stat.correct / stat.attempts) * 100) : 0;
      let strength: 'Strong' | 'Average' | 'Weak' = 'Average';
      if (acc >= 75) strength = 'Strong';
      else if (acc < 50) strength = 'Weak';

      return {
        topic_id: tId,
        topic_name: tObj?.name || tId,
        attempts: stat.attempts,
        correct: stat.correct,
        accuracy: acc,
        avg_time_sec: stat.attempts > 0 ? Math.round(stat.totalTime / stat.attempts) : 0,
        ideal_time_sec: 75,
        strength,
      };
    });

    const difficultyBreakdown = [1, 2, 3, 4, 5].map((lvl) => {
      const dStat = difficultyStats[lvl];
      const labels = ['', 'Easy', 'Moderate-Easy', 'Moderate', 'Hard', 'Very Hard (Mains)'];
      return {
        level: lvl,
        label: labels[lvl],
        attempts: dStat.attempts,
        correct: dStat.correct,
        accuracy: dStat.attempts > 0 ? Math.round((dStat.correct / dStat.attempts) * 100) : 0,
      };
    });

    const snapshot: ResultSnapshot = {
      attempt_id: attemptId,
      test_id: attempt.test_id,
      computed_at: new Date().toISOString(),
      score_card: {
        total_score: totalScore,
        max_marks: questions.length * 1.0,
        attempted,
        correct,
        wrong,
        skipped,
        negative_marks_lost: wrong * 0.25,
        accuracy_percent: accuracyPercent,
        total_time_spent_sec: totalTimeSpent,
        percentile: 88.4,
        rank: 142,
        total_cohort_attempts: 1250,
      },
      section_breakdown: [
        {
          section_id: 'quant',
          section_name: 'Quantitative Aptitude',
          score: totalScore,
          accuracy: accuracyPercent,
          time_spent_sec: totalTimeSpent,
        },
      ],
      topic_breakdown: topicBreakdown,
      difficulty_breakdown: difficultyBreakdown,
      time_analysis: timeAnalysis,
      questions_review: reviewItems,
    };

    this.snapshots.set(attemptId, snapshot);
    return snapshot;
  }

  getResultSnapshot(attemptId: string): ResultSnapshot | undefined {
    return this.snapshots.get(attemptId);
  }

  reportQuestion(qid: string, reason: ReportItem['reason'], text?: string): ReportItem {
    const q = this.questions.get(qid);
    const item: ReportItem = {
      id: `rep-${Date.now()}`,
      question_id: qid,
      user_id: this.user.id,
      user_name: this.user.name,
      reason,
      text,
      status: 'open',
      created_at: new Date().toISOString(),
      question_stem: q?.stem,
    };
    this.reports.unshift(item);
    return item;
  }

  getReports(): ReportItem[] {
    return this.reports;
  }

  regradeQuestion(qid: string, newKey: string): { affected_attempts: number } {
    const existingKey = this.keys.get(qid);
    if (existingKey) {
      existingKey.correct_option = newKey;
      this.keys.set(qid, existingKey);
    }

    // Recompute snapshots for any attempts that contained this question
    let affected = 0;
    this.snapshots.forEach((snap) => {
      const item = snap.questions_review.find((r) => r.question_id === qid);
      if (item) {
        affected++;
        item.correct_answer = newKey;
        item.is_correct = item.your_answer === newKey;
      }
    });

    return { affected_attempts: affected };
  }

  getJobs(): GenerationJob[] {
    return this.jobs;
  }

  createJob(job: Partial<GenerationJob>): GenerationJob {
    const newJob: GenerationJob = {
      id: `job-${Date.now()}`,
      count: job.count || 20,
      method: job.method || 'template',
      status: 'completed',
      topic_id: job.topic_id,
      topic_name: INITIAL_TOPICS.find((t) => t.id === job.topic_id)?.name || 'Quantitative Aptitude',
      difficulty: job.difficulty || 3,
      accepted_count: job.count || 20,
      rejected_count: 0,
      cost_usd: 0.0,
      runtime_sec: 1.2,
      created_at: new Date().toISOString(),
    };
    this.jobs.unshift(newJob);
    return newJob;
  }
}

// Global Singleton Store Instance
export const globalStore = new SatPrepStore();
