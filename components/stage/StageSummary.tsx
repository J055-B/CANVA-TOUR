"use client"
import { useEffect, useState } from 'react'
import { LeaderboardEntry } from '../../lib/types'
import { LOOP_KM } from '../../data/route'

function formatTimeLeft(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// "Board closes" = the Tour's daily business-day cutoff — midnight Israel
// time (Asia/Jerusalem), regardless of the viewer's own timezone. This used
// to be a hardcoded countdown that started at a fixed "8h24m38s" and just
// ticked down to zero and sat there — never actually tied to a real
// deadline, and never came back the next day. Recomputed from the real
// clock every tick (not decremented), so it can't drift and resets itself
// at midnight automatically.
function msUntilNextMidnightInIsrael(now: Date) {
  const israelNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }))
  const nextMidnight = new Date(israelNow)
  nextMidnight.setHours(24, 0, 0, 0)
  return nextMidnight.getTime() - israelNow.getTime()
}

export default function StageSummary({ team }: { team?: LeaderboardEntry }) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  // CURRENT DISTANCE used to read team.dailyTarget (a target, not actual
  // progress — always showed the same number regardless of real sales).
  // ROUTE TARGET used to read team.totalTarget, a field that was declared
  // in types.ts but never populated anywhere — every team races the same
  // 17,250km loop, so that's the real target, not something sourced
  // per-team from the sheet (that's monthlyTarget, a sales quota in
  // count/USD — a different unit entirely, wrong to label "km").
  const currentDistance = team?.totalDistance ?? 0
  const routeTarget = LOOP_KM
  const percent = routeTarget ? (currentDistance / routeTarget) * 100 : team?.targetPct ?? 0

  useEffect(() => {
    const tick = () => setTimeLeft(msUntilNextMidnightInIsrael(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rounded-lg p-4 app-surface">
      <h4 className="font-semibold">ROUTE SUMMARY</h4>
      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
        <div className="p-3 bg-elevated rounded">
          <div className="text-xs text-secondaryText">CURRENT DISTANCE</div>
          <div className="font-bold mt-1">{Math.round(currentDistance).toLocaleString()} km</div>
        </div>
        <div className="p-3 bg-elevated rounded">
          <div className="text-xs text-secondaryText">ROUTE TARGET</div>
          <div className="font-bold mt-1">{routeTarget ? `${Math.round(routeTarget).toLocaleString()} km` : '—'}</div>
        </div>
        <div className="p-3 bg-elevated rounded">
          <div className="text-xs text-secondaryText">% OF ROUTE</div>
          <div className="font-bold mt-1">{percent.toFixed(1)}%</div>
        </div>
        <div className="p-3 bg-elevated rounded">
          <div className="text-xs text-secondaryText">BOARD CLOSES IN</div>
          <div className="font-bold mt-1">{timeLeft === null ? '—' : formatTimeLeft(timeLeft)}</div>
        </div>
      </div>
    </div>
  )
}
