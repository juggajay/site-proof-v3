# Change: Add Financial Reporting & Insights Module

## Why
Managers ("The Money Men") need to verify subcontractor invoices against actual work recorded in daily diaries. Currently, the Reports page is a placeholder with no functional cost aggregation, leaving managers unable to cross-check vendor claims without manual spreadsheet work.

## What Changes
- Add `reports.ts` server actions with SQL aggregation logic to sum `total_cost_cents` from `diary_entries` grouped by vendor and resource within a date range
- Transform the placeholder Reports Dashboard (`/reports`) into a functional metrics overview with Summary Cards (Total Est. Cost, Total Hours, Active Resources)
- Add Weekly Report View (`/reports/weekly`) with date range picker, vendor filter, and grouped report table
- Create a `ReportTable` component that groups rows by Vendor and displays summary totals
- Add DateRangePicker and export functionality (CSV initially, PDF as stretch goal)

## Impact
- Affected specs: `financial-reporting` (new capability)
- Affected code:
  - `src/app/actions/reports.ts` (new)
  - `src/app/(office)/reports/page.tsx` (modify)
  - `src/app/(office)/reports/weekly/page.tsx` (new)
  - `src/components/features/reports/report-table.tsx` (new)
  - `src/components/features/reports/summary-cards.tsx` (new)
  - `src/components/ui/date-range-picker.tsx` (new)
- No database schema changes required (uses existing `diaries`, `diary_entries`, `vendors`, `resources` tables)
- No breaking changes
