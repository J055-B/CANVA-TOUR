// Shared by IntroGate.tsx (sets the role on login), Sidebar.tsx (Logout),
// and anywhere else that needs to know/react to admin vs guest — e.g. the
// admin-only TEST MODE panel on /map and the admin-only "test celebration"
// button on the leaderboard.
export const ROLE_STORAGE_KEY = 'callisto:role'
export const ROLE_CHANGED_EVENT = 'callisto:role-changed'

export function getRole(): 'admin' | 'guest' {
  if (typeof window === 'undefined') return 'guest'
  return localStorage.getItem(ROLE_STORAGE_KEY) === 'admin' ? 'admin' : 'guest'
}

export function clearRole() {
  localStorage.removeItem(ROLE_STORAGE_KEY)
  window.dispatchEvent(new Event(ROLE_CHANGED_EVENT))
}
