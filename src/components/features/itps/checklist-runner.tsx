"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StatusToggle } from "./status-toggle"
import { PhotoUploader } from "./photo-uploader"
import { updateCheckItem, signOffItp } from "@/app/actions/itps"
import type { CheckStatus } from "@/lib/schemas/itps"

interface Check {
  id: string
  question: string
  is_hold_point?: boolean | null
  status: string | null
  photo_url: string | null
}

interface LotItp {
  id: string
  status: string | null
  template: { id: string; title: string } | null
  lot: {
    id: string
    lot_number: string
    description: string | null
    project: { id: string; name: string; code: string | null } | null
  } | null
  checks: Check[]
}

interface ChecklistRunnerProps {
  itp: LotItp
}

export function ChecklistRunner({ itp }: ChecklistRunnerProps) {
  const router = useRouter()
  const [checks, setChecks] = useState(itp.checks)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [pendingPhotoCheckId, setPendingPhotoCheckId] = useState<string | null>(null)
  const [showSignOffConfirm, setShowSignOffConfirm] = useState(false)

  const isComplete = itp.status === "complete"
  const progress = {
    total: checks.length,
    completed: checks.filter((c) => c.status === "pass" || c.status === "na").length,
    failed: checks.filter((c) => c.status === "fail").length,
    pending: checks.filter((c) => c.status === "pending").length,
  }
  const canSignOff = progress.pending === 0 && progress.failed === 0 && !isComplete

  function handleStatusChange(checkId: string, newStatus: CheckStatus) {
    if (isComplete) return

    const check = checks.find((c) => c.id === checkId)
    if (!check) return

    // If changing to fail and no photo, prompt for photo first
    if (newStatus === "fail" && !check.photo_url) {
      setPendingPhotoCheckId(checkId)
      return
    }

    // Update optimistically
    setChecks(
      checks.map((c) =>
        c.id === checkId ? { ...c, status: newStatus } : c
      )
    )

    // Persist to server
    setError(null)
    startTransition(async () => {
      try {
        await updateCheckItem({
          check_id: checkId,
          status: newStatus,
          photo_url: check.photo_url,
        })
      } catch (err) {
        // Revert on error
        setChecks(checks)
        setError(err instanceof Error ? err.message : "Failed to update check")
      }
    })
  }

  function handlePhotoUpload(checkId: string, photoUrl: string) {
    // Update local state
    setChecks(
      checks.map((c) =>
        c.id === checkId ? { ...c, photo_url: photoUrl } : c
      )
    )

    // If this was a pending fail, now complete it
    if (pendingPhotoCheckId === checkId) {
      setPendingPhotoCheckId(null)

      setChecks(
        checks.map((c) =>
          c.id === checkId ? { ...c, status: "fail", photo_url: photoUrl } : c
        )
      )

      startTransition(async () => {
        try {
          await updateCheckItem({
            check_id: checkId,
            status: "fail",
            photo_url: photoUrl,
          })
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to update check")
        }
      })
    }
  }

  function handlePhotoRemove(checkId: string) {
    const check = checks.find((c) => c.id === checkId)
    if (!check) return

    // If removing photo from a failed item, revert to pending
    const newStatus = check.status === "fail" ? "pending" : check.status

    setChecks(
      checks.map((c) =>
        c.id === checkId ? { ...c, photo_url: null, status: newStatus } : c
      )
    )

    startTransition(async () => {
      try {
        await updateCheckItem({
          check_id: checkId,
          status: newStatus as CheckStatus,
          photo_url: null,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update check")
      }
    })
  }

  function handleSignOff() {
    setError(null)
    startTransition(async () => {
      try {
        await signOffItp({ lot_itp_id: itp.id })
        setShowSignOffConfirm(false)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to sign off ITP")
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/itps")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold truncate">{itp.template?.title}</h1>
            <p className="text-sm text-muted-foreground truncate">
              {itp.lot?.project?.name} • Lot {itp.lot?.lot_number}
            </p>
          </div>
          {isComplete && (
            <Badge className="bg-green-100 text-green-700 shrink-0">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Complete
            </Badge>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  progress.failed > 0 ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${(progress.completed / progress.total) * 100}%` }}
              />
            </div>
            <span className="text-muted-foreground shrink-0">
              {progress.completed}/{progress.total}
            </span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Checklist items */}
      <div className="divide-y divide-border">
        {checks.map((check, index) => (
          <div
            key={check.id}
            className={`p-4 ${check.is_hold_point ? "bg-amber-50" : ""}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-muted-foreground font-mono text-sm mt-1 shrink-0">
                {index + 1}.
              </span>
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-2">
                  <p className="text-sm font-medium flex-1">{check.question}</p>
                  {check.is_hold_point && (
                    <Badge variant="outline" className="border-amber-500 text-amber-600 shrink-0">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Hold Point
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <StatusToggle
                    status={check.status as CheckStatus}
                    onChange={(status) => handleStatusChange(check.id, status)}
                    disabled={isComplete}
                  />

                  {(check.status === "fail" || check.photo_url) && (
                    <PhotoUploader
                      currentPhotoUrl={check.photo_url}
                      onUpload={(url) => handlePhotoUpload(check.id, url)}
                      onRemove={() => handlePhotoRemove(check.id)}
                      disabled={isComplete}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sign off section */}
      {!isComplete && (
        <div className="sticky bottom-0 border-t border-border bg-background p-4">
          {canSignOff ? (
            <Button
              onClick={() => setShowSignOffConfirm(true)}
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Sign Off ITP
            </Button>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              {progress.pending > 0 && (
                <p>{progress.pending} item{progress.pending > 1 ? "s" : ""} pending</p>
              )}
              {progress.failed > 0 && (
                <p className="text-red-600">
                  {progress.failed} item{progress.failed > 1 ? "s" : ""} failed - cannot sign off
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Photo required dialog */}
      <Dialog
        open={!!pendingPhotoCheckId}
        onOpenChange={() => setPendingPhotoCheckId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Photo Required</DialogTitle>
            <DialogDescription>
              Failed items require photo evidence. Please add a photo to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <PhotoUploader
              onUpload={(url) =>
                pendingPhotoCheckId && handlePhotoUpload(pendingPhotoCheckId, url)
              }
              onRemove={() => {}}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingPhotoCheckId(null)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sign off confirmation dialog */}
      <Dialog open={showSignOffConfirm} onOpenChange={setShowSignOffConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Off ITP</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign off this ITP? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSignOffConfirm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSignOff} disabled={isPending}>
              {isPending ? "Signing Off..." : "Confirm Sign Off"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
