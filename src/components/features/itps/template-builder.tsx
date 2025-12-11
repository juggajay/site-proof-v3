"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, AlertTriangle, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { updateTemplateItems, deleteTemplate } from "@/app/actions/itps"
import { createNewTemplateItem, type TemplateItem } from "@/lib/schemas/itps"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TemplateBuilderProps {
  templateId: string
  templateTitle: string
  initialItems: TemplateItem[]
}

export function TemplateBuilder({
  templateId,
  templateTitle,
  initialItems,
}: TemplateBuilderProps) {
  const router = useRouter()
  const [items, setItems] = useState<TemplateItem[]>(initialItems)
  const [newQuestion, setNewQuestion] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const hasChanges = JSON.stringify(items) !== JSON.stringify(initialItems)

  function addItem() {
    if (!newQuestion.trim()) return

    const newItem = createNewTemplateItem(newQuestion.trim(), items.length)
    setItems([...items, newItem])
    setNewQuestion("")
  }

  function removeItem(id: string) {
    setItems(items.filter((item) => item.id !== id).map((item, index) => ({
      ...item,
      order: index,
    })))
  }

  function toggleHoldPoint(id: string) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, is_hold_point: !item.is_hold_point } : item
      )
    )
  }

  function updateQuestion(id: string, question: string) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, question } : item
      )
    )
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      try {
        await updateTemplateItems({
          template_id: templateId,
          items,
        })
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save items")
      }
    })
  }

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      try {
        await deleteTemplate(templateId)
        router.push("/library")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete template")
        setShowDeleteConfirm(false)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{templateTitle}</h1>
          <p className="text-muted-foreground">
            {items.length} check {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button onClick={handleSave} disabled={isPending || !hasChanges}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Add new item */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <Label htmlFor="new-question" className="text-sm font-medium">
          Add Check Item
        </Label>
        <div className="mt-2 flex gap-2">
          <Input
            id="new-question"
            placeholder="e.g., Subgrade compaction tested to 98% MDD"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addItem()
              }
            }}
          />
          <Button onClick={addItem} disabled={!newQuestion.trim()}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Items list */}
      <div className="rounded-xl border border-border bg-card shadow-sm divide-y divide-border">
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No check items yet. Add your first item above.
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="p-4 flex items-start gap-3"
            >
              <div className="text-muted-foreground/50 mt-2">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="text-muted-foreground font-mono text-sm mt-2 w-6">
                {index + 1}.
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={item.question}
                  onChange={(e) => updateQuestion(item.id, e.target.value)}
                  className="font-medium"
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`hold-${item.id}`}
                    checked={item.is_hold_point}
                    onChange={() => toggleHoldPoint(item.id)}
                  />
                  <Label
                    htmlFor={`hold-${item.id}`}
                    className="text-sm flex items-center gap-1 cursor-pointer"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    Hold Point
                  </Label>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{templateTitle}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
