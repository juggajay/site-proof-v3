import { z } from "zod"

// Vendor schemas
export const insertVendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  abn: z.string().optional().nullable(),
  contact_email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  is_internal: z.boolean(),
})

export const updateVendorSchema = insertVendorSchema.partial()

export type InsertVendorSchema = z.infer<typeof insertVendorSchema>
export type UpdateVendorSchema = z.infer<typeof updateVendorSchema>

// Rate Card schemas
export const rateCardSchema = z.object({
  id: z.string().uuid().optional(),
  role_name: z.string().min(1, "Role name is required"),
  rate_dollars: z.number().min(0, "Rate must be positive"), // Input as dollars
  unit: z.enum(["hr", "day", "m3", "m2", "ea"]).default("hr"),
})

export const upsertRateCardsSchema = z.array(rateCardSchema)

export type RateCardSchema = z.infer<typeof rateCardSchema>

// Resource schemas
export const insertResourceSchema = z.object({
  name: z.string().min(1, "Resource name is required"),
  vendor_id: z.string().uuid("Vendor is required"),
  assigned_rate_card_id: z.string().uuid("Role is required"),
  type: z.enum(["person", "plant"]),
  phone: z.string().optional().nullable(),
  is_active: z.boolean(),
})

export const updateResourceSchema = insertResourceSchema.partial()

export type InsertResourceSchema = z.infer<typeof insertResourceSchema>
export type UpdateResourceSchema = z.infer<typeof updateResourceSchema>

// Utility to convert dollars to cents
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

// Utility to convert cents to dollars
export function centsToDollars(cents: number): number {
  return cents / 100
}
