export default function FlowerProfileLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-32 rounded bg-track" />
      <div className="mt-4 h-[240px] rounded-flower-card border border-border bg-surface sm:h-[280px]" />

      <div className="mt-6 h-4 w-40 rounded bg-track" />
      <div className="mt-2 h-9 w-56 rounded bg-track" />
      <div className="mt-2 h-4 w-40 rounded bg-track" />

      <div
        className="mt-6 grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))" }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[110px] rounded-card-sm border border-border bg-surface" />
        ))}
      </div>

      <div className="mt-8 h-64 rounded-card border border-border bg-surface" />
      <div className="mt-8 h-56 rounded-card border border-border bg-surface" />
    </div>
  );
}
