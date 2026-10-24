import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const { attemptId } = await params;
  const snapshot = globalStore.getResultSnapshot(attemptId);

  if (!snapshot) {
    return NextResponse.json({ success: false, error: 'Snapshot not found or not submitted' }, { status: 404 });
  }

  return NextResponse.json({ success: true, snapshot });
}
