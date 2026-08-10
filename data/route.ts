import { RoutePoint } from '../lib/types'

// Tour of Bulgaria — Canva's private, single-team edition of the Tour de
// Callisto competition engine. Real road route through Bulgaria supplied by
// Joss (tour_of_bulgaria_2500km_*), reconstructed from three Google Maps
// driving sessions with 96 ordered waypoints (20 of them official Google
// Maps milestones, marked below), competition-scaled to a canonical
// 2,500km loop (see the route documentation's "Distance decision" section
// for why 2,500km rather than the raw ~2,000km Google composite). Sofia is
// both start and finish (loop=true) — its two waypoints use distinct ids
// ('sofia' / 'sofia-finish') so id lookups elsewhere never collide, even
// though they're the same physical point.
//
// Unlike the world Tour, every leg here is a real drivable road distance —
// there are no flights (no 0km legs).
const COUNTRY_NAMES: Record<string, string> = {
  BG: 'Bulgaria'
}

// [id, name, countryCode, legKmFromPreviousWaypoint, coords]
type RawWaypoint = [string, string, string, number, [number, number]?]

const RAW: RawWaypoint[] = [
  ['sofia', 'Sofia', 'BG', 0.0, [42.6977, 23.3219]],  // MILESTONE
  ['kostinbrod', 'Kostinbrod', 'BG', 21.0, [42.8167, 23.2167]],
  ['buchin-prohod', 'Buchin Prohod', 'BG', 16.0, [42.8969, 23.1184]],
  ['petrohan-pass', 'Petrohan Pass', 'BG', 32.6, [43.1163, 23.1167]],
  ['berkovitsa', 'Berkovitsa', 'BG', 17.8, [43.2361, 23.1258]],
  ['montana', 'Montana', 'BG', 28.2, [43.4125, 23.225]],
  ['dolno-tserovene', 'Dolno Tserovene', 'BG', 26.9, [43.5917, 23.2583]],
  ['lom', 'Lom', 'BG', 33.0, [43.8139, 23.2361]],  // MILESTONE
  ['valchedram', 'Valchedram', 'BG', 28.7, [43.6927, 23.4457]],
  ['kozloduy', 'Kozloduy', 'BG', 32.4, [43.7756, 23.7248]],
  ['mizia', 'Mizia', 'BG', 18.8, [43.6906, 23.8538]],
  ['oryahovo', 'Oryahovo', 'BG', 13.2, [43.7364, 23.9604]],
  ['knezha', 'Knezha', 'BG', 38.0, [43.495, 24.0799]],
  ['dolni-dabnik', 'Dolni Dabnik', 'BG', 41.0, [43.4066, 24.4404]],
  ['pleven', 'Pleven', 'BG', 18.0, [43.417, 24.6067]],
  ['levski', 'Levski', 'BG', 58.4, [43.3606, 25.1431]],
  ['byala', 'Byala', 'BG', 65.5, [43.4616, 25.7342]],
  ['ruse', 'Ruse', 'BG', 60.7, [43.8356, 25.9657]],  // MILESTONE
  ['slivo-pole', 'Slivo Pole', 'BG', 30.3, [43.9427, 26.2068]],
  ['tutrakan', 'Tutrakan', 'BG', 46.4, [44.0493, 26.6158]],
  ['srebarna', 'Srebarna', 'BG', 49.3, [44.0989, 27.0734]],
  ['aydemir', 'Aydemir', 'BG', 10.0, [44.1003, 27.1668]],
  ['silistra', 'Silistra', 'BG', 10.3, [44.1171, 27.2606]],  // MILESTONE
  ['alfatar', 'Alfatar', 'BG', 25.6, [43.9451, 27.287]],
  ['dulovo', 'Dulovo', 'BG', 24.7, [43.8167, 27.1417]],
  ['hitrino', 'Hitrino', 'BG', 61.7, [43.4333, 26.9167]],
  ['shumen', 'Shumen', 'BG', 24.1, [43.2706, 26.9229]],  // MILESTONE
  ['kaspichan', 'Kaspichan', 'BG', 26.4, [43.3093, 27.1609]],
  ['novi-pazar', 'Novi Pazar', 'BG', 7.1, [43.35, 27.197]],
  ['devnya', 'Devnya', 'BG', 44.5, [43.2222, 27.5694]],
  ['aksakovo', 'Aksakovo', 'BG', 27.6, [43.2564, 27.8211]],
  ['varna', 'Varna', 'BG', 12.0, [43.2141, 27.9147]],  // MILESTONE
  ['staro-oryahovo', 'Staro Oryahovo', 'BG', 26.7, [43.0447, 27.997]],
  ['byala-varna-province', 'Byala (Varna Province)', 'BG', 27.9, [42.8743, 27.8887]],
  ['obzor', 'Obzor', 'BG', 8.2, [42.8192, 27.8799]],
  ['banya-nessebar', 'Banya (Nessebar)', 'BG', 15.4, [42.769, 27.7562]],
  ['sunny-beach', 'Sunny Beach', 'BG', 12.0, [42.6952, 27.7104]],
  ['pomorie', 'Pomorie', 'BG', 21.5, [42.5588, 27.643]],
  ['burgas', 'Burgas', 'BG', 21.2, [42.5048, 27.4626]],  // MILESTONE
  ['kameno', 'Kameno', 'BG', 20.5, [42.5708, 27.2988]],
  ['karnobat', 'Karnobat', 'BG', 36.4, [42.65, 26.9833]],
  ['straldzha', 'Straldzha', 'BG', 33.5, [42.6, 26.6833]],
  ['sliven', 'Sliven', 'BG', 41.3, [42.6817, 26.3229]],  // MILESTONE
  ['yambol', 'Yambol', 'BG', 35.2, [42.4841, 26.5035]],
  ['elhovo', 'Elhovo', 'BG', 47.0, [42.1713, 26.5736]],
  ['topolovgrad', 'Topolovgrad', 'BG', 29.5, [42.0833, 26.3333]],
  ['lyubimets', 'Lyubimets', 'BG', 46.3, [41.8333, 26.0833]],
  ['svilengrad', 'Svilengrad', 'BG', 16.2, [41.7667, 26.2]],  // MILESTONE
  ['harmanli', 'Harmanli', 'BG', 40.9, [41.9296, 25.9012]],
  ['haskovo', 'Haskovo', 'BG', 38.2, [41.9344, 25.5554]],
  ['mineralni-bani', 'Mineralni Bani', 'BG', 22.5, [41.9406, 25.3508]],
  ['kardzhali', 'Kardzhali', 'BG', 43.2, [41.65, 25.3667]],
  ['momchilgrad', 'Momchilgrad', 'BG', 18.8, [41.5269, 25.4075]],
  ['krumovgrad', 'Krumovgrad', 'BG', 28.6, [41.4708, 25.6542]],  // MILESTONE
  ['kirkovo', 'Kirkovo', 'BG', 47.4, [41.3275, 25.3637]],
  ['benkovski', 'Benkovski', 'BG', 18.3, [41.35, 25.2333]],
  ['zlatograd', 'Zlatograd', 'BG', 19.5, [41.3795, 25.0961]],
  ['nedelino', 'Nedelino', 'BG', 14.0, [41.456, 25.0806]],
  ['rudozem', 'Rudozem', 'BG', 32.0, [41.4875, 24.8494]],  // MILESTONE
  ['smolyan', 'Smolyan', 'BG', 26.0, [41.5774, 24.7011]],
  ['shiroka-laka', 'Shiroka Laka', 'BG', 24.4, [41.6792, 24.5838]],
  ['devin', 'Devin', 'BG', 27.4, [41.7433, 24.4]],
  ['borino', 'Borino', 'BG', 18.0, [41.6844, 24.2934]],
  ['dospat', 'Dospat', 'BG', 19.8, [41.644, 24.1586]],  // MILESTONE
  ['sarnitsa', 'Sarnitsa', 'BG', 24.9, [41.738, 24.0253]],
  ['batak', 'Batak', 'BG', 45.3, [41.9423, 24.2181]],
  ['peshtera', 'Peshtera', 'BG', 20.2, [42.0337, 24.3024]],
  ['krichim', 'Krichim', 'BG', 23.0, [42.0414, 24.4729]],
  ['stamboliyski', 'Stamboliyski', 'BG', 19.1, [42.1354, 24.5353]],
  ['plovdiv', 'Plovdiv', 'BG', 28.3, [42.1354, 24.7453]],  // MILESTONE
  ['tsalapitsa', 'Tsalapitsa', 'BG', 19.8, [42.1833, 24.5667]],
  ['pazardzhik', 'Pazardzhik', 'BG', 24.4, [42.1928, 24.3336]],  // MILESTONE
  ['belovo', 'Belovo', 'BG', 35.0, [42.2131, 23.999]],
  ['velingrad', 'Velingrad', 'BG', 26.2, [42.0275, 23.9916]],
  ['yakoruda', 'Yakoruda', 'BG', 32.3, [42.0253, 23.6842]],
  ['razlog', 'Razlog', 'BG', 30.0, [41.8863, 23.4671]],
  ['bansko', 'Bansko', 'BG', 7.1, [41.8383, 23.4885]],  // MILESTONE
  ['dobrinishte', 'Dobrinishte', 'BG', 8.2, [41.819, 23.5615]],
  ['mesta', 'Mesta', 'BG', 15.2, [41.7333, 23.65]],
  ['garmen', 'Garmen', 'BG', 24.8, [41.598, 23.799]],
  ['gotse-delchev', 'Gotse Delchev', 'BG', 8.1, [41.5736, 23.7294]],  // MILESTONE
  ['hadzhidimovo', 'Hadzhidimovo', 'BG', 16.3, [41.5223, 23.8686]],
  ['koprivlen', 'Koprivlen', 'BG', 9.2, [41.487, 23.795]],
  ['paril', 'Paril', 'BG', 16.7, [41.44, 23.65]],
  ['katuntsi', 'Katuntsi', 'BG', 23.1, [41.4467, 23.4311]],
  ['melnik', 'Melnik', 'BG', 11.6, [41.5233, 23.3935]],
  ['sandanski', 'Sandanski', 'BG', 13.1, [41.5667, 23.2833]],  // MILESTONE
  ['kresna', 'Kresna', 'BG', 27.3, [41.7333, 23.15]],
  ['simitli', 'Simitli', 'BG', 22.8, [41.8919, 23.1111]],
  ['blagoevgrad', 'Blagoevgrad', 'BG', 18.2, [42.0209, 23.0943]],  // MILESTONE
  ['kocherinovo', 'Kocherinovo', 'BG', 9.8, [42.0843, 23.057]],
  ['dupnitsa', 'Dupnitsa', 'BG', 26.0, [42.2644, 23.1086]],  // MILESTONE
  ['dolna-dikanya', 'Dolna Dikanya', 'BG', 29.1, [42.4667, 23.1667]],
  ['pernik', 'Pernik', 'BG', 23.8, [42.6052, 23.0378]],
  ['vladaya', 'Vladaya', 'BG', 17.2, [42.6284, 23.2009]],
  ['sofia-finish', 'Sofia', 'BG', 15.9, [42.6977, 23.3219]],  // MILESTONE
]

