import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const data = globalStore.getAllAttemptsSummary();
    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('Error fetching overall results summary:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
