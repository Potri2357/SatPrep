'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Pencil,
  Highlighter,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Calculator,
  FileText,
  Grid,
  Maximize2,
  Minimize2,
  Minus,
  Download,
  X,
  Sparkles,
  Eye,
  CornerDownLeft,
} from 'lucide-react';

interface ScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPosition?: 'bottom-right' | 'center';
  initialNotes?: string;
  onNotesChange?: (notes: string) => void;
}

type ToolMode = 'pen' | 'highlighter' | 'eraser';
type PaperPattern = 'grid' | 'ruled' | 'blank';
type ActiveTab = 'draw' | 'notes';

interface Point {
  x: number;
  y: number;
  pressure?: number;
  time: number;
  width: number;
}

interface Stroke {
  id: string;
  tool: ToolMode;
  color: string;
  baseWidth: number;
  points: Point[];
}

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

// Apple / Samsung Notes Curated Color Presets
const LIGHT_PALETTE = [
  { color: '#005CE6', name: 'Cobalt Blue' },
  { color: '#0F172A', name: 'Graphite Black' },
  { color: '#DC2626', name: 'Crimson Red' },
  { color: '#059669', name: 'Emerald Green' },
  { color: '#7C3AED', name: 'Royal Violet' },
];

const DARK_PALETTE = [
  { color: '#60A5FA', name: 'Sky Blue' },
  { color: '#FFFFFF', name: 'Pure White' },
  { color: '#F87171', name: 'Coral Red' },
  { color: '#34D399', name: 'Mint Green' },
  { color: '#A78BFA', name: 'Lavender' },
];

const HIGHLIGHTER_COLORS = [
  { color: '#FDE047', name: 'Bright Yellow' },
  { color: '#67E8F9', name: 'Cyan Glow' },
  { color: '#F472B6', name: 'Neon Pink' },
  { color: '#4ADE80', name: 'Soft Lime' },
];

const STROKE_WIDTHS = [
  { label: 'Fine', value: 1.8, dotSize: 'w-1.5 h-1.5' },
  { label: 'Medium', value: 3.2, dotSize: 'w-2.5 h-2.5' },
  { label: 'Bold', value: 5.5, dotSize: 'w-3.5 h-3.5' },
];

