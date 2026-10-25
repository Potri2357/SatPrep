'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import {
  LayoutDashboard,
  HelpCircle,
  FileSpreadsheet,
  CheckSquare,
  Cpu,
  Flag,
  Settings,
  Search,
  Command,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = useState<boolean>(false);

  // Command Palette Keyboard Shortcut (Ctrl+K or Cmd+K - PRD Section 7.10)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Question Bank', href: '/admin/questions', icon: HelpCircle },
    { label: 'Seed Ingestion', href: '/admin/seed', icon: FileSpreadsheet },
    { label: 'Review Queue', href: '/admin/review', icon: CheckSquare },
    { label: 'Generation Centre', href: '/admin/generation', icon: Cpu },
    { label: 'Reports & Re-grade', href: '/admin/reports', icon: Flag },
    { label: 'Settings & Audit', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 text-[13px] relative overflow-hidden">
      {/* Crisp White & Blue Sidebar */}
      <aside className="w-64 bg-white/95 backdrop-blur-xl text-slate-700 border-r border-blue-100 flex flex-col justify-between shrink-0 shadow-xs z-20">
        <div>
          {/* Logo Bar */}
          <div className="h-16 border-b border-blue-100 px-5 flex items-center justify-between">
            <Link href="/admin" className="transition-transform hover:scale-[1.02]">
              <BrandLogo size={28} showWordmark={true} />
            </Link>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20 font-bold'
                      : 'hover:bg-blue-50/70 text-slate-600 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile in Admin */}
        <div className="p-4 border-t border-blue-100 space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-between text-xs text-slate-500 hover:text-blue-600 transition-colors"
          >
            <span>Exit to Student App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-blue-50/50 border border-blue-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-slate-900 truncate text-xs">Admin Console</div>
              <div className="text-[10px] text-blue-700 font-semibold truncate">Super Admin Role</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Bar with Command Palette trigger */}
        <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-blue-100 px-6 flex items-center justify-between shrink-0">
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl border border-blue-100 bg-blue-50/40 text-xs text-slate-500 hover:border-blue-400 hover:bg-white transition-all w-80 shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Search questions, jobs, users...</span>
            <kbd className="ml-auto font-mono text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pipeline: Active</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">Worker Latency: 42ms</span>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* COMMAND PALETTE MODAL */}
      {cmdOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
          <div className="glass-panel bg-white/95 rounded-3xl border border-blue-100 max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-3.5 border-b border-blue-100 flex items-center gap-3">
              <Search className="w-4 h-4 text-blue-600" />
              <input
                autoFocus
                placeholder="Jump to question, seed, job ID or settings..."
                className="w-full bg-transparent border-none text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setCmdOpen(false)}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                ESC
              </button>
            </div>

            <div className="p-2 space-y-1 text-xs">
              <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">Quick Actions</div>
              <Link
                href="/admin/generation"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/70 text-slate-700 hover:text-blue-700 transition-colors"
              >
                <span>Trigger New Question Generation Batch</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              </Link>
              <Link
                href="/admin/seed"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/70 text-slate-700 hover:text-blue-700 transition-colors"
              >
                <span>Import Seed Questions CSV / PDF</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              </Link>
              <Link
                href="/admin/reports"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/70 text-slate-700 hover:text-blue-700 transition-colors"
              >
                <span>Launch Re-grade Tool</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
