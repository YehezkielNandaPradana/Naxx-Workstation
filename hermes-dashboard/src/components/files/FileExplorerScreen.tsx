import { useState } from 'react'
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Search,
  Copy,
  Check,
  Code2
} from 'lucide-react'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  size?: string
  lines?: number
  content?: string
  children?: FileNode[]
}

export function FileExplorerScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'src': true,
    'docs': true,
    'plans': true,
  })
  const [selectedFile, setSelectedFile] = useState<FileNode>({
    id: 'f-claude',
    name: 'CLAUDE.md',
    type: 'file',
    path: 'D:/Project/Naxx-Workstation/CLAUDE.md',
    size: '1.3 KB',
    lines: 27,
    content: `# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Commands
- Development server: npm run dev
- Build production bundle: npm run build (tsc -b && vite build)
- Lint: npm run lint (oxlint)

## Architecture
Telegram Mini App UI clone tailored for Naxx Workstation multi-agent operations (Delta and Nazza).
- Stack: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide icons.
- Gateway: Local 9Router gateway at http://127.0.0.1:20128.
- Agents:
  - delta: Persona logic/solution assistant.
  - nazza: Laptop executor agent (AntigravityCombo model).`,
  })
  const [isCopied, setIsCopied] = useState(false)

  const fileTree: FileNode[] = [
    {
      id: 'f-claude',
      name: 'CLAUDE.md',
      type: 'file',
      path: 'D:/Project/Naxx-Workstation/CLAUDE.md',
      size: '1.3 KB',
      lines: 27,
      content: `# CLAUDE.md\n\nNaxx Workstation multi-agent instructions & guidelines.`,
    },
    {
      id: 'folder-docs',
      name: 'docs',
      type: 'folder',
      path: 'docs',
      children: [
        {
          id: 'folder-plans',
          name: 'superpowers/plans',
          type: 'folder',
          path: 'docs/superpowers/plans',
          children: [
            {
              id: 'f-plan-dashboard',
              name: '2026-10-03-hermes-dashboard-web-ui.md',
              type: 'file',
              path: 'docs/superpowers/plans/2026-10-03-hermes-dashboard-web-ui.md',
              size: '6.4 KB',
              lines: 145,
              content: `# Hermes Dashboard (Hermes Workspace + Desktop Native Port) Implementation Plan\n\nGoal: Port full suite of Hermes Workspace + Hermes Desktop features into hermes-dashboard.\nStack: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, xterm.js.`,
            },
          ],
        },
      ],
    },
    {
      id: 'folder-src',
      name: 'src',
      type: 'folder',
      path: 'src',
      children: [
        {
          id: 'f-app-tsx',
          name: 'App.tsx',
          type: 'file',
          path: 'src/App.tsx',
          size: '18.4 KB',
          lines: 480,
          content: `// Naxx Workstation Main Dashboard Shell\nimport { useState } from 'react'\n\nexport default function App() {\n  return <WorkstationShell />\n}`,
        },
        {
          id: 'f-index-css',
          name: 'index.css',
          type: 'file',
          path: 'src/index.css',
          size: '0.8 KB',
          lines: 28,
          content: `@import "tailwindcss";\n\n:root {\n  color-scheme: dark;\n}`,
        },
        {
          id: 'f-main-tsx',
          name: 'main.tsx',
          type: 'file',
          path: 'src/main.tsx',
          size: '0.2 KB',
          lines: 8,
          content: `import ReactDOM from 'react-dom/client'\nimport App from './App'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')!).render(<App />)`,
        },
      ],
    },
    {
      id: 'f-package-json',
      name: 'package.json',
      type: 'file',
      path: 'package.json',
      size: '0.9 KB',
      lines: 34,
      content: `{\n  "name": "hermes-dashboard",\n  "private": true,\n  "version": "0.1.0",\n  "dependencies": {\n    "react": "^19.2.8",\n    "lucide-react": "^1.41.0",\n    "xterm": "^5.3.0"\n  }\n}`,
    },
    {
      id: 'f-vite-config',
      name: 'vite.config.ts',
      type: 'file',
      path: 'vite.config.ts',
      size: '0.6 KB',
      lines: 22,
      content: `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 3100,\n  }\n})`,
    },
  ]

  const toggleFolder = (name: string) => {
    setOpenFolders((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const handleCopy = () => {
    if (selectedFile.content) {
      navigator.clipboard.writeText(selectedFile.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const renderTree = (nodes: FileNode[]) => {
    return (
      <div className="space-y-0.5">
        {nodes.map((node) => {
          if (node.type === 'folder') {
            const isOpen = openFolders[node.name] ?? false
            return (
              <div key={node.id} className="space-y-0.5">
                <button
                  onClick={() => toggleFolder(node.name)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                >
                  {isOpen ? (
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{node.name}</span>
                </button>
                {isOpen && node.children && (
                  <div className="pl-4 border-l border-slate-800 ml-3">
                    {renderTree(node.children)}
                  </div>
                )}
              </div>
            )
          }

          const isSelected = selectedFile.id === node.id
          return (
            <button
              key={node.id}
              onClick={() => setSelectedFile(node)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
                isSelected
                  ? 'bg-[#7055c4]/20 text-purple-300 border border-[#7055c4]/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {node.name.endsWith('.md') ? (
                  <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                )}
                <span className="truncate">{node.name}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 ml-2">
                {node.size}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex h-[700px] w-full bg-[#0b0e14] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* File Tree Explorer Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-[#0f141c] border-r border-slate-800 flex flex-col">
        {/* Explorer Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Code2 className="w-4 h-4 text-[#7055c4]" />
            <span>Workspace Files</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Naxx-Workstation</span>
        </div>

        {/* Filter Input */}
        <div className="p-2.5 border-b border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search file in tree..."
              className="w-full bg-[#141b26] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#7055c4]"
            />
          </div>
        </div>

        {/* Directory Tree */}
        <div className="flex-1 overflow-y-auto p-2">
          {renderTree(fileTree)}
        </div>
      </aside>

      {/* Code / Content Viewer Area */}
      <main className="flex-1 flex flex-col bg-[#0b0e14] overflow-hidden">
        {/* File Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#0f141c] border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileCode className="w-4 h-4 text-[#7055c4]" />
            <div>
              <h3 className="text-xs font-mono font-semibold text-white">{selectedFile.name}</h3>
              <p className="text-[10px] font-mono text-slate-500">{selectedFile.path}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400">
              {selectedFile.lines ?? 0} lines • {selectedFile.size ?? '0 B'}
            </span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141b26] hover:bg-slate-800 text-xs text-slate-300 font-mono border border-slate-800 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-[#0b0e14]">
          <pre className="whitespace-pre-wrap select-text">
            {selectedFile.content || '// Empty file or binary content'}
          </pre>
        </div>
      </main>
    </div>
  )
}
