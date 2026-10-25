import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exam_id, mode, topics, question_count, duration_min, source_type, selected_qids } = body;

    const test = globalStore.assembleTest({
      exam_id: exam_id || 'ibps-po-prelims-2026',
      mode: mode || 'topic_test',
      topics: topics || ['quadratic-equations'],
      question_count: Number(question_count) || 5,
      duration_min: duration_min ? Number(duration_min) : undefined,
      source_type: source_type || 'auto',
      selected_qids,
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
