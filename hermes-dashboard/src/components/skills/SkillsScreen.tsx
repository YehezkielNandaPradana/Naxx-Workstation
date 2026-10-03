import { useState } from 'react'
import {
  Sparkles,
  Search,
  Terminal,
  ShieldAlert,
  FolderCode,
  Globe,
  HardDrive,
  Cpu,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react'

interface SkillItem {
  id: string
  name: string
  category: string
  description: string
  trigger: string
  risk: 'safe' | 'terminal' | 'elevated'
  installed: boolean
  files: string[]
}

export function SkillsScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [inspectSkill, setInspectSkill] = useState<SkillItem | null>(null)

  const skills: SkillItem[] = [
    {
      id: 'sk-google-workspace',
      name: 'google-workspace',
      category: 'productivity',
      description: 'Gmail, Calendar, Drive, Docs, Sheets via gws CLI or Python client.',
      trigger: 'Use when managing Google Drive, sending Gmail, or querying Calendar.',
      risk: 'terminal',
      installed: true,
      files: ['SKILL.md', 'scripts/setup.py', 'scripts/google_api.py', 'references/daily-brief.md'],
    },
    {
      id: 'sk-hermes-agent',
      name: 'hermes-agent',
      category: 'autonomous-ai',
      description: 'Authoritative configuration, extension, and orchestration of Hermes Agent ecosystem.',
      trigger: 'Use when configuring, modifying, or troubleshooting Hermes Agent.',
      risk: 'safe',
      installed: true,
      files: ['SKILL.md', 'references/cli-commands.md', 'references/gateway-api.md'],
    },
    {
      id: 'sk-inspecting-desktop',
      name: 'inspecting-hermes-desktop-dom',
      category: 'software-dev',
      description: 'Read the live Hermes desktop DOM/CSS over Chrome DevTools Protocol (CDP).',
      trigger: 'Use when inspecting live DOM, computed styles, or CDP console logs.',
      risk: 'terminal',
      installed: true,
      files: ['SKILL.md', 'scripts/eval.mjs', 'scripts/perf/lib/cdp.mjs'],
    },
    {
      id: 'sk-writing-plans',
      name: 'superpowers:writing-plans',
      category: 'superpowers',
      description: 'Deconstruct specs into bite-sized test-driven implementation plans.',
      trigger: 'Use when starting multi-step tasks before touching code.',
      risk: 'safe',
      installed: true,
      files: ['SKILL.md'],
    },
    {
      id: 'sk-fastfingers',
      name: 'fastfingers-autotyper',
      category: 'automation',
      description: 'Automate 10FastFingers typing tests with humanized cadence & anti-cheat solver.',
      trigger: 'Use when creating 10FastFingers console scripts or benchmark tests.',
      risk: 'terminal',
      installed: true,
      files: ['SKILL.md', 'scripts/autotyper.js'],
    },
    {
      id: 'sk-ctf-playbook',
      name: 'ctf-playbook',
      category: 'security',
      description: 'Offensive CTF challenge solving, privilege escalation, and TryHackMe pentesting.',
      trigger: 'Use when conducting security assessments or CTF challenges.',
      risk: 'elevated',
      installed: true,
      files: ['SKILL.md', 'references/privesc-cheatsheet.md'],
    },
    {
      id: 'sk-windows-shell',
      name: 'windows-process-management',
      category: 'devops',
      description: 'Debug Windows process, port conflicts, and taskkill troubleshooting.',
      trigger: 'Use when diagnosing port locks or stuck Windows processes.',
      risk: 'terminal',
      installed: true,
      files: ['SKILL.md', 'scripts/kill-port.bat'],
    },
  ]

  const filteredSkills = skills.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trigger.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="flex flex-col h-[700px] w-full bg-[#0b0e14] border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f141c] border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#7055c4]/20 border border-[#7055c4]/40 flex items-center justify-center text-[#a890f5]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Skills Registry & Marketplace</h2>
            <p className="text-[11px] font-mono text-slate-400">
              {skills.length} Installed Skills • ~/.hermes/profiles/nazza/skills/
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name, trigger..."
            className="w-full bg-[#141b26] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#7055c4]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-[#0d121a] border-b border-slate-800/80 overflow-x-auto flex-shrink-0">
        {[
          { id: 'all', label: 'All Skills', icon: Sparkles },
          { id: 'productivity', label: 'Productivity', icon: Globe },
          { id: 'autonomous-ai', label: 'Autonomous AI', icon: Cpu },
          { id: 'software-dev', label: 'Software Dev', icon: FolderCode },
          { id: 'superpowers', label: 'Superpowers', icon: Sparkles },
          { id: 'security', label: 'Cyber & Security', icon: ShieldAlert },
          { id: 'devops', label: 'DevOps & Windows', icon: HardDrive },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = selectedCategory === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7055c4] text-white shadow-sm shadow-[#7055c4]/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Skills Grid */}
      <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((sk) => (
          <div
            key={sk.id}
            className="p-4 rounded-xl bg-[#141b26] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">{sk.name}</h3>
                  <span className="text-[10px] text-slate-400 capitalize">{sk.category}</span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    sk.risk === 'safe'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : sk.risk === 'terminal'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {sk.risk.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                {sk.description}
              </p>

              <div className="p-2 rounded-lg bg-[#0b0e14] border border-slate-800/80 text-[11px] font-mono text-purple-300/90 leading-tight">
                ⚡ {sk.trigger}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Installed
              </span>

              <button
                onClick={() => setInspectSkill(sk)}
                className="text-[#a890f5] hover:text-white font-medium transition-colors cursor-pointer"
              >
                Inspect Files →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Skill Modal */}
      {inspectSkill && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-[#0f141c] border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7055c4]" />
                <h3 className="font-bold text-sm text-white font-mono">{inspectSkill.name}</h3>
              </div>
              <button
                onClick={() => setInspectSkill(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-mono">Description:</span>
                <p className="text-slate-300 mt-1">{inspectSkill.description}</p>
              </div>

              <div>
                <span className="text-slate-500 font-mono">Trigger Rule:</span>
                <p className="text-purple-300 mt-1 font-mono bg-[#0b0e14] p-2 rounded-lg border border-slate-800">
                  {inspectSkill.trigger}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-mono">Package Files & Scripts:</span>
                <div className="mt-1 space-y-1">
                  {inspectSkill.files.map((file) => (
                    <div
                      key={file}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#141b26] border border-slate-800 font-mono text-[11px] text-slate-300"
                    >
                      {file.endsWith('.py') || file.endsWith('.js') || file.endsWith('.bat') ? (
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectSkill(null)}
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
