import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTemplate } from "../queries";

interface NewTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Creates a template, then opens the designer to add questions. */
export function NewTemplateDialog({ open, onOpenChange }: NewTemplateDialogProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createTemplate = useCreateTemplate();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Template name is required");
      return;
    }
    try {
      const { id } = await createTemplate.mutateAsync({
        data: { name: name.trim(), description: description.trim() || undefined },
      });
      onOpenChange(false);
      setName("");
      setDescription("");
      toast.success("Template created — now add questions");
      navigate({ to: "/research/templates/$templateId", params: { templateId: id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create template");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New template</DialogTitle>
          <DialogDescription>
            Name the questionnaire template, then design its sections and questions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="t-name">Name</Label>
            <Input
              id="t-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ICT infrastructure audit"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t-desc">Description (optional)</Label>
            <Textarea
              id="t-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this questionnaire covers"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={createTemplate.isPending || !name.trim()}>
            {createTemplate.isPending ? "Creating…" : "Create & design"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
