'use client';

import React, { useState } from 'react';
import { INITIAL_TOPICS } from '@/lib/store';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  ArrowRight,
  Database,
  Layers,
} from 'lucide-react';

export default function SeedIngestionPage() {
  const [activeTab, setActiveTab] = useState<'csv' | 'pdf' | 'matrix'>('csv');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);

  // Simulation of CSV parsing & validation (PRD Section 9.2 AD-10 to AD-14)
  const handleSimulateCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Parsing and validating Appendix A CSV schema...');
    setTimeout(() => {
      setParsedRows([
        {
          topic: 'profit-and-loss',
          stem: 'A shopkeeper marks an article $30\\%$ above cost price and allows an $8\\%$ discount...',
          correct: 'a',
          difficulty: 2,
          exam: 'IBPS PO Prelims',
          year: 2024,
        },
        {
          topic: 'time-speed-distance',
          stem: 'A train $180\\text{ m}$ long passes a pole in $9\\text{ seconds}$...',
          correct: 'c',
          difficulty: 1,
          exam: 'SBI Clerk Prelims',
          year: 2023,
        },
        {
          topic: 'data-interpretation',
          stem: 'Refer to the table below showing revenue of 4 regional rural banks...',
          correct: 'd',
          difficulty: 3,
          exam: 'RRB Scale I Mains',
          year: 2024,
        },
      ]);
      setUploadStatus('Validation passed! 3 rows ready for blueprint anchoring.');
    }, 800);
  };

  const downloadCSVTemplate = () => {
    const csvContent =
      'topic_slug,stem_latex,option_a,option_b,option_c,option_d,option_e,correct_key,difficulty,exam_name,year\nprofit-and-loss,"A dishonest trader...","20%","25%","30%","15%","None of these",b,3,"IBPS PO",2024';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'satprep_seed_template.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>PYQ Ingestion Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Seed Question Ingestion Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest private previous year questions (PYQs) via CSV, Excel, or PDF OCR to anchor blueprints.
          </p>
        </div>

        <button
          onClick={downloadCSVTemplate}
          className="px-4 py-2 rounded-full border border-blue-200 bg-white text-xs font-bold text-slate-700 flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-xs"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Download Seed CSV Template</span>
        </button>
      </div>

      {/* Segmented Capsule Tabs */}
      <div className="flex rounded-full p-1 bg-white border border-blue-100 max-w-md text-xs shadow-xs">
        <button
          onClick={() => setActiveTab('csv')}
          className={`flex-1 py-2 font-bold rounded-full transition-all ${
            activeTab === 'csv' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          CSV / Excel Upload
        </button>
        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex-1 py-2 font-bold rounded-full transition-all ${
            activeTab === 'pdf' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          PDF Multimodal OCR
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex-1 py-2 font-bold rounded-full transition-all ${
            activeTab === 'matrix' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          Seed Coverage Matrix
        </button>
      </div>

      {activeTab === 'csv' && (
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-dashed border-blue-200 hover:border-blue-500 text-center space-y-4 transition-colors shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <div className="font-bold text-base text-slate-900">
                Drag and drop your Seed CSV or Excel File here
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Adheres strictly to SatPrep Appendix A specification. Maximum 500 rows per batch.
              </div>
            </div>

            <label className="inline-flex items-center px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]">
              <span>Select CSV File</span>
              <input type="file" accept=".csv,.xlsx" onChange={handleSimulateCSVUpload} className="hidden" />
            </label>

            {uploadStatus && (
              <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1.5 bg-emerald-50 max-w-md mx-auto py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          {/* Validation Results Preview */}
          {parsedRows.length > 0 && (
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Extracted Seed Rows Preview</span>
                <button
                  onClick={() => alert('Approved seeds sent to blueprint extraction pipeline!')}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                >
                  Confirm &amp; Extract Blueprints
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-blue-100 text-slate-500 bg-blue-50/50 uppercase text-[10px] font-bold">
                      <th className="p-3 pl-4">Topic</th>
                      <th className="p-3">Stem Preview</th>
                      <th className="p-3">Key</th>
                      <th className="p-3">Difficulty</th>
                      <th className="p-3 pr-4">Exam &amp; Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-blue-50/40">
                        <td className="p-3 pl-4 capitalize font-semibold text-slate-800">{r.topic.replace('-', ' ')}</td>
                        <td className="p-3 font-mono text-slate-700">{r.stem}</td>
                        <td className="p-3 font-bold uppercase text-emerald-700">Option {r.correct.toUpperCase()}</td>
                        <td className="p-3 font-mono">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                            Lvl {r.difficulty}
                          </span>
                        </td>
                        <td className="p-3 pr-4 text-slate-500 font-medium">{r.exam} ({r.year})</td>
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
        <div className="p-10 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 space-y-4 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Multimodal Gemini PDF Extraction</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Upload memory-based exam papers (PDF or scanned images). Gemini will extract question stems, options, and diagrams into editable structured JSON.
          </p>
          <label className="inline-flex items-center px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-500/20">
            <span>Upload Memory-Based PDF</span>
            <input type="file" accept=".pdf" className="hidden" onChange={() => alert('PDF queued for multimodal extraction!')} />
          </label>
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900">
            Seed Coverage Matrix (Target: Min 15 approved seeds per topic)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INITIAL_TOPICS.map((t) => (
              <div key={t.id} className="p-3.5 rounded-2xl border border-blue-100 bg-blue-50/30 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">{t.name}</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  18 / 15 Seeds
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
