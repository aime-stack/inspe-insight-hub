import { useEffect, useState } from "react";
import { Check, ListPlus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCreateQuestions } from "../queries";
import { QUESTION_TYPE_LABELS, QUESTION_TYPES, type QuestionType } from "../types";

const OPTION_TYPES: QuestionType[] = ["select", "multiselect"];

interface DraftQuestion {
  id: string;
  questionText: string;
  questionType: QuestionType;
  required: boolean;
  optionsText: string;
}

function emptyDraft(): DraftQuestion {
  return {
    id: crypto.randomUUID(),
    questionText: "",
    questionType: "text",
    required: false,
    optionsText: "",
  };
}

interface AddQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string;
  /** Existing section names in this template, shown in the sidebar. */
  sections: string[];
  /** Section pre-selected when the dialog opens. */
  defaultSection?: string;
}

/**
 * Bulk question composer: pick or create a section in the left sidebar,
 * then stage as many questions as needed and save them together in one
 * request. Editing a single existing question is handled separately by
 * EditQuestionDialog.
 */
export function AddQuestionsDialog({
  open,
  onOpenChange,
  templateId,
  sections,
  defaultSection,
}: AddQuestionsDialogProps) {
  const [localSections, setLocalSections] = useState<string[]>(sections);
  const [activeSection, setActiveSection] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [showNewSectionInput, setShowNewSectionInput] = useState(false);
  const [rows, setRows] = useState<DraftQuestion[]>([emptyDraft()]);

  const createQuestions = useCreateQuestions();

  useEffect(() => {
    if (!open) return;
    setLocalSections(sections);
    setActiveSection(defaultSection ?? sections[0] ?? "General");
    setNewSectionName("");
    setShowNewSectionInput(sections.length === 0);
    setRows([emptyDraft()]);
  }, [open, defaultSection, sections]);

  const updateRow = (id: string, patch: Partial<DraftQuestion>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const addSection = () => {
    const name = newSectionName.trim();
    if (!name) return;
    if (!localSections.includes(name)) setLocalSections((prev) => [...prev, name]);
    setActiveSection(name);
    setNewSectionName("");
    setShowNewSectionInput(false);
  };

  const handleSave = async () => {
    const sectionName = activeSection.trim();
    if (!sectionName) {
      toast.error("Choose or create a section first");
      return;
    }
    const usable = rows.filter((r) => r.questionText.trim() !== "");
    if (usable.length === 0) {
      toast.error("Add at least one question");
      return;
    }
    for (const r of usable) {
      if (OPTION_TYPES.includes(r.questionType)) {
        const count = r.optionsText.split("\n").filter((o) => o.trim() !== "").length;
        if (count < 2) {
          toast.error(`"${r.questionText.trim().slice(0, 50)}" needs at least 2 options`);
          return;
        }
      }
    }

    const payload = usable.map((r) => ({
      section: sectionName,
      questionText: r.questionText.trim(),
      questionType: r.questionType,
      required: r.required,
      options: OPTION_TYPES.includes(r.questionType)
        ? r.optionsText
            .split("\n")
            .map((o) => o.trim())
            .filter(Boolean)
        : null,
    }));

    try {
      await createQuestions.mutateAsync({ data: { templateId, questions: payload } });
      toast.success(
        `${payload.length} question${payload.length > 1 ? "s" : ""} added to ${sectionName}`,
      );
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add questions");
    }
  };

  const validRowCount = rows.filter((r) => r.questionText.trim() !== "").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-h-[720px] flex-col gap-0 p-0 sm:max-w-4xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <ListPlus className="h-5 w-5 text-primary" />
            Add questions
          </DialogTitle>
          <DialogDescription>
            Pick a section, then stage as many questions as you need — they all save together.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)]">
          {/* Section sidebar */}
          <aside className="flex min-h-0 flex-col border-r bg-muted/30 p-3">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sections
            </div>
            <div className="flex-1 space-y-0.5 overflow-y-auto">
              {localSections.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setActiveSection(name)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition",
                    name === activeSection
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span className="truncate">{name}</span>
                  {name === activeSection && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="mt-2 border-t pt-2">
              {showNewSectionInput ? (
                <div className="space-y-1.5">
                  <Input
                    autoFocus
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSection();
                      }
                      if (e.key === "Escape") setShowNewSectionInput(false);
                    }}
                    placeholder="New section name"
                    className="h-8 text-sm"
                  />
                  <div className="flex gap-1.5">
                    <Button size="sm" className="h-7 flex-1 text-xs" onClick={addSection}>
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => setShowNewSectionInput(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-1.5 text-xs text-muted-foreground"
                  onClick={() => setShowNewSectionInput(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  New section
                </Button>
              )}
            </div>
          </aside>

          {/* Question rows */}
          <div className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between border-b px-6 py-3">
              <div className="text-sm">
                Adding to{" "}
                <span className="font-semibold text-foreground">{activeSection || "…"}</span>
              </div>
              <Badge variant="outline">
                {validRowCount} question{validRowCount === 1 ? "" : "s"}
              </Badge>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
              {rows.map((row, i) => (
                <QuestionRow
                  key={row.id}
                  index={i}
                  row={row}
                  onChange={(patch) => updateRow(row.id, patch)}
                  onRemove={rows.length > 1 ? () => removeRow(row.id) : undefined}
                />
              ))}

              <button
                type="button"
                onClick={() => setRows((prev) => [...prev, emptyDraft()])}
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed py-2.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <Plus className="h-4 w-4" />
                Add another question
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createQuestions.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createQuestions.isPending || validRowCount === 0}>
            {createQuestions.isPending
              ? "Saving…"
              : `Add ${validRowCount || ""} question${validRowCount === 1 ? "" : "s"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function QuestionRow({
  index,
  row,
  onChange,
  onRemove,
}: {
  index: number;
  row: DraftQuestion;
  onChange: (patch: Partial<DraftQuestion>) => void;
  onRemove?: () => void;
}) {
  const needsOptions = OPTION_TYPES.includes(row.questionType);

  return (
    <div className="space-y-3 rounded-lg border bg-background p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Question {index + 1}</span>
        {onRemove && (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            aria-label="Remove question"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <Textarea
        rows={2}
        value={row.questionText}
        onChange={(e) => onChange({ questionText: e.target.value })}
        placeholder="What do you want to ask?"
      />

      <div className="grid grid-cols-2 items-end gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Answer type</Label>
          <Select
            value={row.questionType}
            onValueChange={(v) => onChange({ questionType: v as QuestionType })}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {QUESTION_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 pb-1.5">
          <Switch
            id={`required-${row.id}`}
            checked={row.required}
            onCheckedChange={(v) => onChange({ required: v })}
          />
          <Label htmlFor={`required-${row.id}`} className="font-normal text-sm">
            Required
          </Label>
        </div>
      </div>

      {needsOptions && (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Options (one per line)</Label>
          <Textarea
            rows={3}
            value={row.optionsText}
            onChange={(e) => onChange({ optionsText: e.target.value })}
            placeholder={"Option A\nOption B"}
          />
        </div>
      )}
    </div>
  );
}
