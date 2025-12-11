import { z } from "zod"

// Diary status enum
export const diaryStatusSchema = z.enum(["draft", "submitted"])
export type DiaryStatus = z.infer<typeof diaryStatusSchema>

// Initialize diary schema
export const initializeDiarySchema = z.object({
  project_id: z.string().uuid("Project is required"),
  lot_id: z.string().uuid("Lot is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
})

export type InitializeDiarySchema = z.infer<typeof initializeDiarySchema>

// Add diary entries schema
export const addDiaryEntriesSchema = z.object({
  diary_id: z.string().uuid("Diary is required"),
  resource_ids: z.array(z.string().uuid()).min(1, "At least one resource is required"),
})

export type AddDiaryEntriesSchema = z.infer<typeof addDiaryEntriesSchema>

// Update entry time schema - times as HH:MM strings
export const updateEntryTimeSchema = z.object({
  entry_id: z.string().uuid("Entry is required"),
  start_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be HH:MM").nullable(),
  finish_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Finish time must be HH:MM").nullable(),
  break_hours: z.number().min(0).max(24).nullable(),
})

export type UpdateEntryTimeSchema = z.infer<typeof updateEntryTimeSchema>

// Update diary notes schema
export const updateDiaryNotesSchema = z.object({
  diary_id: z.string().uuid("Diary is required"),
  notes: z.string().nullable(),
})

export type UpdateDiaryNotesSchema = z.infer<typeof updateDiaryNotesSchema>

// Submit diary schema
export const submitDiarySchema = z.object({
  diary_id: z.string().uuid("Diary is required"),
})

export type SubmitDiarySchema = z.infer<typeof submitDiarySchema>

// Helper to calculate hours from time strings
export function calculateHours(
  startTime: string | null,
  finishTime: string | null,
  breakHours: number | null
): number | null {
  if (!startTime || !finishTime) return null

  const [startH, startM] = startTime.split(":").map(Number)
  const [finishH, finishM] = finishTime.split(":").map(Number)

  const startMinutes = startH * 60 + startM
  const finishMinutes = finishH * 60 + finishM

  // Handle overnight shifts (finish time next day)
  let totalMinutes = finishMinutes - startMinutes
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60
  }

  const totalHours = totalMinutes / 60
  const netHours = totalHours - (breakHours ?? 0)

  return Math.max(0, netHours)
}

// Helper to calculate cost in cents
export function calculateCostCents(
  totalHours: number | null,
  frozenRateCents: number | null
): number | null {
  if (totalHours === null || frozenRateCents === null) return null
  return Math.round(totalHours * frozenRateCents)
}

// Helper to format time for display
export function formatTime(time: string | null): string {
  if (!time) return "--:--"
  return time
}

// Helper to format hours for display
export function formatHours(hours: number | null): string {
  if (hours === null) return "-"
  return `${hours.toFixed(1)}h`
}

// Helper to format cost for display
export function formatCost(cents: number | null): string {
  if (cents === null) return "-"
  return `$${(cents / 100).toFixed(2)}`
}
