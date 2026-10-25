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
          {/* User Account Controls */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={cn(
                "flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all cursor-pointer select-none",
                profileDropdownOpen
                  ? "border-[#005CE6] bg-blue-50/50 ring-2 ring-[#005CE6]/20"
                  : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50"
              )}
              aria-label="User menu"
              aria-expanded={profileDropdownOpen}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#005CE6] to-[#0096D6] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                SM
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">Sathyamoorthi M.</div>
                <div className="text-[10px] text-slate-400 leading-none">IBPS PO 2026</div>
              </div>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
                  profileDropdownOpen && "rotate-180 text-[#005CE6]"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-1">
                  <div className="font-bold text-xs text-slate-900">Sathyamoorthi M</div>
                  <div className="text-[11px] text-slate-500 truncate">sathyamoorthi@satprep.in</div>
                  <div className="text-[10px] font-semibold text-[#005CE6] mt-1">Target: IBPS PO Prelims 2026</div>
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
