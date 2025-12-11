import { z } from "zod"

// Project schemas
export const projectStatusEnum = z.enum(["Active", "Archived"])

export const insertProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  code: z.string().min(1, "Project code is required"),
  status: projectStatusEnum.default("Active"),
})

export const updateProjectSchema = insertProjectSchema.partial()

// Use z.input for form types since forms provide data before defaults are applied
export type InsertProjectSchema = z.input<typeof insertProjectSchema>
export type UpdateProjectSchema = z.input<typeof updateProjectSchema>

// Lot schemas
export const lotStatusEnum = z.enum(["Open", "Conformed", "Closed"])

export const insertLotSchema = z.object({
  lot_number: z.string().min(1, "Lot number is required"),
  description: z.string().optional().nullable(),
})

export const updateLotStatusSchema = z.object({
  status: lotStatusEnum,
})

export type InsertLotSchema = z.infer<typeof insertLotSchema>
export type UpdateLotStatusSchema = z.infer<typeof updateLotStatusSchema>
export type LotStatus = z.infer<typeof lotStatusEnum>

// Bulk import result type
export interface BulkImportResult {
  created: number
  skipped: number
  skippedLines: string[]
  duplicates: string[]
}
