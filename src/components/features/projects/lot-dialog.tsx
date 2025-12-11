"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
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
import { createLot } from "@/app/actions/lots"
import { insertLotSchema, type InsertLotSchema } from "@/lib/schemas/projects"

interface LotDialogProps {
  projectId: string
  onSuccess?: () => void
}

export function LotDialog({ projectId, onSuccess }: LotDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InsertLotSchema>({
    resolver: zodResolver(insertLotSchema),
    defaultValues: {
      lot_number: "",
      description: "",
    },
  })

  async function onSubmit(data: InsertLotSchema) {
    setIsSubmitting(true)
    setError(null)
    try {
      await createLot(projectId, data)
      setOpen(false)
      reset()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lot")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Add Lot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Lot</DialogTitle>
            <DialogDescription>
              Create a new lot for this project.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="lot_number">Lot Number</Label>
              <Input
                id="lot_number"
                placeholder="e.g., 101"
                {...register("lot_number")}
              />
              {errors.lot_number && (
                <p className="text-sm text-destructive">{errors.lot_number.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="e.g., Earthworks ch0-100"
                {...register("description")}
              />
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
              {isSubmitting ? "Creating..." : "Create Lot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
