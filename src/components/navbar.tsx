'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Layers,
  BookOpen,
  User,
  Shield,
  Award,
  LogOut,
  Home,
  BarChart2,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  className?: string;
}

export function CandidateAvatar({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-tr from-[#005CE6] via-[#0096D6] to-[#60CEF8] p-[2px] shadow-xs transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 shrink-0 select-none",
        className
      )}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#F0F7FF" />
          <path d="M6 38C6 30.268 12.268 24 20 24C27.732 24 34 30.268 34 38" fill="#005CE6" />
          <path d="M16 24L20 29L24 24" stroke="#BCEBFC" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="17.5" y="19" width="5" height="6" rx="2" fill="#F4B28C" />
          <circle cx="20" cy="14" r="6.5" fill="#F4B28C" />
          <path d="M13.5 13.5C13.5 9.5 16.5 7 20 7C23.5 7 26.5 9.5 26.5 13.5C26.5 14 26 14.5 25 13.5C23.5 12 21 11.5 18 12C15.5 12.5 14 13.5 13.5 13.5Z" fill="#1E293B" />
        </svg>
      </div>
    </div>
  );
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation destinations
  const navItems = [
    { title: 'Home', href: '/', icon: Home },
    { title: 'Mock Tests', href: '/tests/new', icon: Layers },
    { title: 'Practice', href: '/practice', icon: BookOpen },
    { title: 'Progress', href: '/profile', icon: BarChart2 },
  ];

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_20px_rgba(0,92,230,0.02)] transition-all", className)}>
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & Segmented Nav */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-all hover:opacity-95 focus:outline-none group"
            aria-label="SatPrep - Banking Exam Prep"
          >
            <div className="transition-transform group-hover:scale-105">
              <BrandLogo size={32} showWordmark={false} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[17px] tracking-tight text-slate-900">
                SatPrep
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#005CE6]/10 text-[#005CE6] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#005CE6]/20">
                Bank Prep
              </span>
            </div>
          </Link>

          {/* Desktop Segmented Navigation Bar */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 shadow-2xs" aria-label="Main Navigation">
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs transition-all duration-150 select-none",
                    active
                      ? "bg-white text-[#005CE6] font-bold shadow-xs shadow-slate-200/70"
                      : "text-slate-600 font-semibold hover:text-slate-900 hover:bg-white/60"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5 shrink-0", active ? "text-[#005CE6]" : "text-slate-400")} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Quick CTA + User Profile Avatar + Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Quick Mock Test CTA (Desktop) */}
          <Link
            href="/tests/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#005CE6] to-[#0096D6] hover:from-[#004ec4] hover:to-[#0081ba] text-white text-xs font-bold transition-all shadow-xs hover:shadow hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Start Test</span>
          </Link>

          {/* User Account Controls (Avatar Icon Only) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setProfileDropdownOpen((prev) => !prev);
              }}
              className={cn(
                "p-0.5 rounded-full transition-all cursor-pointer select-none focus:outline-none relative flex items-center justify-center",
                profileDropdownOpen
                  ? "ring-2 ring-[#005CE6] ring-offset-2 ring-offset-white shadow-sm"
                  : "hover:ring-2 hover:ring-[#005CE6]/30 hover:ring-offset-1"
              )}
              aria-label="Candidate Profile Menu"
              aria-expanded={profileDropdownOpen}
              title="Sathyamoorthi M (Click for Profile Menu)"
            >
              <CandidateAvatar size={36} />
              {/* Online pulse indicator dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)] p-2 z-[60] animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                {/* Profile Header (Target line completely removed) */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#F0FAFF] to-[#EBF7FF] border border-[#BCEBFC]/60 flex items-center gap-3">
                  <CandidateAvatar size={38} />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 truncate">Sathyamoorthi M</div>
                    <div className="text-[11px] text-slate-500 truncate">sathyamoorthi@satprep.in</div>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Student</span>
                    </div>
                  </div>
                </div>

                <div className="px-2 pt-2 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Student Portal
                </div>

                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#005CE6] hover:bg-blue-50/70 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Candidate Profile &amp; Settings</span>
                </Link>

                <Link
                  href="/tests/result/sample-attempt-1"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#005CE6] hover:bg-blue-50/70 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>Exam Results &amp; Analytics</span>
                </Link>

                <div className="h-px bg-slate-100 my-1" />

                <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Administration
                </div>

                <Link
                  href="/admin"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#005CE6] hover:bg-blue-50/70 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Console</span>
                </Link>

                <div className="h-px bg-slate-100 my-1" />

                <Link
                  href="/auth"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-1.5 pb-2">
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                    active
                      ? "text-[#005CE6] bg-blue-50/80 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", active ? "text-[#005CE6]" : "text-slate-400")} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>

          <Link
            href="/tests/new"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#005CE6] to-[#0096D6] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Practice Test</span>
          </Link>
        </div>
      )}
    </header>
  );
};
