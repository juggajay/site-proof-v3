import { notFound } from "next/navigation"
import { getTemplate } from "@/app/actions/itps"
import { TemplateBuilder } from "@/components/features/itps"

interface TemplateBuilderPageProps {
  params: Promise<{ id: string }>
}

export default async function TemplateBuilderPage({ params }: TemplateBuilderPageProps) {
  const { id } = await params

  let template
  try {
    template = await getTemplate(id)
  } catch {
    notFound()
  }

  return (
    <TemplateBuilder
      templateId={template.id}
      templateTitle={template.title}
      initialItems={template.items}
    />
  )
}
