"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { LeaderboardEntry } from '../../lib/types'

const TOUR_START_DATE = '2026-08-10'
const TOUR_END_DATE = '2026-08-31'
const OPENING_HOUR = 8

function formatTimeLeft(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function getCompetitionWindow(now: Date) {
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()
  const today = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  if (today < TOUR_START_DATE || today > TOUR_END_DATE) return null

  // The opening day (10 Aug) starts at 08:00. Every following competition
  // day runs normally from 00:00 through 23:59:59 local browser time.
  if (today === TOUR_START_DATE && now.getHours() < OPENING_HOUR) return null

  const closesAt = new Date(now)
  closesAt.setHours(23, 59, 59, 999)
  return closesAt.getTime() - now.getTime()
}

export default function StageSummary({ team }: { team?: LeaderboardEntry }) {
  const [now, setNow] = useState(() => new Date())
  const currentDistance = team?.totalDistance ?? 0
  const routeTarget = team?.totalTarget ?? 0
  const percent = routeTarget ? (currentDistance / routeTarget) * 100 : team?.targetPct ?? 0
  const timeLeft = useMemo(() => getCompetitionWindow(now), [now])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="rounded-lg p-4 app-surface">
      <h4 className="font-semibold">STAGE SUMMARY</h4>
      <div className={`grid ${timeLeft !== null ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mt-3 text-sm`}>
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
        {timeLeft !== null && (
          <div className="p-3 bg-elevated rounded">
            <div className="text-xs text-secondaryText">TIME LEFT TODAY</div>
            <div className="font-bold mt-1">{formatTimeLeft(timeLeft)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
