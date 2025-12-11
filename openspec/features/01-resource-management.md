# Feature 01: Vendor & Resource Management

@context {
  description: "Module for Managers to define Subcontractors (Vendors), agreed Pricing (Rate Cards), and Workers/Machines (Resources)."
  actors: ["Manager"]
  base_route: "/app/office/resources"
}

@routes {
  "/app/office/vendors": "DataTable of all Vendors. Columns: Name, Type (Subbie/Internal), Contact, Status."
  "/app/office/vendors/[id]": "Detail view. Tabs: 'Profile', 'Rate Cards', 'Resources'."
  "/app/office/resources": "Global list of all resources (People/Plant) for quick search."
}

@data_requirements {
  tables: ["vendors", "rate_cards", "resources"]

  validations: [
    "A Resource MUST be linked to a Vendor.",
    "A Resource MUST be linked to a Rate Card (Role) to inherit a cost.",
    "Rate Card prices are input in Dollars ($80.00) but saved in Cents (8000).",
    "Deleting a Vendor is soft-delete only (is_active = false)."
  ]
}

@ui_components {
  VendorDialog: "Form to add new Vendor. Fields: Name, ABN, Email, IsInternal (Checkbox)."
  RateCardEditor: "Editable Table component. Rows: Role Name (e.g. 'Laborer'), Rate ($), Unit (hr/day/m3)."
  ResourceForm: "Form to add Person/Machine. logic: Selecting 'Vendor' filters the 'Role' dropdown to only show that Vendor's rates."
}

@server_actions {
  createVendor(data: InsertVendorSchema)
  updateVendor(id, data)
  upsertRateCards(vendorId, cards: RateCardSchema[])
  createResource(data: InsertResourceSchema)
  archiveResource(id)
}
