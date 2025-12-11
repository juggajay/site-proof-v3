"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { bulkCreateLots } from "@/app/actions/lots"
import type { BulkImportResult } from "@/lib/schemas/projects"

interface BulkLotImporterProps {
  projectId: string
  onSuccess?: () => void
}

export function BulkLotImporter({ projectId, onSuccess }: BulkLotImporterProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csvText, setCsvText] = useState("")
  const [result, setResult] = useState<BulkImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleImport() {
    if (!csvText.trim()) {
      setError("Please enter some data to import")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setResult(null)

    try {
      const importResult = await bulkCreateLots(projectId, csvText)
      setResult(importResult)

      if (importResult.created > 0) {
        onSuccess?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import lots")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClose() {
    setOpen(false)
    setCsvText("")
    setResult(null)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose()
      else setOpen(true)
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Lots</DialogTitle>
          <DialogDescription>
            Paste CSV data to create multiple lots at once. Each line should contain
            a lot number and optional description, separated by comma or tab.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="rounded-md bg-muted p-4 text-sm space-y-2">
              <p className="font-medium">
                Import complete: {result.created} lot{result.created !== 1 ? "s" : ""} created
              </p>
              {result.duplicates.length > 0 && (
                <p className="text-amber-600">
                  Skipped {result.duplicates.length} duplicate lot number{result.duplicates.length !== 1 ? "s" : ""}:
                  {" "}{result.duplicates.slice(0, 5).join(", ")}
                  {result.duplicates.length > 5 && ` and ${result.duplicates.length - 5} more`}
                </p>
              )}
              {result.skippedLines.length > 0 && (
                <p className="text-muted-foreground">
                  Skipped {result.skippedLines.length} invalid line{result.skippedLines.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="csv-input">CSV Data</Label>
            <textarea
              id="csv-input"
              className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              placeholder={`101, Earthworks ch0-100\n102, Earthworks ch100-200\n103, Drainage works\n104`}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Format: lot_number, description (one per line). Description is optional.
              Supports both comma and tab separators.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            {result ? "Close" : "Cancel"}
          </Button>
          {!result && (
            <Button onClick={handleImport} disabled={isSubmitting || !csvText.trim()}>
              {isSubmitting ? "Importing..." : "Import Lots"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
