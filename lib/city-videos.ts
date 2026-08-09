import { LOOP_KM, default as route } from '../data/route'

// The source project ships a Sofia clip but no dedicated Bulgaria clips for
// the other 19 official milestones. Use the available Sofia footage as the
// neutral background until Bulgaria-specific city clips are added.
const DEFAULT_FILE = 'Sofia.mp4'

export function videoUrlForDistance(_totalDistance: number): string {
  return `/City_videos/${encodeURIComponent(DEFAULT_FILE)}`
}
