-- Add is_hold_point column to itp_checks table
-- This column indicates whether a check item is a "hold point" requiring supervisor sign-off

alter table itp_checks
add column if not exists is_hold_point boolean default false;
