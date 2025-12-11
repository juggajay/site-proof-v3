## 1. Setup

- [x] 1.1 Add `tsx` as a dev dependency for running TypeScript scripts
- [x] 1.2 Add `"seed": "tsx src/scripts/seed.ts"` script to package.json
- [x] 1.3 Create `src/scripts/` directory

## 2. Script Implementation

- [x] 2.1 Create `src/scripts/seed.ts` with Supabase Admin Client initialization
- [x] 2.2 Implement idempotency check (find/delete existing 'CivilOS Demo Corp')
- [x] 2.3 Implement Scenario 1: The Setup
  - [x] Create Organization: 'CivilOS Demo Corp'
  - [x] Create Vendor 1 (Internal): 'CivilOS Plant Hire' with plant resources
  - [x] Create Vendor 2 (Subbie): 'ABC Excavations' with labor resources
  - [x] Define Rate Cards: Laborer ($60/hr), Operator ($90/hr), 5T Excavator ($110/hr)
- [x] 2.4 Implement Scenario 2: The Job
  - [x] Create Project: 'Highway Upgrade - Stage 1'
  - [x] Create 10 Lots: 'L-100' to 'L-109' with mixed statuses
- [x] 2.5 Implement Scenario 3: The History (Cost Generation)
  - [x] Generate 14 days of Diary Entries (relative to current date)
  - [x] Vary hours randomly (8h - 10h) per entry
  - [x] Ensure at least one Diary is 'draft' status
  - [x] Correctly freeze rates on diary entries
- [x] 2.6 Implement Scenario 4: The Quality (ITPs)
  - [x] Create ITP Template: 'Earthworks Compaction' with Hold Point
  - [x] Attach ITP to Lot 'L-105'
  - [x] Create ITP checks with mixed statuses (pass/fail)

## 3. Validation

- [x] 3.1 Test script execution with `npm run seed`
- [ ] 3.2 Verify data appears correctly in Reports Dashboard
- [ ] 3.3 Verify ITP data shows in Quality workflows
- [x] 3.4 Test idempotency (run seed twice, confirm no duplicates)
