import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Terminal,
  Activity,
  Clock,
  Send,
  Trash2,
  RefreshCw,
  Cpu,
  HardDrive,
  Wifi,
  Server,
  X,
} from 'lucide-react';
import { sendLiveChatMessage } from './api';

export const App: React.FC = () => {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'terminal' | 'status' | 'cron'>('status');

  // Agent selector (Delta HP vs Nazza Laptop)
  const [activeAgent, setActiveAgent] = useState<'delta' | 'nazza'>('delta');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Status & Telemetry Data
  const [systemInfo] = useState({
    model: 'ag/gemini-3.8-flash-high',
    contextUsed: '19.4K',
    contextTotal: '1000K',
    contextPercent: 2,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    cpuUsage: '14%',
    ramUsage: '3.2 GB / 7.6 GB',
    battery: '84% (Charging)',
    uptime: '18 jam 42 menit',
    gateway: '9Router :20128 (Connected)',
    statusPill: 'Running Idle',
  });

  // Terminal / Chat Console State
  const [terminalLogs, setTerminalLogs] = useState<
    { id: string; sender: 'user' | 'agent'; text: string; time: string }[]
  >([
    {
      id: '1',
      sender: 'agent',
      text: '[Hermes Agent Core v3.2 initialized on PRoot Linux]\nReady for commands.',
      time: '14:40',
    },
  ]);
  const [cmdInput, setCmdInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Cron Jobs State
  const [cronJobs, setCronJobs] = useState([
    {
      id: 'c1',
      name: 'Heartbeat & Telemetry Check',
      schedule: 'Every 15 minutes',
      lastRun: '14:30 (Success)',
      active: true,
    },
    {
      id: 'c2',
      name: 'Auto Git Sync Workstation',
      schedule: '0 0 * * * (Daily)',
      lastRun: 'Kemarin 00:00',
      active: true,
    },
    {
      id: 'c3',
      name: 'Clean Memory Cache',
      schedule: 'Setiap 6 jam',
      lastRun: '12:00 (Success)',
      active: false,
    },
  ]);

  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, activeTab, isExecuting]);

  // Handle Command in Terminal
  const handleExecuteCommand = async () => {
    if (!cmdInput.trim() || isExecuting) return;

    const userText = cmdInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTerminalLogs((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: `$ ${userText}`, time: timeNow },
    ]);
    setCmdInput('');
    setIsExecuting(true);

    try {
      const history = terminalLogs.map((l) => ({ sender: l.sender, text: l.text }));
      const reply = await sendLiveChatMessage(userText, activeAgent, history);

      setTerminalLogs((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (_) {
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: '[Error] Execution failed. Gateway unreachable.',
          time: timeNow,
        },
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#FFFFFF] text-[#1E293B] overflow-hidden font-sans select-none">
      {/* 1. Header Mini App: Hamburger + Title + Online + Model & Context Bar */}
      <header className="bg-white border-b border-gray-200 px-3 pt-2.5 pb-2">
        {/* Top Row: Menu, Hermes title, Online status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-1 text-gray-700 hover:text-black active:scale-95"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
              {activeAgent === 'delta' ? 'Hermes (Delta)' : 'Hermes (Nazza)'}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
          </div>
        </div>

        {/* Sub-header: Model name, Context usage, percentage & time */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100 text-[12px] font-mono text-gray-600">
          <span className="font-semibold text-gray-800">{systemInfo.model}</span>
          <div className="flex items-center gap-2">
            <span>
              ctx {systemInfo.contextUsed}/{systemInfo.contextTotal}
            </span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
              {systemInfo.contextPercent}%
            </span>
            <span className="text-gray-400">{systemInfo.time}</span>
          </div>
        </div>

        {/* 2. Navigation Tabs: >_ TERMINAL, • STATUS, ⏱ CRON */}
        <div className="flex items-center gap-6 mt-3 px-1 text-[13px] font-bold font-mono tracking-wider border-b border-gray-200">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 pb-2 transition-all relative ${
              activeTab === 'terminal'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Terminal size={15} />
            <span>TERMINAL</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-1.5 pb-2 transition-all relative ${
              activeTab === 'status'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Activity size={15} />
            <span>STATUS</span>
          </button>

          <button
            onClick={() => setActiveTab('cron')}
            className={`flex items-center gap-1.5 pb-2 transition-all relative ${
              activeTab === 'cron'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Clock size={15} />
            <span>CRON</span>
          </button>
        </div>
      </header>

      {/* Drawer Pilihan Agen (Delta HP vs Nazza Laptop) */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 flex">
          <div className="w-64 bg-white h-full shadow-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                <span className="font-bold text-gray-900 text-sm">Pilih Agent Node</span>
                <button onClick={() => setIsDrawerOpen(false)} className="text-gray-500">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveAgent('delta');
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    activeAgent === 'delta'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-sm">Delta (HP Moto g45)</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">PRoot Linux • Termux</div>
                </button>

                <button
                  onClick={() => {
                    setActiveAgent('nazza');
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    activeAgent === 'nazza'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-sm">Nazza (ThinkPad PC)</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">Windows 11 • Workspace</div>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 font-mono text-center">
              Clawvader / Hermes Agent Control v3.5
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsDrawerOpen(false)} />
        </div>
      )}

      {/* 3. Main Content Area Sesuai Tab Aktif */}
      <main className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC]">
        {/* ================= TAB STATUS (PERSIS SCREENSHOT CLAWVADER) ================= */}
        {activeTab === 'status' && (
          <div className="space-y-4 max-w-md mx-auto">
            {/* Status Pill Badge ala Clawvader */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Running Idle</span>
              </span>
            </div>

            {/* Metric Telemetry Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Cpu size={15} className="text-blue-600" />
                  <span>CPU Usage</span>
                </div>
                <div className="text-lg font-bold text-gray-900 font-mono mt-1">
                  {systemInfo.cpuUsage}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Octa-Core Snapdragon</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <HardDrive size={15} className="text-emerald-600" />
                  <span>Memory (RAM)</span>
                </div>
                <div className="text-sm font-bold text-gray-900 font-mono mt-1">
                  {systemInfo.ramUsage}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Termux PRoot Mem</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Server size={15} className="text-purple-600" />
                  <span>Uptime</span>
                </div>
                <div className="text-sm font-bold text-gray-900 font-mono mt-1">
                  {systemInfo.uptime}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Autonomous Daemon</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Wifi size={15} className="text-cyan-600" />
                  <span>Network / AI</span>
                </div>
                <div className="text-xs font-bold text-gray-900 font-mono mt-1 truncate">
                  {systemInfo.gateway}
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">● 1ms Localhost</div>
              </div>
            </div>

            {/* Detailed System Info */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Hardware & OS
                </span>
                <span className="text-[11px] font-mono text-gray-500">Android 14 (PRoot Linux)</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Target Host:</span>
                  <span className="font-semibold text-gray-800">
                    {activeAgent === 'delta' ? 'Motorola moto g45 5G' : 'ThinkPad Windows 11'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Context Window:</span>
                  <span className="font-semibold text-gray-800">200K Tokens Capable</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Skill:</span>
                  <span className="font-semibold text-emerald-600">web-pentest • autonomous</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB TERMINAL / CHAT INTERAKTIF ================= */}
        {activeTab === 'terminal' && (
          <div className="flex flex-col h-full max-w-md mx-auto bg-[#0F172A] rounded-2xl border border-gray-800 shadow-lg overflow-hidden text-white font-mono">
            {/* Terminal Header */}
            <div className="flex items-center justify-between bg-[#1E293B] px-3.5 py-2 border-b border-gray-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-300 font-semibold ml-2">
                  hermes@{activeAgent}:~
                </span>
              </div>
              <button
                onClick={() => setTerminalLogs([])}
                className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            </div>

            {/* Output log */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-[13px] leading-relaxed">
              {terminalLogs.map((log) => {
                const isUser = log.sender === 'user';
                return (
                  <div key={log.id} className="space-y-0.5">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span>{log.time}</span>
                      <span>{isUser ? 'naxx' : activeAgent}</span>
                    </div>
                    <div
                      className={`whitespace-pre-wrap ${
                        isUser ? 'text-[#38BDF8] font-bold' : 'text-gray-200'
                      }`}
                    >
                      {log.text}
                    </div>
                  </div>
                );
              })}

              {isExecuting && (
                <div className="flex items-center gap-2 text-gray-400 text-xs animate-pulse">
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Agent is executing command...</span>
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Command Input */}
            <div className="p-2.5 bg-[#1E293B] border-t border-gray-800 flex items-center gap-2">
              <span className="text-[#38BDF8] text-sm font-bold">$</span>
              <input
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteCommand()}
                placeholder="Ketik prompt atau perintah shell..."
                className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
              />
              <button
                onClick={handleExecuteCommand}
                disabled={!cmdInput.trim() || isExecuting}
                className="p-1.5 bg-[#38BDF8] text-gray-900 rounded-lg font-bold hover:bg-[#38BDF8]/90 active:scale-95 disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB CRON (JADWAL OTOMATIS) ================= */}
        {activeTab === 'cron' && (
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Active Cron Schedules
              </span>
              <span className="text-xs font-mono text-emerald-600 font-semibold">
                ● Daemon Active
              </span>
            </div>

            {cronJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-gray-900">{job.name}</div>
                  <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1.5">
                    <Clock size={12} className="text-blue-500" />
                    <span>{job.schedule}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">Terakhir: {job.lastRun}</div>
                </div>

                <button
                  onClick={() => {
                    setCronJobs((prev) =>
                      prev.map((j) => (j.id === job.id ? { ...j, active: !j.active } : j))
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    job.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {job.active ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
