"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  insertLotSchema,
  updateLotStatusSchema,
  type InsertLotSchema,
  type UpdateLotStatusSchema,
  type BulkImportResult,
} from "@/lib/schemas/projects"

export async function getLots(projectId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: lots, error } = await supabase
    .from("lots")
    .select("*")
    .eq("project_id", projectId)
    .order("lot_number")

  if (error) throw error
  return lots
}

export async function createLot(projectId: string, data: InsertLotSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Validate input
  const validated = insertLotSchema.parse(data)

  // Get user's organization
  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  // Check for duplicate lot number within project
  const { data: existing } = await supabase
    .from("lots")
    .select("id")
    .eq("project_id", projectId)
    .eq("lot_number", validated.lot_number)
    .limit(1)

  if (existing && existing.length > 0) {
    throw new Error("A lot with this number already exists in this project")
  }

  const { data: lot, error } = await supabase
    .from("lots")
    .insert({
      ...validated,
      project_id: projectId,
      organization_id: orgId,
      status: "Open",
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath(`/projects/${projectId}`)
  return lot
}

function parseCSVLine(line: string): { lotNumber: string; description: string } | null {
  const trimmed = line.trim()
  if (!trimmed) return null

  // Try tab separator first, then comma
  let parts: string[]
  if (trimmed.includes("\t")) {
    parts = trimmed.split("\t")
  } else {
    parts = trimmed.split(",")
  }

  const lotNumber = parts[0]?.trim()
  if (!lotNumber) return null

  const description = parts.slice(1).join(",").trim() || ""

  return { lotNumber, description }
}

export async function bulkCreateLots(projectId: string, csvString: string): Promise<BulkImportResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get user's organization
  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  // Get existing lot numbers for this project
  const { data: existingLots } = await supabase
    .from("lots")
    .select("lot_number")
    .eq("project_id", projectId)

  const existingNumbers = new Set(existingLots?.map(l => l.lot_number) ?? [])

  const lines = csvString.split("\n")
  const lotsToCreate: { lot_number: string; description: string | null; project_id: string; organization_id: string; status: string }[] = []
  const skippedLines: string[] = []
  const duplicates: string[] = []
  const seenInBatch = new Set<string>()

  for (const line of lines) {
    const parsed = parseCSVLine(line)

    if (!parsed) {
      if (line.trim()) {
        skippedLines.push(line.trim())
      }
      continue
    }

    // Check for duplicates (existing in DB or earlier in this batch)
    if (existingNumbers.has(parsed.lotNumber) || seenInBatch.has(parsed.lotNumber)) {
      duplicates.push(parsed.lotNumber)
      continue
    }

    seenInBatch.add(parsed.lotNumber)
    lotsToCreate.push({
      lot_number: parsed.lotNumber,
      description: parsed.description || null,
      project_id: projectId,
      organization_id: orgId,
      status: "Open",
    })
  }

  if (lotsToCreate.length > 0) {
    const { error } = await supabase
      .from("lots")
      .insert(lotsToCreate)

    if (error) throw error
  }

  revalidatePath(`/projects/${projectId}`)

  return {
    created: lotsToCreate.length,
    skipped: skippedLines.length,
    skippedLines,
    duplicates,
  }
}

export async function updateLotStatus(lotId: string, data: UpdateLotStatusSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Validate input
  const validated = updateLotStatusSchema.parse(data)

  const { data: lot, error } = await supabase
    .from("lots")
    .update({ status: validated.status })
    .eq("id", lotId)
    .select("*, project_id")
    .single()

  if (error) throw error

  revalidatePath(`/projects/${lot.project_id}`)
  return lot
}

export async function deleteLot(lotId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check for linked diary entries
  const { data: diaries } = await supabase
    .from("diaries")
    .select("id")
    .eq("lot_id", lotId)
    .limit(1)

  if (diaries && diaries.length > 0) {
    throw new Error("Cannot delete lot with linked diary entries. Please remove the diary entries first.")
  }

  // Check for linked ITPs
  const { data: itps } = await supabase
    .from("lot_itps")
    .select("id")
    .eq("lot_id", lotId)
    .limit(1)

  if (itps && itps.length > 0) {
    throw new Error("Cannot delete lot with linked ITPs. Please remove the ITPs first.")
  }

  // Get project_id for revalidation before deleting
  const { data: lot } = await supabase
    .from("lots")
    .select("project_id")
    .eq("id", lotId)
    .single()

  const { error } = await supabase
    .from("lots")
    .delete()
    .eq("id", lotId)

  if (error) throw error

  if (lot?.project_id) {
    revalidatePath(`/projects/${lot.project_id}`)
  }
}
