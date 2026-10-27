import { NextRequest, NextResponse } from 'next/server';
import { checkGeminiConnection } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const result = await checkGeminiConnection();
  return NextResponse.json(result, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
