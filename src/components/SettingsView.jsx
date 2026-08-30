import React from 'react';
import { Icons } from './Icons';

export function SettingsView({ projectInfo }) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Icons.Settings />
            <span>Control Room & Project Configuration</span>
          </h2>
          <p className="text-xs text-slate-400">Settings and parameter definitions for college major project demonstration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white uppercase font-mono text-[11px] text-cyan-400">Project Metadata</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Project Title:</span>
                <span className="text-white font-semibold">{projectInfo.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Scope / Theme:</span>
                <span className="text-cyan-300">{projectInfo.subtitle}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Monitored Corridor:</span>
                <span className="text-slate-200">{projectInfo.sectionName}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">System Build:</span>
                <span className="text-emerald-400 font-mono">{projectInfo.version}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white uppercase font-mono text-[11px] text-cyan-400">Display Parameters</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Theme Mode:</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold">Dark Control Room</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Data Source Mode:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold">Static / Decoupled Data</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Clock Sync:</span>
                <span className="text-slate-300 font-mono">Realtime Local (1 sec tick)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Backend Ready:</span>
                <span className="text-cyan-400 font-mono font-bold">Yes (Clean API Hook Points)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
