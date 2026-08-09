import route from '../data/route'
import teamsRaw from '../data/teams'
import { computeLeaderboard } from './calculations'
import { RoutePoint, Team } from './types'

const SHEET_ID = '1VE6emUfDlCUUDr-Au0zQTAXJ1kKETYvwF_wVBHAoBAU'
const TARGET_SHEET_NAME = 'Target'
const TOUR_START = '2026-08-10'
const SHEET_CSV_URL = (sheetName: string) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(
    sheetName
  )}&tqx=out:csv`

// Static map from the Target sheet's team rows to their real sheet tabs.
// Regex-guessing the tab name from the team label is fragile (e.g. the
// Target sheet's RET row "BS ES" is NOT the "RET BS ES" tab — the real tab
// is "RET IL BS:", trailing colon and all) — this table is the ground
// truth instead, taken directly from the live spreadsheet's tab list.
//
// `matchName` is matched against the Target sheet's "Team" column in sheet
// order, consuming one row per config entry — this is what correctly
// disambiguates "BS ES" and "IL ES", which each appear once in the FTD
// block and once in the RET block.
interface TeamSheetConfig {
  matchName: string
  teamCode: string
  pool: 'FTD' | 'RET'
  sheetNames: string[]
  language: string
  location: string
  countryName: string
  countryCode: string
}

const TEAM_SHEETS: TeamSheetConfig[] = [
  // CANVA is the only competitor in this edition. The Target tab uses the
  // row name `BG CANVA`; the sheet itself has historically followed the
  // FTD naming convention. We accept the known tab-name variants so the
  // copy keeps working if the tab is renamed without changing the app.
  {
    matchName: 'BG CANVA',
    teamCode: 'CANVA',
    pool: 'FTD',
    sheetNames: ['Canva', 'FTD BG CANVA', 'BG CANVA', 'CANVA'],
    language: 'EN',
    location: 'Bulgaria',
    countryName: 'Bulgaria',
    countryCode: 'BG'
  }
]

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
}

function normalizeMatchName(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, ' ')
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let cell = ''
  let row: string[] = []
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cell += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (!inQuotes && (char === ',' || char === '\r' || char === '\n')) {
      row.push(cell)
      cell = ''

      if (char === '\r') {
        if (text[i + 1] === '\n') i++
        rows.push(row)
        row = []
      } else if (char === '\n') {
        rows.push(row)
        row = []
      }
      continue
    }

    cell += char
  }

  if (cell.length || row.length) {
    row.push(cell)
    rows.push(row)
  }

  return rows
}

function parseNumber(value?: string) {
  if (value === undefined || value === null) return undefined
  // The sheet uses "," as a thousands separator and "." as the decimal
  // point (e.g. RET targets like "152,900.00") — strip commas, don't
  // treat them as a decimal separator, or big RET numbers get mangled
  // into an invalid "152.900.00" and silently parse as 0.
  const cleaned = value
    .toString()
    .trim()
    .replace(/[$%]/g, '')
    .replace(/\s+/g, '')
    .replace(/,/g, '')
  const number = Number(cleaned)
  return Number.isFinite(number) ? number : undefined
}

async function fetchSheetRows(sheetName: string) {
  const response = await fetch(SHEET_CSV_URL(sheetName), {
    next: { revalidate: 60 },
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      Accept: 'text/csv, */*;q=0.8'
    }
  })

  if (!response.ok) {
    throw new Error(`Google Sheet returned ${response.status} for sheet ${sheetName}`)
  }

  const text = await response.text()
  return parseCsv(text).filter((row) => row.some((cell) => cell.trim().length > 0))
}

interface TargetRow {
  rawTeamName: string
  dailyTarget: number
  monthlyTarget?: number
}

function parseTargetRows(rows: string[][]): TargetRow[] {
  const dataRows = [...rows]
  const headers = dataRows.shift()?.map(normalizeHeader) ?? []
  const teamIndex = headers.findIndex((h) => /team|group|name/.test(h))
  const targetIndex = headers.findIndex((h) => /targ/.test(h))
  const dailyIndex = headers.findIndex((h) => /daily|current_km|km_today|km/.test(h))

  return dataRows
    .filter((row) => row.some((cell) => cell.trim().length > 0))
    .map((row) => ({
      rawTeamName: teamIndex >= 0 ? row[teamIndex] ?? '' : '',
      dailyTarget: (dailyIndex >= 0 ? parseNumber(row[dailyIndex]) : undefined) ?? 0,
      monthlyTarget: targetIndex >= 0 ? parseNumber(row[targetIndex]) : undefined
    }))
    .filter((row) => row.rawTeamName.trim().length > 0)
}

// Consumes one Target row per config entry, in TEAM_SHEETS order — the
// first "BS ES"/"IL ES" row found goes to the FTD config (which is listed
// first, matching the sheet's real top-to-bottom layout), the second goes
// to the RET config.
function assignTargets(configs: TeamSheetConfig[], targetRows: TargetRow[]) {
  const remaining = [...targetRows]
  return configs.map((cfg) => {
    const idx = remaining.findIndex((r) => normalizeMatchName(r.rawTeamName) === cfg.matchName)
    if (idx === -1) return { ...cfg, dailyTarget: 0, monthlyTarget: undefined as number | undefined }
    const [row] = remaining.splice(idx, 1)
    return { ...cfg, dailyTarget: row.dailyTarget, monthlyTarget: row.monthlyTarget }
  })
}

// CANVA FTD: every sale row counts as +1 (Full and Partial both count).
// Aug 10 starts at 08:00; from Aug 11 onward each day is a normal calendar
// day from 00:00 through 23:59. Sales before Aug 10 08:00 are ignored.

function buildDailyHistoryByCount(rows: string[][]): { date: string; sales: number }[] {
  if (rows.length < 2) return []
  const headers = rows[0].map((h) => normalizeHeader(h || ''))
  const dateIndex = headers.findIndex((h) => /conversion.*date|^date$/.test(h))
  if (dateIndex === -1) return []

  const counts = new Map<string, number>()
  for (const row of rows.slice(1)) {
    const raw = (row[dateIndex] || '').trim()
    const match = raw.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{1,2})(?::\d{2})?)/)
    const calendarDate = match?.[1] ?? raw.slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(calendarDate)) continue

    // CANVA competition clock:
    // - Aug 10 starts at 08:00. Sales on Aug 10 before 08:00 do NOT count.
    // - From Aug 11 onward, every calendar day runs 00:00–23:59.
    // This is deliberately NOT a rolling 08:00→07:59 operational day.
    const hour = match?.[2] !== undefined ? Number(match[2]) : 0
    if (calendarDate === TOUR_START && hour < 8) continue
    const date = calendarDate
    counts.set(date, (counts.get(date) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([date, sales]) => ({ date, sales }))
    .sort((a, b) => (a.date < b.date ? -1 : 1))
}

// RET sheets: daily targets are REVENUE (USD, e.g. "152,900.00"), not a
// sale count — a team with 3 big charges must outscore a team with 10 tiny
// ones. So instead of counting rows, sum each row's "SUM" column (the
// per-charge USD amount already computed in the sheet), bucketed by the
// same "Date" column's calendar day.
function buildDailyHistoryByAmount(rows: string[][]): { date: string; sales: number }[] {
  if (rows.length < 2) return []
  const headers = rows[0].map((h) => normalizeHeader(h || ''))
  const dateIndex = headers.findIndex((h) => /conversion.*date|^date$/.test(h))
  const amountIndex = headers.findIndex((h) => /^sum$/.test(h))
  if (dateIndex === -1 || amountIndex === -1) return []

  const totals = new Map<string, number>()
  for (const row of rows.slice(1)) {
    const raw = (row[dateIndex] || '').trim()
    const date = raw.slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue
    const amount = parseNumber(row[amountIndex]) ?? 0
    totals.set(date, (totals.get(date) ?? 0) + amount)
  }

  return Array.from(totals.entries())
    .map(([date, sales]) => ({ date, sales }))
    .sort((a, b) => (a.date < b.date ? -1 : 1))
}

function mergeDailyHistory(a: { date: string; sales: number }[], b: { date: string; sales: number }[]) {
  const counts = new Map<string, number>()
  for (const { date, sales } of [...a, ...b]) {
    counts.set(date, (counts.get(date) ?? 0) + sales)
  }
  return Array.from(counts.entries())
    .map(([date, sales]) => ({ date, sales }))
    .sort((a2, b2) => (a2.date < b2.date ? -1 : 1))
}

function buildTeam(cfg: TeamSheetConfig & { dailyTarget: number; monthlyTarget?: number }, sheetRowsByName: Map<string, string[][]>): Team {
  // RET's daily target is money, FTD's is a sale count — see the two
  // buildDailyHistoryBy* functions above for why each pool needs its own.
  const buildHistory = cfg.pool === 'RET' ? buildDailyHistoryByAmount : buildDailyHistoryByCount
  const availableSheetNames = cfg.sheetNames.filter((name) => sheetRowsByName.has(name))
  const selectedSheetNames = availableSheetNames.length ? [availableSheetNames[0]] : []
  const histories = selectedSheetNames.map((name) => buildHistory(sheetRowsByName.get(name) ?? []))
  const dailyHistory = histories.reduce((acc, h) => mergeDailyHistory(acc, h), [] as { date: string; sales: number }[])

  return {
    id: cfg.teamCode.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    teamCode: cfg.teamCode,
    pool: cfg.pool,
    initials: cfg.teamCode
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 6)
      .toUpperCase(),
    location: cfg.location,
    language: cfg.language,
    dailyTarget: cfg.dailyTarget,
    salesToday: 0, // overwritten by computeLeaderboard using dailyHistory
    monthlyTarget: cfg.monthlyTarget,
    currentStage: '',
    countryCode: cfg.countryCode,
    countryName: cfg.countryName,
    dailyHistory
  }
}

export async function getTeams(): Promise<Team[]> {
  try {
    const targetRows = parseTargetRows(await fetchSheetRows(TARGET_SHEET_NAME))
    const configs = assignTargets(TEAM_SHEETS, targetRows)

    const uniqueSheetNames = Array.from(new Set(configs.flatMap((c) => c.sheetNames)))
    const fetchedSheets = await Promise.allSettled(
      uniqueSheetNames.map(async (name) => ({ name, rows: await fetchSheetRows(name) }))
    )

    const sheetRowsByName = new Map<string, string[][]>()
    for (const result of fetchedSheets) {
      if (result.status === 'fulfilled') {
        sheetRowsByName.set(result.value.name, result.value.rows)
      }
    }

    if (sheetRowsByName.size === 0) throw new Error('No team sheets could be loaded from Google Sheets')

    return configs.map((cfg) => buildTeam(cfg, sheetRowsByName))
  } catch (error) {
    console.warn('Failed to load teams from Google Sheet, using local fallback.', error)
    return teamsRaw as Team[]
  }
}

export async function getRoute(): Promise<RoutePoint[]> {
  return route
}

export async function getLeaderboard() {
  const t = await getTeams()
  return computeLeaderboard(t)
}

export async function getCompetitionState() {
  const leaderboard = await getLeaderboard()
  return {
    leaderboard,
    route: await getRoute()
  }
}
