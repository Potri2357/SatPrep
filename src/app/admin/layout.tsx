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
  Menu,
  X,
  UploadCloud,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

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
    { label: 'Upload Questions', href: '/admin/seed', icon: UploadCloud },
    { label: 'Question Review', href: '/admin/review', icon: CheckSquare },
    { label: 'Create with AI', href: '/admin/generation', icon: Cpu },
    { label: 'Student Feedback', href: '/admin/reports', icon: Flag },
    { label: 'Settings & Activity', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 text-[13px] relative overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white/95 backdrop-blur-xl text-slate-700 border-r border-blue-100 hidden md:flex flex-col justify-between shrink-0 shadow-xs z-20">
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
            href="/"
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
              <div className="text-[10px] text-blue-700 font-semibold truncate">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-72 max-w-[85vw] bg-white h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="h-16 border-b border-blue-100 px-5 flex items-center justify-between">
                <BrandLogo size={28} showWordmark={true} />
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-3 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm font-bold'
                          : 'hover:bg-blue-50 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="p-4 border-t border-slate-100 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center justify-between text-xs text-slate-600 hover:text-blue-600 font-semibold py-2"
              >
                <span>Exit to Student App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col min-w-0 z-10 overflow-hidden">
        {/* Top Bar with Command Palette trigger */}
        <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-blue-100 px-4 sm:px-6 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0 cursor-pointer"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-xl border border-blue-100 bg-blue-50/40 text-xs text-slate-500 hover:border-blue-400 hover:bg-white transition-all w-full sm:w-80 shadow-xs truncate"
            >
              <Search className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">Search questions, topics...</span>
              <kbd className="hidden sm:inline ml-auto font-mono text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* COMMAND PALETTE MODAL */}
      {cmdOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
          <div className="glass-panel bg-white/95 rounded-3xl border border-blue-100 max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-3.5 border-b border-blue-100 flex items-center gap-3">
              <Search className="w-4 h-4 text-blue-600" />
              <input
                autoFocus
                placeholder="Jump to questions, uploads, or settings..."
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
                <span>Create Questions with AI</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              </Link>
              <Link
                href="/admin/seed"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/70 text-slate-700 hover:text-blue-700 transition-colors"
              >
                <span>Upload Questions (Excel, CSV, PDF)</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              </Link>
              <Link
                href="/admin/reports"
                onClick={() => setCmdOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/70 text-slate-700 hover:text-blue-700 transition-colors"
              >
                <span>Review Student Feedback</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
