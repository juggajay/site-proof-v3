"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createResource, updateResource } from "@/app/actions/resources"
import { getRateCards } from "@/app/actions/rate-cards"
import { insertResourceSchema, centsToDollars, type InsertResourceSchema } from "@/lib/schemas/resources"
import type { Tables } from "@/lib/supabase/database.types"

interface ResourceFormProps {
  vendors: Tables<"vendors">[]
  resource?: Tables<"resources"> & {
    rate_card?: Tables<"rate_cards"> | null
  }
  defaultVendorId?: string
  onSuccess?: () => void
}

export function ResourceForm({
  vendors,
  resource,
  defaultVendorId,
  onSuccess,
}: ResourceFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rateCards, setRateCards] = useState<Tables<"rate_cards">[]>([])
  const [loadingRateCards, setLoadingRateCards] = useState(false)
  const isEditing = !!resource

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InsertResourceSchema>({
    resolver: zodResolver(insertResourceSchema),
    defaultValues: resource
      ? {
          name: resource.name,
          vendor_id: resource.vendor_id,
          assigned_rate_card_id: resource.assigned_rate_card_id ?? "",
          type: (resource.type as "person" | "plant") ?? "person",
          phone: resource.phone,
          is_active: resource.is_active ?? true,
        }
      : {
          name: "",
          vendor_id: defaultVendorId ?? "",
          assigned_rate_card_id: "",
          type: "person",
          phone: "",
          is_active: true,
        },
  })

  const selectedVendorId = watch("vendor_id")
  const selectedType = watch("type")

  // Load rate cards when vendor changes
  useEffect(() => {
    if (selectedVendorId) {
      setLoadingRateCards(true)
      getRateCards(selectedVendorId)
        .then(setRateCards)
        .catch(console.error)
        .finally(() => setLoadingRateCards(false))
    } else {
      setRateCards([])
    }
  }, [selectedVendorId])

  async function onSubmit(data: InsertResourceSchema) {
    setIsSubmitting(true)
    try {
      if (isEditing && resource) {
        await updateResource(resource.id, data)
      } else {
        await createResource(data)
      }
      setOpen(false)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error("Failed to save resource:", error)
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
            Add Resource
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Resource" : "Add New Resource"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the resource details below."
                : "Add a new worker or piece of plant/equipment."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Resource Type</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setValue("type", value as "person" | "plant")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person">Person (Worker)</SelectItem>
                  <SelectItem value="plant">Plant (Equipment)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">
                {selectedType === "person" ? "Full Name" : "Equipment Name"}
              </Label>
              <Input
                id="name"
                placeholder={
                  selectedType === "person" ? "e.g., John Smith" : "e.g., CAT 320 Excavator"
                }
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Vendor</Label>
              <Select
                value={selectedVendorId}
                onValueChange={(value) => {
                  setValue("vendor_id", value)
                  setValue("assigned_rate_card_id", "")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                      {vendor.is_internal && " (Internal)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vendor_id && (
                <p className="text-sm text-destructive">{errors.vendor_id.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Role / Rate Card</Label>
              <Select
                value={watch("assigned_rate_card_id")}
                onValueChange={(value) => setValue("assigned_rate_card_id", value)}
                disabled={!selectedVendorId || loadingRateCards}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingRateCards
                        ? "Loading..."
                        : selectedVendorId
                        ? "Select role"
                        : "Select vendor first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {rateCards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.role_name} - ${centsToDollars(card.rate_cents).toFixed(2)}/{card.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assigned_rate_card_id && (
                <p className="text-sm text-destructive">
                  {errors.assigned_rate_card_id.message}
                </p>
              )}
              {selectedVendorId && rateCards.length === 0 && !loadingRateCards && (
                <p className="text-sm text-muted-foreground">
                  No rate cards defined for this vendor. Add rate cards first.
                </p>
              )}
            </div>

            {selectedType === "person" && (
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., 0412 345 678"
                  {...register("phone")}
                />
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
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
