import { HugeiconsIcon } from '@hugeicons/react'
import {
  BrainIcon,
  CodeIcon,
  CpuIcon,
  FlashIcon,
  Message01Icon,
  PuzzleIcon,
  Rocket01Icon,
  Shield01Icon,
  SparklesIcon
} from '@hugeicons/core-free-icons'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

type ProfileSummary = {
  name: string
  model?: string
  active?: boolean
}

type SuggestionChip = {
  label: string
  desc: string
  prompt: string
  agent: 'delta' | 'nazza'
  icon: unknown
}

const SUGGESTIONS: Array<SuggestionChip> = [
  {
    label: 'Architecture & Strategy',
    desc: 'Plan next feature milestone',
    prompt: 'Delta, rancang arsitektur teknis dan roadmap untuk modul fitur berikutnya di Naxx Workstation.',
    agent: 'delta',
    icon: Rocket01Icon,
  },
  {
    label: 'Fast Execution & Code',
    desc: 'Run implementation & tests',
    prompt: 'Nazza, eksekusi task implementasi terbaru, cek file perubahan dan pastikan build lolos.',
    agent: 'nazza',
    icon: FlashIcon,
  },
  {
    label: 'Security & Pen-testing',
    desc: 'Audit vulnerabilities & alerts',
    prompt: 'Lakukan audit keamanan pada port dan endpoint aktif di workstation ini, lalu laporkan IOC.',
    agent: 'nazza',
    icon: Shield01Icon,
  },
  {
    label: 'Analyze Memory Vault',
    desc: 'Review persistent directives',
    prompt: 'Tampilkan dan ringkas fakta memori penting yang aktif di ~/.hermes/ dan profile nazza.',
    agent: 'delta',
    icon: BrainIcon,
  },
]

type ChatEmptyStateProps = {
  onSuggestionClick?: (prompt: string) => void
  compact?: boolean
}

export function ChatEmptyState({
  onSuggestionClick,
  compact = false,
}: ChatEmptyStateProps) {
  const [activeProfile, setActiveProfile] = useState<ProfileSummary | null>(null)

  useEffect(() => {
    fetch('/api/profiles/list')
      .then((res) => res.json())
      .then((data) => {
        const profiles = data?.profiles as Array<ProfileSummary> | undefined
        const active = profiles?.find((p) => p.active)
        if (active) setActiveProfile(active)
      })
      .catch(() => {
        // silently ignore — profile info is cosmetic
      })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col items-center justify-center px-4 py-10 selection:bg-amber-500/20"
    >
      <div className="flex max-w-2xl flex-col items-center text-center">
        {/* Modern Ambient Floating Glow & Avatar */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-emerald-500/10 blur-xl opacity-70 animate-pulse" />
          <div className="relative flex size-20 items-center justify-center rounded-3xl border border-white/10 bg-[#121218]/90 p-1 shadow-2xl backdrop-blur-xl">
            <img
              src="/claude-avatar.webp"
              alt="Hermes Agent"
              className="size-full rounded-[20px] object-cover shadow-inner"
            />
            {/* Online Status Pill */}
            <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#09090b] border border-white/10">
              <span className="size-2.5 rounded-full bg-amber-500 breathing-dot" />
            </span>
          </div>
        </div>

        {/* Dual Agent Badge Pill */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-1 text-[11px] font-medium backdrop-blur-md">
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="size-1.5 rounded-full bg-purple-400" />
            DELTA: Strategic Lead
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-400" />
            NAZZA: Execution Core
          </span>
        </div>

        {/* Display Title */}
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Naxx Workstation
        </h2>

        <p className="mt-2 text-sm text-zinc-400 max-w-md">
          Autonomous Dual-Agent Workspace with live PTY terminal, Monaco editor, and full fleet observability.
        </p>

        {activeProfile && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-xs text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>Profile: <strong>{activeProfile.name}</strong></span>
            {activeProfile.model ? <span className="text-amber-500/60 font-mono text-[11px]">({activeProfile.model})</span> : null}
          </div>
        )}

        {/* Modern Prompt Cards (Pinterest Bouncy Bento Style) */}
        {!compact && (
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 text-left w-full">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => onSuggestionClick?.(suggestion.prompt)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#121218]/70 p-4 backdrop-blur-xl bouncy-hover text-left focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                {/* Subtle hover gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.04] to-purple-500/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-amber-400 group-hover:border-amber-500/30 group-hover:text-amber-300 smooth-spring">
                    <HugeiconsIcon
                      icon={suggestion.icon as any}
                      size={18}
                      strokeWidth={1.75}
                    />
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      suggestion.agent === 'delta'
                        ? 'border border-purple-500/30 bg-purple-500/10 text-purple-300'
                        : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {suggestion.agent}
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {suggestion.label}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-1">
                    {suggestion.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">Ctrl</kbd>
            <kbd className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">K</kbd>
            <span>Command Palette</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">Ctrl</kbd>
            <kbd className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">/</kbd>
            <span>Toggle Sidebar</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
