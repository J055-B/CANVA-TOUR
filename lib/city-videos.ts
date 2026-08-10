// Canva's private edition only has footage for Sofia (the world Tour's
// per-city clips don't apply to Bulgaria's other 95 waypoints, and we
// don't have dedicated clips for them) — every position on the route
// shows this same video, always. If a per-city Bulgaria clip is ever
// added, this is the one function to update.
export function videoUrlForDistance(_totalDistance: number): string {
  return '/City_videos/Sofia.mp4'
}
