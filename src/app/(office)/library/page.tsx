import { redirect } from "next/navigation"
import { getTemplates } from "@/app/actions/itps"
import { TemplateCard, TemplateDialog } from "@/components/features/itps"
import type { TemplateItem } from "@/lib/schemas/itps"

export default async function LibraryPage() {
  let templates
  try {
    templates = await getTemplates()
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/login?redirect=/library")
    }
    throw error
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ITP Library</h1>
          <p className="text-muted-foreground">
            Create and manage Inspection & Test Plan templates.
          </p>
        </div>
        <TemplateDialog />
      </div>

      {templates.length === 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-8 text-center text-sm text-muted-foreground">
            No templates yet. Create your first ITP template to get started.
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              title={template.title}
              items={(template.items as TemplateItem[]) ?? []}
            />
          ))}
        </div>
      )}
    </div>
  )
}
