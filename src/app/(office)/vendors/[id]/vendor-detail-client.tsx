"use client"

import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  VendorDialog,
  RateCardEditor,
  ResourceForm,
} from "@/components/features/resources"
import { toggleResourceActive } from "@/app/actions/resources"
import { centsToDollars } from "@/lib/schemas/resources"
import type { Tables } from "@/lib/supabase/database.types"

interface ResourceWithRateCard {
  id: string
  name: string
  vendor_id: string
  assigned_rate_card_id: string | null
  type: string | null
  phone: string | null
  is_active: boolean | null
  organization_id: string
  created_at: string | null
  rate_card: {
    id: string
    role_name: string
    rate_cents: number
    unit: string | null
  } | null
}

interface VendorDetailClientProps {
  vendor: Tables<"vendors">
  rateCards: Tables<"rate_cards">[]
  resources: ResourceWithRateCard[]
  vendors: Tables<"vendors">[]
}

export function VendorDetailClient({
  vendor,
  rateCards,
  resources,
  vendors,
}: VendorDetailClientProps) {
  const router = useRouter()

  function handleRefresh() {
    router.refresh()
  }

  async function handleToggleActive(resourceId: string, isActive: boolean) {
    await toggleResourceActive(resourceId, isActive)
    router.refresh()
  }

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="rate-cards">Rate Cards ({rateCards.length})</TabsTrigger>
        <TabsTrigger value="resources">Resources ({resources.length})</TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Vendor Details</h2>
            <VendorDialog vendor={vendor} onSuccess={handleRefresh} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Vendor Name</p>
              <p className="font-medium">{vendor.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant={vendor.is_internal ? "secondary" : "outline"}>
                {vendor.is_internal ? "Internal Team" : "Subcontractor"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ABN</p>
              <p className="font-medium">{vendor.abn || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Email</p>
              <p className="font-medium">{vendor.contact_email || "Not provided"}</p>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Rate Cards Tab */}
      <TabsContent value="rate-cards">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Rate Cards</h2>
          <RateCardEditor
            vendorId={vendor.id}
            rateCards={rateCards}
            onSuccess={handleRefresh}
          />
        </div>
      </TabsContent>

      {/* Resources Tab */}
      <TabsContent value="resources">
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Resources</h2>
            <ResourceForm
              vendors={vendors}
              defaultVendorId={vendor.id}
              onSuccess={handleRefresh}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No resources assigned to this vendor. Add rate cards first, then add resources.
                  </TableCell>
                </TableRow>
              ) : (
                resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {resource.type === "person" ? "Person" : "Plant"}
                      </Badge>
                    </TableCell>
                    <TableCell>{resource.rate_card?.role_name || "—"}</TableCell>
                    <TableCell>
                      {resource.rate_card
                        ? `$${centsToDollars(resource.rate_card.rate_cents).toFixed(2)}/${resource.rate_card.unit}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={resource.is_active ? "success" : "secondary"}>
                        {resource.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleActive(resource.id, !resource.is_active)
                        }
                      >
                        {resource.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}
