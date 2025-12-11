"use client"

import { useState, useTransition } from "react"
import { Users, Truck, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { TimeInput, BreakInput } from "./time-input"
import { formatHours, formatCost } from "@/lib/schemas/diaries"
import { updateEntryTime, removeEntry } from "@/app/actions/diaries"

interface DiaryEntryCardProps {
  entry: {
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
  isSubmitted: boolean
  onUpdated?: () => void
}

export function DiaryEntryCard({ entry, isSubmitted, onUpdated }: DiaryEntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [localStartTime, setLocalStartTime] = useState(entry.start_time)
  const [localFinishTime, setLocalFinishTime] = useState(entry.finish_time)
  const [localBreakHours, setLocalBreakHours] = useState(entry.break_hours)

  const isPerson = entry.resource?.type === "person"
  const hasTime = entry.start_time && entry.finish_time

  const handleTimeUpdate = (
    startTime: string | null,
    finishTime: string | null,
    breakHours: number | null
  ) => {
    startTransition(async () => {
      try {
        await updateEntryTime({
          entry_id: entry.id,
          start_time: startTime,
          finish_time: finishTime,
          break_hours: breakHours,
        })
        onUpdated?.()
      } catch (error) {
        console.error("Failed to update time:", error)
      }
    })
  }

  const handleStartTimeChange = (value: string | null) => {
    setLocalStartTime(value)
    handleTimeUpdate(value, localFinishTime, localBreakHours)
  }

  const handleFinishTimeChange = (value: string | null) => {
    setLocalFinishTime(value)
    handleTimeUpdate(localStartTime, value, localBreakHours)
  }

  const handleBreakChange = (value: number | null) => {
    setLocalBreakHours(value)
    handleTimeUpdate(localStartTime, localFinishTime, value)
  }

  const handleRemove = () => {
    if (!confirm(`Remove ${entry.resource?.name} from this diary?`)) return
    startTransition(async () => {
      try {
        await removeEntry(entry.id)
        onUpdated?.()
      } catch (error) {
        console.error("Failed to remove entry:", error)
      }
    })
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-card transition-all",
        isExpanded ? "border-primary" : "border-border"
      )}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={isSubmitted}
        className="flex w-full items-center gap-3 p-4"
      >
        {/* Icon */}
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            isPerson ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
          )}
        >
          {isPerson ? <Users className="h-6 w-6" /> : <Truck className="h-6 w-6" />}
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <p className="font-semibold">{entry.resource?.name ?? "Unknown"}</p>
          <p className="text-sm text-muted-foreground">
            {entry.resource?.vendor?.name ?? "Unknown Vendor"}
          </p>
        </div>

        {/* Summary */}
        <div className="text-right">
          {hasTime ? (
            <>
              <p className="font-semibold">{formatHours(entry.total_hours)}</p>
              <p className="text-sm text-muted-foreground">
                {formatCost(entry.total_cost_cents)}
              </p>
            </>
          ) : (
            <p className="text-sm text-amber-600">Tap to add time</p>
          )}
        </div>

        {/* Expand indicator */}
        {!isSubmitted && (
          isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && !isSubmitted && (
        <div className="border-t border-border p-4">
          <div className="flex flex-wrap justify-center gap-6">
            <TimeInput
              label="Start"
              value={localStartTime}
              onChange={handleStartTimeChange}
              disabled={isPending}
            />
            <TimeInput
              label="Finish"
              value={localFinishTime}
              onChange={handleFinishTimeChange}
              disabled={isPending}
            />
          </div>

          <div className="mt-6">
            <BreakInput
              value={localBreakHours}
              onChange={handleBreakChange}
              disabled={isPending}
            />
          </div>

          {/* Rate info */}
          <div className="mt-4 rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground">
            <Clock className="mb-1 inline h-4 w-4" /> Frozen rate:{" "}
            <span className="font-medium">
              ${((entry.frozen_rate_cents ?? 0) / 100).toFixed(2)}/hr
            </span>
          </div>

          {/* Remove button */}
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/50 py-3 text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Remove from Diary
          </button>
        </div>
      )}
    </div>
  )
}
