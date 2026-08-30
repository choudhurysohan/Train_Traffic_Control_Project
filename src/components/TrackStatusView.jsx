import React from 'react';
import { Icons, getStatusBadge } from './Icons';

export function TrackStatusView({ tracks }) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Icons.Track />
              <span>Railway Track Section Status & Block Capacity</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                8 BLOCKS MONITORED
              </span>
            </h2>
            <p className="text-xs text-slate-400">Track occupancy states, switch positions, and line capacity load</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tracks.map((trk) => {
            const badge = getStatusBadge(trk.health);
            return (
              <div
                key={trk.id}
                className={`p-4 rounded-xl bg-slate-900/90 border ${badge.border} shadow-lg space-y-3 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono font-bold text-xs border border-slate-700">
                    {trk.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {trk.occupied ? 'OCCUPIED' : 'AVAILABLE'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">{trk.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Length: {trk.lengthKm} KM • Limit: {trk.speedLimit} km/h</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Current Train:</span>
                    <span className="text-slate-200 font-mono font-semibold">{trk.currentTrain}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Interlocking:</span>
                    <span className="text-slate-300 font-mono text-[10px]">{trk.interlocking}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>Section Load Utilization</span>
                    <span className="text-white font-bold">{trk.utilization}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${trk.utilization > 90 ? 'bg-rose-500' : trk.utilization > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${trk.utilization}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800 flex justify-between">
                  <span>Status:</span>
                  <span className={badge.text}>{trk.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
