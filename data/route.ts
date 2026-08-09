import { RoutePoint } from '../lib/types'

// Tour of Bulgaria — canonical 2,500 km route for the CANVA-only edition.
// Canonical competition_km values are taken directly from the supplied route JSON.
// They are stored explicitly instead of being accumulated from floating-point leg lengths.

const COUNTRY_NAMES: Record<string, string> = { BG: 'Bulgaria' }

type RawWaypoint = [string, string, string, number, [number, number]]

const RAW: RawWaypoint[] = [
  ['sofia-1', "Sofia", 'BG', 0.0, [42.6977, 23.3219]],
  ['kostinbrod-2', "Kostinbrod", 'BG', 21.0, [42.8167, 23.2167]],
  ['buchin-prohod-3', "Buchin Prohod", 'BG', 37.0, [42.8969, 23.1184]],
  ['petrohan-pass-4', "Petrohan Pass", 'BG', 69.6, [43.1163, 23.1167]],
  ['berkovitsa-5', "Berkovitsa", 'BG', 87.4, [43.2361, 23.1258]],
  ['montana-6', "Montana", 'BG', 115.6, [43.4125, 23.225]],
  ['dolno-tserovene-7', "Dolno Tserovene", 'BG', 142.5, [43.5917, 23.2583]],
  ['lom-8', "Lom", 'BG', 175.5, [43.8139, 23.2361]],
  ['valchedram-9', "Valchedram", 'BG', 204.2, [43.6927, 23.4457]],
  ['kozloduy-10', "Kozloduy", 'BG', 236.6, [43.7756, 23.7248]],
  ['mizia-11', "Mizia", 'BG', 255.4, [43.6906, 23.8538]],
  ['oryahovo-12', "Oryahovo", 'BG', 268.6, [43.7364, 23.9604]],
  ['knezha-13', "Knezha", 'BG', 306.6, [43.495, 24.0799]],
  ['dolni-dabnik-14', "Dolni Dabnik", 'BG', 347.6, [43.4066, 24.4404]],
  ['pleven-15', "Pleven", 'BG', 365.6, [43.417, 24.6067]],
  ['levski-16', "Levski", 'BG', 424.0, [43.3606, 25.1431]],
  ['byala-17', "Byala", 'BG', 489.5, [43.4616, 25.7342]],
  ['ruse-18', "Ruse", 'BG', 550.2, [43.8356, 25.9657]],
  ['slivo-pole-19', "Slivo Pole", 'BG', 580.5, [43.9427, 26.2068]],
  ['tutrakan-20', "Tutrakan", 'BG', 626.9, [44.0493, 26.6158]],
  ['srebarna-21', "Srebarna", 'BG', 676.2, [44.0989, 27.0734]],
  ['aydemir-22', "Aydemir", 'BG', 686.2, [44.1003, 27.1668]],
  ['silistra-23', "Silistra", 'BG', 696.5, [44.1171, 27.2606]],
  ['alfatar-24', "Alfatar", 'BG', 722.1, [43.9451, 27.287]],
  ['dulovo-25', "Dulovo", 'BG', 746.8, [43.8167, 27.1417]],
  ['hitrino-26', "Hitrino", 'BG', 808.5, [43.4333, 26.9167]],
  ['shumen-27', "Shumen", 'BG', 832.6, [43.2706, 26.9229]],
  ['kaspichan-28', "Kaspichan", 'BG', 859.0, [43.3093, 27.1609]],
  ['novi-pazar-29', "Novi Pazar", 'BG', 866.1, [43.35, 27.197]],
  ['devnya-30', "Devnya", 'BG', 910.6, [43.2222, 27.5694]],
  ['aksakovo-31', "Aksakovo", 'BG', 938.2, [43.2564, 27.8211]],
  ['varna-32', "Varna", 'BG', 950.2, [43.2141, 27.9147]],
  ['staro-oryahovo-33', "Staro Oryahovo", 'BG', 976.9, [43.0447, 27.997]],
  ['byala-varna-province-34', "Byala (Varna Province)", 'BG', 1004.8, [42.8743, 27.8887]],
  ['obzor-35', "Obzor", 'BG', 1013.0, [42.8192, 27.8799]],
  ['banya-nessebar-36', "Banya (Nessebar)", 'BG', 1028.4, [42.769, 27.7562]],
  ['sunny-beach-37', "Sunny Beach", 'BG', 1040.4, [42.6952, 27.7104]],
  ['pomorie-38', "Pomorie", 'BG', 1061.9, [42.5588, 27.643]],
  ['burgas-39', "Burgas", 'BG', 1083.1, [42.5048, 27.4626]],
  ['kameno-40', "Kameno", 'BG', 1103.6, [42.5708, 27.2988]],
  ['karnobat-41', "Karnobat", 'BG', 1140.0, [42.65, 26.9833]],
  ['straldzha-42', "Straldzha", 'BG', 1173.5, [42.6, 26.6833]],
  ['sliven-43', "Sliven", 'BG', 1214.8, [42.6817, 26.3229]],
  ['yambol-44', "Yambol", 'BG', 1250.0, [42.4841, 26.5035]],
  ['elhovo-45', "Elhovo", 'BG', 1297.0, [42.1713, 26.5736]],
  ['topolovgrad-46', "Topolovgrad", 'BG', 1326.5, [42.0833, 26.3333]],
  ['lyubimets-47', "Lyubimets", 'BG', 1372.8, [41.8333, 26.0833]],
  ['svilengrad-48', "Svilengrad", 'BG', 1389.0, [41.7667, 26.2]],
  ['harmanli-49', "Harmanli", 'BG', 1429.9, [41.9296, 25.9012]],
  ['haskovo-50', "Haskovo", 'BG', 1468.1, [41.9344, 25.5554]],
  ['mineralni-bani-51', "Mineralni Bani", 'BG', 1490.6, [41.9406, 25.3508]],
  ['kardzhali-52', "Kardzhali", 'BG', 1533.8, [41.65, 25.3667]],
  ['momchilgrad-53', "Momchilgrad", 'BG', 1552.6, [41.5269, 25.4075]],
  ['krumovgrad-54', "Krumovgrad", 'BG', 1581.2, [41.4708, 25.6542]],
  ['kirkovo-55', "Kirkovo", 'BG', 1628.6, [41.3275, 25.3637]],
  ['benkovski-56', "Benkovski", 'BG', 1646.9, [41.35, 25.2333]],
  ['zlatograd-57', "Zlatograd", 'BG', 1666.4, [41.3795, 25.0961]],
  ['nedelino-58', "Nedelino", 'BG', 1680.4, [41.456, 25.0806]],
  ['rudozem-59', "Rudozem", 'BG', 1712.4, [41.4875, 24.8494]],
  ['smolyan-60', "Smolyan", 'BG', 1738.4, [41.5774, 24.7011]],
  ['shiroka-laka-61', "Shiroka Laka", 'BG', 1762.8, [41.6792, 24.5838]],
  ['devin-62', "Devin", 'BG', 1790.2, [41.7433, 24.4]],
  ['borino-63', "Borino", 'BG', 1808.2, [41.6844, 24.2934]],
  ['dospat-64', "Dospat", 'BG', 1828.0, [41.644, 24.1586]],
  ['sarnitsa-65', "Sarnitsa", 'BG', 1852.9, [41.738, 24.0253]],
  ['batak-66', "Batak", 'BG', 1898.2, [41.9423, 24.2181]],
  ['peshtera-67', "Peshtera", 'BG', 1918.4, [42.0337, 24.3024]],
  ['krichim-68', "Krichim", 'BG', 1941.4, [42.0414, 24.4729]],
  ['stamboliyski-69', "Stamboliyski", 'BG', 1960.5, [42.1354, 24.5353]],
  ['plovdiv-70', "Plovdiv", 'BG', 1988.8, [42.1354, 24.7453]],
  ['tsalapitsa-71', "Tsalapitsa", 'BG', 2008.6, [42.1833, 24.5667]],
  ['pazardzhik-72', "Pazardzhik", 'BG', 2033.0, [42.1928, 24.3336]],
  ['belovo-73', "Belovo", 'BG', 2068.0, [42.2131, 23.999]],
  ['velingrad-74', "Velingrad", 'BG', 2094.2, [42.0275, 23.9916]],
  ['yakoruda-75', "Yakoruda", 'BG', 2126.5, [42.0253, 23.6842]],
  ['razlog-76', "Razlog", 'BG', 2156.5, [41.8863, 23.4671]],
  ['bansko-77', "Bansko", 'BG', 2163.6, [41.8383, 23.4885]],
  ['dobrinishte-78', "Dobrinishte", 'BG', 2171.8, [41.819, 23.5615]],
  ['mesta-79', "Mesta", 'BG', 2187.0, [41.7333, 23.65]],
  ['garmen-80', "Garmen", 'BG', 2211.8, [41.598, 23.799]],
  ['gotse-delchev-81', "Gotse Delchev", 'BG', 2219.9, [41.5736, 23.7294]],
  ['hadzhidimovo-82', "Hadzhidimovo", 'BG', 2236.2, [41.5223, 23.8686]],
  ['koprivlen-83', "Koprivlen", 'BG', 2245.4, [41.487, 23.795]],
  ['paril-84', "Paril", 'BG', 2262.1, [41.44, 23.65]],
  ['katuntsi-85', "Katuntsi", 'BG', 2285.2, [41.4467, 23.4311]],
  ['melnik-86', "Melnik", 'BG', 2296.8, [41.5233, 23.3935]],
  ['sandanski-87', "Sandanski", 'BG', 2309.9, [41.5667, 23.2833]],
  ['kresna-88', "Kresna", 'BG', 2337.2, [41.7333, 23.15]],
  ['simitli-89', "Simitli", 'BG', 2360.0, [41.8919, 23.1111]],
  ['blagoevgrad-90', "Blagoevgrad", 'BG', 2378.2, [42.0209, 23.0943]],
  ['kocherinovo-91', "Kocherinovo", 'BG', 2388.0, [42.0843, 23.057]],
  ['dupnitsa-92', "Dupnitsa", 'BG', 2414.0, [42.2644, 23.1086]],
  ['dolna-dikanya-93', "Dolna Dikanya", 'BG', 2443.1, [42.4667, 23.1667]],
  ['pernik-94', "Pernik", 'BG', 2466.9, [42.6052, 23.0378]],
  ['vladaya-95', "Vladaya", 'BG', 2484.1, [42.6284, 23.2009]],
  ['sofia-96', "Sofia", 'BG', 2500.0, [42.6977, 23.3219]],
]

