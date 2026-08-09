'use client'
import React from 'react'
import { TOUR_START } from '../../lib/calculations'

// The Tour only actually starts on TOUR_START — before that there's nothing
// live to show, so the badge reads OFFLINE instead of blinking LIVE for no reason.
export default function LiveStatusBadge() {
  const isLive = new Date() >= new Date(`${TOUR_START}T00:00:00`)

  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-negative text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
        </span>
        LIVE
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 bg-border text-secondaryText text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-secondaryText" />
      OFFLINE
    </span>
  )
}
