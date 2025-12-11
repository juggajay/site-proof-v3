"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TimeInputProps {
  value: string | null
  onChange: (value: string | null) => void
  label: string
  disabled?: boolean
}

export function TimeInput({ value, onChange, label, disabled }: TimeInputProps) {
  const [hours, setHours] = useState<string>("")
  const [minutes, setMinutes] = useState<string>("")

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":")
      setHours(h || "")
      setMinutes(m || "")
    } else {
      setHours("")
      setMinutes("")
    }
  }, [value])

  const handleHoursChange = (newHours: string) => {
    const h = newHours.replace(/\D/g, "").slice(0, 2)
    const numH = parseInt(h, 10)
    if (h && (numH > 23)) return
    setHours(h)
    updateValue(h, minutes)
  }

  const handleMinutesChange = (newMinutes: string) => {
    const m = newMinutes.replace(/\D/g, "").slice(0, 2)
    const numM = parseInt(m, 10)
    if (m && (numM > 59)) return
    setMinutes(m)
    updateValue(hours, m)
  }

  const updateValue = (h: string, m: string) => {
    if (h && m) {
      const paddedH = h.padStart(2, "0")
      const paddedM = m.padStart(2, "0")
      onChange(`${paddedH}:${paddedM}`)
    } else if (!h && !m) {
      onChange(null)
    }
  }

  const incrementHours = () => {
    const current = parseInt(hours, 10) || 0
    const next = (current + 1) % 24
    const h = next.toString().padStart(2, "0")
    setHours(h)
    updateValue(h, minutes || "00")
  }

  const decrementHours = () => {
    const current = parseInt(hours, 10) || 0
    const next = current === 0 ? 23 : current - 1
    const h = next.toString().padStart(2, "0")
    setHours(h)
    updateValue(h, minutes || "00")
  }

  const incrementMinutes = () => {
    const current = parseInt(minutes, 10) || 0
    const next = (current + 15) % 60 // 15-minute increments
    const m = next.toString().padStart(2, "0")
    setMinutes(m)
    if (hours) {
      updateValue(hours, m)
    }
  }

  const decrementMinutes = () => {
    const current = parseInt(minutes, 10) || 0
    const next = current < 15 ? 45 : current - 15
    const m = next.toString().padStart(2, "0")
    setMinutes(m)
    if (hours) {
      updateValue(hours, m)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        {/* Hours */}
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={incrementHours}
            disabled={disabled}
            className="touch-target h-10 w-16 rounded-lg border border-border bg-card text-lg font-semibold transition-colors hover:bg-accent disabled:opacity-50"
          >
            +
          </button>
          <input
            type="text"
            inputMode="numeric"
            value={hours}
            onChange={(e) => handleHoursChange(e.target.value)}
            disabled={disabled}
            placeholder="HH"
            className={cn(
              "h-14 w-16 rounded-lg border border-border bg-background text-center text-2xl font-bold",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "disabled:opacity-50"
            )}
          />
          <button
            type="button"
            onClick={decrementHours}
            disabled={disabled}
            className="touch-target h-10 w-16 rounded-lg border border-border bg-card text-lg font-semibold transition-colors hover:bg-accent disabled:opacity-50"
          >
            -
          </button>
        </div>

        <span className="text-3xl font-bold">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={incrementMinutes}
            disabled={disabled}
            className="touch-target h-10 w-16 rounded-lg border border-border bg-card text-lg font-semibold transition-colors hover:bg-accent disabled:opacity-50"
          >
            +
          </button>
          <input
            type="text"
            inputMode="numeric"
            value={minutes}
            onChange={(e) => handleMinutesChange(e.target.value)}
            disabled={disabled}
            placeholder="MM"
            className={cn(
              "h-14 w-16 rounded-lg border border-border bg-background text-center text-2xl font-bold",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "disabled:opacity-50"
            )}
          />
          <button
            type="button"
            onClick={decrementMinutes}
            disabled={disabled}
            className="touch-target h-10 w-16 rounded-lg border border-border bg-card text-lg font-semibold transition-colors hover:bg-accent disabled:opacity-50"
          >
            -
          </button>
        </div>
      </div>
    </div>
  )
}

// Break input with preset buttons
interface BreakInputProps {
  value: number | null
  onChange: (value: number | null) => void
  disabled?: boolean
}

export function BreakInput({ value, onChange, disabled }: BreakInputProps) {
  const presets = [0, 0.5, 1, 1.5]

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-muted-foreground">Break (hours)</label>
      <div className="flex gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            disabled={disabled}
            className={cn(
              "touch-target h-12 flex-1 rounded-lg border text-sm font-medium transition-colors",
              value === preset
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-accent",
              "disabled:opacity-50"
            )}
          >
            {preset === 0 ? "None" : `${preset}h`}
          </button>
        ))}
      </div>
    </div>
  )
}
