import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ClipboardList, FilePlus2, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageBody, EmptyState } from "@/components/page-header";
import {
  NewQuestionnaireDialog,
  NewTemplateDialog,
  ResearchPagePending,
  ResponseCard,
  TemplateCard,
  responsesQuery,
  statsQuery,
  templatesQuery,
} from "@/features/research";

export const Route = createFileRoute("/research/")({
  head: () => ({
    meta: [
      { title: "Research questionnaires · Inspe Research CRM" },
      {
        name: "description",
        content: "Design questionnaire templates and run multi-section school research.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(statsQuery()),
      context.queryClient.ensureQueryData(responsesQuery()),
      context.queryClient.ensureQueryData(templatesQuery()),
    ]);
  },
  component: ResearchPage,
  pendingComponent: ResearchPagePending,
});

function ResearchPage() {
  const { data: stats } = useSuspenseQuery(statsQuery());
  const { data: responses } = useSuspenseQuery(responsesQuery());
  const { data: templates } = useSuspenseQuery(templatesQuery());

  const [newQuestionnaireOpen, setNewQuestionnaireOpen] = useState(false);
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);
  const [useTemplateId, setUseTemplateId] = useState<string | undefined>();

  const drafts = responses.filter((r) => r.status === "draft");
  const submitted = responses.filter((r) => r.status === "submitted");

  const statItems = [
    { label: "Templates", value: stats.templates },
    { label: "Drafts in progress", value: stats.drafts },
    { label: "Submitted", value: stats.submitted },
    { label: "Schools covered", value: stats.schoolsCovered },
  ];

  return (
    <>
      <PageHeader
        title="Research Questionnaires"
        description="Design templates and capture multi-section research for each school."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Research" }]}
        actions={
          <>
            <Button variant="outline" onClick={() => setNewTemplateOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              New template
            </Button>
            <Button onClick={() => setNewQuestionnaireOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New questionnaire
            </Button>
          </>
        }
      />
      <PageBody className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((s) => (
            <Card key={s.label} className="shadow-none">
              <CardContent className="p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                  {s.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">In progress</h2>
          {drafts.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No drafts in progress"
              description="Start a new questionnaire to begin researching a school."
              actionLabel="New questionnaire"
              onAction={() => setNewQuestionnaireOpen(true)}
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {drafts.map((r) => (
                <ResponseCard key={r.id} response={r} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Templates</h2>
          {templates.length === 0 ? (
            <EmptyState
              icon={FilePlus2}
              title="No templates yet"
              description="Create your first questionnaire template to standardize school research."
              actionLabel="New template"
              onAction={() => setNewTemplateOpen(true)}
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {templates.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  onUse={(id) => {
                    setUseTemplateId(id);
                    setNewQuestionnaireOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {submitted.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Submitted</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {submitted.map((r) => (
                <ResponseCard key={r.id} response={r} />
              ))}
            </div>
          </section>
        )}
      </PageBody>

      <NewQuestionnaireDialog
        open={newQuestionnaireOpen}
        onOpenChange={(open) => {
          setNewQuestionnaireOpen(open);
          if (!open) setUseTemplateId(undefined);
        }}
        defaultTemplateId={useTemplateId}
      />
      <NewTemplateDialog open={newTemplateOpen} onOpenChange={setNewTemplateOpen} />
    </>
  );
}
