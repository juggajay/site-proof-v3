"use client"

import Link from "next/link"
import { FolderOpen, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  id: string
  name: string
  code: string | null
  status: string | null
  openLotCount: number
  totalLotCount: number
}

export function ProjectCard({
  id,
  name,
  code,
  status,
  openLotCount,
  totalLotCount,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`}>
      <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              {code && (
                <p className="text-sm text-muted-foreground">{code}</p>
              )}
            </div>
          </div>
          {status === "Archived" && (
            <Badge variant="secondary">Archived</Badge>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {openLotCount} open {openLotCount === 1 ? "lot" : "lots"}
            {totalLotCount > 0 && (
              <span className="text-muted-foreground/60"> / {totalLotCount} total</span>
            )}
          </span>
        </div>
      </div>
    </Link>
  )
}
