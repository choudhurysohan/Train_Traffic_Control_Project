import React from 'react';
import { Icons } from './Icons';

export function PerformanceView({ performance }) {
  const { throughputHourly, delayBySection, trackUtilization, waitingTimeBreakdown } = performance;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-2">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Icons.Performance />
          <span>Section Performance & Historical Throughput Analytics</span>
        </h2>
        <p className="text-xs text-slate-400">Quantitative charts illustrating throughput curves, delay distributions, and track loads</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">1. Train Throughput (Trains/Hour)</h4>
            <span className="text-[10px] text-cyan-400 font-mono">Peak: 22 at 14:00</span>
          </div>

          <div className="h-52 flex items-end justify-between gap-2 pt-8 pb-2 px-2 bg-slate-950/60 rounded-xl border border-slate-800">
            {throughputHourly.map((item, idx) => {
              const heightPct = (item.trains / 25) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    {item.trains}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all group-hover:from-cyan-500 group-hover:to-cyan-300"
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <span className="text-[9px] font-mono text-slate-400">{item.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">2. Average Delay by Sub-Corridor (Minutes)</h4>
            <span className="text-[10px] text-amber-400 font-mono">Max: North Loop (14.2m)</span>
          </div>

          <div className="space-y-3 pt-2">
            {delayBySection.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{sec.section}</span>
                  <span className="text-amber-400 font-mono font-bold">{sec.delay} min</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                    style={{ width: `${(sec.delay / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">3. Track Block Utilization (%)</h4>
            <span className="text-[10px] text-purple-400 font-mono">Avg: 81.8%</span>
          </div>

          <div className="space-y-3 pt-2">
            {trackUtilization.map((trk, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-mono">{trk.track}</span>
                  <span className="text-purple-400 font-mono font-bold">{trk.util}%</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${trk.util}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">4. Waiting Time Distribution</h4>
            <span className="text-[10px] text-emerald-400 font-mono">Total Trains: 24</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {waitingTimeBreakdown.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-400 block leading-tight">{item.category}</span>
                <span className="text-2xl font-black font-mono text-white mt-1 block">{item.count}</span>
                <span className="text-[10px] text-slate-500 font-mono">{Math.round((item.count/24)*100)}% of section fleet</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
