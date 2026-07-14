import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Check, CheckCircle2, CloudUpload, FileQuestion, Send } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader, PageBody, EmptyState } from "@/components/page-header";
import {
  QuestionField,
  ResearchPagePending,
  SectionMobileSelect,
  SectionSidebarNav,
  SectionStepper,
  countAnswered,
  groupBySection,
  isDiscreteAnswerType,
  missingRequired,
  progressPct,
  researchKeys,
  responseQuery,
  useSaveAnswer,
  useSubmitResponse,
  type AnswerValue,
} from "@/features/research";

export const Route = createFileRoute("/research/$responseId")({
  head: () => ({
    meta: [{ title: "Fill questionnaire · Inspe Research CRM" }],
  }),
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(responseQuery(params.responseId));
  },
  component: FillQuestionnairePage,
  pendingComponent: ResearchPagePending,
  errorComponent: ResponseErrorComponent,
});

function ResponseErrorComponent({ error }: { error: Error }) {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        title="Questionnaire"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Research", to: "/research" },
        ]}
      />
      <PageBody>
        <EmptyState
          icon={FileQuestion}
          title="This questionnaire isn't available"
          description={
            error.message === "Questionnaire not found"
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

// Only text/number answers get debounced (the user is still typing); a
// short delay keeps saves fast without spamming a request per keystroke.
const AUTOSAVE_DELAY_MS = 400;

function FillQuestionnairePage() {
  const { responseId } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: response } = useSuspenseQuery(responseQuery(responseId));

  const sections = useMemo(() => groupBySection(response.questions), [response.questions]);
  const [activeSection, setActiveSection] = useState(sections[0]?.name ?? "");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(response.answers);
  const [submitting, setSubmitting] = useState(false);

  // Debounce timers (text/number only) and the promise for each in-flight
  // save, keyed by question id, so Submit can flush and await everything
  // instead of just hoping the debounce window has already closed.
  const timers = useRef(
    new Map<string, { timeout: ReturnType<typeof setTimeout>; run: () => void }>(),
  );
  const inFlight = useRef(new Map<string, Promise<boolean>>());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const saveAnswer = useSaveAnswer();
  const submitResponse = useSubmitResponse();

  const readOnly = response.status === "submitted";

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(({ timeout }) => clearTimeout(timeout));
  }, []);

  const markPending = (id: string) =>
    setPendingIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  const clearPendingId = (id: string) =>
    setPendingIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const commitSave = (questionId: string, value: AnswerValue): Promise<boolean> => {
    const promise = saveAnswer
      .mutateAsync({ data: { responseId, questionId, value } })
      .then(() => true)
      .catch(() => {
        toast.error("Failed to save an answer — check your connection");
        return false;
      })
      .finally(() => {
        clearPendingId(questionId);
        inFlight.current.delete(questionId);
      });
    inFlight.current.set(questionId, promise);
    return promise;
  };

  const handleChange = (questionId: string, value: AnswerValue, immediate: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    markPending(questionId);

    const existing = timers.current.get(questionId);
    if (existing) clearTimeout(existing.timeout);

    const run = () => {
      timers.current.delete(questionId);
      commitSave(questionId, value);
    };

    if (immediate) {
      run();
    } else {
      timers.current.set(questionId, { timeout: setTimeout(run, AUTOSAVE_DELAY_MS), run });
    }
  };

  /** Fires any still-debounced saves right away and waits for everything in flight. */
  const flushPendingSaves = async (): Promise<boolean> => {
    for (const { timeout, run } of timers.current.values()) {
      clearTimeout(timeout);
      run();
    }
    const results = await Promise.all(inFlight.current.values());
    return results.every(Boolean);
  };

  const answeredCount = countAnswered(response.questions, answers);
  const totalCount = response.questions.length;
  const pct = progressPct(answeredCount, totalCount);
  const missing = missingRequired(response.questions, answers);
  const saving = pendingIds.size > 0;

  const handleSubmit = async () => {
    if (missing.length > 0) {
      setActiveSection(missing[0].section);
      toast.error(`${missing.length} required question(s) still unanswered`);
      return;
    }
    setSubmitting(true);
    const allSaved = await flushPendingSaves();
    if (!allSaved) {
      setSubmitting(false);
      toast.error("Some answers failed to save — please retry before submitting");
      return;
    }
    submitResponse.mutate(
      { data: { responseId } },
      {
        onSuccess: () => {
          toast.success("Questionnaire submitted");
          queryClient.invalidateQueries({ queryKey: researchKeys.response(responseId) });
        },
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Failed to submit questionnaire"),
        onSettled: () => setSubmitting(false),
      },
    );
  };

  const activeSectionGroup = sections.find((s) => s.name === activeSection) ?? sections[0];
  const navItems = sections.map((s) => ({
    name: s.name,
    total: s.questions.length,
    done: countAnswered(s.questions, answers),
  }));

  return (
    <>
      <PageHeader
        title={`${response.schoolName} — ${response.templateName}`}
        description={
          readOnly
            ? `Submitted ${response.submittedAt ? new Date(response.submittedAt).toLocaleDateString() : ""}`
            : "Answers save automatically as you type."
        }
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Research", to: "/research" },
          { label: response.schoolName },
        ]}
        actions={
          readOnly ? (
            <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Submitted
            </Badge>
          ) : (
            <>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {saving ? (
                  <>
                    <CloudUpload className="h-3.5 w-3.5 animate-pulse" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5 text-success" />
                    Saved
                  </>
                )}
              </span>
              <Button onClick={() => void handleSubmit()} disabled={submitting}>
                <Send className="mr-2 h-4 w-4" />
                {submitting ? (submitResponse.isPending ? "Submitting…" : "Saving…") : "Submit"}
              </Button>
            </>
          )
        }
      />
      <PageBody>
        <Card className="mb-6 shadow-none bg-cream/30 border-cream">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                {answeredCount} of {totalCount} questions answered
                {missing.length > 0 && !readOnly && (
                  <span className="ml-2 text-destructive">
                    · {missing.length} required remaining
                  </span>
                )}
              </div>
              <div className="text-lg font-semibold tabular-nums text-primary">{pct}%</div>
            </div>
            <Progress value={pct} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <SectionSidebarNav
            sections={navItems}
            active={activeSectionGroup?.name ?? ""}
            onSelect={setActiveSection}
          />

          <div className="space-y-6">
            <SectionMobileSelect
              sections={navItems}
              active={activeSectionGroup?.name ?? ""}
              onSelect={setActiveSection}
            />

            {activeSectionGroup && (
              <Card className="shadow-none">
                <CardContent className="space-y-6 p-5">
                  <h2 className="font-semibold text-foreground">{activeSectionGroup.name}</h2>
                  {activeSectionGroup.questions.map((q) => (
                    <QuestionField
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={(value) =>
                        handleChange(q.id, value, isDiscreteAnswerType(q.questionType))
                      }
                      disabled={readOnly}
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
      </PageBody>
    </>
  );
}
