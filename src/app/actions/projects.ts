"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  insertProjectSchema,
  updateProjectSchema,
  type InsertProjectSchema,
  type UpdateProjectSchema,
} from "@/lib/schemas/projects"

export async function getProjects(includeArchived = false) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  let query = supabase
    .from("projects")
    .select(`
      *,
      lots(id, status)
    `)
    .order("name")

  if (!includeArchived) {
    query = query.eq("status", "Active")
  }

  const { data: projects, error } = await query

  if (error) throw error

  // Transform to include open lot count
  return projects.map((project) => ({
    ...project,
    openLotCount: project.lots?.filter((lot: { status: string | null }) => lot.status === "Open").length ?? 0,
    totalLotCount: project.lots?.length ?? 0,
    lots: undefined, // Remove the raw lots array
  }))
}

export async function getProject(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      lots(id, status)
    `)
    .eq("id", id)
    .single()

  if (error) throw error

  return {
    ...project,
    openLotCount: project.lots?.filter((lot: { status: string | null }) => lot.status === "Open").length ?? 0,
    totalLotCount: project.lots?.length ?? 0,
    lots: undefined,
  }
}

export async function createProject(data: InsertProjectSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Validate input
  const validated = insertProjectSchema.parse(data)

  // Get user's organization
  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  // Check for duplicate code within organization
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("organization_id", orgId)
    .eq("code", validated.code)
    .limit(1)

  if (existing && existing.length > 0) {
    throw new Error("A project with this code already exists")
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      ...validated,
      organization_id: orgId,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/projects")
  return project
}

export async function updateProject(id: string, data: UpdateProjectSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Validate input
  const validated = updateProjectSchema.parse(data)

  // If code is being updated, check for duplicates
  if (validated.code) {
    const { data: orgId } = await supabase.rpc("get_user_organization_id")
    if (!orgId) throw new Error("No organization found")

    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("organization_id", orgId)
      .eq("code", validated.code)
      .neq("id", id)
      .limit(1)

    if (existing && existing.length > 0) {
      throw new Error("A project with this code already exists")
    }
  }

  const { data: project, error } = await supabase
    .from("projects")
    .update(validated)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/projects")
  revalidatePath(`/projects/${id}`)
  return project
}
