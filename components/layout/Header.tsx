'use client'
import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

const BRAND_INTERVAL_MS = 20000 // how often the brand banner plays
const BRAND_DURATION_MS = 3200 // must match tailwind.config.cjs's brandSlide duration
const BRAND_GLOW_DELAY_MS = 480 // when the icons are centered (brandSlide's 15% mark) — glow starts here

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function Header() {
  const [now, setNow] = useState<Date | null>(null)
  const [showBrand, setShowBrand] = useState(false)

  // A real, live clock — this used to be hardcoded text ("20 AUG 2026 12:34"
  // baked into the JSX, never changing). null until mount avoids a
  // server/client render mismatch (the server has no "current time" to agree on).
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Every 20s, a brand moment: the Callisto icon + bike icon slide in from
  // the right, glow once centered, then continue off to the left — then the
  // clock fades back in. Purely decorative, doesn't touch any data.
  useEffect(() => {
    const id = setInterval(() => {
      setShowBrand(true)
      setTimeout(() => setShowBrand(false), BRAND_DURATION_MS)
    }, BRAND_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border bg-surface gap-4">
      <div className="flex items-center gap-3">
        <img src="/images/Callisto%20Icon.png" alt="Callisto" className="w-12 h-12 object-contain shrink-0" />
        <div>
          <div className="text-xl font-bold italic">
            TOUR OF <span className="shimmer-text">BULGARIA</span>
          </div>
          <div className="text-sm text-secondaryText">CANVA · AUGUST 2026 EDITION</div>
        </div>
        <img src="/images/Bicycle-transparent.png" alt="" className="w-10 h-10 object-contain shrink-0 ml-1" />
      </div>

      <div className="relative w-56 h-11 overflow-hidden shrink-0 rounded-lg border border-border bg-elevated/60 backdrop-blur-sm">
        <div
          className="absolute inset-0 flex items-center justify-center gap-2.5 text-sm transition-opacity duration-300"
          style={{ opacity: showBrand ? 0 : 1 }}
        >
          <Clock size={14} className="text-yellow shrink-0" />
          <span className="text-secondaryText whitespace-nowrap">{now ? formatDate(now) : ''}</span>
          <span className="w-1 h-1 rounded-full bg-yellow/70 animate-pulse shrink-0" />
          <span className="tabular-nums font-bold text-primaryText">{now ? formatTime(now) : ''}</span>
        </div>

        {showBrand && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 animate-brandSlide">
            <img
              src="/images/Callisto%20Icon.png"
              alt=""
              className="w-8 h-8 object-contain animate-brandGlow"
              style={{ animationDelay: `${BRAND_GLOW_DELAY_MS}ms` }}
            />
            <img
              src="/images/Bicycle-transparent.png"
              alt=""
              className="w-7 h-7 object-contain animate-brandGlow"
              style={{ animationDelay: `${BRAND_GLOW_DELAY_MS}ms` }}
            />
          </div>
        )}
      </div>
    </header>
  )
}
