"use client"

import { useState, useEffect, useTransition } from "react"
import { Download, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker"
import { ReportTable } from "@/components/features/reports/report-table"
import { SummaryCards } from "@/components/features/reports/summary-cards"
import { getWeeklyReportData, type WeeklyReportData } from "@/app/actions/reports"
import { formatCents, formatHours } from "@/lib/utils"

interface Vendor {
  id: string
  name: string
}

interface Project {
  id: string
  name: string
}

interface WeeklyReportClientProps {
  vendors: Vendor[]
  projects: Project[]
  initialData: WeeklyReportData
  initialDateRange: DateRange
}

function getDefaultDateRange(): DateRange {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    startDate: monday.toISOString().split("T")[0],
    endDate: sunday.toISOString().split("T")[0],
  }
}

export function WeeklyReportClient({
  vendors,
  projects,
  initialData,
  initialDateRange,
}: WeeklyReportClientProps) {
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange)
  const [vendorId, setVendorId] = useState<string>("")
  const [projectId, setProjectId] = useState<string>("")
  const [reportData, setReportData] = useState<WeeklyReportData>(initialData)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getWeeklyReportData(
          dateRange.startDate,
          dateRange.endDate,
          vendorId || undefined,
          projectId || undefined
        )
        setReportData(data)
      } catch (error) {
        console.error("Failed to fetch report data:", error)
      }
    })
  }, [dateRange, vendorId, projectId])

  const handleExportCSV = () => {
    const rows: string[] = []

    // Header
    rows.push("Vendor,Resource,Type,Days Worked,Total Hours,Total Cost")

    // Data rows
    for (const vendor of reportData.vendors) {
      for (const entry of vendor.entries) {
        rows.push(
          [
            `"${vendor.vendorName}"`,
            `"${entry.resourceName}"`,
            entry.resourceType,
            entry.daysWorked,
            formatHours(entry.totalHours),
            formatCents(entry.totalCostCents),
          ].join(",")
        )
      }
      // Vendor subtotal
      rows.push(
        [
          `"${vendor.vendorName} - Subtotal"`,
          "",
          "",
          "",
          formatHours(vendor.totalHours),
          formatCents(vendor.totalCostCents),
        ].join(",")
      )
    }

    // Grand total
    rows.push(
      [
        "GRAND TOTAL",
        "",
        "",
        "",
        formatHours(reportData.grandTotalHours),
        formatCents(reportData.grandTotalCostCents),
      ].join(",")
    )

    const csvContent = rows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cost-report-${dateRange.startDate}-to-${dateRange.endDate}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Weekly Cost Report
            </h1>
            <p className="text-muted-foreground">
              Verify subcontractor invoices against diary entries
            </p>
          </div>
        </div>
        <Button onClick={handleExportCSV} disabled={reportData.vendors.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-card p-4">
        <div className="min-w-[280px] flex-1">
          <label className="mb-2 block text-sm font-medium">Date Range</label>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        <div className="min-w-[200px]">
          <label className="mb-2 block text-sm font-medium">Vendor</label>
          <Select value={vendorId} onValueChange={setVendorId}>
            <SelectTrigger>
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Vendors</SelectItem>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[200px]">
          <label className="mb-2 block text-sm font-medium">Project</label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <SummaryCards
        totalCostCents={reportData.grandTotalCostCents}
        totalHours={reportData.grandTotalHours}
        activeResources={reportData.activeResources}
        periodLabel="Selected Period"
      />

      {/* Report Table */}
      <ReportTable
        vendors={reportData.vendors}
        grandTotalHours={reportData.grandTotalHours}
        grandTotalCostCents={reportData.grandTotalCostCents}
      />
    </div>
  )
}
