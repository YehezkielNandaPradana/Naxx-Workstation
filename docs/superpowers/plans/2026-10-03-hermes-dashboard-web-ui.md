# Hermes Dashboard Web UI & Monitoring Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lightweight, high-performance web dashboard to monitor, orchestrate, and inspect Hermes Agent ecosystem (Delta & Nazza fleet, subagents, sessions, cron tasks, and workstation system metrics) at `D:\Project\Naxx-Workstation\hermes-dashboard`.

**Architecture:** React 19 + TypeScript + Vite + Tailwind CSS v4 frontend. Connects directly to local Hermes Gateway (`http://127.0.0.1:8642`) and 9Router Gateway (`http://127.0.0.1:20128`) via Vite dev/prod proxy. UI adopts dark workstation palette (60-30-10 dark violet/zinc, ultra-smooth responsive layout, atomic tool execution cards).

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React, Vitest.

## Global Constraints

- Root directory: `D:\Project\Naxx-Workstation\hermes-dashboard`.
- Palette tokens: Dark Workstation (`#0F141C` base, `#17212B` surface/card, `#7055C4` accent, `#22C55E` online green, `#EF4444` error red).
- Zero external tracking or telemetry; pure local loopback network calls.
- Every commit must be tested and pushed to remote origin.

---

### Task 1: Project Scaffolding & Dark Theme Setup

**Files:**
- Create: `D:\Project\Naxx-Workstation\hermes-dashboard\package.json`
- Create: `D:\Project\Naxx-Workstation\hermes-dashboard\vite.config.ts`
- Create: `D:\Project\Naxx-Workstation\hermes-dashboard\tsconfig.json`
- Create: `D:\Project\Naxx-Workstation\hermes-dashboard\src\index.css`
- Create: `D:\Project\Naxx-Workstation\hermes-dashboard\src\main.tsx`
- Create: `D:\Project\Naxx-Workstation\hermes-dashboard\index.html`

**Interfaces:**
- Consumes: Node.js 20+, npm/pnpm.
- Produces: Vite build and dev server running on port 3100 with proxy routes `/api/hermes` -> `:8642` and `/api/router` -> `:20128`.

- [ ] **Step 1: Create package.json and dependencies**
Set up React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, and Vitest.

- [ ] **Step 2: Configure Vite proxy & TS config**
Map `/api/hermes` to `http://127.0.0.1:8642` and `/api/router` to `http://127.0.0.1:20128`.

- [ ] **Step 3: Define Tailwind CSS dark theme tokens**
Establish background, surface, border, and badge utility classes.

- [ ] **Step 4: Verify initial build**
Run: `npm run build` in `hermes-dashboard` and confirm clean exit code.

- [ ] **Step 5: Git commit**
Commit scaffold changes to git.

---

### Task 2: Core Domain Types & API Gateway Client

**Files:**
- Create: `src/types/agent.ts`
- Create: `src/types/cron.ts`
- Create: `src/types/system.ts`
- Create: `src/services/hermesGateway.ts`
- Create: `src/services/routerGateway.ts`
- Test: `src/services/gateway.test.ts`

**Interfaces:**
- Consumes: Hermes REST endpoints (`/health`, `/sessions`, `/cron`, `/metrics`) and 9Router status.
- Produces: `fetchAgentFleetStatus()`, `fetchActiveSessions()`, `fetchCronJobs()`, `triggerCronJob(id)`.

- [ ] **Step 1: Write test for API gateway parser and error fallback**
Validate graceful fallback when Hermes Gateway or 9Router is offline.

- [ ] **Step 2: Run test to confirm failure**
Run: `npx vitest run src/services/gateway.test.ts`

- [ ] **Step 3: Implement domain types & API gateway functions**
Add typed fetchers with abort controllers and retry handling.

- [ ] **Step 4: Run test to verify pass**
Run: `npx vitest run src/services/gateway.test.ts`

- [ ] **Step 5: Git commit**
Commit API layer.

---

### Task 3: Workstation Layout & Status Header

