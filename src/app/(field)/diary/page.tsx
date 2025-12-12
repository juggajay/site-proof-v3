import { redirect } from "next/navigation"
import { getForemanDashboard } from "@/app/actions/diaries"
import { DiaryDashboardClient } from "./diary-dashboard-client"

export default async function DiaryPage() {
  let dashboard
  try {
    dashboard = await getForemanDashboard()
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/login?redirect=/diary")
    }
    throw error
  }

  return <DiaryDashboardClient dashboard={dashboard} />
}
