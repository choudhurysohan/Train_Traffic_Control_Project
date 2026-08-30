import React from 'react';
import { Icons, getStatusBadge } from './Icons';

export function DashboardView({ data, setCurrentTab, setSelectedTrain }) {
  const { metrics, trains, alerts } = data;

  const cardData = [
    { title: "Total Trains", value: metrics.totalTrains, sub: "In Active Section", icon: "🚆", color: "from-blue-600/20 to-blue-500/5", border: "border-blue-500/30", text: "text-blue-400" },
    { title: "Active Trains", value: metrics.activeTrains, sub: "Moving on Mainlines", icon: "⚡", color: "from-cyan-600/20 to-cyan-500/5", border: "border-cyan-500/30", text: "text-cyan-400" },
    { title: "Delayed Trains", value: metrics.delayedTrains, sub: "Exceeding +5 min", icon: "⚠️", color: "from-amber-600/20 to-amber-500/5", border: "border-amber-500/30", text: "text-amber-400" },
    { title: "On-Time Trains", value: metrics.onTimeTrains, sub: "Punctuality 71.4%", icon: "✅", color: "from-emerald-600/20 to-emerald-500/5", border: "border-emerald-500/30", text: "text-emerald-400" },
    { title: "Track Utilization", value: `${metrics.trackUtilization}%`, sub: "High Efficiency Band", icon: "📊", color: "from-purple-600/20 to-purple-500/5", border: "border-purple-500/30", text: "text-purple-400" },
    { title: "Section Throughput", value: `${metrics.sectionThroughput}`, sub: "Trains / Hour Rate", icon: "🚀", color: "from-teal-600/20 to-teal-500/5", border: "border-teal-500/30", text: "text-teal-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0e172e] via-[#0f1d3d] to-[#0c1426] border border-cyan-900/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Live Section Feed
              </span>
              <span className="text-xs text-slate-400">Throughput Optimization Engine Active</span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Section Master Console: Western Main Corridor
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Automated conflict detection and precedence management enabled. Real-time section optimization is maintaining safe 4.5 min headway spacing across all blocks.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentTab('section')}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
            >
              <Icons.Track />
              <span>Open Track Visualizer</span>
            </button>
            <button
              onClick={() => setCurrentTab('traffic_control')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Traffic Control
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cardData.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-gradient-to-b ${card.color} bg-slate-900/90 border ${card.border} shadow-lg transition-transform hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">{card.title}</span>
              <span className="text-base">{card.icon}</span>
            </div>
            <div className={`text-2xl font-black font-mono tracking-tight ${card.text}`}>
              {card.value}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Corridor Snapshot (Active Blocks)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-glow"></span>
              </h3>
              <p className="text-xs text-slate-400">Live schematic of track occupancies and train movements</p>
            </div>
            <button
              onClick={() => setCurrentTab('section')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Full View →
            </button>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-6">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span className="text-cyan-400 font-bold">Track 1 [UP MAIN - Westbound]</span>
                <span>Speed: 130 km/h Limit</span>
              </div>
              <div className="h-4 bg-slate-900 rounded-full border border-slate-800 relative flex items-center px-2">
                <div className="absolute left-[15%] px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-bold shadow-md shadow-emerald-500/30 flex items-center gap-1">
                  <span>🚆 TR-12401</span>
                </div>
                <div className="absolute left-[70%] px-2 py-0.5 rounded bg-blue-500 text-white text-[9px] font-bold shadow-md shadow-blue-500/30 flex items-center gap-1">
                  <span>🚆 TR-12309</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span className="text-cyan-400 font-bold">Track 2 [DN MAIN - Eastbound]</span>
                <span>Speed: 130 km/h Limit</span>
              </div>
              <div className="h-4 bg-slate-900 rounded-full border border-slate-800 relative flex items-center px-2">
                <div className="absolute left-[35%] px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-bold shadow-md shadow-amber-500/30 flex items-center gap-1">
                  <span>🚆 TR-12560 (+14m)</span>
                </div>
                <div className="absolute left-[85%] px-2 py-0.5 rounded bg-blue-500 text-white text-[9px] font-bold shadow-md shadow-blue-500/30 flex items-center gap-1">
                  <span>🚆 TR-22436</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span className="text-amber-400 font-bold">Track 3 [LOOP 1 - Precedence Siding]</span>
                <span className="text-rose-400 font-bold">Signal SIG-301C: RED (Halt)</span>
              </div>
              <div className="h-4 bg-slate-900 rounded-full border border-slate-800 relative flex items-center px-2">
                <div className="absolute left-[50%] px-2 py-0.5 rounded bg-rose-500 text-white text-[9px] font-bold shadow-md shadow-rose-500/30 flex items-center gap-1">
                  <span>🛑 FRT-9042 (Held)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300 font-medium">Green = Normal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-300 font-medium">Yellow = Warning</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-300 font-medium">Red = Critical</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-300 font-medium">Blue = Active</span>
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Icons.Alerts />
                <span>Active Section Alerts</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
                {alerts.length} Registered
              </span>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 3).map((a) => {
                const badge = getStatusBadge(a.type);
                return (
                  <div
                    key={a.id}
                    className={`p-3 rounded-xl bg-slate-900/90 border ${badge.border} transition-all hover:bg-slate-850`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${badge.text}`}>{a.title}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{a.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">{a.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
                      <span className="px-1.5 py-0.5 bg-slate-800 rounded">{a.trainId}</span>
                      <span className="px-1.5 py-0.5 bg-slate-800 rounded">{a.trackId}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('alerts')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 text-center transition-all"
          >
            Open Full Alert Manager →
          </button>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icons.Train />
              <span>Monitored Train Fleet (Top Active)</span>
            </h3>
            <p className="text-xs text-slate-400">Real-time status overview of priority trains in section</p>
          </div>
          <button
            onClick={() => setCurrentTab('monitoring')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            View All {trains.length} Trains →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-3 pl-2">TRAIN ID</th>
                <th className="pb-3">TRAIN NAME</th>
                <th className="pb-3">ROUTE</th>
                <th className="pb-3">SPEED</th>
                <th className="pb-3">TRACK</th>
                <th className="pb-3">DELAY</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 pr-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trains.slice(0, 5).map((train) => {
                const badge = getStatusBadge(train.status);
                return (
                  <tr key={train.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 pl-2 font-mono font-bold text-cyan-400">{train.id}</td>
                    <td className="py-3 font-semibold text-white">{train.name}</td>
                    <td className="py-3 text-slate-300">{train.source} → {train.destination}</td>
                    <td className="py-3 font-mono font-bold text-slate-200">
                      <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                        {train.speed} km/h
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-mono">{train.track}</td>
                    <td className="py-3 font-mono font-bold">
                      <span className={train.delay === 0 ? 'text-emerald-400' : train.delay > 20 ? 'text-rose-400' : 'text-amber-400'}>
                        {train.delay === 0 ? '0m' : `+${train.delay}m`}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {train.status}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={() => setSelectedTrain(train)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 rounded font-semibold text-[11px] transition-all"
                      >
                        Inspect
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
