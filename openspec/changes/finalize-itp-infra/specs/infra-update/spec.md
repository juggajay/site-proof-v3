## ADDED Requirements

### Requirement: Hold Point Column
The `itp_checks` table SHALL have a boolean column named `is_hold_point` that defaults to `false`.

#### Scenario: Default value for new checks
- **WHEN** a new ITP check is created without specifying `is_hold_point`
- **THEN** the column value defaults to `false`

#### Scenario: Hold point flag storage
- **WHEN** an ITP check is created with `is_hold_point = true`
- **THEN** the value is persisted and retrievable
