import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format cents to Australian Dollars (e.g., 1234567 -> "$12,345.67")
 */
export function formatCents(cents: number): string {
  const dollars = cents / 100
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(dollars)
}

/**
 * Format hours with 1 decimal place (e.g., 40.5 -> "40.5")
 */
export function formatHours(hours: number): string {
  return hours.toFixed(1)
}
