import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const { topic_id, difficulty, count, method } = await req.json();

    const job = globalStore.createJob({
      topic_id,
      difficulty: difficulty || 3,
      count: count || 10,
      method: method || 'template',
    });

    return NextResponse.json({ success: true, job });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
