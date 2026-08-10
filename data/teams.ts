import { Team } from '../lib/types'

// Fallback mock data — only used if the live Google Sheet fetch fails
// (see lib/data-source.ts's getTeams()). Canva's private Tour of Bulgaria
// has exactly one team, so this is a single entry (unlike the main Tour de
// Callisto's 11-team mock list) — real numeric fields are computed from
// the live sheet in normal operation; this is just a safe placeholder.
const teams: Team[] = [
  {
    id: 'canva',
    teamCode: 'CANVA',
    pool: 'FTD',
    initials: 'CANVA',
    location: 'Bulgaria',
    language: 'BG',
    dailyTarget: 7,
    salesToday: 0,
    countryCode: 'BG',
    countryName: 'Bulgaria',
    currentStage: 'Sofia → Lom',
    dailyHistory: []
  }
]

export default teams
