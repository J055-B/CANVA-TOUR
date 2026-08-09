import { Team, LeaderboardEntry } from './types'
import { LOOP_KM, positionForDistance } from '../data/route'

// CANVA-only Tour of Bulgaria — 10 to 31 August 2026. The Bulgaria route package defines the canonical 2,500 km competition scale.
export const TOUR_START = '2026-08-10'
const TOUR_END = '2026-08-31'

const WEEKS = [
  { start: '2026-08-10', end: '2026-08-16' }, // Week 1
  { start: '2026-08-17', end: '2026-08-23' }, // Week 2
  { start: '2026-08-24', end: '2026-08-31' } // Week 3 (8 days)
]

// km awarded per 1% of daily target hit. Default is 10 (100% = 1,000km).
// Power Stage weekends pay more; everything else uses DEFAULT_RATE.
const POWER_RATE: Record<string, number> = {
  '2026-08-15': 15, // Power Stage 1 (Week 1 weekend)
  '2026-08-16': 15,
  '2026-08-22': 15, // Power Stage 2 (Week 2 weekend)
  '2026-08-23': 15,
  '2026-08-29': 12.5, // Final Power Stage (Week 3 weekend)
  '2026-08-30': 12.5
}
const DEFAULT_RATE = 10

function ratePerPercent(dateStr: string) {
  return POWER_RATE[dateStr] ?? DEFAULT_RATE
}

// Every competition date is a normal calendar day (00:00–23:59).
// The only partial opening day is Aug 10, which starts at 08:00.
function dailyTargetForDate(team: Team, _dateStr: string) {
  return team.dailyTarget
}

export function computeTargetPct(sales: number, target: number) {
  if (!target) return 0
  return (sales / target) * 100
}

function kmForDay(team: Team, dateStr: string, sales: number) {
  const target = dailyTargetForDate(team, dateStr)
  const pct = computeTargetPct(sales, target)
  return pct * ratePerPercent(dateStr)
}

function weekFor(dateStr: string) {
  return WEEKS.find((w) => dateStr >= w.start && dateStr <= w.end)
}

function clampToTourRange(dateStr: string) {
  if (dateStr < TOUR_START) return TOUR_START
  if (dateStr > TOUR_END) return TOUR_END
  return dateStr
}

function eachDateBetween(start: string, end: string) {
  const dates: string[] = []
  let cursor = new Date(start + 'T00:00:00Z')
  const last = new Date(end + 'T00:00:00Z')
  while (cursor <= last) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000)
  }
  return dates
}

function weekUnitsFor(week: { start: string; end: string }, _teamCode: string) {
  return eachDateBetween(week.start, week.end).length
}

// Total km a team would need to hit "on pace" for the CURRENT calendar
// week — used by the /leaderboard page's per-team stat cards. Clamped to
// the tour's date range so it still returns something sensible before
// Aug 10 / after Aug 31. See weekUnitsFor for the Fri/Sat/Sun-as-one-day
// calendar-day rule.
export function weeklyTargetForToday(dailyTarget: number, teamCode: string, today: Date = new Date()) {
  const todayStr = clampToTourRange(today.toISOString().slice(0, 10))
  const week = weekFor(todayStr) ?? WEEKS[WEEKS.length - 1]
  return dailyTarget * weekUnitsFor(week, teamCode)
}

// "DAY x of N" for the Hero panel — N is every calendar day from Aug 10 to
// Aug 31 inclusive (22 days). Clamped so it still reads sensibly before the
// Tour starts (DAY 1) or after it ends (DAY N).
export function tourDayInfo(today: Date = new Date()) {
  const allDays = eachDateBetween(TOUR_START, TOUR_END)
  const todayStr = clampToTourRange(today.toISOString().slice(0, 10))
  const idx = allDays.indexOf(todayStr)
  return { day: idx === -1 ? 1 : idx + 1, totalDays: allDays.length }
}

interface TeamMetrics {
  salesToday: number
  targetPct: number
  kmToday: number
  totalDistance: number
  weeklyDistance: number
}

function computeTeamMetrics(team: Team, todayStr: string): TeamMetrics {
  const salesByDate = new Map((team.dailyHistory ?? []).map((d) => [d.date, d.sales]))
  const lastDay = clampToTourRange(todayStr)
  const currentWeek = weekFor(todayStr) ?? weekFor(lastDay)

  let totalDistance = 0
  let weeklyDistance = 0

  if (todayStr >= TOUR_START) {
    for (const date of eachDateBetween(TOUR_START, lastDay)) {
      const sales = salesByDate.get(date) ?? 0
      const km = kmForDay(team, date, sales)
      totalDistance += km
      if (currentWeek && date >= currentWeek.start && date <= currentWeek.end) {
        weeklyDistance += km
      }
    }
  }

  const salesToday = salesByDate.get(todayStr) ?? 0
  const targetPct = computeTargetPct(salesToday, dailyTargetForDate(team, todayStr))
  const kmToday = kmForDay(team, todayStr, salesToday)

  return { salesToday, targetPct, kmToday, totalDistance, weeklyDistance }
}

export function computeLap(totalDistance: number) {
  return Math.floor(totalDistance / LOOP_KM) + 1
}

// CANVA is the only competitor in this edition.
export function computeLeaderboard(teams: Team[], today: Date = new Date()) {
  const todayStr = today.toISOString().slice(0, 10)

  const entries: LeaderboardEntry[] = teams.map((t) => {
    const metrics = computeTeamMetrics(t, todayStr)
    const position = positionForDistance(metrics.totalDistance)
    return {
      ...t,
      salesToday: metrics.salesToday,
      targetPct: metrics.targetPct,
      kmToday: metrics.kmToday,
      totalDistance: metrics.totalDistance,
      weeklyDistance: metrics.weeklyDistance,
      // Live race position, not the team's home desk — see positionForDistance.
      countryCode: position.countryCode,
      countryName: position.countryName,
      currentStage: position.currentStage,
      kmToNextWaypoint: position.kmToNextWaypoint,
      legProgressPct: position.legProgressPct,
      gap: 0,
      lap: computeLap(metrics.totalDistance)
    }
  })

  entries.sort((a, b) => b.totalDistance - a.totalDistance)
  const leader = entries[0]
  if (leader) {
    entries.forEach((e) => {
      e.gap = Math.round(leader.totalDistance - e.totalDistance)
    })
  }
  return entries
}
