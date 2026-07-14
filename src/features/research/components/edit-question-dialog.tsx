import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { useUpdateQuestion } from "../queries";
import { QUESTION_TYPE_LABELS, QUESTION_TYPES, type Question, type QuestionType } from "../types";

const OPTION_TYPES: QuestionType[] = ["select", "multiselect"];

interface EditQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Existing sections, offered as quick picks if the question is moved. */
  sections: string[];
  question: Question | null;
}

/** Edits a single existing question. For adding questions, see AddQuestionsDialog. */
export function EditQuestionDialog({
  open,
  onOpenChange,
  sections,
  question,
}: EditQuestionDialogProps) {
  const [section, setSection] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState<QuestionType>("text");
  const [required, setRequired] = useState(false);
  const [optionsText, setOptionsText] = useState("");

  const updateQuestion = useUpdateQuestion();

  useEffect(() => {
    if (!open || !question) return;
    setSection(question.section);
    setText(question.questionText);
    setType(question.questionType);
    setRequired(question.required);
    setOptionsText((question.options ?? []).join("\n"));
  }, [open, question]);

  const needsOptions = OPTION_TYPES.includes(type);
  const options = optionsText
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean);

  const handleSave = async () => {
    if (!question) return;
    if (!section.trim() || !text.trim()) {
      toast.error("Section and question text are required");
      return;
    }
    if (needsOptions && options.length < 2) {
      toast.error("Choice questions need at least 2 options");
      return;
    }
    try {
      await updateQuestion.mutateAsync({
        data: {
          questionId: question.id,
          section: section.trim(),
          questionText: text.trim(),
          questionType: type,
          required,
          options: needsOptions ? options : null,
        },
      });
      toast.success("Question updated");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save question");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit question</DialogTitle>
          <DialogDescription>
            Changes apply to future and in-progress questionnaires.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eq-section">Section</Label>
            <Input
              id="eq-section"
              list="eq-section-list"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g. Academics"
            />
            <datalist id="eq-section-list">
              {sections.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eq-text">Question</Label>
            <Textarea
              id="eq-text"
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you want to ask?"
            />
          </div>

          <div className="grid grid-cols-2 items-end gap-4">
            <div className="space-y-2">
              <Label>Answer type</Label>
              <Select value={type} onValueChange={(v) => setType(v as QuestionType)}>
                <SelectTrigger>
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
            <div className="flex items-center gap-2 pb-2">
              <Switch id="eq-required" checked={required} onCheckedChange={setRequired} />
              <Label htmlFor="eq-required" className="font-normal">
                Required
              </Label>
            </div>
          </div>

          {needsOptions && (
            <div className="space-y-2">
              <Label htmlFor="eq-options">Options (one per line)</Label>
              <Textarea
                id="eq-options"
                rows={4}
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                placeholder={"Option A\nOption B"}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateQuestion.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateQuestion.isPending}>
            {updateQuestion.isPending ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
