## 1. Foundation

- [x] 1.1 Create `src/lib/schemas/itps.ts` with Zod schemas for templates, checks, and status enums
- [x] 1.2 Create `src/app/actions/itps.ts` with server actions:
  - `getTemplates()` - List all templates for organization
  - `getTemplate(id)` - Get single template with items
  - `createTemplate(data)` - Create new template
  - `updateTemplate(id, data)` - Update template title
  - `updateTemplateItems(templateId, items[])` - Replace template items array
  - `deleteTemplate(id)` - Delete template (only if not attached to any lots)
  - `attachITPToLot(lotId, templateId)` - **Snapshot logic**: copy items to itp_checks
  - `getLotITPs(lotId)` - Get ITPs for a lot
  - `getForemanITPs()` - Get all active ITPs for foreman's projects
  - `getLotITP(id)` - Get single lot ITP with all checks
  - `updateCheckItem(checkId, status, photoUrl?)` - Update check with validation
  - `signOffITP(lotITPId)` - Mark complete (validates all passed/NA)

## 2. Manager UI - Template Library

- [x] 2.1 Create `/app/(office)/library/page.tsx` - Template list page
- [x] 2.2 Create `src/components/features/itps/template-card.tsx` - Template card component
- [x] 2.3 Create `src/components/features/itps/template-dialog.tsx` - Create/edit template dialog
- [x] 2.4 Create `/app/(office)/library/[id]/page.tsx` - Template builder page
- [x] 2.5 Create `src/components/features/itps/template-builder.tsx` - Item list editor with hold point toggle

## 3. Foreman UI - Checklist Runner

- [x] 3.1 Create `/app/(field)/itps/page.tsx` - Foreman's ITP list
- [x] 3.2 Create `src/components/features/itps/itp-card.tsx` - ITP summary card (shows progress)
- [x] 3.3 Create `/app/(field)/itps/[id]/page.tsx` - Checklist runner page
- [x] 3.4 Create `src/components/features/itps/checklist-runner.tsx` - Mobile-optimized checklist
- [x] 3.5 Create `src/components/features/itps/status-toggle.tsx` - Three-state Pass/Fail/NA button
- [x] 3.6 Create `src/components/features/itps/photo-uploader.tsx` - Camera capture + Supabase upload

## 4. Integration

- [x] 4.1 Add ITP attachment UI to lot register (AttachItpDialog component)
- [x] 4.2 Add "ITPs" link to field bottom navigation
- [x] 4.3 Add "ITP Library" link to office sidebar navigation

## 5. Validation

- [x] 5.1 TypeScript compiles without errors
- [x] 5.2 Production build succeeds
- [ ] 5.3 Test template CRUD operations (manual testing required)
- [ ] 5.4 Test snapshot logic - verify template changes don't affect existing lot ITPs (manual testing required)
- [ ] 5.5 Test photo upload flow with compression (requires itp-photos bucket)
- [ ] 5.6 Test fail-requires-photo validation (manual testing required)
- [ ] 5.7 Test completion blocking when items are pending/failed (manual testing required)

## Notes

**Migration Required**: The `is_hold_point` column needs to be added to the `itp_checks` table:
```sql
ALTER TABLE itp_checks ADD COLUMN is_hold_point BOOLEAN DEFAULT false;
```

After migration, uncomment this line in `src/app/actions/itps.ts:232`:
```typescript
// is_hold_point: item.is_hold_point, // TODO: Enable after migration adds column
```

**Storage Bucket Required**: Create `itp-photos` bucket in Supabase Storage with appropriate RLS policies.
