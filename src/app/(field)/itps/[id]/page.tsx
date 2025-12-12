import { notFound, redirect } from "next/navigation"
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
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect(`/login?redirect=/itps/${id}`)
    }
    notFound()
  }

  return <ChecklistRunner itp={itp} />
}
