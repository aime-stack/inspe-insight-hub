import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin, Clock, CheckCircle2, CalendarCheck, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/visits")({
  head: () => ({
    meta: [
      { title: "Visits · Inspe Research CRM" },
      { name: "description", content: "Schedule, check in, and complete school research visits." },
    ],
  }),
  component: VisitsPage,
});

const visits = [
  { school: "GS Kacyiru II", date: "Today · 09:30", officer: "Aline U.", status: "In Progress", district: "Gasabo, Kigali" },
  { school: "Lycée de Kigali", date: "Today · 14:00", officer: "Patrick M.", status: "Confirmed", district: "Nyarugenge, Kigali" },
  { school: "APAPER Nyamirambo", date: "Tomorrow · 10:00", officer: "Diane K.", status: "Planned", district: "Nyarugenge, Kigali" },
  { school: "Riviera High School", date: "Yesterday", officer: "Aline U.", status: "Completed", district: "Gasabo, Kigali" },
  { school: "ES Kibogora", date: "2 days ago", officer: "Patrick M.", status: "Follow-up Required", district: "Nyamasheke, Western" },
  { school: "GS Nyagatare", date: "Fri, Jun 14", officer: "Diane K.", status: "Planned", district: "Nyagatare, Eastern" },
];

const statusStyles: Record<string, { badge: string; icon: React.ElementType }> = {
  Planned: { badge: "bg-primary/10 text-primary border-primary/20", icon: CalendarCheck },
  Confirmed: { badge: "bg-accent/20 text-accent-foreground border-accent/30", icon: CheckCircle2 },
  "In Progress": { badge: "bg-cream text-cream-foreground border-cream", icon: Clock },
  Completed: { badge: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  "Follow-up Required": { badge: "bg-destructive/10 text-destructive border-destructive/20", icon: Clock },
};

function VisitsPage() {
  return (
    <>
      <PageHeader
        title="Visits"
        description="Coordinate research field visits across your team."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Visits" }]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Schedule visit
          </Button>
        }
      />
      <PageBody className="space-y-4">
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-3">
          {visits.map((v, i) => {
            const s = statusStyles[v.status];
            const Icon = s.icon;
            return (
              <Card key={i} className="shadow-none transition hover:border-primary/30">
                <CardContent className="p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-foreground">{v.school}</div>
                        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><CalendarCheck className="h-3 w-3" />{v.date}</span>
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{v.district}</span>
                          <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{v.officer}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="outline" className={s.badge + " border font-medium"}>{v.status}</Badge>
                      <Button size="sm" variant="outline">Open</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
