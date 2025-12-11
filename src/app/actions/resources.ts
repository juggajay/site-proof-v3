"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  insertResourceSchema,
  updateResourceSchema,
  type InsertResourceSchema,
  type UpdateResourceSchema,
} from "@/lib/schemas/resources"

export async function getResources() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: resources, error } = await supabase
    .from("resources")
    .select(`
      *,
      vendor:vendors(id, name),
      rate_card:rate_cards(id, role_name, rate_cents, unit)
    `)
    .order("name")

  if (error) throw error
  return resources
}

export async function getResourcesByVendor(vendorId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: resources, error } = await supabase
    .from("resources")
    .select(`
      *,
      rate_card:rate_cards(id, role_name, rate_cents, unit)
    `)
    .eq("vendor_id", vendorId)
    .order("name")

  if (error) throw error
  return resources
}

export async function getResource(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: resource, error } = await supabase
    .from("resources")
    .select(`
      *,
      vendor:vendors(id, name),
      rate_card:rate_cards(id, role_name, rate_cents, unit)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return resource
}

export async function createResource(data: InsertResourceSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Validate input
  const validated = insertResourceSchema.parse(data)

  // Get user's organization
  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  // Verify rate card belongs to the vendor
  const { data: rateCard } = await supabase
    .from("rate_cards")
    .select("vendor_id")
    .eq("id", validated.assigned_rate_card_id)
    .single()

  if (!rateCard || rateCard.vendor_id !== validated.vendor_id) {
    throw new Error("Rate card must belong to the selected vendor")
  }

  const { data: resource, error } = await supabase
    .from("resources")
    .insert({
      ...validated,
      organization_id: orgId,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/resources")
  revalidatePath(`/vendors/${validated.vendor_id}`)
  return resource
}

export async function updateResource(id: string, data: UpdateResourceSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Validate input
  const validated = updateResourceSchema.parse(data)

  // If changing rate card, verify it belongs to the vendor
  if (validated.assigned_rate_card_id && validated.vendor_id) {
    const { data: rateCard } = await supabase
      .from("rate_cards")
      .select("vendor_id")
      .eq("id", validated.assigned_rate_card_id)
      .single()

    if (!rateCard || rateCard.vendor_id !== validated.vendor_id) {
      throw new Error("Rate card must belong to the selected vendor")
    }
  }

  const { data: resource, error } = await supabase
    .from("resources")
    .update(validated)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/resources")
  if (validated.vendor_id) {
    revalidatePath(`/vendors/${validated.vendor_id}`)
  }
  return resource
}

export async function toggleResourceActive(id: string, isActive: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: resource, error } = await supabase
    .from("resources")
    .update({ is_active: isActive })
    .eq("id", id)
    .select("vendor_id")
    .single()

  if (error) throw error

  revalidatePath("/resources")
  if (resource.vendor_id) {
    revalidatePath(`/vendors/${resource.vendor_id}`)
  }
}

export async function archiveResource(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Soft delete by setting is_active to false
  const { data: resource, error } = await supabase
    .from("resources")
    .update({ is_active: false })
    .eq("id", id)
    .select("vendor_id")
    .single()

  if (error) throw error

  revalidatePath("/resources")
  if (resource.vendor_id) {
    revalidatePath(`/vendors/${resource.vendor_id}`)
  }
}
