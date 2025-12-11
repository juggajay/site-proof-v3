export default function LotsPage() {
  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">My Lots</h1>
        <p className="text-sm text-muted-foreground">
          Inspection & Test Plans assigned to you
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["All", "Pending", "In Progress", "Complete"].map((filter, index) => (
          <button
            key={filter}
            className={`touch-target rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              index === 0
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Placeholder lot cards */}
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">No ITPs Assigned</h3>
              <p className="text-sm text-muted-foreground">
                ITPs will appear here when assigned to you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
