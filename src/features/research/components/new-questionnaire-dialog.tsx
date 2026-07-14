import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { schoolsQuery, templatesQuery, useCreateResponse } from "../queries";

interface NewQuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-selected template (e.g. when launched from a template card). */
  defaultTemplateId?: string;
}

/**
 * Starts a questionnaire: pick a school and template, creates a draft
 * response (or resumes the school's existing draft) and opens the fill form.
 */
export function NewQuestionnaireDialog({
  open,
  onOpenChange,
  defaultTemplateId,
}: NewQuestionnaireDialogProps) {
  const navigate = useNavigate();
  const [schoolId, setSchoolId] = useState("");
  const [templateId, setTemplateId] = useState(defaultTemplateId ?? "");

  useEffect(() => {
    if (open) {
      setSchoolId("");
      setTemplateId(defaultTemplateId ?? "");
    }
  }, [open, defaultTemplateId]);

  const schools = useQuery({ ...schoolsQuery(), enabled: open });
  const templates = useQuery({ ...templatesQuery(), enabled: open });
  const createResponse = useCreateResponse();

  const effectiveTemplateId = templateId || defaultTemplateId || "";

  const handleStart = async () => {
    if (!schoolId || !effectiveTemplateId) {
      toast.error("Pick a school and a template");
      return;
    }
    try {
      const { id, resumed } = await createResponse.mutateAsync({
        data: { schoolId, templateId: effectiveTemplateId },
      });
      if (resumed) toast.info("Resuming this school's existing draft");
      onOpenChange(false);
      navigate({ to: "/research/$responseId", params: { responseId: id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start questionnaire");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New questionnaire</DialogTitle>
          <DialogDescription>
            Choose the school being researched and the template to use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>School</Label>
            <Select value={schoolId} onValueChange={setSchoolId}>
              <SelectTrigger>
                <SelectValue placeholder={schools.isLoading ? "Loading…" : "Select a school"} />
              </SelectTrigger>
              <SelectContent>
                {(schools.data ?? []).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <Select value={effectiveTemplateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder={templates.isLoading ? "Loading…" : "Select a template"} />
              </SelectTrigger>
              <SelectContent>
                {(templates.data ?? []).map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.questionCount} questions)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            disabled={createResponse.isPending || !schoolId || !effectiveTemplateId}
          >
            {createResponse.isPending ? "Starting…" : "Start questionnaire"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
