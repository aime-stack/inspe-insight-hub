import { Link } from "@tanstack/react-router";
import { Pencil, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { humanizeType } from "../utils";
import type { TemplateSummary } from "../types";

interface TemplateCardProps {
  template: TemplateSummary;
  onUse: (templateId: string) => void;
}

export function TemplateCard({ template, onUse }: TemplateCardProps) {
  return (
    <Card className="shadow-none transition hover:border-primary/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{template.name}</CardTitle>
          <Badge variant="outline" className="shrink-0">
            {humanizeType(template.questionnaireType)}
          </Badge>
        </div>
        <CardDescription>
          {template.questionCount} questions · {template.sectionCount}{" "}
          {template.sectionCount === 1 ? "section" : "sections"} · used {template.useCount}{" "}
          {template.useCount === 1 ? "time" : "times"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2 pt-0">
        <Button size="sm" onClick={() => onUse(template.id)}>
          <Play className="mr-1.5 h-3.5 w-3.5" />
          Use template
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link to="/research/templates/$templateId" params={{ templateId: template.id }}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
