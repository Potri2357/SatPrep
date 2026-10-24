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
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#0E1117] flex text-[#212835] dark:text-[#EAF1F8] text-[13px]">
      {/* Dark Navy-700 Sidebar (PRD Section 7.10) */}
      <aside className="w-64 bg-[#212835] text-slate-300 border-r border-[#2E3746] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Bar */}
          <div className="h-16 border-b border-[#2E3746] px-5 flex items-center justify-between">
            <BrandLogo size={28} showWordmark={true} />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2E3746] text-[#8FB2EA]">
              ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2D6BCB] text-white shadow-sm'
                      : 'hover:bg-white/10 text-slate-300 hover:text-white'
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
        <div className="p-4 border-t border-[#2E3746] space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>Exit to Student App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2D6BCB] text-white font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <div className="font-semibold text-white truncate text-xs">Admin Console</div>
              <div className="text-[10px] text-slate-400 truncate">Super Admin Role</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with Command Palette trigger */}
        <header className="h-14 bg-white dark:bg-[#151A23] border-b border-[#DDE4EE] dark:border-[#2E3746] px-6 flex items-center justify-between shrink-0">
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] text-xs text-slate-400 hover:border-[#2D6BCB] transition-colors w-72"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search questions, jobs, users...</span>
            <kbd className="ml-auto font-mono text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#1F9D6B]" />
              <span>Pipeline: Active</span>
            </span>
            <span className="text-slate-400">Worker Latency: 42ms</span>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* COMMAND PALETTE MODAL (Ctrl+K - PRD Section 7.10) */}
      {cmdOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
          <div className="bg-white dark:bg-[#151A23] rounded-2xl border border-[#DDE4EE] dark:border-[#2E3746] max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-[#DDE4EE] dark:border-[#2E3746] flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                autoFocus
                placeholder="Jump to question, seed, job ID or settings..."
                className="w-full bg-transparent border-none text-xs focus:outline-none"
              />
              <button onClick={() => setCmdOpen(false)} className="text-xs text-slate-400 hover:text-white">
                ESC
              </button>
            </div>

            <div className="p-2 space-y-1 text-xs">
              <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase">Quick Actions</div>
              <Link
                href="/admin/generation"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1B212C]"
              >
                <span>Trigger New Question Generation Batch</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/admin/seed"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1B212C]"
              >
                <span>Import Seed Questions CSV / PDF</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/admin/reports"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1B212C]"
              >
                <span>Launch Re-grade Tool</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
