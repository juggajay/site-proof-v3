# Feature 05: Financial Reporting & Insights

@context {
  description: "Module for Managers (The Money Men) to generate cost reports. This aggregates daily diary entries to verify subcontractor invoices."
  actors: ["Manager"]
  base_route: "/app/office/reports"
}

@routes {
  "/app/office/reports": "Dashboard showing high-level cost metrics (Total Spend this Week, Top Vendor Spend)."
  "/app/office/reports/weekly": "Detailed Weekly Cost Report generator."
}

@data_requirements {
  tables: ["diaries", "diary_entries", "vendors", "resources"]

  logic: [
    "Aggregation: Sum `total_cost_cents` from `diary_entries` grouped by `vendor_id` and `resource_id`.",
    "Timeframe: Users must be able to select a custom Date Range (default: This Week).",
    "Filtering: Ability to filter by specific Project or specific Vendor.",
    "Currency: Display values converted from cents to Dollars (e.g., $1,250.00)."
  ]
}

@ui_components {
  DateRangePicker: "Component to select Start/End dates."
  ReportTable: "DataTable. Rows: Resource Name. Columns: Days Worked, Total Hours, Total Cost. Grouped by Vendor."
  SummaryCards: "Top-level metrics: 'Total Est. Cost', 'Total Hours', 'Active Resources'."
  ExportButton: "Button to generate a clean PDF/CSV of the current view for emailing."
}

@server_actions {
  getWeeklyReportData(orgId, startDate, endDate, vendorId?) // Returns aggregated JSON
  generatePDF(reportData) // (Optional MVP) Generates a printable view
}

@workflow {
  step_1: "Manager selects 'Last Week' in date picker."
  step_2: "Manager selects 'ABC Excavations' in vendor filter."
  step_3: "Table updates to show Jack (40hrs - $3200) and Excavator (40hrs - $4000)."
  step_4: "Manager compares this total ($7200) against the PDF invoice sent by ABC Excavations."
}
