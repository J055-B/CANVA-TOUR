export type Segment = 'FTD' | 'RET'

export interface Team {
  id: string
  teamCode: string
  pool: 'FTD' | 'RET'
  initials: string
  location: string
  language: string
  dailyTarget: number
  salesToday: number
  /** Total sales quota from the Target sheet's "Targ" column — in sale count (FTD) or USD (RET), NOT km. Informational only, not used in km math. */
  monthlyTarget?: number
  countryCode: string
  countryName: string
  currentStage: string
  /** Per-day sale counts, keyed by "Conversion Date" (YYYY-MM-DD), used to compute distance day by day. */
  dailyHistory?: { date: string; sales: number }[]
  totalDistance?: number
  weeklyDistance?: number
}

export interface LeaderboardEntry extends Team {
  targetPct: number
  kmToday: number
  totalDistance: number
  weeklyDistance: number
  /** Raw sales this week (count for FTD, USD for RET), not km — compare against weeklyTargetForToday's result, never against weeklyDistance. */
  weeklySales: number
  gap: number
  lap: number
  /** Km remaining to reach the destination named in currentStage. */
  kmToNextWaypoint: number
  /** % of the current leg (currentStage's from -> to) already covered, 0-100. */
  legProgressPct: number
  /**
   * countryCode/countryName/currentStage on a LeaderboardEntry are the
   * team's LIVE position on the route (derived from totalDistance) — not
   * their home desk. See Team.location/language for home-base info.
   */
}

export interface RoutePoint {
  id: string
  name: string
  countryCode: string
  countryName: string
  /** Cumulative driving km from Sofia (loop start) to this waypoint. */
  cumulativeKm: number
  /** Not researched for every waypoint yet — populate when the real map ships. */
  coords?: [number, number]
}
