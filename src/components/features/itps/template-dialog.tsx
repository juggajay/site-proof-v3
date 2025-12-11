"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { createTemplate, updateTemplate } from "@/app/actions/itps"
import { createTemplateSchema, type CreateTemplateSchema } from "@/lib/schemas/itps"

interface TemplateDialogProps {
  template?: { id: string; title: string }
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function TemplateDialog({ template, onSuccess, trigger }: TemplateDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!template

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTemplateSchema>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      title: template?.title ?? "",
    },
  })

  async function onSubmit(data: CreateTemplateSchema) {
    setIsSubmitting(true)
    setError(null)
    try {
      if (isEditing && template) {
        await updateTemplate(template.id, data)
        setOpen(false)
        onSuccess?.()
      } else {
        const result = await createTemplate(data)
        setOpen(false)
        reset()
        // Navigate to the new template builder
        router.push(`/library/${result.templateId}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          isEditing ? (
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <Button>
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Template" : "Create ITP Template"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the template name."
                : "Create a reusable inspection template. You'll add check items next."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="title">Template Name</Label>
              <Input
                id="title"
                placeholder="e.g., Concrete Pour, Pipe Laying, Compaction"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Save" : "Create & Add Items"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
