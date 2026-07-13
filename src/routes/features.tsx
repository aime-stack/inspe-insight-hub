import { createFileRoute } from "@tanstack/react-router";
import { Plus, Sparkles, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Feature Requests · Inspe Research CRM" },
      { name: "description", content: "Product opportunities ranked by school demand and market signal." },
    ],
  }),
  component: FeaturesPage,
});

const features = [
  { name: "Digital attendance capture", schools: 142, region: "All provinces", type: "All types", status: "In Design", demand: 92 },
  { name: "Automated end-of-term reports", schools: 118, region: "All provinces", type: "Public / Private", status: "Prioritized", demand: 88 },
  { name: "Parent SMS/WhatsApp portal", schools: 96, region: "Kigali, Eastern", type: "All types", status: "Backlog", demand: 74 },
  { name: "Fee reconciliation dashboard", schools: 74, region: "Kigali", type: "Private", status: "Prioritized", demand: 71 },
  { name: "Offline-first student records", schools: 63, region: "Western, Northern", type: "Public", status: "Backlog", demand: 68 },
  { name: "ICT inventory tracker", schools: 48, region: "All provinces", type: "All types", status: "Idea", demand: 41 },
  { name: "Library management module", schools: 34, region: "Southern", type: "Faith-based", status: "Idea", demand: 29 },
];

const statusStyles: Record<string, string> = {
  "In Design": "bg-primary/10 text-primary border-primary/20",
  Prioritized: "bg-success/10 text-success border-success/20",
  Backlog: "bg-cream text-cream-foreground border-cream",
  Idea: "bg-muted text-muted-foreground border-border",
};

function FeaturesPage() {
  return (
    <>
      <PageHeader
        title="Feature Requests"
        description="Ranked demand signal driving the Inspe SchoolOS roadmap."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Feature Requests" }]}
        actions={<Button><Plus className="mr-2 h-4 w-4" />Submit request</Button>}
      />
      <PageBody>
        <div className="grid gap-3">
          {features.map((f, i) => (
            <Card key={f.name} className="shadow-none transition hover:border-primary/30">
              <CardContent className="p-4">
                <div className="grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cream text-cream-foreground font-bold">
                    #{i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold text-foreground">
                        <Sparkles className="mr-1 inline h-4 w-4 text-accent" />
                        {f.name}
                      </h3>
                      <Badge variant="outline" className={statusStyles[f.status] + " border"}>{f.status}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{f.schools} schools</span>
                      <span>{f.region}</span>
                      <span>{f.type}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <Progress value={f.demand} className="h-1.5 flex-1" />
                      <span className="w-10 text-right text-xs font-semibold tabular-nums text-primary">
                        <TrendingUp className="mr-0.5 inline h-3 w-3" />{f.demand}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageBody>
    </>
  );
}
