import route from '../data/route'
import { LOOP_KM } from '../data/route'

// public/City_videos only has footage for the major stage-endpoint cities,
// not every fine-grained waypoint in data/route.ts (e.g. no Nis/Belgrade
// clip). Keyed by RoutePoint id — see videoUrlForDistance for how the gaps
// are filled in.
const VIDEO_FILE: Record<string, string> = {
  sofia: 'Sofia.mp4',
  trieste: 'Trieste.mp4',
  roma: 'Roma.mp4',
  marseille: 'Marseille.mp4',
  madrid: 'Madrid.mp4',
  lisbon: 'Lisbon.mp4',
  porto: 'Porto.mp4',
  barcelona: 'Barcelona.mp4',
  paris: 'Paris.mp4',
  london: 'London.mp4',
  quebec: 'Quebec City.mp4',
  'new-york-city': 'NewYork.mp4',
  toronto: 'Toronto.mp4',
  'washington-dc': 'Washington DC.mp4',
  'mexico-city': 'Mexico City.mp4',
  'ciudad-de-guatemala': 'Guatemala City.mp4',
  'san-jose': 'San Jose.mp4',
  panama: 'Panama.mp4',
  antananarivo: 'Antananarivo.mp4',
  // No dedicated clip per Israeli city — one generic "Israel" video covers
  // the whole S16 stretch (Ashkelon -> Tel Aviv -> Jerusalem -> Eilat -> Beer Sheva).
  ashkelon: 'Israel.mp4',
  'tel-aviv': 'Israel.mp4',
  jerusalem: 'Israel.mp4',
  eilat: 'Israel.mp4',
  'beer-sheva': 'Israel.mp4'
}

const DEFAULT_FILE = VIDEO_FILE.sofia

// Given how far a team has traveled, returns the URL of the most recently
// "arrived at" city that actually has a video — a team between Nis and
// Belgrade (no clip for either) still shows Sofia's video, the last stop
// that has one, until they reach Trieste.
export function videoUrlForDistance(totalDistance: number): string {
  const wrapped = ((totalDistance % LOOP_KM) + LOOP_KM) % LOOP_KM

  let file = DEFAULT_FILE
  for (const wp of route) {
    if (wp.cumulativeKm > wrapped) break
    if (VIDEO_FILE[wp.id]) file = VIDEO_FILE[wp.id]
  }

  return `/City_videos/${encodeURIComponent(file)}`
}
