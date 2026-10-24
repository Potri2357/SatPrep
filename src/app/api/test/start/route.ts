import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const { test_id } = await req.json();
    if (!test_id) {
      return NextResponse.json({ success: false, error: 'test_id is required' }, { status: 400 });
    }

    const { attempt, bundle } = globalStore.startAttempt(test_id);

    return NextResponse.json({
      success: true,
      attempt_id: attempt.id,
      started_at: attempt.started_at,
      section_deadlines: attempt.section_deadlines,
      bundle,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
