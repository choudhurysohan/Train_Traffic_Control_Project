import React, { useState } from 'react';
import { Icons, getStatusBadge } from './Icons';

export function AlertsView({ alerts }) {
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter(a => {
    if (filter === 'critical') return a.type === 'critical';
    if (filter === 'warning') return a.type === 'warning';
    if (filter === 'info') return a.type === 'info';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Icons.Alerts />
              <span>Central Railway Safety & Section Alerts</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                {alerts.length} RECORDED
              </span>
            </h2>
            <p className="text-xs text-slate-400">Critical precedence conflicts, speed restrictions, and automated signal logs</p>
          </div>

          <div className="flex items-center gap-2">
            {['all', 'critical', 'warning', 'info'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase font-mono transition-all ${
                  filter === f
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((alert) => {
            const badge = getStatusBadge(alert.type);
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl bg-slate-900/90 border ${badge.border} shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {alert.type}
                    </span>
                    <span className="text-sm font-bold text-white">{alert.title}</span>
                    <span className="text-xs text-slate-500 font-mono">• {alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300">{alert.description}</p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 font-mono">
                    <span>Affected Train: <strong className="text-cyan-300">{alert.trainId}</strong></span>
                    <span>•</span>
                    <span>Track Sector: <strong className="text-cyan-300">{alert.trackId}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
                    Acknowledge
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
