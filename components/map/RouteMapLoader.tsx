'use client'

import nextDynamic from 'next/dynamic'
import { LeaderboardEntry, RoutePoint } from '../../lib/types'

// next/dynamic's `ssr: false` can only be used from a Client Component —
// this thin wrapper exists so app/map/page.tsx (a Server Component) can
// still avoid server-rendering Leaflet, which touches `window` on import.
const RouteMap = nextDynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => <div className="h-[520px] w-full rounded-lg app-surface flex items-center justify-center text-secondaryText">Loading map…</div>
})

export default function RouteMapLoader({ waypoints, teams }: { waypoints: RoutePoint[]; teams: LeaderboardEntry[] }) {
  return <RouteMap waypoints={waypoints} teams={teams} />
}
