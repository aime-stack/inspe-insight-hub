import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ClipboardList,
  FileQuestion,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageHeader, PageBody, EmptyState } from "@/components/page-header";
import {
  AddQuestionsDialog,
  EditQuestionDialog,
  QUESTION_TYPE_LABELS,
  QuestionField,
  ResearchPagePending,
  SectionMobileSelect,
  SectionSidebarNav,
  SectionStepper,
  countAnswered,
  groupBySection,
  templateQuery,
  useDeleteQuestion,
  useDeleteTemplate,
  useReorderQuestions,
  useUpdateTemplate,
  type AnswerValue,
  type Question,
} from "@/features/research";

export const Route = createFileRoute("/research/templates/$templateId")({
  head: () => ({
    meta: [{ title: "Template designer · Inspe Research CRM" }],
  }),
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(templateQuery(params.templateId));
  },
  component: TemplateDesignerPage,
  pendingComponent: ResearchPagePending,
  errorComponent: TemplateErrorComponent,
});

function TemplateErrorComponent({ error }: { error: Error }) {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        title="Template"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Research", to: "/research" },
        ]}
      />
      <PageBody>
        <EmptyState
          icon={FileQuestion}
          title="This template isn't available"
          description={
            error.message === "Template not found"
              ? "It may have been deleted, or the link is out of date."
              : error.message
          }
          actionLabel="Back to Research"
          onAction={() => navigate({ to: "/research" })}
        />
      </PageBody>
    </>
  );
}

