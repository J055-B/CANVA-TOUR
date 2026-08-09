# CANVA — Tour of Bulgaria implementation

This copy is a single-team edition of the original Tour app.

## Canonical route
- 2,500 km total.
- 96 ordered route anchors.
- 20 official milestones including Sofia start and Sofia finish.
- All `competition_km` values come from the supplied Bulgaria route package.
- The full 96-point chain is retained for OSRM routing and interpolation.
- There are no flight legs in this route.

## CANVA data
- Only `CANVA` is exposed to the leaderboard, map, dashboard and team views.
- The Google Sheets Target row is matched as `BG CANVA`.
- Candidate live sheet tabs accepted: `Canva`, `FTD BG CANVA`, `BG CANVA`, `CANVA`.
- If Google Sheets is unavailable, the local fallback contains CANVA with zero history rather than fabricated sales.

## Scoring
- CANVA is FTD: every sale row counts as **1 sale**, whether the sale is Full or Partial.
- The operational day starts at **08:00**. A sale timestamp before 08:00 belongs to the previous operational day.
- **Friday + Saturday + Sunday count as one competition day**, anchored to Friday.
- Power Stage rates are applied to the whole weekend unit when that weekend is a Power Stage.
- The current Target sheet provides CANVA with a **7.00 daily target** and **147.00 monthly target**; the app reads these live from `Target` rather than hard-coding them.
- The route distance is still the canonical 2,500 km `competition_km` scale. The sales-to-distance rate follows the original Tour rules: 10 km per 1% of target on normal days, 15 km per 1% on the first two Power Stage weekends, and 12.5 km per 1% on the final Power Stage weekend.

## Visuals
The original Callisto UI is retained, with visible Tour branding changed to Tour of Bulgaria / CANVA. The source project only includes a Sofia city video, so Sofia footage is used as the neutral hero background until Bulgaria-specific clips are added.
