import Link from "next/link"
import { FileBarChart, ClipboardCheck, TrendingUp, ArrowRight } from "lucide-react"
import { getReportsSummary } from "@/app/actions/reports"
import { SummaryCards } from "@/components/features/reports/summary-cards"

export default async function ReportsPage() {
  let summary = {
    totalCostCents: 0,
    totalHours: 0,
    activeResources: 0,
    periodLabel: "This Week",
  }

  try {
    summary = await getReportsSummary()
  } catch {
    // User may not be authenticated or no data yet
  }

  const reportTypes = [
    {
      title: "Weekly Cost Report",
      description: "Detailed cost breakdown by vendor and resource for any date range",
      href: "/reports/weekly",
      icon: FileBarChart,
      primary: true,
    },
    {
      title: "ITP Summary",
      description: "Quality inspection status across lots",
      href: "/reports",
      icon: ClipboardCheck,
      primary: false,
      disabled: true,
    },
    {
      title: "Resource Utilisation",
      description: "Equipment and labor usage analytics",
      href: "/reports",
      icon: TrendingUp,
      primary: false,
      disabled: true,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate cost reports and ITP summaries to verify subcontractor invoices.
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        totalCostCents={summary.totalCostCents}
        totalHours={summary.totalHours}
        activeResources={summary.activeResources}
        periodLabel={summary.periodLabel}
      />

      {/* Report Types */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Available Reports</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => {
            const content = (
              <div
                className={`rounded-xl border border-border bg-card p-6 shadow-sm transition-all ${
                  report.disabled
                    ? "opacity-60"
                    : "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                } ${report.primary ? "ring-2 ring-primary/20" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`rounded-lg p-2 ${
                      report.primary ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <report.icon
                      className={`h-5 w-5 ${
                        report.primary ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  {report.disabled && (
                    <span className="text-xs text-muted-foreground">Coming Soon</span>
                  )}
                </div>
                <h3 className="mt-4 font-semibold">{report.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.description}
                </p>
                {!report.disabled && (
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    Generate Report
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            )

            if (report.disabled) {
              return <div key={report.title}>{content}</div>
            }

            return (
              <Link key={report.title} href={report.href}>
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
