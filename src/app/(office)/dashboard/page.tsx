export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to CivilOS. Overview of your projects and resources.
        </p>
      </div>

      {/* Placeholder metric cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["Active Projects", "Resources", "Pending ITPs", "Today's Costs"].map(
          (title) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <p className="text-xs font-medium text-muted-foreground">
                {title}
              </p>
              <p className="mt-2 text-2xl font-bold">--</p>
            </div>
          )
        )}
      </div>

      {/* Placeholder content area */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No recent activity to display.
        </p>
      </div>
    </div>
  );
}
