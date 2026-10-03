import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, normalize, sep } from 'node:path'

function isProfilesChild(pathValue: string): boolean {
  const parts = normalize(pathValue).split(sep).filter(Boolean)
  return parts.length >= 2 && parts.at(-2) === 'profiles'
}

function isProfileHome(pathValue: string): boolean {
  const parts = normalize(pathValue).split(sep).filter(Boolean)
  return parts.length >= 3 && parts.at(-3) === 'profiles' && parts.at(-1) === 'home'
}

function hermesRootFromProfile(pathValue: string): string | null {
  if (isProfilesChild(pathValue)) {
    return dirname(dirname(pathValue))
  }
  if (isProfileHome(pathValue)) {
    return dirname(dirname(dirname(pathValue)))
  }
  return null
}

export function getHermesRoot(): string {
  const envHome = process.env.HERMES_HOME || process.env.CLAUDE_HOME
  if (envHome) {
    const profileRoot = hermesRootFromProfile(envHome)
    if (profileRoot) return profileRoot
    return envHome
  }

  const osHome = homedir()
  const profileRoot = hermesRootFromProfile(osHome)
  if (profileRoot) return profileRoot
  return join(osHome, '.hermes')
}

export function getProfilesDir(): string {
  return join(getHermesRoot(), 'profiles')
}

export function getWorkspaceHermesHome(): string {
  return getHermesRoot()
}

export function getProfileHermesHome(profileId: string): string {
  return join(getProfilesDir(), profileId)
}

export function getUserHomeForHermesRoot(): string {
  const root = getHermesRoot()
  if (root.endsWith(`${sep}.hermes`)) return dirname(root)
  return homedir()
}

export function getLocalBinDir(): string {
  return join(getUserHomeForHermesRoot(), '.local', 'bin')
}

export function resolveHermesCliBin(): string {
  const isWin = process.platform === 'win32'
  const appData = process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local')
  const candidates = [
    process.env.HERMES_CLI_BIN,
    // Windows paths
    isWin ? join(appData, 'hermes', 'hermes-agent', 'venv', 'Scripts', 'hermes.exe') : '',
    isWin ? join(homedir(), '.hermes', 'hermes-agent', 'venv', 'Scripts', 'hermes.exe') : '',
    isWin ? join(appData, 'hermes', 'bin', 'hermes.exe') : '',
    // Unix paths
    join(homedir(), '.hermes', 'hermes-agent', 'venv', 'bin', 'hermes'),
    join(homedir(), '.local', 'bin', 'hermes'),
    'hermes',
  ].filter((v): v is string => Boolean(v))

  for (const c of candidates) {
    if (c.includes('/') || c.includes('\\')) {
      if (existsSync(c)) return c
      continue
    }
    return c
  }
  return 'hermes'
}

// Legacy aliases for callers not yet renamed.
export const getClaudeRoot = getHermesRoot
export const getWorkspaceClaudeHome = getWorkspaceHermesHome
export const getProfileClaudeHome = getProfileHermesHome
export const getUserHomeForClaudeRoot = getUserHomeForHermesRoot
