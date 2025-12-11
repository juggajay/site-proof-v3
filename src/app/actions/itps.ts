"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  createTemplateSchema,
  updateTemplateSchema,
  updateTemplateItemsSchema,
  attachItpToLotSchema,
  updateCheckItemSchema,
  signOffItpSchema,
  type CreateTemplateSchema,
  type UpdateTemplateSchema,
  type UpdateTemplateItemsSchema,
  type AttachItpToLotSchema,
  type UpdateCheckItemSchema,
  type SignOffItpSchema,
  type TemplateItem,
} from "@/lib/schemas/itps"

// ============================================================================
// TEMPLATE ACTIONS (Manager)
// ============================================================================

// Get all templates for the organization
export async function getTemplates() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  const { data: templates, error } = await supabase
    .from("itp_templates")
    .select("*")
    .eq("organization_id", orgId)
    .order("title")

  if (error) throw error

  return templates ?? []
}

// Get single template with parsed items
export async function getTemplate(templateId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: template, error } = await supabase
    .from("itp_templates")
    .select("*")
    .eq("id", templateId)
    .single()

  if (error) throw error

  // Parse items JSON to typed array
  const items = (template.items as TemplateItem[]) ?? []

  return {
    ...template,
    items: items.sort((a, b) => a.order - b.order),
  }
}

// Create new template
export async function createTemplate(data: CreateTemplateSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  const validated = createTemplateSchema.parse(data)

  const { data: template, error } = await supabase
    .from("itp_templates")
    .insert({
      organization_id: orgId,
      title: validated.title,
      items: [], // Start with empty items
    })
    .select("id")
    .single()

  if (error) throw error

  revalidatePath("/library")
  return { templateId: template.id }
}

// Update template title
export async function updateTemplate(templateId: string, data: UpdateTemplateSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const validated = updateTemplateSchema.parse(data)

  const { error } = await supabase
    .from("itp_templates")
    .update({ title: validated.title })
    .eq("id", templateId)

  if (error) throw error

  revalidatePath("/library")
  revalidatePath(`/library/${templateId}`)
}

// Update template items (replace entire array)
export async function updateTemplateItems(data: UpdateTemplateItemsSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const validated = updateTemplateItemsSchema.parse(data)

  const { error } = await supabase
    .from("itp_templates")
    .update({ items: validated.items })
    .eq("id", validated.template_id)

  if (error) throw error

  revalidatePath(`/library/${validated.template_id}`)
}

// Delete template (only if not attached to any lots)
export async function deleteTemplate(templateId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check if template is attached to any lots
  const { data: attachedLots, error: checkError } = await supabase
    .from("lot_itps")
    .select("id")
    .eq("template_id", templateId)
    .limit(1)

  if (checkError) throw checkError

  if (attachedLots && attachedLots.length > 0) {
    throw new Error("Cannot delete template: it is attached to one or more lots")
  }

  const { error } = await supabase
    .from("itp_templates")
    .delete()
    .eq("id", templateId)

  if (error) throw error

  revalidatePath("/library")
}

// ============================================================================
// LOT ITP ACTIONS (Snapshot Logic)
// ============================================================================

// Attach ITP template to a lot - CRITICAL: This is the snapshot logic
export async function attachItpToLot(data: AttachItpToLotSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  const validated = attachItpToLotSchema.parse(data)

  // Check if this template is already attached to this lot
  const { data: existing } = await supabase
    .from("lot_itps")
    .select("id")
    .eq("lot_id", validated.lot_id)
    .eq("template_id", validated.template_id)
    .maybeSingle()

  if (existing) {
    throw new Error("This ITP template is already attached to this lot")
  }

  // 1. Fetch template with items JSON
  const { data: template, error: templateError } = await supabase
    .from("itp_templates")
    .select("*")
    .eq("id", validated.template_id)
    .single()

  if (templateError) throw templateError

  const templateItems = (template.items as TemplateItem[]) ?? []

  if (templateItems.length === 0) {
    throw new Error("Cannot attach empty template. Add at least one check item first.")
  }

  // 2. Create lot_itp record
  const { data: lotItp, error: lotItpError } = await supabase
    .from("lot_itps")
    .insert({
      organization_id: orgId,
      lot_id: validated.lot_id,
      template_id: validated.template_id,
      status: "in_progress",
    })
    .select("id")
    .single()

  if (lotItpError) throw lotItpError

  // 3. SNAPSHOT: Expand template items into individual itp_checks rows
  // This creates an immutable copy - future template edits won't affect these checks
  // Note: is_hold_point column needs to be added via migration before uncommenting
  const checks = templateItems
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      lot_itp_id: lotItp.id,
      question: item.question,
      // is_hold_point: item.is_hold_point, // TODO: Enable after migration adds column
      status: "pending",
      photo_url: null,
      rectification_note: null,
    }))

  const { error: checksError } = await supabase
    .from("itp_checks")
    .insert(checks)

  if (checksError) {
    // Rollback: delete the lot_itp if checks insert failed
    await supabase.from("lot_itps").delete().eq("id", lotItp.id)
    throw checksError
  }

  revalidatePath("/itps")
  revalidatePath(`/lots`)
  return { lotItpId: lotItp.id }
}

