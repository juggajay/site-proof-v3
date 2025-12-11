"use client"

import Link from "next/link"
import { ClipboardList, ListChecks } from "lucide-react"
import type { TemplateItem } from "@/lib/schemas/itps"

interface TemplateCardProps {
  id: string
  title: string
  items: TemplateItem[]
}

export function TemplateCard({ id, title, items }: TemplateCardProps) {
  const itemCount = items.length
  const holdPointCount = items.filter((item) => item.is_hold_point).length

  return (
    <Link href={`/library/${id}`}>
      <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <ListChecks className="h-4 w-4" />
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              {holdPointCount > 0 && (
                <span className="text-amber-600">
                  {holdPointCount} hold {holdPointCount === 1 ? "point" : "points"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
