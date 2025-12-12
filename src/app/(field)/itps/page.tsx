import { redirect } from "next/navigation"
import { getForemanItps } from "@/app/actions/itps"
import { ItpCard } from "@/components/features/itps"
import { ClipboardList } from "lucide-react"

export default async function ItpsPage() {
  let itps
  try {
    itps = await getForemanItps()
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/login?redirect=/itps")
    }
    throw error
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold">ITPs</h1>
        <p className="text-sm text-muted-foreground">Inspection & Test Plans</p>
      </div>

      {/* ITP List */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Active Inspections</h2>
          <span className="text-sm text-muted-foreground">
            {itps.length} in progress
          </span>
        </div>

        {itps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
            <ClipboardList className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No active ITPs</p>
            <p className="text-sm text-muted-foreground">
              ITPs will appear here when attached to lots
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {itps.map((itp) => (
              <ItpCard
                key={itp.id}
                id={itp.id}
                templateTitle={itp.template?.title ?? "Unknown Template"}
                lotNumber={itp.lot?.lot_number ?? "?"}
                lotDescription={itp.lot?.description}
                projectName={itp.lot?.project?.name ?? "Unknown Project"}
                projectCode={itp.lot?.project?.code}
                status={itp.status ?? "in_progress"}
                progress={itp.progress}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
