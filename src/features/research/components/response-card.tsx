import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { useDeleteResponse } from "../queries";
import { progressPct } from "../utils";
import type { ResponseSummary } from "../types";

interface ResponseCardProps {
  response: ResponseSummary;
}

export function ResponseCard({ response }: ResponseCardProps) {
  const pct = progressPct(response.answeredCount, response.questionCount);
  const isDraft = response.status === "draft";
  const deleteResponse = useDeleteResponse();

  return (
    <Card className="shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground">{response.schoolName}</div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {response.templateName ?? "No template"} · updated{" "}
              {formatDistanceToNow(new Date(response.updatedAt), { addSuffix: true })}
            </div>
          </div>
          {isDraft ? (
            <Badge variant="outline" className="shrink-0">
              {pct}%
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="shrink-0 border-success/20 bg-success/10 text-success"
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Submitted
            </Badge>
          )}
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          {response.answeredCount} / {response.questionCount} answered
        </div>
        <Progress value={pct} className="mt-2 h-1.5" />

        <div className="mt-3 flex gap-2">
          <Button size="sm" variant={isDraft ? "default" : "outline"} asChild>
            <Link to="/research/$responseId" params={{ responseId: response.id }}>
              {isDraft ? "Resume" : "View"}
            </Link>
          </Button>
          {isDraft && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                  aria-label="Discard draft"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All {response.answeredCount} saved answers for {response.schoolName} will be
                    permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteResponse.mutate(
                        { data: { responseId: response.id } },
                        {
                          onSuccess: () => toast.success("Draft discarded"),
                          onError: () => toast.error("Failed to discard draft"),
                        },
                      )
                    }
                  >
                    Discard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
