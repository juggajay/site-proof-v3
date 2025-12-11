import { getProjects } from "@/app/actions/projects"
import { ProjectCard, ProjectDialog } from "@/components/features/projects"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your civil construction projects.
          </p>
        </div>
        <ProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-8 text-center text-sm text-muted-foreground">
            No projects yet. Create your first project to get started.
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              code={project.code}
              status={project.status}
              openLotCount={project.openLotCount}
              totalLotCount={project.totalLotCount}
            />
          ))}
        </div>
      )}
    </div>
  )
}
