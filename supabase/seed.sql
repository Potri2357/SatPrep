-- ==============================================================================
-- SatPrep Seed Data: Real Bank Exam Pattern & Quant Questions
-- ==============================================================================

-- Exams
INSERT INTO exams (id, name, family, year_label, description, calculator_enabled, options_count, instructions_html) VALUES
('ibps-po-prelims-2026', 'IBPS PO Prelims 2026', 'Bank', '2026', 'Institute of Banking Personnel Selection Probationary Officer Preliminary Examination', FALSE, 5, '<p>Standard IBPS PO 20-minute sectional timing with negative marking of 0.25 marks per incorrect answer.</p>'),
('sbi-clerk-prelims-2026', 'SBI Clerk Prelims 2026', 'Bank', '2026', 'State Bank of India Junior Associates Preliminary Examination', FALSE, 5, '<p>Speed and accuracy focused quant section with 35 questions in 20 minutes.</p>'),
('rbi-assistant-2026', 'RBI Assistant Prelims 2026', 'Bank', '2026', 'Reserve Bank of India Assistant Numerical Ability Test', FALSE, 5, '<p>High cut-off speed exam testing arithmetic and number calculations.</p>')
ON CONFLICT (id) DO NOTHING;

-- Exam Stages & Sections
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

-- Subjects & Topics
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
