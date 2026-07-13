import { createFileRoute } from "@tanstack/react-router";
import { Plus, ClipboardList, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader, PageBody } from "@/components/page-header";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research questionnaires · Inspe Research CRM" },
      { name: "description", content: "Multi-section research questionnaires covering academics, finance, ICT, and more." },
    ],
  }),
  component: ResearchPage,
});

const sections = [
  { name: "School Profile", questions: 12, done: 12 },
  { name: "Administration", questions: 18, done: 14 },
  { name: "Academics", questions: 22, done: 20 },
  { name: "Finance", questions: 16, done: 9 },
  { name: "Student Records", questions: 14, done: 11 },
  { name: "Attendance", questions: 10, done: 10 },
  { name: "Communication", questions: 8, done: 6 },
  { name: "ICT Infrastructure", questions: 20, done: 15 },
  { name: "Parent Engagement", questions: 9, done: 4 },
  { name: "Reporting", questions: 11, done: 8 },
  { name: "Procurement", questions: 7, done: 0 },
  { name: "Library", questions: 6, done: 3 },
  { name: "Human Resources", questions: 13, done: 5 },
];

const templates = [
  { name: "Baseline discovery — Public school", questions: 156, uses: 82 },
  { name: "Private school deep-dive", questions: 194, uses: 41 },
  { name: "ICT infrastructure audit", questions: 68, uses: 118 },
  { name: "Finance & accounting workflow", questions: 74, uses: 63 },
];

function ResearchPage() {
  return (
    <>
      <PageHeader
        title="Research Questionnaires"
        description="Dynamic multi-step forms that adapt to each school context."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Research" }]}
        actions={
          <>
            <Button variant="outline"><FileText className="mr-2 h-4 w-4" />Templates</Button>
            <Button><Plus className="mr-2 h-4 w-4" />New questionnaire</Button>
          </>
        }
      />
      <PageBody className="space-y-6">
        <Card className="shadow-none bg-cream/30 border-cream">
          <CardContent className="p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Currently editing</div>
                <div className="mt-1 truncate text-lg font-semibold text-foreground">GS Kacyiru II — Baseline Discovery</div>
                <div className="mt-1 text-sm text-muted-foreground">Draft autosaved 2 minutes ago · 117 of 166 questions answered</div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="hidden text-right sm:block">
                  <div className="text-xs text-muted-foreground">Progress</div>
                  <div className="text-lg font-semibold tabular-nums text-primary">70%</div>
                </div>
                <Button>Resume</Button>
              </div>
            </div>
            <Progress value={70} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Sections</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => {
              const pct = Math.round((s.done / s.questions) * 100);
              const complete = pct === 100;
              return (
                <Card key={s.name} className="shadow-none transition hover:border-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <ClipboardList className="h-4 w-4 shrink-0 text-primary" />
                        <div className="truncate font-medium">{s.name}</div>
                      </div>
                      {complete ? (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          <CheckCircle2 className="mr-1 h-3 w-3" />Done
                        </Badge>
                      ) : (
                        <Badge variant="outline">{pct}%</Badge>
                      )}
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">{s.done} / {s.questions} answered</div>
                    <Progress value={pct} className="mt-2 h-1.5" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Templates</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {templates.map((t) => (
              <Card key={t.name} className="shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  <CardDescription>{t.questions} questions · used in {t.uses} visits</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2 pt-0">
                  <Button size="sm">Use template</Button>
                  <Button size="sm" variant="outline">Preview</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageBody>
    </>
  );
}
