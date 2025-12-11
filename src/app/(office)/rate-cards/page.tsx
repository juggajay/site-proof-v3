export default function RateCardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rate Cards</h1>
          <p className="text-muted-foreground">
            Configure pricing for resources and activities.
          </p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:-translate-y-0.5 hover:bg-primary/90">
          New Rate Card
        </button>
      </div>

      {/* Placeholder table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4">
          <input
            type="text"
            placeholder="Search rate cards..."
            className="w-full max-w-sm rounded-lg border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="p-8 text-center text-sm text-muted-foreground">
          No rate cards defined. Create rate cards to track project costs.
        </div>
      </div>
    </div>
  );
}
