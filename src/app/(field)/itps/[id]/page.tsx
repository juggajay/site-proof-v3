import { notFound } from "next/navigation"
import { getLotItp } from "@/app/actions/itps"
import { ChecklistRunner } from "@/components/features/itps"

interface ChecklistRunnerPageProps {
  params: Promise<{ id: string }>
}

export default async function ChecklistRunnerPage({ params }: ChecklistRunnerPageProps) {
  const { id } = await params

  let itp
  try {
    itp = await getLotItp(id)
  } catch {
    notFound()
  }

  return <ChecklistRunner itp={itp} />
}
