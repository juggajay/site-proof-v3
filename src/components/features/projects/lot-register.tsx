"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { updateLotStatus, deleteLot } from "@/app/actions/lots"
import { AttachItpDialog } from "@/components/features/itps"
import type { Tables } from "@/lib/supabase/database.types"
import type { LotStatus } from "@/lib/schemas/projects"

interface LotRegisterProps {
  lots: Tables<"lots">[]
  onUpdate?: () => void
}

const statusColors: Record<string, string> = {
  Open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Conformed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

export function LotRegister({ lots, onUpdate }: LotRegisterProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleStatusChange(lotId: string, newStatus: LotStatus) {
    setUpdatingId(lotId)
    setError(null)
    try {
      await updateLotStatus(lotId, { status: newStatus })
      onUpdate?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(lotId: string) {
    if (!confirm("Are you sure you want to delete this lot?")) return

    setDeletingId(lotId)
    setError(null)
    try {
      await deleteLot(lotId)
      onUpdate?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lot")
    } finally {
      setDeletingId(null)
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (lots.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          No lots yet. Add lots individually or use bulk import.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lot #</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]">ITP</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lots.map((lot) => (
              <TableRow key={lot.id}>
                <TableCell className="font-medium">{lot.lot_number}</TableCell>
                <TableCell className="text-muted-foreground">
                  {lot.description || "-"}
                </TableCell>
                <TableCell>
                  <Select
                    value={lot.status ?? "Open"}
                    onValueChange={(value) => handleStatusChange(lot.id, value as LotStatus)}
                    disabled={updatingId === lot.id}
                  >
                    <SelectTrigger className="w-[130px] h-8">
                      <Badge
                        variant="secondary"
                        className={statusColors[lot.status ?? "Open"]}
                      >
                        {lot.status ?? "Open"}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">
                        <Badge variant="secondary" className={statusColors.Open}>
                          Open
                        </Badge>
                      </SelectItem>
                      <SelectItem value="Conformed">
                        <Badge variant="secondary" className={statusColors.Conformed}>
                          Conformed
                        </Badge>
                      </SelectItem>
                      <SelectItem value="Closed">
                        <Badge variant="secondary" className={statusColors.Closed}>
                          Closed
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(lot.created_at)}
                </TableCell>
                <TableCell>
                  <AttachItpDialog
                    lotId={lot.id}
                    lotNumber={lot.lot_number}
                    onSuccess={onUpdate}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(lot.id)}
                    disabled={deletingId === lot.id}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
