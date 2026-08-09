import route, { LOOP_KM } from '../data/route'

export interface MilestonePoint { name: string; countryCode: string; fraction: number }
export interface MilestoneStage { index: number; label: string; isPowerStage: boolean; powerLabel?: string; fromKm: number; toKm: number; widthKm: number; points: MilestonePoint[]; realFromKm: number; realToKm: number }

// The supplied route defines 20 official milestones including start and finish.
// Each stage is the road leg between consecutive official milestones.
const MILESTONE_DEFS = [
  { index: 1, start: "Sofia", end: "Lom", startKm: 0.0, endKm: 175.5, endSeq: 8 },
  { index: 2, start: "Lom", end: "Ruse", startKm: 175.5, endKm: 550.2, endSeq: 18 },
  { index: 3, start: "Ruse", end: "Silistra", startKm: 550.2, endKm: 696.5, endSeq: 23 },
  { index: 4, start: "Silistra", end: "Shumen", startKm: 696.5, endKm: 832.6, endSeq: 27 },
  { index: 5, start: "Shumen", end: "Varna", startKm: 832.6, endKm: 950.2, endSeq: 32 },
  { index: 6, start: "Varna", end: "Burgas", startKm: 950.2, endKm: 1083.1, endSeq: 39 },
  { index: 7, start: "Burgas", end: "Sliven", startKm: 1083.1, endKm: 1214.8, endSeq: 43 },
  { index: 8, start: "Sliven", end: "Svilengrad", startKm: 1214.8, endKm: 1389.0, endSeq: 48 },
  { index: 9, start: "Svilengrad", end: "Krumovgrad", startKm: 1389.0, endKm: 1581.2, endSeq: 54 },
  { index: 10, start: "Krumovgrad", end: "Rudozem", startKm: 1581.2, endKm: 1712.4, endSeq: 59 },
  { index: 11, start: "Rudozem", end: "Dospat", startKm: 1712.4, endKm: 1828.0, endSeq: 64 },
  { index: 12, start: "Dospat", end: "Plovdiv", startKm: 1828.0, endKm: 1988.8, endSeq: 70 },
  { index: 13, start: "Plovdiv", end: "Pazardzhik", startKm: 1988.8, endKm: 2033.0, endSeq: 72 },
  { index: 14, start: "Pazardzhik", end: "Bansko", startKm: 2033.0, endKm: 2163.6, endSeq: 77 },
  { index: 15, start: "Bansko", end: "Gotse Delchev", startKm: 2163.6, endKm: 2219.9, endSeq: 81 },
  { index: 16, start: "Gotse Delchev", end: "Sandanski", startKm: 2219.9, endKm: 2309.9, endSeq: 87 },
  { index: 17, start: "Sandanski", end: "Blagoevgrad", startKm: 2309.9, endKm: 2378.2, endSeq: 90 },
  { index: 18, start: "Blagoevgrad", end: "Dupnitsa", startKm: 2378.2, endKm: 2414.0, endSeq: 92 },
  { index: 19, start: "Dupnitsa", end: "Sofia", startKm: 2414.0, endKm: 2500.0, endSeq: 96 }
] as const

export const MILESTONE_STAGES: MilestoneStage[] = MILESTONE_DEFS.map((def) => {
  const startIndex = route.findIndex((w) => w.name === def.start && w.cumulativeKm === def.startKm)
  const endIndex = route.findIndex((w) => w.name === def.end && w.cumulativeKm === def.endKm)
  const span = def.endKm - def.startKm
  const points = route.slice(startIndex + 1, endIndex).map((w) => ({
    name: w.name, countryCode: w.countryCode, fraction: span ? (w.cumulativeKm - def.startKm) / span : 0
  }))
  return { index: def.index, label: `${def.start} → ${def.end}`, isPowerStage: false, fromKm: def.startKm, toKm: def.endKm, widthKm: span, points, realFromKm: def.startKm, realToKm: def.endKm }
})

export const MILESTONE_TOTAL_KM = LOOP_KM

export function milestonePositionForDistance(totalDistance: number) {
  const wrapped = ((totalDistance % LOOP_KM) + LOOP_KM) % LOOP_KM
  let stage = MILESTONE_STAGES[MILESTONE_STAGES.length - 1]
  for (const s of MILESTONE_STAGES) {
    if (wrapped <= s.realToKm) { stage = s; break }
  }
  const span = stage.realToKm - stage.realFromKm
  const fraction = span ? Math.max(0, Math.min(1, (wrapped - stage.realFromKm) / span)) : 0
  return { stageIndex: stage.index, fraction }
}

export interface StageBoundaryPoint { stageIndex: number | null; name: string; countryCode: string; coords: [number, number] }

export const STAGE_BOUNDARY_POINTS: StageBoundaryPoint[] = [
  { stageIndex: 0, name: route[0].name, countryCode: route[0].countryCode, coords: route[0].coords as [number, number] },
  ...MILESTONE_DEFS.map((def) => {
    const wp = route.find((w) => w.name === def.end && w.cumulativeKm === def.endKm)!
    return { stageIndex: def.index, name: wp.name, countryCode: wp.countryCode, coords: wp.coords as [number, number] }
  })
]
