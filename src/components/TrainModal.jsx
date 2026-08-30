import React from 'react';
import { Icons } from './Icons';

export function TrainModal({ selectedTrain, onClose }) {
  if (!selectedTrain) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Icons.Train />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">{selectedTrain.name}</h3>
              <span className="text-xs text-cyan-400 font-mono font-semibold">{selectedTrain.id} • {selectedTrain.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">Current Speed</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{selectedTrain.speed} km/h</span>
              <span className="text-[10px] text-slate-500 block">Max Limit: {selectedTrain.maxSpeed} km/h</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">Delay Status</span>
              <span className={`text-xl font-bold font-mono ${selectedTrain.delay === 0 ? 'text-emerald-400' : selectedTrain.delay > 20 ? 'text-rose-400' : 'text-amber-400'}`}>
                {selectedTrain.delay === 0 ? 'ON-TIME' : `+${selectedTrain.delay} MIN`}
              </span>
              <span className="text-[10px] text-slate-500 block">Priority: {selectedTrain.priority}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Route Origin → Destination:</span>
              <span className="text-slate-200 font-semibold">{selectedTrain.source} → {selectedTrain.destination}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Allocated Track:</span>
              <span className="text-cyan-300 font-mono">{selectedTrain.track}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Current Block Section:</span>
              <span className="text-slate-200 font-mono">{selectedTrain.currentBlock}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Next Signal & Aspect:</span>
              <span className="text-emerald-400 font-mono font-semibold">{selectedTrain.nextSignal}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Direction Vector:</span>
              <span className="text-slate-200 font-mono">{selectedTrain.direction}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
            <span className="font-semibold text-cyan-300">Throughput Note:</span> Train is running with optimal headway spacing. Safe for continuous through line clearance.
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
