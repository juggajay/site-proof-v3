# Change: Finalize ITP Infrastructure

## Why
The ITP Feature (Feature 04) was deployed, but the `is_hold_point` column is missing from the `itp_checks` table. This will cause errors when Foremen try to check hold points in the field.

## What Changes
- Adds `is_hold_point` boolean column to `itp_checks` table (defaults to `false`)

## Impact
- Affected specs: itp-quality-system
- Affected code: `supabase/migrations/`
- Database: Schema update to `itp_checks` table
