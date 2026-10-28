export type Role = 'student' | 'reviewer' | 'content_manager' | 'support' | 'admin';

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  name: string;
  email: string;
  photo_url?: string;
  role: Role;
  target_exams: string[];
  exam_date?: string;
  daily_study_time_min: number;
  self_rated_level: number;
  plan_id: 'free' | 'pro';
  created_at: string;
}

export interface Exam {
  id: string;
  name: string;
  family: string;
  year_label: string;
  description?: string;
  calculator_enabled: boolean;
  options_count: number;
  instructions_html?: string;
  status: 'draft' | 'active' | 'archived';
}

export interface ExamSection {
  id: string;
  stage_id: string;
  name: string;
  question_count: number;
  duration_min: number;
  marks_per_q: number;
  negative_marks: number;
  order_index: number;
  section_lock: boolean;
  difficulty_mix?: Record<string, number>;
}

export interface Topic {
  id: string;
  name: string;
  group_name: 'Arithmetic' | 'Number-based' | 'Advanced' | 'DI';
  is_template_eligible: boolean;
  is_di: boolean;
  mains_only?: boolean;
}

export interface Subtopic {
  id: string;
  topic_id: string;
  name: string;
}

export interface QuestionOption {
  id: string; // 'a' | 'b' | 'c' | 'd' | 'e'
  text: string;
  render_html?: string;
  original_id?: string;
}

export interface Stimulus {
  id: string;
  title?: string;
  chart_type: 'table' | 'bar' | 'line' | 'pie' | 'mixed' | 'caselet' | 'radar' | 'missing_di';
  structured_data?: any;
  caselet_text?: string;
}

export interface Question {
  id: string;
  stem: string;
  options: QuestionOption[];
  type: 'mcq' | 'di_set' | 'quantity_comparison' | 'quadratic' | 'data_sufficiency';
  topic_id: string;
  subtopic_id?: string;
  difficulty_assigned: number;
  difficulty_empirical?: number;
  status: 'draft' | 'auto_verified' | 'needs_review' | 'reviewed' | 'live' | 'flagged' | 'retired';
  source: 'seed' | 'ai_twist' | 'template' | 'ai_bootstrap' | 'manual';
  blueprint_id?: string;
  stimulus_id?: string;
  stimulus?: Stimulus;
  render_html?: string;
  version: number;
  is_seed_visible?: boolean;
}

export interface QuestionKey {
  question_id: string;
  correct_option: string;
  solution: string;
  shortcut?: string;
  option_rationales?: Record<string, string>;
  solver_code?: string;
}

export type PaletteState = 
  | 'not_visited' 
  | 'not_answered' 
  | 'answered' 
  | 'marked_for_review' 
  | 'answered_and_marked';

export interface TestConfig {
  title?: string;
  exam_id: string;
  mode: 'full_mock' | 'sectional' | 'topic_test' | 'weak_area' | 'revision';
  source_type: 'auto' | 'manual' | 'curated';
  topics: string[];
  question_count: number;
  difficulty_mix?: 'easy' | 'moderate' | 'hard' | 'mixed' | 'exam_like';
  selected_qids?: string[];
  fresh_only?: boolean;
  feedback_mode?: 'exam' | 'practice';
}

export interface AssembledQuestion {
  position: number;
  id: string;
  stem: string;
  options: QuestionOption[];
  type: string;
  topic_id: string;
  subtopic_id?: string;
  difficulty: number;
  stimulus?: Stimulus;
  marks_positive: number;
  marks_negative: number;
  solution?: string;
  shortcut?: string;
  correct_option?: string;
  option_rationales?: Record<string, string>;
}

export interface FrozenTestBundle {
  test_id: string;
  title?: string;
  assembled_at: string;
  exam_name: string;
  duration_min: number;
  total_questions: number;
  total_marks: number;
  negative_marks: number;
  section_lock: boolean;
  freshness_percent: number;
  feedback_mode?: 'exam' | 'practice';
  sections: {
    id: string;
    name: string;
    duration_min: number;
    questions: AssembledQuestion[];
  }[];
}

export interface TestRecord {
  id: string;
  title?: string;
  owner?: string;
  exam_id: string;
  mode: string;
  source_type: string;
  config: TestConfig;
  status: 'requested' | 'assembling' | 'generating_shortfall' | 'ready' | 'in_progress' | 'expired' | 'failed';
  request_id?: string;
  bundle?: FrozenTestBundle;
  checksum?: string;
  ready_at: string;
  expires_at: string;
  created_at: string;
}

