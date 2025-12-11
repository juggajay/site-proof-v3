"use client"

import { cn } from "@/lib/utils"
import { FileEdit, CheckCircle } from "lucide-react"

interface StatusBadgeProps {
  status: string | null
  size?: "sm" | "md"
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const isDraft = status === "draft" || !status
  const isSubmitted = status === "submitted"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        isDraft && "bg-amber-100 text-amber-700",
        isSubmitted && "bg-green-100 text-green-700"
      )}
    >
      {isDraft && (
        <>
          <FileEdit className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
          Draft
        </>
      )}
      {isSubmitted && (
        <>
          <CheckCircle className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
          Submitted
        </>
      )}
    </span>
  )
}
