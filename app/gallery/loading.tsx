export default function GalleryLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-40 rounded bg-track" />
      <div className="mt-2 h-4 w-64 rounded bg-track" />

      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-20 rounded-full bg-track" />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[320px] rounded-flower-card border border-border bg-surface" />
        ))}
      </div>
    </div>
  );
}
