import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createQuestion,
  createQuestions,
  createTemplate,
  deleteQuestion,
  deleteTemplate,
  getTemplate,
  listTemplates,
  reorderQuestions,
  updateQuestion,
  updateTemplate,
} from "./api/templates";
import {
  createResponse,
  deleteResponse,
  getResearchStats,
  getResponse,
  listResponses,
  listSchools,
  saveAnswer,
  submitResponse,
} from "./api/responses";

export const researchKeys = {
  all: ["research"] as const,
  templates: () => [...researchKeys.all, "templates"] as const,
  template: (id: string) => [...researchKeys.all, "template", id] as const,
  responses: () => [...researchKeys.all, "responses"] as const,
  response: (id: string) => [...researchKeys.all, "response", id] as const,
  schools: () => [...researchKeys.all, "schools"] as const,
  stats: () => [...researchKeys.all, "stats"] as const,
};

export const templatesQuery = () =>
  queryOptions({ queryKey: researchKeys.templates(), queryFn: () => listTemplates() });

export const templateQuery = (templateId: string) =>
  queryOptions({
    queryKey: researchKeys.template(templateId),
    queryFn: () => getTemplate({ data: { templateId } }),
  });

export const responsesQuery = () =>
  queryOptions({ queryKey: researchKeys.responses(), queryFn: () => listResponses() });

export const responseQuery = (responseId: string) =>
  queryOptions({
    queryKey: researchKeys.response(responseId),
    queryFn: () => getResponse({ data: { responseId } }),
  });

export const schoolsQuery = () =>
  queryOptions({ queryKey: researchKeys.schools(), queryFn: () => listSchools() });

export const statsQuery = () =>
  queryOptions({ queryKey: researchKeys.stats(), queryFn: () => getResearchStats() });

/** Invalidates every research list/detail after a mutation. */
function useInvalidateResearch() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: researchKeys.all });
}

export function useCreateTemplate() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: createTemplate, onSuccess: invalidate });
}

export function useUpdateTemplate() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: updateTemplate, onSuccess: invalidate });
}

export function useDeleteTemplate() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: deleteTemplate, onSuccess: invalidate });
}

export function useCreateQuestion() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: createQuestion, onSuccess: invalidate });
}

export function useCreateQuestions() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: createQuestions, onSuccess: invalidate });
}

export function useUpdateQuestion() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: updateQuestion, onSuccess: invalidate });
}

export function useDeleteQuestion() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: deleteQuestion, onSuccess: invalidate });
}

export function useReorderQuestions() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: reorderQuestions, onSuccess: invalidate });
}

export function useCreateResponse() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: createResponse, onSuccess: invalidate });
}

export function useSaveAnswer() {
  return useMutation({ mutationFn: saveAnswer });
}

export function useSubmitResponse() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: submitResponse, onSuccess: invalidate });
}

export function useDeleteResponse() {
  const invalidate = useInvalidateResearch();
  return useMutation({ mutationFn: deleteResponse, onSuccess: invalidate });
}
