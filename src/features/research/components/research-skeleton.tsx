import { Skeleton } from "@/components/ui/skeleton";
import { PageBody } from "@/components/page-header";

/** Shown while a research route's loader is pending on client-side navigation. */
export function ResearchPagePending() {
  return (
    <PageBody className="space-y-6">
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </PageBody>
  );
}