export interface AttemptAnswer {
  question_id: string;
  selected_option?: string;
  state: PaletteState;
  time_spent_sec: number;
  visits: number;
  saved_at: string;
}

export interface Attempt {
  id: string;
  test_id: string;
  user_id: string;
  started_at: string;
  current_section_id: string;
  section_deadlines: Record<string, string>;
  status: 'in_progress' | 'submitted' | 'abandoned' | 'expired';
  score?: number;
  submitted_at?: string;
}

export interface TestAttemptSummary {
  attempt_id: string;
  test_id: string;
  test_name: string;
  category: 'full_mock' | 'sectional' | 'topic_test';
  date: string;
  date_formatted: string;
  score: number;
  max_marks: number;
  accuracy: number;
  percentile?: number;
  rank?: number;
  total_cohort?: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  negative_marks: number;
  time_spent_sec: number;
  duration_min: number;
  cutoff: number;
  status: 'Cleared Cutoff' | 'Needs Improvement' | 'Target Exceeded';
}

export interface OverallResultsData {
  total_tests_written: number;
  avg_score: number;
  max_possible_avg: number;
  overall_accuracy: number;
  avg_percentile?: number;
  total_questions_attempted: number;
  total_correct: number;
  total_wrong: number;
  total_skipped: number;
  total_time_spent_min: number;
  highest_score: number;
  highest_percentile?: number;
  tests: TestAttemptSummary[];
  topic_summary?: {
    topic_id: string;
    topic_name: string;
    total_attempts: number;
    total_correct: number;
    accuracy: number;
    strength: 'Strong' | 'Average' | 'Weak';
  }[];
}

export interface ResultSnapshot {
  attempt_id: string;
  test_id: string;
  test_name?: string;
  category?: 'full_mock' | 'sectional' | 'topic_test';
  date_formatted?: string;
  status_label?: string;
  computed_at: string;
  score_card: {
    total_score: number;
    max_marks: number;
    attempted: number;
    correct: number;
    wrong: number;
    skipped: number;
    negative_marks_lost: number;
    accuracy_percent: number;
    total_time_spent_sec: number;
    percentile?: number;
    rank?: number;
    total_cohort_attempts?: number;
  };
  section_breakdown: {
    section_id: string;
    section_name: string;
    score: number;
    accuracy: number;
    time_spent_sec: number;
  }[];
  topic_breakdown: {
    topic_id: string;
    topic_name: string;
    attempts: number;
    correct: number;
    accuracy: number;
    avg_time_sec: number;
    ideal_time_sec: number;
    strength: 'Strong' | 'Average' | 'Weak';
  }[];
  difficulty_breakdown: {
    level: number;
    label: string;
    attempts: number;
    correct: number;
    accuracy: number;
  }[];
  time_analysis: {
    question_position: number;
    actual_time_sec: number;
    ideal_time_sec: number;
    is_slow: boolean;
    result: 'correct' | 'wrong' | 'skipped';
  }[];
  questions_review: {
    position: number;
    question_id: string;
    stem: string;
    options: QuestionOption[];
    your_answer?: string;
    correct_answer: string;
    time_taken_sec: number;
    ideal_time_sec: number;
    is_correct: boolean;
    solution: string;
    shortcut?: string;
    option_rationales?: Record<string, string>;
    topic_name: string;
    difficulty: number;
    bookmarked?: boolean;
    personal_note?: string;
  }[];
}

export interface SeedRecord {
  id: string;
  topic_id: string;
  subtopic_id?: string;
  question_text: string;
  opt_a: string;
  opt_b: string;
  opt_c: string;
  opt_d: string;
  opt_e?: string;
  correct: string;
  solution?: string;
  difficulty_guess?: number;
  exam: string;
  year: number;
  source_note?: string;
  status: 'uploaded' | 'extracted' | 'needs_review' | 'approved_seed' | 'rejected';
  created_at: string;
}

export interface GenerationJob {
  id: string;
  topic_id?: string;
  topic_name?: string;
  difficulty?: number;
  count: number;
  method: 'template' | 'llm_twist' | 'ai_bootstrap';
  status: 'queued' | 'running' | 'completed' | 'failed';
  accepted_count: number;
  rejected_count: number;
  cost_usd: number;
  runtime_sec: number;
  created_at: string;
}

export interface ReportItem {
  id: string;
  question_id: string;
  user_name: string;
  user_id: string;
  reason: 'wrong_answer' | 'unclear' | 'wrong_solution' | 'typo' | 'other';
  text?: string;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
  question_stem?: string;
}
