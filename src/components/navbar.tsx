'use client';

import React, { useState } from 'react';
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
  LayoutDashboard,
} from 'lucide-react';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Create Test', href: '/tests/new', icon: Layers },
    { label: 'Practice', href: '/practice', icon: BookOpen },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0]/90 shadow-[0_4px_20px_rgb(37,99,235,0.03)] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Primary Navigation */}
        <div className="flex items-center gap-7">
          <Link
            href="/dashboard"
            className="flex items-center transition-transform hover:scale-[1.02] focus:outline-none"
          >
            <BrandLogo size={34} showWordmark={true} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#EFF6FF] text-[#1D4ED8] font-bold border border-[#BFDBFE] shadow-xs'
                      : 'text-slate-600 hover:text-[#2563EB] hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Admin Console Pill */}
            <Link
              href="/admin"
              className={`ml-2 text-[11px] font-bold px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
                pathname.startsWith('/admin')
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </nav>
        </div>

        {/* Right: Streak, Quick Action & User Avatar */}
        <div className="hidden sm:flex items-center gap-3.5">
          {/* 5-Day Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>5 Day Streak</span>
          </div>

          {/* Quick Create Test CTA */}
          <Link
            href="/tests/new"
            className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Test</span>
          </Link>

          {/* User Profile Avatar */}
          <Link
            href="/profile"
            className="group flex items-center gap-2 p-1 rounded-full hover:bg-blue-50 transition-colors"
            title="Aditya Sharma — Candidate Profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white font-bold flex items-center justify-center text-xs shadow-sm ring-2 ring-white group-hover:ring-[#BFDBFE] transition-all">
              AS
            </div>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/profile"
            className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white font-bold flex items-center justify-center text-[10px]"
          >
            AS
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-2 shadow-xl">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-[#EFF6FF] text-[#1D4ED8] font-bold border border-[#BFDBFE]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-600" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>5 Days</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
