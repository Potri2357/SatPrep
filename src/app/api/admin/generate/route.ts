import { NextRequest, NextResponse } from 'next/server';
import { globalStore, INITIAL_TOPICS } from '@/lib/store';
import {
  generateMultipleBankingQuestionsWithCascade,
  generateProceduralQuestions,
  GeneratedQuestionPayload,
} from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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

    // Non-blocking async upsert into Supabase for persistent background sync
    (async () => {
      try {
        // Ensure topic exists in topics table
        await supabase.from('topics').upsert(
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

        await supabase.from('questions').upsert(questionsToUpsert);
        await supabase.from('question_keys').upsert(keysToUpsert);
      } catch (sbErr) {
        console.warn('Supabase questions generation async upsert notice:', sbErr);
      }
    })();

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
