'use client';

import React, { useState } from 'react';
import {
  Settings,
  History,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Database,
  Lock,
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
      action: 'APPROVE_QUESTION',
      entity: 'q-profit-1',
      details: 'Pushed question to live pool with version 2',
      ip: '10.0.4.12',
    },
    {
      id: 'aud-1091',
      time: '2026-10-24 13:15:44',
      actor: 'system_cron',
      action: 'RECALIBRATE_ITEM',
      entity: 'q-quad-2',
      details: 'Adjusted empirical difficulty from 2.8 to 3.2 based on 64 attempts',
      ip: '127.0.0.1',
    },
    {
      id: 'aud-1090',
      time: '2026-10-24 11:02:18',
      actor: 'admin@satprep.internal',
      action: 'EXECUTE_REGRADE',
      entity: 'q-ts-3',
      details: 'Correct key updated from b to d. 14 attempts recalculated.',
      ip: '10.0.4.12',
    },
  ]);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System Governance &amp; Controls</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          System Settings &amp; Immutable Audit Log
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Global psychometric calibration parameters, timer skew grace windows, and tamper-proof admin audit trail.
        </p>
      </div>

      {/* Global Test Rules Configuration (PRD Section 9.11) */}
      <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Global Timing &amp; Calibration Rules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Timer Skew Grace Window (Seconds)
            </label>
            <input
              type="number"
              value={graceSeconds}
              onChange={(e) => setGraceSeconds(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Late submissions beyond this window are discarded to prevent client clock manipulation.
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Empirical Calibration Threshold (Attempts)
            </label>
            <input
              type="number"
              value={calibrationThreshold}
              onChange={(e) => setCalibrationThreshold(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Empirical difficulty rating overrides assigned difficulty after this attempt volume.
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Auto-Flag Report Threshold
            </label>
            <input
              type="number"
              value={autoFlagThreshold}
              onChange={(e) => setAutoFlagThreshold(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              A question moves to flagged status and out of tests when report count reaches this threshold.
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Ready Test Expiration (Days)
            </label>
            <input
              type="number"
              value={testValidityDays}
              onChange={(e) => setTestValidityDays(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Assembled tests ready for longer than this duration without starting are auto-expired.
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center gap-1.5"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Settings Saved</span>
              </>
            ) : (
              'Save Global Settings'
            )}
          </button>
        </div>
      </div>

      {/* IMMUTABLE AUDIT LOG (PRD Section 9.11) */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100 overflow-hidden shadow-xs">
        <div className="p-4 px-6 border-b border-blue-100 bg-blue-50/30 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <span>Immutable Administrative Audit Trail</span>
          </span>
          <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            APPEND-ONLY SECURE STORE
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-blue-100 bg-blue-50/50 text-slate-500 uppercase text-[10px] font-bold">
              <th className="p-3.5 pl-6">Timestamp</th>
              <th className="p-3.5">Actor</th>
              <th className="p-3.5">Action</th>
              <th className="p-3.5">Target Entity</th>
              <th className="p-3.5">Details</th>
              <th className="p-3.5 pr-6 text-right">Source IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="p-3.5 pl-6 font-mono text-slate-400">{log.time}</td>
                <td className="p-3.5 font-semibold text-slate-800">{log.actor}</td>
                <td className="p-3.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-100">
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
