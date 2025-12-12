import Link from "next/link"
import { redirect } from "next/navigation"
import { getVendors } from "@/app/actions/vendors"
import { VendorDialog } from "@/components/features/resources"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function VendorsPage() {
  let vendors
  try {
    vendors = await getVendors()
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/login?redirect=/vendors")
    }
    throw error
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">
            Manage subcontractors and internal teams.
          </p>
        </div>
        <VendorDialog />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>ABN</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No vendors configured. Add your first vendor to get started.
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    <Link
                      href={`/vendors/${vendor.id}`}
                      className="font-medium hover:underline"
                    >
                      {vendor.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vendor.is_internal ? "secondary" : "outline"}>
                      {vendor.is_internal ? "Internal" : "Subbie"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {vendor.contact_email || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {vendor.abn || "—"}
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
