import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const { question_id, reason, text } = await req.json();
    if (!question_id || !reason) {
      return NextResponse.json({ success: false, error: 'question_id and reason are required' }, { status: 400 });
    }

    const item = globalStore.reportQuestion(question_id, reason, text);
    return NextResponse.json({ success: true, report: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
