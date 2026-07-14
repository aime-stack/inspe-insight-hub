export const QUESTION_TYPES = ["text", "number", "boolean", "select", "multiselect"] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  text: "Text",
  number: "Number",
  boolean: "Yes / No",
  select: "Single choice",
  multiselect: "Multiple choice",
};

export type AnswerValue = string | number | boolean | string[] | null;

export interface Question {
  id: string;
  templateId: string;
  section: string;
  questionText: string;
  questionType: QuestionType;
  required: boolean;
  options: string[] | null;
  orderIndex: number;
}

export interface TemplateSummary {
  id: string;
  name: string;
  description: string | null;
  questionnaireType: string | null;
  version: number;
  updatedAt: string;
  questionCount: number;
  sectionCount: number;
  useCount: number;
}

export interface TemplateDetail extends TemplateSummary {
  questions: Question[];
}

export type ResponseStatus = "draft" | "submitted";

export interface ResponseSummary {
  id: string;
  schoolId: string;
  schoolName: string;
  templateId: string | null;
  templateName: string | null;
  status: ResponseStatus;
  startedAt: string;
  submittedAt: string | null;
  updatedAt: string;
  answeredCount: number;
  questionCount: number;
}

export interface ResponseDetail {
  id: string;
  schoolId: string;
  schoolName: string;
  templateId: string;
  templateName: string;
  status: ResponseStatus;
  startedAt: string;
  submittedAt: string | null;
  questions: Question[];
  /** questionId -> saved value */
  answers: Record<string, AnswerValue>;
}

export interface SchoolOption {
  id: string;
  name: string;
}

export interface ResearchStats {
  templates: number;
  drafts: number;
  submitted: number;
  schoolsCovered: number;
}
