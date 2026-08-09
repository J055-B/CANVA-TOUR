import { Team } from '../lib/types'

// Offline fallback for the CANVA-only edition. Live target/history data are
// read from the Google Sheet by lib/data-source.ts when available.
const teams: Team[] = [
  {
    id: 'canva',
    teamCode: 'CANVA',
    pool: 'FTD',
    initials: 'CANVA',
    location: 'Bulgaria',
    language: 'EN',
    dailyTarget: 0,
    salesToday: 0,
    totalTarget: 2500,
    countryCode: 'BG',
    countryName: 'Bulgaria',
    currentStage: 'Sofia → Lom',
    dailyHistory: []
  }
]

export default teams
