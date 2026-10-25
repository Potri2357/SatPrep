'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import {
  Flame,
  Plus,
  Menu,
  X,
  Layers,
  BookOpen,
  User,
  Shield,
  Award,
  ChevronDown,
  LogOut,
  Sparkles,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  className?: string;
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

  // Centered core options with icons (Exam Results and Profile removed as requested)
  const centerNavLinks = [
    { label: 'Create Test', href: '/tests/new', icon: Layers },
    { label: 'Practice', href: '/practice', icon: BookOpen },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className={`sticky top-0 z-50 bg-[#F7FDFF]/85 backdrop-blur-xl border-b border-[#BCEBFC]/60 shadow-[0_4px_24px_rgba(0,92,230,0.04)] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-[1.02] focus:outline-none"
          >
            <BrandLogo size={34} showWordmark={true} />
          </Link>
        </div>

        {/* Center: Navigation Options Dock (Centered, with Icons, Chip UI) */}
        <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 p-1 rounded-full neu-inset bg-white/70 backdrop-blur-md border border-[#BCEBFC]/80 shadow-[inset_2px_2px_6px_rgba(0,92,230,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.95)]">
          {centerNavLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  active
                    ? 'neu-chip-primary text-white shadow-[0_4px_14px_rgba(0,92,230,0.35)]'
                    : 'text-slate-600 hover:text-[#005CE6] hover:bg-white/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#005CE6]'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Streak Chip, New Test Chip, and Profile Icon with Dropdown (User & Admin) */}
        <div className="flex items-center gap-3">
          {/* 5-Day Streak Pill (Matching Reference Image) */}
          <div className="hidden lg:inline-flex streak-pill">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
            <span>5 Day Streak</span>
          </div>

          {/* Quick New Test Chip Button (Matching Reference Image) */}
          <Link
            href="/tests/new"
            className="hidden sm:inline-flex neu-chip-primary text-xs"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>New Test</span>
          </Link>

          {/* Profile Icon with Dropdown of User and Admin */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={`flex items-center gap-1.5 p-1 rounded-full bg-white/90 border transition-all cursor-pointer ${
                profileDropdownOpen
                  ? 'border-[#005CE6] shadow-[0_0_0_3px_rgba(0,92,230,0.15)] ring-1 ring-[#005CE6]'
                  : 'border-[#BCEBFC] hover:border-[#005CE6] shadow-[2px_2px_8px_rgba(0,92,230,0.08),-2px_-2px_8px_rgba(255,255,255,0.95)]'
              }`}
              aria-label="User Profile and Admin Navigation Menu"
              aria-expanded={profileDropdownOpen}
            >
              {/* Avatar Pill */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#005CE6] via-[#0096D6] to-[#60CEF8] text-white font-extrabold flex items-center justify-center text-xs shadow-sm ring-1 ring-white">
                AS
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 mr-1 transition-transform duration-200 ${
                  profileDropdownOpen ? 'rotate-180 text-[#005CE6]' : 'text-slate-500'
                }`}
              />
            </button>

            {/* Profile Dropdown Menu with User and Admin Options */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-white/95 backdrop-blur-2xl border border-white shadow-[0_16px_40px_rgba(0,92,230,0.14),-6px_-6px_20px_rgba(255,255,255,0.95)] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1.5">
                {/* Candidate Info Header */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#F0FAFF] to-[#E0F4FD] border border-[#BCEBFC]/60 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#005CE6] to-[#0096D6] text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-white">
                      AS
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-extrabold text-sm text-[#0F172A] truncate">Aditya Sharma</div>
                      <div className="text-[11px] text-slate-500 truncate">aditya@satprep.in</div>
                      <div className="text-[10px] text-[#005CE6] font-bold bg-white/80 px-2 py-0.5 rounded-full inline-block mt-1 border border-[#BCEBFC]">
                        IBPS PO 2026 Aspirant
                      </div>
                    </div>
                  </div>
                </div>

                {/* USER SECTION */}
                <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  User Space
                </div>

                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#005CE6] hover:bg-[#F0FAFF] transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#F0FAFF] group-hover:bg-[#BCEBFC]/50 text-[#005CE6] flex items-center justify-center transition-colors">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Candidate Profile</div>
                    <div className="text-[10px] text-slate-400">Exams, targets, and study stats</div>
                  </div>
                </Link>

                <Link
                  href="/tests/result/sample-attempt-1"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#005CE6] hover:bg-[#F0FAFF] transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#F0FAFF] group-hover:bg-[#BCEBFC]/50 text-[#005CE6] flex items-center justify-center transition-colors">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Exam Results &amp; Analytics</div>
                    <div className="text-[10px] text-slate-400">Scorecard, rank, and weak spots</div>
                  </div>
                </Link>

                {/* DIVIDER */}
                <div className="h-px bg-slate-100 my-1" />

                {/* ADMIN SECTION */}
                <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Administration
                </div>

                <Link
                  href="/admin"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#005CE6] hover:bg-[#F0FAFF] transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-[#005CE6] text-[#005CE6] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>Admin Console</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#005CE6] text-white font-mono">STAFF</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Manage questions, seeds &amp; test packs</div>
                  </div>
                </Link>

                {/* DIVIDER */}
                <div className="h-px bg-slate-100 my-1" />

                {/* SIGN OUT */}
                <Link
                  href="/auth"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <LogOut className="w-3.5 h-3.5" />
                  </div>
                  <span>Switch Account / Sign Out</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/80 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#BCEBFC]/60 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="streak-pill text-xs py-1 px-3">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>5 Day Streak</span>
            </div>
            <Link
              href="/tests/new"
              onClick={() => setMobileMenuOpen(false)}
              className="neu-chip-primary text-xs py-1.5 px-4"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Test</span>
            </Link>
          </div>

          {centerNavLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#005CE6] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#005CE6]'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <User className="w-4 h-4 text-[#005CE6]" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/tests/result/sample-attempt-1"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Award className="w-4 h-4 text-[#005CE6]" />
              <span>Exam Results &amp; Analytics</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-[#005CE6] hover:bg-blue-50"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
