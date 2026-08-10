'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Activity, Map, Trophy, Flag, Info, Tv, LogOut } from 'lucide-react'
import { MONITOR_MODE_STORAGE_KEY, MONITOR_MODE_EVENT } from '../../lib/monitor-mode'
import { clearRole } from '../../lib/session'

const items = [
  { href: '/dashboard', label: 'Race', icon: Activity },
  { href: '/leaderboard', label: 'Progress', icon: Trophy },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/prizes', label: 'Milestones', icon: Flag },
  { href: '/info', label: 'Info', icon: Info }
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [monitorMode, setMonitorMode] = useState(false)

  useEffect(() => {
    setMonitorMode(localStorage.getItem(MONITOR_MODE_STORAGE_KEY) === '1')
  }, [])

  function toggleMonitorMode() {
    const next = !monitorMode
    setMonitorMode(next)
    localStorage.setItem(MONITOR_MODE_STORAGE_KEY, next ? '1' : '0')
    window.dispatchEvent(new Event(MONITOR_MODE_EVENT))
  }

  function logout() {
    clearRole()
    router.push('/')
  }

  return (
    <aside className="w-24 h-screen sticky top-0 shrink-0 flex flex-col items-center py-6 gap-6 bg-elevated border-r border-border overflow-y-auto">
      <div className="w-12 h-12 rounded-full bg-yellow flex items-center justify-center text-black font-bold text-xl">T</div>
      <nav className="flex-1 flex flex-col gap-3">
        {items.map((it) => {
          const Icon = it.icon
          const active = it.href === '/' ? pathname === '/' : pathname?.startsWith(it.href)
          return (
            <Link
              key={it.href}
              href={it.href}
              className={
                'flex h-12 w-12 items-center justify-center rounded-full transition-colors ' +
                (active ? 'bg-yellow/15 text-yellow ring-2 ring-yellow' : 'text-secondaryText hover:bg-yellow/10 hover:text-yellow')
              }
              aria-label={it.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} />
            </Link>
          )
        })}
      </nav>
      <button
        onClick={toggleMonitorMode}
        className={
          'flex h-12 w-12 items-center justify-center rounded-full transition-colors ' +
          (monitorMode ? 'bg-electric/15 text-electric ring-2 ring-electric' : 'text-secondaryText hover:bg-electric/10 hover:text-electric')
        }
        aria-label="Toggle TV / kiosk mode"
        title="TV MODE — auto-cycle home ↔ map"
      >
        <Tv size={18} />
      </button>
      <button
        onClick={logout}
        className="flex h-12 w-12 items-center justify-center rounded-full text-secondaryText hover:bg-negative/10 hover:text-negative transition-colors"
        aria-label="Log out"
        title="Log out — back to the intro screen"
      >
        <LogOut size={18} />
      </button>
      <div className="text-center text-[10px] text-secondaryText leading-4 px-2 shrink-0">THE JOURNEY<br />NEVER STOPS</div>
    </aside>
  )
}
