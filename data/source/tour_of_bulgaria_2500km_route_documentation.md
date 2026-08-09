# Tour of Bulgaria — 2,500 km Sales Bicycle Race

## Purpose
This package gives the web-app developer one canonical **2,500 km** progress scale while retaining all **96 ordered towns and villages** as fine routing anchors. The official milestone order and the route geometry are unchanged; only the distance scale and presentation were aligned with the fine-anchored road result.

## Distance decision
| Measure | Distance | Use |
|---|---:|---|
| Original Google-session composite | 2,000 km | Historical planning estimate |
| Fine-anchored routed road course | approximately 2,500 km | Closer representation when all 96 anchors are retained |
| **Canonical competition course** | **2,500 km** | **Single source of truth for UI, scoring and team advancement** |

All former `competition_km` positions were multiplied by **1.25**, preserving the exact route order and relative position of every milestone and inner village. The runtime router can still vary slightly as road data change, but the competition remains fixed at 2,500 km.

## Canonical session ranges
| Session | Route | Canonical range | Canonical distance |
|---:|---|---:|---:|
| 1 | Sofia → Krumovgrad | 0.0–1,581.2 km | 1,581.2 km |
| 3 | Krumovgrad → Rudozem → Dospat → Plovdiv | 1,581.2–1,988.8 km | 407.6 km |
| 2 | Plovdiv → Pazardzhik → Bansko → Gotse Delchev → Sandanski → Blagoevgrad → Dupnitsa → Sofia | 1,988.8–2,500.0 km | 511.2 km |

## Official milestone order
1. **Sofia** — 0.0 km (session 1)
2. **Lom** — 175.5 km (session 1)
3. **Ruse** — 550.2 km (session 1)
4. **Silistra** — 696.5 km (session 1)
5. **Shumen** — 832.6 km (session 1)
6. **Varna** — 950.2 km (session 1)
7. **Burgas** — 1,083.1 km (session 1)
8. **Sliven** — 1,214.8 km (session 1)
9. **Svilengrad** — 1,389.0 km (session 1)
10. **Krumovgrad** — 1,581.2 km (session 1)
11. **Rudozem** — 1,712.4 km (session 3)
12. **Dospat** — 1,828.0 km (session 3)
13. **Plovdiv** — 1,988.8 km (session 3)
14. **Pazardzhik** — 2,033.0 km (session 2)
15. **Bansko** — 2,163.6 km (session 2)
16. **Gotse Delchev** — 2,219.9 km (session 2)
17. **Sandanski** — 2,309.9 km (session 2)
18. **Blagoevgrad** — 2,378.2 km (session 2)
19. **Dupnitsa** — 2,414.0 km (session 2)
20. **Sofia** — 2,500.0 km (session 2)

## Data model
- `competition_total_km`: fixed at `2500`.
- `route_anchors`: all 96 ordered milestones and inner towns/villages.
- `competition_km`: cumulative canonical UI/scoring distance from 0 to 2,500.
- `is_milestone`: `true` only for official Google Maps milestones.
- `source_session`: screenshot session 1, 2, or 3.
- `segments`: consecutive anchor pairs for interpolation or server-side routing.
- `fallback_geojson`: complete ordered LineString through all anchors.

## Recommended web-app integration
1. Use `2500` and `competition_km` as the only advancement scale.
2. For a team at distance `d`, locate the two anchors surrounding `d` and interpolate between them.
3. Retain all 96 anchors when requesting road geometry; they are intentional and provide the required fine granularity.
4. Display the road in Google-style blue (`#1A73E8`), with stronger markers for official milestones.
5. Cache routed GeoJSON in production; public demo routing services may change or temporarily fail.