const route: RoutePoint[] = RAW.map(([id, name, countryCode, cumulativeKm, coords]) => ({
  id, name, countryCode, countryName: COUNTRY_NAMES[countryCode] ?? countryCode, cumulativeKm, coords
}))

export const LOOP_KM = 2500

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
    countryCode: from.countryCode, countryName: from.countryName,
    currentStage: from.id === to.id ? from.name : `${from.name} → ${to.name}`,
    kmToNextWaypoint: Math.max(0, to.cumulativeKm - wrapped),
    legProgressPct: legKm ? Math.max(0, Math.min(100, ((wrapped - from.cumulativeKm) / legKm) * 100)) : 100
  }
}

export function nextStageForDistance(totalDistance: number) {
  const wrapped = ((totalDistance % LOOP_KM) + LOOP_KM) % LOOP_KM
  let idx = 0
  for (let i = 0; i < route.length; i++) {
    if (route[i].cumulativeKm <= wrapped) idx = i
    else break
  }
  const from = route[Math.min(idx + 1, route.length - 1)]
  const to = route[Math.min(idx + 2, route.length - 1)]
  return { countryCode: from.countryCode, countryName: from.countryName, stageLabel: from.id === to.id ? from.name : `${from.name} → ${to.name}`, cumulativeKm: from.cumulativeKm }
}

export default route
