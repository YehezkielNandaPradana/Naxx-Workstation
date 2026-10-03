import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  MessageSquare,
  Terminal as TerminalIcon,
  FolderTree,
  Brain,
  Sparkles,
  Clock,
  Users,
  HardDrive,
  RefreshCw,
  AlertCircle,
  Zap,
  Activity,
  Server,
  Bot
} from 'lucide-react'

// Modular native screens ported from Hermes Workspace & Hermes Desktop
import { TerminalScreen } from './components/terminal/TerminalScreen'
import { ChatScreen } from './components/chat/ChatScreen'
import { FileExplorerScreen } from './components/files/FileExplorerScreen'
import { MemoryScreen } from './components/memory/MemoryScreen'
import { SkillsScreen } from './components/skills/SkillsScreen'
import { CronScreen } from './components/cron/CronScreen'
import { SwarmScreen } from './components/swarm/SwarmScreen'

type TabType =
  | 'overview'
  | 'chat'
  | 'terminal'
  | 'files'
  | 'memory'
  | 'skills'
  | 'cron'
  | 'fleet'
  | 'system'

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
    setPingLatency(elapsed || 12)
    setIsRefreshing(false)
  }

  useEffect(() => {
    checkHealth()
    const timer = setInterval(checkHealth, 10000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0e14] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-800/80 bg-[#0f141c] flex flex-col justify-between p-4">
        <div>
          {/* Logo & Workspace Title */}
          <div className="flex items-center gap-3 px-2 py-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7055c4] to-[#906fe2] flex items-center justify-center text-white shadow-lg shadow-[#7055c4]/20 flex-shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white">Naxx Workstation</h1>
              <p className="text-[11px] text-slate-400 font-mono">Hermes Dashboard</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Interactive Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'terminal'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TerminalIcon className="w-4 h-4 text-emerald-400" />
              <span>PTY Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('files')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'files'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FolderTree className="w-4 h-4 text-amber-400" />
              <span>Files Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'memory'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>Memory Browser</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#a890f5]" />
              <span>Skills Registry</span>
            </button>

            <button
              onClick={() => setActiveTab('cron')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'cron'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Cron Jobs</span>
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'fleet'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Swarm & Fleet</span>
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <HardDrive className="w-4 h-4 text-sky-400" />
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
              {activeTab === 'chat' && 'Interactive Multi-Agent Chat'}
              {activeTab === 'terminal' && 'PTY Interactive Terminal'}
              {activeTab === 'files' && 'Workspace Files Explorer'}
              {activeTab === 'memory' && 'Persistent Memory Browser'}
              {activeTab === 'skills' && 'Skills Registry & Marketplace'}
              {activeTab === 'cron' && 'Scheduled Jobs & Automation'}
              {activeTab === 'fleet' && 'Agent Swarm & Fleet Orchestration'}
              {activeTab === 'system' && 'Workstation Hardware & Diagnostics'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#7055c4]/20 text-[#a890f5] border border-[#7055c4]/30">
              Native Workstation
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
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Bento Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#141b26] border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Fleet Agents</span>
                    <Bot className="w-4 h-4 text-[#7055c4]" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">2 Active</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Delta & Nazza Standby</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141b26] border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">IPC Latency</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">{pingLatency} ms</div>
                  <div className="text-[11px] text-slate-400 mt-1">Loopback :8642 & :20128</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141b26] border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Scheduled Cron</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">4 Tasks</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Local cron engine running</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141b26] border border-slate-800/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Workspace Storage</span>
                    <HardDrive className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">D:\ 214 GB</div>
                  <div className="text-[11px] text-slate-400 mt-1">Project drives clean</div>
                </div>
              </div>

              {/* Quick Launch Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="p-5 rounded-2xl bg-[#141b26] border border-slate-800 hover:border-[#7055c4] text-left transition-all cursor-pointer group"
                >
                  <MessageSquare className="w-6 h-6 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-bold text-white mb-1">Interactive Chat & Tools</h3>
                  <p className="text-xs text-slate-400">
                    Chat langsung dengan Delta (analisis) dan Nazza (eksekusi terminal & coding).
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('terminal')}
                  className="p-5 rounded-2xl bg-[#141b26] border border-slate-800 hover:border-emerald-500 text-left transition-all cursor-pointer group"
                >
                  <TerminalIcon className="w-6 h-6 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-bold text-white mb-1">xterm.js PTY Terminal</h3>
                  <p className="text-xs text-slate-400">
                    Terminal interaktif full color, ANSI support, dan preset quick health runner.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('files')}
                  className="p-5 rounded-2xl bg-[#141b26] border border-slate-800 hover:border-amber-500 text-left transition-all cursor-pointer group"
                >
                  <FolderTree className="w-6 h-6 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-bold text-white mb-1">Workspace Code & Files</h3>
                  <p className="text-xs text-slate-400">
                    Jelajahi struktur folder repositori Naxx Workstation, preview code, dan copy isi file.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* TAB: CHAT */}
          {activeTab === 'chat' && <ChatScreen />}

          {/* TAB: TERMINAL */}
          {activeTab === 'terminal' && <TerminalScreen />}

          {/* TAB: FILES */}
          {activeTab === 'files' && <FileExplorerScreen />}

          {/* TAB: MEMORY */}
          {activeTab === 'memory' && <MemoryScreen />}

          {/* TAB: SKILLS */}
          {activeTab === 'skills' && <SkillsScreen />}

          {/* TAB: CRON */}
          {activeTab === 'cron' && <CronScreen />}

          {/* TAB: FLEET / SWARM */}
          {activeTab === 'fleet' && <SwarmScreen />}

          {/* TAB: SYSTEM */}
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
