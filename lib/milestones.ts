import route, { LOOP_KM } from '../data/route'

export interface MilestonePoint {
  name: string
  countryCode: string
  /** Position along this stage's flat bar, 0 (stage start) to 1 (stage end) — rescaled from the real route so points spread evenly across the standardized width. */
  fraction: number
}

export interface MilestoneStage {
  index: number // 1-based, matches the 19 Sofia-to-Sofia stages below
  label: string
  isPowerStage: boolean
  powerLabel?: string
  /**
   * Standardized milestone-space cumulative boundaries. Unlike the world
   * Tour de Callisto (which flattens every stage to an even 1000/1500km
   * for a tidy chart), Bulgaria's real milestone-to-milestone distances
   * are used directly here — they vary too much (44km to 375km) to fake
   * into equal-width bars without being misleading, and there's no
   * "weekend power stage" concept tied to the route itself for this
   * single-team edition (the calendar-based weekend rate bonus in
   * lib/calculations.ts still applies, independent of stage boundaries).
   */
  fromKm: number
  toKm: number
  widthKm: number
  points: MilestonePoint[]
  /** Real (actually driven) cumulative-km boundaries — used only to map a team's real totalDistance onto this stage's flat bar below. */
  realFromKm: number
  realToKm: number
}

interface StageDef {
  label: string
  endId: string
  milestoneWidth: number
  powerLabel?: string
}

// The 20 official Google Maps milestones from the route documentation chunk
// this 2,500km Sofia-to-Sofia loop into 19 stages. See
// tour_of_bulgaria_2500km_route_documentation.md's "Official milestone
// order" for the source list.
const STAGE_DEFS: StageDef[] = [
  { label: 'Sofia → Lom', endId: 'lom', milestoneWidth: 175.5 },
  { label: 'Lom → Ruse', endId: 'ruse', milestoneWidth: 374.7 },
  { label: 'Ruse → Silistra', endId: 'silistra', milestoneWidth: 146.3 },
  { label: 'Silistra → Shumen', endId: 'shumen', milestoneWidth: 136.1 },
  { label: 'Shumen → Varna', endId: 'varna', milestoneWidth: 117.6 },
  { label: 'Varna → Burgas', endId: 'burgas', milestoneWidth: 132.9 },
  { label: 'Burgas → Sliven', endId: 'sliven', milestoneWidth: 131.7 },
  { label: 'Sliven → Svilengrad', endId: 'svilengrad', milestoneWidth: 174.2 },
  { label: 'Svilengrad → Krumovgrad', endId: 'krumovgrad', milestoneWidth: 192.2 },
  { label: 'Krumovgrad → Rudozem', endId: 'rudozem', milestoneWidth: 131.2 },
  { label: 'Rudozem → Dospat', endId: 'dospat', milestoneWidth: 115.6 },
  { label: 'Dospat → Plovdiv', endId: 'plovdiv', milestoneWidth: 160.8 },
  { label: 'Plovdiv → Pazardzhik', endId: 'pazardzhik', milestoneWidth: 44.2 },
  { label: 'Pazardzhik → Bansko', endId: 'bansko', milestoneWidth: 130.6 },
  { label: 'Bansko → Gotse Delchev', endId: 'gotse-delchev', milestoneWidth: 56.3 },
  { label: 'Gotse Delchev → Sandanski', endId: 'sandanski', milestoneWidth: 90.0 },
  { label: 'Sandanski → Blagoevgrad', endId: 'blagoevgrad', milestoneWidth: 68.3 },
  { label: 'Blagoevgrad → Dupnitsa', endId: 'dupnitsa', milestoneWidth: 35.8 },
  { label: 'Dupnitsa → Sofia', endId: 'sofia-finish', milestoneWidth: 86.0 }
]

export const MILESTONE_STAGES: MilestoneStage[] = (() => {
  let realCursor = 0
  let milestoneCursor = 0
  let ptCursor = 0

  return STAGE_DEFS.map((def, i) => {
    const endIndex = route.findIndex((w) => w.id === def.endId)
    const realFromKm = realCursor
    const realToKm = route[endIndex].cumulativeKm
    const span = realToKm - realFromKm

    // Inner towns/villages strictly between this stage's start and its own
    // endpoint.
    const points: MilestonePoint[] = route
      .slice(ptCursor, endIndex)
      .filter((w) => w.cumulativeKm > realFromKm)
      .map((w) => ({
        name: w.name,
        countryCode: w.countryCode,
        fraction: span ? (w.cumulativeKm - realFromKm) / span : 0
      }))

    const fromKm = milestoneCursor
    const toKm = milestoneCursor + def.milestoneWidth

    realCursor = realToKm
    milestoneCursor = toKm
    ptCursor = endIndex + 1

    return {
      index: i + 1,
      label: def.label,
      isPowerStage: !!def.powerLabel,
      powerLabel: def.powerLabel,
      fromKm,
      toKm,
      widthKm: def.milestoneWidth,
      points,
      realFromKm,
      realToKm
    }
  })
})()

export const MILESTONE_TOTAL_KM = MILESTONE_STAGES[MILESTONE_STAGES.length - 1].toKm

// Maps the team's real totalDistance onto the flat milestone chart: which
// of the 19 stages they're currently in, and how far across that stage's
// bar (0-1) — ignores lap number, always relative to the current lap's
// position.
export function milestonePositionForDistance(totalDistance: number) {
  const wrapped = ((totalDistance % LOOP_KM) + LOOP_KM) % LOOP_KM

  let stage = MILESTONE_STAGES[MILESTONE_STAGES.length - 1]
  for (const s of MILESTONE_STAGES) {
    if (wrapped <= s.realToKm) {
      stage = s
      break
    }
  }

  const span = stage.realToKm - stage.realFromKm
  const fraction = span ? Math.max(0, Math.min(1, (wrapped - stage.realFromKm) / span)) : 0

  return { stageIndex: stage.index, fraction }
}

export interface StageBoundaryPoint {
  /** The stage that ENDS here (1-19). 0 = the very first point (Sofia, the tour's overall start). */
  stageIndex: number | null
  name: string
  countryCode: string
  coords: [number, number]
}

// The cities where one stage hands off to the next (Sofia + each of the 19
// STAGE_DEFS endpoints) — plotted as bigger red dots on the full map so
// it's visually obvious where each stage starts/ends. Bulgaria's route has
// no flights (every leg is a real road), so unlike the world Tour there's
// no separate "flight-arrival" pass needed here — kept for structural
// parity with the world Tour's milestones.ts in case that ever changes.
export const STAGE_BOUNDARY_POINTS: StageBoundaryPoint[] = (() => {
  const first = route[0]
  const points: StageBoundaryPoint[] = [
    { stageIndex: 0, name: first.name, countryCode: first.countryCode, coords: first.coords as [number, number] }
  ]
  STAGE_DEFS.forEach((def, i) => {
    const wp = route.find((w) => w.id === def.endId)
    if (!wp) return
    points.push({ stageIndex: i + 1, name: wp.name, countryCode: wp.countryCode, coords: wp.coords as [number, number] })
  })
  for (let i = 1; i < route.length; i++) {
    if (route[i].cumulativeKm !== route[i - 1].cumulativeKm) continue
    const wp = route[i]
    const already = points.some((p) => p.coords[0] === wp.coords?.[0] && p.coords[1] === wp.coords?.[1])
    if (!already) points.push({ stageIndex: null, name: wp.name, countryCode: wp.countryCode, coords: wp.coords as [number, number] })
  }
  return points
})()
