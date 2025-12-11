import { DollarSign, Clock, Users } from "lucide-react"
import { formatCents, formatHours } from "@/lib/utils"

interface SummaryCardsProps {
  totalCostCents: number
  totalHours: number
  activeResources: number
  periodLabel?: string
}

export function SummaryCards({
  totalCostCents,
  totalHours,
  activeResources,
  periodLabel = "This Week",
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Est. Cost",
      value: formatCents(totalCostCents),
      subtitle: periodLabel,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Hours",
      value: formatHours(totalHours),
      subtitle: periodLabel,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Resources",
      value: activeResources.toString(),
      subtitle: "People & Plant",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {card.subtitle}
              </p>
            </div>
            <div className={`rounded-full p-3 ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
