import Link from "next/link"
import { getResources } from "@/app/actions/resources"
import { getVendors } from "@/app/actions/vendors"
import { ResourceForm } from "@/components/features/resources"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { centsToDollars } from "@/lib/schemas/resources"

export default async function ResourcesPage() {
  const [resources, vendors] = await Promise.all([
    getResources(),
    getVendors(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">
            Track workers and equipment across all vendors.
          </p>
        </div>
        <ResourceForm vendors={vendors} />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4">
          <Input
            type="text"
            placeholder="Search resources..."
            className="w-full max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No resources configured. Add vendors and rate cards first, then add resources.
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
                  <TableCell>
                    <Link
                      href={`/vendors/${resource.vendor_id}`}
                      className="text-primary hover:underline"
                    >
                      {resource.vendor?.name || "—"}
                    </Link>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
