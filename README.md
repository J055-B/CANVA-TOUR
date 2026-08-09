# TOUR OF BULGARIA — CANVA Edition

Requirements
- Node 18+ and npm

Install
```
npm install
```

Run dev
```
npm run dev
```

Build
```
npm run build
```

Canonical route source: `data/bulgaria-route.json`; app route adapter: `data/route.ts`.
Live CANVA target/history: Google Sheets via `lib/data-source.ts`; local fallback is `data/teams.ts`.

Deploy to Vercel by importing the repo — no special config required.
