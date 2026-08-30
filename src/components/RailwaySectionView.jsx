import React, { useState } from 'react';
import { Icons } from './Icons';

export function RailwaySectionView({ trains, signals, setSelectedTrain }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Icons.Track />
              <span>Railway Section Throughput Visualization</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                INTERACTIVE SCHEMATIC
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Corridor Topology: Stations, Track Lines, Signals, Block Occupancies & Directional Flow
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono mr-1">Status Legend:</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Green = Normal
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Yellow = Warning
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> Red = Critical
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Blue = Active
            </span>
          </div>
        </div>

        <div className="mt-6 bg-[#060a12] p-6 rounded-xl border border-slate-800/90 overflow-x-auto relative shadow-inner">
          <div className="min-w-[950px] relative">
            
            <div className="grid grid-cols-4 gap-4 mb-4 text-center font-mono">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-cyan-400 font-bold">STATION 01 (WEST)</div>
                <div className="text-xs font-bold text-white">Varanasi Cantt (BSB)</div>
                <div className="text-[9px] text-slate-500">KM 00.0 • PF 1-4</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-cyan-400 font-bold">STATION 02 (JUNCTION)</div>
                <div className="text-xs font-bold text-white">Central Junction Cabin</div>
                <div className="text-[9px] text-slate-500">KM 14.5 • Switches & Loops</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-cyan-400 font-bold">STATION 03 (HALT)</div>
                <div className="text-xs font-bold text-white">Riverside Sector Halt</div>
                <div className="text-[9px] text-slate-500">KM 22.0 • Auto-Signals</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-cyan-400 font-bold">STATION 04 (EAST YARD)</div>
                <div className="text-xs font-bold text-white">East Freight Terminal</div>
                <div className="text-[9px] text-slate-500">KM 32.0 • Siding & Yard</div>
              </div>
            </div>

            <svg className="w-full h-80 select-none" viewBox="0 0 950 320">
              <defs>
                <linearGradient id="upLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8"/>
                </linearGradient>
                <linearGradient id="dnLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8"/>
                </linearGradient>
              </defs>

              <g stroke="#1e293b" strokeWidth="1" strokeDasharray="3,6" opacity="0.6">
                <line x1="237" y1="20" x2="237" y2="300" />
                <line x1="475" y1="20" x2="475" y2="300" />
                <line x1="712" y1="20" x2="712" y2="300" />
              </g>

              <g>
                <line x1="50" y1="80" x2="900" y2="80" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                <line x1="50" y1="80" x2="900" y2="80" stroke="url(#upLineGrad)" strokeWidth="3" strokeLinecap="round" />
                <text x="55" y="70" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  TRACK 1: UP MAIN LINE ◄ (Westbound Direction)
                </text>
              </g>

              <g>
                <line x1="50" y1="160" x2="900" y2="160" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                <line x1="50" y1="160" x2="900" y2="160" stroke="url(#dnLineGrad)" strokeWidth="3" strokeLinecap="round" />
                <text x="55" y="150" fill="#a855f7" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  TRACK 2: DN MAIN LINE ► (Eastbound Direction)
                </text>
              </g>

              <g>
                <path d="M 280 80 Q 320 30 360 30 L 600 30 Q 640 30 680 80" fill="none" stroke="#eab308" strokeWidth="2.5" strokeDasharray="5,3" />
                <text x="380" y="24" fill="#eab308" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                  TRACK 3: LOOP LINE 1 (Precedence Siding)
                </text>
              </g>

              <g>
                <path d="M 300 160 Q 340 220 380 220 L 580 220 Q 620 220 660 160" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,3" />
                <text x="390" y="235" fill="#f43f5e" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                  TRACK 4: LOOP LINE 2 (Holding Siding)
                </text>
              </g>

              <g>
                <line x1="200" y1="80" x2="260" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
                <line x1="720" y1="160" x2="780" y2="80" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
                <path d="M 680 160 Q 720 270 760 270 L 900 270" fill="none" stroke="#0ea5e9" strokeWidth="2" />
                <text x="770" y="285" fill="#0ea5e9" fontSize="9" fontFamily="JetBrains Mono">
                  TRACK 7: East Yard Shunting Lead
                </text>
              </g>

              <g transform="translate(180, 52)">
                <rect x="0" y="0" width="12" height="24" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="3" fill="#10b981" />
                <circle cx="6" cy="18" r="2.5" fill="#334155" />
                <text x="16" y="16" fill="#10b981" fontSize="8" fontFamily="JetBrains Mono">SIG-101A [GRN]</text>
              </g>

              <g transform="translate(180, 168)">
                <rect x="0" y="0" width="12" height="24" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="3" fill="#10b981" />
                <circle cx="6" cy="18" r="2.5" fill="#334155" />
                <text x="16" y="16" fill="#10b981" fontSize="8" fontFamily="JetBrains Mono">SIG-201A [GRN]</text>
              </g>

              <g transform="translate(620, 10)">
                <rect x="0" y="0" width="12" height="24" rx="3" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="3" fill="#ef4444" />
                <circle cx="6" cy="18" r="2.5" fill="#334155" />
                <text x="16" y="16" fill="#ef4444" fontSize="8" fontFamily="JetBrains Mono">SIG-301C [RED]</text>
              </g>

              <g transform="translate(500, 168)">
                <rect x="0" y="0" width="12" height="24" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="2.5" fill="#334155" />
                <circle cx="6" cy="18" r="3" fill="#f59e0b" />
                <text x="16" y="16" fill="#f59e0b" fontSize="8" fontFamily="JetBrains Mono">SIG-203B [YEL]</text>
              </g>

              <g
                transform="translate(110, 62)"
                className="cursor-pointer"
                onClick={() => setSelectedTrain(trains[0])}
                onMouseEnter={() => setHoveredNode(trains[0])}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect x="0" y="0" width="110" height="34" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                <text x="8" y="15" fill="#a7f3d0" fontSize="9" fontWeight="bold">🚆 TR-12401</text>
                <text x="8" y="27" fill="#ecfdf5" fontSize="8" fontFamily="JetBrains Mono">130 km/h ◄ (Normal)</text>
                <circle cx="100" cy="17" r="4" fill="#10b981" />
              </g>

              <g
                transform="translate(480, 62)"
                className="cursor-pointer"
                onClick={() => setSelectedTrain(trains[1])}
                onMouseEnter={() => setHoveredNode(trains[1])}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect x="0" y="0" width="115" height="34" rx="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                <text x="8" y="15" fill="#bfdbfe" fontSize="9" fontWeight="bold">🚆 TR-12309</text>
                <text x="8" y="27" fill="#ffffff" fontSize="8" fontFamily="JetBrains Mono">115 km/h ◄ (Active)</text>
                <circle cx="105" cy="17" r="4" fill="#3b82f6" />
              </g>

              <g
                transform="translate(320, 142)"
                className="cursor-pointer"
                onClick={() => setSelectedTrain(trains[2])}
                onMouseEnter={() => setHoveredNode(trains[2])}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect x="0" y="0" width="115" height="34" rx="8" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
                <text x="8" y="15" fill="#fde68a" fontSize="9" fontWeight="bold">🚆 TR-12560</text>
                <text x="8" y="27" fill="#ffffff" fontSize="8" fontFamily="JetBrains Mono">95 km/h ► (+14m)</text>
                <circle cx="105" cy="17" r="4" fill="#f59e0b" />
              </g>

              <g
                transform="translate(430, 12)"
                className="cursor-pointer"
                onClick={() => setSelectedTrain(trains[3])}
                onMouseEnter={() => setHoveredNode(trains[3])}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect x="0" y="0" width="120" height="34" rx="8" fill="#881337" stroke="#ef4444" strokeWidth="2" />
                <text x="8" y="15" fill="#fecdd3" fontSize="9" fontWeight="bold">🛑 FRT-9042</text>
                <text x="8" y="27" fill="#ffffff" fontSize="8" fontFamily="JetBrains Mono">0 km/h [HELD]</text>
                <circle cx="110" cy="17" r="4" fill="#ef4444" />
              </g>

              <g
                transform="translate(730, 142)"
                className="cursor-pointer"
                onClick={() => setSelectedTrain(trains[6])}
                onMouseEnter={() => setHoveredNode(trains[6])}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect x="0" y="0" width="115" height="34" rx="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                <text x="8" y="15" fill="#bfdbfe" fontSize="9" fontWeight="bold">🚆 TR-22436</text>
                <text x="8" y="27" fill="#ffffff" fontSize="8" fontFamily="JetBrains Mono">125 km/h ► (Active)</text>
                <circle cx="105" cy="17" r="4" fill="#3b82f6" />
              </g>

              <g
                transform="translate(770, 252)"
                className="cursor-pointer"
                onClick={() => setSelectedTrain(trains[7])}
                onMouseEnter={() => setHoveredNode(trains[7])}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect x="0" y="0" width="110" height="32" rx="6" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
                <text x="8" y="14" fill="#7dd3fc" fontSize="8" fontWeight="bold">🔧 LOC-0044</text>
                <text x="8" y="25" fill="#e2e8f0" fontSize="8" fontFamily="JetBrains Mono">Inspection Spur</text>
              </g>
            </svg>
          </div>

          <div className="mt-4 p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">💡 Interactivity:</span>
              <span className="text-slate-300">
                Click any train block on the railway schematic to inspect speed telemetry, safe headway margins, and track block assignments.
              </span>
            </div>
            {hoveredNode && (
              <span className="text-emerald-400 font-mono font-semibold">
                Target: {hoveredNode.name} ({hoveredNode.id})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
