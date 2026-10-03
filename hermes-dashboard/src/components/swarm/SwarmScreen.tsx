import { useState } from 'react'
import {
  Users,
  Plus,
  Play,
  Square,
  Bot,
  MessageSquare,
  CheckCircle2,
  X,
  Send,
  Zap
} from 'lucide-react'

interface SubagentTask {
  id: string
  name: string
  goal: string
  agent: 'delta' | 'nazza'
  status: 'running' | 'completed' | 'stopped'
  startTime: string
  progress: number
  lastAction: string
}

export function SwarmScreen() {
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState(false)
  const [steerTaskId, setSteerTaskId] = useState<string | null>(null)
  const [steerMessage, setSteerMessage] = useState('')

  // New task form state
  const [newGoal, setNewGoal] = useState('')
  const [assignedAgent, setAssignedAgent] = useState<'delta' | 'nazza'>('nazza')

  const [tasks, setTasks] = useState<SubagentTask[]>([
    {
      id: 'sub-1',
      name: 'Dashboard UI Scaffolding & Theme',
      goal: 'Set up Vite + React 19 + Tailwind v4 dark workstation theme',
      agent: 'nazza',
      status: 'completed',
      startTime: '16:32',
      progress: 100,
      lastAction: 'Built & pushed commit 14ce60a to origin/main',
    },
    {
      id: 'sub-2',
      name: 'Interactive Modules Native Porting',
      goal: 'Port Terminal (xterm.js), Chat, Files, Memory, Skills & Cron modules',
      agent: 'nazza',
      status: 'running',
      startTime: '16:38',
      progress: 85,
      lastAction: 'Compiling TypeScript definitions & checking zero build errors',
    },
    {
      id: 'sub-3',
      name: 'Architecture & Spec Review',
      goal: 'Review Hermes Workspace vs Hermes Desktop parity matrix',
      agent: 'delta',
      status: 'completed',
      startTime: '16:25',
      progress: 100,
      lastAction: 'Delivered implementation plan to docs/superpowers/plans',
    },
  ])

  const handleSpawn = () => {
    if (!newGoal.trim()) return

    const newTask: SubagentTask = {
      id: `sub-${Date.now()}`,
      name: newGoal.slice(0, 35) + '...',
      goal: newGoal,
      agent: assignedAgent,
      status: 'running',
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      progress: 10,
      lastAction: 'Subagent spawned in isolated context',
    }

    setTasks([newTask, ...tasks])
    setNewGoal('')
    setIsSpawnModalOpen(false)
  }

  const handleStop = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: 'stopped', lastAction: 'Interrupted by user operator' }
          : t
      )
    )
  }

  const handleSteer = (id: string) => {
    if (!steerMessage.trim()) return
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              lastAction: `Course-corrected: "${steerMessage}"`,
              progress: Math.min(t.progress + 15, 95),
            }
          : t
      )
    )
    setSteerMessage('')
    setSteerTaskId(null)
  }

  return (
    <div className="flex flex-col h-[700px] w-full bg-[#0b0e14] border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f141c] border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[#c084fc]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Agent Swarm & Fleet Orchestration</h2>
            <p className="text-[11px] font-mono text-slate-400">
              Delta (Reasoning) + Nazza (Execution) • Multi-Subagent Pipeline
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSpawnModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#7055c4] hover:bg-[#8065d6] text-white text-xs font-semibold shadow-md shadow-[#7055c4]/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Spawn Subagent</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Core Fleet Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nazza */}
          <div className="p-4 rounded-xl bg-[#141b26] border border-[#7055c4]/40 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-xl">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">Nazza</h3>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ACTIVE RUNNER
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">AntigravityCombo (Gemini)</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Lead Executor</span>
            </div>
            <p className="text-xs text-slate-300 bg-[#0b0e14] p-2.5 rounded-lg border border-slate-800">
              Menangani eksekusi terminal, porting fitur dashboard, file operations, & build verify.
            </p>
          </div>

          {/* Delta */}
          <div className="p-4 rounded-xl bg-[#141b26] border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-xl">
                  🛡️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">Delta</h3>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      STANDBY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Delta (Claude 3.7)</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Strategist</span>
            </div>
            <p className="text-xs text-slate-300 bg-[#0b0e14] p-2.5 rounded-lg border border-slate-800">
              Analisis arsitektur, reasoning spec, validasi kebutuhan, & orchestrator plan tim.
            </p>
          </div>
        </div>

        {/* Subagent Running Task Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider text-slate-400">
              Subagents & Delegated Tasks
            </h3>
            <span className="text-[11px] font-mono text-slate-500">{tasks.length} Subtasks tracked</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-[#141b26] border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{task.name}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${
                          task.status === 'running'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                            : task.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {task.status}
                      </span>
                      <span className="text-[11px] font-mono text-purple-300 flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        {task.agent === 'nazza' ? 'Nazza' : 'Delta'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{task.goal}</p>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">{task.startTime}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#0b0e14] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      task.status === 'completed'
                        ? 'bg-emerald-500'
                        : task.status === 'stopped'
                        ? 'bg-rose-500'
                        : 'bg-[#7055c4]'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>

                {/* Footer Status & Controls */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span className="text-slate-300 flex items-center gap-1.5 truncate max-w-[65%]">
                    <Zap className="w-3 h-3 text-[#7055c4] flex-shrink-0" />
                    <span className="truncate">{task.lastAction}</span>
                  </span>

                  {task.status === 'running' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSteerTaskId(task.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#182030] hover:bg-[#7055c4] hover:text-white text-purple-300 border border-[#7055c4]/30 text-xs transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Steer</span>
                      </button>

                      <button
                        onClick={() => handleStop(task.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-colors cursor-pointer"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>Stop</span>
                      </button>
                    </div>
                  )}

                  {task.status === 'completed' && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spawn Subagent Modal */}
      {isSpawnModalOpen && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-[#0f141c] border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7055c4]" />
                <h3 className="font-bold text-sm text-white">Spawn Subagent Task</h3>
              </div>
              <button
                onClick={() => setIsSpawnModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Assigned Agent Lead:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignedAgent('nazza')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      assignedAgent === 'nazza'
                        ? 'bg-[#7055c4]/20 border-[#7055c4] text-white'
                        : 'bg-[#141b26] border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">⚡ Nazza (Exec)</div>
                    <div className="text-[10px] text-slate-400 font-mono">AntigravityCombo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssignedAgent('delta')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      assignedAgent === 'delta'
                        ? 'bg-[#7055c4]/20 border-[#7055c4] text-white'
                        : 'bg-[#141b26] border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">🛡️ Delta (Strategy)</div>
                    <div className="text-[10px] text-slate-400 font-mono">Claude 3.7</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Subagent Goal / Instruction:</label>
                <textarea
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Deskripsikan tujuan tugas spesifik untuk subagent..."
                  rows={3}
                  className="w-full bg-[#141b26] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#7055c4]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsSpawnModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSpawn}
                disabled={!newGoal.trim()}
                className="px-4 py-1.5 rounded-xl bg-[#7055c4] hover:bg-[#8065d6] disabled:opacity-50 text-white text-xs font-semibold cursor-pointer shadow-md shadow-[#7055c4]/20 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Spawn Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Steer Modal */}
      {steerTaskId && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#0f141c] border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Steer Running Subagent</h3>
              </div>
              <button
                onClick={() => setSteerTaskId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-400">
                Kirim instruksi koreksi arah (course correction) ke subagent di turn berikutnya:
              </p>
              <input
                type="text"
                value={steerMessage}
                onChange={(e) => setSteerMessage(e.target.value)}
                placeholder="Contoh: Fokus ke styling dark mode dulu sebelum bikin test..."
                className="w-full bg-[#141b26] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#7055c4]"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSteerTaskId(null)}
                className="px-3.5 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSteer(steerTaskId)}
                disabled={!steerMessage.trim()}
                className="px-4 py-1.5 rounded-xl bg-[#7055c4] hover:bg-[#8065d6] disabled:opacity-50 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Steer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
