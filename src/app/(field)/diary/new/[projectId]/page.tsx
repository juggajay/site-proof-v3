import { notFound, redirect } from "next/navigation"
import { getProjectLots } from "@/app/actions/diaries"
import { LotSelectionClient } from "./lot-selection-client"

interface LotSelectionPageProps {
  params: Promise<{ projectId: string }>
}

export default async function LotSelectionPage({ params }: LotSelectionPageProps) {
  const { projectId } = await params

  let project, lots
  try {
    const result = await getProjectLots(projectId)
    project = result.project
    lots = result.lots
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect(`/login?redirect=/diary/new/${projectId}`)
    }
    notFound()
  }

  return <LotSelectionClient project={project} lots={lots} />
}
