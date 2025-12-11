"use client"

import { useRouter } from "next/navigation"
import { ChevronRight, ClipboardCheck, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ItpCardProps {
  id: string
  templateTitle: string
  lotNumber: string
  lotDescription?: string | null
  projectName: string
  projectCode?: string | null
  status: string
  progress: {
    total: number
    completed: number
    failed: number
    pending: number
  }
}

export function ItpCard({
  id,
  templateTitle,
  lotNumber,
  lotDescription,
  projectName,
  projectCode,
  status,
  progress,
}: ItpCardProps) {
  const router = useRouter()
  const progressPercent = progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0

  return (
    <button
      onClick={() => router.push(`/itps/${id}`)}
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
        <ClipboardCheck className="h-6 w-6 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold truncate">{templateTitle}</p>
          {status === "complete" && (
            <Badge className="bg-green-100 text-green-700 shrink-0">Complete</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {projectName} {projectCode && `(${projectCode})`} • Lot {lotNumber}
        </p>
        {lotDescription && (
          <p className="text-xs text-muted-foreground truncate">{lotDescription}</p>
        )}

        {/* Progress bar */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                progress.failed > 0 ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {progress.completed}/{progress.total}
          </span>
          {progress.failed > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-red-600 shrink-0">
              <AlertTriangle className="h-3 w-3" />
              {progress.failed}
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
    </button>
  )
}
