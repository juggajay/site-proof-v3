"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  insertVendorSchema,
  updateVendorSchema,
  type InsertVendorSchema,
  type UpdateVendorSchema,
} from "@/lib/schemas/resources"

export async function getVendors() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: vendors, error } = await supabase
    .from("vendors")
    .select("*")
    .order("name")

  if (error) throw error
  return vendors
}

export async function getVendor(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: vendor, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return vendor
}

export async function createVendor(data: InsertVendorSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Validate input
  const validated = insertVendorSchema.parse(data)

  // Get user's organization
  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  const { data: vendor, error } = await supabase
    .from("vendors")
    .insert({
      ...validated,
      organization_id: orgId,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/vendors")
  return vendor
}

export async function updateVendor(id: string, data: UpdateVendorSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Validate input
  const validated = updateVendorSchema.parse(data)

  const { data: vendor, error } = await supabase
    .from("vendors")
    .update(validated)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/vendors")
  revalidatePath(`/vendors/${id}`)
  return vendor
}

export async function archiveVendor(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check for active resources before archiving
  const { data: resources } = await supabase
    .from("resources")
    .select("id")
    .eq("vendor_id", id)
    .eq("is_active", true)
    .limit(1)

  if (resources && resources.length > 0) {
    throw new Error("Cannot archive vendor with active resources. Please deactivate all resources first.")
  }

  // Soft delete by setting is_internal to indicate archived
  // Note: In production, you'd add an is_archived column
  const { error } = await supabase
    .from("vendors")
    .delete()
    .eq("id", id)

  if (error) throw error

  revalidatePath("/vendors")
}
