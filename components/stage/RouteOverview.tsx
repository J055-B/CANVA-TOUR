import Link from 'next/link'
import { LeaderboardEntry, RoutePoint } from '../../lib/types'
import MiniRouteMapLoader from '../map/MiniRouteMapLoader'

// Used to grow to match the left column's height (Hero + Leaderboard), but
// once the Hero grew to its current 3-panel size that made this stretch to
// an absurd height whenever the leaderboard had many rows. Fixed height now.
export default function RouteOverview({ leader, teams, waypoints }: { leader?: LeaderboardEntry; teams: LeaderboardEntry[]; waypoints: RoutePoint[] }) {
  const title = leader?.currentStage || 'Live route'

  return (
    <div className="rounded-lg p-4 app-surface h-[26rem] flex flex-col">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondaryText">Route Overview</p>
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <Link
          href="/map"
          className="w-8 h-8 rounded-full border border-border text-secondaryText hover:bg-yellow/10 transition flex items-center justify-center shrink-0"
          title="Open the full interactive map"
        >
          ▶
        </Link>
      </div>
      <Link href="/map" className="block flex-1 min-h-0 rounded-xl bg-black/30 overflow-hidden">
        <MiniRouteMapLoader waypoints={waypoints} teams={teams} />
      </Link>
    </div>
  )
}
