'use client';

import React, { useState, useRef } from 'react';
import { INITIAL_TOPICS } from '@/lib/store';
import { MathRenderer } from '@/lib/math-renderer';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import { cn } from '@/lib/utils';
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
  PlusCircle,
  BarChart3,
  Check,
  X,
  Sparkles,
  BookOpen,
  Lightbulb,
  Loader2,
  HelpCircle,
  Trash2,
} from 'lucide-react';

interface ParsedQuestionRow {
  topic: string;
  stem: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct: string;
  difficulty: number;
  exam: string;
  year: number;
  solution?: string;
  shortcut?: string;
}

// Helpers for client-side CSV and JSON parsing
function parseCSV(text: string): ParsedQuestionRow[] {
  const clean = text.replace(/^\uFEFF/, '');
  const lines: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (c === '"') {
      if (inQuotes && clean[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (cur.trim()) lines.push(cur);
      cur = '';
      if (c === '\r' && clean[i + 1] === '\n') {
        i++;
      }
    } else {
      cur += c;
    }
  }
  if (cur.trim()) lines.push(cur);
  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const cells: string[] = [];
    let cell = '';
    let inside = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inside && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inside = !inside;
        }
      } else if (ch === ',' && !inside) {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += ch;
      }
    }
    cells.push(cell.trim());
    return cells;
  };

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, '_'));

  const getIdx = (...names: string[]) => {
    for (const n of names) {
      const idx = headers.findIndex((h) => h === n || h.includes(n));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const topicIdx = getIdx('topic', 'category', 'subject');
  const stemIdx = getIdx('stem', 'question', 'problem', 'text');
  const optAIdx = getIdx('option_a', 'opt_a', 'opta', 'a');
  const optBIdx = getIdx('option_b', 'opt_b', 'optb', 'b');
  const optCIdx = getIdx('option_c', 'opt_c', 'optc', 'c');
  const optDIdx = getIdx('option_d', 'opt_d', 'optd', 'd');
  const optEIdx = getIdx('option_e', 'opt_e', 'opte', 'e');
  const correctIdx = getIdx('correct', 'answer', 'key');
  const diffIdx = getIdx('difficulty', 'diff', 'level');
  const examIdx = getIdx('exam', 'source');
  const yearIdx = getIdx('year');
  const solIdx = getIdx('solution', 'explanation', 'working');
  const shortIdx = getIdx('shortcut', 'trick', 'tip');

  const rows: ParsedQuestionRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    if (cells.length < 3) continue;

    const topic = topicIdx !== -1 && cells[topicIdx] ? cells[topicIdx] : 'simplification';
    const stem = stemIdx !== -1 && cells[stemIdx] ? cells[stemIdx] : cells[1] || 'Question stem';
    const option_a = optAIdx !== -1 && cells[optAIdx] ? cells[optAIdx] : cells[2] || 'Option A';
    const option_b = optBIdx !== -1 && cells[optBIdx] ? cells[optBIdx] : cells[3] || 'Option B';
    const option_c = optCIdx !== -1 && cells[optCIdx] ? cells[optCIdx] : cells[4] || 'Option C';
    const option_d = optDIdx !== -1 && cells[optDIdx] ? cells[optDIdx] : cells[5] || 'Option D';
    const option_e = optEIdx !== -1 && cells[optEIdx] ? cells[optEIdx] : cells[6] || 'None of these';
    const correct = correctIdx !== -1 && cells[correctIdx] ? cells[correctIdx].toLowerCase() : 'a';
    const difficulty = diffIdx !== -1 && cells[diffIdx] ? Number(cells[diffIdx]) || 2 : 2;
    const exam = examIdx !== -1 && cells[examIdx] ? cells[examIdx] : 'Practice Test';
    const year = yearIdx !== -1 && cells[yearIdx] ? Number(cells[yearIdx]) || 2024 : 2024;
    const solution = solIdx !== -1 && cells[solIdx] ? cells[solIdx] : undefined;
    const shortcut = shortIdx !== -1 && cells[shortIdx] ? cells[shortIdx] : undefined;

    rows.push({
      topic,
      stem,
      option_a,
      option_b,
      option_c,
      option_d,
      option_e,
      correct,
      difficulty,
      exam,
      year,
      solution,
      shortcut,
    });
  }

  return rows;
}

