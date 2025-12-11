export default function ProfilePage() {
  return (
    <div className="space-y-4 p-4">
      {/* Profile header */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          ?
        </div>
        <div>
          <h1 className="text-xl font-bold">Not Signed In</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">
            Diaries This Week
          </p>
          <p className="mt-1 text-2xl font-bold">--</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">
            ITPs Completed
          </p>
          <p className="mt-1 text-2xl font-bold">--</p>
        </div>
      </div>

      {/* Settings list */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {[
          { label: "Current Project", value: "Not selected" },
          { label: "Default Lot", value: "None" },
          { label: "Notifications", value: "Enabled" },
        ].map((item, index, arr) => (
          <button
            key={item.label}
            className={`touch-target flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-accent ${
              index < arr.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-sm text-muted-foreground">{item.value}</span>
          </button>
        ))}
      </div>

      {/* Sign out */}
      <button className="touch-target w-full rounded-xl border border-destructive bg-transparent py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground">
        Sign Out
      </button>
    </div>
  );
}
