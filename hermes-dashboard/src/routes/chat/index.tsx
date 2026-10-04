import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/')({
  ssr: false,
  beforeLoad: () => {
    let target = 'main'
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('claude-last-session')
        if (stored && stored.trim() && stored !== 'undefined') {
          target = stored.trim()
        }
      }
    } catch {}
    throw redirect({
      to: '/chat/$sessionKey',
      params: { sessionKey: target },
      replace: true,
    })
  },
  component: () => null,
})
