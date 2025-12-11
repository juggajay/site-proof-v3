# Change: Add ITP Quality System

## Why
CivilOS needs a Quality Assurance module for managing Inspection & Test Plans (ITPs). Managers create reusable templates; Foremen execute checklists against specific Lots in the field. This completes the third pillar of the platform (Resource Management, Cost Tracking, Quality Assurance).

## What Changes
- **New ITP Template Management**: Manager-facing UI to create/edit ITP templates with check items and hold point markers
- **Template Snapshot Logic**: When attaching an ITP to a Lot, the system copies all template items into individual `itp_checks` rows (immutable snapshot)
- **Mobile Checklist Runner**: Foreman-facing UI with Pass/Fail/NA toggles and photo upload for evidence
- **Validation Rules**: Fail status requires photo evidence; completion requires all items passed or N/A
- **Hold Point Visual Emphasis**: Items marked as hold points get distinct styling

## Impact
- **Affected tables**: `itp_templates`, `lot_itps`, `itp_checks` (all exist in schema)
- **New routes**:
  - `/app/(office)/library` - Template list
  - `/app/(office)/library/[id]` - Template builder
  - `/app/(field)/itps` - Foreman ITP list
  - `/app/(field)/itps/[id]` - Checklist runner
- **New files**:
  - `src/app/actions/itps.ts` - Server actions
  - `src/lib/schemas/itps.ts` - Zod schemas
  - `src/components/features/itps/*` - UI components
- **Storage**: New Supabase bucket `itp-photos` for evidence uploads
