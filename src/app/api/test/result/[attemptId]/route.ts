import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const cleanId = attemptId && attemptId !== 'undefined' ? attemptId.trim() : '';
    if (!cleanId) {
      return NextResponse.json(
        { success: false, error: 'Valid attemptId is required' },
        { status: 400 }
      );
    }

    const snapshot = globalStore.getResultSnapshot(cleanId);
    if (!snapshot) {
      return NextResponse.json(
        { success: false, error: 'Test result not found' },
        { status: 404 }
      );
    }

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
  } catch (err: any) {
    console.error('Error fetching result snapshot:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch result' },
      { status: 500 }
    );
  }
}