const route: RoutePoint[] = (() => {
  let cumulativeKm = 0
  return RAW.map(([id, name, countryCode, legKm, coords]) => {
    cumulativeKm += legKm
    return {
      id,
      name,
      countryCode,
      countryName: COUNTRY_NAMES[countryCode] ?? countryCode,
      cumulativeKm: Math.round(cumulativeKm * 10) / 10,
      coords
    }
  })
})()

export const LOOP_KM = route[route.length - 1].cumulativeKm

// Where the team currently is on the loop, given how much distance they've
// covered so far. Wraps around every LOOP_KM (completing the loop starts
// lap 2 back at Sofia — distance never resets, see computeLap).
export function positionForDistance(totalDistance: number) {
  const wrapped = ((totalDistance % LOOP_KM) + LOOP_KM) % LOOP_KM

  let idx = 0
  for (let i = 0; i < route.length; i++) {
    if (route[i].cumulativeKm <= wrapped) idx = i
    else break
  }

  const from = route[idx]
  const to = route[Math.min(idx + 1, route.length - 1)]
  const legKm = to.cumulativeKm - from.cumulativeKm

  return {
    countryCode: from.countryCode,
    countryName: from.countryName,
    currentStage: from.id === to.id ? from.name : `${from.name} → ${to.name}`,
    kmToNextWaypoint: Math.max(0, to.cumulativeKm - wrapped),
    legProgressPct: legKm ? Math.max(0, Math.min(100, ((wrapped - from.cumulativeKm) / legKm) * 100)) : 100
  }
}

export default route
