import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@tanstack/react-router";

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
  className?: string;
}) {
  // The current page's breadcrumb crumb and the title say the same thing —
  // render title once as the trail's current-page node instead of twice.
  const ancestors = breadcrumbs?.slice(0, -1) ?? [];

  return (
    <div className={cn("border-b bg-background", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 md:px-8">
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList>
            {ancestors.map((b, i) => (
              <AncestorCrumb key={i} {...b} />
            ))}
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 text-base font-semibold text-foreground">
                <span className="truncate">{title}</span>
                {description && (
                  <span className="truncate text-sm font-normal text-muted-foreground">
                    <span className="mr-2 text-border">·</span>
                    {description}
                  </span>
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

function AncestorCrumb({ label, to }: { label: string; to?: string }) {
  return (
    <>
      <BreadcrumbItem>
        {to ? (
          <BreadcrumbLink asChild>
            <Link to={to}>{label}</Link>
          </BreadcrumbLink>
        ) : (
          <span>{label}</span>
        )}
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-dashed bg-background px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-cream text-cream-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {actionLabel && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-4 md:px-8 py-6", className)}>{children}</div>;
}
