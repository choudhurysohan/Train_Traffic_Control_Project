import React, { useState, useEffect } from 'react';
import { DUMMY_DATA } from './data/dummyData';
import { Icons, getStatusBadge } from './components/Icons';
import { DashboardView } from './components/DashboardView';
import { RailwaySectionView } from './components/RailwaySectionView';
import { TrainMonitoringView } from './components/TrainMonitoringView';
import { TrackStatusView } from './components/TrackStatusView';
import { SignalStatusView } from './components/SignalStatusView';
import { TrainScheduleView } from './components/TrainScheduleView';
import { TrafficControlView } from './components/TrafficControlView';
import { PerformanceView } from './components/PerformanceView';
import { AlertsView } from './components/AlertsView';
import { SettingsView } from './components/SettingsView';
import { TrainModal } from './components/TrainModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [data] = useState(DUMMY_DATA);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'monitoring', label: 'Train Monitoring', icon: Icons.Train, badge: data.trains.length },
    { id: 'section', label: 'Railway Section', icon: Icons.Track, highlight: true },
    { id: 'track_status', label: 'Track Status', icon: Icons.Gauge },
    { id: 'signal_status', label: 'Signal Status', icon: Icons.Signal },
    { id: 'schedule', label: 'Train Schedule', icon: Icons.Schedule },
    { id: 'traffic_control', label: 'Traffic Control', icon: Icons.Traffic },
    { id: 'performance', label: 'Performance', icon: Icons.Performance },
    { id: 'alerts', label: 'Alerts', icon: Icons.Alerts, badge: data.alerts.filter(a => !a.acknowledged).length, badgeColor: 'bg-rose-500' },
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
  ];

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-100 overflow-hidden font-sans">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-[#0c1220] border-r border-slate-800/80 flex flex-col justify-between shrink-0 z-30 select-none">
        <div>
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-lg">
              🚆
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white uppercase font-mono">
                TT-OPTIMA <span className="text-cyan-400">CTC</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Section Traffic Control</p>
            </div>
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase px-3 py-2">
              Control Operations
            </div>
            
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-900/50 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                      <Icon />
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                      item.badgeColor ? `${item.badgeColor} text-white` : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-800/80 bg-[#090e1a]">
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-glow"></span>
              <div>
                <div className="text-[11px] font-semibold text-slate-200">Section Control</div>
                <div className="text-[9px] text-emerald-400 font-mono">100% ONLINE</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">SEC-CR4</div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 2. TOP BAR */}
        <header className="h-16 bg-[#0c1220] border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span>Train Traffic Control for Section Throughput Optimization</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800 text-cyan-300 font-mono">
                  MAJOR PROJECT
                </span>
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Section: {data.projectInfo.sectionName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 font-mono text-[11px]">Clock: {currentTime}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                <Icons.Search />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search train, signal, track..."
                className="w-56 pl-8 pr-3 py-1.5 bg-slate-900/80 border border-slate-700/70 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:w-64 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold">SYS: OPTIMAL</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
                title="Alerts & Notifications"
              >
                <Icons.Bell />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Live Control Alerts</span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">
                      {data.alerts.length} New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                    {data.alerts.map((alert) => {
                      const badge = getStatusBadge(alert.type);
                      return (
                        <div key={alert.id} className="py-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${badge.text}`}>{alert.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{alert.description}</p>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab('alerts');
                      setShowNotifications(false);
                    }}
                    className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/60 rounded-lg"
                  >
                    View All Alerts →
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-inner">
                RS
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-slate-200">{data.projectInfo.controllerName}</div>
                <div className="text-[10px] text-cyan-400 font-mono">{data.projectInfo.controllerRole}</div>
              </div>
            </div>
          </div>
        </header>

        {/* 3. MAIN ROUTED VIEW */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#070b14]">
          {currentTab === 'dashboard' && <DashboardView data={data} setCurrentTab={setCurrentTab} setSelectedTrain={setSelectedTrain} />}
          {currentTab === 'monitoring' && <TrainMonitoringView trains={data.trains} searchQuery={searchQuery} setSelectedTrain={setSelectedTrain} />}
          {currentTab === 'section' && <RailwaySectionView trains={data.trains} signals={data.signals} setSelectedTrain={setSelectedTrain} />}
          {currentTab === 'track_status' && <TrackStatusView tracks={data.tracks} />}
          {currentTab === 'signal_status' && <SignalStatusView signals={data.signals} />}
          {currentTab === 'schedule' && <TrainScheduleView schedule={data.schedule} />}
          {currentTab === 'traffic_control' && <TrafficControlView traffic={data.trafficControl} metrics={data.metrics} />}
          {currentTab === 'performance' && <PerformanceView performance={data.performance} />}
          {currentTab === 'alerts' && <AlertsView alerts={data.alerts} />}
          {currentTab === 'settings' && <SettingsView projectInfo={data.projectInfo} />}
        </main>

      </div>

      {/* MODAL */}
      <TrainModal selectedTrain={selectedTrain} onClose={() => setSelectedTrain(null)} />
    </div>
  );
}
