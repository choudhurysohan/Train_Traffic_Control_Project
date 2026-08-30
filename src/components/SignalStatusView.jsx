import React from 'react';
import { Icons } from './Icons';

export function SignalStatusView({ signals }) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Icons.Signal />
              <span>Railway Signal Interlocking & Aspect Status</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                SOLID STATE INTERLOCKING (SSI)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              3-Aspect & 4-Aspect automated signaling status across active line sections
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-900 p-2 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">● GREEN: Clear</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">● YELLOW: Caution</span>
            <span className="flex items-center gap-1 text-rose-400 font-bold">● RED: Stop/Danger</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/90">
          <table className="w-full text-left text-xs bg-[#090e1a]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono">
                <th className="py-3.5 pl-4">SIGNAL ID</th>
                <th className="py-3.5 px-3">LOCATION</th>
                <th className="py-3.5 px-3 text-center">SIGNAL STATUS (ASPECT)</th>
                <th className="py-3.5 px-3">TRACK</th>
                <th className="py-3.5 px-3">TRAIN IN SECTION</th>
                <th className="py-3.5 pr-4">INTERLOCKING MODE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {signals.map((sig) => {
                const isGreen = sig.status === 'GREEN';
                const isYellow = sig.status === 'YELLOW';
                const isRed = sig.status === 'RED';

                return (
                  <tr key={sig.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-4 font-mono font-bold text-cyan-400">{sig.id}</td>
                    <td className="py-3 px-3 text-slate-200 font-medium">{sig.location}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-12 bg-black rounded-full border border-slate-700 flex flex-col items-center justify-around py-1 shadow-md">
                          <span className={`w-2.5 h-2.5 rounded-full ${isRed ? 'bg-rose-500 shadow-md shadow-rose-500/80' : 'bg-slate-800'}`}></span>
                          <span className={`w-2.5 h-2.5 rounded-full ${isYellow ? 'bg-amber-400 shadow-md shadow-amber-400/80' : 'bg-slate-800'}`}></span>
                          <span className={`w-2.5 h-2.5 rounded-full ${isGreen ? 'bg-emerald-400 shadow-md shadow-emerald-400/80' : 'bg-slate-800'}`}></span>
                        </div>
                        <span className={`font-mono font-bold text-xs ${isGreen ? 'text-emerald-400' : isYellow ? 'text-amber-400' : 'text-rose-400'}`}>
                          {sig.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{sig.track}</td>
                    <td className="py-3 px-3 font-semibold text-white">{sig.train}</td>
                    <td className="py-3 pr-4 text-slate-400 font-mono text-[11px]">{sig.interlocking}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