// Get all ITPs for a specific lot
export async function getLotItps(lotId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: itps, error } = await supabase
    .from("lot_itps")
    .select(`
      *,
      template:itp_templates(id, title),
      checks:itp_checks(id, status)
    `)
    .eq("lot_id", lotId)
    .order("created_at", { ascending: false })

  if (error) throw error

  // Add progress stats to each ITP
  return (itps ?? []).map((itp) => {
    const checks = itp.checks ?? []
    const total = checks.length
    const completed = checks.filter(
      (c: { status: string | null }) => c.status === "pass" || c.status === "na"
    ).length
    const failed = checks.filter((c: { status: string | null }) => c.status === "fail").length
    const pending = checks.filter((c: { status: string | null }) => c.status === "pending").length

    return {
      ...itp,
      progress: { total, completed, failed, pending },
    }
  })
}

// Get all active ITPs for foreman's assigned projects
export async function getForemanItps() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  // Get all in-progress ITPs with lot and project info
  const { data: itps, error } = await supabase
    .from("lot_itps")
    .select(`
      *,
      template:itp_templates(id, title),
      lot:lots(
        id,
        lot_number,
        description,
        project:projects(id, name, code)
      ),
      checks:itp_checks(id, status)
    `)
    .eq("organization_id", orgId)
    .eq("status", "in_progress")
    .order("created_at", { ascending: false })

  if (error) throw error

  // Add progress stats to each ITP
  return (itps ?? []).map((itp) => {
    const checks = itp.checks ?? []
    const total = checks.length
    const completed = checks.filter(
      (c: { status: string | null }) => c.status === "pass" || c.status === "na"
    ).length
    const failed = checks.filter((c: { status: string | null }) => c.status === "fail").length
    const pending = checks.filter((c: { status: string | null }) => c.status === "pending").length

    return {
      ...itp,
      progress: { total, completed, failed, pending },
    }
  })
}

// Get single lot ITP with all checks
export async function getLotItp(lotItpId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: itp, error: itpError } = await supabase
    .from("lot_itps")
    .select(`
      *,
      template:itp_templates(id, title),
      lot:lots(
        id,
        lot_number,
        description,
        project:projects(id, name, code)
      )
    `)
    .eq("id", lotItpId)
    .single()

  if (itpError) throw itpError

  // Get checks separately to ensure order
  const { data: checks, error: checksError } = await supabase
    .from("itp_checks")
    .select("*")
    .eq("lot_itp_id", lotItpId)
    .order("created_at")

  if (checksError) throw checksError

  return {
    ...itp,
    checks: checks ?? [],
  }
}

// ============================================================================
// CHECK ITEM ACTIONS (Foreman)
// ============================================================================

// Update check item status (with photo validation for fail)
export async function updateCheckItem(data: UpdateCheckItemSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const validated = updateCheckItemSchema.parse(data)

  // Get check to verify lot_itp is still in_progress
  const { data: check, error: checkError } = await supabase
    .from("itp_checks")
    .select(`
      id,
      lot_itp:lot_itps(id, status)
    `)
    .eq("id", validated.check_id)
    .single()

  if (checkError) throw checkError

  if (check.lot_itp?.status === "complete") {
    throw new Error("Cannot update checks on a completed ITP")
  }

  // Validate: fail status requires photo
  if (validated.status === "fail" && !validated.photo_url) {
    throw new Error("Photo evidence is required for failed items")
  }

  const { error: updateError } = await supabase
    .from("itp_checks")
    .update({
      status: validated.status,
      photo_url: validated.photo_url ?? null,
    })
    .eq("id", validated.check_id)

  if (updateError) throw updateError

  revalidatePath(`/itps/${check.lot_itp?.id}`)
}

// Sign off ITP (validates all passed/NA)
export async function signOffItp(data: SignOffItpSchema) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const validated = signOffItpSchema.parse(data)

  // Get all checks for this ITP
  const { data: checks, error: checksError } = await supabase
    .from("itp_checks")
    .select("id, status")
    .eq("lot_itp_id", validated.lot_itp_id)

  if (checksError) throw checksError

  if (!checks || checks.length === 0) {
    throw new Error("Cannot sign off: ITP has no check items")
  }

  const pending = checks.filter((c) => c.status === "pending")
  const failed = checks.filter((c) => c.status === "fail")

  if (pending.length > 0) {
    throw new Error(`Cannot sign off: ${pending.length} item${pending.length > 1 ? "s" : ""} still pending`)
  }

  if (failed.length > 0) {
    throw new Error(`Cannot sign off: ${failed.length} item${failed.length > 1 ? "s" : ""} failed`)
  }

  // All items are pass or na - allow completion
  const { error: updateError } = await supabase
    .from("lot_itps")
    .update({ status: "complete" })
    .eq("id", validated.lot_itp_id)

  if (updateError) throw updateError

  revalidatePath("/itps")
  revalidatePath(`/itps/${validated.lot_itp_id}`)
}

// ============================================================================
// UTILITY ACTIONS
// ============================================================================

// Get templates available for attaching to a lot (excludes already attached)
export async function getAvailableTemplatesForLot(lotId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: orgId } = await supabase.rpc("get_user_organization_id")
  if (!orgId) throw new Error("No organization found")

  // Get all templates
  const { data: templates, error: templatesError } = await supabase
    .from("itp_templates")
    .select("*")
    .eq("organization_id", orgId)
    .order("title")

  if (templatesError) throw templatesError

  // Get already attached template IDs for this lot
  const { data: attached, error: attachedError } = await supabase
    .from("lot_itps")
    .select("template_id")
    .eq("lot_id", lotId)

  if (attachedError) throw attachedError

  const attachedIds = new Set(attached?.map((a) => a.template_id) ?? [])

  // Filter out already attached and empty templates
  return (templates ?? []).filter((t) => {
    const items = (t.items as TemplateItem[]) ?? []
    return !attachedIds.has(t.id) && items.length > 0
  })
}
