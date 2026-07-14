import type { AnswerValue, Question, QuestionType } from "./types";

export interface SectionGroup {
  name: string;
  questions: Question[];
}

/**
 * Boolean/select/multiselect answers come from a single discrete click, not
 * continuous typing, so autosave should fire immediately rather than
 * debouncing like it does for text/number fields.
 */
export function isDiscreteAnswerType(type: QuestionType): boolean {
  return type === "boolean" || type === "select" || type === "multiselect";
}

/** Groups questions into sections, preserving question order. */
export function groupBySection(questions: Question[]): SectionGroup[] {
  const groups = new Map<string, Question[]>();
  for (const q of questions) {
    const list = groups.get(q.section);
    if (list) list.push(q);
    else groups.set(q.section, [q]);
  }
  return [...groups.entries()].map(([name, qs]) => ({ name, questions: qs }));
}

/** An answer counts as given when it isn't null/empty. */
export function isAnswered(value: AnswerValue | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true; // numbers and booleans (false is a valid answer)
}

export function countAnswered(questions: Question[], answers: Record<string, AnswerValue>): number {
  return questions.filter((q) => isAnswered(answers[q.id])).length;
}

export function progressPct(done: number, total: number): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

/** Missing required questions — blocks submission. */
export function missingRequired(
  questions: Question[],
  answers: Record<string, AnswerValue>,
): Question[] {
  return questions.filter((q) => q.required && !isAnswered(answers[q.id]));
}

/** "baseline_discovery" -> "Baseline discovery" */
export function humanizeType(type: string | null): string {
  if (!type) return "General";
  const words = type.replaceAll("_", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
