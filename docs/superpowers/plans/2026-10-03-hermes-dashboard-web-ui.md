# Hermes Dashboard (Hermes Workspace + Desktop Native Port) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port full suite of Hermes Workspace + Hermes Desktop features into `D:\Project\Naxx-Workstation\hermes-dashboard` tailored specifically for Naxx Workstation (Delta & Nazza fleet, 9Router, Hermes Gateway, local tools, files, terminal, memory, skills, and cron).

**Architecture:** React 19 + TypeScript + Vite + Tailwind CSS v4. Modular tabbed workstation application featuring:
1. **Interactive PTY Terminal** (xterm.js + fit addon, terminal streaming, ANSI colors, shell execution)
2. **Chat & Live Tool Streamer** (Dual mode: 9Router `/v1` + Hermes `/api/hermes`, streaming SSE, tool execution cards, thinking/reasoning blocks, slash commands)
3. **Workspace Files Browser & Code Viewer** (directory tree, file reader/preview, syntax formatting)
4. **Memory Browser & Knowledge Base** (browse `~/.hermes/` and profile memories, search, view)
5. **Skills Marketplace & Registry** (browse 2000+ skills catalog and installed skills, inspect triggers)
6. **Cron & Scheduled Jobs Manager** (cron jobs list, visual schedule, manual trigger, run logs)
7. **Agent Swarm & Fleet Manager** (Delta reasoning & Nazza execution, subagent control, agent bus)
8. **Workstation & Gateway Diagnostics** (Hermes `:8642`, 9Router `:20128`, storage, RAM, diagnostics)

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, xterm.js, react-markdown, remark-gfm.

## Global Constraints

- Root directory: `D:\Project\Naxx-Workstation\hermes-dashboard`.
- Palette: Dark Workstation (`#0B0E14` base, `#121722` surface, `#182030` elevated, `#7055C4` accent, `#22C55E` online).
- Clean code, no unused vars, zero build errors (`tsc -b && vite build` must pass on every task).
- All changes must be committed and pushed to git origin immediately.

---

### Task 1: Scaffolding & Base Layout [COMPLETED]
- [x] Initial Vite + React 19 + TS + Tailwind v4 setup
- [x] Workstation navigation sidebar & header
- [x] Dev server proxy for Hermes Gateway (`:8642`) and 9Router (`:20128`)
- [x] Initial build verification & git push

---

### Task 2: Interactive Terminal Module (xterm.js PTY)
**Files:**
- Create: `src/components/terminal/TerminalScreen.tsx`
- Modify: `src/App.tsx`
- Test: Build verification & terminal mount

**Interfaces:**
- Produces: `<TerminalScreen />` with interactive xterm.js terminal instance, fit addon, command prompt, colorized output, clear buffer button.

- [ ] **Step 1: Build TerminalScreen component with xterm.js**
- [ ] **Step 2: Wire into Terminal tab in `App.tsx`**
- [ ] **Step 3: Run `tsc -b && vite build`**
- [ ] **Step 4: Commit & push**

---

### Task 3: Interactive Chat & Live Tool Streamer
**Files:**
- Create: `src/components/chat/ChatScreen.tsx`
- Create: `src/components/chat/ChatMessageItem.tsx`
- Create: `src/components/chat/ToolCard.tsx`
- Create: `src/components/chat/ReasoningBlock.tsx`
- Create: `src/types/chat.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: Full streaming chat interface with agent selector (Delta vs Nazza), collapsible reasoning accordion, expandable tool call cards (terminal, file read, write), slash command helper, and context meter.

- [ ] **Step 1: Define chat domain types and message state**
- [ ] **Step 2: Build ToolCard & ReasoningBlock components**
- [ ] **Step 3: Build ChatScreen with SSE streaming parser & composer**
- [ ] **Step 4: Wire into Chat tab in `App.tsx`**
- [ ] **Step 5: Run `tsc -b && vite build`**
- [ ] **Step 6: Commit & push**

---

### Task 4: Workspace Files Explorer & Code Viewer
**Files:**
- Create: `src/components/files/FileExplorerScreen.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: Workspace directory navigator (filtering out node_modules/.git), file metadata viewer, code viewer with line numbers and copy action.

- [ ] **Step 1: Build FileExplorerScreen with directory structure & code preview**
- [ ] **Step 2: Wire into Files tab in `App.tsx`**
- [ ] **Step 3: Run `tsc -b && vite build`**
- [ ] **Step 4: Commit & push**

---

### Task 5: Memory Browser & Knowledge Base
**Files:**
- Create: `src/components/memory/MemoryScreen.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: Explorer for `~/.hermes/profiles/nazza/` and `~/.hermes/` memory files, search query filter, memory entry cards, raw markdown viewer.

- [ ] **Step 1: Build memory explorer components and search state**
- [ ] **Step 2: Wire into Memory tab in `App.tsx`**
- [ ] **Step 3: Run `tsc -b && vite build`**
- [ ] **Step 4: Commit & push**

---

### Task 6: Skills Marketplace & Registry
**Files:**
- Create: `src/components/skills/SkillsScreen.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: Installed vs available skills catalog, category filters, trigger inspector, risk badge, and detail modal.

- [ ] **Step 1: Build SkillsScreen with installed skills and search filter**
- [ ] **Step 2: Wire into Skills tab in `App.tsx`**
- [ ] **Step 3: Run `tsc -b && vite build`**
- [ ] **Step 4: Commit & push**

---

### Task 7: Jobs & Cron Scheduler Automation
**Files:**
- Create: `src/components/cron/CronScreen.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: Full scheduled jobs dashboard, active/pause toggles, countdown timers, manual run trigger with live terminal log drawer.

- [ ] **Step 1: Build CronScreen with schedule table and manual execution modal**
- [ ] **Step 2: Wire into Jobs/Cron tab in `App.tsx`**
- [ ] **Step 3: Run `tsc -b && vite build`**
- [ ] **Step 4: Commit & push**

---

### Task 8: Agent Swarm & Fleet Orchestration
**Files:**
- Create: `src/components/swarm/SwarmScreen.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: Multi-agent fleet overview, live agent bus events, spawn subagent dialog (goal, context, model), steer and terminate controls.

- [ ] **Step 1: Build SwarmScreen with agent controls and event stream**
- [ ] **Step 2: Wire into Fleet/Swarm tab in `App.tsx`**
- [ ] **Step 3: Run `tsc -b && vite build`**
- [ ] **Step 4: Commit & push**
