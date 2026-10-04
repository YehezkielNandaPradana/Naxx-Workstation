import { HugeiconsIcon } from '@hugeicons/react'
import {
  CommandLineIcon,
  CpuIcon,
  GitBranchIcon,
  Layers01Icon,
} from '@hugeicons/core-free-icons'
import { useEffect, useState } from 'react'

type ProfileSummary = {
  name: string
  model?: string
}

type CommandChip = {
  id: string
  tag: string
  title: string
  desc: string
  prompt: string
}

const COMMAND_CHIPS: Array<CommandChip> = [
  {
    id: 'git',
    tag: 'GIT',
    title: 'Git status & diff',
    desc: 'Audit modified files & branch state',
    prompt: 'Cek git status di workspace workstation, apa saja file yang diubah dan uncommitted changes saat ini.',
  },
  {
    id: 'ports',
    tag: 'PORT',
    title: 'System & port audit',
    desc: 'Check active local processes & ports',
    prompt: 'Audit port lokal dan proses background yang sedang running di workstation ini.',
  },
  {
    id: 'build',
    tag: 'BUILD',
    title: 'Build & health check',
    desc: 'Verify compile status & run tests',
    prompt: 'Jalankan build check untuk memverifikasi apakah ada error atau compile warning di project aktif.',
  },
  {
    id: 'memory',
    tag: 'VAULT',
    title: 'Inspect memory vault',
    desc: 'Review persistent user facts & rules',
    prompt: 'Tampilkan ringkasan memori persisten aktif untuk profile nazza dan workspace.',
  },
]

type ChatEmptyStateProps = {
  compact?: boolean
  onSuggestionClick?: (prompt: string) => void
}

export function ChatEmptyState({
  compact = false,
  onSuggestionClick,
}: ChatEmptyStateProps) {
  const [activeProfile, setActiveProfile] = useState<ProfileSummary | null>(null)

  useEffect(() => {
    let unmounted = false
    async function loadActiveProfile() {
      try {
        const res = await fetch('/api/profiles')
        if (!res.ok) return
        const data = await res.json()
        if (unmounted) return
        const active =
          data?.profiles?.find((p: any) => p.is_active || p.name === 'nazza') ||
          data?.profiles?.[0]
        if (active) {
          setActiveProfile({
            name: active.name || 'nazza',
            model: active.model || active.model_name || 'ag/gemini-3.8-flash-high',
          })
        }
      } catch {
        if (!unmounted) {
          setActiveProfile({
            name: 'nazza',
            model: 'ag/gemini-3.8-flash-high',
          })
        }
      }
    }
    loadActiveProfile()
    return () => {
      unmounted = true
    }
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-8 select-none">
      <div className="flex max-w-xl w-full flex-col items-center text-center">
        {/* Sleek Terminal Workstation Header Tag */}
        <div className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-[#121217] px-3 py-1 text-[11px] font-mono tracking-wider text-zinc-400">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-200 font-semibold">NAXX WORKSTATION</span>
          <span className="text-zinc-600">//</span>
          <span className="text-amber-400 font-medium">HERMES AGENT</span>
        </div>

        {/* Crisp Headline */}
        <h1 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
          Ready to execute.
        </h1>

        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-md font-sans">
          Active profile <span className="font-mono text-zinc-200">{activeProfile?.name || 'nazza'}</span> with full tool access, terminal PTY, and live memory.
        </p>

        {/* Model & Status Pill */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-0.5 text-[11px] text-zinc-400 font-mono">
          <span className="text-zinc-500">model:</span>
          <span className="text-zinc-200">{activeProfile?.model || 'ag/gemini-3.8-flash-high'}</span>
        </div>

        {/* Tactical Command Chips */}
        {!compact && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
            {COMMAND_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => onSuggestionClick?.(chip.prompt)}
                className="group relative flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#111116] p-3 text-left transition-all duration-150 hover:border-white/[0.18] hover:bg-[#16161d] active:scale-[0.98] focus:outline-none focus:ring-1 focus:ring-amber-500/40 cursor-pointer"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-colors">
                  <span className="font-mono text-[10px] font-bold tracking-tight">
                    {chip.tag}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {chip.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors truncate">
                    {chip.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Clean Shortcut Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-zinc-500">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-zinc-400">Ctrl</kbd>
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-zinc-400">K</kbd>
            <span>palette</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-zinc-400">↵</kbd>
            <span>send</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-zinc-400">⇧↵</kbd>
            <span>newline</span>
          </span>
        </div>
      </div>
    </div>
  )
}
