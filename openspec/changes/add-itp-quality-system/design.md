## Context

ITPs (Inspection & Test Plans) are quality checklists used in civil construction to verify work meets specifications. The system has two distinct user flows:

1. **Manager (Office)**: Creates reusable templates like "Concrete Pour" with standard check items
2. **Foreman (Field)**: Executes templates against specific Lots, recording Pass/Fail/NA with evidence

The critical requirement is **Template Snapshot Logic**: once an ITP is attached to a Lot, the checklist is frozen. Future template edits must not affect in-progress inspections.

## Goals / Non-Goals

**Goals:**
- Managers can create/edit ITP templates with multiple check items
- Templates can mark items as "Hold Points" (critical inspection points)
- Foremen can execute checklists on mobile with large touch targets
- Failed items require photo evidence before saving
- ITPs cannot be signed off until all items pass or are marked N/A
- Template changes are isolated from active Lot ITPs

**Non-Goals:**
- Drag-and-drop reordering (simple list add/remove is sufficient for MVP)
- Offline support (future enhancement)
- Multi-photo per check item (single photo for MVP)
- PDF export of completed ITPs (future enhancement)

## Decisions

### 1. Template Items Storage
**Decision**: Store template items as JSON array in `itp_templates.items` column (already exists in schema)

```typescript
type TemplateItem = {
  id: string        // UUID for stable identity
  question: string  // The check item text
  is_hold_point: boolean
  order: number     // Sort order
}
```

**Rationale**: Simple to query and update as a unit. No need for separate `itp_template_items` table for MVP.

### 2. Snapshot Implementation
**Decision**: On `attachITPToLot()`, fetch template items JSON and INSERT individual rows into `itp_checks`

```typescript
async function attachITPToLot(lotId: string, templateId: string) {
  // 1. Fetch template with items JSON
  const template = await getTemplate(templateId)

  // 2. Create lot_itp record
  const lotItp = await createLotITP({ lot_id: lotId, template_id: templateId })

  // 3. Expand items into itp_checks rows
  const checks = template.items.map(item => ({
    lot_itp_id: lotItp.id,
    question: item.question,
    is_hold_point: item.is_hold_point,
    status: 'pending',
    photo_url: null
  }))

  await insertChecks(checks)
}
```

**Note**: The `itp_checks` table needs an `is_hold_point` column added (currently missing from schema). This will be handled via Supabase migration.

### 3. Check Status Values
**Decision**: Use string enum: `'pending' | 'pass' | 'fail' | 'na'`

- `pending` - Not yet inspected (default)
- `pass` - Inspection passed
- `fail` - Failed, requires photo evidence
- `na` - Not applicable to this lot

### 4. Photo Upload Flow
**Decision**: Direct upload to Supabase Storage bucket `itp-photos`

```
User taps "Add Photo"
  -> Native camera opens (via input[type=file] accept="image/*" capture="environment")
  -> Client-side compression (max 1200px, 0.8 quality)
  -> Upload to supabase.storage.from('itp-photos').upload()
  -> Store returned URL in itp_checks.photo_url
```

**Rationale**: Simpler than pre-signed URLs for MVP. RLS on storage bucket ensures org isolation.

### 5. Completion Validation
**Decision**: Server-side validation in `signOffITP()`

```typescript
async function signOffITP(lotItpId: string) {
  const checks = await getChecks(lotItpId)

  const pending = checks.filter(c => c.status === 'pending')
  const failed = checks.filter(c => c.status === 'fail')

  if (pending.length > 0) {
    throw new Error(`Cannot sign off: ${pending.length} items still pending`)
  }

  if (failed.length > 0) {
    throw new Error(`Cannot sign off: ${failed.length} items failed`)
  }

  // All items are 'pass' or 'na' - allow completion
  await updateLotITP(lotItpId, { status: 'complete' })
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Large templates slow to load | Paginate checks in UI, lazy load images |
| Photo upload fails on poor connection | Show clear error, allow retry, consider retry queue |
| Foreman accidentally taps wrong status | Require confirmation on sign-off only, allow status changes until signed |

## Migration Plan

1. Add `is_hold_point` boolean column to `itp_checks` table (default false)
2. Create `itp-photos` storage bucket with RLS policy
3. Deploy code changes
4. No data migration needed (new feature)

## Open Questions

- ~~Should we track who performed each check?~~ **Resolved**: Not for MVP, lot_itp has implicit foreman via lot assignment
- ~~Multiple photos per check?~~ **Resolved**: Single photo for MVP, array support can be added later
