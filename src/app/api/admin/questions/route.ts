import { NextRequest, NextResponse } from 'next/server';
import { ALL_PRACTICE_KEYS, globalStore } from '@/lib/store';
import { Question, QuestionKey } from '@/lib/types';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/uploaded_questions.json');

export async function GET() {
  const map = new Map<string, any>();
  const keysMap = new Map<string, any>();

  // Load initial store keys
  for (const [qid, k] of Object.entries(ALL_PRACTICE_KEYS)) {
    keysMap.set(qid, k);
  }

  // 1. In-memory / initial store questions
  for (const q of globalStore.getQuestions()) {
    map.set(q.id, { ...q });
  }

  // 2. Persisted local file questions
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const persisted = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf-8'));
      if (Array.isArray(persisted)) {
        for (const item of persisted) {
          if (item?.question) {
            map.set(item.question.id, { ...item.question });
          }
          if (item?.key) {
            keysMap.set(item.key.question_id, item.key);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not read uploaded_questions.json:', err);
  }

  // 3. IBPS PO 2025 Extracted Quant Questions
  const ibpsPath = path.join(process.cwd(), 'src/data/ibps_po_2025_quant.json');
  try {
    if (fs.existsSync(ibpsPath)) {
      const ibpsData = JSON.parse(fs.readFileSync(ibpsPath, 'utf-8'));
      if (Array.isArray(ibpsData)) {
        for (const item of ibpsData) {
          map.set(item.id, {
            id: item.id,
            stem: item.stem,
            options: [
              { id: 'a', text: item.option_a },
              { id: 'b', text: item.option_b },
              { id: 'c', text: item.option_c },
              { id: 'd', text: item.option_d },
              { id: 'e', text: item.option_e },
            ],
            type: 'mcq',
            topic_id: item.topic,
            difficulty_assigned: item.difficulty,
            status: 'live',
            source: 'manual',
            version: 1,
            correct_option: item.correct,
            solution: item.solution,
            shortcut: item.shortcut,
          });
          keysMap.set(item.id, {
            question_id: item.id,
            correct_option: item.correct,
            solution: item.solution,
            shortcut: item.shortcut,
          });
        }
      }
    }
  } catch (err) {
    console.warn('Could not read ibps_po_2025_quant.json:', err);
  }

  // 4. Supabase Cloud Database Questions & Keys
  try {
    const { data: sbQuestions, error: qErr } = await supabaseAdmin
      .from('questions')
      .select('*')
      .order('id', { ascending: false });

    const { data: sbKeys } = await supabaseAdmin
      .from('question_keys')
      .select('*');

    if (Array.isArray(sbKeys)) {
      for (const k of sbKeys) {
        keysMap.set(k.question_id, k);
      }
    }

    if (!qErr && Array.isArray(sbQuestions)) {
      for (const q of sbQuestions) {
        const k = keysMap.get(q.id);
        map.set(q.id, {
          id: q.id,
          stem: q.stem,
          options: q.options || [],
          type: q.type || 'mcq',
          topic_id: q.topic_id,
          difficulty_assigned: q.difficulty_assigned || 2,
          status: q.status || 'live',
          source: q.source || 'manual',
          version: q.version || 1,
          correct_option: k?.correct_option || 'a',
          solution: k?.solution,
          shortcut: k?.shortcut,
        });
      }
    }
  } catch (sbErr) {
    console.warn('Supabase fetch questions notice:', sbErr);
  }

  // Attach key to all questions
  const allQuestions = Array.from(map.values()).map((q) => {
    const k = keysMap.get(q.id);
    return {
      ...q,
      correct_option: q.correct_option || k?.correct_option || 'a',
      solution: q.solution || k?.solution,
      shortcut: q.shortcut || k?.shortcut,
    };
  });

  return NextResponse.json({
    success: true,
    count: allQuestions.length,
    questions: allQuestions,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, key } = body;

    if (!question || !question.id) {
      return NextResponse.json(
        { success: false, error: 'Question with valid ID is required' },
        { status: 400 }
      );
    }

    // 1. Update in Supabase
    try {
      const qRow = {
        id: question.id,
        stem: question.stem,
        options: question.options,
        type: question.type || 'mcq',
        topic_id: question.topic_id,
        difficulty_assigned: Number(question.difficulty_assigned) || 2,
        status: question.status || 'live',
        source: question.source || 'manual',
        version: (question.version || 1) + 1,
      };

      await supabaseAdmin.from('questions').upsert([qRow]);

      const correctOpt = (key?.correct_option || question.correct_option || 'a').toLowerCase();
      const sol = key?.solution || question.solution || 'Updated solution.';
      const short = key?.shortcut || question.shortcut || null;

      const kRow = {
        question_id: question.id,
        correct_option: correctOpt,
        solution: sol,
        shortcut: short,
      };

      await supabaseAdmin.from('question_keys').upsert([kRow]);
    } catch (sbErr) {
      console.warn('Supabase PUT notice:', sbErr);
    }

    // 2. Update local in-memory store
    const fullQuestion: Question = {
      id: question.id,
      stem: question.stem,
      options: question.options,
      type: question.type || 'mcq',
      topic_id: question.topic_id,
      difficulty_assigned: Number(question.difficulty_assigned) || 2,
      status: question.status || 'live',
      source: question.source || 'manual',
      version: (question.version || 1) + 1,
    };

    const fullKey: QuestionKey = {
      question_id: question.id,
      correct_option: (key?.correct_option || question.correct_option || 'a').toLowerCase(),
      solution: key?.solution || question.solution || 'Updated solution.',
      shortcut: key?.shortcut || question.shortcut,
    };

    globalStore.addQuestion(fullQuestion, fullKey);

    return NextResponse.json({
      success: true,
      question: {
        ...fullQuestion,
        correct_option: fullKey.correct_option,
        solution: fullKey.solution,
        shortcut: fullKey.shortcut,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update question' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questions } = body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Questions array is required' },
        { status: 400 }
      );
    }

    // Load existing persisted questions from file
    let persisted: { question: Question; key: QuestionKey }[] = [];
    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        persisted = JSON.parse(fileContent) || [];
      }
    } catch {
      persisted = [];
    }

    const supabaseQuestionRows: any[] = [];
    const supabaseKeyRows: any[] = [];
    let addedCount = 0;

    for (const item of questions) {
      const qid = item.id || `q-upload-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const options = item.options || [
        { id: 'a', text: item.option_a || 'Option A' },
        { id: 'b', text: item.option_b || 'Option B' },
        { id: 'c', text: item.option_c || 'Option C' },
        { id: 'd', text: item.option_d || 'Option D' },
        { id: 'e', text: item.option_e || 'None of these' },
      ];

      const questionObj: Question = {
        id: qid,
        stem: item.stem || item.stem_latex || 'Question stem',
        options,
        type: item.type || 'mcq',
        topic_id: item.topic_id || item.topic || 'simplification',
        difficulty_assigned: Number(item.difficulty) || 2,
        status: 'live',
        source: 'manual',
        version: 1,
      };

      const keyObj: QuestionKey = {
        question_id: qid,
        correct_option: (item.correct_option || item.correct_key || item.correct || 'a').toLowerCase(),
        solution: item.solution || 'Step-by-step derivation for this question.',
        shortcut: item.shortcut || undefined,
        option_rationales: item.option_rationales || undefined,
      };

      // Add to runtime store
      globalStore.addQuestion(questionObj, keyObj);

      // Add to persistent local list
      persisted.push({ question: questionObj, key: keyObj });

      // Prepare Supabase records
      supabaseQuestionRows.push({
        id: qid,
        stem: questionObj.stem,
        options: questionObj.options,
        type: questionObj.type,
        topic_id: questionObj.topic_id,
        difficulty_assigned: questionObj.difficulty_assigned,
        status: questionObj.status,
        source: questionObj.source,
        version: questionObj.version,
      });

      supabaseKeyRows.push({
        question_id: qid,
        correct_option: keyObj.correct_option,
        solution: keyObj.solution,
        shortcut: keyObj.shortcut || null,
      });

      addedCount++;
    }

    // 1. Save to Supabase Cloud Database
    let supabaseSaved = false;
    let supabaseError: any = null;
    try {
      if (supabaseQuestionRows.length > 0) {
        const uniqueTopics = Array.from(new Set(supabaseQuestionRows.map((r) => r.topic_id)));
        const topicRows = uniqueTopics.map((tId) => ({
          id: tId,
          subject_id: 'quant',
          name: tId.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          group_name: 'Arithmetic',
          is_template_eligible: true,
          is_di: tId.includes('di') || tId.includes('interpretation'),
          mains_only: false,
          target_stock: 150,
          min_stock: 50,
        }));
        await supabaseAdmin.from('topics').upsert(topicRows, { onConflict: 'id' });

        const { error: qErr } = await supabaseAdmin.from('questions').upsert(supabaseQuestionRows);
        const { error: kErr } = await supabaseAdmin.from('question_keys').upsert(supabaseKeyRows);
        if (!qErr && !kErr) {
          supabaseSaved = true;
        } else {
          supabaseError = qErr || kErr;
          console.warn('Supabase upsert warning:', qErr, kErr);
        }
      }
    } catch (sbErr: any) {
      supabaseError = sbErr?.message || sbErr;
      console.warn('Supabase sync notice:', sbErr);
    }

    // 2. Save backup to JSON file on disk
    try {
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(persisted, null, 2), 'utf-8');
    } catch (saveErr) {
      console.warn('Could not save to disk:', saveErr);
    }

    return NextResponse.json({
      success: true,
      added_count: addedCount,
      total_in_bank: globalStore.getQuestions().length,
      storage: {
        supabase: supabaseSaved ? 'saved' : 'pending',
        local_disk: 'saved',
        memory_store: 'live',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to upload questions' },
      { status: 500 }
    );
  }
}

