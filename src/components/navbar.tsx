'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  User,
  Shield,
  Award,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  className?: string;
}

export function CandidateAvatar({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-tr from-[#005CE6] via-[#0096D6] to-[#60CEF8] p-[2px] shadow-2xs transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 select-none",
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
    { title: 'Home', href: '/' },
    { title: 'Mock Tests', href: '/tests/new' },
    { title: 'Practice', href: '/practice' },
    { title: 'Progress', href: '/profile' },
  ];

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full bg-[#F7FDFF]/90 backdrop-blur-xl border-b border-[#BCEBFC]/80 shadow-[0_1px_3px_rgba(0,92,230,0.03),0_4px_16px_rgba(0,92,230,0.03)] transition-all", className)}>
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Clean Brand Logo & Minimalist Navigation */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus:outline-none"
            aria-label="SatPrep - Banking Exam Prep"
          >
            <BrandLogo size={32} showWordmark={false} />
            <span className="font-extrabold text-[18px] tracking-tight text-slate-900">
              SatPrep
            </span>
          </Link>

          {/* Desktop Clean Navigation (No pill enclosures or menu clutter) */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "text-[13.5px] transition-colors duration-150 relative py-1.5",
                    active
                      ? "text-[#005CE6] font-bold"
                      : "text-slate-600 font-medium hover:text-[#005CE6]"
                  )}
                >
                  <span>{item.title}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#005CE6] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Clean Candidate Avatar Only */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setProfileDropdownOpen((prev) => !prev);
              }}
              className={cn(
                "p-0.5 rounded-full border border-[#BCEBFC] hover:border-[#005CE6] hover:ring-2 hover:ring-[#005CE6]/20 transition-all cursor-pointer select-none focus:outline-none flex items-center justify-center",
                profileDropdownOpen ? "border-[#005CE6] ring-2 ring-[#005CE6]/25 shadow-xs" : ""
              )}
              aria-label="Candidate Profile Menu"
              aria-expanded={profileDropdownOpen}
              title="Sathyamoorthi M (Click for Profile Menu)"
            >
              <CandidateAvatar size={36} />
            </button>

            {/* Clean Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-white/98 backdrop-blur-2xl border border-[#BCEBFC] shadow-[0_12px_40px_rgba(0,92,230,0.08)] p-2 z-[60] animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                {/* Profile Header (Clean: No Verified Student badge, No green dot, No target line) */}
                <div className="p-3 rounded-xl bg-[#F0FAFF] border border-[#BCEBFC]/60 flex items-center gap-3">
                  <CandidateAvatar size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 truncate">Sathyamoorthi M</div>
                    <div className="text-[11px] text-slate-500 truncate">sathyamoorthi@satprep.in</div>
                  </div>
                </div>

                <div className="px-2 pt-2 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Student Portal
                </div>

                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-[#005CE6] hover:bg-[#F0FAFF] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile &amp; Settings</span>
                </Link>

                <Link
                  href="/tests/result/sample-attempt-1"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-[#005CE6] hover:bg-[#F0FAFF] transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>Exam Results</span>
                </Link>

                <div className="h-px bg-slate-100 my-1" />

                <Link
                  href="/admin"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-[#005CE6] hover:bg-[#F0FAFF] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Console</span>
                </Link>

                <div className="h-px bg-slate-100 my-1" />

                <Link
                  href="/auth"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
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
        <div className="md:hidden border-t border-[#BCEBFC] bg-[#F7FDFF] px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                  active
                    ? "text-[#005CE6] bg-[#005CE6]/10 font-bold"
                    : "text-slate-700 hover:bg-slate-100/60"
                )}
              >
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
