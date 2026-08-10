'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, X, Bike } from 'lucide-react'
import { ROLE_STORAGE_KEY } from '../../lib/session'

const ADMIN_USER = 'Admin'
const ADMIN_PASS = 'Callisto2026'

// Canva's private Tour of Bulgaria has no dedicated hero photo (the main
// Tour de Callisto's poster has "CALLISTO" baked into the image itself —
// wrong branding to reuse here) — this is a CSS-only intro instead:
// Bulgaria's flag colors (white/green/red) as a thin accent, radial glow,
// and the same yellow/dark app palette everywhere else. Swap in a real
// image later by giving this the same treatment as IntroGate's original
// (see git history / the main Tour de Callisto repo) if one becomes available.
export default function IntroGate() {
  const router = useRouter()
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function enterAsGuest() {
    router.push('/dashboard')
  }

  function closeModal() {
    setShowAdminModal(false)
    setError('')
    setUsername('')
    setPassword('')
  }

  function submitAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, 'admin')
      } catch {}
      router.push('/dashboard')
    } else {
      setError('Incorrect username or password.')
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-page flex items-center justify-center">
      {/* Radial glow + faint road-line texture instead of a photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 35%, rgba(255,212,0,0.16) 0%, rgba(255,212,0,0.04) 45%, transparent 70%), linear-gradient(180deg, #05090B 0%, #0B1114 60%, #05090B 100%)'
        }}
      />
      <div className="absolute inset-x-0 top-0 h-1.5 flex">
        <div className="flex-1 bg-white/90" />
        <div className="flex-1 bg-[#00966E]" />
        <div className="flex-1 bg-[#D62612]" />
      </div>

      <div className="relative flex flex-col items-center text-center px-6">
        <div className="flex items-center gap-2 text-xs tracking-[6px] text-secondaryText mb-6">
          <span>&#10022;</span>
          <span>CANVA PRIVATE CHALLENGE</span>
          <span>&#10022;</span>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <Bike size={40} className="text-yellow" />
          <div className="text-5xl sm:text-7xl font-extrabold italic text-primaryText leading-none">
            TOUR OF <span className="shimmer-text">BULGARIA</span>
          </div>
        </div>
        <div className="text-sm sm:text-base text-secondaryText tracking-[3px] mb-14">2,500 KM &nbsp;·&nbsp; ONE LOOP &nbsp;·&nbsp; ONE TEAM</div>

        <button
          onClick={enterAsGuest}
          className="px-12 py-3.5 rounded-full bg-yellow text-black font-extrabold text-xl italic tracking-wide shadow-[0_0_30px_-4px_rgba(255,212,0,0.85)] hover:shadow-[0_0_44px_-2px_rgba(255,212,0,1)] hover:scale-105 transition-all"
        >
          ENTER
        </button>
        <button
          onClick={() => setShowAdminModal(true)}
          className="flex items-center gap-1.5 text-yellow/80 hover:text-yellow text-xs font-semibold tracking-widest transition-colors mt-5"
        >
          <Lock size={14} />
          ADMIN
        </button>
      </div>

      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-lg app-surface border border-border p-6 relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-secondaryText hover:text-primaryText" aria-label="Close">
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 mb-5">
              <Lock size={16} className="text-yellow" />
              <h2 className="text-lg font-bold">Admin Access</h2>
            </div>
            <form onSubmit={submitAdmin} className="space-y-4">
              <div>
                <label className="text-xs text-secondaryText tracking-wide">USER</label>
                <input
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full rounded-md bg-elevated border border-border px-3 py-2 text-sm outline-none focus:border-yellow"
                />
              </div>
              <div>
                <label className="text-xs text-secondaryText tracking-wide">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md bg-elevated border border-border px-3 py-2 text-sm outline-none focus:border-yellow"
                />
              </div>
              {error && <div className="text-xs text-negative">{error}</div>}
              <button type="submit" className="w-full py-2.5 rounded-md bg-yellow text-black font-bold text-sm">
                ENTER
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
