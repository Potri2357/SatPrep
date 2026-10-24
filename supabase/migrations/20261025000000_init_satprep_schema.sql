-- ==============================================================================
-- SatPrep PostgreSQL Schema Initialization (Supabase)
-- Implements PRD Section 12 (Data Model), Section 13 (Security & RLS) and Section 15 (RPCs)
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & USERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    photo_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'reviewer', 'content_manager', 'support', 'admin')),
    target_exams TEXT[] DEFAULT ARRAY['IBPS PO', 'SBI PO'],
    exam_date DATE,
    daily_study_time_min INTEGER DEFAULT 60,
    self_rated_level INTEGER DEFAULT 2 CHECK (self_rated_level BETWEEN 1 AND 5),
    plan_id TEXT DEFAULT 'free',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. EXAM CONFIGURATION & TAXONOMY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    family TEXT NOT NULL DEFAULT 'Bank',
    year_label TEXT NOT NULL,
    description TEXT,
    calculator_enabled BOOLEAN DEFAULT FALSE,
    options_count INTEGER DEFAULT 5,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
    instructions_html TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_stages (
    id TEXT PRIMARY KEY,
    exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'Prelims', 'Mains'
    order_index INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS exam_sections (
    id TEXT PRIMARY KEY,
    stage_id TEXT NOT NULL REFERENCES exam_stages(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- 'Quantitative Aptitude'
    question_count INTEGER NOT NULL DEFAULT 35,
    duration_min INTEGER NOT NULL DEFAULT 20,
    marks_per_q NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    negative_marks NUMERIC(4,2) NOT NULL DEFAULT 0.25,
    order_index INTEGER DEFAULT 1,
    section_lock BOOLEAN DEFAULT TRUE,
    topic_weights JSONB DEFAULT '{}'::jsonb,
    difficulty_mix JSONB DEFAULT '{"1": 15, "2": 25, "3": 40, "4": 15, "5": 5}'::jsonb
);

CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES subjects(id),
    name TEXT NOT NULL,
    group_name TEXT NOT NULL, -- 'Arithmetic', 'Number-based', 'Advanced', 'DI'
    is_template_eligible BOOLEAN DEFAULT FALSE,
    is_di BOOLEAN DEFAULT FALSE,
    mains_only BOOLEAN DEFAULT FALSE,
    target_stock INTEGER DEFAULT 150,
    min_stock INTEGER DEFAULT 50
);

CREATE TABLE IF NOT EXISTS subtopics (
    id TEXT PRIMARY KEY,
    topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. QUESTIONS, STIMULI & KEYS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stimuli (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    chart_type TEXT CHECK (chart_type IN ('table', 'bar', 'line', 'pie', 'mixed', 'caselet', 'radar', 'missing_di')),
    structured_data JSONB, -- JSON representation of table rows, series, etc.
    caselet_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stem TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of { id: 'a'|'b'|'c'|'d'|'e', text: '...', render_html?: '...' }
    type TEXT NOT NULL DEFAULT 'mcq' CHECK (type IN ('mcq', 'di_set', 'quantity_comparison', 'quadratic', 'data_sufficiency')),
    topic_id TEXT REFERENCES topics(id),
    subtopic_id TEXT REFERENCES subtopics(id),
    difficulty_assigned INTEGER NOT NULL CHECK (difficulty_assigned BETWEEN 1 AND 5),
    difficulty_empirical NUMERIC(3,2),
    status TEXT NOT NULL DEFAULT 'reviewed' CHECK (status IN ('draft', 'auto_verified', 'needs_review', 'reviewed', 'live', 'flagged', 'retired')),
    source TEXT NOT NULL DEFAULT 'ai_twist' CHECK (source IN ('seed', 'ai_twist', 'template', 'ai_bootstrap', 'manual')),
    blueprint_id UUID,
    stimulus_id UUID REFERENCES stimuli(id),
    embedding vector(768),
    render_html TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    is_seed_visible BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Answer keys are isolated: strictly inaccessible by students before submission!
CREATE TABLE IF NOT EXISTS question_keys (
    question_id UUID PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
    correct_option TEXT NOT NULL, -- 'a'|'b'|'c'|'d'|'e'
    solution TEXT NOT NULL,
    shortcut TEXT,
    option_rationales JSONB, -- { "a": "Why someone picked A", "b": "..." }
    solver_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_stats (
    question_id UUID PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
    attempts INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    mean_time_sec NUMERIC(5,1) DEFAULT 0,
    option_distribution JSONB DEFAULT '{"a":0,"b":0,"c":0,"d":0,"e":0}'::jsonb,
    discrimination NUMERIC(3,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id TEXT REFERENCES topics(id),
    subtopic_id TEXT REFERENCES subtopics(id),
    question_text TEXT NOT NULL,
    opt_a TEXT NOT NULL,
    opt_b TEXT NOT NULL,
    opt_c TEXT NOT NULL,
    opt_d TEXT NOT NULL,
    opt_e TEXT,
    correct TEXT NOT NULL,
    solution TEXT,
    difficulty_guess INTEGER,
    exam TEXT,
    year INTEGER,
    source_note TEXT,
    status TEXT DEFAULT 'approved_seed' CHECK (status IN ('uploaded', 'extracted', 'needs_review', 'approved_seed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seed_id UUID REFERENCES seeds(id),
    concept TEXT NOT NULL,
    steps INTEGER DEFAULT 2,
    trap TEXT,
    shortcut TEXT,
    typical_time_sec INTEGER DEFAULT 60,
    variation_axes JSONB,
    forbidden_changes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. TEST ASSEMBLY & FROZEN BUNDLES (Backend-First)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner UUID REFERENCES profiles(id),
    exam_id TEXT REFERENCES exams(id),
    mode TEXT NOT NULL CHECK (mode IN ('full_mock', 'sectional', 'topic_test', 'weak_area', 'revision')),
    source_type TEXT NOT NULL DEFAULT 'auto' CHECK (source_type IN ('auto', 'manual', 'curated')),
    config JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('requested', 'assembling', 'generating_shortfall', 'ready', 'in_progress', 'expired', 'failed')),
    request_id TEXT UNIQUE,
    ready_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    question_version INTEGER NOT NULL DEFAULT 1,
    section_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    option_order TEXT[] NOT NULL DEFAULT ARRAY['a', 'b', 'c', 'd', 'e'],
    UNIQUE(test_id, position)
);

CREATE TABLE IF NOT EXISTS test_bundles (
    test_id UUID PRIMARY KEY REFERENCES tests(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    payload JSONB NOT NULL, -- Pre-rendered questions, stems, options, stimuli, metadata without answers
    checksum TEXT NOT NULL,
    size_bytes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id TEXT REFERENCES exams(id),
    mode TEXT NOT NULL,
    config JSONB NOT NULL,
    bundle_ref JSONB NOT NULL,
    status TEXT DEFAULT 'active',
    stock_count INTEGER DEFAULT 10,
    refreshed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. ATTEMPTS & TEST RUNTIME
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(id),
    user_id UUID NOT NULL REFERENCES profiles(id),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    current_section_id TEXT,
    section_started_at TIMESTAMPTZ DEFAULT NOW(),
    section_deadlines JSONB NOT NULL, -- { "quant": "2026-10-25T03:20:00Z" }
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'abandoned', 'expired')),
    score NUMERIC(5,2),
    submitted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS attempt_answers (
    attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    selected_option TEXT,
    state TEXT NOT NULL DEFAULT 'not_answered' CHECK (state IN ('not_visited', 'not_answered', 'answered', 'marked_for_review', 'answered_and_marked')),
    time_spent_sec INTEGER DEFAULT 0,
    visits INTEGER DEFAULT 1,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS attempt_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'focus_loss', 'fullscreen_exit', 'reconnect', 'time_sync'
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS result_snapshots (
    attempt_id UUID PRIMARY KEY REFERENCES attempts(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    payload JSONB NOT NULL, -- Complete score card, section breakdown, topic strength, time analysis, strategy
    computed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_question_history (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    seen_count INTEGER DEFAULT 1,
    last_result TEXT CHECK (last_result IN ('correct', 'wrong', 'skipped')),
    bookmarked BOOLEAN DEFAULT FALSE,
    note TEXT,
    last_attempted_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(user_id, question_id)
);

-- ------------------------------------------------------------------------------
-- 6. QUALITY, REPORTS, JOBS & AUDIT
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id),
    user_id UUID NOT NULL REFERENCES profiles(id),
    reason TEXT NOT NULL CHECK (reason IN ('wrong_answer', 'unclear', 'wrong_solution', 'typo', 'other')),
    text TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
    resolved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id TEXT REFERENCES topics(id),
    difficulty INTEGER,
    count INTEGER NOT NULL,
    method TEXT DEFAULT 'template' CHECK (method IN ('template', 'llm_twist', 'ai_bootstrap')),
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
    accepted_count INTEGER DEFAULT 0,
    rejected_count INTEGER DEFAULT 0,
    cost_usd NUMERIC(6,4) DEFAULT 0,
    runtime_sec NUMERIC(6,2),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor UUID,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    before JSONB,
    after JSONB,
    ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_snapshots ENABLE ROW LEVEL SECURITY;

-- Profiles: users read & update their own profile; admins read all
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth_user_id = auth.uid() OR role = 'admin');

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth_user_id = auth.uid());

-- Questions: public can view live questions stems and options (NOT keys)
CREATE POLICY "Anyone can view live questions" ON questions
    FOR SELECT USING (status IN ('reviewed', 'live'));

-- Question Keys: Students CANNOT view keys directly! Only accessible via RPC get_result after submit
CREATE POLICY "Admins and reviewers can read keys" ON question_keys
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.auth_user_id = auth.uid() 
            AND profiles.role IN ('admin', 'reviewer', 'content_manager')
        )
    );

-- Tests and Attempts: Users can view their own
CREATE POLICY "Users can view own tests" ON tests
    FOR SELECT USING (owner IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view own attempts" ON attempts
    FOR ALL USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view own attempt answers" ON attempt_answers
    FOR ALL USING (
        attempt_id IN (
            SELECT id FROM attempts 
            WHERE user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
        )
    );
