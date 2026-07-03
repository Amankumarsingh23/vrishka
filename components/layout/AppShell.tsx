import type { ReactNode } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { QuickLogLauncher } from "@/components/quick-log/QuickLogLauncher";
import { listFlowers } from "@/lib/data/flowers";

export async function AppShell({ children }: { children: ReactNode }) {
  const flowers = await listFlowers();

  return (
    <div className="relative z-[1] min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      <QuickLogLauncher flowers={flowers} />
    </div>
  );
}
