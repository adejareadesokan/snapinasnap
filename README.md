# SNAP in a Snap

A free, mobile-first helper for people shopping with SNAP/EBT in New Orleans. It plans a grocery trip: compare prices across nearby stores, include the cost of getting there, and get directions. Available in English, Spanish and Vietnamese.

> A free helper, not a government site. Prices, deals and events are sample data.

**Live app**: https://snapinasnap.lovable.app

## What it does

- **Welcome (`/`)** — three choices: Shop with EBT, Learn about SNAP, Get help.
- **Shop (`/shop`)** — enter a ZIP and travel mode (car, bus, walk), build a list by searching or browsing categories (Breakfast, Lunch, Dinner, Snacks, Produce, Pantry, Baby, Household), or load the usual cart.
- **AI list entry** — type what you need in plain words ("2 milk, huevos, something for dinner") in English, Spanish, Vietnamese, Louisiana/Cajun French or a mix. Items are matched to the catalog only; up to three optional meal suggestions are offered. Text is not stored or logged.
- **Compare (`/compare`)** — best single store vs. best two-store split, including travel cost, SNAP vs. cash breakdown, deals on your list, and suggestions.
- **Trip (`/trip`)** — map of your stops, directions (Apple or Google Maps), and nearby events along the way.
- **Learn (`/learn`)** — what SNAP/EBT covers, what it doesn't, Louisiana rules, and how to apply, with official links.
- **Help (`/help`)** — Louisiana SNAP help line and 211, one tap to call.

## Tech

- TanStack Start (React 19, Vite) with Tailwind CSS v4
- Lovable Cloud server function + Lovable AI for list parsing
- Leaflet map
- Vitest tests for pricing/route math, catalog, AI output handling, routing and official links

## Project layout

- `src/data/` — catalog (`items.json`), stores, deals, events, ZIP coordinates, official benefit links
- `src/lib/planner.ts` — pricing, travel cost and plan calculations
- `src/lib/catalog.ts` — category + multilingual search
- `src/lib/parse-list*.ts` — AI list parsing and validation
- `src/i18n/` — en / es / vi strings
- `src/components/snap/` — screens and shared UI
- `src/routes/` — pages

## Development

```sh
npm i
npm run dev
npx vitest run
```

Built with [Lovable](https://lovable.dev/projects/ffb57748-5d9f-46c3-8941-c40186971cba).
