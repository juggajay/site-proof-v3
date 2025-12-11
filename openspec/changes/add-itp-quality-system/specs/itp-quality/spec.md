## ADDED Requirements

### Requirement: ITP Template Management
The system SHALL allow Managers to create, edit, and delete ITP templates. Each template SHALL have a title and a list of check items. Each check item SHALL have question text and an optional "Hold Point" designation.

#### Scenario: Manager creates new template
- **WHEN** Manager navigates to /app/office/library and clicks "New Template"
- **THEN** a dialog appears to enter template title
- **WHEN** Manager enters "Concrete Pour" and confirms
- **THEN** a new template is created and Manager is redirected to the template builder

#### Scenario: Manager adds check items to template
- **WHEN** Manager is on template builder page
- **THEN** they can add new check items with question text
- **AND** they can toggle "Hold Point" for any item
- **AND** items are saved automatically or on explicit save

#### Scenario: Manager deletes unused template
- **WHEN** Manager attempts to delete a template not attached to any lots
- **THEN** the template is deleted successfully

#### Scenario: Manager cannot delete template in use
- **WHEN** Manager attempts to delete a template attached to one or more lots
- **THEN** the system SHALL prevent deletion and display an error message

### Requirement: Template Snapshot on Lot Attachment
The system SHALL create an immutable snapshot of template items when an ITP is attached to a Lot. Subsequent changes to the template SHALL NOT affect existing Lot ITPs.

#### Scenario: Attach ITP to lot creates snapshot
- **WHEN** a user attaches template "Concrete Pour" (with 5 items) to Lot "L001"
- **THEN** the system creates a `lot_itps` record linking the lot to the template
- **AND** the system creates 5 individual `itp_checks` rows copying each item's question and hold_point status
- **AND** all checks have status "pending"

#### Scenario: Template edit does not affect active ITPs
- **GIVEN** template "Concrete Pour" is attached to Lot "L001" with 5 checks
- **WHEN** Manager adds a 6th item to the template
- **THEN** Lot "L001" ITP still has exactly 5 checks
- **AND** new lots attached to the template will have 6 checks

### Requirement: Check Item Status Updates
The system SHALL allow Foremen to update check item status to Pass, Fail, or N/A. Failed items SHALL require photo evidence before the status can be saved.

#### Scenario: Foreman marks item as Pass
- **WHEN** Foreman taps the Pass button on a check item
- **THEN** the item status is updated to "pass"
- **AND** no photo is required

#### Scenario: Foreman marks item as Fail without photo
- **WHEN** Foreman taps the Fail button on a check item without uploading a photo
- **THEN** the system SHALL prompt for photo evidence
- **AND** the status SHALL NOT be saved until a photo is provided

#### Scenario: Foreman marks item as Fail with photo
- **WHEN** Foreman taps the Fail button and uploads a photo
- **THEN** the photo is uploaded to Supabase Storage
- **AND** the item status is updated to "fail" with the photo URL saved

#### Scenario: Foreman marks item as N/A
- **WHEN** Foreman taps the N/A button on a check item
- **THEN** the item status is updated to "na"
- **AND** no photo is required

### Requirement: ITP Sign-Off Validation
The system SHALL prevent ITP sign-off when any check items are in "pending" or "fail" status. Sign-off SHALL only be allowed when all items are "pass" or "na".

#### Scenario: Sign-off blocked with pending items
- **GIVEN** a Lot ITP has 3 items: 2 pass, 1 pending
- **WHEN** Foreman attempts to sign off the ITP
- **THEN** the system displays error "Cannot sign off: 1 item still pending"
- **AND** the ITP status remains "in_progress"

#### Scenario: Sign-off blocked with failed items
- **GIVEN** a Lot ITP has 3 items: 2 pass, 1 fail (with photo)
- **WHEN** Foreman attempts to sign off the ITP
- **THEN** the system displays error "Cannot sign off: 1 item failed"
- **AND** the ITP status remains "in_progress"

#### Scenario: Successful sign-off
- **GIVEN** a Lot ITP has 3 items: 2 pass, 1 na
- **WHEN** Foreman taps sign off
- **THEN** the ITP status is updated to "complete"
- **AND** no further edits are allowed

### Requirement: Hold Point Visual Emphasis
Check items marked as "Hold Point" SHALL be visually distinct in the Checklist Runner interface.

#### Scenario: Hold point item display
- **GIVEN** a check item has is_hold_point = true
- **WHEN** the Checklist Runner renders the item
- **THEN** the item SHALL display with distinct visual emphasis (e.g., warning color, icon, or border)
- **AND** the hold point designation SHALL be clearly visible to the Foreman

### Requirement: Photo Upload to Supabase Storage
The system SHALL upload ITP evidence photos to Supabase Storage bucket "itp-photos" with client-side compression.

#### Scenario: Photo capture and upload
- **WHEN** Foreman taps "Add Photo" on a check item
- **THEN** the device camera is triggered (or file picker on desktop)
- **WHEN** Foreman captures/selects an image
- **THEN** the image is compressed client-side (max 1200px, quality 0.8)
- **AND** the image is uploaded to the "itp-photos" bucket
- **AND** the returned URL is associated with the check item
