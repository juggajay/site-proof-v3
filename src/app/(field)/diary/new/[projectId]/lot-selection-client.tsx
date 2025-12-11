"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, ChevronRight, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { initializeDiary } from "@/app/actions/diaries"

interface Project {
  id: string
  name: string
  code: string | null
}

interface Lot {
  id: string
  lot_number: string
  description: string | null
  status: string | null
}

interface LotSelectionClientProps {
  project: Project
  lots: Lot[]
}

export function LotSelectionClient({ project, lots }: LotSelectionClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Filter lots based on search
  const filteredLots = lots.filter(
    (lot) =>
      lot.lot_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  const handleSelectLot = (lot: Lot) => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await initializeDiary({
          project_id: project.id,
          lot_id: lot.id,
          date: today,
        })

        if (result.isExisting) {
          // Navigate to existing diary
          router.push(`/diary/${result.diaryId}`)
        } else {
          // Navigate to new diary
          router.push(`/diary/${result.diaryId}`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create diary")
      }
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">{project.name}</h1>
        {project.code && (
          <p className="text-sm text-muted-foreground">{project.code}</p>
        )}
        <p className="mt-1 text-muted-foreground">Select a lot to create today's diary</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search lots..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Lots list */}
      <div className="space-y-2">
        {filteredLots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <MapPin className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">
              {searchQuery ? "No lots match your search" : "No lots available"}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Try a different search term"
                : "Contact your office to add lots"}
            </p>
          </div>
        ) : (
          filteredLots.map((lot) => (
            <button
              key={lot.id}
              onClick={() => handleSelectLot(lot)}
              disabled={isPending}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors",
                "hover:bg-accent disabled:opacity-50"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Lot {lot.lot_number}</p>
                {lot.description && (
                  <p className="text-sm text-muted-foreground">{lot.description}</p>
                )}
              </div>
              {lot.status && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    lot.status === "active" && "bg-green-100 text-green-700",
                    lot.status === "completed" && "bg-blue-100 text-blue-700",
                    lot.status === "on_hold" && "bg-amber-100 text-amber-700"
                  )}
                >
                  {lot.status}
                </span>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
