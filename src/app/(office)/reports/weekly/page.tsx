import {
  getWeeklyReportData,
  getVendorsForFilter,
  getProjectsForFilter,
} from "@/app/actions/reports"
import { WeeklyReportClient } from "./weekly-report-client"

function getDefaultDateRange() {
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

export default async function WeeklyReportPage() {
  const dateRange = getDefaultDateRange()

  // Fetch initial data in parallel
  const [vendors, projects, initialData] = await Promise.all([
    getVendorsForFilter().catch(() => []),
    getProjectsForFilter().catch(() => []),
    getWeeklyReportData(dateRange.startDate, dateRange.endDate).catch(() => ({
      vendors: [],
      grandTotalHours: 0,
      grandTotalCostCents: 0,
      activeResources: 0,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    })),
  ])

  return (
    <WeeklyReportClient
      vendors={vendors}
      projects={projects}
      initialData={initialData}
      initialDateRange={dateRange}
    />
  )
}
