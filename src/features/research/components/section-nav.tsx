import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  name: string;
  total: number;
  done: number;
}

interface SectionNavProps {
  sections: SectionNavItem[];
  active: string;
  onSelect: (name: string) => void;
}

/** Desktop sidebar listing sections with a completion indicator. Hidden below lg. */
export function SectionSidebarNav({ sections, active, onSelect }: SectionNavProps) {
  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-6 space-y-1">
        {sections.map((section) => {
          const complete = section.total > 0 && section.done === section.total;
          return (
            <button
              key={section.name}
              type="button"
              onClick={() => onSelect(section.name)}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition",
                section.name === active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span className="truncate">{section.name}</span>
              <span className={cn("shrink-0 text-xs tabular-nums", complete && "text-success")}>
                {complete ? <Check className="h-3.5 w-3.5" /> : `${section.done}/${section.total}`}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

/** Section switcher for small screens, shown above the active section's content. */
export function SectionMobileSelect({ sections, active, onSelect }: SectionNavProps) {
  return (
    <div className="lg:hidden">
      <Select value={active} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Section" />
        </SelectTrigger>
        <SelectContent>
          {sections.map((s) => (
            <SelectItem key={s.name} value={s.name}>
              {s.name} ({s.done}/{s.total})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Previous/next buttons for moving between sections in order. */
export function SectionStepper({
  sectionNames,
  current,
  onNavigate,
}: {
  sectionNames: string[];
  current: string;
  onNavigate: (section: string) => void;
}) {
  if (sectionNames.length <= 1) return null;
  const idx = sectionNames.indexOf(current);
  const prev = sectionNames[idx - 1];
  const next = sectionNames[idx + 1];
  return (
    <div className="flex justify-between">
      {prev ? (
        <Button variant="outline" onClick={() => onNavigate(prev)}>
          ← {prev}
        </Button>
      ) : (
        <span />
      )}
      {next ? (
        <Button variant="outline" onClick={() => onNavigate(next)}>
          {next} →
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}