function parseJSONQuestions(text: string): ParsedQuestionRow[] {
  const data = JSON.parse(text);
  const list = Array.isArray(data) ? data : data.questions || [];
  return list.map((item: any) => {
    const opts = item.options || [];
    return {
      topic: item.topic || item.topic_id || 'simplification',
      stem: item.stem || item.question || 'Question stem',
      option_a: item.option_a || opts.find((o: any) => o.id === 'a')?.text || opts[0]?.text || 'Option A',
      option_b: item.option_b || opts.find((o: any) => o.id === 'b')?.text || opts[1]?.text || 'Option B',
      option_c: item.option_c || opts.find((o: any) => o.id === 'c')?.text || opts[2]?.text || 'Option C',
      option_d: item.option_d || opts.find((o: any) => o.id === 'd')?.text || opts[3]?.text || 'Option D',
      option_e: item.option_e || opts.find((o: any) => o.id === 'e')?.text || opts[4]?.text || 'None of these',
      correct: (item.correct || item.correct_option || item.correct_key || 'a').toLowerCase(),
      difficulty: Number(item.difficulty || item.difficulty_assigned) || 2,
      exam: item.exam || 'Practice Test',
      year: Number(item.year) || 2024,
      solution: item.solution,
      shortcut: item.shortcut,
    };
  });
}

