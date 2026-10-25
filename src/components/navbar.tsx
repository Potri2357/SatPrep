'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
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
  Sparkles,
  Home,
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

  // Centered navigation options with icons (using shadcn navigation-menu pattern)
  const centerNavItems = [
    { title: 'Home', href: '/', icon: Home },
    { title: 'Create Test', href: '/tests/new', icon: Layers },
    { title: 'Practice', href: '/practice', icon: BookOpen },
  ];

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className={`sticky top-3 z-50 px-3 sm:px-6 w-full ${className}`}>
      {/* Floating Island Navbar (Clean, High-Contrast, Premium Architecture) */}
      <header className="max-w-7xl mx-auto h-16 rounded-full bg-white/95 backdrop-blur-2xl border border-[#BCEBFC] shadow-[0_12px_36px_rgba(0,92,230,0.08),0_2px_6px_rgba(0,92,230,0.04)] px-4 sm:px-6 flex items-center justify-between relative transition-all">
        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-[1.02] focus:outline-none"
            aria-label="SatPrep Home"
          >
            <BrandLogo size={36} showWordmark={true} />
          </Link>
        </div>

        {/* Center: shadcn NavigationMenu with sliding underline & icons */}
        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
          <NavigationMenu>
            <NavigationMenuList className="space-x-1 sm:space-x-2 bg-[#F0FAFF]/80 p-1 rounded-full border border-[#BCEBFC]/60 shadow-[inset_0_1px_3px_rgba(0,92,230,0.05)]">
              {centerNavItems.map((item) => {
                const active = isItemActive(item.href);
                const Icon = item.icon;
                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      active={active}
                      asChild
                      className={cn(
                        "group relative inline-flex h-9 w-max items-center justify-center rounded-full px-4 py-2 font-bold text-xs transition-all",
                        "before:absolute before:inset-x-3 before:bottom-0.5 before:h-[2px] before:scale-x-0 before:bg-[#005CE6] before:transition-transform before:duration-200",
                        active
                          ? "bg-white text-[#005CE6] shadow-[0_2px_8px_rgba(0,92,230,0.12)] before:scale-x-100"
                          : "text-slate-600 hover:text-[#005CE6] hover:bg-white/60 hover:before:scale-x-100"
                      )}
                    >
                      <Link className="flex items-center gap-2" href={item.href}>
                        <Icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-[#005CE6]" : "text-slate-500 group-hover:text-[#005CE6]")} />
                        <span>{item.title}</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: Profile Icon with Dropdown (User & Admin) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Profile Icon with Dropdown of User and Admin */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={cn(
                "flex items-center gap-1.5 p-1 rounded-full bg-white border transition-all cursor-pointer select-none",
                profileDropdownOpen
                  ? "border-[#005CE6] shadow-[0_0_0_3px_rgba(0,92,230,0.15)] ring-1 ring-[#005CE6]"
                  : "border-[#BCEBFC] hover:border-[#005CE6] shadow-[0_2px_8px_rgba(0,92,230,0.08)]"
              )}
              aria-label="User & Admin Profile Menu"
              aria-expanded={profileDropdownOpen}
            >
              {/* Avatar Disc */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#005CE6] via-[#0096D6] to-[#60CEF8] text-white font-extrabold flex items-center justify-center text-xs shadow-sm ring-1 ring-white">
                AS
              </div>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-slate-500 mr-1 transition-transform duration-200",
                  profileDropdownOpen && "rotate-180 text-[#005CE6]"
                )}
              />
            </button>

            {/* Profile & Admin Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-3xl bg-white/98 backdrop-blur-2xl border border-[#BCEBFC] shadow-[0_20px_50px_rgba(0,92,230,0.15),0_1px_3px_rgba(0,92,230,0.05)] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1.5">
                {/* Candidate Info Header */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#F0FAFF] to-[#E0F4FD] border border-[#BCEBFC]/70 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#005CE6] to-[#0096D6] text-white font-extrabold flex items-center justify-center text-sm shadow-sm ring-2 ring-white">
                      AS
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-extrabold text-sm text-[#0F172A] truncate">Aditya Sharma</div>
                      <div className="text-[11px] text-slate-500 truncate">aditya@satprep.in</div>
                      <div className="text-[10px] font-bold text-[#005CE6] bg-white px-2 py-0.5 rounded-full inline-block mt-1 border border-[#BCEBFC]">
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
                  <div className="w-7 h-7 rounded-lg bg-[#F0FAFF] group-hover:bg-[#BCEBFC]/60 text-[#005CE6] flex items-center justify-center transition-colors">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Candidate Profile</div>
                    <div className="text-[10px] text-slate-400">Target exams &amp; study history</div>
                  </div>
                </Link>

                <Link
                  href="/tests/result/sample-attempt-1"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#005CE6] hover:bg-[#F0FAFF] transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#F0FAFF] group-hover:bg-[#BCEBFC]/60 text-[#005CE6] flex items-center justify-center transition-colors">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Exam Results &amp; Analytics</div>
                    <div className="text-[10px] text-slate-400">Scorecard, rank &amp; weak areas</div>
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
                    <div className="text-[10px] text-slate-400">Question bank, generator &amp; review</div>
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
            className="md:hidden p-2 rounded-full bg-white border border-[#BCEBFC] text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-3xl border border-[#BCEBFC] bg-white/98 backdrop-blur-2xl p-4 space-y-2 shadow-xl">
          {centerNavItems.map((item) => {
            const active = isItemActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-bold transition-all",
                  active
                    ? "bg-[#005CE6] text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <Icon className={cn("w-4 h-4", active ? "text-white" : "text-[#005CE6]")} />
                <span>{item.title}</span>
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
    </div>
  );
};
