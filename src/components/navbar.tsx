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
  ChevronDown,
  LogOut,
  Home,
  BarChart2,
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
    <header className={cn("sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all", className)}>
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand with descriptive subtitle */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90 focus:outline-none"
            aria-label="SatPrep - Banking exam preparation"
          >
            <BrandLogo size={34} showWordmark={false} />
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                SatPrep
              </span>
              <span className="text-[10px] font-medium text-slate-500 leading-none">
                Banking exam preparation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Main Navigation">
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                    active
                      ? "text-[#005CE6] bg-blue-50/70 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", active ? "text-[#005CE6]" : "text-slate-400")} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User Profile Menu & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
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
                "p-0.5 rounded-full transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#005CE6]/40 flex items-center justify-center",
                profileDropdownOpen ? "ring-2 ring-[#005CE6] shadow-sm" : "hover:ring-2 hover:ring-[#005CE6]/30"
              )}
              aria-label="Candidate Profile Menu"
              aria-expanded={profileDropdownOpen}
              title="Sathyamoorthi M (Click for Profile Menu)"
            >
              <CandidateAvatar size={38} />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-[60] animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-1 flex items-center gap-3">
                  <CandidateAvatar size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 truncate">Sathyamoorthi M</div>
                    <div className="text-[10px] text-slate-500 truncate">sathyamoorthi@satprep.in</div>
                    <div className="text-[10px] font-semibold text-[#005CE6] mt-0.5">Target: IBPS PO Prelims 2026</div>
                  </div>
                </div>

                <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Student Space
                </div>

                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-[#005CE6] hover:bg-blue-50/60 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Candidate Profile &amp; Goals</span>
                </Link>

                <Link
                  href="/tests/result/sample-attempt-1"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-[#005CE6] hover:bg-blue-50/60 transition-colors"
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
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-[#005CE6] hover:bg-blue-50/60 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Console</span>
                </Link>

                <div className="h-px bg-slate-100 my-1" />

                <Link
                  href="/auth"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
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
            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                  active
                    ? "text-[#005CE6] bg-blue-50/70 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <Icon className={cn("w-4 h-4", active ? "text-[#005CE6]" : "text-slate-400")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
