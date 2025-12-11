# Feature 04: ITP Quality System

@context {
  description: "System for managing Inspection & Test Plans (ITPs). Templates are created by Managers; Instances are executed by Foremen against specific Lots."
  actors: ["Manager (Templates)", "Foreman (Execution)"]
  base_route: "/app/field/itps"
}

@routes {
  "/app/office/library": "Manager view to create and edit ITP Templates (e.g. 'Concrete Pour')."
  "/app/office/library/[id]": "Template Builder. Dynamic list to add/remove check items."
  "/app/field/itps": "Foreman's list of active ITPs for their projects."
  "/app/field/itps/[id]": "The Checklist Runner. Simple toggle interface [Pass/Fail/NA] with photo upload."
}

@data_requirements {
  tables: ["itp_templates", "lot_itps", "itp_checks"]

  logic: [
    "Template Snapshot: When an ITP is attached to a Lot, the system must COPY all items from the Template into `itp_checks`. Changing the Template later must NOT affect active Lot ITPs.",
    "Mandatory Evidence: If a check status is set to 'Fail', a photo_url is required before saving.",
    "Completion Block: A Lot ITP cannot be marked 'Complete' if any item is 'Fail' or 'Pending'.",
    "Hold Points: Items marked as 'Hold Point' require a distinct visual emphasis."
  ]
}

@ui_components {
  TemplateBuilder: "Desktop component. Drag-and-drop or simple list to define questions. Toggle for 'Is Hold Point?'."
  ChecklistRunner: "Mobile component. List of items. Large touch targets. Accordion style for huge lists."
  StatusToggle: "Three-state button component: [Green Tick] [Red Cross] [Grey Dash]."
  PhotoUploader: "Field component. Button 'Add Photo' -> Triggers native camera -> Compresses -> Uploads to Supabase Storage -> Returns URL."
}

@server_actions {
  createTemplate(data: TemplateSchema)
  updateTemplateItems(templateId, items[])
  attachITPToLot(lotId, templateId) // The 'Snapshot' action
  updateCheckItem(checkId, status, photoUrl?)
  signOffITP(lotITPId) // Validates all passed, sets status to Complete
}
