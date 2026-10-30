import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, exam_id, mode, topics, question_count, duration_min, source_type, selected_qids, feedback_mode } = body;

    // Sync any newly saved/generated questions from Supabase into runtime store
    try {
      const { data: sbQuestions } = await supabaseAdmin
        .from('questions')
        .select('*')
        .limit(200);

      const { data: sbKeys } = await supabaseAdmin
        .from('question_keys')
        .select('*')
        .limit(200);

      if (Array.isArray(sbQuestions) && sbQuestions.length > 0) {
        const keyMap = new Map<string, any>();
        if (Array.isArray(sbKeys)) {
          for (const k of sbKeys) keyMap.set(k.question_id, k);
        }
        for (const q of sbQuestions) {
          const k = keyMap.get(q.id);
          globalStore.addQuestion(q, k || {
            question_id: q.id,
            correct_option: 'a',
            solution: 'Detailed calculation available in review.',
          });
        }
      }
    } catch {
      // Non-blocking fallback to local store
    }

    const test = globalStore.assembleTest({
      title: title || body.test_name,
      exam_id: exam_id || 'ibps-po-prelims-2026',
      mode: mode || 'topic_test',
      topics: topics || ['quadratic-equations'],
      question_count: Number(question_count) || 5,
      duration_min: duration_min ? Number(duration_min) : undefined,
      source_type: source_type || 'auto',
      selected_qids,
      feedback_mode,
    });

    return NextResponse.json({
      success: true,
      test_id: test.id,
      status: test.status,
      checksum: test.checksum,
      total_questions: test.bundle?.total_questions,
      freshness_percent: test.bundle?.freshness_percent,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
