import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const { question_id, new_correct_option } = await req.json();
    if (!question_id || !new_correct_option) {
      return NextResponse.json({ success: false, error: 'question_id and new_correct_option are required' }, { status: 400 });
    }

    const res = globalStore.regradeQuestion(question_id, new_correct_option);

    return NextResponse.json({
      success: true,
      question_id,
      new_correct_option,
      affected_attempts: res.affected_attempts,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
