## ADDED Requirements

### Requirement: Cost Report Data Aggregation
The system SHALL aggregate diary entry costs by vendor and resource within a specified date range. Aggregation MUST sum `total_cost_cents` and `total_hours` from `diary_entries`, grouped by `vendor_id` and `resource_id`, filtered by organization and date range.

#### Scenario: Aggregate costs for a single vendor
- **WHEN** Manager requests report for "ABC Excavations" from 2024-01-01 to 2024-01-07
- **THEN** system returns all resources belonging to that vendor with summed hours and costs

#### Scenario: Aggregate costs across all vendors
- **WHEN** Manager requests report for date range without vendor filter
- **THEN** system returns all resources grouped by their parent vendor with totals per resource

#### Scenario: Empty date range
- **WHEN** Manager requests report for a date range with no diary entries
- **THEN** system returns empty result set with zero totals

---

### Requirement: Date Range Selection
Users MUST be able to select a custom date range for reports. The system SHALL provide preset options (This Week, Last Week, This Month) and allow custom start/end date selection.

#### Scenario: Select preset date range
- **WHEN** Manager selects "Last Week" preset
- **THEN** date range auto-populates to Monday-Sunday of previous week

#### Scenario: Select custom date range
- **WHEN** Manager picks start date 2024-01-15 and end date 2024-01-20
- **THEN** report filters to entries within that inclusive range

---

### Requirement: Vendor Filtering
Users MUST be able to filter reports by a specific vendor. When no vendor is selected, the report SHALL show all vendors in the organization.

#### Scenario: Filter by single vendor
- **WHEN** Manager selects "ABC Excavations" from vendor dropdown
- **THEN** report shows only resources belonging to that vendor

#### Scenario: Clear vendor filter
- **WHEN** Manager clears vendor selection
- **THEN** report shows all vendors and their resources

---

### Requirement: Report Dashboard Summary
The Reports Dashboard SHALL display high-level cost metrics including Total Estimated Cost, Total Hours, and Active Resources for the current period.

#### Scenario: View dashboard summary
- **WHEN** Manager navigates to /reports
- **THEN** system displays summary cards with this week's aggregated totals

#### Scenario: Summary reflects current data
- **WHEN** A diary entry is submitted
- **THEN** dashboard summary updates to include the new entry on next page load

---

### Requirement: Grouped Report Table
The Weekly Report view SHALL display a table with resources grouped by vendor. Each resource row MUST show: Resource Name, Days Worked, Total Hours, and Total Cost. Vendor group headers MUST show vendor name and subtotals.

#### Scenario: Display grouped table
- **WHEN** Manager views weekly report with multiple vendors
- **THEN** resources appear grouped under their vendor headers with subtotals per vendor

#### Scenario: Display table footer totals
- **WHEN** Report table renders with data
- **THEN** footer row shows grand totals for Hours and Cost across all vendors

---

### Requirement: Currency Display
All monetary values MUST be displayed in Australian Dollars format with proper formatting. Values stored as cents MUST be converted to dollars (divide by 100) and formatted as "$X,XXX.XX".

#### Scenario: Format large amounts
- **WHEN** Total cost is 1234567 cents
- **THEN** display shows "$12,345.67"

#### Scenario: Format zero amounts
- **WHEN** Total cost is 0 cents
- **THEN** display shows "$0.00"

---

### Requirement: CSV Export
Users MUST be able to export the current report view as a CSV file. The export SHALL include all visible data with proper column headers.

#### Scenario: Export weekly report
- **WHEN** Manager clicks "Export CSV" on weekly report
- **THEN** browser downloads CSV file with vendor, resource, hours, and cost columns

#### Scenario: Export reflects current filters
- **WHEN** Manager has vendor filter applied and exports
- **THEN** CSV contains only the filtered data
