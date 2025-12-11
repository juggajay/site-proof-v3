"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  upsertRateCardsSchema,
  dollarsToCents,
  type RateCardSchema,
} from "@/lib/schemas/resources"

export async function getRateCards(vendorId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: rateCards, error } = await supabase
    .from("rate_cards")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("role_name")

  if (error) throw error
  return rateCards
}

export async function upsertRateCards(vendorId: string, cards: RateCardSchema[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Validate input
  const validated = upsertRateCardsSchema.parse(cards)

  // Get user's organization
  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  // Get existing rate cards for this vendor
  const { data: existingCards } = await supabase
    .from("rate_cards")
    .select("id")
    .eq("vendor_id", vendorId)

  const existingIds = new Set(existingCards?.map((c) => c.id) || [])
  const newIds = new Set(validated.filter((c) => c.id).map((c) => c.id))

  // Delete removed cards
  const toDelete = [...existingIds].filter((id) => !newIds.has(id))
  if (toDelete.length > 0) {
    // Check if any of these rate cards are assigned to resources
    const { data: assignedResources } = await supabase
      .from("resources")
      .select("id, assigned_rate_card_id")
      .in("assigned_rate_card_id", toDelete)

    if (assignedResources && assignedResources.length > 0) {
      throw new Error("Cannot delete rate cards that are assigned to resources")
    }

    const { error: deleteError } = await supabase
      .from("rate_cards")
      .delete()
      .in("id", toDelete)

    if (deleteError) throw deleteError
  }

  // Upsert cards
  const upsertData = validated.map((card) => ({
    id: card.id || undefined,
    vendor_id: vendorId,
    organization_id: orgId,
    role_name: card.role_name,
    rate_cents: dollarsToCents(card.rate_dollars),
    unit: card.unit,
  }))

  // Insert new cards
  const newCards = upsertData.filter((c) => !c.id)
  if (newCards.length > 0) {
    const { error: insertError } = await supabase
      .from("rate_cards")
      .insert(newCards.map(({ id: _id, ...rest }) => rest))

    if (insertError) throw insertError
  }

  // Update existing cards
  const existingCardsToUpdate = upsertData.filter((c) => c.id)
  for (const card of existingCardsToUpdate) {
    const { error: updateError } = await supabase
      .from("rate_cards")
      .update({
        role_name: card.role_name,
        rate_cents: card.rate_cents,
        unit: card.unit,
      })
      .eq("id", card.id!)

    if (updateError) throw updateError
  }

  revalidatePath(`/vendors/${vendorId}`)
  return true
}

export async function deleteRateCard(id: string, vendorId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check if rate card is assigned to any resources
  const { data: assignedResources } = await supabase
    .from("resources")
    .select("id")
    .eq("assigned_rate_card_id", id)
    .limit(1)

  if (assignedResources && assignedResources.length > 0) {
    throw new Error("Cannot delete rate card that is assigned to resources")
  }

  const { error } = await supabase
    .from("rate_cards")
    .delete()
    .eq("id", id)

  if (error) throw error

  revalidatePath(`/vendors/${vendorId}`)
}
