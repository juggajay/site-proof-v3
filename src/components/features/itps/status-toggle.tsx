"use client"

import { Check, X, Minus } from "lucide-react"
import type { CheckStatus } from "@/lib/schemas/itps"

interface StatusToggleProps {
  status: CheckStatus
  onChange: (status: CheckStatus) => void
  disabled?: boolean
}

export function StatusToggle({ status, onChange, disabled = false }: StatusToggleProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Pass button */}
      <button
        type="button"
        onClick={() => onChange("pass")}
        disabled={disabled}
        className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-all ${
          status === "pass"
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-500"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Pass"
      >
        <Check className="h-6 w-6" strokeWidth={3} />
      </button>

      {/* Fail button */}
      <button
        type="button"
        onClick={() => onChange("fail")}
        disabled={disabled}
        className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-all ${
          status === "fail"
            ? "bg-red-500 border-red-500 text-white"
            : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Fail"
      >
        <X className="h-6 w-6" strokeWidth={3} />
      </button>

      {/* N/A button */}
      <button
        type="button"
        onClick={() => onChange("na")}
        disabled={disabled}
        className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-all ${
          status === "na"
            ? "bg-gray-400 border-gray-400 text-white"
            : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Not Applicable"
      >
        <Minus className="h-6 w-6" strokeWidth={3} />
      </button>
    </div>
  )
}
