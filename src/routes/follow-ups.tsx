import { createFileRoute } from "@tanstack/react-router";
import { Plus, Phone, Mail, Users, Presentation, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/follow-ups")({
  head: () => ({
    meta: [
      { title: "Follow-ups · Inspe Research CRM" },
      { name: "description", content: "Sales pipeline and follow-up tracker across all engaged schools." },
    ],
  }),
  component: FollowUpsPage,
});

const stages = [
  { name: "Lead", count: 46, color: "bg-muted" },
  { name: "Contacted", count: 32, color: "bg-primary/20" },
  { name: "Qualified", count: 24, color: "bg-primary/30" },
  { name: "Discovery", count: 18, color: "bg-cream" },
  { name: "Proposal", count: 12, color: "bg-accent/40" },
  { name: "Negotiation", count: 7, color: "bg-accent" },
  { name: "Pilot", count: 4, color: "bg-success/40" },
  { name: "Customer", count: 3, color: "bg-success" },
];

const pipeline: Record<string, { school: string; owner: string; next: string; value: string }[]> = {
  Lead: [
    { school: "GS Nyagatare", owner: "Diane", next: "Send intro email", value: "$0" },
    { school: "APAPER Nyamirambo", owner: "Aline", next: "Initial call", value: "$0" },
  ],
  Contacted: [
    { school: "GS Kacyiru II", owner: "Aline", next: "Follow up Thu", value: "$0" },
    { school: "ES Kibogora", owner: "Patrick", next: "Send materials", value: "$0" },
  ],
  Qualified: [
    { school: "Lycée de Kigali", owner: "Jean", next: "Book discovery", value: "$8,400" },
  ],
  Discovery: [
    { school: "Riviera High", owner: "Aline", next: "Analyze findings", value: "$12,000" },
  ],
  Proposal: [
    { school: "GS Save", owner: "Jean", next: "Send proposal v2", value: "$6,800" },
  ],
  Negotiation: [
    { school: "GS Rwesero", owner: "Patrick", next: "Contract review", value: "$5,200" },
  ],
  Pilot: [
    { school: "Riviera Pilot", owner: "Aline", next: "Week 3 check-in", value: "$3,000" },
  ],
  Customer: [
    { school: "Green Hills Academy", owner: "Jean", next: "Q3 QBR", value: "$18,000" },
  ],
};

const activityIcons: Record<string, React.ElementType> = {
  Call: Phone,
  Email: Mail,
  Meeting: Users,
  Demo: Presentation,
};

const recent = [
  { type: "Call", school: "Lycée de Kigali", note: "Discussed reporting pain points", when: "1h ago" },
  { type: "Email", school: "GS Nyagatare", note: "Sent Inspe SchoolOS overview", when: "3h ago" },
  { type: "Meeting", school: "Riviera High", note: "Discovery session part 2", when: "Yesterday" },
  { type: "Demo", school: "GS Save", note: "Attendance module walkthrough", when: "2d ago" },
];

function FollowUpsPage() {
  return (
    <>
      <PageHeader
        title="Follow-ups & Pipeline"
        description="Sales conversations across your researched school portfolio."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Follow-ups" }]}
        actions={<Button><Plus className="mr-2 h-4 w-4" />Log activity</Button>}
      />
      <PageBody className="space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
          {stages.map((s) => (
            <Card key={s.name} className="shadow-none">
              <CardContent className="p-3">
                <div className={`h-1 w-full rounded-full ${s.color}`} />
                <div className="mt-2 text-xs font-medium text-muted-foreground">{s.name}</div>
                <div className="text-xl font-semibold tabular-nums text-foreground">{s.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Pipeline board</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(pipeline).slice(0, 8).map(([stage, items]) => (
              <div key={stage} className="rounded-xl border bg-background p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stage}</div>
                  <Badge variant="secondary" className="h-5 rounded-full px-1.5 text-[10px]">{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.map((it, i) => (
                    <Card key={i} className="shadow-none">
                      <CardContent className="p-3">
                        <div className="truncate text-sm font-medium">{it.school}</div>
                        <div className="mt-1 truncate text-xs text-muted-foreground">Next: {it.next}</div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{it.owner}</span>
                          <span className="font-medium text-primary">{it.value}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Recent activity</h2>
          <Card className="shadow-none">
            <CardContent className="divide-y p-0">
              {recent.map((r, i) => {
                const Icon = activityIcons[r.type];
                return (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1 text-sm">
                      <span className="font-medium">{r.type}</span> · <span className="text-muted-foreground">{r.school}</span>
                      <div className="truncate text-xs text-muted-foreground">{r.note}</div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{r.when}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
