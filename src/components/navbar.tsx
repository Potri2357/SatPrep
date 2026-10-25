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
    <header className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/80 shadow-[0_6px_24px_rgba(37,99,235,0.04)] ${className}`}>
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
                  className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-50/90 text-[#1D4ED8] font-bold border border-blue-200 shadow-[inset_2px_2px_4px_rgba(37,99,235,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]'
                      : 'text-slate-600 hover:text-[#2563EB] hover:bg-white/80 hover:shadow-[3px_3px_8px_rgba(37,99,235,0.05),-3px_-3px_8px_rgba(255,255,255,0.9)]'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Admin Console Pill */}
            <Link
              href="/admin"
              className={`ml-2 text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/admin')
                  ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                  : 'bg-blue-50/80 text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-xs'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </nav>
        </div>

        {/* Right: Streak, Quick Action & User Avatar */}
        <div className="hidden sm:flex items-center gap-3.5">
          {/* 5-Day Streak Badge (Neumorphic Glass Pill) */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50/90 backdrop-blur-md border border-amber-200/80 text-xs font-bold text-amber-700 shadow-[3px_3px_8px_rgba(245,158,11,0.08),-3px_-3px_8px_rgba(255,255,255,0.95)]">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>5 Day Streak</span>
          </div>

          {/* Quick Create Test CTA (Primary Neuromorphic Chip) */}
          <Link
            href="/tests/new"
            className="neu-chip-primary text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Test</span>
          </Link>

          {/* User Profile Avatar */}
          <Link
            href="/profile"
            className="group flex items-center gap-2 p-1 rounded-full hover:scale-105 transition-transform"
            title="Aditya Sharma — Candidate Profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white font-bold flex items-center justify-center text-xs shadow-[3px_3px_8px_rgba(37,99,235,0.25),-2px_-2px_6px_rgba(255,255,255,0.9)] ring-2 ring-white">
              AS
            </div>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white font-bold flex items-center justify-center text-[10px] shadow-sm ring-2 ring-white"
          >
            AS
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-white/80 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-xl">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-50 text-[#1D4ED8] font-bold border border-blue-200 shadow-inner'
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
              className="text-xs font-bold px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1.5 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>5 Days</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
