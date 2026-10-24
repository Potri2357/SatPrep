'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { Mail, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('aditya.sharma@example.com');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6FF] via-[#FFFFFF] to-[#EFF6FF] flex text-[#0F172A]">
      {/* Left Column: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div>
          <BrandLogo size={40} showWordmark={true} />
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-10">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mb-2">
              {tab === 'signin' ? 'Welcome back to SatPrep' : 'Start your bank exam prep'}
            </h1>
            <p className="text-sm text-slate-500">
              {tab === 'signin'
                ? 'Sign in to resume mock tests and topic analytics'
                : 'Unlimited fresh, calibrated quant practice tailored to your target exam'}
            </p>
          </div>

          {/* Tab Switcher (Pill Style) */}
          <div className="flex rounded-full p-1 bg-slate-100 border border-[#BFDBFE] mb-6">
            <button
              onClick={() => setTab('signin')}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
                tab === 'signin'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#2563EB]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
                tab === 'signup'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#2563EB]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social Google Login */}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors mb-4 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-semibold">
              <span className="bg-white px-3 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Method Toggle: Email vs Phone OTP */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full border text-center transition-all ${
                authMethod === 'email'
                  ? 'border-[#2563EB] text-[#2563EB] bg-[#EFF6FF]'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              Email &amp; Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full border text-center transition-all ${
                authMethod === 'phone'
                  ? 'border-[#2563EB] text-[#2563EB] bg-[#EFF6FF]'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              Phone OTP (India)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMethod === 'email' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@example.com"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#BFDBFE] bg-white text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    {tab === 'signin' && (
                      <a href="#" className="text-xs font-semibold text-[#2563EB] hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#BFDBFE] bg-white text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number (10 digits)
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-[#BFDBFE] bg-slate-50 text-xs font-mono font-bold text-slate-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="9876543210"
                    className="w-full h-11 px-3 rounded-r-xl border border-[#BFDBFE] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-11 mt-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2563EB]/25 transition-all hover:scale-[1.01]"
            >
              <span>{tab === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            By continuing, you agree to SatPrep Terms of Service &amp; Privacy Policy.
          </p>
        </div>

        <div className="text-xs text-slate-400 text-center lg:text-left">
          © 2026 SatPrep. Dedicated Bank Exam Platform.
        </div>
      </div>

      {/* Right Column: Radiant Royal Blue & Ice White Brand Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#1D4ED8] text-white p-12 flex-col justify-between relative overflow-hidden bg-grid-pattern">
        {/* Soft Blue Glass Orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="flex justify-end relative z-10">
          <Link href="/" className="text-xs font-semibold text-blue-100 hover:text-white transition-colors bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-md">
            Back to Home
          </Link>
        </div>

        <div className="max-w-md my-auto space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-3xl font-extrabold text-white leading-tight">
            The standard for bank quant &amp; DI practice.
          </h2>

          <div className="space-y-4 text-sm">
            <div className="p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-lg">
              <div className="font-bold mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Server-Frozen Test Bundles</span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Tests are assembled and signed before you begin, giving you true sub-second exam simulation without lag.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-lg">
              <div className="font-bold mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Psychometric Error Diagnosis</span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Discover whether mark losses stem from calculation slips, speed traps, or conceptual missteps.
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs text-blue-200 font-mono relative z-10">
          SATPREP // BLUE &amp; WHITE SYSTEM // V1.1
        </div>
      </div>
    </div>
  );
}
