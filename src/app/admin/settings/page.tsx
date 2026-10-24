'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, Sliders, History } from 'lucide-react';

export default function AdminSettingsPage() {
  const [graceSeconds, setGraceSeconds] = useState<number>(3);
  const [calibrationThreshold, setCalibrationThreshold] = useState<number>(30);
  const [autoFlagThreshold, setAutoFlagThreshold] = useState<number>(3);
  const [testValidityDays, setTestValidityDays] = useState<number>(7);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const auditLogs = [
    {
      id: 'aud-301',
      actor: 'Aditya (Super Admin)',
      action: 'REGRADE_QUESTION',
      entity: 'question_keys/q-profit-1',
      details: 'Correct key updated from b -> c. 4 attempts recomputed.',
      time: '12 mins ago',
      ip: '103.21.24.11',
    },
    {
      id: 'aud-300',
      actor: 'System Scheduler',
      action: 'AUTO_TOPUP_DISPATCH',
      entity: 'generation_jobs/job-101',
      details: 'Dispatched 20 parametric quadratic items. Stock healthy.',
      time: '2 hours ago',
      ip: '127.0.0.1',
    },
    {
      id: 'aud-299',
      actor: 'Pooja (Reviewer)',
      action: 'APPROVE_QUESTION',
      entity: 'questions/q-work-1',
      details: 'Approved to live status after sandbox verification.',
      time: '5 hours ago',
      ip: '157.34.12.89',
    },
  ];

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#212835] dark:text-white">
          System Settings &amp; Immutable Audit Log
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Global psychometric calibration parameters, timer skew grace windows, and tamper-proof admin audit trail.
        </p>
      </div>

      {/* Global Test Rules Configuration (PRD Section 9.11) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-[#212835] dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#2D6BCB]" />
          <span>Global Timing &amp; Calibration Rules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">
              Timer Skew Grace Window (Seconds)
            </label>
            <input
              type="number"
              value={graceSeconds}
              onChange={(e) => setGraceSeconds(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Late submissions beyond this window are discarded to prevent client clock manipulation.
            </span>
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Empirical Calibration Threshold (Attempts)
            </label>
            <input
              type="number"
              value={calibrationThreshold}
              onChange={(e) => setCalibrationThreshold(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Empirical difficulty rating overrides assigned difficulty after this attempt volume.
            </span>
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Auto-Flag Report Threshold
            </label>
            <input
              type="number"
              value={autoFlagThreshold}
              onChange={(e) => setAutoFlagThreshold(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              A question moves to flagged status and out of tests when report count reaches this threshold.
            </span>
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Ready Test Expiration (Days)
            </label>
            <input
              type="number"
              value={testValidityDays}
              onChange={(e) => setTestValidityDays(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#0E1117] font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Assembled tests ready for longer than this duration without starting are auto-expired.
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2 rounded-xl bg-[#2D6BCB] hover:bg-[#2458AD] text-white font-bold text-xs shadow-sm"
          >
            {saveSuccess ? '✓ Settings Saved' : 'Save Global Settings'}
          </button>
        </div>
      </div>

      {/* IMMUTABLE AUDIT LOG (PRD Section 9.11) */}
      <div className="rounded-2xl bg-white dark:bg-[#151A23] border border-[#DDE4EE] dark:border-[#2E3746] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#DDE4EE] dark:border-[#2E3746] flex items-center justify-between">
          <span className="font-bold text-xs flex items-center gap-2">
            <History className="w-4 h-4 text-[#2D6BCB]" />
            <span>Immutable Administrative Audit Trail</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">APPEND-ONLY SECURE STORE</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DDE4EE] dark:border-[#2E3746] bg-slate-50 dark:bg-[#1B212C] text-slate-400 uppercase text-[10px]">
              <th className="p-3">Timestamp</th>
              <th className="p-3">Actor</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target Entity</th>
              <th className="p-3">Details</th>
              <th className="p-3 text-right">Source IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE4EE] dark:divide-[#2E3746]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1B212C]/50">
                <td className="p-3 font-mono text-slate-400">{log.time}</td>
                <td className="p-3 font-semibold">{log.actor}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#DCE8F8] dark:bg-[#2D6BCB]/20 text-[#2D6BCB]">
                    {log.action}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-500 text-[11px]">{log.entity}</td>
                <td className="p-3 text-slate-600 dark:text-slate-300">{log.details}</td>
                <td className="p-3 font-mono text-slate-400 text-right">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
