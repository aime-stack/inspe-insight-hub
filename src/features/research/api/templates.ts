import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sql } from "@/server/db";
import { QUESTION_TYPES, type Question, type TemplateDetail, type TemplateSummary } from "../types";

const questionTypeSchema = z.enum(QUESTION_TYPES);

export const listTemplates = createServerFn({ method: "GET" }).handler(
  async (): Promise<TemplateSummary[]> => {
    return sql<TemplateSummary[]>`
      select
        t.id,
        t.name,
        t.description,
        t.questionnaire_type,
        t.version,
        t.updated_at,
        count(distinct q.id)::int as question_count,
        count(distinct q.section)::int as section_count,
        count(distinct r.id)::int as use_count
      from question_templates t
      left join questions q on q.template_id = t.id
      left join questionnaire_responses r on r.template_id = t.id
      group by t.id
      order by t.updated_at desc
    `;
  },
);

export const getTemplate = createServerFn({ method: "GET" })
  .validator(z.object({ templateId: z.string().uuid() }))
  .handler(async ({ data }): Promise<TemplateDetail> => {
    const [template] = await sql<
      Omit<TemplateSummary, "questionCount" | "sectionCount" | "useCount">[]
    >`
      select id, name, description, questionnaire_type, version, updated_at
      from question_templates where id = ${data.templateId}
    `;
    if (!template) throw new Error("Template not found");

    const questions = await sql<Question[]>`
      select id, template_id, section, question_text, question_type, required, options,
             coalesce(order_index, 0)::int as order_index
      from questions
      where template_id = ${data.templateId}
      order by order_index, created_at
    `;

    const [counts] = await sql<{ useCount: number }[]>`
      select count(*)::int as use_count from questionnaire_responses
      where template_id = ${data.templateId}
    `;

    return {
      ...template,
      questions,
      questionCount: questions.length,
      sectionCount: new Set(questions.map((q) => q.section)).size,
      useCount: counts?.useCount ?? 0,
    };
  });

export const createTemplate = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(1, "Name is required"),
      description: z.string().trim().optional(),
      questionnaireType: z.string().trim().optional(),
    }),
  )
  .handler(async ({ data }): Promise<{ id: string }> => {
    const type =
      data.questionnaireType ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
    const [row] = await sql<{ id: string }[]>`
      insert into question_templates (name, description, questionnaire_type)
      values (${data.name}, ${data.description ?? null}, ${type})
      returning id
    `;
    return row;
  });

export const updateTemplate = createServerFn({ method: "POST" })
  .validator(
    z.object({
      templateId: z.string().uuid(),
      name: z.string().trim().min(1, "Name is required"),
      description: z.string().trim().nullable().optional(),
    }),
  )
  .handler(async ({ data }) => {
    await sql`
      update question_templates
      set name = ${data.name}, description = ${data.description ?? null}
      where id = ${data.templateId}
    `;
  });

export const deleteTemplate = createServerFn({ method: "POST" })
  .validator(z.object({ templateId: z.string().uuid() }))
  .handler(async ({ data }) => {
    await sql`delete from question_templates where id = ${data.templateId}`;
  });

const questionInputSchema = z.object({
  section: z.string().trim().min(1, "Section is required"),
  questionText: z.string().trim().min(1, "Question text is required"),
  questionType: questionTypeSchema,
  required: z.boolean(),
  options: z.array(z.string().trim().min(1)).nullable(),
});

export const createQuestion = createServerFn({ method: "POST" })
  .validator(questionInputSchema.extend({ templateId: z.string().uuid() }))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const [row] = await sql<{ id: string }[]>`
      insert into questions (template_id, section, question_text, question_type, required, options, order_index)
      values (
        ${data.templateId}, ${data.section}, ${data.questionText}, ${data.questionType},
        ${data.required}, ${data.options === null ? null : sql.json(data.options)},
        (select coalesce(max(order_index), -1) + 1 from questions where template_id = ${data.templateId})
      )
      returning id
    `;
    return row;
  });

export const createQuestions = createServerFn({ method: "POST" })
  .validator(
    z.object({
      templateId: z.string().uuid(),
      questions: z.array(questionInputSchema).min(1).max(100),
    }),
  )
  .handler(async ({ data }): Promise<{ count: number }> => {
    await sql.begin(async (tx) => {
      const [row] = await tx<{ maxIndex: number }[]>`
        select coalesce(max(order_index), -1) as max_index from questions
        where template_id = ${data.templateId}
      `;
      let orderIndex = (row?.maxIndex ?? -1) + 1;
      for (const q of data.questions) {
        await tx`
          insert into questions (template_id, section, question_text, question_type, required, options, order_index)
          values (
            ${data.templateId}, ${q.section}, ${q.questionText}, ${q.questionType},
            ${q.required}, ${q.options === null ? null : tx.json(q.options)}, ${orderIndex}
          )
        `;
        orderIndex++;
      }
    });
    return { count: data.questions.length };
  });

export const updateQuestion = createServerFn({ method: "POST" })
  .validator(questionInputSchema.extend({ questionId: z.string().uuid() }))
  .handler(async ({ data }) => {
    await sql`
      update questions
      set section = ${data.section},
          question_text = ${data.questionText},
          question_type = ${data.questionType},
          required = ${data.required},
          options = ${data.options === null ? null : sql.json(data.options)}
      where id = ${data.questionId}
    `;
  });

export const deleteQuestion = createServerFn({ method: "POST" })
  .validator(z.object({ questionId: z.string().uuid() }))
  .handler(async ({ data }) => {
    await sql`delete from questions where id = ${data.questionId}`;
  });

/** Renumbers order_index for a template following the given id order. */
export const reorderQuestions = createServerFn({ method: "POST" })
  .validator(
    z.object({
      templateId: z.string().uuid(),
      orderedIds: z.array(z.string().uuid()).min(1),
    }),
  )
  .handler(async ({ data }) => {
    await sql`
      update questions as q
      set order_index = v.idx
      from (
        select unnest(${sql.array(data.orderedIds)}::uuid[]) as id,
               generate_subscripts(${sql.array(data.orderedIds)}::uuid[], 1) - 1 as idx
      ) as v
      where q.id = v.id and q.template_id = ${data.templateId}
    `;
  });
