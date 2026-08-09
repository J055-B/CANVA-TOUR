"use client"
import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

const sample = Array.from({ length: 8 }).map((_, i) => ({
  name: `H${i + 1}`,
  sales: Math.round(2000 + Math.random() * 4000),
  pct: Math.round(50 + Math.random() * 100)
}))

export default function PerformanceChart({ range = 'today' }: { range?: string }) {
  return (
    <div className="rounded-lg p-4 app-surface">
      <h4 className="font-semibold">PERFORMANCE PROFILE</h4>
      <div style={{ height: 180 }} className="mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sample}>
            <defs>
              <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD400" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#FFD400" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#0f1416" />
            <XAxis dataKey="name" stroke="#8B999F" />
            <YAxis stroke="#8B999F" />
            <Tooltip />
            <Area type="monotone" dataKey="pct" stroke="#FFD400" fill="url(#colorYellow)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
