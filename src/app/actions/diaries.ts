"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  initializeDiarySchema,
  addDiaryEntriesSchema,
  updateEntryTimeSchema,
  updateDiaryNotesSchema,
  submitDiarySchema,
  calculateHours,
  calculateCostCents,
  type InitializeDiarySchema,
  type AddDiaryEntriesSchema,
  type UpdateEntryTimeSchema,
  type UpdateDiaryNotesSchema,
  type SubmitDiarySchema,
} from "@/lib/schemas/diaries"

// Get foreman dashboard - today's diaries and projects
export async function getForemanDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  const today = new Date().toISOString().split("T")[0]

  // Get today's diaries with project and lot info
  const { data: todaysDiaries, error: diariesError } = await supabase
    .from("diaries")
    .select(`
      *,
      project:projects(id, name, code),
      lot:lots(id, lot_number, description)
    `)
    .eq("date", today)
    .eq("foreman_id", user.id)
    .order("created_at", { ascending: false })

  if (diariesError) throw diariesError

  // Get active projects for the organization
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, name, code, status")
    .eq("organization_id", orgId)
    .eq("status", "active")
    .order("name")

  if (projectsError) throw projectsError

  return {
    todaysDiaries: todaysDiaries ?? [],
    projects: projects ?? [],
    today,
  }
}

// Get diary with entries
export async function getDiary(diaryId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: diary, error: diaryError } = await supabase
    .from("diaries")
    .select(`
      *,
      project:projects(id, name, code),
      lot:lots(id, lot_number, description)
    `)
    .eq("id", diaryId)
    .single()

  if (diaryError) throw diaryError

  const { data: entries, error: entriesError } = await supabase
    .from("diary_entries")
    .select(`
      *,
      resource:resources(
        id,
        name,
        type,
        vendor:vendors(id, name)
      )
    `)
    .eq("diary_id", diaryId)
    .order("created_at")

  if (entriesError) throw entriesError

  return {
    ...diary,
    entries: entries ?? [],
  }
}

// Get lots for a project
export async function getProjectLots(projectId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, name, code")
    .eq("id", projectId)
    .single()

  if (projectError) throw projectError

  const { data: lots, error: lotsError } = await supabase
    .from("lots")
    .select("id, lot_number, description, status")
    .eq("project_id", projectId)
    .order("lot_number")

  if (lotsError) throw lotsError

  return {
    project,
    lots: lots ?? [],
  }
}

// Initialize a new diary (creates draft)
export async function initializeDiary(data: InitializeDiarySchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  const validated = initializeDiarySchema.parse(data)

  // Check for existing diary on this lot + date
  const { data: existing } = await supabase
    .from("diaries")
    .select("id")
    .eq("lot_id", validated.lot_id)
    .eq("date", validated.date)
    .maybeSingle()

  if (existing) {
    // Return existing diary instead of creating duplicate
    return { diaryId: existing.id, isExisting: true }
  }

  // Create new diary
  const { data: diary, error } = await supabase
    .from("diaries")
    .insert({
      organization_id: orgId,
      project_id: validated.project_id,
      lot_id: validated.lot_id,
      date: validated.date,
      foreman_id: user.id,
      status: "draft",
    })
    .select("id")
    .single()

  if (error) throw error

  revalidatePath("/diary")
  return { diaryId: diary.id, isExisting: false }
}

// Add diary entries with FROZEN RATE logic
export async function addDiaryEntries(data: AddDiaryEntriesSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const validated = addDiaryEntriesSchema.parse(data)

  // Verify diary exists and is draft
  const { data: diary, error: diaryError } = await supabase
    .from("diaries")
    .select("id, status")
    .eq("id", validated.diary_id)
    .single()

  if (diaryError) throw diaryError
  if (diary.status !== "draft") {
    throw new Error("Cannot add entries to a submitted diary")
  }

  // Fetch resources with their current rate cards
  // CRITICAL: This is the frozen rate lookup - we capture the rate at this moment
  const { data: resources, error: resourcesError } = await supabase
    .from("resources")
    .select(`
      id,
      rate_card:rate_cards(rate_cents)
    `)
    .in("id", validated.resource_ids)

  if (resourcesError) throw resourcesError

  // Check which resources are already in this diary
  const { data: existingEntries } = await supabase
    .from("diary_entries")
    .select("resource_id")
    .eq("diary_id", validated.diary_id)
    .in("resource_id", validated.resource_ids)

  const existingResourceIds = new Set(existingEntries?.map(e => e.resource_id) ?? [])

  // Filter out resources that are already added
  const newResources = resources?.filter(r => !existingResourceIds.has(r.id)) ?? []

  if (newResources.length === 0) {
    return { added: 0, skipped: validated.resource_ids.length }
  }

  // Create entries with frozen rates
  const entries = newResources.map(resource => ({
    diary_id: validated.diary_id,
    resource_id: resource.id,
    // FROZEN RATE: Capture the current rate from the rate card
    frozen_rate_cents: resource.rate_card?.rate_cents ?? null,
    start_time: null,
    finish_time: null,
    break_hours: null,
    total_hours: null,
    total_cost_cents: null,
  }))

  const { error: insertError } = await supabase
    .from("diary_entries")
    .insert(entries)

  if (insertError) throw insertError

  revalidatePath(`/diary/${validated.diary_id}`)
  return { added: newResources.length, skipped: validated.resource_ids.length - newResources.length }
}

