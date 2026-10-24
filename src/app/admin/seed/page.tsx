'use client';

import React, { useState } from 'react';
import { INITIAL_TOPICS } from '@/lib/store';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
} from 'lucide-react';

export default function SeedIngestionPage() {
  const [activeTab, setActiveTab] = useState<'csv' | 'pdf' | 'matrix'>('csv');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);

  const handleSimulateCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Parsing and validating rows...');
    setTimeout(() => {
      setUploadStatus('Validation Passed: 12 valid seeds found, 0 row errors.');
      setParsedRows([
        {
          topic: 'quadratic-equations',
          stem: '$x^2 - 14x + 48 = 0$, $y^2 - 16y + 63 = 0$',
          correct: 'b',
          difficulty: 3,
          exam: 'IBPS PO Prelims',
          year: 2024,
        },
        {
          topic: 'simplification',
          stem: '$35\\% \\text{ of } 1400 + \\sqrt{1024} \\div 4 = ?$',
          correct: 'a',
          difficulty: 2,
          exam: 'SBI Clerk Prelims',
          year: 2023,
        },
      ]);
    }, 1000);
  };

  const downloadCSVTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,topic,subtopic,question_text,opt_a,opt_b,opt_c,opt_d,opt_e,correct,solution,difficulty_guess,exam,year,source_note\n' +
      'quadratic-equations,root-comparison,"x^2 - 11x + 30 = 0, y^2 - 17y + 72 = 0",x > y,x < y,x >= y,x <= y,x = y or no relation,b,"Factor equations to find roots",2,IBPS PO,2024,Shift 1 Memory Based';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'satprep_seed_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#212835] dark:text-white">
            Seed Question Ingestion Engine
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest private previous year questions (PYQs) via CSV, Excel, or PDF OCR to anchor blueprints.
          </p>
        </div>

        <button
          onClick={downloadCSVTemplate}
          className="px-3.5 py-2 rounded-xl border border-[#DDE4EE] dark:border-[#2E3746] bg-white dark:bg-[#151A23] text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#1B212C]"
        >
          <Download className="w-4 h-4 text-[#2D6BCB]" />
          <span>Download Seed CSV Template</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl p-1 bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] max-w-md text-xs">
        <button
          onClick={() => setActiveTab('csv')}
          className={`flex-1 py-1.5 font-semibold rounded-lg transition-all ${
            activeTab === 'csv' ? 'bg-[#2D6BCB] text-white shadow-sm' : 'text-slate-500 hover:text-white'
          }`}
        >
          CSV / Excel Upload
        </button>
        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex-1 py-1.5 font-semibold rounded-lg transition-all ${
            activeTab === 'pdf' ? 'bg-[#2D6BCB] text-white shadow-sm' : 'text-slate-500 hover:text-white'
          }`}
        >
          PDF Multimodal OCR
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex-1 py-1.5 font-semibold rounded-lg transition-all ${
            activeTab === 'matrix' ? 'bg-[#2D6BCB] text-white shadow-sm' : 'text-slate-500 hover:text-white'
          }`}
        >
          Seed Coverage Matrix
        </button>
      </div>

      {activeTab === 'csv' && (
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <div className="p-8 rounded-2xl bg-white dark:bg-[#151A23] border-2 border-dashed border-[#DDE4EE] dark:border-[#2E3746] hover:border-[#2D6BCB] text-center space-y-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#DCE8F8] dark:bg-[#2D6BCB]/20 text-[#2D6BCB] flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <div className="font-bold text-sm text-[#212835] dark:text-white">
                Drag and drop your Seed CSV or Excel File here
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Adheres strictly to SatPrep Appendix A specification. Maximum 500 rows per batch.
              </div>
            </div>

            <label className="inline-flex items-center px-4 py-2 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] text-white text-xs font-semibold cursor-pointer shadow-sm">
              <span>Select CSV File</span>
              <input type="file" accept=".csv,.xlsx" onChange={handleSimulateCSVUpload} className="hidden" />
            </label>

            {uploadStatus && (
              <div className="pt-2 text-xs font-semibold text-[#1F9D6B] flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          {/* Validation Results Preview */}
          {parsedRows.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Extracted Seed Rows Preview</span>
                <button
                  onClick={() => alert('Approved seeds sent to blueprint extraction pipeline!')}
                  className="px-4 py-1.5 rounded-lg bg-[#1F9D6B] hover:bg-[#178559] text-white text-xs font-bold"
                >
                  Confirm &amp; Extract Blueprints
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="p-2.5">Topic</th>
                      <th className="p-2.5">Stem Preview</th>
                      <th className="p-2.5">Key</th>
                      <th className="p-2.5">Difficulty</th>
                      <th className="p-2.5">Exam &amp; Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {parsedRows.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2.5 capitalize">{r.topic}</td>
                        <td className="p-2.5 font-mono">{r.stem}</td>
                        <td className="p-2.5 font-bold uppercase text-[#1F9D6B]">{r.correct}</td>
                        <td className="p-2.5 font-mono">Level {r.difficulty}</td>
                        <td className="p-2.5 text-slate-500">{r.exam} ({r.year})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pdf' && (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] space-y-4 text-center">
          <FileText className="w-10 h-10 text-[#2D6BCB] mx-auto" />
          <h2 className="text-base font-bold text-[#212835] dark:text-white">Multimodal Gemini PDF Extraction</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Upload memory-based exam papers (PDF or scanned images). Gemini will extract question stems, options, and diagrams into editable structured JSON.
          </p>
          <label className="inline-flex items-center px-4 py-2 rounded-xl bg-[#2D6BCB] text-white text-xs font-semibold cursor-pointer">
            <span>Upload Memory-Based PDF</span>
            <input type="file" accept=".pdf" className="hidden" onChange={() => alert('PDF queued for multimodal extraction!')} />
          </label>
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] space-y-4">
          <h2 className="text-sm font-bold text-[#212835] dark:text-white">
            Seed Coverage Matrix (Target: Min 15 approved seeds per topic)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INITIAL_TOPICS.map((t) => (
              <div key={t.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span>{t.name}</span>
                <span className="font-mono font-bold text-[#1F9D6B]">18 / 15 Seeds</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
