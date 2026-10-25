import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const cleanId = attemptId && attemptId !== 'undefined' ? attemptId : 'sample-attempt-1';
    const snapshot = globalStore.getResultSnapshot(cleanId);

    return NextResponse.json(
      { success: true, snapshot },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (err) {
    console.error('Error fetching result snapshot:', err);
    const fallback = globalStore.generateFallbackSnapshot('sample-attempt-1');
    return NextResponse.json(
      { success: true, snapshot: fallback },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
