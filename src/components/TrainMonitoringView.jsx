import React, { useState, useMemo } from 'react';
import { Icons, getStatusBadge } from './Icons';

export function TrainMonitoringView({ trains, searchQuery, setSelectedTrain }) {
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredTrains = useMemo(() => {
    return trains.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.track.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'All' || t.category.includes(filterCategory);
      return matchSearch && matchCat;
    });
  }, [trains, searchQuery, filterCategory]);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Icons.Train />
              <span>Real-Time Train Monitoring Dashboard</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                {filteredTrains.length} TRAINS ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">Live monitoring of speeds, tracks, route schedules, and delay variances</p>
          </div>

          <div className="flex items-center gap-2">
            {['All', 'Superfast', 'Express', 'Freight', 'Inspection'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/90">
          <table className="w-full text-left text-xs bg-[#090e1a]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono">
                <th className="py-3.5 pl-4">TRAIN ID</th>
                <th className="py-3.5 px-3">TRAIN NAME</th>
                <th className="py-3.5 px-3">SOURCE</th>
                <th className="py-3.5 px-3">DESTINATION</th>
                <th className="py-3.5 px-3">SPEED</th>
                <th className="py-3.5 px-3">TRACK</th>
                <th className="py-3.5 px-3">DELAY</th>
                <th className="py-3.5 px-3">STATUS</th>
                <th className="py-3.5 pr-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTrains.map((train) => {
                const badge = getStatusBadge(train.status);
                return (
                  <tr key={train.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-4 font-mono font-bold text-cyan-400">
                      <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">
                        {train.id}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{train.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{train.category} • Priority: {train.priority}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{train.source}</td>
                    <td className="py-3 px-3 text-slate-300">{train.destination}</td>
                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{train.speed} km/h</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400"
                            style={{ width: `${Math.min(100, (train.speed / train.maxSpeed) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-300">{train.track}</td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={train.delay === 0 ? 'text-emerald-400' : train.delay > 20 ? 'text-rose-400' : 'text-amber-400'}>
                        {train.delay === 0 ? 'ON TIME' : `+${train.delay} min`}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {train.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <button
                        onClick={() => setSelectedTrain(train)}
                        className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-semibold transition-all"
                      >
                        Details
                      </button>
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
