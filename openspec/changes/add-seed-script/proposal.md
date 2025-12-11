# Change: Add Database Seeding Script for Demo Data

## Why

Developers and sales teams need realistic demo data to test Reports and ITP workflows. Currently, there's no automated way to populate the database with sample civil construction data, making it time-consuming to set up demo environments or test features that depend on historical data (e.g., cost graphs, diary history).

## What Changes

- Add a new developer script (`src/scripts/seed.ts`) that populates the database with realistic civil construction demo data
- Script uses Supabase Admin Client (service_role key) to bypass RLS
- Implements idempotent seeding (checks for existing demo org, cleans up before re-seeding)
- Generates 14 days of historical diary entries with varied hours for realistic report graphs
- Add npm script `"seed": "tsx src/scripts/seed.ts"` for easy execution

## Impact

- Affected specs: New `seed-script` capability (developer tooling)
- Affected code:
  - `src/scripts/seed.ts` (new file)
  - `package.json` (new script + tsx dependency)
- No impact on production code paths - this is a development-only script
