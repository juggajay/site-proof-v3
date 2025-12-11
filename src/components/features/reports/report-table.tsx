import { HardHat, Truck } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCents, formatHours, cn } from "@/lib/utils"
import type { VendorGroup } from "@/app/actions/reports"

interface ReportTableProps {
  vendors: VendorGroup[]
  grandTotalHours: number
  grandTotalCostCents: number
}

export function ReportTable({
  vendors,
  grandTotalHours,
  grandTotalCostCents,
}: ReportTableProps) {
  if (vendors.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          No diary entries found for the selected date range.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[300px]">Resource</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-right">Days Worked</TableHead>
            <TableHead className="text-right">Total Hours</TableHead>
            <TableHead className="text-right">Total Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <>
              {/* Vendor Header Row */}
              <TableRow
                key={`vendor-${vendor.vendorId}`}
                className="bg-muted/30 hover:bg-muted/40"
              >
                <TableCell
                  colSpan={3}
                  className="font-semibold text-foreground"
                >
                  {vendor.vendorName}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatHours(vendor.totalHours)} hrs
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCents(vendor.totalCostCents)}
                </TableCell>
              </TableRow>

              {/* Resource Rows */}
              {vendor.entries.map((entry) => (
                <TableRow key={`resource-${entry.resourceId}`}>
                  <TableCell className="pl-8">
                    <div className="flex items-center gap-2">
                      {entry.resourceType === "labor" ? (
                        <HardHat className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Truck className="h-4 w-4 text-muted-foreground" />
                      )}
                      {entry.resourceName}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        entry.resourceType === "labor"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      )}
                    >
                      {entry.resourceType === "labor" ? "Labor" : "Plant"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.daysWorked}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatHours(entry.totalHours)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCents(entry.totalCostCents)}
                  </TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-primary/5 font-semibold">
            <TableCell colSpan={3}>Grand Total</TableCell>
            <TableCell className="text-right">
              {formatHours(grandTotalHours)} hrs
            </TableCell>
            <TableCell className="text-right text-lg">
              {formatCents(grandTotalCostCents)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
