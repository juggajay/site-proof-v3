## ADDED Requirements

### Requirement: Database Seeding Script

The system SHALL provide a developer script to populate the database with realistic civil construction demo data for testing Reports and ITP workflows.

#### Scenario: Script initialization with Admin Client

- **WHEN** the script is executed via `npm run seed`
- **THEN** it initializes a Supabase Admin Client using `SUPABASE_SERVICE_ROLE_KEY` from environment
- **AND** bypasses RLS to insert data across all tables

#### Scenario: Idempotent seeding prevents duplicates

- **WHEN** the script is executed
- **THEN** it checks if 'CivilOS Demo Corp' organization already exists
- **AND** if exists, deletes all related data before re-seeding
- **AND** creates fresh demo data without duplicates

### Requirement: Demo Organization Setup

The script SHALL create a complete demo organization with vendors, resources, and rate cards.

#### Scenario: Organization and vendors created

- **WHEN** seeding the setup scenario
- **THEN** creates Organization: 'CivilOS Demo Corp' with slug 'civilos-demo'
- **AND** creates Internal Vendor: 'CivilOS Plant Hire' with is_internal=true
- **AND** creates Subcontractor Vendor: 'ABC Excavations' with is_internal=false

#### Scenario: Resources assigned to vendors

- **WHEN** seeding resources
- **THEN** creates plant resources for internal vendor: '5T Excavator', 'Water Cart'
- **AND** creates labor resources for subcontractor: 'Jack Gammell - Operator', 'Tom Builder - Laborer'

#### Scenario: Rate cards defined

- **WHEN** seeding rate cards
- **THEN** creates rate card: 'Laborer' at 6000 cents ($60.00) per hour
- **AND** creates rate card: 'Operator' at 9000 cents ($90.00) per hour
- **AND** creates rate card: '5T Excavator' at 11000 cents ($110.00) per hour

### Requirement: Demo Project and Lots

The script SHALL create a project with multiple lots in various statuses.

#### Scenario: Project created

- **WHEN** seeding the job scenario
- **THEN** creates Project: 'Highway Upgrade - Stage 1' with status 'active'

#### Scenario: Lots created with varied statuses

- **WHEN** seeding lots
- **THEN** creates 10 lots numbered 'L-100' through 'L-109'
- **AND** assigns mixed statuses: 'open', 'conformed', 'closed'

### Requirement: Historical Diary Data

The script SHALL generate 14 days of historical diary entries for realistic report data.

#### Scenario: Diary entries span past two weeks

- **WHEN** seeding the history scenario
- **THEN** creates diary entries for the past 14 days relative to current date
- **AND** uses date calculation: `new Date().setDate(new Date().getDate() - i)`

#### Scenario: Hours varied for realistic graphs

- **WHEN** generating diary entry hours
- **THEN** varies total hours randomly between 8 and 10 hours
- **AND** calculates total_cost_cents using frozen_rate_cents * total_hours

#### Scenario: Draft diary exists for Foreman testing

- **WHEN** seeding is complete
- **THEN** at least one diary entry has status 'draft'
- **AND** remaining entries have status 'submitted' or 'approved'

#### Scenario: Frozen rates correctly saved

- **WHEN** creating diary entries
- **THEN** frozen_rate_cents captures the resource's rate at time of entry
- **AND** total_cost_cents is calculated from frozen_rate_cents * total_hours

### Requirement: ITP Quality Data

The script SHALL create ITP template and checks for quality workflow testing.

#### Scenario: ITP template with hold point created

- **WHEN** seeding the quality scenario
- **THEN** creates ITP Template: 'Earthworks Compaction'
- **AND** template includes items with at least one hold point item

#### Scenario: ITP attached to lot with checks

- **WHEN** seeding ITP data
- **THEN** attaches ITP to Lot 'L-105'
- **AND** creates ITP checks for each template item
- **AND** marks most items as 'pass' status
- **AND** marks at least one item as 'fail' status for warning system testing
