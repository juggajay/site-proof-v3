# Tasks: Add Financial Reporting

## 1. Server Actions
- [x] 1.1 Create `src/app/actions/reports.ts` with `getWeeklyReportData` server action
- [x] 1.2 Implement SQL aggregation query joining `diary_entries` -> `diaries` -> `resources` -> `vendors`
- [x] 1.3 Add date range filtering and optional vendor/project filters
- [x] 1.4 Add `getReportsSummary` action for dashboard metrics

## 2. UI Components
- [x] 2.1 Create `src/components/ui/date-range-picker.tsx` using shadcn/ui Calendar
- [x] 2.2 Create `src/components/features/reports/summary-cards.tsx` for metric display
- [x] 2.3 Create `src/components/features/reports/report-table.tsx` with vendor grouping
- [x] 2.4 Add currency formatting utility (`formatCents` -> "$X,XXX.XX")

## 3. Reports Dashboard
- [x] 3.1 Update `src/app/(office)/reports/page.tsx` with real summary data
- [x] 3.2 Add Summary Cards showing Total Cost, Total Hours, Active Resources
- [x] 3.3 Add quick links to Weekly Report and other report types

## 4. Weekly Report View
- [x] 4.1 Create `src/app/(office)/reports/weekly/page.tsx`
- [x] 4.2 Add client component with DateRangePicker and VendorFilter
- [x] 4.3 Integrate ReportTable with server data
- [x] 4.4 Add loading states and empty states

## 5. Export Functionality
- [x] 5.1 Add CSV export button to weekly report
- [x] 5.2 Implement client-side CSV generation from report data

## 6. Testing & Validation
- [ ] 6.1 Verify aggregation accuracy with test diary data
- [ ] 6.2 Test date range edge cases (empty ranges, future dates)
- [ ] 6.3 Test vendor filtering produces correct subsets
