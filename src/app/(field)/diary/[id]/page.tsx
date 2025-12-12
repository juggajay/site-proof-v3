import { notFound, redirect } from "next/navigation"
import { getDiary, getAvailableResources } from "@/app/actions/diaries"
import { DiaryEditorClient } from "./diary-editor-client"

interface DiaryEditorPageProps {
  params: Promise<{ id: string }>
}

export default async function DiaryEditorPage({ params }: DiaryEditorPageProps) {
  const { id } = await params

  let diary, availableResources
  try {
    [diary, availableResources] = await Promise.all([
      getDiary(id),
      getAvailableResources(),
    ])
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect(`/login?redirect=/diary/${id}`)
    }
    notFound()
  }

  return (
    <DiaryEditorClient diary={diary} availableResources={availableResources} />
  )
}
