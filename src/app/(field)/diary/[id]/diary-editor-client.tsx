"use client"

import { useRouter } from "next/navigation"
import { DiaryWizard } from "@/components/features/field"

interface DiaryEntry {
  id: string
  start_time: string | null
  finish_time: string | null
  break_hours: number | null
  total_hours: number | null
  total_cost_cents: number | null
  frozen_rate_cents: number | null
  resource: {
    id: string
    name: string
    type: string | null
    vendor: { id: string; name: string } | null
  } | null
}

interface Diary {
  id: string
  date: string
  status: string | null
  notes: string | null
  project: { id: string; name: string; code: string | null } | null
  lot: { id: string; lot_number: string; description: string | null } | null
  entries: DiaryEntry[]
}

interface VendorGroup {
  vendorId: string
  vendorName: string
  resources: {
    id: string
    name: string
    type: string | null
    vendor: { id: string; name: string } | null
    rate_card: { id: string; role_name: string; rate_cents: number; unit: string | null } | null
  }[]
}

interface DiaryEditorClientProps {
  diary: Diary
  availableResources: VendorGroup[]
}

export function DiaryEditorClient({ diary, availableResources }: DiaryEditorClientProps) {
  const router = useRouter()

  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <DiaryWizard
      diary={diary}
      availableResources={availableResources}
      onRefresh={handleRefresh}
    />
  )
}
