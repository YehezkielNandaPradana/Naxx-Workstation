import { HugeiconsIcon } from '@hugeicons/react'
import {
  CodeIcon,
  CpuIcon,
  Folder01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { useEffect, useState } from 'react'

type ProfileSummary = {
  name: string
  model?: string
  active?: boolean
}

type QuickPrompt = {
  label: string
  prompt: string
  icon: unknown
}

const QUICK_PROMPTS: Array<QuickPrompt> = [
  {
    label: 'Cek status git & uncommitted files',
    prompt: 'Tolong cek status git di workspace, list perubahan file yang ada sekarang.',
    icon: Folder01Icon,
  },
  {
    label: 'Audit port & service aktif di workstation',
    prompt: 'Cek port lokal dan service apa saja yang sedang aktif berjalan di workstation.',
    icon: Search01Icon,
  },
  {
    label: 'Jalankan build check hermes-dashboard',
    prompt: 'Nazza, tolong jalankan build check di hermes-dashboard dan pastikan 0 error.',
    icon: CodeIcon,
  },
  {
    label: 'Ringkas context memory & skills aktif',
    prompt: 'Tolong ringkas fakta memory dan list skill yang terpasang di profile nazza.',
    icon: CpuIcon,
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
      .catch(() => {})
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12 select-none">
      <div className="w-full max-w-xl flex flex-col items-center text-center">
        {/* Minimal Monospace Header */}
        <div className="flex items-center gap-2 mb-4 font-mono text-[11px] tracking-wider uppercase text-zinc-500">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Naxx Workstation</span>
          <span>/</span>
          <span className="text-zinc-400 font-semibold">{activeProfile?.name || 'Nazza Core'}</span>
          {activeProfile?.model && (
            <>
              <span>/</span>
              <span className="text-zinc-500 lowercase">{activeProfile.model}</span>
            </>
          )}
        </div>

        {/* Confident, Clean Headline */}
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-100">
          Ada yang bisa Nazza bantu eksekusi?
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-md">
          Ketik instruksi di bawah untuk mulai eksekusi kode, terminal, inspeksi file, atau koordinasi strategi.
        </p>

        {/* Tactical Quick Action Chips (Zero-slop, clean single-line pills) */}
        {!compact && (
          <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-lg">
            {QUICK_PROMPTS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onSuggestionClick?.(item.prompt)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-600 text-xs text-zinc-300 hover:text-white transition-all duration-150 active:scale-[0.98] cursor-pointer"
              >
                <HugeiconsIcon
                  icon={item.icon as any}
                  size={14}
                  strokeWidth={1.5}
                  className="text-zinc-400 shrink-0"
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
