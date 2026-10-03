import { useState } from 'react'
import {
  Clock,
  Play,
  CheckCircle2,
  Calendar,
  X,
  Plus
} from 'lucide-react'

interface CronJob {
  id: string
  name: string
  schedule: string
  description: string
  target: 'discord' | 'telegram' | 'local'
  status: 'active' | 'paused'
  lastRun: string
  nextRun: string
  success: boolean
}

export function CronScreen() {
  const [runningJob, setRunningJob] = useState<CronJob | null>(null)
  const [executionLogs, setExecutionLogs] = useState<string[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  const [cronJobs, setCronJobs] = useState<CronJob[]>([
    {
      id: 'job-1',
      name: 'Workstation Morning Brief & Disk Triage',
      schedule: '0 8 * * *',
      description: 'Daily briefing: agenda, pending pull requests, disk space, and memory triage.',
      target: 'discord',
      status: 'active',
      lastRun: 'Today 08:00',
      nextRun: 'Tomorrow 08:00',
      success: true,
    },
    {
      id: 'job-2',
      name: 'Repo Git Sync & Origin Push Check',
      schedule: '0 */6 * * *',
      description: 'Verifikasi status git branch local vs remote origin & auto backup snapshot.',
      target: 'local',
      status: 'active',
      lastRun: '14:00',
      nextRun: '20:00',
      success: true,
    },
    {
      id: 'job-3',
      name: 'Security Alert Watchdog & Port Check',
      schedule: '*/30 * * * *',
      description: 'Monitor listening ports (:8642, :20128, :3100) & trigger alert jika gateway mati.',
      target: 'telegram',
      status: 'active',
      lastRun: '16:00',
      nextRun: '16:30',
      success: true,
    },
    {
      id: 'job-4',
      name: 'Weekly Review & Codebase Cleanup',
      schedule: '0 10 * * 0',
      description: 'Weekly reset: bersihkan cache scratch idle, summary commits mingguan.',
      target: 'discord',
      status: 'paused',
      lastRun: '27 Sep 10:00',
      nextRun: '04 Okt 10:00',
      success: true,
    },
  ])

  const toggleStatus = (id: string) => {
    setCronJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, status: job.status === 'active' ? 'paused' : 'active' }
          : job
      )
    )
  }

  const triggerRunNow = (job: CronJob) => {
    setRunningJob(job)
    setIsExecuting(true)
    setExecutionLogs([
      `[init] Triggering Hermes scheduled job: "${job.name}"`,
      `[target] Delivery destination: ${job.target.toUpperCase()}`,
      `[schedule] Expression: ${job.schedule}`,
      `[runner] Spawning execution agent (profile: nazza)...`,
    ])

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        `[exec] Running diagnostics & task payload...`,
        `[exec] Health check: Hermes Gateway :8642 [OK]`,
        `[exec] Git check: origin/main in-sync [OK]`,
      ])
    }, 800)

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        `[dispatch] Payload formatted and dispatched to ${job.target}.`,
        `[done] Job completed successfully in 1.42s (exit code 0).`,
      ])
      setIsExecuting(false)
    }, 1600)
  }

  return (
    <div className="flex flex-col h-[700px] w-full bg-[#0b0e14] border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f141c] border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Cron & Scheduled Automation</h2>
            <p className="text-[11px] font-mono text-slate-400">
              {cronJobs.length} Tasks Scheduled • Hermes Local Cron Engine
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#7055c4] hover:bg-[#8065d6] text-white text-xs font-semibold shadow-md shadow-[#7055c4]/20 transition-all cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          <span>New Scheduled Task</span>
        </button>
      </div>

      {/* Cron Jobs List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
        {cronJobs.map((job) => (
          <div
            key={job.id}
            className="p-4 rounded-xl bg-[#141b26] border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs font-bold text-white">{job.name}</h3>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {job.schedule}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase border ${
                    job.target === 'discord'
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      : job.target === 'telegram'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {job.target}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{job.description}</p>

              <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Last: {job.lastRun}
                </span>
                <span>•</span>
                <span>Next: {job.nextRun}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => toggleStatus(job.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                  job.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {job.status === 'active' ? 'Active' : 'Paused'}
              </button>

              <button
                onClick={() => triggerRunNow(job)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#7055c4] hover:text-white text-xs font-semibold text-purple-300 border border-[#7055c4]/40 transition-all cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Execution Drawer / Modal */}
      {runningJob && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl bg-[#0f141c] border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <div>
                  <h3 className="font-bold text-xs text-white">{runningJob.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Executing via Hermes Task Runner
                  </span>
                </div>
              </div>
              <button
                onClick={() => setRunningJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Execution Stream Console */}
            <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 max-h-64 overflow-y-auto">
              {executionLogs.map((log, index) => (
                <div
                  key={index}
                  className={
                    log.includes('[done]')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('[init]')
                      ? 'text-purple-400'
                      : 'text-slate-300'
                  }
                >
                  {log}
                </div>
              ))}
              {isExecuting && (
                <div className="flex items-center gap-2 text-amber-400 text-[11px] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Executing task runner...</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                {!isExecuting && (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Run finished</span>
                  </>
                )}
              </span>

              <button
                onClick={() => setRunningJob(null)}
                className="px-4 py-1.5 rounded-xl bg-[#7055c4] hover:bg-[#8065d6] text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
