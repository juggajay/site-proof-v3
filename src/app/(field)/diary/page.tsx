import { getForemanDashboard } from "@/app/actions/diaries"
import { DiaryDashboardClient } from "./diary-dashboard-client"

export default async function DiaryPage() {
  const dashboard = await getForemanDashboard()

  return <DiaryDashboardClient dashboard={dashboard} />
}
