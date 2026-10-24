import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const { attempt_id, question_id, selected_option, state, time_spent_sec } = await req.json();

    const saved = globalStore.saveAnswer(
      attempt_id,
      question_id,
      selected_option,
      state || 'answered',
      time_spent_sec || 0
    );

    return NextResponse.json({ success: true, saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
