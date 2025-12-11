# Change: Add Project & Lot Management

## Why
The CivilOS platform needs a way for Managers to create and manage Projects and their spatial sub-divisions (Lots). Projects and Lots provide the location context required for Diaries and ITPs - without this module, users cannot organize their construction work by site location.

## What Changes
- Add server actions for CRUD operations on projects (`getProjects`, `getProject`, `createProject`, `updateProject`)
- Add server actions for lot management (`getLots`, `createLot`, `bulkCreateLots`, `updateLotStatus`)
- Add Zod validation schemas for `ProjectSchema` and `LotSchema`
- Build UI components: `ProjectDialog`, `LotRegister` DataTable, `LotDialog`, `BulkLotImporter`
- Implement project list page at `/app/(office)/projects` with grid of project cards
- Implement project detail page at `/app/(office)/projects/[id]` with Lot Register as primary view
- Enforce business rules: unique project codes, unique lot numbers within a project, prevent lot deletion when linked to Diary Entries or ITPs

## Impact
- Affected specs: `project-management` (new capability)
- Affected code:
  - `src/app/actions/projects.ts` (new)
  - `src/app/actions/lots.ts` (new)
  - `src/lib/schemas/projects.ts` (new)
  - `src/components/features/projects/` (new directory)
  - `src/app/(office)/projects/page.tsx` (modify existing placeholder)
  - `src/app/(office)/projects/[id]/page.tsx` (new)
- Database tables used: `projects`, `lots` (already exist in schema)
