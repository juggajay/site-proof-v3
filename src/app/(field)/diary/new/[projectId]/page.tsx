import { getProjectLots } from "@/app/actions/diaries"
import { LotSelectionClient } from "./lot-selection-client"

interface LotSelectionPageProps {
  params: Promise<{ projectId: string }>
}

export default async function LotSelectionPage({ params }: LotSelectionPageProps) {
  const { projectId } = await params
  const { project, lots } = await getProjectLots(projectId)

  return <LotSelectionClient project={project} lots={lots} />
}
