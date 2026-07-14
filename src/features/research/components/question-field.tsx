import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnswerValue, Question } from "../types";

interface QuestionFieldProps {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  disabled?: boolean;
}

/**
 * Renders the right input for a question type. Reused by the questionnaire
 * fill form and the template designer preview.
 */
export function QuestionField({ question, value, onChange, disabled }: QuestionFieldProps) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="leading-snug">
        {question.questionText}
        {question.required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      <QuestionInput
        id={id}
        question={question}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

function QuestionInput({
  id,
  question,
  value,
  onChange,
  disabled,
}: QuestionFieldProps & { id: string }) {
  switch (question.questionType) {
    case "text":
      return (
        <Textarea
          id={id}
          rows={2}
          disabled={disabled}
          placeholder="Type an answer…"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "number":
      return (
        <Input
          id={id}
          type="number"
          disabled={disabled}
          placeholder="0"
          className="max-w-48"
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );

    case "boolean":
      return (
        <RadioGroup
          disabled={disabled}
          className="flex gap-6 pt-1"
          value={value === true ? "yes" : value === false ? "no" : ""}
          onValueChange={(v) => onChange(v === "yes")}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem id={`${id}-yes`} value="yes" />
            <Label htmlFor={`${id}-yes`} className="font-normal">
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id={`${id}-no`} value="no" />
            <Label htmlFor={`${id}-no`} className="font-normal">
              No
            </Label>
          </div>
        </RadioGroup>
      );

    case "select":
      return (
        <Select
          disabled={disabled}
          value={typeof value === "string" ? value : ""}
          onValueChange={(v) => onChange(v)}
        >
          <SelectTrigger id={id} className="max-w-md">
            <SelectValue placeholder="Select an option…" />
          </SelectTrigger>
          <SelectContent>
            {(question.options ?? []).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "multiselect": {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2 pt-1">
          {(question.options ?? []).map((opt) => (
            <div key={opt} className="flex items-center gap-2">
              <Checkbox
                id={`${id}-${opt}`}
                disabled={disabled}
                checked={selected.includes(opt)}
                onCheckedChange={(checked) =>
                  onChange(checked ? [...selected, opt] : selected.filter((s) => s !== opt))
                }
              />
              <Label htmlFor={`${id}-${opt}`} className="font-normal">
                {opt}
              </Label>
            </div>
          ))}
        </div>
      );
    }
  }
}
