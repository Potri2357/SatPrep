import { NextRequest, NextResponse } from 'next/server';
import { globalStore, INITIAL_TOPICS } from '@/lib/store';
import {
  generateMultipleBankingQuestionsWithCascade,
  generateProceduralQuestions,
  GeneratedQuestionPayload,
} from '@/lib/gemini';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/uploaded_questions.json');

export async function POST(req: NextRequest) {
  try {
    const { topic_id, difficulty, count, method, preferred_model } = await req.json();
    const topicObj = INITIAL_TOPICS.find((t) => t.id === topic_id);
    const topicName = topicObj ? topicObj.name : 'Quantitative Aptitude';
    const targetCount = Math.min(Math.max(Number(count) || 1, 1), 20);

    let generatedQuestions: GeneratedQuestionPayload[] = [];
    let telemetry = null;
    const actualMethod = method || 'llm_twist';

    if (method === 'llm_twist') {
      const result = await generateMultipleBankingQuestionsWithCascade(
        topic_id,
        topicName,
        difficulty || 3,
        targetCount,
        preferred_model
      );
      generatedQuestions = result.questions || [];
      telemetry = result.telemetry;
    } else {
      // Standard Formula / Template method
      generatedQuestions = generateProceduralQuestions(
        topic_id,
        topicName,
        difficulty || 3,
        targetCount
      );
    }

    // Fallback if empty
    if (!generatedQuestions || generatedQuestions.length === 0) {
      generatedQuestions = generateProceduralQuestions(
        topic_id,
        topicName,
        difficulty || 3,
        targetCount
      );
    }

    // Save all generated questions into local store & Supabase
    const savedQuestions: any[] = [];
    const questionsToUpsert: any[] = [];
    const keysToUpsert: any[] = [];

    const nowBase = Date.now();
    for (let idx = 0; idx < generatedQuestions.length; idx++) {
      const q = generatedQuestions[idx];
      const qId = `q-ai-${nowBase}-${idx + 1}`;

      const qRow = {
        id: qId,
        topic_id: q.topic_id || topic_id,
        type: 'mcq',
        difficulty_assigned: q.difficulty || difficulty || 3,
        status: 'live',
        source: actualMethod === 'llm_twist' ? 'ai_twist' : 'template',
        version: 1,
        stem: q.stem,
        options: q.options,
      };

      const keyRow = {
        question_id: qId,
        correct_option: q.correct_option.toLowerCase(),
        solution: q.solution || 'Detailed calculation provided in question analysis.',
        shortcut: q.shortcut || undefined,
        option_rationales: q.option_rationales || undefined,
      };

      globalStore.addQuestion(qRow as any, keyRow);
      questionsToUpsert.push(qRow);
      keysToUpsert.push(keyRow);

      savedQuestions.push({
        ...qRow,
        ...keyRow,
      });
    }

    // 1. Direct persistent upsert into Supabase (await so Vercel does not terminate lambda prematurely)
    try {
      await supabaseAdmin.from('topics').upsert(
        [
          {
            id: topic_id,
            subject_id: 'quant',
            name: topicName,
            group_name: topicObj?.group_name || 'Arithmetic',
            target_stock: 150,
            min_stock: 50,
            is_template_eligible: true,
            is_di: false,
            mains_only: false,
          },
        ],
        { onConflict: 'id' }
      );

      const [qRes, kRes] = await Promise.all([
        supabaseAdmin.from('questions').upsert(questionsToUpsert),
        supabaseAdmin.from('question_keys').upsert(keysToUpsert),
      ]);

      if (qRes.error || kRes.error) {
        console.warn('Supabase questions generation upsert notice:', qRes.error, kRes.error);
      }
    } catch (sbErr) {
      console.warn('Supabase questions generation upsert error:', sbErr);
    }

    // 2. Local disk backup cache if running in writable environment
    try {
      let existingRows: any[] = [];
      if (fs.existsSync(DATA_FILE_PATH)) {
        existingRows = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf-8')) || [];
      }
      for (const sq of savedQuestions) {
        existingRows.push({
          question: {
            id: sq.id,
            topic_id: sq.topic_id,
            type: sq.type,
            difficulty_assigned: sq.difficulty_assigned,
            status: sq.status,
            source: sq.source,
            version: sq.version,
            stem: sq.stem,
            options: sq.options,
          },
          key: {
            question_id: sq.id,
            correct_option: sq.correct_option,
            solution: sq.solution,
            shortcut: sq.shortcut,
            option_rationales: sq.option_rationales,
          },
        });
      }
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(existingRows, null, 2), 'utf-8');
    } catch (diskErr) {
      // Non-fatal if serverless filesystem is read-only
    }

    const job = globalStore.createJob({
      topic_id,
      difficulty: difficulty || 3,
      count: savedQuestions.length,
      method: actualMethod as any,
    });

    return NextResponse.json({
      success: true,
      job,
      generated_questions: savedQuestions,
      generated_question: savedQuestions[0] || null,
      telemetry,
      count: savedQuestions.length,
      ai_powered: Boolean(telemetry),
    });
  } catch (err: any) {
    console.error('Error in generation API:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
