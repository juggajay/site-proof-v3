"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Plus, Send, MessageSquare, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { DiaryEntryCard } from "./diary-entry-card"
import { ResourcePicker } from "./resource-picker"
import { StatusBadge } from "./status-badge"
import { formatCost } from "@/lib/schemas/diaries"
import { addDiaryEntries, updateDiaryNotes, submitDiary } from "@/app/actions/diaries"

type WizardStep = "resources" | "times" | "notes" | "review"

interface DiaryEntry {
  id: string
  start_time: string | null
  finish_time: string | null
  break_hours: number | null
  total_hours: number | null
  total_cost_cents: number | null
  frozen_rate_cents: number | null
  resource: {
    id: string
    name: string
    type: string | null
    vendor: { id: string; name: string } | null
  } | null
}

interface VendorGroup {
  vendorId: string
  vendorName: string
  resources: {
    id: string
    name: string
    type: string | null
    vendor: { id: string; name: string } | null
    rate_card: { id: string; role_name: string; rate_cents: number; unit: string | null } | null
  }[]
}

interface DiaryWizardProps {
  diary: {
    id: string
    date: string
    status: string | null
    notes: string | null
    project: { id: string; name: string; code: string | null } | null
    lot: { id: string; lot_number: string; description: string | null } | null
    entries: DiaryEntry[]
  }
  availableResources: VendorGroup[]
  onRefresh: () => void
}

export function DiaryWizard({ diary, availableResources, onRefresh }: DiaryWizardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showResourcePicker, setShowResourcePicker] = useState(false)
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([])
  const [notes, setNotes] = useState(diary.notes ?? "")
  const [error, setError] = useState<string | null>(null)

  const isSubmitted = diary.status === "submitted"
  const entries = diary.entries ?? []
  const existingResourceIds = entries.map((e) => e.resource?.id ?? "").filter(Boolean)

  // Calculate totals
  const totalHours = entries.reduce((sum, e) => sum + (e.total_hours ?? 0), 0)
  const totalCost = entries.reduce((sum, e) => sum + (e.total_cost_cents ?? 0), 0)
  const incompleteCount = entries.filter((e) => !e.start_time || !e.finish_time).length

  const handleAddResources = () => {
    setError(null)
    startTransition(async () => {
      try {
        await addDiaryEntries({
          diary_id: diary.id,
          resource_ids: selectedResourceIds,
        })
        setSelectedResourceIds([])
        setShowResourcePicker(false)
        onRefresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add resources")
      }
    })
  }

  const handleNotesBlur = () => {
    if (notes !== diary.notes) {
      startTransition(async () => {
        try {
          await updateDiaryNotes({
            diary_id: diary.id,
            notes: notes || null,
          })
        } catch (err) {
          console.error("Failed to save notes:", err)
        }
      })
    }
  }

  const handleSubmit = () => {
    setError(null)
    startTransition(async () => {
      try {
        await submitDiary({ diary_id: diary.id })
        onRefresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit diary")
      }
    })
  }

  // Format date for display
  const formattedDate = new Date(diary.date + "T00:00:00").toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  if (showResourcePicker) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <ResourcePicker
          groups={availableResources}
          selectedIds={selectedResourceIds}
          onSelectionChange={setSelectedResourceIds}
          existingResourceIds={existingResourceIds}
          onConfirm={handleAddResources}
          onCancel={() => {
            setShowResourcePicker(false)
            setSelectedResourceIds([])
          }}
          isLoading={isPending}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            <h1 className="mt-1 text-xl font-bold">
              {diary.project?.name ?? "Unknown Project"}
            </h1>
            <p className="text-muted-foreground">
              Lot {diary.lot?.lot_number}
              {diary.lot?.description && ` - ${diary.lot.description}`}
            </p>
          </div>
          <StatusBadge status={diary.status} />
        </div>

        {/* Totals */}
        {entries.length > 0 && (
          <div className="mt-4 flex gap-4 border-t border-border pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-lg font-semibold">{totalHours.toFixed(1)}h</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-lg font-semibold">{formatCost(totalCost)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resources</p>
              <p className="text-lg font-semibold">{entries.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Resources Section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Resources</h2>
          {!isSubmitted && (
            <button
              onClick={() => setShowResourcePicker(true)}
              className="flex items-center gap-1 text-sm font-medium text-primary"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <button
            onClick={() => setShowResourcePicker(true)}
            disabled={isSubmitted}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-8 transition-colors hover:border-primary hover:bg-accent disabled:opacity-50"
          >
            <div className="rounded-full bg-primary/10 p-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Add Resources</p>
              <p className="text-sm text-muted-foreground">
                Select labour and plant to track
              </p>
            </div>
          </button>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <DiaryEntryCard
                key={entry.id}
                entry={entry}
                isSubmitted={isSubmitted}
                onUpdated={onRefresh}
              />
            ))}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div>
        <h2 className="mb-3 font-semibold">Notes</h2>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            disabled={isSubmitted}
            placeholder="Add notes about today's work..."
            rows={3}
            className={cn(
              "w-full rounded-xl border border-border bg-card p-3 pl-10 text-base",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "disabled:opacity-50"
            )}
          />
        </div>
      </div>

      {/* Submit Button */}
      {!isSubmitted && (
        <div className="mt-4">
          {incompleteCount > 0 && (
            <p className="mb-2 text-center text-sm text-amber-600">
              {incompleteCount} resource{incompleteCount !== 1 ? "s" : ""} need time entries
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={entries.length === 0 || incompleteCount > 0 || isPending}
            className={cn(
              "touch-target flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold transition-colors",
              entries.length > 0 && incompleteCount === 0
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Send className="h-5 w-5" />
            {isPending ? "Submitting..." : "Submit Diary"}
          </button>
        </div>
      )}
    </div>
  )
}
