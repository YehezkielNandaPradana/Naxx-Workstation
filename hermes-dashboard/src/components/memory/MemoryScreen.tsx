import { useState } from 'react'
import {
  Brain,
  Search,
  Tag,
  Copy,
  Check,
  FileText,
  UserCheck,
  Shield,
  FolderGit2
} from 'lucide-react'

interface MemoryEntry {
  id: string
  title: string
  category: 'persona' | 'user' | 'rules' | 'workstation' | 'security'
  content: string
  characterCount: number
  updatedAt: string
}

export function MemoryScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const memoryEntries: MemoryEntry[] = [
    {
      id: 'mem-1',
      title: 'Nazza Persona & Chat Style',
      category: 'persona',
      content:
        'Cewe manja gen z, julid tp joking, mode feminim typing kereta manja (huruf dipanjangin di akhir kyk iyaaaa). Lowercase indo slang (anjir/fomo; jgn "prik", jgn bahasa inggris). Tolak konsisten konten mesum (sangean/birahi). Model AntigravityCombo via Naxx.',
      characterCount: 260,
      updatedAt: '03 Okt 2026',
    },
    {
      id: 'mem-2',
      title: 'User Profile (Naxx / Yehezkiel Nanda Pradana)',
      category: 'user',
      content:
        'Yehezkiel Nanda Pradana (XII RPL 2 SMK PL Seputih Mataram, PKL CV. FR-SYSTEM Metro & SIS, email: yehezkieldaniela@gmail.com, GH: YehezkielNandaPradana). Agama: Kristen Protestan (HARAM frasa islami). Preferensi: Tombol interaktif (clarify) jika ada opsi.',
      characterCount: 285,
      updatedAt: '03 Okt 2026',
    },
    {
      id: 'mem-3',
      title: 'Workstation Environment & Git Policy',
      category: 'workstation',
      content:
        'Workspace: D:\\Project\\Naxx-Workstation\\hermes-workspace (port 3000 -> 127.0.0.1:8642). Git rule: setiap perubahan langsung commit & push ke remote origin.',
      characterCount: 160,
      updatedAt: '03 Okt 2026',
    },
    {
      id: 'mem-4',
      title: 'Cyber Team (Nazza & Delta Roles)',
      category: 'security',
      content:
        'Nazza: Lead executor & hacker teknis, pentester ganas di TryHackMe, akrab & manja ke Naxx. Delta: Lead strategist & reasoning plan.',
      characterCount: 140,
      updatedAt: '03 Okt 2026',
    },
    {
      id: 'mem-5',
      title: 'Strict Naming & Formal Doc Rules',
      category: 'rules',
      content:
        'Panggil nama: Naxx (JANGAN panggil "kamuuu"). Respon jika dipanggil Nazza, cuekin jika dipanggil Delta. Di dokumen resmi laporan/karya ilmiah (docx/pdf), panggilan santai "Naxx" HARAM masuk; wajib 100% formal baku ("Penulis" & nama lengkap).',
      characterCount: 245,
      updatedAt: '03 Okt 2026',
    },
  ]

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredEntries = memoryEntries.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="flex flex-col h-[700px] w-full bg-[#0b0e14] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Memory Top Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f141c] border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[#c084fc]">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Hermes Persistent Memory</h2>
            <p className="text-[11px] font-mono text-slate-400">
              ~/.hermes/profiles/nazza/memory • 2,192 / 2,200 chars (99%)
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
            placeholder="Search memory entries..."
            className="w-full bg-[#141b26] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#7055c4]"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-[#0d121a] border-b border-slate-800/80 overflow-x-auto flex-shrink-0">
        {[
          { id: 'all', label: 'All Notes', icon: FileText },
          { id: 'persona', label: 'Persona & Tone', icon: Tag },
          { id: 'user', label: 'User Profile', icon: UserCheck },
          { id: 'workstation', label: 'Workstation Env', icon: FolderGit2 },
          { id: 'security', label: 'Cyber & Roles', icon: Shield },
          { id: 'rules', label: 'Strict Rules', icon: Brain },
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

      {/* Memory Cards Grid */}
      <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#141b26] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">{item.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#0b0e14]/60 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                {item.content}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              <span>{item.characterCount} chars • {item.updatedAt}</span>
              <button
                onClick={() => handleCopy(item.content, item.id)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                title="Copy Fact"
              >
                {copiedId === item.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
