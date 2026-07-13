import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, School, ClipboardList, AlertTriangle, MapPin, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports · Inspe Research CRM" },
      { name: "description", content: "Generate PDF, Excel, and CSV reports across schools, visits, and problems." },
    ],
  }),
  component: ReportsPage,
});

const reports = [
  { name: "School Profile Report", desc: "Detailed report for one school", icon: School, formats: ["PDF", "DOCX"] },
  { name: "Visit Report", desc: "Field notes, evidence, and findings", icon: ClipboardList, formats: ["PDF"] },
  { name: "Research Summary", desc: "Rolled-up findings across visits", icon: FileText, formats: ["PDF", "Excel"] },
  { name: "Problem Analysis", desc: "Priority-ranked pain points", icon: AlertTriangle, formats: ["Excel", "CSV"] },
  { name: "Regional Analytics", desc: "Coverage & maturity by region", icon: MapPin, formats: ["PDF", "Excel"] },
  { name: "Executive Summary", desc: "Leadership-ready overview", icon: BarChart3, formats: ["PDF"] },
];

const recent = [
  { name: "Executive Summary — June 2026.pdf", when: "Today · 08:12", size: "1.8 MB" },
  { name: "Kigali Coverage Analytics.xlsx", when: "Yesterday", size: "428 KB" },
  { name: "Top 20 Problems (all provinces).csv", when: "2d ago", size: "36 KB" },
  { name: "GS Kacyiru II — Profile.pdf", when: "3d ago", size: "742 KB" },
];

function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Export research findings for leadership, partners, and internal review."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Reports" }]}
      />
      <PageBody className="space-y-6">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Templates</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((r) => (
              <Card key={r.name} className="shadow-none transition hover:border-primary/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-cream text-cream-foreground">
                      <r.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base">{r.name}</CardTitle>
                      <CardDescription className="text-xs">{r.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-0">
                  <div className="flex gap-1">
                    {r.formats.map((f) => (
                      <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>
                    ))}
                  </div>
                  <Button size="sm">Generate</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Recently generated</h2>
          <Card className="shadow-none">
            <CardContent className="divide-y p-0">
              {recent.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.when} · {r.size}</div>
                  </div>
                  <Button variant="ghost" size="sm"><Download className="mr-1 h-4 w-4" />Download</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
