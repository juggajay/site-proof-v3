import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Building2 } from "lucide-react"
import { getVendor } from "@/app/actions/vendors"
import { getRateCards } from "@/app/actions/rate-cards"
import { getResourcesByVendor } from "@/app/actions/resources"
import { getVendors } from "@/app/actions/vendors"
import { VendorDetailClient } from "./vendor-detail-client"

interface VendorDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function VendorDetailPage({ params }: VendorDetailPageProps) {
  const { id } = await params

  try {
    const [vendor, rateCards, resources, vendors] = await Promise.all([
      getVendor(id),
      getRateCards(id),
      getResourcesByVendor(id),
      getVendors(),
    ])

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/vendors"
            className="flex items-center justify-center rounded-lg border border-border bg-card p-2 hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{vendor.name}</h1>
              <p className="text-sm text-muted-foreground">
                {vendor.is_internal ? "Internal Team" : "Subcontractor"}
                {vendor.abn && ` · ABN: ${vendor.abn}`}
              </p>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <VendorDetailClient
          vendor={vendor}
          rateCards={rateCards}
          resources={resources}
          vendors={vendors}
        />
      </div>
    )
  } catch {
    notFound()
  }
}
