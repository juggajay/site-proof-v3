import { getDiary, getAvailableResources } from "@/app/actions/diaries"
import { DiaryEditorClient } from "./diary-editor-client"

interface DiaryEditorPageProps {
  params: Promise<{ id: string }>
}

export default async function DiaryEditorPage({ params }: DiaryEditorPageProps) {
  const { id } = await params
  const [diary, availableResources] = await Promise.all([
    getDiary(id),
    getAvailableResources(),
  ])

  return (
    <DiaryEditorClient diary={diary} availableResources={availableResources} />
  )
}
