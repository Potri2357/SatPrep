# SatPrep — Bank Exam Quant & Aptitude Test Platform

**Production-grade Quantitative Aptitude and Data Interpretation test platform for Indian bank exams (SBI PO/Clerk, IBPS PO/Clerk, RBI Assistant, RRB).**

Built in strict compliance with the **SatPrep Product Requirements Document (v1.1)**.

---

## 🚀 Key Architectural Pillars

1. **Backend-First Test Assembly (TA-01 to TA-33)**
   - The entire test paper (questions, option shuffling, DI stimuli, marking scheme, timer config) is assembled, validated and frozen server-side before the candidate starts.
   - **Zero runtime generation**: No Gemini call or test shuffling happens in the render path, guaranteeing sub-2s test start.
   - Idempotent assembly by `request_id`.
   - Frozen immutable bundles with SHA-256 integrity checksums.

2. **Exam-Faithful Focus Mode Test Window (TW-01 to TW-20)**
   - Resembles the real bank examination interface (TCS iON / IBPS standard) with SatPrep high-end aesthetic tokens.
   - Server-synced countdown timer in DM Mono (turns amber at 10m, red at 1m, pause prohibited).
   - 5-state Question Palette using shape + color:
     1. Not Visited (neutral tile)
     2. Not Answered (danger tint / red)
     3. Answered (success tint / green)
     4. Marked for Review (purple circle)
     5. Answered & Marked (purple circle with green indicator)
   - KaTeX math rendering and full-width options with letter badges (52px minimum touch target).
   - Autosave with offline buffering and auto-submit on time expiry.

3. **Psychometric Error Diagnosis (AN-01 to AN-11)**
   - Instant scorecard with percentile, rank and section breakdown.
   - Step-by-step solutions and 15-20 second exam shortcut tricks.
   - **Wrong-Option Explanations**: Psychometric explanation for each distractor explaining *why* an aspirant mistakenly chose it (e.g. discount applied to CP instead of MP, sign flip error in quadratics).
   - One-tap "Practise Similar" and question error reporting.

4. **Python Worker & Parametric Template Engine (Section 10)**
   - Guaranteed 100% mathematically correct variants generated via Python code for Quadratic Equations, Simplification, Number Series, and Profit & Loss.
   - Isolated sandbox runner executing `solve()` routines to verify options before human review.
   - Gemini API pipeline for blueprint extraction, twist generation, and blind re-solve.

5. **Comprehensive Admin Console (`/admin`)**
   - Question bank management with live KaTeX preview.
   - Seed ingestion via CSV/Excel and PDF multimodal OCR.
   - Unified review queue with side-by-side solver outputs and keyboard shortcuts (`A` approve, `R` reject).
   - Generation control centre with global kill switch and auto top-up rules.
   - Historical re-grade tool recalculating affected attempts upon key correction.
   - Tamper-proof append-only admin audit log.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, KaTeX, Lucide Icons
- **Design System**: Derived from the SatPrep brand mark (Ice disc, rounded plus sign, 135° diagonal accent, DM Sans & DM Mono)
- **Database & Auth**: Supabase PostgreSQL with `pgvector`, Row Level Security (RLS), and secure RPC functions
- **Worker**: Python 3.12+ (FastAPI, SymPy, Google GenAI SDK, isolated sandbox runner)

---

## 📦 Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Review the values in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase project configuration (uses built-in self-contained mock store if default keys are kept).
- `GEMINI_API_KEY`: Google Generative AI API key for LLM twist generation and PDF OCR.
- `WORKER_URL`: Python worker service URL (`http://localhost:8000`).

### 2. Run the Next.js Web App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application:
- **Landing Page**: `/`
- **Candidate Dashboard**: `/dashboard`
- **Test Creation Flow**: `/tests/new`
- **Practice Hub**: `/practice`
- **Candidate Profile**: `/profile`
- **Admin Console**: `/admin`

### 3. Run the Python Worker (Optional for Local Pipeline)

```bash
cd worker
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn worker.main:app --reload --port 8000
```

### 4. Database Setup (Supabase)

To apply the schema to a live Supabase instance:
```bash
supabase db push
# or run the SQL script in the Supabase SQL Editor:
# supabase/migrations/20261025000000_init_satprep_schema.sql
# supabase/seed.sql
```

---

## 📂 Project Structure

```
SatPrep/
├── .env.example                      # Environment configuration template
├── .env                              # Local environment variables
├── package.json                      # Next.js dependencies & scripts
├── tsconfig.json                     # TypeScript config
├── supabase/
│   ├── migrations/
│   │   └── 20261025000000_init_satprep_schema.sql # Complete DB schema, RLS & tables
│   └── seed.sql                      # Seed exams, taxonomy and sample questions
├── worker/
│   ├── main.py                       # FastAPI worker service
│   ├── requirements.txt              # Worker dependencies
│   ├── config.py                     # Worker configuration
│   ├── assembler.py                  # Backend test assembler (TA-01 to TA-33)
│   ├── templates.py                  # Parametric math question generators
│   ├── sandbox.py                    # Isolated solver verification sandbox
│   └── pipeline.py                   # Gemini API blueprint & twist pipeline
└── src/
    ├── app/
    │   ├── layout.tsx                # App layout with DM Sans & KaTeX
    │   ├── page.tsx                  # Marketing landing page
    │   ├── auth/page.tsx             # Candidate sign in / sign up
    │   ├── onboarding/page.tsx       # 3-step onboarding flow
    │   ├── dashboard/page.tsx        # Candidate dashboard with quick starts
    │   ├── tests/
    │   │   ├── new/page.tsx          # Auto/Manual test creation flow
    │   │   ├── building/[id]/page.tsx# "Building your test" progress screen
    │   │   ├── [id]/instructions/page.tsx # Exam instructions & palette legend
    │   │   ├── [id]/exam/page.tsx    # Focus mode exam test window
    │   │   └── result/[attemptId]/page.tsx # Scorecard, analysis & solutions
    │   ├── practice/page.tsx         # Instant feedback practice & revision
    │   ├── profile/page.tsx          # Candidate profile & subscription
    │   ├── admin/                    # Complete Admin Console
    │   │   ├── layout.tsx            # Navy sidebar & Ctrl+K command palette
    │   │   ├── page.tsx              # Admin dashboard & inventory matrix
    │   │   ├── questions/page.tsx    # Question bank management & KaTeX preview
    │   │   ├── seed/page.tsx         # CSV / PDF seed ingestion
    │   │   ├── review/page.tsx       # Side-by-side solver review queue (A/R)
    │   │   ├── generation/page.tsx   # Generation control centre & kill switch
    │   │   ├── reports/page.tsx      # Quality inbox & historical re-grade tool
    │   │   └── settings/page.tsx     # Calibration rules & immutable audit log
    │   └── api/                      # Next.js backend API routes
    ├── components/
    │   └── brand-logo.tsx            # SVG logo with 45° diagonal plus mark on ice disc
    └── lib/
        ├── types.ts                  # TypeScript definitions
        ├── store.ts                  # Unified store & test engine
        ├── math-renderer.tsx         # KaTeX component
        └── supabase.ts               # Supabase client wrapper
```

---

## 📄 License
Private and Confidential. Prepared for SatPrep platform development.