**Files:**
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/hooks/useGatewayHealth.ts`

**Interfaces:**
- Consumes: Gateway health hook (5s polling interval).
- Produces: Global shell with real-time ping indicator, active agent counter, and tab switcher.

- [ ] **Step 1: Build useGatewayHealth hook**
Polls both gateways and exposes latency and connection status.

- [ ] **Step 2: Create Header with live status pill badges**
Displays Hermes Gateway (`:8642`), 9Router (`:20128`), and Workstation load.

- [ ] **Step 3: Create Sidebar navigation**
Tabs: `Overview`, `Agent Fleet`, `Sessions & Logs`, `Cron Scheduler`, `System Health`.

- [ ] **Step 4: Verify shell layout in App.tsx**
Verify responsive drawer and dark theme rendering.

- [ ] **Step 5: Git commit**
Commit workstation shell.

---

### Task 4: Agent Fleet & Overview Module

**Files:**
- Create: `src/components/fleet/AgentCard.tsx`
- Create: `src/components/fleet/FleetView.tsx`
- Create: `src/components/overview/StatBento.tsx`
- Create: `src/components/overview/QuickActions.tsx`

**Interfaces:**
- Consumes: Agent health data, session count, active tasks.
- Produces: Overview dashboard with fleet cards (Delta reasoning vs Nazza execution) and quick triggers.

- [ ] **Step 1: Build Bento grid stats component**
Active sessions, today's tool runs, token consumption, gateway uptime.

- [ ] **Step 2: Build AgentCard component**
Specific avatar, status (idle/working/offline), current model (AntigravityCombo, Delta), active tool.

- [ ] **Step 3: Build QuickActions panel**
Buttons: Clear scratch cache, test ping gateway, spawn test task, open Discord/Telegram.

- [ ] **Step 4: Wire FleetView into Overview tab**
Render live agent metrics and test render.

- [ ] **Step 5: Git commit**
Commit fleet overview module.

---

### Task 5: Sessions & Live Tool Execution Streamer

**Files:**
- Create: `src/components/sessions/SessionList.tsx`
- Create: `src/components/sessions/SessionDetail.tsx`
- Create: `src/components/sessions/ToolExecutionCard.tsx`
- Create: `src/hooks/useSessionStream.ts`

**Interfaces:**
- Consumes: Hermes session transcripts and message tool actions.
- Produces: Visual timeline of tool calls (terminal execution, file edit, browser actions, code runner).

- [ ] **Step 1: Build ToolExecutionCard component**
Styled terminal box, file diff preview, and tool execution status badges.

- [ ] **Step 2: Build SessionDetail view**
Message bubble list with collapsible tool cards and token consumption stats.

- [ ] **Step 3: Build SessionList filter**
Filter by agent (Delta vs Nazza), platform (Discord, Telegram, CLI), and timestamp.

- [ ] **Step 4: Verify mock session streaming**
Verify rendering of multi-turn sessions with tool calls.

- [ ] **Step 5: Git commit**
Commit session viewer module.

---

### Task 6: Visual Cron & Scheduled Task Scheduler

**Files:**
- Create: `src/components/cron/CronListView.tsx`
- Create: `src/components/cron/CronCard.tsx`
- Create: `src/components/cron/CronRunModal.tsx`

**Interfaces:**
- Consumes: Cron job registry from Hermes API (`id`, `expression`, `description`, `target_channel`, `last_run`).
- Produces: Visual schedule cards, next execution countdown, manual run trigger button.

- [ ] **Step 1: Build CronCard component**
Cron expression badge (e.g. `0 8 * * *`), target delivery badge (Discord/Telegram/Local), toggle switch.

- [ ] **Step 2: Build manual trigger & execution history modal**
Trigger cron immediately and display execution output stream.

- [ ] **Step 3: Wire into Cron tab**
Connect API state with optimist updates and success toasts.

- [ ] **Step 4: Git commit**
Commit cron scheduler module.

---

### Task 7: Workstation System Metrics & Diagnostics

**Files:**
- Create: `src/components/system/SystemMetricsView.tsx`
- Create: `src/components/system/StorageGauge.tsx`
- Create: `src/components/system/DiagnosticLog.tsx`

**Interfaces:**
- Consumes: System storage, memory, and gateway diagnostics.
- Produces: Visual gauge cards for C: drive, D: drive, RAM, and diagnostic console.

- [ ] **Step 1: Build StorageGauge and MemoryGauge components**
Progress bars with warning threshold colors (>80% amber, >90% red).

- [ ] **Step 2: Build DiagnosticLog viewer**
Log output with log level filters (`INFO`, `WARN`, `ERROR`).

- [ ] **Step 3: Wire into System Health tab**
Connect to diagnostics data.

- [ ] **Step 4: Git commit**
Commit system metrics module.

---

### Task 8: Verification, End-to-End Build & Launch Script

**Files:**
- Create: `src/App.tsx`
- Create: `D:\Project\Naxx-Workstation\hermes-dashboard\README.md`
- Create: `D:\Project\Naxx-Workstation\hermes-dashboard\start-dashboard.bat`

**Interfaces:**
- Consumes: All modules combined.
- Produces: Clean production build and one-click launch batch script.

- [ ] **Step 1: Run typecheck and full test suite**
Run: `npm run build` and `npx vitest run`.

- [ ] **Step 2: Create start-dashboard.bat script**
One-click Windows batch script to launch dev/preview server.

- [ ] **Step 3: Verify all navigation tabs and error states**
Test responsive layout and offline gateway handling.

- [ ] **Step 4: Git commit & push**
Commit and push all changes to origin.
