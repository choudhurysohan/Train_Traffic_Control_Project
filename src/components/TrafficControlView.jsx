import React from 'react';
import { Icons } from './Icons';

export function TrafficControlView({ traffic }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Traffic Density</div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">{traffic.densityPct}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Optimal Section Capacity</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Track Utilization</div>
          <div className="text-2xl font-black font-mono text-purple-400 mt-1">{traffic.utilizationPct}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Active corridor load</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Average Delay</div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">{traffic.avgDelayMin}m</div>
          <div className="text-[10px] text-slate-500 mt-1">Target: &lt; 5.0m</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Safe Headway</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{traffic.headwayMin}m</div>
          <div className="text-[10px] text-slate-500 mt-1">Spacing between trains</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Congestion Level</div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1">{traffic.congestionLevel}</div>
          <div className="text-[10px] text-slate-500 mt-1">Section flow index</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icons.Traffic />
              <span>Section Bottleneck Resolutions</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
              {traffic.bottlenecks.length} DETECTED
            </span>
          </div>

          <div className="space-y-3">
            {traffic.bottlenecks.map((b, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">{b.section}</span>
                  <span className="text-[10px] text-rose-400 font-mono font-bold">HIGH PRIORITY</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong className="text-slate-400">Root Cause:</strong> {b.cause}
                </p>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-400">Section Impact:</strong> {b.impact}
                </p>
                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200">
                  <span className="font-bold text-cyan-300">Throughput Optimization: </span>
                  {b.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icons.Performance />
            <span>Section Optimization Insights (Throughput Multipliers)</span>
          </h3>

          <div className="space-y-3">
            {traffic.optimizationTips.map((tip, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/40 text-xs text-blue-200">
            <div className="font-bold text-blue-300 mb-1">Theoretical Maximum Throughput: 24 Trains / Hour</div>
            <div>Current Section Rate: <strong>18.6 Trains / Hour</strong>. Optimization headroom remaining: <strong>+22.5%</strong>.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
