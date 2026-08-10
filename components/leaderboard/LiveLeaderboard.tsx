"use client"
import { LeaderboardEntry } from '../../lib/types'
import { flagUrl } from '../../lib/flags'

const RED: [number, number, number] = [255, 69, 58]
const GREEN: [number, number, number] = [86, 217, 43]
const TURQUOISE = '#2DD4BF'

function progressColor(pct: number, allowOverflow: boolean) {
  if (allowOverflow && pct > 100) return TURQUOISE
  const t = Math.max(0, Math.min(90, pct)) / 90
  const rgb = RED.map((c, i) => Math.round(c + (GREEN[i] - c) * t))
  return `rgb(${rgb.join(',')})`
}

function Pill({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex-1 min-w-[120px] rounded-xl bg-elevated/60 border border-border px-4 py-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-secondaryText">{label}</div>
      <div className="text-lg font-bold mt-1" style={color ? { color } : undefined}>
        {value}
      </div>
    </div>
  )
}

// Home-page quick-glance strip — a compact version of DetailedLeaderboard's
// solo progress card. No POS/GAP columns (nothing to rank against with a
// single team), just the numbers that matter at a glance.
export default function LiveLeaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  const team = entries[0]
  if (!team) {
    return <div className="text-secondaryText text-sm">No data yet — check back once sales start coming in.</div>
  }
  const flag = flagUrl(team.countryCode)

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {flag && <img src={flag} alt="" className="w-7 h-5 rounded object-cover border border-border" />}
        <div className="font-bold text-lg">{team.teamCode}</div>
        <div className="text-sm text-secondaryText">{team.currentStage || '—'}</div>
        <div className="ml-auto text-sm text-secondaryText">
          LAP <span className="font-bold text-yellow">{team.lap}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Pill label="Current km" value={`${Math.round(team.totalDistance).toLocaleString()} km`} />
        <Pill label="Today" value={`${Math.round(team.kmToday)} km`} color={progressColor(team.targetPct, true)} />
        <Pill label="% of target" value={`${team.targetPct.toFixed(1)}%`} color={progressColor(team.targetPct, true)} />
        <Pill label="Distance to next town" value={`${Math.round(team.kmToNextWaypoint).toLocaleString()} km`} color={progressColor(team.legProgressPct, false)} />
      </div>
    </div>
  )
}
