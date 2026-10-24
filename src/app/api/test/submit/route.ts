import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const { attempt_id } = await req.json();
    if (!attempt_id) {
      return NextResponse.json({ success: false, error: 'attempt_id is required' }, { status: 400 });
    }

    const snapshot = globalStore.submitAttempt(attempt_id);

    return NextResponse.json({
      success: true,
      attempt_id,
      score: snapshot.score_card.total_score,
      accuracy: snapshot.score_card.accuracy_percent,
      snapshot_ready: true,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
