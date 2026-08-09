"use client"
import React from 'react'
import { Trophy } from 'lucide-react'
import { LeaderboardEntry } from '../../lib/types'
import { flagUrl } from '../../lib/flags'

const MEDAL_COLOR: Record<number, string> = {
  1: '#FFD700', // gold
  2: '#C0C0C0', // silver
  3: '#CD7F32' // bronze
}

const RED: [number, number, number] = [255, 69, 58] // matches tailwind "negative"
const GREEN: [number, number, number] = [86, 217, 43] // matches tailwind "positive"
const TURQUOISE = '#2DD4BF'

// Red at 0%, green by 90%+ — a smooth gradient, not a stepped traffic light.
// `allowOverflow` lets TODAY turn turquoise once a team clears 100% of target.
function progressColor(pct: number, allowOverflow: boolean) {
  if (allowOverflow && pct > 100) return TURQUOISE
  const t = Math.max(0, Math.min(90, pct)) / 90
  const rgb = RED.map((c, i) => Math.round(c + (GREEN[i] - c) * t))
  return `rgb(${rgb.join(',')})`
}

// Shared between the header and every row so columns line up.
const GRID_COLS = '56px 1.3fr 1fr 1.4fr 0.9fr 0.9fr 0.9fr 1fr 0.6fr'

function Position({ pos }: { pos: number }) {
  const color = MEDAL_COLOR[pos]
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-4 shrink-0 flex items-center justify-center">{color && <Trophy size={16} color={color} fill={color} />}</span>
      <span className="font-bold">{pos}</span>
    </span>
  )
}

export default function LiveLeaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[880px]">
        <div className="grid gap-4 px-4 pb-1 text-xs font-bold uppercase tracking-wider text-secondaryText" style={{ gridTemplateColumns: GRID_COLS }}>
          <div>POS</div>
          <div>TEAM</div>
          <div>CURRENT KM</div>
          <div>ROUTE TARGET</div>
          <div>TODAY</div>
          <div>DISTANCE</div>
          <div>GAP</div>
          <div>COUNTRY</div>
          <div>LAP</div>
        </div>
        <div className="mt-3 space-y-2">
          {entries.map((e, i) => {
            const pos = i + 1
            const flag = flagUrl(e.countryCode)
            const isLeader = pos === 1
            return (
              <div
                key={e.id}
                className={
                  'grid items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors ' +
                  (isLeader
                    ? 'bg-gradient-to-r from-yellow/25 via-yellow/10 to-transparent border border-yellow shadow-[0_0_20px_-6px_rgba(255,212,0,0.6)]'
                    : 'bg-elevated/60 border border-border')
                }
                style={{ gridTemplateColumns: GRID_COLS }}
              >
                <div>
                  <Position pos={pos} />
                </div>
                <div className="font-medium">{e.teamCode}</div>
                <div>{Math.round(e.totalDistance).toLocaleString()} km</div>
                <div className="text-secondaryText">{e.currentStage || '—'}</div>
                <div className="font-semibold" style={{ color: progressColor(e.targetPct, true) }}>
                  {Math.round(e.kmToday)} km
                </div>
                <div className="font-semibold" style={{ color: progressColor(e.legProgressPct, false) }}>
                  {Math.round(e.kmToNextWaypoint).toLocaleString()} km
                </div>
                <div>
                  {e.gap === 0 ? <span className="text-secondaryText">—</span> : <span className="text-negative font-semibold">-{Math.abs(e.gap)} km</span>}
                </div>
                <div className="flex items-center gap-2">
                  {flag && <img src={flag} alt="" className="w-5 h-3.5 rounded-sm object-cover border border-border" />}
                  {e.countryCode}
                </div>
                <div>{e.lap}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
