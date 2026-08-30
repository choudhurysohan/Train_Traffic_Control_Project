import React from 'react';
import { Icons, getStatusBadge } from './Icons';

export function TrainScheduleView({ schedule }) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Icons.Schedule />
              <span>Central Train Schedule & Platform Timetable</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                TODAY'S DISPATCH
              </span>
            </h2>
            <p className="text-xs text-slate-400">Timetable slots, arrival/departure margins, and platform routing</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/90">
          <table className="w-full text-left text-xs bg-[#090e1a]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono">
                <th className="py-3.5 pl-4">TRAIN ID</th>
                <th className="py-3.5 px-3">TRAIN NAME</th>
                <th className="py-3.5 px-3">ARRIVAL</th>
                <th className="py-3.5 px-3">DEPARTURE</th>
                <th className="py-3.5 px-3">PLATFORM</th>
                <th className="py-3.5 px-3">DELAY</th>
                <th className="py-3.5 pr-4">OPERATIONAL STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {schedule.map((item, idx) => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pl-4 font-mono font-bold text-cyan-400">{item.trainId}</td>
                    <td className="py-3.5 px-3 font-semibold text-white">{item.trainName}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-200">{item.arrival}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-200">{item.departure}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono font-bold text-[11px]">
                        {item.platform}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold">
                      <span className={item.delay === '+0 min' ? 'text-emerald-400' : 'text-amber-400'}>
                        {item.delay}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {item.status}
                      </span>
                    </td>
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
