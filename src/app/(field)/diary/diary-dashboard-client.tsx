"use client"

import { useRouter } from "next/navigation"
import { Plus, ChevronRight, Calendar, FolderOpen } from "lucide-react"
import { StatusBadge } from "@/components/features/field"

interface Dashboard {
  todaysDiaries: {
    id: string
    date: string
    status: string | null
    project: { id: string; name: string; code: string | null } | null
    lot: { id: string; lot_number: string; description: string | null } | null
  }[]
  projects: {
    id: string
    name: string
    code: string | null
    status: string | null
  }[]
  today: string
}

interface DiaryDashboardClientProps {
  dashboard: Dashboard
}

export function DiaryDashboardClient({ dashboard }: DiaryDashboardClientProps) {
  const router = useRouter()

  // Format today's date
  const formattedDate = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-6 p-4">
      {/* Date Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold">Today's Diary</h1>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>

      {/* Today's Diaries */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Active Diaries</h2>
          <span className="text-sm text-muted-foreground">
            {dashboard.todaysDiaries.length} today
          </span>
        </div>

        {dashboard.todaysDiaries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
            <Calendar className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No diaries yet today</p>
            <p className="text-sm text-muted-foreground">
              Start by selecting a project below
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard.todaysDiaries.map((diary) => (
              <button
                key={diary.id}
                onClick={() => router.push(`/diary/${diary.id}`)}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
              >
                <div className="flex-1">
                  <p className="font-semibold">
                    {diary.project?.name ?? "Unknown Project"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Lot {diary.lot?.lot_number}
                    {diary.lot?.description && ` - ${diary.lot.description}`}
                  </p>
                </div>
                <StatusBadge status={diary.status} size="sm" />
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Start New Diary */}
      <section>
        <h2 className="mb-3 font-semibold">Start New Diary</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Select a project to create a diary for today
        </p>

        {dashboard.projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
            <FolderOpen className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No active projects</p>
            <p className="text-sm text-muted-foreground">
              Contact your office to get assigned
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {dashboard.projects.map((project) => (
              <button
                key={project.id}
                onClick={() => router.push(`/diary/new/${project.id}`)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{project.name}</p>
                  {project.code && (
                    <p className="text-sm text-muted-foreground">{project.code}</p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
