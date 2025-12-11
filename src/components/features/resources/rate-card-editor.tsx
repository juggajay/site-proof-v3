"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { upsertRateCards } from "@/app/actions/rate-cards"
import { centsToDollars, type RateCardSchema } from "@/lib/schemas/resources"
import type { Tables } from "@/lib/supabase/database.types"

interface RateCardEditorProps {
  vendorId: string
  rateCards: Tables<"rate_cards">[]
  onSuccess?: () => void
}

const UNIT_OPTIONS = [
  { value: "hr", label: "Per Hour" },
  { value: "day", label: "Per Day" },
  { value: "m3", label: "Per m³" },
  { value: "m2", label: "Per m²" },
  { value: "ea", label: "Each" },
]

export function RateCardEditor({ vendorId, rateCards, onSuccess }: RateCardEditorProps) {
  const [cards, setCards] = useState<RateCardSchema[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize from props
  useEffect(() => {
    setCards(
      rateCards.map((card) => ({
        id: card.id,
        role_name: card.role_name,
        rate_dollars: centsToDollars(card.rate_cents),
        unit: card.unit as RateCardSchema["unit"],
      }))
    )
    setHasChanges(false)
  }, [rateCards])

  function addRow() {
    setCards([
      ...cards,
      { role_name: "", rate_dollars: 0, unit: "hr" },
    ])
    setHasChanges(true)
  }

  function removeRow(index: number) {
    setCards(cards.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  function updateRow(index: number, field: keyof RateCardSchema, value: string | number) {
    const updated = [...cards]
    updated[index] = { ...updated[index], [field]: value }
    setCards(updated)
    setHasChanges(true)
  }

  async function handleSave() {
    // Filter out empty rows
    const validCards = cards.filter((card) => card.role_name.trim() !== "")

    if (validCards.length === 0) {
      return
    }

    setIsSaving(true)
    try {
      await upsertRateCards(vendorId, validCards)
      setHasChanges(false)
      onSuccess?.()
    } catch (error) {
      console.error("Failed to save rate cards:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Define roles and their rates for this vendor.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4" />
            Add Role
          </Button>
          {hasChanges && (
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead className="w-32">Rate ($)</TableHead>
              <TableHead className="w-40">Unit</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No rate cards defined. Click "Add Role" to create one.
                </TableCell>
              </TableRow>
            ) : (
              cards.map((card, index) => (
                <TableRow key={card.id || `new-${index}`}>
                  <TableCell>
                    <Input
                      value={card.role_name}
                      onChange={(e) => updateRow(index, "role_name", e.target.value)}
                      placeholder="e.g., Laborer, Operator"
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={card.rate_dollars || ""}
                      onChange={(e) =>
                        updateRow(index, "rate_dollars", parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={card.unit}
                      onValueChange={(value) => updateRow(index, "unit", value)}
                    >
                      <SelectTrigger className="border-0 bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