## Fine route table
| # | Place | Milestone | Session | Competition km | Latitude | Longitude | Corridor / note |
|---:|---|:---:|---:|---:|---:|---:|---|
| 1 | Sofia | Yes | 1 | 0.0 | 42.697700 | 23.321900 | Start / finish |
| 2 | Kostinbrod |  | 1 | 21.0 | 42.816700 | 23.216700 | Road 8 / E80 corridor |
| 3 | Buchin Prohod |  | 1 | 37.0 | 42.896900 | 23.118400 | Petrohan approach |
| 4 | Petrohan Pass |  | 1 | 69.6 | 43.116300 | 23.116700 | Petrohan mountain pass |
| 5 | Berkovitsa |  | 1 | 87.4 | 43.236100 | 23.125800 | Road 81 |
| 6 | Montana |  | 1 | 115.6 | 43.412500 | 23.225000 | Road 81 |
| 7 | Dolno Tserovene |  | 1 | 142.5 | 43.591700 | 23.258300 | Road 81 |
| 8 | Lom | Yes | 1 | 175.5 | 43.813900 | 23.236100 | Google milestone |
| 9 | Valchedram |  | 1 | 204.2 | 43.692700 | 23.445700 | Danube plain corridor |
| 10 | Kozloduy |  | 1 | 236.6 | 43.775600 | 23.724800 | Danube corridor |
| 11 | Mizia |  | 1 | 255.4 | 43.690600 | 23.853800 | Danube corridor |
| 12 | Oryahovo |  | 1 | 268.6 | 43.736400 | 23.960400 | Danube corridor |
| 13 | Knezha |  | 1 | 306.6 | 43.495000 | 24.079900 | Road toward Pleven |
| 14 | Dolni Dabnik |  | 1 | 347.6 | 43.406600 | 24.440400 | Road toward Pleven |
| 15 | Pleven |  | 1 | 365.6 | 43.417000 | 24.606700 | E83 corridor |
| 16 | Levski |  | 1 | 424.0 | 43.360600 | 25.143100 | Pleven–Byala corridor |
| 17 | Byala |  | 1 | 489.5 | 43.461600 | 25.734200 | E83 / Road 5 junction |
| 18 | Ruse | Yes | 1 | 550.2 | 43.835600 | 25.965700 | Google milestone |
| 19 | Slivo Pole |  | 1 | 580.5 | 43.942700 | 26.206800 | Danube road 21 |
| 20 | Tutrakan |  | 1 | 626.9 | 44.049300 | 26.615800 | Danube road 21 |
| 21 | Srebarna |  | 1 | 676.2 | 44.098900 | 27.073400 | Danube road 21 |
| 22 | Aydemir |  | 1 | 686.2 | 44.100300 | 27.166800 | Silistra approach |
| 23 | Silistra | Yes | 1 | 696.5 | 44.117100 | 27.260600 | Google milestone |
| 24 | Alfatar |  | 1 | 722.1 | 43.945100 | 27.287000 | Road 7 |
| 25 | Dulovo |  | 1 | 746.8 | 43.816700 | 27.141700 | Road 7 |
| 26 | Hitrino |  | 1 | 808.5 | 43.433300 | 26.916700 | Shumen approach |
| 27 | Shumen | Yes | 1 | 832.6 | 43.270600 | 26.922900 | Google milestone |
| 28 | Kaspichan |  | 1 | 859.0 | 43.309300 | 27.160900 | A2 corridor |
| 29 | Novi Pazar |  | 1 | 866.1 | 43.350000 | 27.197000 | A2 corridor |
| 30 | Devnya |  | 1 | 910.6 | 43.222200 | 27.569400 | A2 corridor |
| 31 | Aksakovo |  | 1 | 938.2 | 43.256400 | 27.821100 | Varna approach |
| 32 | Varna | Yes | 1 | 950.2 | 43.214100 | 27.914700 | Google milestone |
| 33 | Staro Oryahovo |  | 1 | 976.9 | 43.044700 | 27.997000 | Coastal road 9 |
| 34 | Byala (Varna Province) |  | 1 | 1,004.8 | 42.874300 | 27.888700 | Coastal road 9 |
| 35 | Obzor |  | 1 | 1,013.0 | 42.819200 | 27.879900 | Coastal road 9 |
| 36 | Banya (Nessebar) |  | 1 | 1,028.4 | 42.769000 | 27.756200 | Coastal road 9 |
| 37 | Sunny Beach |  | 1 | 1,040.4 | 42.695200 | 27.710400 | Coastal road 9 |
| 38 | Pomorie |  | 1 | 1,061.9 | 42.558800 | 27.643000 | Burgas approach |
| 39 | Burgas | Yes | 1 | 1,083.1 | 42.504800 | 27.462600 | Google milestone |
| 40 | Kameno |  | 1 | 1,103.6 | 42.570800 | 27.298800 | A1 corridor |
| 41 | Karnobat |  | 1 | 1,140.0 | 42.650000 | 26.983300 | A1 corridor |
| 42 | Straldzha |  | 1 | 1,173.5 | 42.600000 | 26.683300 | A1 corridor |
| 43 | Sliven | Yes | 1 | 1,214.8 | 42.681700 | 26.322900 | Google milestone |
| 44 | Yambol |  | 1 | 1,250.0 | 42.484100 | 26.503500 | Road 7 corridor |
| 45 | Elhovo |  | 1 | 1,297.0 | 42.171300 | 26.573600 | Road 7 corridor |
| 46 | Topolovgrad |  | 1 | 1,326.5 | 42.083300 | 26.333300 | Sakar corridor |
| 47 | Lyubimets |  | 1 | 1,372.8 | 41.833300 | 26.083300 | Svilengrad approach |
| 48 | Svilengrad | Yes | 1 | 1,389.0 | 41.766700 | 26.200000 | Google milestone; postal code 6500 |
| 49 | Harmanli |  | 1 | 1,429.9 | 41.929600 | 25.901200 | A4 / Road 8 corridor |
| 50 | Haskovo |  | 1 | 1,468.1 | 41.934400 | 25.555400 | Road 5 corridor |
| 51 | Mineralni Bani |  | 1 | 1,490.6 | 41.940600 | 25.350800 | Eastern Rhodopes corridor |
| 52 | Kardzhali |  | 1 | 1,533.8 | 41.650000 | 25.366700 | Road 5 corridor |
| 53 | Momchilgrad |  | 1 | 1,552.6 | 41.526900 | 25.407500 | Road 5 corridor |
| 54 | Krumovgrad | Yes | 1 | 1,581.2 | 41.470800 | 25.654200 | Session 1 finish / Session 3 start |
| 55 | Kirkovo |  | 3 | 1,628.6 | 41.327500 | 25.363700 | Detour corridor |
| 56 | Benkovski |  | 3 | 1,646.9 | 41.350000 | 25.233300 | Detour corridor |
| 57 | Zlatograd |  | 3 | 1,666.4 | 41.379500 | 25.096100 | Eastern Rhodopes |
| 58 | Nedelino |  | 3 | 1,680.4 | 41.456000 | 25.080600 | Eastern Rhodopes |
| 59 | Rudozem | Yes | 3 | 1,712.4 | 41.487500 | 24.849400 | Google detour milestone; postal code 4960 |
| 60 | Smolyan |  | 3 | 1,738.4 | 41.577400 | 24.701100 | Rhodopes mountain corridor |
| 61 | Shiroka Laka |  | 3 | 1,762.8 | 41.679200 | 24.583800 | Rhodopes mountain corridor |
| 62 | Devin |  | 3 | 1,790.2 | 41.743300 | 24.400000 | Rhodopes mountain corridor |
| 63 | Borino |  | 3 | 1,808.2 | 41.684400 | 24.293400 | Dospat approach |
| 64 | Dospat | Yes | 3 | 1,828.0 | 41.644000 | 24.158600 | Google detour milestone; postal code 4831 |
| 65 | Sarnitsa |  | 3 | 1,852.9 | 41.738000 | 24.025300 | Western Rhodopes |
| 66 | Batak |  | 3 | 1,898.2 | 41.942300 | 24.218100 | Road toward Peshtera |
| 67 | Peshtera |  | 3 | 1,918.4 | 42.033700 | 24.302400 | Road 37 corridor |
| 68 | Krichim |  | 3 | 1,941.4 | 42.041400 | 24.472900 | Plovdiv approach |
| 69 | Stamboliyski |  | 3 | 1,960.5 | 42.135400 | 24.535300 | Plovdiv approach |
| 70 | Plovdiv | Yes | 3 | 1,988.8 | 42.135400 | 24.745300 | Session 3 finish / Session 2 continuation |
| 71 | Tsalapitsa |  | 2 | 2,008.6 | 42.183300 | 24.566700 | A1 corridor |
| 72 | Pazardzhik | Yes | 2 | 2,033.0 | 42.192800 | 24.333600 | Google milestone |
| 73 | Belovo |  | 2 | 2,068.0 | 42.213100 | 23.999000 | Western Rhodopes approach |
| 74 | Velingrad |  | 2 | 2,094.2 | 42.027500 | 23.991600 | Road 84 corridor |
| 75 | Yakoruda |  | 2 | 2,126.5 | 42.025300 | 23.684200 | Road 84 corridor |
| 76 | Razlog |  | 2 | 2,156.5 | 41.886300 | 23.467100 | Bansko approach |
| 77 | Bansko | Yes | 2 | 2,163.6 | 41.838300 | 23.488500 | Google milestone |
| 78 | Dobrinishte |  | 2 | 2,171.8 | 41.819000 | 23.561500 | Road 19 corridor |
| 79 | Mesta |  | 2 | 2,187.0 | 41.733300 | 23.650000 | Mesta valley |
| 80 | Garmen |  | 2 | 2,211.8 | 41.598000 | 23.799000 | Gotse Delchev approach |
| 81 | Gotse Delchev | Yes | 2 | 2,219.9 | 41.573600 | 23.729400 | Google milestone |
| 82 | Hadzhidimovo |  | 2 | 2,236.2 | 41.522300 | 23.868600 | Southern detour corridor |
| 83 | Koprivlen |  | 2 | 2,245.4 | 41.487000 | 23.795000 | Southern detour corridor |
| 84 | Paril |  | 2 | 2,262.1 | 41.440000 | 23.650000 | Mountain road corridor |
| 85 | Katuntsi |  | 2 | 2,285.2 | 41.446700 | 23.431100 | Sandanski approach |
| 86 | Melnik |  | 2 | 2,296.8 | 41.523300 | 23.393500 | Sandanski approach |
| 87 | Sandanski | Yes | 2 | 2,309.9 | 41.566700 | 23.283300 | Google milestone |
| 88 | Kresna |  | 2 | 2,337.2 | 41.733300 | 23.150000 | E79 / A3 corridor |
| 89 | Simitli |  | 2 | 2,360.0 | 41.891900 | 23.111100 | E79 / A3 corridor |
| 90 | Blagoevgrad | Yes | 2 | 2,378.2 | 42.020900 | 23.094300 | Google milestone |
| 91 | Kocherinovo |  | 2 | 2,388.0 | 42.084300 | 23.057000 | A3 corridor |
| 92 | Dupnitsa | Yes | 2 | 2,414.0 | 42.264400 | 23.108600 | Google milestone |
| 93 | Dolna Dikanya |  | 2 | 2,443.1 | 42.466700 | 23.166700 | A3 corridor |
| 94 | Pernik |  | 2 | 2,466.9 | 42.605200 | 23.037800 | Sofia approach |
| 95 | Vladaya |  | 2 | 2,484.1 | 42.628400 | 23.200900 | Sofia approach |
| 96 | Sofia | Yes | 2 | 2,500.0 | 42.697700 | 23.321900 | Finish |

## Accuracy and operational note
The supplied screenshots establish milestone order and the original Google session estimates. The detailed route deliberately uses all 96 inner settlements as routing anchors. Because that fine-grained road geometry produces a result close to 2,500 km, **2,500 km is now the single canonical number** across the JSON, Markdown and HTML. Runtime road totals can vary slightly with routing-engine updates, but must not replace the fixed competition total in the UI.
