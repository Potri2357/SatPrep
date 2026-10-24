import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const test = globalStore.getTest(id);

  if (!test) {
    return NextResponse.json({ success: false, error: 'Test not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    test: {
      id: test.id,
      status: test.status,
      bundle: test.bundle,
      checksum: test.checksum,
    },
  });
}
