-- ==============================================================================
-- SatPrep Complete Schema & Initial Data for Supabase
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Enable standard UUID and Crypto extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Taxonomy & Exam Structure
CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    family TEXT NOT NULL DEFAULT 'Bank',
    year_label TEXT NOT NULL,
    description TEXT,
    calculator_enabled BOOLEAN DEFAULT FALSE,
    options_count INTEGER DEFAULT 5,
    status TEXT DEFAULT 'active',
    instructions_html TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_stages (
    id TEXT PRIMARY KEY,
    exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS exam_sections (
    id TEXT PRIMARY KEY,
    stage_id TEXT NOT NULL REFERENCES exam_stages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    question_count INTEGER NOT NULL DEFAULT 35,
    duration_min INTEGER NOT NULL DEFAULT 20,
    marks_per_q NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    negative_marks NUMERIC(4,2) NOT NULL DEFAULT 0.25,
    order_index INTEGER DEFAULT 1,
    section_lock BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES subjects(id),
    name TEXT NOT NULL,
    group_name TEXT NOT NULL,
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

-- 3. Questions & Keys
CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    stem TEXT NOT NULL,
    options JSONB NOT NULL,
    type TEXT NOT NULL DEFAULT 'mcq',
    topic_id TEXT REFERENCES topics(id),
    subtopic_id TEXT REFERENCES subtopics(id),
    difficulty_assigned INTEGER NOT NULL DEFAULT 2,
    difficulty_empirical NUMERIC(3,2),
    status TEXT NOT NULL DEFAULT 'live',
    source TEXT NOT NULL DEFAULT 'seed',
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_keys (
    question_id TEXT PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
    correct_option TEXT NOT NULL,
    solution TEXT NOT NULL,
    shortcut TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tests & Attempts
CREATE TABLE IF NOT EXISTS tests (
    id TEXT PRIMARY KEY,
    exam_id TEXT REFERENCES exams(id),
    title TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'full_mock',
    question_count INTEGER NOT NULL DEFAULT 35,
    duration_min INTEGER NOT NULL DEFAULT 20,
    status TEXT NOT NULL DEFAULT 'ready',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id TEXT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL REFERENCES tests(id),
    user_id TEXT NOT NULL DEFAULT 'user-default-1',
    status TEXT NOT NULL DEFAULT 'in_progress',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    score NUMERIC(5,2),
    accuracy NUMERIC(5,2)
);

CREATE TABLE IF NOT EXISTS attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option TEXT,
    is_correct BOOLEAN,
    time_spent_sec INTEGER DEFAULT 0
);

-- 5. Enable RLS with Open Public Read & Write for Platform App
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers ENABLE ROW LEVEL SECURITY;

-- Create Permissive Policies
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public access policy" ON %I;', tbl);
    EXECUTE format('CREATE POLICY "Public access policy" ON %I FOR ALL USING (true) WITH CHECK (true);', tbl);
  END LOOP;
END $$;

-- 6. Insert Core Taxonomy Seed Data
INSERT INTO subjects (id, name) VALUES ('quant', 'Quantitative Aptitude') ON CONFLICT (id) DO NOTHING;

INSERT INTO topics (id, subject_id, name, group_name, is_template_eligible, is_di) VALUES
('percentage', 'quant', 'Percentage', 'Arithmetic', TRUE, FALSE),
('profit-and-loss', 'quant', 'Profit and Loss', 'Arithmetic', TRUE, FALSE),
('si-ci', 'quant', 'Simple & Compound Interest', 'Arithmetic', TRUE, FALSE),
('ratio-proportion', 'quant', 'Ratio and Proportion', 'Arithmetic', TRUE, FALSE),
('time-and-work', 'quant', 'Time and Work', 'Arithmetic', TRUE, FALSE),
('time-speed-distance', 'quant', 'Time, Speed and Distance', 'Arithmetic', TRUE, FALSE),
('quadratic-equations', 'quant', 'Quadratic Equations', 'Number-based', TRUE, FALSE),
('simplification', 'quant', 'Simplification & Approximation', 'Number-based', TRUE, FALSE),
('number-series', 'quant', 'Number Series', 'Number-based', TRUE, FALSE),
('tabular-di', 'quant', 'Tabular Data Interpretation', 'DI', FALSE, TRUE),
('bar-pie-di', 'quant', 'Bar & Pie Chart DI', 'DI', FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO subtopics (id, topic_id, name) VALUES
('successive-percentage', 'percentage', 'Successive Percentage & Net Change'),
('dishonest-dealer', 'profit-and-loss', 'Marked Price & Discount Schemes'),
('ci-installments', 'si-ci', 'Compound Interest Differences and Multipliers'),
('root-comparison', 'quadratic-equations', 'Root Comparison (x and y)'),
('missing-number-series', 'number-series', 'Missing & Wrong Term in Pattern')
ON CONFLICT (id) DO NOTHING;

INSERT INTO exams (id, name, family, year_label, description, calculator_enabled, options_count, instructions_html) VALUES
('ibps-po-prelims-2026', 'IBPS PO Prelims 2026', 'Bank', '2026', 'Institute of Banking Personnel Selection Probationary Officer Preliminary Examination', FALSE, 5, '<p>Standard IBPS PO 20-minute sectional timing with negative marking of 0.25 marks per incorrect answer.</p>'),
('sbi-clerk-prelims-2026', 'SBI Clerk Prelims 2026', 'Bank', '2026', 'State Bank of India Junior Associates Preliminary Examination', FALSE, 5, '<p>Speed and accuracy focused quant section with 35 questions in 20 minutes.</p>'),
('rbi-assistant-2026', 'RBI Assistant Prelims 2026', 'Bank', '2026', 'Reserve Bank of India Assistant Numerical Ability Test', FALSE, 5, '<p>High cut-off speed exam testing arithmetic and number calculations.</p>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO exam_stages (id, exam_id, name, order_index) VALUES
('stage-ibps-po-prelims', 'ibps-po-prelims-2026', 'Prelims', 1),
('stage-sbi-clerk-prelims', 'sbi-clerk-prelims-2026', 'Prelims', 1),
('stage-rbi-asst-prelims', 'rbi-assistant-2026', 'Prelims', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO exam_sections (id, stage_id, name, question_count, duration_min, marks_per_q, negative_marks, order_index, section_lock) VALUES
('sec-ibps-quant', 'stage-ibps-po-prelims', 'Quantitative Aptitude', 35, 20, 1.00, 0.25, 1, TRUE),
('sec-sbi-quant', 'stage-sbi-clerk-prelims', 'Quantitative Aptitude', 35, 20, 1.00, 0.25, 1, TRUE),
('sec-rbi-numerical', 'stage-rbi-asst-prelims', 'Numerical Ability', 35, 20, 1.00, 0.25, 1, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 7. Notify PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