export function ScratchpadModal({
  isOpen,
  onClose,
  initialNotes = '',
  onNotesChange,
}: ScratchpadProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('draw');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [opacityLevel, setOpacityLevel] = useState<number>(100); // 100%, 75%, 50%
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Drawing Canvas State (Vector-Based Smooth Stroke Engine)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tool, setTool] = useState<ToolMode>('pen');
  const [penColor, setPenColor] = useState<string>('#005CE6');
  const [highlighterColor, setHighlighterColor] = useState<string>('#FDE047');
  const [lineWidth, setLineWidth] = useState<number>(3.2);
  const [pattern, setPattern] = useState<PaperPattern>('grid');

  // Vector strokes history for flawless crisp undo/redo & DPR scaling
  const strokesRef = useRef<Stroke[]>([]);
  const redoStackRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

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

  // Detect dark mode from document class
  useEffect(() => {
    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Update undo/redo availability
  const updateUndoRedoState = useCallback(() => {
    setCanUndo(strokesRef.current.length > 0);
    setCanRedo(redoStackRef.current.length > 0);
  }, []);

  // Safe Math live evaluation
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

  /**
   * Render a single stroke onto the canvas context with Bézier curve smoothing
   */
  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    const pts = stroke.points;
    if (!pts || pts.length === 0) return;

    ctx.save();

    if (stroke.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = stroke.baseWidth * 5.5;
    } else if (stroke.tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = isDarkMode ? 0.45 : 0.35;
      ctx.strokeStyle = stroke.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = stroke.baseWidth * 4.8;
    } else {
      // Pen Tool
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    if (pts.length === 1) {
      // Single tap dot
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, (pts[0].width || stroke.baseWidth) / 2, 0, Math.PI * 2);
      ctx.fillStyle = stroke.tool === 'eraser' ? 'rgba(0,0,0,1)' : stroke.color;
      ctx.fill();
      ctx.restore();
      return;
    }

    if (pts.length === 2) {
      // Two points simple line
      ctx.lineWidth = pts[1].width || stroke.baseWidth;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[1].x, pts[1].y);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Bézier Quadratic Curve Interpolation (Apple Notes & Samsung Notes Spline Engine)
    // Curves smoothly through midpoints to eliminate all jagged corners
    for (let i = 1; i < pts.length - 1; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];

      const mid1X = (p0.x + p1.x) / 2;
      const mid1Y = (p0.y + p1.y) / 2;
      const mid2X = (p1.x + p2.x) / 2;
      const mid2Y = (p1.y + p2.y) / 2;

      ctx.beginPath();
      ctx.moveTo(i === 1 ? p0.x : mid1X, i === 1 ? p0.y : mid1Y);
      ctx.quadraticCurveTo(p1.x, p1.y, mid2X, mid2Y);

      // Dynamic width per segment for calligraphic ink feel
      ctx.lineWidth = p1.width || stroke.baseWidth;
      ctx.stroke();
    }

    // Draw connecting tail to last point
    const secondLast = pts[pts.length - 2];
    const last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.moveTo((secondLast.x + last.x) / 2, (secondLast.y + last.y) / 2);
    ctx.lineTo(last.x, last.y);
    ctx.lineWidth = last.width || stroke.baseWidth;
    ctx.stroke();

    ctx.restore();
  }, [isDarkMode]);

  /**
   * Complete canvas redraw from vector stroke history (crystal-clear subpixel rendering)
   */
  const redrawAllStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset transform and clear
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Redraw all strokes in order
    strokesRef.current.forEach((stroke) => {
      drawStroke(ctx, stroke);
    });

    // Draw active in-progress stroke if present
    if (currentStrokeRef.current) {
      drawStroke(ctx, currentStrokeRef.current);
    }
  }, [drawStroke]);

  /**
   * Initialize canvas with High-DPI Retina scaling
   */
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;

    redrawAllStrokes();
  }, [redrawAllStrokes]);

  // Resize listener for orientation change on mobile
  useEffect(() => {
    if (isOpen && !isMinimized && activeTab === 'draw') {
      const handleResize = () => {
        initCanvas();
      };
      const t = setTimeout(initCanvas, 60);
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(t);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen, isMinimized, activeTab, isMaximized, initCanvas]);

  // ============================================================================
  // Pointer & Touch Handlers (Smooth Dynamic Bézier Tracking)
  // ============================================================================
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Only primary button or touch/pen
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Ignored if capture unsupported
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const time = performance.now();

    // Calculate initial dynamic stroke width
    let strokeW = lineWidth;
    if (e.pressure && e.pressure > 0 && e.pressure !== 0.5) {
      strokeW = lineWidth * (0.4 + 1.2 * e.pressure);
    }

    const firstPoint: Point = {
      x,
      y,
      pressure: e.pressure || 0.5,
      time,
      width: strokeW,
    };

    const activeColor = tool === 'highlighter' ? highlighterColor : penColor;

    currentStrokeRef.current = {
      id: `${Date.now()}-${Math.random()}`,
      tool,
      color: activeColor,
      baseWidth: lineWidth,
      points: [firstPoint],
    };

    // Draw initial dot immediately
    ctx.save();
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, (lineWidth * 5.5) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = isDarkMode ? 0.45 : 0.35;
      ctx.fillStyle = activeColor;
      ctx.beginPath();
      ctx.arc(x, y, (lineWidth * 4.8) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = activeColor;
      ctx.beginPath();
      ctx.arc(x, y, strokeW / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = currentStrokeRef.current;
    if (!stroke) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const time = performance.now();

    const pts = stroke.points;
    const lastPoint = pts[pts.length - 1];

    // Distance threshold to avoid micro-jitter
    const dx = x - lastPoint.x;
    const dy = y - lastPoint.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 2.0) return;

    const dt = Math.max(time - lastPoint.time, 1);
    const velocity = dist / dt; // pixels per ms

    // Dynamic width calculation (Apple Pencil / Samsung S-Pen simulation)
    let targetWidth = stroke.baseWidth;
    if (e.pressure && e.pressure > 0 && e.pressure !== 0.5) {
      targetWidth = stroke.baseWidth * (0.35 + 1.25 * e.pressure);
    } else {
      // Natural velocity-tapering for finger touch:
      // Fast motions thin down slightly, slow strokes pool naturally
      const speedFactor = Math.min(velocity / 1.6, 1);
      targetWidth = stroke.baseWidth * (1.25 - 0.45 * speedFactor);
    }

    // Exponential smoothing for stroke width to avoid harsh jumps
    const smoothedWidth = lastPoint.width * 0.7 + targetWidth * 0.3;

    const newPoint: Point = {
      x,
      y,
      pressure: e.pressure || 0.5,
      time,
      width: smoothedWidth,
    };

    pts.push(newPoint);

    // Incremental Bézier Drawing (No full-canvas redraw needed during active stroke)
    ctx.save();

    if (stroke.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = stroke.baseWidth * 5.5;
    } else if (stroke.tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = isDarkMode ? 0.45 : 0.35;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.baseWidth * 4.8;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = smoothedWidth;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (pts.length === 2) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(newPoint.x, newPoint.y);
      ctx.stroke();
    } else {
      const prevMidX = (pts[pts.length - 3].x + lastPoint.x) / 2;
      const prevMidY = (pts[pts.length - 3].y + lastPoint.y) / 2;
      const nextMidX = (lastPoint.x + newPoint.x) / 2;
      const nextMidY = (lastPoint.y + newPoint.y) / 2;

      ctx.beginPath();
      ctx.moveTo(prevMidX, prevMidY);
      ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, nextMidX, nextMidY);
      ctx.stroke();
    }

    ctx.restore();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = currentStrokeRef.current;
    if (!stroke) return;

    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }

    // Commit stroke to history stack
    strokesRef.current.push(stroke);
    redoStackRef.current = []; // Clear redo stack on new action
    currentStrokeRef.current = null;
    updateUndoRedoState();

    // Redraw once to ensure perfect smoothing of stroke endpoints
    redrawAllStrokes();
  };

  // Undo last stroke
  const handleUndo = () => {
    if (strokesRef.current.length === 0) return;
    const last = strokesRef.current.pop();
    if (last) {
      redoStackRef.current.push(last);
    }
    updateUndoRedoState();
    redrawAllStrokes();
  };

  // Redo stroke
  const handleRedo = () => {
    if (redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop();
    if (next) {
      strokesRef.current.push(next);
    }
    updateUndoRedoState();
    redrawAllStrokes();
  };

  // Clear sheet
  const handleClearCanvas = () => {
    if (strokesRef.current.length === 0) return;
    // Push a snapshot or clear
    strokesRef.current = [];
    redoStackRef.current = [];
    updateUndoRedoState();
    redrawAllStrokes();
  };

  // Download high-resolution PNG of sheet
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create export canvas with background pattern baked in
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const eCtx = exportCanvas.getContext('2d');
    if (!eCtx) return;

    // Fill background color
    eCtx.fillStyle = isDarkMode ? '#181818' : '#FFFFFF';
    eCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Draw strokes
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    eCtx.scale(dpr, dpr);
    strokesRef.current.forEach((s) => drawStroke(eCtx, s));

    const link = document.createElement('a');
    link.download = `rough-sheet-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  // Insert calculator result into text notes
  const handleInsertCalc = () => {
    if (!calcResult) return;
    const line = `\n${calcInput} = ${calcResult}\n`;
    handleNotesChange(notes + line);
    setCalcInput('');
  };

  if (!isOpen) return null;

  // ============================================================================
  // MINIMIZED FLOATING BUBBLE (Mobile & Desktop Quick Resumption)
  // ============================================================================
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#005CE6] to-[#007AE6] text-white shadow-[0_8px_30px_rgba(0,92,230,0.35)] hover:shadow-[0_12px_40px_rgba(0,92,230,0.45)] font-bold text-xs transition-all cursor-pointer border-2 border-white/90 dark:border-white/20 active:scale-95"
          title="Tap to reopen Candidate Scratchpad"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Pencil className="w-3 h-3 text-white" />
          </div>
          <span className="tracking-tight">Rough Scratchpad</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>
    );
  }

  // Active palette depending on light/dark mode
  const currentPalette = isDarkMode ? DARK_PALETTE : LIGHT_PALETTE;

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col transition-all duration-200",
        // Mobile-First Responsive Geometry:
        // On phones: Full-width bottom-sheet (92vh or 100vh if maximized)
        // On tablet/desktop: Elegant floating modal window
        isMaximized
          ? "inset-0 sm:inset-4 w-full sm:w-auto h-full sm:h-auto rounded-none sm:rounded-3xl"
          : "inset-x-0 bottom-0 sm:inset-auto sm:bottom-5 sm:right-5 w-full sm:w-[520px] lg:w-[580px] h-[90vh] sm:h-[620px] rounded-t-3xl sm:rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
      )}
      style={{
        opacity: opacityLevel === 50 ? 0.55 : opacityLevel === 75 ? 0.78 : 1.0,
      }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-[#181818] backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl border border-slate-200/80 dark:border-[#2C2C2C] shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Mobile Swipe Grabber Bar */}
        <div className="sm:hidden w-full pt-2 pb-1 flex justify-center bg-slate-100 dark:bg-[#202020] cursor-grab select-none">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* ====================================================================
            Top Navigation Bar (iOS / Samsung Notes Minimalist Titlebar)
           ==================================================================== */}
        <div className="px-3.5 sm:px-4 py-2.5 bg-gradient-to-r from-[#005CE6] via-[#006DE6] to-[#0096D6] dark:from-[#202020] dark:via-[#262626] dark:to-[#202020] dark:border-b dark:border-[#2E2E2E] text-white flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white/20 dark:bg-white/10 flex items-center justify-center">
              <Pencil className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold tracking-tight flex items-center gap-2">
                <span>Scratchpad &amp; Rough Sheet</span>
                <span className="hidden xs:inline-flex text-[9px] font-mono font-bold bg-white/20 dark:bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Smooth Ink
                </span>
              </div>
            </div>
          </div>

          {/* Action & Window Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Opacity / Ghost Mode (Superpower on Mobile) */}
            <button
              onClick={() => {
                setOpacityLevel((prev) => (prev === 100 ? 75 : prev === 75 ? 50 : 100));
              }}
              className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer",
                opacityLevel < 100
                  ? "bg-white text-[#005CE6] dark:bg-white/20 dark:text-white shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/15"
              )}
              title="Toggle Semi-Transparent Ghost Mode (View question underneath)"
            >
              <Eye className="w-3 h-3" />
              <span>{opacityLevel}%</span>
            </button>

            {/* Minimize to Corner */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="Minimize to Floating Bubble"
              aria-label="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Maximize / Restore */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="hidden sm:inline-flex p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title={isMaximized ? "Restore Size" : "Full Screen"}
              aria-label="Maximize"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-rose-500/80 transition-colors cursor-pointer"
              title="Close Scratchpad"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ====================================================================
            Mode Switcher & Quick Tool Strip (Draw Canvas vs Typed Math Notes)
           ==================================================================== */}
        <div className="px-3 py-1.5 bg-[#F0FAFF] dark:bg-[#1E1E1E] border-b border-[#BCEBFC] dark:border-[#2C2C2C] flex items-center justify-between gap-2 text-xs shrink-0 select-none">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('draw')}
              className={cn(
                "px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer",
                activeTab === 'draw'
                  ? "bg-[#005CE6] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#252525]"
              )}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Handwriting Canvas</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={cn(
                "px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer",
                activeTab === 'notes'
                  ? "bg-[#005CE6] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#252525]"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Formula Notes</span>
            </button>
          </div>

          {/* Quick Undo / Redo / Clear (Available in header strip on mobile & desktop) */}
          {activeTab === 'draw' && (
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#005CE6] hover:bg-white dark:hover:bg-[#282828] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#005CE6] hover:bg-white dark:hover:bg-[#282828] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClearCanvas}
                disabled={!canUndo}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Clear Entire Sheet"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#005CE6] hover:bg-white dark:hover:bg-[#282828] cursor-pointer"
                title="Download Rough Sheet PNG"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ====================================================================
            Live Calculator Strip (Type quick arithmetic or percentages)
           ==================================================================== */}
        <div className="px-3 py-1.5 bg-white dark:bg-[#1C1C1C] border-b border-slate-100 dark:border-[#282828] flex items-center gap-2 text-xs shrink-0">
          <Calculator className="w-3.5 h-3.5 text-[#005CE6] dark:text-blue-400 shrink-0" />
          <input
            type="text"
            value={calcInput}
            onChange={(e) => setCalcInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInsertCalc();
            }}
            placeholder="Quick Math: 45% of 800, sqrt(625), 18^2 - 12^2, 1130/70..."
            className="flex-1 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-[#333333] font-mono text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-[#202020] focus:outline-none focus:ring-1 focus:ring-[#005CE6]"
          />
          {calcResult && (
            <div className="flex items-center gap-1.5 shrink-0 animate-in fade-in duration-100">
              <span className="font-mono font-extrabold text-[#005CE6] dark:text-blue-400 bg-blue-50 dark:bg-[#282828] px-2 py-0.5 rounded-md border border-blue-200 dark:border-[#383838] text-xs">
                = {calcResult}
              </span>
              <button
                onClick={handleInsertCalc}
                className="px-2 py-0.5 rounded-md bg-[#005CE6] text-white text-[10px] font-bold hover:bg-[#004dc2] cursor-pointer"
                title="Insert into notes"
              >
                + Insert
              </button>
            </div>
          )}
        </div>

        {/* ====================================================================
            Main Workspace: Drawing Canvas vs Notes
           ==================================================================== */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {activeTab === 'draw' && (
            <div className="flex-1 flex flex-col h-full relative" ref={containerRef}>
              
              {/* ==============================================================
                  Apple Notes / Samsung Notes Floating Tool Dock
                 ============================================================== */}
              <div className="absolute top-3 inset-x-3 sm:inset-x-auto sm:left-4 z-20 flex items-center justify-between sm:justify-start gap-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-[#222222]/95 backdrop-blur-xl border border-slate-200/90 dark:border-[#333333] shadow-lg text-xs overflow-x-auto no-scrollbar">
                
                {/* 1. Tool Selection: Pen / Highlighter / Eraser */}
                <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-slate-100 dark:bg-[#2B2B2B] shrink-0">
                  <button
                    onClick={() => setTool('pen')}
                    className={cn(
                      "px-2 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-all cursor-pointer text-xs",
                      tool === 'pen'
                        ? "bg-white dark:bg-[#383838] text-[#005CE6] dark:text-blue-400 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    )}
                    title="Smooth Pen"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Pen</span>
                  </button>

                  <button
                    onClick={() => setTool('highlighter')}
                    className={cn(
                      "px-2 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-all cursor-pointer text-xs",
                      tool === 'highlighter'
                        ? "bg-white dark:bg-[#383838] text-amber-500 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    )}
                    title="Translucent Marker"
                  >
                    <Highlighter className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Marker</span>
                  </button>

                  <button
                    onClick={() => setTool('eraser')}
                    className={cn(
                      "px-2 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-all cursor-pointer text-xs",
                      tool === 'eraser'
                        ? "bg-white dark:bg-[#383838] text-rose-500 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    )}
                    title="Precision Eraser"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Eraser</span>
                  </button>
                </div>

                {/* 2. Color Palette Presets */}
                {tool === 'pen' && (
                  <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-[#383838] shrink-0">
                    {currentPalette.map((c) => (
                      <button
                        key={c.color}
                        onClick={() => setPenColor(c.color)}
                        style={{ backgroundColor: c.color }}
                        className={cn(
                          "w-5 h-5 rounded-full transition-transform cursor-pointer border border-black/10 dark:border-white/20 shrink-0",
                          penColor === c.color
                            ? "ring-2 ring-offset-1 ring-[#005CE6] scale-110 shadow-xs"
                            : "opacity-80 hover:opacity-100 hover:scale-105"
                        )}
                        title={c.name}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                )}

                {tool === 'highlighter' && (
                  <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-[#383838] shrink-0">
                    {HIGHLIGHTER_COLORS.map((c) => (
                      <button
                        key={c.color}
                        onClick={() => setHighlighterColor(c.color)}
                        style={{ backgroundColor: c.color }}
                        className={cn(
                          "w-5 h-5 rounded-full transition-transform cursor-pointer border border-black/10 shrink-0",
                          highlighterColor === c.color
                            ? "ring-2 ring-offset-1 ring-amber-500 scale-110 shadow-xs"
                            : "opacity-80 hover:opacity-100 hover:scale-105"
                        )}
                        title={c.name}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                )}

                {/* 3. Nib / Stroke Width Selection */}
                <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-[#383838] shrink-0">
                  {STROKE_WIDTHS.map((sw) => (
                    <button
                      key={sw.label}
                      onClick={() => setLineWidth(sw.value)}
                      className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer",
                        lineWidth === sw.value
                          ? "bg-blue-100 dark:bg-[#333333] text-[#005CE6] dark:text-blue-400 font-bold"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      )}
                      title={`Stroke: ${sw.label}`}
                    >
                      <span className={cn("rounded-full bg-current", sw.dotSize)} />
                    </button>
                  ))}
                </div>

                {/* 4. Paper Grid / Ruled / Blank Pattern */}
                <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-[#383838] shrink-0">
                  <button
                    onClick={() =>
                      setPattern((prev) => (prev === 'grid' ? 'ruled' : prev === 'ruled' ? 'blank' : 'grid'))
                    }
                    className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#333333] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    title="Cycle Paper Pattern: Dotted Grid, Ruled, Blank"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span className="capitalize">{pattern}</span>
                  </button>
                </div>
              </div>

              {/* ==============================================================
                  Apple/Samsung Paper Canvas with Native Touch Rejection
                 ============================================================== */}
              <div
                className={cn(
                  "flex-1 w-full h-full relative cursor-crosshair touch-none select-none overflow-hidden",
                  // Dotted Math Grid Pattern (Apple Notes & GoodNotes inspired)
                  pattern === 'grid' &&
                    "bg-[radial-gradient(#CBD5E1_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(rgba(255,255,255,0.14)_1.2px,transparent_1.2px)] bg-[size:22px_22px] bg-white dark:bg-[#181818]",
                  // Ruled Notebook Lines
                  pattern === 'ruled' &&
                    "bg-[linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100%_26px] bg-white dark:bg-[#181818]",
                  // Pristine Blank Paper
                  pattern === 'blank' && "bg-white dark:bg-[#181818]"
                )}
              >
                <canvas
                  ref={canvasRef}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerCancel={stopDrawing}
                  onPointerLeave={stopDrawing}
                  className="w-full h-full block touch-none"
                  style={{ touchAction: 'none' }}
                />
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 2: Formula & Calculation Text Notes
             ============================================================== */}
          {activeTab === 'notes' && (
            <div className="flex-1 flex flex-col p-4 space-y-3 h-full bg-[#FAFBFD] dark:bg-[#181818]">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Candidate Scratchpad Notes (Autosaved locally)</span>
                <button
                  onClick={() => handleNotesChange('')}
                  className="text-[11px] font-bold text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"
                >
                  Clear Notes
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Type arithmetic shortcuts, ratios, step-by-step formulas, or quadratic roots..."
                className="flex-1 w-full p-4 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200 dark:border-[#303030] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#005CE6]/40 resize-none shadow-xs"
              />
            </div>
          )}
        </div>

        {/* ====================================================================
            Bottom Status & Gesture Bar (Persistent Across Mobile & Desktop)
           ==================================================================== */}
        <div className="px-3.5 sm:px-4 py-2 bg-slate-50 dark:bg-[#1C1C1C] border-t border-slate-200/80 dark:border-[#2C2C2C] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="truncate">Rough work stays persistent across all test questions.</span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-[11px] font-bold text-[#005CE6] dark:text-blue-400 hover:underline cursor-pointer shrink-0"
          >
            Dock to Corner
          </button>
        </div>
      </div>
    </div>
  );
}
