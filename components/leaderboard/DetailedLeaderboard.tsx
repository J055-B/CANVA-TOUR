"use client"
import React from 'react'
import { Trophy, Target, Bike, MapPin } from 'lucide-react'
import { LeaderboardEntry } from '../../lib/types'
import { flagUrl } from '../../lib/flags'
import { weeklyTargetForToday, computeTargetPct } from '../../lib/calculations'
import { LOOP_KM } from '../../data/route'

const RED: [number, number, number] = [255, 69, 58]
const GREEN: [number, number, number] = [86, 217, 43]
const TURQUOISE = '#2DD4BF'

function progressColor(pct: number, allowOverflow: boolean) {
  if (allowOverflow && pct > 100) return TURQUOISE
  const t = Math.max(0, Math.min(90, pct)) / 90
  const rgb = RED.map((c, i) => Math.round(c + (GREEN[i] - c) * t))
  return `rgb(${rgb.join(',')})`
}

function journeyPctFor(totalDistance: number) {
  const wrapped = ((totalDistance % LOOP_KM) + LOOP_KM) % LOOP_KM
  return (wrapped / LOOP_KM) * 100
}

// Icon badge + title + subtitle + a gradient underline that fades out.
function SectionHeader({ icon, accent, title, subtitle }: { icon: React.ReactNode; accent: string; title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}1F`, border: `1px solid ${accent}59` }}>
          {icon}
        </span>
        <div>
          <div className="text-lg font-bold tracking-wide">{title}</div>
          <div className="text-xs text-secondaryText mt-0.5">{subtitle}</div>
        </div>
      </div>
      <div className="h-0.5 mt-3 rounded-full" style={{ background: `linear-gradient(90deg, ${accent} 0%, ${accent}26 40%, transparent 75%)` }} />
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="flex items-center gap-3.5 my-7">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
      <span className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center shrink-0 text-secondaryText">
        <Bike size={15} />
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl bg-elevated/60 border border-border px-5 py-4">
      <div className="text-xs font-bold uppercase tracking-wider text-secondaryText">{label}</div>
      <div className="text-2xl font-bold mt-1.5" style={color ? { color } : undefined}>
        {value}
      </div>
      {sub && <div className="text-xs text-secondaryText mt-1">{sub}</div>}
    </div>
  )
}

// Canva's private, single-team Tour of Bulgaria has no one to rank against
// — so instead of the world Tour's ranked table (POS/GAP columns, medal
// colors, "who's ahead"), this is a solo progress dashboard: the same
// underlying numbers (today's pace, journey %, distance to the next town,
// lap count), just framed as "how are we doing" rather than "who's
// winning".
export default function DetailedLeaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  const team = entries[0]

  if (!team) {
    return (
      <div className="rounded-lg p-6 app-surface border border-border text-secondaryText text-sm">
        No data yet — check back once sales start coming in.
      </div>
    )
  }

  const flag = flagUrl(team.countryCode)
  const journeyPct = journeyPctFor(team.totalDistance)
  const weeklyTarget = weeklyTargetForToday(team.dailyTarget, team.teamCode)
  const weeklyPct = computeTargetPct(team.weeklyDistance, weeklyTarget)

  return (
    <div>
      <SectionHeader icon={<Trophy size={16} color="#FFD400" />} accent="#FFD400" title="MY PROGRESS" subtitle="Canva's live standing on the Tour of Bulgaria" />

      <div className="rounded-2xl bg-gradient-to-r from-yellow/20 via-yellow/5 to-transparent border border-yellow px-5 py-4 mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {flag && <img src={flag} alt="" className="w-8 h-5.5 rounded object-cover border border-border" />}
          <div>
            <div className="text-xl font-bold">{team.teamCode}</div>
            <div className="text-xs text-secondaryText flex items-center gap-1 mt-0.5">
              <MapPin size={11} />
              {team.currentStage || '—'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-secondaryText">LAP</div>
          <div className="text-2xl font-bold text-yellow">{team.lap}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Current distance" value={`${Math.round(team.totalDistance).toLocaleString()} km`} />
        <StatCard label="% of journey" value={`${journeyPct.toFixed(1)}%`} color={progressColor(journeyPct, false)} sub={`out of ${LOOP_KM.toLocaleString()} km`} />
        <StatCard label="Today" value={`${Math.round(team.kmToday)} km`} color={progressColor(team.targetPct, true)} sub={`${team.targetPct.toFixed(1)}% of daily target`} />
        <StatCard
          label="Distance to next town"
          value={`${Math.round(team.kmToNextWaypoint).toLocaleString()} km`}
          color={progressColor(team.legProgressPct, false)}
        />
        <StatCard label="Weekly target" value={`${weeklyPct.toFixed(1)}%`} color={progressColor(weeklyPct, true)} sub={`${weeklyTarget.toLocaleString()} target this week`} />
        <StatCard label="Daily target" value={team.dailyTarget.toLocaleString()} sub={`${Math.round(team.kmToday)} km sold today`} />
      </div>

      <SectionDivider />

      <div>
        <SectionHeader icon={<Target size={16} color="#2DD4BF" />} accent="#2DD4BF" title="TARGET PACE" subtitle="How today and this week compare to target" />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-elevated/60 border border-border px-5 py-4">
            <div className="text-xs font-bold uppercase tracking-wider text-secondaryText">Daily pace</div>
            <div className="text-3xl font-bold mt-2" style={{ color: progressColor(team.targetPct, true) }}>
              {team.targetPct.toFixed(1)}%
            </div>
            <div className="text-xs text-secondaryText mt-1">
              {Math.round(team.kmToday)} km today / {team.dailyTarget.toLocaleString()} target
            </div>
          </div>
          <div className="rounded-xl bg-elevated/60 border border-border px-5 py-4">
            <div className="text-xs font-bold uppercase tracking-wider text-secondaryText">Weekly pace</div>
            <div className="text-3xl font-bold mt-2" style={{ color: progressColor(weeklyPct, true) }}>
              {weeklyPct.toFixed(1)}%
            </div>
            <div className="text-xs text-secondaryText mt-1">
              {Math.round(team.weeklyDistance).toLocaleString()} km this week / {weeklyTarget.toLocaleString()} target
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
