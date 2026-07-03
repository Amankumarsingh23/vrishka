export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-48 rounded bg-track" />
      <div className="mt-2 h-4 w-72 rounded bg-track" />

      <div
        className="mt-6 grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))" }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[110px] rounded-card-sm border border-border bg-surface" />
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[3fr_2fr]">
        <div className="h-72 rounded-card border border-border bg-surface" />
        <div className="h-72 rounded-card border border-border bg-surface" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="h-56 rounded-card border border-border bg-surface" />
        <div className="h-56 rounded-card border border-border bg-surface" />
      </div>
    </div>
  );
}
