'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MONITOR_MODE_STORAGE_KEY, MONITOR_MODE_EVENT } from '../../lib/monitor-mode'

const HOME_DWELL_MS = 2 * 60 * 1000 // 2 min on the home page
const MAP_DWELL_MS = 2 * 60 * 1000 // 2 min on the map

// Optional kiosk/TV loop, off by default: home (2 min) -> full map (2 min)
// -> back to home, repeating. Simpler than the main Tour de Callisto's
// MonitorMode — that one also spotlights each team in turn on the map
// (?focus=N, 15s each), which only makes sense with multiple teams to
// cycle through; Canva's private single-team edition just alternates the
// two pages. Toggled from the sidebar; persisted in localStorage so a
// kiosk display keeps it on across refreshes. Lives in the root layout
// (never unmounts on navigation) so its timers survive route changes.
export default function MonitorMode() {
  const router = useRouter()
  const [enabled, setEnabled] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const read = () => setEnabled(localStorage.getItem(MONITOR_MODE_STORAGE_KEY) === '1')
    read()
    window.addEventListener('storage', read)
    window.addEventListener(MONITOR_MODE_EVENT, read)
    return () => {
      window.removeEventListener('storage', read)
      window.removeEventListener(MONITOR_MODE_EVENT, read)
    }
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!enabled) return

    function schedule(delay: number, action: () => void) {
      timerRef.current = setTimeout(action, delay)
    }

    function goHome() {
      router.replace('/dashboard')
      schedule(HOME_DWELL_MS, goMap)
    }

    function goMap() {
      router.replace('/map')
      schedule(MAP_DWELL_MS, goHome)
    }

    goHome()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return null
}
