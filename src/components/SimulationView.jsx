import React, { useState, useEffect, useRef } from 'react';
import { Icons, getStatusBadge } from './Icons';
import { simulateStep, calculateSchedule, STATIONS } from '../utils/schedulerService';

const PREPOPULATED_TRAINS = [];

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
  const [trains, setTrains] = useState(() => {
    return PREPOPULATED_TRAINS.map(t => ({
      ...t,
      schedule: calculateSchedule(t, "14:00")
    }));
  });

  const [isRunning, setIsRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(2); // default 2x speed
  const [simTime, setSimTime] = useState(0);
  const [simLogs, setSimLogs] = useState([
    { timestamp: "14:00:00", type: "info", title: "Simulation Initialized", description: "Varanasi - Prayagraj Western corridor active." }
  ]);
  const [selectedSimTrain, setSelectedSimTrain] = useState(null);

  // Manual Dispatch Form state
  const [dispatchForm, setDispatchForm] = useState({
    id: "TR-" + Math.floor(10000 + Math.random() * 90000),
    name: "A", // defaults to first letter A
    category: "Express",
    priority: "6", // default priority value
    direction: "UP (Westbound)",
    speed: 80,
    maxSpeed: 110,
    destinationStationId: "EYD",
    departureTime: "14:05"
  });

  // Ref for the simulator loop interval
  const intervalRef = useRef(null);

  // Simulation tick loop
  useEffect(() => {
    if (isRunning) {
      const stepMs = 1000 / simSpeed;
      intervalRef.current = setInterval(() => {
        setTrains(prevTrains => {
          const { trains: nextTrains, logs } = simulateStep(prevTrains, 1, simTime);
          if (logs.length > 0) {
            setSimLogs(prevLogs => [...logs, ...prevLogs].slice(0, 100)); // Cap logs at 100
          }
          return nextTrains;
        });
        setSimTime(prevTime => prevTime + 1);
      }, stepMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, simSpeed, simTime]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    setSimLogs(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        type: "info",
        title: isRunning ? "Simulation Paused" : "Simulation Started",
        description: isRunning ? "Dynamic scheduling paused." : `System running at ${simSpeed}x fast forward.`
      },
      ...prev
    ]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSimTime(0);
    setTrains(
      PREPOPULATED_TRAINS.map(t => ({
        ...t,
        schedule: calculateSchedule(t, "14:00"),
        visitedStations: ["BSB"]
      }))
    );
    setSelectedSimTrain(null);
    setDispatchForm(prev => ({
      ...prev,
      id: "TR-" + Math.floor(10000 + Math.random() * 90000),
      name: "A"
    }));
    setSimLogs([
      { timestamp: new Date().toLocaleTimeString(), type: "info", title: "Simulation Reset", description: "Cleared active simulated train corridor state." }
    ]);
  };

  const handleDispatch = (e) => {
    e.preventDefault();

    const isUp = dispatchForm.direction === "UP (Westbound)";
    const selectedStation = STATIONS.find(s => s.id === dispatchForm.destinationStationId) || STATIONS[STATIONS.length - 1];

    const newTrain = {
      id: dispatchForm.id,
      name: dispatchForm.name,
      source: isUp ? "Station I (Varanasi)" : "Station IV (East Yard)",
      destination: selectedStation.name,
      destinationStationId: selectedStation.id,
      speed: Number(dispatchForm.speed),
      maxSpeed: Number(dispatchForm.maxSpeed),
      track: isUp ? "Track 1 (UP Main)" : "Track 2 (DN Main)",
      delay: 0,
      status: "Active",
      priority: dispatchForm.priority,
      category: dispatchForm.category,
      km: isUp ? 0 : 32,
      pct: isUp ? 0 : 100,
      currentBlock: isUp ? "BLK-101 (Varanasi Exit)" : "BLK-201 (East Inbound)",
      currentBlockId: isUp ? "BLK-101" : "BLK-201",
      nextSignal: isUp ? "SIG-101A [GREEN]" : "SIG-201A [GREEN]",
      direction: dispatchForm.direction,
      visitedStations: [isUp ? "BSB" : "EYD"]
    };

    newTrain.schedule = calculateSchedule(newTrain, dispatchForm.departureTime);

    // Limit schedule array to the selected destination station
    const targetStationIdx = STATIONS.findIndex(s => s.id === selectedStation.id);
    if (newTrain.schedule && targetStationIdx !== -1) {
      if (isUp) {
        newTrain.schedule = newTrain.schedule.filter(s => {
          const stIdx = STATIONS.findIndex(st => st.id === s.stationId);
          return stIdx !== -1 && stIdx <= targetStationIdx;
        });
      } else {
        newTrain.schedule = newTrain.schedule.filter(s => {
          const stIdx = STATIONS.findIndex(st => st.id === s.stationId);
          return stIdx !== -1 && stIdx >= targetStationIdx;
        });
      }
    }

    const nextName = getNextTrainName([...trains, newTrain]);

    setTrains(prev => [...prev, newTrain]);
    setSimLogs(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        type: "info",
        title: "Train Dispatched",
        description: `Train ${newTrain.name} (${newTrain.id}) dispatched toward ${newTrain.destination}.`
      },
      ...prev
    ]);

    // Generate new random ID for next dispatch
    setDispatchForm(prev => ({
      ...prev,
      id: "TR-" + Math.floor(10000 + Math.random() * 90000),
      name: nextName
    }));
  };

  const getSignalColorClass = (signalStr) => {
    if (!signalStr) return "bg-emerald-500 border-emerald-400";
    if (signalStr.includes("RED")) return "bg-rose-500 border-rose-400";
    if (signalStr.includes("YELLOW")) return "bg-amber-500 border-amber-400";
    return "bg-emerald-500 border-emerald-400";
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Icons.Traffic />
            <span>Interactive Simulation Sandbox</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
              DYNAMIC INTERLOCKING & ROUTING
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Manually inject trains into the section corridor and monitor collision-avoidance spacing rules.
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
        </div>
      </div>

      {/* 2. Interactive SVG Map */}
      <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Icons.Track />
          <span>Section Track Topology & Live Node Occupancy</span>
        </h3>

        <div className="bg-[#060a12] p-5 rounded-xl border border-slate-800/90 overflow-x-auto relative shadow-inner">
          <div className="min-w-[950px] relative">
            <svg className="w-full h-72 select-none" viewBox="0 0 950 280">
              
              {/* Grid guide verticals */}
              <g stroke="#1e293b" strokeWidth="1" strokeDasharray="3,6" opacity="0.4">
                <line x1="100" y1="10" x2="100" y2="250" />
                <line x1="437.5" y1="10" x2="437.5" y2="250" />
                <line x1="610" y1="10" x2="610" y2="250" />
                <line x1="850" y1="10" x2="850" y2="250" />
              </g>

              {/* Station Indicators */}
              <g fill="#475569" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono" className="opacity-95">
                <rect x="75" y="10" width="50" height="18" rx="4" fill="#0f172a" stroke="#334155" />
                <text x="93" y="22" fill="#38bdf8">I</text>
                <text x="50" y="42" fill="#64748b" fontSize="8">Station I (Varanasi)</text>

                <rect x="412" y="10" width="50" height="18" rx="4" fill="#0f172a" stroke="#334155" />
                <text x="427" y="22" fill="#38bdf8">II</text>
                <text x="375" y="42" fill="#64748b" fontSize="8">Station II (Central Jcn)</text>

                <rect x="585" y="10" width="50" height="18" rx="4" fill="#0f172a" stroke="#334155" />
                <text x="597" y="22" fill="#38bdf8">III</text>
                <text x="555" y="42" fill="#64748b" fontSize="8">Station III (Riverside)</text>

                <rect x="825" y="10" width="50" height="18" rx="4" fill="#0f172a" stroke="#334155" />
                <text x="837" y="22" fill="#38bdf8">IV</text>
                <text x="785" y="42" fill="#64748b" fontSize="8">Station IV (East Yard)</text>
              </g>

              {/* Track Rails */}
              {/* UP Main Track */}
              <g strokeWidth="3" strokeLinecap="round" fill="none">
                <line x1="100" y1="90" x2="850" y2="90" stroke="#1e293b" strokeWidth="6" />
                <line x1="100" y1="90" x2="850" y2="90" stroke="#3b82f6" opacity="0.8" />
                <text x="105" y="80" fill="#60a5fa" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">
                  TRACK 1: UP MAIN ◄◄◄
                </text>
              </g>

              {/* DN Main Track */}
              <g strokeWidth="3" strokeLinecap="round" fill="none">
                <line x1="100" y1="170" x2="850" y2="170" stroke="#1e293b" strokeWidth="6" />
                <line x1="100" y1="170" x2="850" y2="170" stroke="#a855f7" opacity="0.8" />
                <text x="105" y="160" fill="#c084fc" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">
                  TRACK 2: DN MAIN ►►►
                </text>
              </g>

              {/* Loop UP */}
              <g strokeWidth="2" strokeDasharray="5,3" fill="none">
                <path d="M 370 90 Q 400 45 425 45 L 480 45 Q 505 90 535 90" stroke="#eab308" />
                <text x="415" y="38" fill="#eab308" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">
                  Loop UP (Siding)
                </text>
              </g>

              {/* Loop DN */}
              <g strokeWidth="2" strokeDasharray="5,3" fill="none">
                <path d="M 370 170 Q 400 215 425 215 L 480 215 Q 505 170 535 170" stroke="#ef4444" />
                <text x="415" y="230" fill="#f43f5e" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">
                  Loop DN (Siding)
                </text>
              </g>

              {/* Render dynamic signals status lamps */}
              {/* SIG 101 */}
              <g transform="translate(200, 72)">
                <circle cx="0" cy="0" r="4.5" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                <circle cx="0" cy="0" r="3.5" className={getSignalColorClass(trains.find(t=>t.km > 0 && t.km < 14 && t.direction.startsWith('UP'))?.nextSignal)} />
                <text x="6" y="3" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">SIG-101A</text>
              </g>
              {/* SIG 103 (Main entrance) */}
              <g transform="translate(360, 72)">
                <circle cx="0" cy="0" r="4.5" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                <circle cx="0" cy="0" r="3.5" className={getSignalColorClass(trains.find(t=>t.km >= 13.5 && t.km <= 15.5 && t.direction.startsWith('UP'))?.nextSignal)} />
                <text x="6" y="3" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">SIG-103A</text>
              </g>
              {/* SIG 105 */}
              <g transform="translate(560, 72)">
                <circle cx="0" cy="0" r="4.5" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                <circle cx="0" cy="0" r="3.5" className={getSignalColorClass(trains.find(t=>t.km > 15.5 && t.km < 23 && t.direction.startsWith('UP'))?.nextSignal)} />
                <text x="6" y="3" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">SIG-105A</text>
              </g>

              {/* Render dynamic moving trains */}
              {trains.filter(t => t.status !== 'Completed').map(train => {
                const isUp = train.direction === 'UP (Westbound)';
                
                // Map KM coordinates (0 - 32) to SVG X (100 - 850)
                const x = 100 + (train.km / 32) * 750;
                
                // Determine Y based on track type and location
                let y = isUp ? 90 : 170;
                if (train.track.includes("Loop UP")) {
                  y = 45;
                } else if (train.track.includes("Loop DN")) {
                  y = 215;
                }

                const isSelected = selectedSimTrain?.id === train.id;
                const statusBadge = getStatusBadge(train.status);

                return (
                  <g
                    key={train.id}
                    transform={`translate(${x - 45}, ${y - 18})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedSimTrain(train)}
                  >
                    {/* Hover highlight ring */}
                    <rect
                      x="-2"
                      y="-2"
                      width="94"
                      height="38"
                      rx="8"
                      fill="none"
                      stroke={isSelected ? "#22d3ee" : "#334155"}
                      strokeWidth={isSelected ? 2 : 1}
                      className="group-hover:stroke-cyan-400 transition-colors"
                    />
                    
                    {/* Main train carriage body */}
                    <rect
                      x="0"
                      y="0"
                      width="90"
                      height="34"
                      rx="6"
                      fill={train.priority === 'High' ? "#1e3a8a" : train.category === 'Freight' ? "#4c0519" : "#111827"}
                      stroke={statusBadge.dot.replace('bg-', '#').replace('emerald', '10b981').replace('amber', 'f59e0b').replace('rose', 'ef4444').replace('blue', '3b82f6')}
                      strokeWidth="1.5"
                    />

                    {/* Train Info Text */}
                    <text x="6" y="14" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                      {train.category === 'Freight' ? '🛑 ' : '🚆 '}
                      {train.id}
                    </text>
                    <text x="6" y="26" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono">
                      {train.speed === 0 ? 'HELD' : `${Math.round(train.speed)} km/h`}
                    </text>

                    {/* Direction arrow indication */}
                    <polygon
                      points={isUp ? "80,17 74,13 74,21" : "10,17 16,13 16,21"}
                      fill={train.priority === 'High' ? "#38bdf8" : "#94a3b8"}
                    />
                  </g>
                );
              })}

            </svg>
          </div>
        </div>

        <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">💡 Dispatch Control:</span>
            <span className="text-slate-300">
              Click any moving train block on the SVG map above to inspect dynamic schedule arrivals and priority status.
            </span>
          </div>
          {selectedSimTrain && (
            <span className="text-emerald-400 font-mono font-semibold">
              Selected: {selectedSimTrain.name} ({selectedSimTrain.id})
            </span>
          )}
        </div>
      </div>

      {/* 3. Columns: Left (Dispatch panel + details), Right (Timetable + Live logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5/12 width): Dispatch Injector */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icons.Traffic />
              <span>Manually Dispatch Train</span>
            </h3>

            <form onSubmit={handleDispatch} className="space-y-3.5">
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
                      let speed = 80;
                      let max = 110;
                      if (cat === "Superfast") { pri = "10"; speed = 130; max = 160; }
                      else if (cat === "Freight") { pri = "2"; speed = 55; max = 75; }
                      else if (cat === "Inspection") { pri = "1"; speed = 35; max = 50; }

                      setDispatchForm(prev => ({
                        ...prev,
                        category: cat,
                        priority: pri,
                        speed,
                        maxSpeed: max
                      }));
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
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Priority Weight (1-10)</label>
                  <select
                    value={dispatchForm.priority}
                    onChange={e => setDispatchForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                      <option key={val} value={String(val)}>
                        {val} {val === 10 ? ' (Express Limit)' : val === 1 ? ' (Goods Limit)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Direction</label>
                  <select
                    value={dispatchForm.direction}
                    onChange={e => setDispatchForm(prev => ({ ...prev, direction: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="UP (Westbound)">UP (Westbound: I ➔ IV)</option>
                    <option value="DN (Eastbound)">DN (Eastbound: IV ➔ I)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Destination Station</label>
                  <select
                    value={dispatchForm.destinationStationId}
                    onChange={e => setDispatchForm(prev => ({ ...prev, destinationStationId: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {STATIONS.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Departure Time</label>
                  <input
                    type="text"
                    value={dispatchForm.departureTime}
                    onChange={e => setDispatchForm(prev => ({ ...prev, departureTime: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>➕ Inject Into Corridor</span>
              </button>
            </form>
          </div>

          {/* Active Sim Train List */}
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Active Telemetry Fleet</span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800">
                {trains.filter(t=>t.status!=='Completed').length} active
              </span>
            </h3>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {trains.filter(t => t.status !== 'Completed').map(t => {
                const isSel = selectedSimTrain?.id === t.id;
                const badge = getStatusBadge(t.status);
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedSimTrain(t)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSel ? 'bg-cyan-950/20 border-cyan-500/60' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{t.name} ({t.id})</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Pos: <span className="text-slate-300 font-bold">{t.km.toFixed(1)} km</span> • Track: <span className="text-cyan-400">{t.track.split(' ')[1] || t.track}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-300">{Math.round(t.speed)} km/h</div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold mt-1 ${badge.bg} ${badge.text} border ${badge.border}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (7/12 width): Schedule & Logs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Detailed Timetable Node */}
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icons.Schedule />
              <span>Timetable Predictions & Spacing Interlocking</span>
            </h3>

            {selectedSimTrain ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200">{selectedSimTrain.name} ({selectedSimTrain.id})</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Priority: <span className="text-slate-300">{selectedSimTrain.priority}</span> • Block: <span className="text-cyan-400 font-mono">{selectedSimTrain.currentBlock}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">Next Signal:</div>
                    <div className={`text-xs font-mono font-bold mt-0.5 ${
                      selectedSimTrain.nextSignal.includes('RED') ? 'text-rose-400' : selectedSimTrain.nextSignal.includes('YELLOW') ? 'text-amber-400' : 'text-emerald-400'
                    }`}>{selectedSimTrain.nextSignal}</div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs bg-slate-950/80">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                        <th className="py-2.5 pl-3">STATION</th>
                        <th className="py-2.5">ARR</th>
                        <th className="py-2.5">DEP</th>
                        <th className="py-2.5 pr-3 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {selectedSimTrain.schedule?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="py-2 pl-3 font-semibold text-slate-300">{item.stationName}</td>
                          <td className="py-2 font-mono">{item.arrival}</td>
                          <td className="py-2 font-mono">{item.departure}</td>
                          <td className="py-2 pr-3 text-right">
                            <span className={`text-[10px] font-bold ${
                              item.status === 'Arrived' ? 'text-emerald-400' : 'text-slate-500'
                            }`}>{item.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center rounded-xl bg-slate-950/50 border border-slate-800 text-slate-500 text-xs">
                No simulated train selected. Click on a train block or carriage to inspect scheduling timeline forecasts.
              </div>
            )}
          </div>

          {/* Dynamic Interlocking Logs */}
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icons.Alerts />
              <span>Interlocking Telemetry Logs & Conflict Resolutions</span>
            </h3>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {simLogs.map((log, idx) => {
                const isCritical = log.type === 'critical';
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                      isCritical ? 'bg-rose-950/20 border-rose-900/40' : 'bg-slate-900/60 border-slate-800/80'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-500 mt-0.5 shrink-0">
                      {log.timestamp}
                    </span>
                    <div>
                      <div className={`font-bold ${isCritical ? 'text-rose-400' : 'text-slate-300'}`}>
                        {log.title}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{log.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
