import { useState, useRef, useEffect } from 'react'
import {
  Send,
  User,
  Sparkles,
  Terminal,
  Code2,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Zap,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'agent'
  agentId?: 'delta' | 'nazza'
  text: string
  thinking?: string
  toolCall?: {
    tool: string
    params: string
    output: string
    status: 'success' | 'running' | 'failed'
  }
  timestamp: string
}

export function ChatScreen() {
  const [selectedAgent, setSelectedAgent] = useState<'delta' | 'nazza'>('nazza')
  const [inputMessage, setInputMessage] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({
    'msg-2': true,
  })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'planning dulu aja untuk project hermes dashboard nya ini naxx',
      timestamp: '16:26',
    },
    {
      id: 'msg-2',
      sender: 'agent',
      agentId: 'nazza',
      thinking:
        'Menganalisis permintaan Naxx mengenai Hermes Dashboard. Memeriksa repository Naxx-Workstation dan menyusun rencana implementasi modular berdasarkan Hermes Workspace dan Hermes Desktop...',
      toolCall: {
        tool: 'write_file',
        params: 'docs/superpowers/plans/2026-10-03-hermes-dashboard-web-ui.md',
        output: 'verified: true (6389 bytes written)',
        status: 'success',
      },
      text: 'planning udah nazza susun dan commit rapi ke repo naxx yaaa! semua fitur hermes workspace + hermes desktop udah dimasukin ke roadmap bertahap.',
      timestamp: '16:29',
    },
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputMessage.trim() || isStreaming) return

    const userText = inputMessage.trim()
    setInputMessage('')

    const newMsgId = `msg-${Date.now()}`
    const userMsg: Message = {
      id: newMsgId,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsStreaming(true)

    // Simulate agent response with streaming & tool call
    setTimeout(() => {
      const agentMsgId = `agent-${Date.now()}`
      const agentMsg: Message = {
        id: agentMsgId,
        sender: 'agent',
        agentId: selectedAgent,
        thinking:
          selectedAgent === 'delta'
            ? 'Merumuskan rencana arsitektur strategis untuk modul requested...'
            : 'Menyiapkan eksekusi cepat terminal & penulisan file komponen...',
        toolCall: {
          tool: selectedAgent === 'nazza' ? 'terminal' : 'plan_review',
          params: selectedAgent === 'nazza' ? 'npm run build' : 'reviewing architecture spec',
          output: 'build succeeded in 2.79s with 0 errors.',
          status: 'success',
        },
        text:
          selectedAgent === 'nazza'
            ? `siap naxx! eksekusi untuk "${userText}" langsung nazza proses yaaa. output tool udah lolos verifikasi.`
            : `Rencana strategis untuk "${userText}" telah dianalisis. Lanjutkan ke fase verifikasi implementasi Nazza.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, agentMsg])
      setIsStreaming(false)
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleReasoning = (id: string) => {
    setExpandedReasoning((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex flex-col h-[700px] w-full bg-[#0b0e14] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Chat Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f141c] border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Agent Switcher Tabs */}
          <div className="flex items-center bg-[#141b26] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedAgent('nazza')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedAgent === 'nazza'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚡ Nazza (Exec)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            <button
              onClick={() => setSelectedAgent('delta')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedAgent === 'delta'
                  ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🛡️ Delta (Strategy)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-[11px] bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
              {selectedAgent === 'nazza' ? 'AntigravityCombo (Gemini)' : 'Delta (Claude 3.7)'}
            </span>
          </div>
        </div>

        {/* Clear & Session Info */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141b26] hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs transition-colors cursor-pointer border border-slate-800"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Messages Stream Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 font-bold ${
                  msg.sender === 'user'
                    ? 'bg-[#7055c4] text-white shadow-md shadow-[#7055c4]/30'
                    : msg.agentId === 'delta'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'bg-purple-600/30 text-[#c084fc] border border-purple-500/40'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : msg.agentId === 'delta' ? (
                  '🛡️'
                ) : (
                  '⚡'
                )}
              </div>

              {/* Message Box */}
              <div className="space-y-2 flex-1">
                {/* Collapsible Reasoning Block (for AI Agent) */}
                {msg.thinking && (
                  <div className="rounded-xl border border-slate-800 bg-[#121722]/80 overflow-hidden text-xs">
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      className="w-full flex items-center justify-between px-3 py-1.5 bg-[#161d2a] text-slate-400 hover:text-slate-200 transition-colors text-left font-mono cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#a890f5]" />
                        <span>Thought Process / Reasoning</span>
                      </span>
                      {expandedReasoning[msg.id] ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {expandedReasoning[msg.id] && (
                      <div className="p-3 text-slate-300 font-mono text-[11px] leading-relaxed border-t border-slate-800 bg-[#0d121a]">
                        {msg.thinking}
                      </div>
                    )}
                  </div>
                )}

                {/* Tool Call Card */}
                {msg.toolCall && (
                  <div className="rounded-xl border border-slate-800 bg-[#0f1520] p-3 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>${msg.toolCall.tool}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        completed
                      </span>
                    </div>
                    <div className="text-slate-300 text-[11px] bg-[#0b0e14] p-2 rounded-lg border border-slate-800">
                      <code>{msg.toolCall.params}</code>
                    </div>
                    <div className="text-emerald-400/90 text-[11px] pl-1">
                      ↪ {msg.toolCall.output}
                    </div>
                  </div>
                )}

                {/* Actual Message Text */}
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#7055c4] text-white rounded-tr-none shadow-md shadow-[#7055c4]/20'
                      : 'bg-[#141b26] text-slate-100 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => copyText(msg.text, msg.id)}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Copy Message"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#7055c4]/20 border border-[#7055c4]/40 flex items-center justify-center text-xs">
              <Zap className="w-4 h-4 text-[#a890f5] animate-spin" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#141b26] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7055c4] animate-ping"></span>
              <span>{selectedAgent === 'nazza' ? 'Nazza is thinking & executing tools...' : 'Delta is planning...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Slash Commands Helper */}
      <div className="px-5 py-2 bg-[#0d121a] border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
          <Code2 className="w-3 h-3" /> Slash commands:
        </span>
        {['/new', '/clear', '/skills', '/model', '/files', '/help'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => setInputMessage(cmd + ' ')}
            className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#141b26] hover:bg-[#7055c4] hover:text-white text-slate-400 border border-slate-800 transition-colors cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Chat Composer / Input Bar */}
      <div className="p-4 bg-[#0f141c] border-t border-slate-800 flex items-end gap-3 flex-shrink-0">
        <div className="flex-1 relative">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Kirim perintah atau instruksi ke ${selectedAgent === 'nazza' ? 'Nazza' : 'Delta'}...`}
            rows={2}
            className="w-full rounded-xl bg-[#141b26] border border-slate-800 focus:border-[#7055c4] focus:outline-none p-3 text-xs text-slate-200 placeholder-slate-500 resize-none transition-all"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!inputMessage.trim() || isStreaming}
          className="h-10 px-4 rounded-xl bg-[#7055c4] hover:bg-[#8065d6] disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 text-xs font-semibold shadow-lg shadow-[#7055c4]/25 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Kirim</span>
        </button>
      </div>
    </div>
  )
}
