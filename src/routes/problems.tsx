import { createFileRoute } from "@tanstack/react-router";
import { Plus, AlertTriangle, Flame, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/problems")({
  head: () => ({
    meta: [
      { title: "Problems · Inspe Research CRM" },
      { name: "description", content: "Track and prioritize operational problems discovered across schools." },
    ],
  }),
  component: ProblemsPage,
});

const problems = [
  { title: "Manual attendance takes 45min/day", dept: "Academics", severity: "High", frequency: "Daily", schools: 84, priority: 92, affected: 1240, cost: "$1,200/mo" },
  { title: "End-of-term reports take 3 weeks", dept: "Reporting", severity: "Critical", frequency: "Termly", schools: 71, priority: 95, affected: 890, cost: "$2,800/term" },
  { title: "Cash-only fee collection", dept: "Finance", severity: "High", frequency: "Monthly", schools: 63, priority: 88, affected: 1580, cost: "$4,500/mo" },
  { title: "SMS to parents costs prohibitive", dept: "Communication", severity: "Medium", frequency: "Weekly", schools: 52, priority: 74, affected: 2100, cost: "$800/mo" },
  { title: "No centralized student records", dept: "Student Records", severity: "High", frequency: "Ongoing", schools: 48, priority: 86, affected: 1810, cost: "N/A" },
  { title: "Library book tracking on paper", dept: "Library", severity: "Low", frequency: "Weekly", schools: 28, priority: 42, affected: 620, cost: "N/A" },
];

const severityStyles: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  High: "bg-accent/20 text-accent-foreground border-accent/30",
  Medium: "bg-cream text-cream-foreground border-cream",
  Low: "bg-muted text-muted-foreground border-border",
};

function ProblemsPage() {
  return (
    <>
      <PageHeader
        title="Problem Discovery"
        description="412 problems captured · Priority scored by severity, frequency, and reach."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Problems" }]}
        actions={
          <Button><Plus className="mr-2 h-4 w-4" />Log problem</Button>
        }
      />
      <PageBody className="space-y-4">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All problems</TabsTrigger>
            <TabsTrigger value="top">Top priority</TabsTrigger>
            <TabsTrigger value="dept">By department</TabsTrigger>
            <TabsTrigger value="region">By region</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-3">
          {problems.map((p) => (
            <Card key={p.title} className="shadow-none transition hover:border-primary/30">
              <CardContent className="p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{p.dept}</Badge>
                      <Badge variant="outline" className={severityStyles[p.severity] + " border"}>
                        <AlertTriangle className="mr-1 h-3 w-3" />{p.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{p.frequency}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-foreground">{p.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" />{p.schools} schools</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{p.affected.toLocaleString()} affected</span>
                      <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" />{p.cost}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:flex-col md:items-end">
                    <div className="text-right">
                      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Priority</div>
                      <div className="flex items-center gap-1 text-2xl font-bold text-primary tabular-nums">
                        <Flame className="h-5 w-5 text-accent" />{p.priority}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageBody>
    </>
  );
}
