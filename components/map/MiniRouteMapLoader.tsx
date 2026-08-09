'use client'

import nextDynamic from 'next/dynamic'
import { LeaderboardEntry, RoutePoint } from '../../lib/types'

// Same reasoning as RouteMapLoader: `ssr: false` only works from a Client
// Component, and Leaflet touches `window` on import.
const MiniRouteMap = nextDynamic(() => import('./MiniRouteMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-xs text-secondaryText">Loading map…</div>
})

export default function MiniRouteMapLoader({ waypoints, teams }: { waypoints: RoutePoint[]; teams: LeaderboardEntry[] }) {
  return <MiniRouteMap waypoints={waypoints} teams={teams} />
}
