'use client';

import React, { useState } from 'react';
import {
  Settings,
  History,
  Sliders,
  Check,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [graceSeconds, setGraceSeconds] = useState<number>(30);
  const [calibrationThreshold, setCalibrationThreshold] = useState<number>(50);
  const [autoFlagThreshold, setAutoFlagThreshold] = useState<number>(3);
  const [testValidityDays, setTestValidityDays] = useState<number>(7);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const [auditLogs] = useState<any[]>([
    {
      id: 'aud-1092',
      time: '2026-10-24 14:32:01',
      actor: 'admin@satprep.internal',
      action: 'Approved Question',
      entity: 'q-profit-1',
      details: 'Published question to live questions with updated solution',
      ip: 'Admin Portal',
    },
    {
      id: 'aud-1091',
      time: '2026-10-24 13:15:44',
      actor: 'System Auto-Updater',
      action: 'Adjusted Difficulty',
      entity: 'q-quad-2',
      details: 'Adjusted difficulty rating from Level 2 to Level 3 based on 64 student attempts',
      ip: 'Automated Task',
    },
    {
      id: 'aud-1090',
      time: '2026-10-24 11:02:18',
      actor: 'admin@satprep.internal',
      action: 'Updated Answer Key',
      entity: 'q-ts-3',
      details: 'Correct answer changed from B to D. 14 student test results recalculated.',
      ip: 'Admin Portal',
    },
  ]);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Platform Settings &amp; Activity History
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure test submission allowances, question difficulty adjustments, and review recent administrator actions.
        </p>
      </div>

      {/* Global Test Rules Configuration */}
      <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Test Rules &amp; Automation</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Timer Submission Buffer (Seconds)
            </label>
            <input
              type="number"
              value={graceSeconds}
              onChange={(e) => setGraceSeconds(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Buffer allowed for network delay when student tests are submitted at the last second.
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Automatic Difficulty Adjustment (Student Attempts)
            </label>
            <input
              type="number"
              value={calibrationThreshold}
              onChange={(e) => setCalibrationThreshold(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Automatically refine difficulty rating once attempted by this many students.
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Auto-Pause Threshold (Student Reports)
            </label>
            <input
              type="number"
              value={autoFlagThreshold}
              onChange={(e) => setAutoFlagThreshold(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Questions receiving this many student reports are automatically paused from tests for review.
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Unstarted Test Expiration (Days)
            </label>
            <input
              type="number"
              value={testValidityDays}
              onChange={(e) => setTestValidityDays(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Draft tests generated but not started within this period will expire.
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Settings Saved</span>
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>

      {/* ACTIVITY LOG */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 overflow-hidden shadow-xs">
        <div className="p-4 px-6 border-b border-blue-100 bg-blue-50/30 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <span>Recent Administrative Activity</span>
          </span>
          <span className="text-[10px] text-blue-700 font-medium bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Verified Action History
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-blue-100 bg-blue-50/50 text-slate-500 uppercase text-[10px] font-bold">
              <th className="p-3.5 pl-6">Date &amp; Time</th>
              <th className="p-3.5">Administrator</th>
              <th className="p-3.5">Action</th>
              <th className="p-3.5">Target Question</th>
              <th className="p-3.5">Details</th>
              <th className="p-3.5 pr-6 text-right">Channel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="p-3.5 pl-6 font-mono text-slate-400">{log.time}</td>
                <td className="p-3.5 font-semibold text-slate-800">{log.actor}</td>
                <td className="p-3.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {log.action}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-blue-600 text-[11px] font-medium">{log.entity}</td>
                <td className="p-3.5 text-slate-600">{log.details}</td>
                <td className="p-3.5 pr-6 font-mono text-slate-400 text-right">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
