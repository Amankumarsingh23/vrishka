import { listFlowers, listFlowersByGroup } from "@/lib/data/flowers";
import type { FlowerGroup } from "@/types/flower";
import { FilterChips } from "@/components/gallery/FilterChips";
import { FlowerCard } from "@/components/gallery/FlowerCard";

// Explicit alongside the implicit dynamic behavior from reading
// searchParams — see app/page.tsx for why this matters for this app.
export const dynamic = "force-dynamic";

const VALID_GROUPS: FlowerGroup[] = [1, 2, 3, 4];

function parseGroup(value: string | string[] | undefined): FlowerGroup | undefined {
  const num = Number(Array.isArray(value) ? value[0] : value);
  return VALID_GROUPS.includes(num as FlowerGroup) ? (num as FlowerGroup) : undefined;
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { group?: string | string[] };
}) {
  const activeGroup = parseGroup(searchParams.group);
  const flowers = activeGroup ? await listFlowersByGroup(activeGroup) : await listFlowers();

  return (
    <div>
      <h1 className="font-serif text-h1 text-ink">Gallery</h1>
      <p className="mt-2 font-sans text-body">
        Browse every plant in your collection.
      </p>

      <div className="mt-6">
        <FilterChips active={activeGroup} />
      </div>

      {flowers.length === 0 ? (
        <div className="mt-6 rounded-card border border-border bg-surface p-10 text-center">
          <p className="font-serif text-h3 text-ink">
            {activeGroup ? "No buckets in this group" : "No buckets yet"}
          </p>
          <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-body">
            {activeGroup
              ? "Try a different filter, or view all buckets."
              : "Seed your Supabase database or log your first bucket to get started."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {flowers.map((flower, index) => (
            <FlowerCard key={flower.id} flower={flower} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
