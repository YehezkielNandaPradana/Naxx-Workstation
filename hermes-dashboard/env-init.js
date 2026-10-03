import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const envPath = join(__dirname, '.env')

if (existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(envPath)
  } catch (e) {
    console.warn('[env-init] Failed to load local .env:', e.message)
  }
}

// Fallback search for Hermes gateway API key
if (!process.env.HERMES_API_TOKEN) {
  const possiblePaths = [
    join(homedir(), 'AppData', 'Local', 'hermes', '.env'),
    join(homedir(), '.hermes', '.env'),
  ]
  for (const p of possiblePaths) {
    if (existsSync(p)) {
      try {
        const content = readFileSync(p, 'utf-8')
        const match = content.match(/API_SERVER_KEY=(.+)/)
        if (match && match[1]) {
          process.env.HERMES_API_TOKEN = match[1].trim()
          break
        }
      } catch {}
    }
  }
}

if (!process.env.HERMES_API_TOKEN) {
  process.env.HERMES_API_TOKEN = 'hermes-workspace-secret-key-12345'
}

console.log('[env-init] Hermes Gateway Bearer Token initialized.')
