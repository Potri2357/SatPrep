'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Pencil,
  Eraser,
  RotateCcw,
  Trash2,
  Calculator,
  FileText,
  Grid,
  Maximize2,
  Minimize2,
  Minus,
  Download,
  X,
} from 'lucide-react';

interface ScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPosition?: 'bottom-right' | 'center';
  initialNotes?: string;
  onNotesChange?: (notes: string) => void;
}

type ToolMode = 'pen' | 'eraser';
type PaperPattern = 'blank' | 'ruled' | 'grid';
type ActiveTab = 'draw' | 'notes';

function safeEvaluateMath(input: string): string | null {
  if (!input || !input.trim()) return null;
  let expr = input.toLowerCase().trim();
  expr = expr.replace(/\bof\b/g, '*');
  expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
  expr = expr.replace(/\bsqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
  expr = expr.replace(/\bcbrt\(([^)]+)\)/g, 'Math.cbrt($1)');
  expr = expr.replace(/\^/g, '**');

  if (!/^[0-9+\-*/().,Mathsqrtcb\s*]+$/.test(expr)) {
    return null;
  }
  try {
    const fn = new Function('Math', 'return (' + expr + ');');
    const res = fn(Math);
    if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
      return Number.isInteger(res) ? res.toString() : Number(res.toFixed(4)).toString();
    }
  } catch {
    return null;
  }
  return null;
}