export default function UploadQuestionBankPage() {
  const [activeTab, setActiveTab] = useState<'csv' | 'manual' | 'pdf'>('csv');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState<boolean>(false);
  const [isScanningPdf, setIsScanningPdf] = useState<boolean>(false);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);
  const [uploadedPdfInfo, setUploadedPdfInfo] = useState<{ name: string; size: number } | null>(null);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Parsed Questions from CSV / Excel
  const [parsedRows, setParsedRows] = useState<ParsedQuestionRow[]>([
    {
      topic: 'profit-and-loss',
      stem: 'A shopkeeper marks an article $30\\%$ above cost price and allows an $8\\%$ discount. If the cost price is ₹$1,500$, what is his net profit?',
      option_a: '₹294.00',
      option_b: '₹275.50',
      option_c: '₹312.00',
      option_d: '₹280.00',
      option_e: 'None of these',
      correct: 'a',
      difficulty: 2,
      exam: 'IBPS PO Prelims',
      year: 2024,
      solution: 'MP = $1500 \\times 1.30 = ₹1950$. SP = $1950 \\times 0.92 = ₹1794$. Profit = $1794 - 1500 = ₹294$.',
      shortcut: 'Net multiplier = $1.30 \\times 0.92 = 1.196 \\rightarrow 19.6\\%$. Profit = $1500 \\times 0.196 = ₹294$.',
    },
    {
      topic: 'time-speed-distance',
      stem: 'A train $180\\text{ m}$ long moving at $72\\text{ km/h}$ passes a signal post. Find the time taken by the train in seconds.',
      option_a: '12 s',
      option_b: '10 s',
      option_c: '9 s',
      option_d: '8 s',
      option_e: 'None of these',
      correct: 'c',
      difficulty: 1,
      exam: 'SBI Clerk Prelims',
      year: 2023,
      solution: 'Speed in m/s = $72 \\times \\frac{5}{18} = 20\\text{ m/s}$. Time = $\\frac{180}{20} = 9\\text{ seconds}$.',
      shortcut: 'Direct ratio: $72\\text{ km/h} = 20\\text{ m/s}$. $180 / 20 = 9\\text{s}$.',
    },
    {
      topic: 'simplification',
      stem: 'What value will come in place of question mark ($?$) in the expression: $$\\sqrt{? + 480} = 65\\% \\text{ of } 240 - 16 \\times 7$$',
      option_a: '1,456',
      option_b: '1,424',
      option_c: '1,488',
      option_d: '1,396',
      option_e: 'None of these',
      correct: 'b',
      difficulty: 2,
      exam: 'RRB Scale I Mains',
      year: 2024,
      solution: '$65\\% \\times 240 = 156$. $16 \\times 7 = 112$. $156 - 112 = 44$. $? + 480 = 44^2 = 1936$. $? = 1936 - 480 = 1456$.',
      shortcut: 'End digit filter: $44^2$ ends in $6$. $6 - 0 = 6$. Option A or B.',
    },
  ]);

  // Manual Question Creator State
  const [manualTopic, setManualTopic] = useState<string>('simplification');
  const [manualStem, setManualStem] = useState<string>('Solve for the value of ($?$) in: $$\\frac{3}{7} \\text{ of } 329 + 45\\% \\text{ of } 280 = ?$$');
  const [optA, setOptA] = useState<string>('267');
  const [optB, setOptB] = useState<string>('275');
  const [optC, setOptC] = useState<string>('259');
  const [optD, setOptD] = useState<string>('281');
  const [optE, setOptE] = useState<string>('None of these');
  const [correctKey, setCorrectKey] = useState<string>('a');
  const [difficulty, setDifficulty] = useState<number>(2);
  const [solution, setSolution] = useState<string>('Step 1: (3/7) * 329 = 3 * 47 = 141. Step 2: 45% of 280 = 126. Total = 141 + 126 = 267.');
  const [shortcut, setShortcut] = useState<string>('Split 45% as 50% (140) - 5% (14) = 126. 141 + 126 = 267.');

  // Process dropped or selected question file
  const processQuestionFile = async (file: File) => {
    setIsParsing(true);
    setUploadError(null);
    setUploadStatus(null);

    try {
      const name = file.name.toLowerCase();
      const text = await file.text();

      let newRows: ParsedQuestionRow[] = [];
      if (name.endsWith('.json')) {
        newRows = parseJSONQuestions(text);
      } else if (name.endsWith('.csv') || name.endsWith('.tsv') || name.endsWith('.txt')) {
        newRows = parseCSV(text);
      } else {
        try {
          newRows = parseJSONQuestions(text);
        } catch {
          newRows = parseCSV(text);
        }
      }

      if (!newRows || newRows.length === 0) {
        setUploadError(`Could not extract valid questions from ${file.name}. Please check column headers or download our sample CSV template.`);
        return;
      }

      setParsedRows((prev) => [...newRows, ...prev]);
      setUploadStatus(`File verified successfully: ${file.name} (${newRows.length} questions parsed and ready for review)`);
    } catch (err: any) {
      console.error(err);
      setUploadError(`Error processing ${file.name}: ${err?.message || 'Unsupported format'}`);
    } finally {
      setIsParsing(false);
    }
  };

  // Drag and Drop Handlers for Tab 1 (CSV / Excel / JSON)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processQuestionFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processQuestionFile(file);
    }
    // reset input so same file can be re-uploaded if modified
    e.target.value = '';
  };

  // Drag and Drop Handlers for Tab 3 (Exam PDF / Scanner)
  const handlePdfDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingPdf) setIsDraggingPdf(true);
  };

  const handlePdfDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPdf(true);
  };

  const handlePdfDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingPdf(false);
  };

  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPdf(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processPdfFile(e.dataTransfer.files[0]);
    }
  };

  const handlePdfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPdfFile(file);
    }
    e.target.value = '';
  };

  const processPdfFile = async (file: File) => {
    setIsScanningPdf(true);
    setPdfStatus(`Scanning "${file.name}"... Isolating Quantitative Aptitude section (Que. 66 to 100).`);
    setUploadError(null);
    setImportSuccessCount(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setParsedRows(data.questions);
        setUploadedPdfInfo({ name: file.name, size: file.size });
        setPdfStatus(`Scan complete for "${file.name}": Extracted all ${data.count} Quantitative Aptitude questions (Que. 66 to 100)! Questions are displayed below for review.`);
      } else {
        setUploadError(data.error || 'Failed to extract quantitative section from PDF');
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(`Error scanning PDF: ${err?.message || 'Network error'}`);
    } finally {
      setIsScanningPdf(false);
    }
  };

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const csvContent =
`topic,stem,option_a,option_b,option_c,option_d,option_e,correct,difficulty,exam,year,solution,shortcut
simplification,"Find the value of $?: \\frac{3}{7} \\text{ of } 329 + 45\\% \\text{ of } 280 = ?",267,275,259,281,None of these,a,2,IBPS PO Prelims,2024,"(3/7)*329 = 141. 45% of 280 = 126. Total = 267.","45% = 50% (140) - 5% (14) = 126. 141 + 126 = 267."
ratio-and-proportion,"The ratio of boys to girls in a class is 5 : 4. If 4 girls leave, the ratio becomes 5 : 3. How many boys are there in the class?",20,25,30,15,None of these,a,2,SBI PO Prelims,2024,"Let boys = 5x, girls = 4x. 5x / (4x - 4) = 5/3 -> 15x = 20x - 20 -> 5x = 20. Boys = 20.","Ratio change from 4 to 3 is 1 unit = 4 girls. Boys = 5 units = 20."`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'question_bank_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit parsed questions to Question Bank API
  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setIsUploading(true);

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: parsedRows }),
      });
      const data = await res.json();
      if (data.success) {
        const cloudNote = data.storage?.supabase === 'saved' ? ' and saved to Supabase cloud database' : '';
        setSuccessBanner(`Successfully added ${data.added_count} questions to the live question bank${cloudNote}!`);
        setImportSuccessCount(data.added_count);
        setParsedRows([]);
        setUploadedPdfInfo(null);
        setPdfStatus(null);
        setTimeout(() => setSuccessBanner(null), 6000);
      } else {
        alert(data.error || 'Failed to import questions');
      }
    } catch (err) {
      console.error(err);
      alert('Error importing questions');
    } finally {
      setIsUploading(false);
    }
  };

  // Submit manual question to Question Bank
  const handleCreateManualQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStem.trim()) return;

    setIsUploading(true);
    const newQ = {
      topic_id: manualTopic,
      stem: manualStem,
      options: [
        { id: 'a', text: optA },
        { id: 'b', text: optB },
        { id: 'c', text: optC },
        { id: 'd', text: optD },
        { id: 'e', text: optE },
      ],
      correct_option: correctKey,
      difficulty,
      solution,
      shortcut,
    };

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: [newQ] }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessBanner(`Question published live to the question bank! (Total in bank: ${data.total_in_bank})`);
        setTimeout(() => setSuccessBanner(null), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeParsedRow = (idx: number) => {
    setParsedRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const downloadCSVTemplate = () => {
    const csvContent =
      'topic_slug,stem_latex,option_a,option_b,option_c,option_d,option_e,correct_key,difficulty,exam_name,year,solution,shortcut\n' +
      'profit-and-loss,"A shopkeeper marks an article 30% above cost price...","₹294.00","₹275.50","₹312.00","₹280.00","None of these",a,2,"IBPS PO",2024,"MP = 1500 * 1.30...","Net % formula..."\n' +
      'simplification,"What value should come in place of (?) in: 45% of 800 + sqrt(625) * 4 = ?","460","424","436","414","None of these",a,1,"SBI Clerk",2024,"45% of 800 = 360, 25 * 4 = 100. Sum = 460.","Direct split..."';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'satprep_question_bank_template.csv';
    a.click();
  };

  const downloadJSONTemplate = () => {
    const sample = [
      {
        topic: 'quadratic-equations',
        stem: 'In the following question, solve both equations and establish the relation between x and y:\nI. x^2 - 11x + 30 = 0\nII. y^2 - 17y + 72 = 0',
        options: [
          { id: 'a', text: 'x > y' },
          { id: 'b', text: 'x < y' },
          { id: 'c', text: 'x ≥ y' },
          { id: 'd', text: 'x ≤ y' },
          { id: 'e', text: 'x = y or relationship cannot be established' },
        ],
        correct: 'b',
        difficulty: 2,
        exam: 'IBPS PO Prelims',
        year: 2024,
        solution: 'I: (x-5)(x-6)=0 -> x = 5, 6. II: (y-8)(y-9)=0 -> y = 8, 9. Therefore x < y.',
        shortcut: 'Direct factor split method without quadratic formula.',
      },
    ];
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'satprep_question_bank_template.json';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#BCEBFC]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Upload Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Import verified practice questions from Excel, CSV spreadsheets, or exam question papers, or create questions directly with real-time math formula preview.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={downloadCSVTemplate}
            className="px-3.5 py-2 rounded-xl border border-[#BCEBFC] bg-white text-xs font-bold text-slate-700 flex items-center gap-1.5 hover:bg-[#F0FAFF] hover:text-[#005CE6] transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#005CE6]" />
            <span>Sample Spreadsheet (CSV)</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Segmented Capsule Tabs (User-Focused) */}
      <div className="flex flex-wrap rounded-2xl p-1 bg-[#E0F4FD]/60 border border-[#BCEBFC] text-xs max-w-2xl shadow-2xs">
        <button
          onClick={() => setActiveTab('csv')}
          className={cn(
            "flex-1 py-2 px-3 font-bold rounded-xl transition-all cursor-pointer text-center",
            activeTab === 'csv' ? "bg-white text-[#005CE6] shadow-xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          CSV / Excel Import
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={cn(
            "flex-1 py-2 px-3 font-bold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5",
            activeTab === 'manual' ? "bg-white text-[#005CE6] shadow-xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Quick Add Question</span>
        </button>
        <button
          onClick={() => setActiveTab('pdf')}
          className={cn(
            "flex-1 py-2 px-3 font-bold rounded-xl transition-all cursor-pointer text-center",
            activeTab === 'pdf' ? "bg-white text-[#005CE6] shadow-xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          PDF / Exam Paper Scanner
        </button>
      </div>

      {/* TAB 1: CSV / EXCEL IMPORT */}
      {activeTab === 'csv' && (
        <div className="space-y-6">
          {/* Upload Dropzone with Active Drag and Drop */}
          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative p-8 sm:p-12 rounded-3xl text-center space-y-4 transition-all duration-200 border-2 border-dashed cursor-pointer select-none",
              isDragging
                ? "border-[#005CE6] bg-[#EAF5FE] ring-4 ring-[#005CE6]/20 scale-[1.01] shadow-lg"
                : "bg-white border-[#BCEBFC] hover:border-[#005CE6] hover:bg-slate-50/60 shadow-2xs group"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.json,.txt,.tsv"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-all shadow-inner",
                isDragging
                  ? "bg-[#005CE6] text-white scale-110 animate-bounce"
                  : "bg-[#E0F4FD] text-[#005CE6] group-hover:scale-105"
              )}
            >
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-lg mx-auto">
              <div className="font-extrabold text-base sm:text-lg text-slate-900">
                {isDragging ? (
                  <span className="text-[#005CE6]">Drop your Question Bank file right here!</span>
                ) : (
                  <span>Drag and drop your Question Bank CSV, Excel, or JSON file</span>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isDragging
                  ? "Release your mouse to automatically parse questions, options, and math formulas."
                  : "Supports batch uploads with options, step-by-step solutions, speed shortcuts, and LaTeX equations. Maximum 500 questions per batch."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#005CE6] hover:bg-[#004dc2] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Select File to Import</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadTemplate();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download Sample Template</span>
              </button>
            </div>

            {/* Parsing progress indicator */}
            {isParsing && (
              <div className="pt-2 text-xs font-semibold text-blue-800 flex items-center justify-center gap-2 bg-blue-50 max-w-md mx-auto py-2.5 rounded-xl border border-blue-200 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-[#005CE6]" />
                <span>Reading and verifying questions from file...</span>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="pt-2 text-xs font-semibold text-rose-800 flex items-center justify-center gap-2 bg-rose-50 max-w-md mx-auto py-2.5 px-4 rounded-xl border border-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Status notification */}
            {uploadStatus && !uploadError && (
              <div className="pt-2 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2 bg-emerald-50 max-w-lg mx-auto py-2.5 px-4 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          {/* Validation & Live Question Preview Table */}
          {parsedRows.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-[#BCEBFC] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="font-bold text-sm text-slate-900">
                    Questions Ready for Live Import ({parsedRows.length} questions)
                  </span>
                  <p className="text-xs text-slate-500">
                    Review and verify before committing directly to the active exam question bank.
                  </p>
                </div>
                <button
                  onClick={handleConfirmImport}
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Confirm &amp; Add All to Question Bank</span>
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#BCEBFC] text-slate-500 bg-[#F0FAFF] uppercase text-[10.5px] font-bold">
                      <th className="p-3 pl-4">Topic</th>
                      <th className="p-3">Question Stem</th>
                      <th className="p-3">Correct Option</th>
                      <th className="p-3">Difficulty</th>
                      <th className="p-3">Exam Tag</th>
                      <th className="p-3 pr-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-[#F7FDFF] transition-colors">
                        <td className="p-3 pl-4 capitalize font-bold text-slate-900 whitespace-nowrap">
                          {r.topic.replace(/-/g, ' ')}
                        </td>
                        <td className="p-3 max-w-md">
                          <div className="font-medium text-slate-800 line-clamp-2">
                            <MathRenderer content={r.stem} />
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase font-mono">
                            Option {r.correct.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 font-mono whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#005CE6] border border-blue-200 text-[10.5px] font-bold">
                            Level {r.difficulty}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 whitespace-nowrap font-medium">
                          {r.exam} ({r.year})
                        </td>
                        <td className="p-3 pr-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => removeParsedRow(i)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANUAL QUESTION CREATOR WITH LIVE PREVIEW */}
      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: 7 Cols */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#BCEBFC] shadow-2xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-[#005CE6]" />
              <span>Create New Question</span>
            </h2>

            <form onSubmit={handleCreateManualQuestion} className="space-y-4 text-xs">
              {/* Topic & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-30">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Topic</label>
                  <CustomDropdown
                    value={manualTopic}
                    onChange={(val) => setManualTopic(String(val))}
                    options={INITIAL_TOPICS.map((t) => ({ value: t.id, label: t.name }))}
                    triggerClassName="h-10"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty Level (1 - 5)</label>
                  <CustomDropdown
                    value={difficulty}
                    onChange={(val) => setDifficulty(Number(val))}
                    options={[
                      { value: 1, label: 'Level 1 (Easy Prelims)' },
                      { value: 2, label: 'Level 2 (Standard Prelims)' },
                      { value: 3, label: 'Level 3 (Moderate Prelims/Mains)' },
                      { value: 4, label: 'Level 4 (Hard Mains)' },
                      { value: 5, label: 'Level 5 (Advanced PO Mains)' },
                    ]}
                    triggerClassName="h-10"
                  />
                </div>
              </div>

              {/* Question Stem */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Question Stem (supports LaTeX math like $x^2 + 5x + 6 = 0$ or $$\frac&#123;a&#125;&#123;b&#125;$$)
                </label>
                <textarea
                  rows={4}
                  value={manualStem}
                  onChange={(e) => setManualStem(e.target.value)}
                  placeholder="Enter question text with LaTeX formulas..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-sans text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#005CE6] leading-relaxed"
                  required
                />
              </div>

              {/* Options Inputs & Radio Picker */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Answer Options (Select correct option radio)</label>
                {[
                  { key: 'a', val: optA, set: setOptA },
                  { key: 'b', val: optB, set: setOptB },
                  { key: 'c', val: optC, set: setOptC },
                  { key: 'd', val: optD, set: setOptD },
                  { key: 'e', val: optE, set: setOptE },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 text-xs font-bold uppercase font-mono">
                      <input
                        type="radio"
                        name="correctKey"
                        value={item.key}
                        checked={correctKey === item.key}
                        onChange={(e) => setCorrectKey(e.target.value)}
                        className="sr-only"
                      />
                      <span className={cn(
                        "w-full h-full flex items-center justify-center rounded-lg transition-colors",
                        correctKey === item.key ? "bg-[#005CE6] text-white" : "text-slate-700"
                      )}>
                        {item.key}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      placeholder={`Option ${item.key.toUpperCase()} text...`}
                      className={cn(
                        "flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none",
                        correctKey === item.key ? "border-emerald-400 bg-emerald-50/30" : "border-slate-200 bg-slate-50"
                      )}
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Solution & Shortcut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Step-by-Step Solution</label>
                  <textarea
                    rows={3}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Clear explanation and working..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#005CE6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Speed Shortcut / Exam Trick</label>
                  <textarea
                    rows={3}
                    value={shortcut}
                    onChange={(e) => setShortcut(e.target.value)}
                    placeholder="Shortcut trick (e.g. digital roots, split & merge)..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#005CE6]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 rounded-xl bg-[#005CE6] hover:bg-[#004dc2] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Question...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish Question to Live Bank</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Live Preview: 5 Cols */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-[#BCEBFC] shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Student Preview
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#005CE6] text-[10px] font-bold font-mono">
                  Level {difficulty}
                </span>
              </div>

              <div className="space-y-3">
                <div className="font-semibold text-slate-900 leading-relaxed text-sm">
                  <MathRenderer content={manualStem || 'Type question text above to preview math formatting in real time.'} />
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'a', text: optA },
                    { id: 'b', text: optB },
                    { id: 'c', text: optC },
                    { id: 'd', text: optD },
                    { id: 'e', text: optE },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      className={cn(
                        "p-2.5 rounded-xl border flex items-center gap-2.5 text-xs transition-colors",
                        correctKey === opt.id
                          ? "border-emerald-300 bg-emerald-50 text-emerald-950 font-semibold"
                          : "border-slate-200 bg-slate-50/50 text-slate-800"
                      )}
                    >
                      <span className={cn(
                        "w-5 h-5 rounded-md flex items-center justify-center text-[10.5px] font-bold uppercase font-mono shrink-0",
                        correctKey === opt.id ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                      )}>
                        {opt.id}
                      </span>
                      <div className="flex-1 truncate">
                        <MathRenderer content={opt.text} />
                      </div>
                      {correctKey === opt.id && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                {solution && (
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-[11px]">
                      <BookOpen className="w-3.5 h-3.5 text-[#005CE6]" />
                      <span>Step-by-Step Solution</span>
                    </div>
                    <div className="text-[11.5px] text-slate-700 leading-relaxed">
                      <MathRenderer content={solution} />
                    </div>
                  </div>
                )}

                {shortcut && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>Speed Shortcut</span>
                    </div>
                    <div className="text-[11.5px] text-slate-700 leading-relaxed">
                      <MathRenderer content={shortcut} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PDF / EXAM SCANNER */}
      {activeTab === 'pdf' && (
        <div className="space-y-6">
          {/* 1. Completion Success Card */}
          {importSuccessCount !== null ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-emerald-200 shadow-sm text-center space-y-4 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Import Completed Successfully!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  All {importSuccessCount} Quantitative Aptitude questions from your exam paper have been verified, categorized with diagrams &amp; tables, and added directly to the active Question Bank.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <a
                  href="/admin/questions"
                  className="px-6 py-2.5 rounded-full bg-[#005CE6] hover:bg-[#004dc2] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  View in Question Library
                </a>
                <button
                  type="button"
                  onClick={() => setImportSuccessCount(null)}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Upload Another Document
                </button>
              </div>
            </div>
          ) : uploadedPdfInfo ? (
            /* 2. Compact Scanned Document Card (Replaces the huge empty dropzone) */
            <div className="p-6 rounded-3xl bg-white border border-[#BCEBFC] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E0F4FD] text-[#005CE6] flex items-center justify-center shrink-0 shadow-inner">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-extrabold text-base text-slate-900 line-clamp-1">
                    {uploadedPdfInfo.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                      {parsedRows.length} Questions Extracted
                    </span>
                    <span>•</span>
                    <span>Quantitative Aptitude Section</span>
                    <span>•</span>
                    <span>{(uploadedPdfInfo.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setParsedRows([]);
                    setUploadedPdfInfo(null);
                    setPdfStatus(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Upload Different Document
                </button>
              </div>
            </div>
          ) : (
            /* 3. Standard Drag & Drop Box (Initial State) */
            <div
              onDragOver={handlePdfDragOver}
              onDragEnter={handlePdfDragEnter}
              onDragLeave={handlePdfDragLeave}
              onDrop={handlePdfDrop}
              onClick={() => pdfInputRef.current?.click()}
              className={cn(
                "p-10 sm:p-14 rounded-3xl space-y-5 text-center transition-all duration-200 border-2 border-dashed max-w-3xl mx-auto cursor-pointer select-none",
                isDraggingPdf
                  ? "border-[#005CE6] bg-[#EAF5FE] ring-4 ring-[#005CE6]/20 scale-[1.01] shadow-lg"
                  : "bg-white border-[#BCEBFC] hover:border-[#005CE6] hover:bg-slate-50/60 shadow-2xs group"
              )}
            >
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handlePdfInputChange}
                className="hidden"
              />

              <div
                className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center mx-auto transition-all shadow-sm",
                  isDraggingPdf
                    ? "bg-[#005CE6] text-white scale-110 animate-bounce"
                    : "bg-[#E0F4FD] text-[#005CE6] group-hover:scale-105"
                )}
              >
                <FileText className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-black text-slate-900">
                  {isDraggingPdf ? 'Drop Exam PDF / Document Here' : 'Extract Questions from Exam Papers & PDFs'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  {isDraggingPdf
                    ? 'Release to automatically scan question stems, formulas, and multiple-choice keys.'
                    : 'Drag and drop past question paper PDFs, sample tests, or scanned practice sheets here. Our smart AI reader automatically recognizes questions, math formulas, multiple-choice options, and solutions into ready-to-use practice items.'}
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    pdfInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#005CE6] hover:bg-[#004dc2] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Select Exam PDF or Scanned Document</span>
                </button>
              </div>

              {isScanningPdf && (
                <div className="pt-2 text-xs font-semibold text-blue-800 flex items-center justify-center gap-2 bg-blue-50 max-w-md mx-auto py-2.5 rounded-xl border border-blue-200 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-[#005CE6]" />
                  <span>Scanning document and extracting questions...</span>
                </div>
              )}

              {uploadError && (
                <div className="pt-2 text-xs font-semibold text-rose-800 flex items-center justify-center gap-2 bg-rose-50 max-w-md mx-auto py-2.5 px-4 rounded-xl border border-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {pdfStatus && (
                <div className="pt-2 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2 bg-emerald-50 max-w-lg mx-auto py-2.5 px-4 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pdfStatus}</span>
                </div>
              )}
            </div>
          )}

          {/* Validation & Live Question Preview Table for PDF Scanner */}
          {parsedRows.length > 0 && importSuccessCount === null && (
            <div className="p-6 rounded-3xl bg-white border border-[#BCEBFC] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="font-bold text-sm text-slate-900">
                    Quantitative Aptitude Section ({parsedRows.length} Questions Extracted)
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Extracted from your exam paper. Review questions, diagrams, data tables, answer options, and formulas before importing.
                  </p>
                </div>
                <button
                  onClick={handleConfirmImport}
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Importing to Question Bank...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Confirm &amp; Add All {parsedRows.length} Questions</span>
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#BCEBFC] text-slate-500 bg-[#F0FAFF] uppercase text-[10.5px] font-bold">
                      <th className="p-3 pl-4">Topic</th>
                      <th className="p-3">Question Stem</th>
                      <th className="p-3">Correct Option</th>
                      <th className="p-3">Difficulty</th>
                      <th className="p-3">Exam Tag</th>
                      <th className="p-3 pr-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-[#F7FDFF] transition-colors">
                        <td className="p-3 pl-4 capitalize font-bold text-slate-900 whitespace-nowrap">
                          {r.topic.replace(/-/g, ' ')}
                        </td>
                        <td className="p-3 max-w-xl">
                          <div className="font-medium text-slate-800 space-y-2">
                            <MathRenderer content={r.stem} />
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase font-mono">
                            Option {r.correct.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 font-mono whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#005CE6] border border-blue-200 text-[10.5px] font-bold">
                            Level {r.difficulty}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 whitespace-nowrap font-medium">
                          {r.exam} ({r.year})
                        </td>
                        <td className="p-3 pr-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => removeParsedRow(i)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
