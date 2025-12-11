import { notFound } from "next/navigation"
import { getProject } from "@/app/actions/projects"
import { getLots } from "@/app/actions/lots"
import { ProjectDetailClient } from "./project-detail-client"

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params

  try {
    const [project, lots] = await Promise.all([
      getProject(id),
      getLots(id),
    ])

    return <ProjectDetailClient project={project} initialLots={lots} />
  } catch {
    notFound()
  }
}
