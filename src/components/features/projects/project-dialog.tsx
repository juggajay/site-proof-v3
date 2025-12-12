"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createProject, updateProject } from "@/app/actions/projects"
import { insertProjectSchema, type InsertProjectSchema } from "@/lib/schemas/projects"
import type { Tables } from "@/lib/supabase/database.types"

interface ProjectDialogProps {
  project?: Tables<"projects">
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function ProjectDialog({ project, onSuccess, trigger }: ProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!project

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InsertProjectSchema>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: project
      ? {
          name: project.name,
          code: project.code ?? "",
          status: (project.status as "Active" | "Archived") ?? "Active",
        }
      : {
          name: "",
          code: "",
          status: "Active",
        },
  })

  const status = watch("status")

  async function onSubmit(data: InsertProjectSchema) {
    setIsSubmitting(true)
    setError(null)
    try {
      if (isEditing && project) {
        await updateProject(project.id, data)
        setOpen(false)
        reset()
        onSuccess?.()
      } else {
        const result = await createProject(data)
        if (result.error) {
          setError(result.error)
        } else {
          setOpen(false)
          reset()
          onSuccess?.()
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project")
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
              Edit
            </Button>
          ) : (
            <Button>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Project" : "Create New Project"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the project details below."
                : "Add a new civil construction project to your organization."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="e.g., Highway Upgrade 2024"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">Project Code</Label>
              <Input
                id="code"
                placeholder="e.g., HWY-2024"
                {...register("code")}
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                A unique identifier for this project
              </p>
            </div>

            {isEditing && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setValue("status", value as "Active" | "Archived")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