// Update entry time and recalculate cost
export async function updateEntryTime(data: UpdateEntryTimeSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const validated = updateEntryTimeSchema.parse(data)

  // Get entry to verify it exists and get frozen rate
  const { data: entry, error: entryError } = await supabase
    .from("diary_entries")
    .select(`
      id,
      frozen_rate_cents,
      diary:diaries(id, status)
    `)
    .eq("id", validated.entry_id)
    .single()

  if (entryError) throw entryError
  if (entry.diary?.status !== "draft") {
    throw new Error("Cannot update entries on a submitted diary")
  }

  // Calculate total hours and cost
  const totalHours = calculateHours(
    validated.start_time,
    validated.finish_time,
    validated.break_hours
  )

  // Cost calculation using FROZEN rate (never the live rate)
  const totalCostCents = calculateCostCents(totalHours, entry.frozen_rate_cents)

  const { error: updateError } = await supabase
    .from("diary_entries")
    .update({
      start_time: validated.start_time,
      finish_time: validated.finish_time,
      break_hours: validated.break_hours,
      total_hours: totalHours,
      total_cost_cents: totalCostCents,
    })
    .eq("id", validated.entry_id)

  if (updateError) throw updateError

  revalidatePath(`/diary/${entry.diary?.id}`)
  return { totalHours, totalCostCents }
}

// Remove entry from diary
export async function removeEntry(entryId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get entry to verify diary is draft
  const { data: entry, error: entryError } = await supabase
    .from("diary_entries")
    .select(`diary:diaries(id, status)`)
    .eq("id", entryId)
    .single()

  if (entryError) throw entryError
  if (entry.diary?.status !== "draft") {
    throw new Error("Cannot remove entries from a submitted diary")
  }

  const { error: deleteError } = await supabase
    .from("diary_entries")
    .delete()
    .eq("id", entryId)

  if (deleteError) throw deleteError

  revalidatePath(`/diary/${entry.diary?.id}`)
}

// Update diary notes
export async function updateDiaryNotes(data: UpdateDiaryNotesSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const validated = updateDiaryNotesSchema.parse(data)

  const { error } = await supabase
    .from("diaries")
    .update({ notes: validated.notes })
    .eq("id", validated.diary_id)

  if (error) throw error

  revalidatePath(`/diary/${validated.diary_id}`)
}

// Submit diary (lock it)
export async function submitDiary(data: SubmitDiarySchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const validated = submitDiarySchema.parse(data)

  // Verify diary has at least one entry with times filled
  const { data: entries, error: entriesError } = await supabase
    .from("diary_entries")
    .select("id, start_time, finish_time")
    .eq("diary_id", validated.diary_id)

  if (entriesError) throw entriesError

  if (!entries || entries.length === 0) {
    throw new Error("Cannot submit a diary with no entries")
  }

  const incompleteEntries = entries.filter(e => !e.start_time || !e.finish_time)
  if (incompleteEntries.length > 0) {
    throw new Error(`Please fill in times for all ${incompleteEntries.length} resource(s) before submitting`)
  }

  const { error } = await supabase
    .from("diaries")
    .update({ status: "submitted" })
    .eq("id", validated.diary_id)

  if (error) throw error

  revalidatePath(`/diary/${validated.diary_id}`)
  revalidatePath("/diary")
}

// Get available resources for adding to diary (grouped by vendor)
export async function getAvailableResources() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: resources, error } = await supabase
    .from("resources")
    .select(`
      id,
      name,
      type,
      vendor:vendors(id, name),
      rate_card:rate_cards(id, role_name, rate_cents, unit)
    `)
    .eq("is_active", true)
    .order("name")

  if (error) throw error

  // Group by vendor
  const grouped = (resources ?? []).reduce((acc, resource) => {
    const vendorId = resource.vendor?.id ?? "unknown"
    const vendorName = resource.vendor?.name ?? "Unknown Vendor"

    if (!acc[vendorId]) {
      acc[vendorId] = {
        vendorId,
        vendorName,
        resources: [],
      }
    }
    acc[vendorId].resources.push(resource)
    return acc
  }, {} as Record<string, { vendorId: string; vendorName: string; resources: typeof resources }>)

  return Object.values(grouped)
}
