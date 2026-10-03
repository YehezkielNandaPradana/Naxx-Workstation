import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Bot,
  Terminal,
  Clock,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Play,
  Cpu,
  Zap,
  Activity,
  Server
} from 'lucide-react'

type TabType = 'overview' | 'fleet' | 'sessions' | 'cron' | 'system'

interface AgentStatus {
  id: string
  name: string
  role: string
  model: string
  status: 'idle' | 'executing' | 'offline'
  avatar: string
  description: string
  lastActive: string
}

interface CronJobItem {
  id: string
  name: string
  schedule: string
  target: 'discord' | 'telegram' | 'local'
  status: 'active' | 'paused'
  lastRun: string
  nextRun: string
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hermesOnline, setHermesOnline] = useState<boolean | null>(null)
  const [routerOnline, setRouterOnline] = useState<boolean | null>(null)
  const [pingLatency, setPingLatency] = useState<number>(12)

  const checkHealth = async () => {
    setIsRefreshing(true)
    const startTime = performance.now()
    try {
      const res = await fetch('/api/hermes/health', { signal: AbortSignal.timeout(2000) })
      setHermesOnline(res.ok)
    } catch {
      setHermesOnline(false)
    }

    try {
      const res2 = await fetch('/api/router/health', { signal: AbortSignal.timeout(2000) })
      setRouterOnline(res2.ok)
    } catch {
      setRouterOnline(false)
    }

    const elapsed = Math.round(performance.now() - startTime)
    setPingLatency(elapsed || 14)
    setIsRefreshing(false)
  }

  useEffect(() => {
    checkHealth()
    const timer = setInterval(checkHealth, 10000)
    return () => clearInterval(timer)
  }, [])

  const agents: AgentStatus[] = [
    {
      id: 'delta',
      name: 'Delta',
      role: 'Strategist & Reasoning Hub',
      model: 'Delta (Claude 3.7 Sonnet / Reasoning)',
      status: 'idle',
      avatar: '🛡️',
      description: 'Perencana strategi, analisis arsitektur, dan pembuatan sub-plan task tim.',
      lastActive: 'Baru saja'
    },
    {
      id: 'nazza',
      name: 'Nazza',
      role: 'Lead Executor & Operator',
      model: 'AntigravityCombo (Gemini Flash High)',
      status: 'idle',
      avatar: '⚡',
      description: 'Eksekusi teknis, terminal, coding, refactor, testing, dan deployment.',
      lastActive: 'Aktif sekarang'
    }
  ]

  const cronJobs: CronJobItem[] = [
    {
      id: 'cron-1',
      name: 'Workstation Morning Health & Disk Triage',
      schedule: '0 8 * * *',
      target: 'discord',
      status: 'active',
      lastRun: 'Hari ini 08:00',
      nextRun: 'Besok 08:00'
    },
    {
      id: 'cron-2',
      name: 'Repo Git Sync & Backup Mirror',
      schedule: '0 */6 * * *',
      target: 'local',
      status: 'active',
      lastRun: '14:00',
      nextRun: '20:00'
    },
    {
      id: 'cron-3',
      name: 'Security Alert & Port Watchdog',
      schedule: '*/30 * * * *',
      target: 'telegram',
      status: 'active',
      lastRun: '16:00',
      nextRun: '16:30'
    }
  ]

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0e14] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-800/80 bg-[#0f141c] flex flex-col justify-between p-4">
        <div>
          {/* Logo & Workspace Title */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7055c4] to-[#906fe2] flex items-center justify-center text-white shadow-lg shadow-[#7055c4]/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white">Naxx Workstation</h1>
              <p className="text-xs text-slate-400 font-mono">Hermes Agent Hub</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'fleet'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Agent Fleet</span>
            </button>

            <button
              onClick={() => setActiveTab('sessions')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'sessions'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Sessions & Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('cron')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'cron'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Cron Scheduler</span>
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Workstation System</span>
            </button>
          </nav>
        </div>

        {/* Footer Gateway Status */}
        <div className="rounded-xl bg-[#141b26] p-3 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Gateway Health</span>
            <span className="text-[11px] font-mono text-slate-400">{pingLatency}ms</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Hermes :8642</span>
              {hermesOnline === false ? (
                <span className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px]">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  offline
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  ready
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">9Router :20128</span>
              {routerOnline === false ? (
                <span className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px]">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  offline
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  ready
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0f141c]/60 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold capitalize text-white">
              {activeTab === 'overview' && 'Workstation Overview'}
              {activeTab === 'fleet' && 'Agent Fleet Management'}
              {activeTab === 'sessions' && 'Live Sessions & Tool Stream'}
              {activeTab === 'cron' && 'Scheduled Tasks & Cron Manager'}
              {activeTab === 'system' && 'Workstation Hardware & Diagnostics'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#7055c4]/20 text-[#a890f5] border border-[#7055c4]/30">
              Live Monitor
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={checkHealth}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#17212b] hover:bg-[#202c3a] text-slate-300 border border-slate-700/60 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#7055c4]' : ''}`} />
              <span>Refresh</span>
            </button>

            <div className="h-4 w-px bg-slate-800"></div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-full bg-[#7055c4]/20 border border-[#7055c4]/40 flex items-center justify-center font-bold text-xs text-[#a890f5]">
                NX
              </div>
              <span className="font-medium text-slate-200">Naxx</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Bento Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#141b26] border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Active Agents</span>
                    <Bot className="w-4 h-4 text-[#7055c4]" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">2 / 2</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Delta & Nazza standby
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141b26] border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Gateway Latency</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">{pingLatency} ms</div>
                  <div className="text-[11px] text-slate-400 mt-1">Loopback IPC 127.0.0.1</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141b26] border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Scheduled Cron</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">3 Tasks</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Semua aktif di background</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141b26] border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Storage Drive</span>
                    <HardDrive className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">D:\ 214 GB</div>
                  <div className="text-[11px] text-slate-400 mt-1">Project workspace sehat</div>
                </div>
              </div>

              {/* Fleet Overview Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-5 rounded-2xl bg-[#141b26] border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#1b2434] border border-slate-700 flex items-center justify-center text-2xl">
                          {agent.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-white">{agent.name}</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ONLINE
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{agent.role}</p>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">{agent.lastActive}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-4 leading-relaxed bg-[#0b0e14]/50 p-3 rounded-xl border border-slate-800">
                      {agent.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-[11px]">{agent.model}</span>
                      <button className="text-[#a890f5] hover:text-white font-medium transition-colors cursor-pointer">
                        Lihat Session →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Action Panel */}
              <div className="p-5 rounded-2xl bg-[#141b26] border border-slate-800/80">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#7055c4]" />
                  <span>Workstation Quick Triggers</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={checkHealth}
                    className="px-3.5 py-2 rounded-xl bg-[#1a2332] hover:bg-[#222e42] border border-slate-700/80 text-xs font-medium text-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#7055c4]" />
                    <span>Ping Hermes & 9Router</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('cron')}
                    className="px-3.5 py-2 rounded-xl bg-[#1a2332] hover:bg-[#222e42] border border-slate-700/80 text-xs font-medium text-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Buka Cron Scheduler</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('sessions')}
                    className="px-3.5 py-2 rounded-xl bg-[#1a2332] hover:bg-[#222e42] border border-slate-700/80 text-xs font-medium text-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Buka Live Tool Logs</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AGENT FLEET */}
          {activeTab === 'fleet' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map((ag) => (
                  <div key={ag.id} className="p-6 rounded-2xl bg-[#141b26] border border-slate-800 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#1a2332] flex items-center justify-center text-3xl border border-slate-700">
                        {ag.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{ag.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            STANDBY
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{ag.role}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                        <span className="text-slate-400">Current Model</span>
                        <span className="font-mono text-slate-200">{ag.model}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                        <span className="text-slate-400">Execution Backend</span>
                        <span className="text-slate-200 font-mono">Hermes Local Gateway</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                        <span className="text-slate-400">Active Permissions</span>
                        <span className="text-slate-200">Terminal, Read/Write, Browser, Git</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button className="w-full py-2 rounded-xl bg-[#7055c4] hover:bg-[#8065d6] text-white text-xs font-semibold shadow-md shadow-[#7055c4]/20 transition-all cursor-pointer">
                        Spawn Dedicated Subagent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SESSIONS & LOGS */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#141b26] border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Live Tool Execution Timeline</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Session #1555979176282947586</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#0b0e14] border border-slate-800 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-emerald-400 font-semibold">$ search_files</span>
                      <span className="text-[10px]">16:26:15</span>
                    </div>
                    <p className="text-slate-300">pattern: *dashboard* | path: D:/Project</p>
                    <p className="text-slate-500 text-[11px] mt-1">Output: 40 matched files located</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0b0e14] border border-slate-800 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[#a890f5] font-semibold">$ write_file</span>
                      <span className="text-[10px]">16:29:40</span>
                    </div>
                    <p className="text-slate-300">path: docs/superpowers/plans/2026-10-03-hermes-dashboard-web-ui.md</p>
                    <p className="text-emerald-400 text-[11px] mt-1">Status: verified: true (8980 bytes written)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0b0e14] border border-slate-800 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-amber-400 font-semibold">$ git push origin main</span>
                      <span className="text-[10px]">16:30:12</span>
                    </div>
                    <p className="text-slate-300">branch: main -&gt; origin/main</p>
                    <p className="text-emerald-400 text-[11px] mt-1">Exit Code: 0 (pushed successfully)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CRON SCHEDULER */}
          {activeTab === 'cron' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#141b26] border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Hermes Cron Scheduled Jobs</h3>
                    <p className="text-xs text-slate-400">Jadwal background task otomatis Workstation Naxx</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {cronJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl bg-[#0f141c] border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{job.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {job.schedule}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>Target: <strong className="text-slate-300 uppercase">{job.target}</strong></span>
                          <span>•</span>
                          <span>Last: {job.lastRun}</span>
                          <span>•</span>
                          <span>Next: {job.nextRun}</span>
                        </div>
                      </div>

                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a2332] hover:bg-[#7055c4] hover:text-white border border-slate-700 text-xs font-medium text-slate-300 transition-all cursor-pointer">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Now</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WORKSTATION SYSTEM */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#141b26] border border-slate-800 space-y-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#7055c4]" />
                    <span>Host Environment Info</span>
                  </h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">OS Host</span>
                      <span className="font-mono text-slate-200">Windows 11 (ThinkPad)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Hermes Home</span>
                      <span className="font-mono text-slate-200">~/.hermes/profiles/nazza</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Workstation Repo</span>
                      <span className="font-mono text-slate-200">D:\Project\Naxx-Workstation</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Active Shell</span>
                      <span className="font-mono text-slate-200">git-bash / MSYS</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#141b26] border border-slate-800 space-y-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span>Local Storage Partition</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">Drive C: (System OS)</span>
                        <span className="text-slate-400 font-mono">Healthy</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-[#7055c4] rounded-full" style={{ width: '48%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">Drive D: (Project & Workstation)</span>
                        <span className="text-slate-400 font-mono">214 GB free</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
