"use client"

import { useState, useEffect } from "react"
import { ClipboardPlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getAvailableTemplatesForLot, attachItpToLot } from "@/app/actions/itps"
import type { TemplateItem } from "@/lib/schemas/itps"

interface Template {
  id: string
  title: string
  items: TemplateItem[]
}

interface AttachItpDialogProps {
  lotId: string
  lotNumber: string
  onSuccess?: () => void
}

export function AttachItpDialog({ lotId, lotNumber, onSuccess }: AttachItpDialogProps) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load available templates when dialog opens
  useEffect(() => {
    if (open) {
      setIsLoading(true)
      setError(null)
      getAvailableTemplatesForLot(lotId)
        .then((data) => {
          setTemplates(data.map(t => ({
            ...t,
            items: (t.items as TemplateItem[]) ?? []
          })))
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to load templates")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      // Reset state when dialog closes
      setSelectedTemplateId(null)
      setError(null)
    }
  }, [open, lotId])

  async function handleAttach() {
    if (!selectedTemplateId) return

    setIsSubmitting(true)
    setError(null)
    try {
      await attachItpToLot({
        lot_id: lotId,
        template_id: selectedTemplateId,
      })
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to attach ITP")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ClipboardPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach ITP to Lot {lotNumber}</DialogTitle>
          <DialogDescription>
            Select an ITP template to attach to this lot. The template items will be copied as a snapshot.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No templates available.</p>
              <p className="text-sm mt-1">
                Create templates in the ITP Library or all templates are already attached.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Select Template</Label>
              <Select
                value={selectedTemplateId ?? ""}
                onValueChange={setSelectedTemplateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title} ({template.items.length} items)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTemplate && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
                  <p className="font-medium mb-2">Preview: {selectedTemplate.items.length} check items</p>
                  <ul className="space-y-1 text-muted-foreground max-h-32 overflow-y-auto">
                    {selectedTemplate.items.slice(0, 5).map((item, i) => (
                      <li key={item.id} className="truncate">
                        {i + 1}. {item.question}
                        {item.is_hold_point && (
                          <span className="ml-1 text-amber-600">(Hold)</span>
                        )}
                      </li>
                    ))}
                    {selectedTemplate.items.length > 5 && (
                      <li className="text-muted-foreground/60">
                        ... and {selectedTemplate.items.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAttach}
            disabled={!selectedTemplateId || isSubmitting}
          >
            {isSubmitting ? "Attaching..." : "Attach ITP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
