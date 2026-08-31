import React, { useState, useEffect, useRef } from 'react';
import { Icons, getStatusBadge } from './Icons';
import {
  DEFAULT_CORRIDOR,
  generateRandomCorridor,
  calculateGraphSchedule,
  simulateGraphStep,
  exportDatasetAsJSON,
  exportDatasetAsCSV
} from '../utils/schedulerService';

function getNextTrainName(currentTrains) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < letters.length; i++) {
    const name = letters[i];
    if (!currentTrains.some(t => t.name.toUpperCase() === name)) {
      return name;
    }
  }
  return "Train-" + (currentTrains.length + 1);
}

export function SimulationView() {
  const [corridor, setCorridor] = useState(DEFAULT_CORRIDOR);
  const [trains, setTrains] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(2); // 2x fast forward
  const [simTime, setSimTime] = useState(0);
  const [simLogs, setSimLogs] = useState([
    {
      timestamp: new Date().toLocaleTimeString(),
      type: "info",
      title: "Graph Corridor Initialized",
      description: "Ready to simulate multi-platform stations and variable bottleneck lines."
    }
  ]);
  const [selectedTrain, setSelectedTrain] = useState(null);

  // ML Dataset Records store
  const [datasetRecords, setDatasetRecords] = useState([]);

  // Manual Dispatch Form
  const [dispatchForm, setDispatchForm] = useState({
    id: "TR-" + Math.floor(10000 + Math.random() * 90000),
    name: "A",
    category: "Superfast",
    priority: "10",
    originStationId: DEFAULT_CORRIDOR.stations[0].id,
    originPlatformId: DEFAULT_CORRIDOR.stations[0].platforms[0].id,
    destinationStationId: DEFAULT_CORRIDOR.stations[DEFAULT_CORRIDOR.stations.length - 1].id,
    speed: 120,
    maxSpeed: 140,
    departureTime: "14:00"
  });

  const intervalRef = useRef(null);

  // Simulation tick loop
  useEffect(() => {
    if (isRunning) {
      const stepMs = 1000 / simSpeed;
      intervalRef.current = setInterval(() => {
        setTrains(prevTrains => {
          const { trains: nextTrains, logs, datasetRecord } = simulateGraphStep(prevTrains, corridor, 1, simTime);
          if (logs.length > 0) {
            setSimLogs(prev => [...logs, ...prev].slice(0, 150));
          }
          if (datasetRecord) {
            setDatasetRecords(prev => [...prev, datasetRecord].slice(-2000)); // Keep last 2000 steps
          }
          return nextTrains;
        });
        setSimTime(prev => prev + 1);
      }, stepMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, simSpeed, simTime, corridor]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    setSimLogs(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        type: "info",
        title: isRunning ? "Simulation Paused" : "Simulation Running",
        description: isRunning ? "Scheduler paused." : `Backend optimization running at ${simSpeed}x.`
      },
      ...prev
    ]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSimTime(0);
    setTrains([]);
    setSelectedTrain(null);
    setDatasetRecords([]);
    setDispatchForm(prev => ({
      ...prev,
      id: "TR-" + Math.floor(10000 + Math.random() * 90000),
      name: "A"
    }));
    setSimLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        type: "info",
        title: "Simulation Reset",
        description: "Cleared all trains and reset corridor state."
      }
    ]);
  };

  const handleRandomizeCorridor = () => {
    handleReset();
    const newCorridor = generateRandomCorridor(4);
    setCorridor(newCorridor);
    setDispatchForm(prev => ({
      ...prev,
      originStationId: newCorridor.stations[0].id,
      originPlatformId: newCorridor.stations[0].platforms[0].id,
      destinationStationId: newCorridor.stations[newCorridor.stations.length - 1].id
    }));
    setSimLogs(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        type: "info",
        title: "New Topology Generated",
        description: `Generated procedural corridor: ${newCorridor.stations.map(s => `${s.name} (${s.platformCount} PFs)`).join(' ➔ ')}.`
      },
      ...prev
    ]);
  };

  const handleLoadDefaultCorridor = () => {
    handleReset();
    setCorridor(DEFAULT_CORRIDOR);
    setDispatchForm(prev => ({
      ...prev,
      originStationId: DEFAULT_CORRIDOR.stations[0].id,
      originPlatformId: DEFAULT_CORRIDOR.stations[0].platforms[0].id,
      destinationStationId: DEFAULT_CORRIDOR.stations[DEFAULT_CORRIDOR.stations.length - 1].id
    }));
  };

  const handleDispatch = (e) => {
    e.preventDefault();

    const originSt = corridor.stations.find(s => s.id === dispatchForm.originStationId) || corridor.stations[0];
    const destSt = corridor.stations.find(s => s.id === dispatchForm.destinationStationId) || corridor.stations[corridor.stations.length - 1];
    const originPf = originSt.platforms.find(p => p.id === dispatchForm.originPlatformId) || originSt.platforms[0];

    const originIdx = corridor.stations.findIndex(s => s.id === originSt.id);
    const destIdx = corridor.stations.findIndex(s => s.id === destSt.id);
    const direction = destIdx >= originIdx ? 1 : -1;

    const newTrain = {
      id: dispatchForm.id,
      name: dispatchForm.name,
      category: dispatchForm.category,
      priority: Number(dispatchForm.priority),
      currentSpeed: 0,
      maxSpeed: Number(dispatchForm.speed),
      originStationId: originSt.id,
      originPlatformId: originPf.id,
      destinationStationId: destSt.id,
      destinationStationName: destSt.name,
      direction,
      locState: 'REQUESTING_LINE', // ready at platform to enter bottleneck line
      currentStationId: originSt.id,
      currentPlatformId: originPf.id,
      currentPlatformName: originPf.name,
      currentSectionId: null,
      assignedLineIndex: null,
      km: originSt.km,
      progressPct: 0,
      signalAspect: 'YELLOW',
      status: 'Active',
      delaySeconds: 0,
      stopsAvoided: 0,
      pacingAdvisory: false,
      dwellTimeRemaining: 0
    };

    newTrain.schedule = calculateGraphSchedule(newTrain, corridor, dispatchForm.departureTime);

    const nextName = getNextTrainName([...trains, newTrain]);

    setTrains(prev => [...prev, newTrain]);
    setSimLogs(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        type: "info",
        title: "Train Placed at Platform",
        description: `Train ${newTrain.name} (${newTrain.category}, Priority ${newTrain.priority}) ready at ${originSt.name} - ${originPf.name} destined for ${destSt.name}.`
      },
      ...prev
    ]);

    setDispatchForm(prev => ({
      ...prev,
      id: "TR-" + Math.floor(10000 + Math.random() * 90000),
      name: nextName
    }));
  };

  // Helper for origin station platform list in form
  const originStation = corridor.stations.find(s => s.id === dispatchForm.originStationId) || corridor.stations[0];

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Icons.Traffic />
            <span>Graph Corridor Traffic Simulation & ML Dataset Generator</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
              VARIABLE PLATFORMS & BOTTLENECKS
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulates dynamic single-line bottlenecks, multi-track overtaking, priority preemption (1–10), and advisory speed pacing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
          <div className="text-xs font-mono font-bold text-slate-400 pr-2">
            SIM TIME: <span className="text-cyan-400">{Math.floor(simTime / 60)}m {simTime % 60}s</span>
          </div>

          <button
            onClick={handleStartStop}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 flex items-center gap-1.5 transition-all ${
              isRunning ? 'bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/10' : 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/10'
            }`}
          >
            <span>{isRunning ? '⏸ Pause' : '▶ Start Sim'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-all"
          >
            Reset
          </button>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Speed:</span>
            {[1, 2, 5, 10].map(s => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`w-7 h-6 flex items-center justify-center text-[10px] font-bold rounded ${
                  simSpeed === s ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <button
              onClick={handleRandomizeCorridor}
              className="px-2.5 py-1.5 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/60 text-purple-300 text-xs font-semibold rounded-lg transition-all flex items-center gap-1"
              title="Generate new procedural topology with random platforms and lines"
            >
              <span>🎲 Random Corridor</span>
            </button>
            <button
              onClick={handleLoadDefaultCorridor}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold rounded-lg transition-all"
              title="Load standard 4-station test corridor"
            >
              Default
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Dynamic Graph SVG Layout */}
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icons.Track />
            <span>Corridor Topology: {corridor.name}</span>
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Green = Clear
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Yellow = Regulated / Ready
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> Red = Line Locked Hold
            </span>
          </div>
        </div>

        <div className="bg-[#050811] p-5 rounded-xl border border-slate-800/90 overflow-x-auto relative shadow-inner">
          <div className="min-w-[1020px] relative">
            <svg className="w-full h-80 select-none" viewBox="0 0 1020 320">
              
              {/* Background Station Region Shading */}
              {corridor.stations.map((st, idx) => {
                const totalStations = corridor.stations.length;
                const availableWidth = 860;
                const stationX = 80 + idx * (availableWidth / (totalStations - 1));
                return (
                  <g key={st.id}>
                    {/* Vertical station guide background */}
                    <rect
                      x={stationX - 38}
                      y="15"
                      width="76"
                      height="280"
                      rx="10"
                      fill="#0b1120"
                      stroke="#1e293b"
                      strokeWidth="1"
                      opacity="0.8"
                    />

                    {/* Station Header Badge */}
                    <rect
                      x={stationX - 30}
                      y="22"
                      width="60"
                      height="22"
                      rx="6"
                      fill="#0f172a"
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                    />
                    <text x={stationX} y="36" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                      {st.name}
                    </text>
                    <text x={stationX} y="54" fill="#64748b" fontSize="8" textAnchor="middle">
                      {st.platformCount} Platforms
                    </text>
                  </g>
                );
              })}

              {/* Inter-Station Track Lines */}
              {corridor.sections.map((sec, secIdx) => {
                const totalStations = corridor.stations.length;
                const availableWidth = 860;
                const x1 = 80 + secIdx * (availableWidth / (totalStations - 1)) + 38;
                const x2 = 80 + (secIdx + 1) * (availableWidth / (totalStations - 1)) - 38;

                const lineYStart = 160 - ((sec.lineCount - 1) * 26) / 2;

                return (
                  <g key={sec.id}>
                    {/* Section Label Badge */}
                    <rect
                      x={(x1 + x2) / 2 - 60}
                      y="20"
                      width="120"
                      height="18"
                      rx="4"
                      fill="#0f172a"
                      stroke={sec.lineCount === 1 ? '#f43f5e' : '#3b82f6'}
                      strokeWidth="1"
                      strokeDasharray={sec.lineCount === 1 ? '3,2' : 'none'}
                    />
                    <text x={(x1 + x2) / 2} y="32" fill={sec.lineCount === 1 ? '#fda4af' : '#93c5fd'} fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
                      {sec.lineCount === 1 ? '⚠️ SINGLE BOTTLENECK' : `${sec.lineCount} PARALLEL LINES`}
                    </text>

                    {/* Section middle track lines */}
                    {sec.lines.map((line, lIdx) => {
                      const lineY = lineYStart + lIdx * 26;
                      const isOccupied = trains.some(t => t.locState === 'IN_SECTION' && t.currentSectionId === sec.id && t.assignedLineIndex === lIdx);

                      return (
                        <g key={line.id}>
                          {/* Track rail line */}
                          <line
                            x1={x1}
                            y1={lineY}
                            x2={x2}
                            y2={lineY}
                            stroke="#1e293b"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                          <line
                            x1={x1}
                            y1={lineY}
                            x2={x2}
                            y2={lineY}
                            stroke={isOccupied ? (sec.lineCount === 1 ? '#f43f5e' : '#eab308') : (sec.lineCount === 1 ? '#ef4444' : '#38bdf8')}
                            strokeWidth="2.5"
                            strokeDasharray={sec.lineCount === 1 ? 'none' : 'none'}
                            opacity={isOccupied ? 1 : 0.6}
                          />

                          {/* Line Index Number */}
                          <text x={(x1 + x2) / 2} y={lineY - 6} fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="JetBrains Mono">
                            {line.name}
                          </text>

                          {/* Section entrance signal lamps */}
                          <circle cx={x1 + 10} cy={lineY - 8} r="3" fill={isOccupied ? '#ef4444' : '#10b981'} stroke="#0f172a" strokeWidth="1" />
                          <circle cx={x2 - 10} cy={lineY - 8} r="3" fill={isOccupied ? '#ef4444' : '#10b981'} stroke="#0f172a" strokeWidth="1" />
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Station Platform Tracks & Platform Signals */}
              {corridor.stations.map((st, idx) => {
                const totalStations = corridor.stations.length;
                const availableWidth = 860;
                const stationX = 80 + idx * (availableWidth / (totalStations - 1));

                const pfYStart = 160 - ((st.platformCount - 1) * 36) / 2;

                return (
                  <g key={`st-pfs-${st.id}`}>
                    {st.platforms.map((pf, pIdx) => {
                      const pfY = pfYStart + pIdx * 36;
                      const occupiedTrain = trains.find(t => (t.locState === 'AT_PLATFORM' || t.locState === 'REQUESTING_LINE') && t.currentPlatformId === pf.id);

                      // Signal aspect for this platform starter
                      let signalColor = '#10b981';
                      if (occupiedTrain) {
                        if (occupiedTrain.signalAspect === 'RED') signalColor = '#ef4444';
                        else if (occupiedTrain.signalAspect === 'YELLOW') signalColor = '#f59e0b';
                      }

                      return (
                        <g key={pf.id}>
                          {/* Platform track line */}
                          <line
                            x1={stationX - 32}
                            y1={pfY}
                            x2={stationX + 32}
                            y2={pfY}
                            stroke="#334155"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />

                          {/* Platform Label */}
                          <text x={stationX - 34} y={pfY - 4} fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">
                            {pf.name}
                          </text>

                          {/* Platform Starter Signal */}
                          <circle cx={stationX + 26} cy={pfY - 5} r="3" fill={signalColor} stroke="#0f172a" strokeWidth="1" />

                          {/* Train sitting at platform */}
                          {occupiedTrain && (
                            <g
                              transform={`translate(${stationX - 25}, ${pfY - 14})`}
                              className="cursor-pointer"
                              onClick={() => setSelectedTrain(occupiedTrain)}
                            >
                              <rect
                                x="0"
                                y="0"
                                width="50"
                                height="26"
                                rx="5"
                                fill={occupiedTrain.priority >= 8 ? '#1e3a8a' : occupiedTrain.category === 'Freight' ? '#4c0519' : '#111827'}
                                stroke={selectedTrain?.id === occupiedTrain.id ? '#22d3ee' : signalColor}
                                strokeWidth={selectedTrain?.id === occupiedTrain.id ? 2 : 1.2}
                              />
                              <text x="5" y="11" fill="#ffffff" fontSize="8" fontWeight="bold">
                                🚆 {occupiedTrain.name}
                              </text>
                              <text x="5" y="20" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">
                                P:{occupiedTrain.priority} {occupiedTrain.locState === 'AT_PLATFORM' ? `(${occupiedTrain.dwellTimeRemaining}s)` : 'WAIT'}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Active Trains Moving in Sections */}
              {trains.filter(t => t.locState === 'IN_SECTION').map(train => {
                const section = corridor.sections.find(s => s.id === train.currentSectionId);
                if (!section) return null;

                const secIdx = corridor.sections.findIndex(s => s.id === section.id);
                const totalStations = corridor.stations.length;
                const availableWidth = 860;
                const x1 = 80 + secIdx * (availableWidth / (totalStations - 1)) + 38;
                const x2 = 80 + (secIdx + 1) * (availableWidth / (totalStations - 1)) - 38;

                const lineYStart = 160 - ((section.lineCount - 1) * 26) / 2;
                const lineY = lineYStart + (train.assignedLineIndex || 0) * 26;

                const isForward = train.direction > 0;
                const trainX = isForward
                  ? x1 + (train.progressPct / 100) * (x2 - x1)
                  : x2 - (train.progressPct / 100) * (x2 - x1);

                const isSel = selectedTrain?.id === train.id;

                return (
                  <g
                    key={train.id}
                    transform={`translate(${trainX - 25}, ${lineY - 14})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedTrain(train)}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="52"
                      height="26"
                      rx="5"
                      fill={train.priority >= 8 ? '#1e3a8a' : train.category === 'Freight' ? '#4c0519' : '#0f172a'}
                      stroke={isSel ? '#22d3ee' : train.pacingAdvisory ? '#f59e0b' : '#10b981'}
                      strokeWidth={isSel ? 2 : 1.5}
                    />
                    <text x="5" y="11" fill="#ffffff" fontSize="8" fontWeight="bold">
                      {train.category === 'Freight' ? '🛑 ' : '⚡ '}
                      {train.name}
                    </text>
                    <text x="5" y="21" fill={train.pacingAdvisory ? '#fde047' : '#94a3b8'} fontSize="7" fontFamily="JetBrains Mono">
                      {Math.round(train.currentSpeed)} km/h
                    </text>
                  </g>
                );
              })}

            </svg>
          </div>
        </div>

        <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">💡 Optimization Engine:</span>
            <span className="text-slate-300">
              In 1-line bottleneck sections, only 1 train is granted green clearance. Trailing trains approaching congested stations are paced automatically to prevent fuel-wasting stops.
            </span>
          </div>
          {selectedTrain && (
            <span className="text-emerald-400 font-mono font-semibold">
              Selected: Train {selectedTrain.name} ({selectedTrain.id}) - Priority {selectedTrain.priority}
            </span>
          )}
        </div>
      </div>

      {/* 3. Three Column Operations Row: Dispatcher, Telemetry, and ML Dataset Recorder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (4/12): Manual Dispatcher */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icons.Traffic />
              <span>Dispatch Train to Platform</span>
            </h3>

            <form onSubmit={handleDispatch} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Train ID</label>
                  <input
                    type="text"
                    value={dispatchForm.id}
                    onChange={e => setDispatchForm(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Train Name</label>
                  <input
                    type="text"
                    value={dispatchForm.name}
                    onChange={e => setDispatchForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Category</label>
                  <select
                    value={dispatchForm.category}
                    onChange={e => {
                      const cat = e.target.value;
                      let pri = "6";
                      let speed = 90;
                      if (cat === "Superfast") { pri = "10"; speed = 130; }
                      else if (cat === "Freight") { pri = "2"; speed = 55; }
                      else if (cat === "Inspection") { pri = "1"; speed = 35; }
                      setDispatchForm(prev => ({ ...prev, category: cat, priority: pri, speed }));
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Superfast">Superfast</option>
                    <option value="Express">Express</option>
                    <option value="Freight">Freight</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Priority (1–10)</label>
                  <select
                    value={dispatchForm.priority}
                    onChange={e => setDispatchForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(val => (
                      <option key={val} value={String(val)}>
                        {val} {val === 10 ? '(Highest Express)' : val === 1 ? '(Lowest Goods)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Origin Station & Platform Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Origin Station</label>
                  <select
                    value={dispatchForm.originStationId}
                    onChange={e => {
                      const st = corridor.stations.find(s => s.id === e.target.value) || corridor.stations[0];
                      setDispatchForm(prev => ({
                        ...prev,
                        originStationId: st.id,
                        originPlatformId: st.platforms[0].id
                      }));
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {corridor.stations.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Origin Platform</label>
                  <select
                    value={dispatchForm.originPlatformId}
                    onChange={e => setDispatchForm(prev => ({ ...prev, originPlatformId: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {originStation.platforms.map(pf => (
                      <option key={pf.id} value={pf.id}>{pf.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination Station & Speed */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Destination</label>
                  <select
                    value={dispatchForm.destinationStationId}
                    onChange={e => setDispatchForm(prev => ({ ...prev, destinationStationId: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {corridor.stations.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Speed (km/h)</label>
                  <input
                    type="number"
                    value={dispatchForm.speed}
                    onChange={e => setDispatchForm(prev => ({ ...prev, speed: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-1.5 transition-all mt-2"
              >
                <span>➕ Place Train on Platform</span>
              </button>
            </form>
          </div>
        </div>

        {/* Middle (4/12): Telemetry & Selected Train */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Active Corridor Fleet</span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800">
                {trains.filter(t => t.status !== 'Completed').length} in section
              </span>
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {trains.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs rounded-xl border border-slate-800/80">
                  No trains on tracks. Use the dispatcher on the left to inject trains.
                </div>
              ) : (
                trains.map(t => {
                  const isSel = selectedTrain?.id === t.id;
                  const isCompleted = t.status === 'Completed';
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTrain(t)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSel ? 'bg-cyan-950/20 border-cyan-500/60' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span>Train {t.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">P:{t.priority}</span>
                          {t.pacingAdvisory && (
                            <span className="text-[8px] px-1 rounded bg-amber-500/20 text-amber-300 font-bold">PACED</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          {t.locState === 'AT_PLATFORM' ? `At ${t.currentPlatformName}` : t.locState === 'IN_SECTION' ? `In ${t.currentSectionId}` : isCompleted ? 'Journey Completed' : 'Waiting Line'}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-slate-300">
                          {isCompleted ? 'ARRIVED' : `${Math.round(t.currentSpeed)} km/h`}
                        </div>
                        <div className={`text-[9px] font-bold font-mono ${
                          t.signalAspect === 'RED' ? 'text-rose-400' : t.signalAspect === 'YELLOW' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {t.signalAspect}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right (4/12): ML Dataset Recorder & Exporter */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Icons.Performance />
                <span>ML Dataset Engine</span>
              </h3>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800 font-bold">
                {datasetRecords.length} Steps
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Recorded Episodes:</span>
                <span className="text-slate-200 font-mono font-bold">{datasetRecords.length}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Stops Avoided (Pacing):</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {trains.reduce((acc, t) => acc + (t.stopsAvoided || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Delay Accumulated:</span>
                <span className="text-amber-400 font-mono font-bold">
                  {trains.reduce((acc, t) => acc + (t.delaySeconds || 0), 0)}s
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => exportDatasetAsCSV(datasetRecords)}
                disabled={datasetRecords.length === 0}
                className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span>📥 Export CSV</span>
              </button>
              <button
                onClick={() => exportDatasetAsJSON(datasetRecords)}
                disabled={datasetRecords.length === 0}
                className="py-2 px-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span>📥 Export JSON</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-500 leading-tight">
              Directly importable into Python with <code className="text-slate-400">pandas.read_csv()</code> for training RL/GNN/scheduling models.
            </div>
          </div>
        </div>

      </div>

      {/* 4. Live Interlocking & Decision Logs */}
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Icons.Alerts />
          <span>Interlocking Decisions & Speed Regulation Event Feed</span>
        </h3>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 max-h-44 overflow-y-auto pr-1">
          {simLogs.map((log, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                log.type === 'warning' ? 'bg-amber-950/20 border-amber-900/40' : log.type === 'critical' ? 'bg-rose-950/20 border-rose-900/40' : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-500 mt-0.5 shrink-0">
                {log.timestamp}
              </span>
              <div>
                <div className={`font-bold ${
                  log.type === 'warning' ? 'text-amber-400' : log.type === 'critical' ? 'text-rose-400' : 'text-slate-300'
                }`}>
                  {log.title}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{log.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
