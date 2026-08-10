import React from 'react'
import { Flag, Trophy, MapPin } from 'lucide-react'
import { getLeaderboard } from '../../../lib/data-source'
import { LOOP_KM } from '../../../data/route'
import { STAGE_BOUNDARY_POINTS, MILESTONE_STAGES } from '../../../lib/milestones'

export const dynamic = 'force-dynamic'

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

// Canva's private, single-team edition has nobody to crown a "winner"
// against — this used to be a Tour Champion / Weekly Winner ranking page
// (see the main Tour de Callisto's version). Repurposed as a milestone
// checklist instead: which of the 19 official Bulgarian towns has the team
// already ridden past this lap, and how many full laps they've completed
// overall. Default choice, not explicitly requested — happy to change the
// framing if this isn't the right call.
export default async function PrizesPage() {
  const leaderboard = await getLeaderboard()
  const team = leaderboard[0]
  const totalDistance = team?.totalDistance ?? 0
  const wrapped = ((totalDistance % LOOP_KM) + LOOP_KM) % LOOP_KM
  const lapsCompleted = Math.floor(totalDistance / LOOP_KM)

  // STAGE_BOUNDARY_POINTS includes the very start (stageIndex 0, Sofia) —
  // skip it here since "reached the start" isn't a milestone worth
  // celebrating on its own.
  const milestones = STAGE_BOUNDARY_POINTS.filter((p) => p.stageIndex !== 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Milestones</h1>

      <div className="p-4 app-surface rounded-lg border border-border mb-6">
        <SectionHeader icon={<Trophy size={16} color="#FFD400" />} accent="#FFD400" title="LAPS COMPLETED" subtitle="Every full 2,500km loop of Bulgaria" />
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-yellow">{lapsCompleted}</div>
          <div className="text-sm text-secondaryText">
            Currently on lap <span className="text-primaryText font-semibold">{team?.lap ?? 1}</span>
            <br />
            {Math.round(totalDistance).toLocaleString()} km ridden in total
          </div>
        </div>
      </div>

      <div className="p-4 app-surface rounded-lg border border-border">
        <SectionHeader icon={<Flag size={16} color="#2DD4BF" />} accent="#2DD4BF" title="THIS LAP'S CHECKPOINTS" subtitle="The 19 official towns along the route" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {milestones.map((m) => {
            // stageIndex N's boundary point is reached exactly when the
            // team's wrapped distance has cleared that stage's real end-km
            // — MILESTONE_STAGES is 0-indexed, stageIndex is 1-based.
            const stage = m.stageIndex !== null ? MILESTONE_STAGES[m.stageIndex - 1] : null
            const reached = stage ? wrapped >= stage.realToKm : false
            return (
              <div
                key={m.name + m.stageIndex}
                className={
                  'flex items-center gap-2 rounded-lg px-3 py-2.5 border text-sm ' +
                  (reached ? 'bg-positive/10 border-positive/40 text-primaryText' : 'bg-elevated/40 border-border text-secondaryText')
                }
              >
                <MapPin size={13} className={reached ? 'text-positive shrink-0' : 'text-secondaryText shrink-0'} />
                <span className="font-medium">{m.name}</span>
                {reached && <span className="ml-auto text-positive text-xs font-bold">✓</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
