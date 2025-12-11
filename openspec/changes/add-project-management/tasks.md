## 1. Schemas & Types
- [x] 1.1 Create `src/lib/schemas/projects.ts` with `ProjectSchema` and `LotSchema` Zod schemas
- [x] 1.2 Export insert/update schema variants and TypeScript types

## 2. Server Actions - Projects
- [x] 2.1 Create `src/app/actions/projects.ts` with `getProjects()`
- [x] 2.2 Add `getProject(id)` for fetching single project with lot count
- [x] 2.3 Add `createProject(data)` with code uniqueness validation
- [x] 2.4 Add `updateProject(id, data)` with code uniqueness validation

## 3. Server Actions - Lots
- [x] 3.1 Create `src/app/actions/lots.ts` with `getLots(projectId)`
- [x] 3.2 Add `createLot(projectId, data)` with lot number uniqueness validation
- [x] 3.3 Add `bulkCreateLots(projectId, csvString)` with CSV parsing (comma/tab support)
- [x] 3.4 Add `updateLotStatus(lotId, status)` for status changes
- [x] 3.5 Add `deleteLot(lotId)` with linked records check (block if diaries/ITPs exist)

## 4. UI Components
- [x] 4.1 Create `src/components/features/projects/project-dialog.tsx` for create/edit project form
- [x] 4.2 Create `src/components/features/projects/project-card.tsx` for project grid display
- [x] 4.3 Create `src/components/features/projects/lot-register.tsx` DataTable with columns: Lot #, Description, Status, Created At
- [x] 4.4 Create `src/components/features/projects/lot-dialog.tsx` for single lot creation
- [x] 4.5 Create `src/components/features/projects/bulk-lot-importer.tsx` with textarea for CSV input
- [x] 4.6 Create `src/components/features/projects/index.ts` barrel export

## 5. Pages
- [x] 5.1 Update `src/app/(office)/projects/page.tsx` to fetch and display project cards grid
- [x] 5.2 Create `src/app/(office)/projects/[id]/page.tsx` with project dashboard and Lot Register
- [x] 5.3 Create `src/app/(office)/projects/[id]/project-detail-client.tsx` for client-side interactivity

## 6. Testing & Validation
- [ ] 6.1 Verify project creation with unique code enforcement
- [ ] 6.2 Verify lot creation with unique lot number per project
- [ ] 6.3 Verify bulk lot import handles comma and tab separators
- [ ] 6.4 Verify lot deletion protection when linked to diaries/ITPs
- [ ] 6.5 Verify project status filtering (Active vs Archived)