export function ScratchpadModal({
  isOpen,
  onClose,
  initialNotes = '',
  onNotesChange,
}: ScratchpadProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('draw');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);

  // Drawing Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolMode>('pen');
  const [penColor, setPenColor] = useState<string>('#005CE6');
  const [lineWidth, setLineWidth] = useState<number>(2.5);
  const [pattern, setPattern] = useState<PaperPattern>('grid');
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Text Notes State
  const [notes, setNotes] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('satprep_scratchpad_notes') || initialNotes;
    }
    return initialNotes;
  });

  // Quick Calculator State
  const [calcInput, setCalcInput] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string | null>(null);

  // Handle calculator live evaluation
  useEffect(() => {
    const evaluated = safeEvaluateMath(calcInput);
    setCalcResult(evaluated);
  }, [calcInput]);

  // Persist notes
  const handleNotesChange = (text: string) => {
    setNotes(text);
    if (onNotesChange) onNotesChange(text);
    if (typeof window !== 'undefined') {
      localStorage.setItem('satprep_scratchpad_notes', text);
    }
  };

  // Initialize Canvas & Redraw Pattern
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Save initial state to history
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([snap]);
    } catch {
      // Handled
    }
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized && activeTab === 'draw') {
      const t = setTimeout(initCanvas, 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, isMinimized, activeTab, isMaximized, initCanvas]);

  // Canvas Drawing Handlers
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;

    if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = lineWidth * 3.5;
    } else {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = lineWidth;
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    // Save history
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(-15), snap]);
    } catch {
      // Ignored
    }
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length <= 1) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previous = newHistory[newHistory.length - 1];
    ctx.putImageData(previous, 0, 0);
    setHistory(newHistory);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([snap]);
    } catch {
      // Ignored
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `rough-sheet-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleInsertCalc = () => {
    if (!calcResult) return;
    const line = `\n${calcInput} = ${calcResult}\n`;
    handleNotesChange(notes + line);
    setCalcInput('');
  };

  if (!isOpen) return null;

  // Minimized Floating Pill State
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#005CE6] hover:bg-[#0047b3] text-white shadow-xl hover:shadow-2xl font-bold text-xs transition-all cursor-pointer border-2 border-white/80 scale-100 hover:scale-105 active:scale-95"
        >
          <Pencil className="w-4 h-4 text-white animate-pulse" />
          <span>Candidate Scratchpad (Active)</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col transition-all duration-200 shadow-2xl",
        isTransparent ? "opacity-85" : "opacity-100",
        isMaximized
          ? "inset-4 sm:inset-8 w-auto h-auto rounded-3xl"
          : "bottom-4 right-4 w-[92vw] sm:w-[480px] lg:w-[540px] h-[520px] rounded-3xl"
      )}
    >
      <div className="flex flex-col h-full bg-white/98 backdrop-blur-2xl rounded-3xl border border-[#BCEBFC] shadow-[0_16px_50px_rgba(0,92,230,0.18)] overflow-hidden">
        {/* Header Bar */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-[#005CE6] via-[#0076F5] to-[#0096D6] text-white flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <Pencil className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="text-xs font-extrabold tracking-tight flex items-center gap-1.5">
                <span>Exam Scratchpad &amp; Rough Sheet</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono font-medium">
                  Autosaved
                </span>
              </div>
            </div>
          </div>

          {/* Window Control Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsTransparent(!isTransparent)}
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white hover:bg-white/20 text-[10px] font-bold flex items-center gap-1",
                isTransparent && "bg-white/30 text-white"
              )}
              title={isTransparent ? "Make Opaque" : "Make Semi-Transparent to see questions"}
            >
              <span>{isTransparent ? '75%' : '100%'}</span>
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white hover:bg-white/20"
              title="Minimize to Floating Bar"
            >
              <Minus className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white hover:bg-white/20"
              title={isMaximized ? "Restore Size" : "Maximize Scratchpad"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white hover:bg-rose-500/80"
              title="Close Scratchpad"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher & Quick Tools Bar */}
        <div className="px-3 py-1.5 bg-[#F0FAFF] border-b border-[#BCEBFC] flex items-center justify-between gap-2 text-xs shrink-0 select-none">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('draw')}
              className={cn(
                "px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer",
                activeTab === 'draw'
                  ? "bg-[#005CE6] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              )}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Canvas Scribble</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={cn(
                "px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer",
                activeTab === 'notes'
                  ? "bg-[#005CE6] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Math Notes</span>
            </button>
          </div>

          {/* Canvas Actions when in Draw mode */}
          {activeTab === 'draw' && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={history.length <= 1}
                className="p-1 rounded-lg text-slate-600 hover:text-[#005CE6] hover:bg-white disabled:opacity-30 cursor-pointer"
                title="Undo last stroke"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClearCanvas}
                className="p-1 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Clear all drawings"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1 rounded-lg text-slate-600 hover:text-[#005CE6] hover:bg-white cursor-pointer"
                title="Save sheet image"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Live Quick Calculator Strip (Always accessible for rapid bank exam math) */}
        <div className="px-3 py-1.5 bg-white border-b border-slate-100 flex items-center gap-2 text-xs shrink-0">
          <Calculator className="w-3.5 h-3.5 text-[#005CE6] shrink-0" />
          <input
            type="text"
            value={calcInput}
            onChange={(e) => setCalcInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInsertCalc();
            }}
            placeholder="Type quick math: 45% of 800, sqrt(625), 18^2 - 12^2, 1130 / 70..."
            className="flex-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005CE6]"
          />
          {calcResult && (
            <div className="flex items-center gap-1.5 shrink-0 animate-in fade-in duration-100">
              <span className="font-mono font-extrabold text-[#005CE6] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 text-xs">
                = {calcResult}
              </span>
              <button
                onClick={handleInsertCalc}
                className="px-2 py-0.5 rounded-md bg-[#005CE6] text-white text-[10px] font-bold hover:bg-[#0047b3] cursor-pointer"
                title="Append to notes"
              >
                + Insert
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area Based on Tab */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {/* TAB 1: DRAW CANVAS */}
          {activeTab === 'draw' && (
            <div className="flex-1 flex flex-col h-full relative">
              {/* Floating Canvas Toolbar */}
              <div className="absolute top-2 left-2 z-10 flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#BCEBFC] shadow-sm text-xs">
                {/* Pen & Eraser */}
                <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-slate-100">
                  <button
                    onClick={() => setTool('pen')}
                    className={cn(
                      "p-1.5 rounded-lg transition-all cursor-pointer",
                      tool === 'pen' ? "bg-white text-[#005CE6] shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                    )}
                    title="Pen tool"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={cn(
                      "p-1.5 rounded-lg transition-all cursor-pointer",
                      tool === 'eraser' ? "bg-white text-rose-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                    )}
                    title="Eraser tool"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Color Palette */}
                {tool === 'pen' && (
                  <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                    {[
                      { color: '#005CE6', label: 'Cobalt' },
                      { color: '#0F172A', label: 'Graphite' },
                      { color: '#059669', label: 'Emerald' },
                      { color: '#DC2626', label: 'Crimson' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        onClick={() => setPenColor(c.color)}
                        style={{ backgroundColor: c.color }}
                        className={cn(
                          "w-4 h-4 rounded-full transition-transform cursor-pointer",
                          penColor === c.color ? "ring-2 ring-offset-1 ring-[#005CE6] scale-110" : "opacity-80 hover:opacity-100"
                        )}
                        title={c.label}
                      />
                    ))}
                  </div>
                )}

                {/* Stroke Width */}
                <div className="flex items-center gap-1 pl-1 border-l border-slate-200 text-[10px] font-bold">
                  {[
                    { width: 1.5, label: 'Fine' },
                    { width: 3.0, label: 'Med' },
                    { width: 5.5, label: 'Bold' },
                  ].map((w) => (
                    <button
                      key={w.width}
                      onClick={() => setLineWidth(w.width)}
                      className={cn(
                        "px-1.5 py-0.5 rounded-md cursor-pointer",
                        lineWidth === w.width ? "bg-blue-100 text-[#005CE6]" : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>

                {/* Background Pattern Selector */}
                <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                  <button
                    onClick={() => setPattern(pattern === 'grid' ? 'ruled' : pattern === 'ruled' ? 'blank' : 'grid')}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                    title="Cycle Paper Pattern (Grid, Ruled, Blank)"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span className="capitalize">{pattern}</span>
                  </button>
                </div>
              </div>

              {/* Canvas with Paper Background */}
              <div
                className={cn(
                  "flex-1 w-full h-full relative cursor-crosshair touch-none select-none overflow-hidden",
                  pattern === 'grid' && "bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:20px_20px] bg-white",
                  pattern === 'ruled' && "bg-[linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:100%_24px] bg-white",
                  pattern === 'blank' && "bg-white"
                )}
              >
                <canvas
                  ref={canvasRef}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerLeave={stopDrawing}
                  className="w-full h-full block"
                />
              </div>
            </div>
          )}

          {/* TAB 2: TEXT NOTES */}
          {activeTab === 'notes' && (
            <div className="flex-1 flex flex-col p-3 space-y-2 h-full bg-[#FBFDFF]">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Scratchpad Notebook (Auto-saves to browser)</span>
                <button
                  onClick={() => handleNotesChange('')}
                  className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  Clear Notes
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Type calculations, steps, ratio setups, or quadratic factorization roots..."
                className="flex-1 w-full p-3 rounded-2xl bg-white border border-[#BCEBFC] text-slate-900 placeholder:text-slate-400 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#005CE6]/30 resize-none custom-scrollbar"
              />
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-3 py-1.5 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span>Rough sheet notes stay persistent across test questions.</span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-[11px] font-bold text-[#005CE6] hover:underline cursor-pointer"
          >
            Dock to Corner
          </button>
        </div>
      </div>
    </div>
  );
}
