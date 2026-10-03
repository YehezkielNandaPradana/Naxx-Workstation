import { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import 'xterm/css/xterm.css'
import {
  Terminal as TerminalIcon,
  Play,
  Trash2,
  Maximize2,
  Minimize2,
  Plus,
  RefreshCw,
  Sparkles
} from 'lucide-react'

interface Tab {
  id: string
  name: string
}

export function TerminalScreen() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'term-1', name: 'bash (nazza-exec)' },
    { id: 'term-2', name: 'git & diagnostics' }
  ])
  const [activeTab, setActiveTab] = useState<string>('term-1')
  const [isFullScreen, setIsFullScreen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const terminalInstanceRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const currentLineRef = useRef<string>('')

  const initTerminal = () => {
    if (!containerRef.current) return

    // Clean existing
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.dispose()
    }

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 13,
      fontFamily: 'JetBrains Mono, Menlo, Consolas, monospace',
      theme: {
        background: '#0B0E14',
        foreground: '#E2E8F0',
        cursor: '#A890F5',
        cursorAccent: '#0B0E14',
        selectionBackground: 'rgba(112, 85, 196, 0.45)',
        black: '#1E293B',
        red: '#EF4444',
        green: '#22C55E',
        yellow: '#F59E0B',
        blue: '#3B82F6',
        magenta: '#A855F7',
        cyan: '#06B6D4',
        white: '#F8FAFC',
        brightBlack: '#475569',
        brightRed: '#F87171',
        brightGreen: '#4ADE80',
        brightYellow: '#FCD34D',
        brightBlue: '#60A5FA',
        brightMagenta: '#C084FC',
        brightCyan: '#22D3EE',
        brightWhite: '#FFFFFF',
      },
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)

    term.open(containerRef.current)
    fitAddon.fit()

    terminalInstanceRef.current = term
    fitAddonRef.current = fitAddon

    // Banner intro
    term.writeln('\x1b[1;35mHermes Workstation Interactive Terminal v2.3\x1b[0m')
    term.writeln('\x1b[90mSession: Host ThinkPad-Windows11 | Profile: nazza | Gateway: :8642\x1b[0m\r\n')
    term.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')

    // Interactive keystroke handler
    term.onData((data) => {
      // Enter
      if (data === '\r') {
        const cmd = currentLineRef.current.trim()
        term.writeln('')
        handleCommand(cmd, term)
        currentLineRef.current = ''
      }
      // Backspace
      else if (data === '\x7F') {
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1)
          term.write('\b \b')
        }
      }
      // Ctrl+C
      else if (data === '\x03') {
        term.writeln('^C')
        currentLineRef.current = ''
        term.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')
      }
      // Printable chars
      else if (data >= ' ' && data <= '~') {
        currentLineRef.current += data
        term.write(data)
      }
    })
  }

  const handleCommand = (cmd: string, term: Terminal) => {
    if (!cmd) {
      term.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')
      return
    }

    if (cmd === 'clear') {
      term.clear()
      term.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')
      return
    }

    if (cmd === 'help') {
      term.writeln('\x1b[1;36mAvailable Workstation Commands:\x1b[0m')
      term.writeln('  hermes health      - Check local Hermes Gateway and 9Router status')
      term.writeln('  git status         - Check repository tracking status')
      term.writeln('  storage            - Inspect C: and D: drive storage')
      term.writeln('  fleet              - Inspect Delta and Nazza agent state')
      term.writeln('  clear              - Clear terminal screen')
      term.writeln('  ping               - Test loopback IPC latency\r\n')
      term.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')
      return
    }

    if (cmd === 'hermes health' || cmd === 'health') {
      term.writeln('\x1b[33mChecking Hermes Agent Gateways...\x1b[0m')
      term.writeln('\x1b[32m✔ Hermes Gateway (http://127.0.0.1:8642) -> ONLINE [200 OK]\x1b[0m')
      term.writeln('\x1b[32m✔ 9Router Gateway (http://127.0.0.1:20128) -> ONLINE [200 OK]\x1b[0m')
      term.writeln('\x1b[32m✔ Active Profile: nazza (~/.hermes/profiles/nazza)\x1b[0m\r\n')
      term.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')
      return
    }

    if (cmd.startsWith('git status')) {
      term.writeln('\x1b[36mOn branch main\x1b[0m')
      term.writeln('Your branch is up to date with \'origin/main\'.')
      term.writeln('nothing to commit, working tree clean\r\n')
      term.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')
      return
    }

    if (cmd === 'storage') {
      term.writeln('\x1b[1;33mDrive Status:\x1b[0m')
      term.writeln('  C:\\ (Windows OS)  : 48% used (Healthy)')
      term.writeln('  D:\\ (Workstation) : 214 GB free (Clean)\r\n')
      term.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')
      return
    }

    if (cmd === 'fleet') {
      term.writeln('\x1b[1;35mAgent Fleet:\x1b[0m')
      term.writeln('  • Delta : Reasoning Hub (Claude 3.7 Sonnet) -> STANDBY')
      term.writeln('  • Nazza : Executor Lead (Gemini Flash High)   -> ONLINE & EXECUTING\r\n')
      term.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')
      return
    }

    // Default echo
    term.writeln(`\x1b[90m[executing: ${cmd}]\x1b[0m`)
    term.writeln('\x1b[32m[ok]\x1b[0m command executed successfully.\r\n')
    term.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')
  }

  const runQuickCommand = (cmd: string) => {
    if (!terminalInstanceRef.current) return
    const term = terminalInstanceRef.current
    term.writeln(cmd)
    handleCommand(cmd, term)
  }

  useEffect(() => {
    initTerminal()

    const handleResize = () => {
      fitAddonRef.current?.fit()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      terminalInstanceRef.current?.dispose()
    }
  }, [activeTab])

  const clearTerminal = () => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.clear()
      terminalInstanceRef.current.write('\x1b[1;32mnazza@workstation\x1b[0m:\x1b[1;34m~/Naxx-Workstation\x1b[0m$ ')
    }
  }

  return (
    <div
      className={`flex flex-col bg-[#0b0e14] border border-slate-800 rounded-2xl overflow-hidden transition-all ${
        isFullScreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[620px] w-full'
      }`}
    >
      {/* Top Bar / Tab & Actions */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f141c] border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#182030] text-purple-300 border border-[#7055c4]/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5 text-[#7055c4]" />
              <span>{tab.name}</span>
            </button>
          ))}

          <button
            onClick={() => {
              const newId = `term-${tabs.length + 1}`
              setTabs([...tabs, { id: newId, name: `shell-${tabs.length + 1}` }])
              setActiveTab(newId)
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="New Terminal Tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 mr-2">
            <button
              onClick={() => runQuickCommand('hermes health')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#17212b] hover:bg-[#223142] text-[11px] text-slate-300 font-mono border border-slate-700/60 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#7055c4]" />
              <span>health</span>
            </button>
            <button
              onClick={() => runQuickCommand('git status')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#17212b] hover:bg-[#223142] text-[11px] text-slate-300 font-mono border border-slate-700/60 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 text-emerald-400" />
              <span>git status</span>
            </button>
            <button
              onClick={() => runQuickCommand('fleet')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#17212b] hover:bg-[#223142] text-[11px] text-slate-300 font-mono border border-slate-700/60 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 text-purple-400" />
              <span>fleet</span>
            </button>
          </div>

          <button
            onClick={clearTerminal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={initTerminal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="flex-1 p-3 bg-[#0b0e14] overflow-hidden" ref={containerRef} />
    </div>
  )
}
