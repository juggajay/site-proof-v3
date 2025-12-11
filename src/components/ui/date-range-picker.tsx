"use client"

import * as React from "react"
import { Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DateRange {
  startDate: string
  endDate: string
}

type PresetKey = "this-week" | "last-week" | "this-month" | "last-month" | "custom"

interface DateRangePreset {
  key: PresetKey
  label: string
  getRange: () => DateRange
}

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const presets: DateRangePreset[] = [
  {
    key: "this-week",
    label: "This Week",
    getRange: () => {
      const monday = getMonday(new Date())
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      return { startDate: formatDate(monday), endDate: formatDate(sunday) }
    },
  },
  {
    key: "last-week",
    label: "Last Week",
    getRange: () => {
      const today = new Date()
      const lastMonday = getMonday(today)
      lastMonday.setDate(lastMonday.getDate() - 7)
      const lastSunday = new Date(lastMonday)
      lastSunday.setDate(lastMonday.getDate() + 6)
      return { startDate: formatDate(lastMonday), endDate: formatDate(lastSunday) }
    },
  },
  {
    key: "this-month",
    label: "This Month",
    getRange: () => {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { startDate: formatDate(firstDay), endDate: formatDate(lastDay) }
    },
  },
  {
    key: "last-month",
    label: "Last Month",
    getRange: () => {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0)
      return { startDate: formatDate(firstDay), endDate: formatDate(lastDay) }
    },
  },
]

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [activePreset, setActivePreset] = React.useState<PresetKey>("this-week")
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const handlePresetSelect = (preset: DateRangePreset) => {
    setActivePreset(preset.key)
    onChange(preset.getRange())
    setOpen(false)
  }

  const handleCustomDateChange = (field: "startDate" | "endDate", dateValue: string) => {
    setActivePreset("custom")
    onChange({ ...value, [field]: dateValue })
  }

  const displayLabel = activePreset === "custom"
    ? `${formatDisplayDate(value.startDate)} - ${formatDisplayDate(value.endDate)}`
    : presets.find((p) => p.key === activePreset)?.label || "Select dates"

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {displayLabel}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-2 w-80 rounded-lg border border-border bg-card p-4 shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="space-y-4">
            {/* Presets */}
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.key}
                  variant={activePreset === preset.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetSelect(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Custom Range
              </p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Start
                  </label>
                  <input
                    type="date"
                    value={value.startDate}
                    onChange={(e) => handleCustomDateChange("startDate", e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-muted-foreground">
                    End
                  </label>
                  <input
                    type="date"
                    value={value.endDate}
                    onChange={(e) => handleCustomDateChange("endDate", e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
