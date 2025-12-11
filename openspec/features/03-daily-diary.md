# Feature 03: Daily Diary (Field Capture)

@context {
  description: "Mobile-first experience for Foremen to record daily resource usage (Labor/Plant) against a Lot. This is the primary cost-capture engine."
  actors: ["Foreman"]
  base_route: "/app/field/diary"
}

@routes {
  "/app/field": "Home dashboard. Shows 'Today's Diaries' list and 'My Projects'."
  "/app/field/projects/[id]/lots": "Drill down: Select Project -> Select Lot."
  "/app/field/diary/[id]": "The Diary Editor. Wizard steps: Context -> Resources -> Times -> Notes."
}

@data_requirements {
  tables: ["diaries", "diary_entries", "resources", "rate_cards"]

  logic: [
    "Frozen Rate Logic: When a Resource is added to a diary, the backend MUST query their current `rate_cents` and insert it into `diary_entries.frozen_rate_cents`. NEVER reference the live rate card for historical calculations.",
    "Cost Calc: (FinishTime - StartTime - Break) * frozen_rate_cents.",
    "Project Filter: Foremen can only see Projects belonging to their Organization.",
    "Duplicate Check: Warn if a Diary already exists for this Lot + Date."
  ]
}

@ui_components {
  DiaryWizard: "Multi-step mobile form to reduce cognitive load on small screens."
  ResourcePicker: "Mobile-friendly list with search. Groups resources by Vendor. Multi-select support (e.g. 'Select whole crew')."
  TimeInput: "Large touch-friendly inputs for Start/Finish times (e.g. scroll wheels or big buttons). Auto-calculates Total Hours."
  StatusBadge: "Visual indicator for 'Draft' vs 'Submitted' diaries."
}

@server_actions {
  getForemanDashboard(orgId) // Returns active diaries for today
  initializeDiary(projectId, lotId, date) // Creates a draft diary
  addDiaryEntries(diaryId, resourceIds[]) // Look up rates and insert rows
  updateEntryTime(entryId, start, finish, break) // Recalculate cost
  submitDiary(diaryId) // Lock the diary status to 'submitted'
}
