import { z } from "zod"

// Check status enum
export const checkStatusSchema = z.enum(["pending", "pass", "fail", "na"])
export type CheckStatus = z.infer<typeof checkStatusSchema>

// Lot ITP status enum
export const lotItpStatusSchema = z.enum(["in_progress", "complete"])
export type LotItpStatus = z.infer<typeof lotItpStatusSchema>

// Template item schema (stored as JSON in itp_templates.items)
export const templateItemSchema = z.object({
  id: z.string().uuid(),
  question: z.string().min(1, "Question is required"),
  is_hold_point: z.boolean().default(false),
  order: z.number().int().min(0),
})

export type TemplateItem = z.infer<typeof templateItemSchema>

// Create template schema
export const createTemplateSchema = z.object({
  title: z.string().min(1, "Template title is required"),
})

export type CreateTemplateSchema = z.infer<typeof createTemplateSchema>

// Update template schema
export const updateTemplateSchema = z.object({
  title: z.string().min(1, "Template title is required"),
})

export type UpdateTemplateSchema = z.infer<typeof updateTemplateSchema>

// Update template items schema
export const updateTemplateItemsSchema = z.object({
  template_id: z.string().uuid("Template is required"),
  items: z.array(templateItemSchema),
})

export type UpdateTemplateItemsSchema = z.infer<typeof updateTemplateItemsSchema>

// Attach ITP to lot schema
export const attachItpToLotSchema = z.object({
  lot_id: z.string().uuid("Lot is required"),
  template_id: z.string().uuid("Template is required"),
})

export type AttachItpToLotSchema = z.infer<typeof attachItpToLotSchema>

// Update check item schema
export const updateCheckItemSchema = z.object({
  check_id: z.string().uuid("Check is required"),
  status: checkStatusSchema,
  photo_url: z.string().url().nullable().optional(),
})

export type UpdateCheckItemSchema = z.infer<typeof updateCheckItemSchema>

// Sign off ITP schema
export const signOffItpSchema = z.object({
  lot_itp_id: z.string().uuid("Lot ITP is required"),
})

export type SignOffItpSchema = z.infer<typeof signOffItpSchema>

// Helper to generate a new template item
export function createNewTemplateItem(question: string, order: number): TemplateItem {
  return {
    id: crypto.randomUUID(),
    question,
    is_hold_point: false,
    order,
  }
}

// Helper to format status for display
export function formatCheckStatus(status: CheckStatus): string {
  switch (status) {
    case "pending":
      return "Pending"
    case "pass":
      return "Pass"
    case "fail":
      return "Fail"
    case "na":
      return "N/A"
  }
}

// Helper to get status color classes
export function getStatusColorClasses(status: CheckStatus): string {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-700"
    case "pass":
      return "bg-green-100 text-green-700"
    case "fail":
      return "bg-red-100 text-red-700"
    case "na":
      return "bg-gray-100 text-gray-500"
  }
}
