"use client"

import { useState, useTransition } from "react"
import { Search, Check, Users, Truck, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Resource {
  id: string
  name: string
  type: string | null
  vendor: { id: string; name: string } | null
  rate_card: { id: string; role_name: string; rate_cents: number; unit: string | null } | null
}

interface VendorGroup {
  vendorId: string
  vendorName: string
  resources: Resource[]
}

interface ResourcePickerProps {
  groups: VendorGroup[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  existingResourceIds?: string[]
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function ResourcePicker({
  groups,
  selectedIds,
  onSelectionChange,
  existingResourceIds = [],
  onConfirm,
  onCancel,
  isLoading,
}: ResourcePickerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter resources based on search
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      resources: group.resources.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.rate_card?.role_name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.resources.length > 0)

  const toggleResource = (id: string) => {
    if (existingResourceIds.includes(id)) return // Already in diary
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  const toggleVendor = (vendorId: string) => {
    const group = groups.find((g) => g.vendorId === vendorId)
    if (!group) return

    const selectableIds = group.resources
      .filter((r) => !existingResourceIds.includes(r.id))
      .map((r) => r.id)

    const allSelected = selectableIds.every((id) => selectedIds.includes(id))

    if (allSelected) {
      // Deselect all from this vendor
      onSelectionChange(selectedIds.filter((id) => !selectableIds.includes(id)))
    } else {
      // Select all from this vendor
      const newIds = [...new Set([...selectedIds, ...selectableIds])]
      onSelectionChange(newIds)
    }
  }

  const formatRate = (cents: number | undefined | null, unit: string | undefined | null) => {
    if (!cents) return ""
    return `$${(cents / 100).toFixed(0)}/${unit ?? "hr"}`
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Resources</h2>
          <button
            onClick={onCancel}
            className="touch-target rounded-lg p-2 hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {selectedIds.length} selected
        </p>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Resource List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredGroups.map((group) => {
          const selectableResources = group.resources.filter(
            (r) => !existingResourceIds.includes(r.id)
          )
          const allSelected =
            selectableResources.length > 0 &&
            selectableResources.every((r) => selectedIds.includes(r.id))

          return (
            <div key={group.vendorId} className="mb-6">
              {/* Vendor Header with Select All */}
              <button
                onClick={() => toggleVendor(group.vendorId)}
                className="mb-2 flex w-full items-center justify-between rounded-lg p-2 hover:bg-accent"
              >
                <span className="font-semibold text-muted-foreground">
                  {group.vendorName}
                </span>
                {selectableResources.length > 0 && (
                  <span className="flex items-center gap-1 text-sm text-primary">
                    <Users className="h-4 w-4" />
                    {allSelected ? "Deselect All" : "Select All"}
                  </span>
                )}
              </button>

              {/* Resources */}
              <div className="space-y-2">
                {group.resources.map((resource) => {
                  const isSelected = selectedIds.includes(resource.id)
                  const isExisting = existingResourceIds.includes(resource.id)
                  const isPerson = resource.type === "person"

                  return (
                    <button
                      key={resource.id}
                      onClick={() => toggleResource(resource.id)}
                      disabled={isExisting}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-4 transition-colors",
                        isExisting
                          ? "border-border bg-muted opacity-50"
                          : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-accent"
                      )}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          isPerson ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                        )}
                      >
                        {isPerson ? (
                          <Users className="h-5 w-5" />
                        ) : (
                          <Truck className="h-5 w-5" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-left">
                        <p className="font-medium">{resource.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {resource.rate_card?.role_name ?? "No role"} •{" "}
                          {formatRate(resource.rate_card?.rate_cents, resource.rate_card?.unit)}
                        </p>
                      </div>

                      {/* Selection indicator */}
                      {isExisting ? (
                        <span className="text-xs text-muted-foreground">Added</span>
                      ) : (
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border-2",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border"
                          )}
                        >
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filteredGroups.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {searchQuery ? "No resources match your search" : "No resources available"}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-background p-4">
        <button
          onClick={onConfirm}
          disabled={selectedIds.length === 0 || isLoading}
          className={cn(
            "touch-target h-14 w-full rounded-xl text-base font-semibold transition-colors",
            selectedIds.length > 0
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isLoading
            ? "Adding..."
            : `Add ${selectedIds.length} Resource${selectedIds.length !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  )
}
