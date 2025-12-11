"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ProjectDialog,
  LotDialog,
  LotRegister,
  BulkLotImporter,
} from "@/components/features/projects"
import type { Tables } from "@/lib/supabase/database.types"

interface ProjectDetailClientProps {
  project: Tables<"projects"> & {
    openLotCount: number
    totalLotCount: number
  }
  initialLots: Tables<"lots">[]
}

export function ProjectDetailClient({ project, initialLots }: ProjectDetailClientProps) {
  const router = useRouter()

  function handleRefresh() {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/projects"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Projects
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            {project.status === "Archived" && (
              <Badge variant="secondary">Archived</Badge>
            )}
          </div>
          {project.code && (
            <p className="text-muted-foreground">{project.code}</p>
          )}
        </div>
        <ProjectDialog
          project={project}
          onSuccess={handleRefresh}
          trigger={
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          }
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Lots</p>
          <p className="text-2xl font-bold">{project.totalLotCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Open Lots</p>
          <p className="text-2xl font-bold text-blue-600">{project.openLotCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {project.totalLotCount - project.openLotCount}
          </p>
        </div>
      </div>

      {/* Lot Register Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Lot Register</h2>
          <div className="flex items-center gap-2">
            <BulkLotImporter projectId={project.id} onSuccess={handleRefresh} />
            <LotDialog projectId={project.id} onSuccess={handleRefresh} />
          </div>
        </div>

        <LotRegister lots={initialLots} onUpdate={handleRefresh} />
      </div>
    </div>
  )
}