function TemplateDesignerPage() {
  const { templateId } = Route.useParams();
  const navigate = useNavigate();
  const { data: template } = useSuspenseQuery(templateQuery(templateId));

  const sections = useMemo(() => groupBySection(template.questions), [template.questions]);
  const sectionNames = sections.map((s) => s.name);

  const [editOpen, setEditOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addSection, setAddSection] = useState<string | undefined>();

  const deleteTemplate = useDeleteTemplate();
  const deleteQuestion = useDeleteQuestion();
  const reorderQuestions = useReorderQuestions();

  const openEditDialog = (question: Question) => {
    setEditingQuestion(question);
    setEditOpen(true);
  };

  const openAddDialog = (section?: string) => {
    setAddSection(section);
    setAddOpen(true);
  };

  const moveQuestion = (question: Question, direction: -1 | 1) => {
    const section = sections.find((s) => s.name === question.section);
    if (!section) return;
    const idx = section.questions.findIndex((q) => q.id === question.id);
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= section.questions.length) return;

    const reordered = sections.map((s) => {
      if (s.name !== section.name) return s.questions;
      const copy = [...s.questions];
      [copy[idx], copy[targetIdx]] = [copy[targetIdx], copy[idx]];
      return copy;
    });
    reorderQuestions.mutate(
      { data: { templateId, orderedIds: reordered.flat().map((q) => q.id) } },
      { onError: () => toast.error("Failed to reorder questions") },
    );
  };

  return (
    <>
      <PageHeader
        title={template.name}
        description={`Template designer · ${template.questionCount} questions in ${template.sectionCount} sections`}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Research", to: "/research" },
          { label: template.name },
        ]}
        actions={
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this template?</AlertDialogTitle>
                  <AlertDialogDescription>
                    "{template.name}" and its {template.questionCount} questions will be deleted.
                    Questionnaires already filled with it keep their answers but lose the template
                    link.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteTemplate.mutate(
                        { data: { templateId } },
                        {
                          onSuccess: () => {
                            toast.success("Template deleted");
                            navigate({ to: "/research" });
                          },
                          onError: () => toast.error("Failed to delete template"),
                        },
                      )
                    }
                  >
                    Delete template
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={() => openAddDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add question
            </Button>
          </>
        }
      />
      <PageBody>
        <Tabs defaultValue="build" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="build">Build</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TemplateMetaFields
              templateId={templateId}
              name={template.name}
              description={template.description}
            />
          </div>

          <TabsContent value="build" className="space-y-6">
            {sections.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No questions yet"
                description="Add your first question — sections are created automatically from the section name you type."
                actionLabel="Add question"
                onAction={() => openAddDialog()}
              />
            ) : (
              sections.map((section) => (
                <Card key={section.name} className="shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{section.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{section.questions.length} questions</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openAddDialog(section.name)}
                        >
                          <Plus className="mr-1.5 h-3.5 w-3.5" />
                          Add
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <ul className="space-y-1">
                      {section.questions.map((q, i) => (
                        <li
                          key={q.id}
                          className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
                        >
                          <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                            {i + 1}.
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm">{q.questionText}</span>
                          {q.required && (
                            <Badge variant="outline" className="shrink-0 text-xs">
                              Required
                            </Badge>
                          )}
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            {QUESTION_TYPE_LABELS[q.questionType]}
                          </Badge>
                          <span className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              disabled={i === 0 || reorderQuestions.isPending}
                              onClick={() => moveQuestion(q, -1)}
                              aria-label="Move question up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              disabled={
                                i === section.questions.length - 1 || reorderQuestions.isPending
                              }
                              onClick={() => moveQuestion(q, 1)}
                              aria-label="Move question down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => openEditDialog(q)}
                              aria-label="Edit question"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() =>
                                deleteQuestion.mutate(
                                  { data: { questionId: q.id } },
                                  {
                                    onSuccess: () => toast.success("Question deleted"),
                                    onError: () => toast.error("Failed to delete question"),
                                  },
                                )
                              }
                              aria-label="Delete question"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="preview">
            <TemplatePreview questions={template.questions} />
          </TabsContent>
        </Tabs>
      </PageBody>

      <EditQuestionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        sections={sectionNames}
        question={editingQuestion}
      />
      <AddQuestionsDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        templateId={templateId}
        sections={sectionNames}
        defaultSection={addSection}
      />
    </>
  );
}

function TemplateMetaFields({
  templateId,
  name,
  description,
}: {
  templateId: string;
  name: string;
  description: string | null;
}) {
  const [draftName, setDraftName] = useState(name);
  const [draftDescription, setDraftDescription] = useState(description ?? "");
  const updateTemplate = useUpdateTemplate();
  const dirty = draftName !== name || draftDescription !== (description ?? "");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Label htmlFor="meta-name" className="sr-only">
        Template name
      </Label>
      <Input
        id="meta-name"
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        placeholder="Template name"
        className="h-9 w-40 sm:w-48"
      />
      <Label htmlFor="meta-desc" className="sr-only">
        Description
      </Label>
      <Input
        id="meta-desc"
        value={draftDescription}
        onChange={(e) => setDraftDescription(e.target.value)}
        placeholder="Description (optional)"
        className="h-9 w-48 sm:w-64"
      />
      {dirty && (
        <Button
          size="sm"
          disabled={updateTemplate.isPending || !draftName.trim()}
          onClick={() =>
            updateTemplate.mutate(
              {
                data: {
                  templateId,
                  name: draftName.trim(),
                  description: draftDescription.trim() || null,
                },
              },
              {
                onSuccess: () => toast.success("Template details saved"),
                onError: () => toast.error("Failed to save template details"),
              },
            )
          }
        >
          {updateTemplate.isPending ? "Saving…" : "Save"}
        </Button>
      )}
    </div>
  );
}

/** Interactive preview of the questionnaire — answers stay local, nothing is saved. */
function TemplatePreview({ questions }: { questions: Question[] }) {
  const [values, setValues] = useState<Record<string, AnswerValue>>({});
  const sections = useMemo(() => groupBySection(questions), [questions]);
  const [activeSection, setActiveSection] = useState(sections[0]?.name ?? "");

  const activeSectionGroup = sections.find((s) => s.name === activeSection) ?? sections[0];
  const navItems = sections.map((s) => ({
    name: s.name,
    total: s.questions.length,
    done: countAnswered(s.questions, values),
  }));

  if (questions.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Nothing to preview"
        description="Add questions in the Build tab to see how the questionnaire will look."
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        This is how field researchers will see the questionnaire. Answers here are not saved.
      </p>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <SectionSidebarNav
          sections={navItems}
          active={activeSectionGroup?.name ?? ""}
          onSelect={setActiveSection}
        />

        <div className="space-y-4">
          <SectionMobileSelect
            sections={navItems}
            active={activeSectionGroup?.name ?? ""}
            onSelect={setActiveSection}
          />

          {activeSectionGroup && (
            <Card className="shadow-none">
              <CardContent className="space-y-5 p-5">
                <h3 className="font-semibold text-foreground">{activeSectionGroup.name}</h3>
                {activeSectionGroup.questions.map((q) => (
                  <QuestionField
                    key={q.id}
                    question={q}
                    value={values[q.id]}
                    onChange={(value) => setValues((prev) => ({ ...prev, [q.id]: value }))}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          <SectionStepper
            sectionNames={sections.map((s) => s.name)}
            current={activeSectionGroup?.name ?? ""}
            onNavigate={setActiveSection}
          />
        </div>
      </div>
    </div>
  );
}
