## ADDED Requirements

### Requirement: Project CRUD Operations
The system SHALL allow Managers to create, read, update, and list Projects belonging to their organization.

#### Scenario: Create a new project
- **WHEN** a Manager submits a new project with name "Highway Upgrade" and code "HWY-2024"
- **THEN** the project is created with status "Active"
- **AND** the project is associated with the Manager's organization

#### Scenario: List active projects
- **WHEN** a Manager views the projects page
- **THEN** all projects for their organization are displayed as cards
- **AND** each card shows the project name, code, and count of open lots

#### Scenario: View project details
- **WHEN** a Manager selects a project
- **THEN** the project dashboard is displayed with the Lot Register as the primary view

#### Scenario: Update project details
- **WHEN** a Manager edits a project's name, code, or status
- **THEN** the project is updated
- **AND** if the code is changed, the new code must be unique within the organization

### Requirement: Project Code Uniqueness
The system SHALL enforce that Project Codes are unique within an organization.

#### Scenario: Reject duplicate project code
- **WHEN** a Manager attempts to create or update a project with a code that already exists
- **THEN** the operation fails with a validation error
- **AND** the user is notified that the code is already in use

### Requirement: Lot CRUD Operations
The system SHALL allow Managers to create, read, update status, and list Lots within a Project.

#### Scenario: Create a single lot
- **WHEN** a Manager adds a lot with number "101" and description "Earthworks ch0-100" to a project
- **THEN** the lot is created with status "Open"
- **AND** the lot is associated with the project and organization

#### Scenario: List lots in a project
- **WHEN** a Manager views a project's Lot Register
- **THEN** all lots for that project are displayed in a DataTable
- **AND** columns include: Lot #, Description, Status, Created At

#### Scenario: Update lot status
- **WHEN** a Manager changes a lot's status from "Open" to "Conformed" or "Closed"
- **THEN** the lot status is updated

### Requirement: Lot Number Uniqueness Within Project
The system SHALL enforce that Lot Numbers are unique within a Project.

#### Scenario: Reject duplicate lot number in same project
- **WHEN** a Manager attempts to create a lot with a number that already exists in the same project
- **THEN** the operation fails with a validation error
- **AND** the user is notified that the lot number already exists in this project

### Requirement: Bulk Lot Import
The system SHALL allow Managers to create multiple lots at once via CSV input.

#### Scenario: Import lots from CSV text
- **WHEN** a Manager pastes CSV lines (e.g., "101, Earthworks ch0-100\n102, Earthworks ch100-200")
- **THEN** each line is parsed as "lot_number, description"
- **AND** all valid lots are created
- **AND** the system handles both comma and tab separators

#### Scenario: Handle malformed CSV lines
- **WHEN** a Manager submits CSV with invalid lines (e.g., empty lines, lines with only whitespace)
- **THEN** invalid lines are skipped
- **AND** valid lines are still processed
- **AND** the user is notified of any skipped lines

### Requirement: Lot Deletion Protection
The system SHALL prevent deletion of Lots that have linked Diary Entries or ITPs.

#### Scenario: Block deletion of lot with linked records
- **WHEN** a Manager attempts to delete a lot that has associated Diary Entries or ITPs
- **THEN** the deletion is blocked
- **AND** the user is notified that the lot cannot be deleted due to linked records

#### Scenario: Allow deletion of lot without linked records
- **WHEN** a Manager attempts to delete a lot with no associated Diary Entries or ITPs
- **THEN** the lot is deleted successfully

### Requirement: Project Status Management
The system SHALL support Project status values of "Active" and "Archived".

#### Scenario: Archive a project
- **WHEN** a Manager changes a project's status to "Archived"
- **THEN** the project no longer appears in the default project list view
- **AND** the project remains accessible via a filter or archive view
