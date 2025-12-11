"use server"

import { createClient } from "@/lib/supabase/server"

export interface ReportEntry {
  resourceId: string
  resourceName: string
  resourceType: "labor" | "plant"
  vendorId: string
  vendorName: string
  daysWorked: number
  totalHours: number
  totalCostCents: number
}

export interface VendorGroup {
  vendorId: string
  vendorName: string
  entries: ReportEntry[]
  totalHours: number
  totalCostCents: number
}

export interface WeeklyReportData {
  vendors: VendorGroup[]
  grandTotalHours: number
  grandTotalCostCents: number
  activeResources: number
  startDate: string
  endDate: string
}

export interface ReportsSummary {
  totalCostCents: number
  totalHours: number
  activeResources: number
  periodLabel: string
}

export async function getWeeklyReportData(
  startDate: string,
  endDate: string,
  vendorId?: string,
  projectId?: string
): Promise<WeeklyReportData> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Build the query for aggregated report data
  // Join diary_entries -> diaries -> resources -> vendors
  let query = supabase
    .from("diary_entries")
    .select(`
      resource_id,
      total_hours,
      total_cost_cents,
      diary:diaries!inner(
        date,
        project_id
      ),
      resource:resources!inner(
        id,
        name,
        type,
        vendor:vendors!inner(
          id,
          name
        )
      )
    `)
    .gte("diary.date", startDate)
    .lte("diary.date", endDate)

  if (projectId) {
    query = query.eq("diary.project_id", projectId)
  }

  const { data: entries, error } = await query

  if (error) throw error

  // Filter by vendor if specified (post-query since it's a nested filter)
  let filteredEntries = entries || []
  if (vendorId) {
    filteredEntries = filteredEntries.filter(
      (entry) => entry.resource?.vendor?.id === vendorId
    )
  }

  // Aggregate by resource and vendor
  const resourceMap = new Map<string, {
    resourceId: string
    resourceName: string
    resourceType: "labor" | "plant"
    vendorId: string
    vendorName: string
    dates: Set<string>
    totalHours: number
    totalCostCents: number
  }>()

  for (const entry of filteredEntries) {
    const resource = entry.resource
    const vendor = resource?.vendor
    const diary = entry.diary

    if (!resource || !vendor || !diary) continue

    const key = resource.id
    const existing = resourceMap.get(key)

    if (existing) {
      existing.dates.add(diary.date)
      existing.totalHours += Number(entry.total_hours) || 0
      existing.totalCostCents += entry.total_cost_cents || 0
    } else {
      resourceMap.set(key, {
        resourceId: resource.id,
        resourceName: resource.name,
        resourceType: resource.type as "labor" | "plant",
        vendorId: vendor.id,
        vendorName: vendor.name,
        dates: new Set([diary.date]),
        totalHours: Number(entry.total_hours) || 0,
        totalCostCents: entry.total_cost_cents || 0,
      })
    }
  }

  // Group by vendor
  const vendorMap = new Map<string, VendorGroup>()

  for (const resource of resourceMap.values()) {
    const vendorGroup = vendorMap.get(resource.vendorId)
    const entry: ReportEntry = {
      resourceId: resource.resourceId,
      resourceName: resource.resourceName,
      resourceType: resource.resourceType,
      vendorId: resource.vendorId,
      vendorName: resource.vendorName,
      daysWorked: resource.dates.size,
      totalHours: resource.totalHours,
      totalCostCents: resource.totalCostCents,
    }

    if (vendorGroup) {
      vendorGroup.entries.push(entry)
      vendorGroup.totalHours += entry.totalHours
      vendorGroup.totalCostCents += entry.totalCostCents
    } else {
      vendorMap.set(resource.vendorId, {
        vendorId: resource.vendorId,
        vendorName: resource.vendorName,
        entries: [entry],
        totalHours: entry.totalHours,
        totalCostCents: entry.totalCostCents,
      })
    }
  }

  // Sort vendors and entries
  const vendors = Array.from(vendorMap.values())
    .sort((a, b) => a.vendorName.localeCompare(b.vendorName))
    .map((vendor) => ({
      ...vendor,
      entries: vendor.entries.sort((a, b) => a.resourceName.localeCompare(b.resourceName)),
    }))

  // Calculate grand totals
  const grandTotalHours = vendors.reduce((sum, v) => sum + v.totalHours, 0)
  const grandTotalCostCents = vendors.reduce((sum, v) => sum + v.totalCostCents, 0)
  const activeResources = resourceMap.size

  return {
    vendors,
    grandTotalHours,
    grandTotalCostCents,
    activeResources,
    startDate,
    endDate,
  }
}

export async function getReportsSummary(): Promise<ReportsSummary> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get this week's date range (Monday to Sunday)
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const startDate = monday.toISOString().split("T")[0]
  const endDate = sunday.toISOString().split("T")[0]

  const reportData = await getWeeklyReportData(startDate, endDate)

  return {
    totalCostCents: reportData.grandTotalCostCents,
    totalHours: reportData.grandTotalHours,
    activeResources: reportData.activeResources,
    periodLabel: "This Week",
  }
}

export async function getVendorsForFilter() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: vendors, error } = await supabase
    .from("vendors")
    .select("id, name")
    .order("name")

  if (error) throw error
  return vendors || []
}

export async function getProjectsForFilter() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name")
    .eq("status", "active")
    .order("name")

  if (error) throw error
  return projects || []
}
