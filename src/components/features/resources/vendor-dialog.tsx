"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createVendor, updateVendor } from "@/app/actions/vendors"
import { insertVendorSchema, type InsertVendorSchema } from "@/lib/schemas/resources"
import type { Tables } from "@/lib/supabase/database.types"

interface VendorDialogProps {
  vendor?: Tables<"vendors">
  onSuccess?: () => void
}

export function VendorDialog({ vendor, onSuccess }: VendorDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!vendor

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InsertVendorSchema>({
    resolver: zodResolver(insertVendorSchema),
    defaultValues: vendor
      ? {
          name: vendor.name,
          abn: vendor.abn,
          contact_email: vendor.contact_email,
          is_internal: vendor.is_internal ?? false,
        }
      : {
          name: "",
          abn: "",
          contact_email: "",
          is_internal: false,
        },
  })

  const isInternal = watch("is_internal")

  async function onSubmit(data: InsertVendorSchema) {
    setIsSubmitting(true)
    try {
      if (isEditing && vendor) {
        await updateVendor(vendor.id, data)
      } else {
        await createVendor(data)
      }
      setOpen(false)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error("Failed to save vendor:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the vendor details below."
                : "Add a new subcontractor or internal team to your organization."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Vendor Name</Label>
              <Input
                id="name"
                placeholder="e.g., ABC Earthworks"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="abn">ABN (Optional)</Label>
              <Input
                id="abn"
                placeholder="e.g., 12 345 678 901"
                {...register("abn")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact_email">Contact Email (Optional)</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder="e.g., accounts@abcearthworks.com.au"
                {...register("contact_email")}
              />
              {errors.contact_email && (
                <p className="text-sm text-destructive">
                  {errors.contact_email.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_internal"
                checked={isInternal}
                onChange={(e) => setValue("is_internal", (e.target as HTMLInputElement).checked)}
              />
              <Label htmlFor="is_internal" className="font-normal cursor-pointer">
                Internal Team (Not a subcontractor)
              </Label>
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
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Vendor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
