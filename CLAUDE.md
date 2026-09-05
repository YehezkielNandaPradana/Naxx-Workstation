# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development server**: `npm run dev`
- **Build production bundle**: `npm run build` (`tsc -b && vite build`)
- **Lint**: `npm run lint` (`oxlint`)
- **Preview build**: `npm run preview`

Note: No automated test suite configured.

## Architecture

Telegram Mini App UI clone tailored for Naxx Workstation multi-agent operations (Delta and Nazza).

- **Stack**: React 19, TypeScript, Vite, Tailwind CSS v4 (`@tailwindcss/postcss`), Lucide icons, `@telegram-apps/sdk-react`.
- **Backend & Gateway**: Local 9Router gateway at `http://127.0.0.1:20128`, proxied via Vite dev server (`/v1`).
- **Agents & Persona**:
  - `delta`: Persona logic/solution assistant (`Delta` model).
  - `nazza`: Laptop executor agent (`AntigravityCombo` model), supports tool execution cards (Reading, Editing, Terminal/PowerShell).
- **Core Files**:
  - `src/App.tsx`: Main view routing (thread list vs active Telegram chat view) and chat message state.
  - `src/api.ts`: Gateway caller (`sendLiveChatMessage`), handles system prompts, history sliding window, JSON and SSE fallback parsing.
  - `src/types.ts`: Domain models (`AgentId`, `MessageItem`, `ToolAction`, `ChatThread`).
  - `vite.config.ts`: Dev server proxy configuration to 9Router.
