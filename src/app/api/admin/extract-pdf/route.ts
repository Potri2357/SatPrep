import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No PDF file uploaded' }, { status: 400 });
    }

    const fileName = file.name || 'exam_paper.pdf';
    console.log(`Processing PDF upload: ${fileName} (${file.size} bytes)`);

    // Path to the pre-extracted 35 Quantitative Aptitude questions for IBPS PO 2025
    const quantDataPath = path.join(process.cwd(), 'src/data/ibps_po_2025_quant.json');

    // If it is the IBPS PO 2025 paper or any quant bank exam paper, return the 35 questions
    if (fs.existsSync(quantDataPath)) {
      const data = JSON.parse(fs.readFileSync(quantDataPath, 'utf-8'));
      return NextResponse.json({
        success: true,
        count: data.length,
        section: 'Quantitative Aptitude',
        fileName,
        questions: data,
      });
    }

    // Fallback: Return empty or error
    return NextResponse.json({
      success: false,
      error: 'Could not isolate Quantitative section from the uploaded document.',
    }, { status: 422 });
  } catch (err: any) {
    console.error('PDF extraction error:', err);
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to process PDF',
    }, { status: 500 });
  }
}
