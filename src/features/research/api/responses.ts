import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sql } from "@/server/db";
import type {
  AnswerValue,
  Question,
  ResearchStats,
  ResponseDetail,
  ResponseSummary,
  SchoolOption,
} from "../types";

const answerValueSchema: z.ZodType<AnswerValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.null(),
]);

export const listResponses = createServerFn({ method: "GET" }).handler(
  async (): Promise<ResponseSummary[]> => {
    return sql<ResponseSummary[]>`
      select
        r.id,
        r.school_id,
        s.name as school_name,
        r.template_id,
        t.name as template_name,
        r.status,
        r.started_at,
        r.submitted_at,
        r.updated_at,
        (select count(*)::int from questionnaire_response_answers a where a.response_id = r.id) as answered_count,
        (select count(*)::int from questions q where q.template_id = r.template_id) as question_count
      from questionnaire_responses r
      join schools s on s.id = r.school_id
      left join question_templates t on t.id = r.template_id
      order by r.updated_at desc
    `;
  },
);

export const getResponse = createServerFn({ method: "GET" })
  .validator(z.object({ responseId: z.string().uuid() }))
  .handler(async ({ data }): Promise<ResponseDetail> => {
    const [response] = await sql<
      {
        id: string;
        schoolId: string;
        schoolName: string;
        templateId: string | null;
        templateName: string | null;
        status: "draft" | "submitted";
        startedAt: string;
        submittedAt: string | null;
      }[]
    >`
      select r.id, r.school_id, s.name as school_name, r.template_id, t.name as template_name,
             r.status, r.started_at, r.submitted_at
      from questionnaire_responses r
      join schools s on s.id = r.school_id
      left join question_templates t on t.id = r.template_id
      where r.id = ${data.responseId}
    `;
    if (!response) throw new Error("Questionnaire not found");
    if (!response.templateId || !response.templateName) {
      throw new Error("This questionnaire has no template attached");
    }

    const questions = await sql<Question[]>`
      select id, template_id, section, question_text, question_type, required, options,
             coalesce(order_index, 0)::int as order_index
      from questions
      where template_id = ${response.templateId}
      order by order_index, created_at
    `;

    const answerRows = await sql<{ questionId: string; value: AnswerValue }[]>`
      select question_id, value from questionnaire_response_answers
      where response_id = ${data.responseId}
    `;

    return {
      ...response,
      templateId: response.templateId,
      templateName: response.templateName,
      questions,
      answers: Object.fromEntries(answerRows.map((a) => [a.questionId, a.value])),
    };
  });

export const createResponse = createServerFn({ method: "POST" })
  .validator(z.object({ schoolId: z.string().uuid(), templateId: z.string().uuid() }))
  .handler(async ({ data }): Promise<{ id: string; resumed: boolean }> => {
    // One draft per school & questionnaire type (DB unique constraint) —
    // if one exists already, resume it instead of failing.
    const [existing] = await sql<{ id: string }[]>`
      select r.id
      from questionnaire_responses r
      join question_templates t on t.id = ${data.templateId}
      where r.school_id = ${data.schoolId}
        and r.status = 'draft'
        and r.questionnaire_type is not distinct from t.questionnaire_type
      limit 1
    `;
    if (existing) return { id: existing.id, resumed: true };

    const [row] = await sql<{ id: string }[]>`
      insert into questionnaire_responses (school_id, template_id, questionnaire_type, status)
      select ${data.schoolId}, t.id, t.questionnaire_type, 'draft'
      from question_templates t where t.id = ${data.templateId}
      returning id
    `;
    if (!row) throw new Error("Template not found");
    return { id: row.id, resumed: false };
  });

export const saveAnswer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      responseId: z.string().uuid(),
      questionId: z.string().uuid(),
      value: answerValueSchema,
    }),
  )
  .handler(async ({ data }) => {
    await sql`
      insert into questionnaire_response_answers (response_id, question_id, value)
      values (${data.responseId}, ${data.questionId}, ${sql.json(data.value)})
      on conflict (response_id, question_id)
      do update set value = excluded.value, updated_at = now()
    `;
    await sql`update questionnaire_responses set updated_at = now() where id = ${data.responseId}`;
  });

export const submitResponse = createServerFn({ method: "POST" })
  .validator(z.object({ responseId: z.string().uuid() }))
  .handler(async ({ data }) => {
    // Server-side guard: all required questions must be answered
    const [missing] = await sql<{ count: number }[]>`
      select count(*)::int as count
      from questions q
      join questionnaire_responses r on r.id = ${data.responseId} and q.template_id = r.template_id
      left join questionnaire_response_answers a
        on a.response_id = r.id and a.question_id = q.id
      where q.required
        and (a.value is null or a.value = 'null'::jsonb or a.value = '""'::jsonb or a.value = '[]'::jsonb)
    `;
    if (missing && missing.count > 0) {
      throw new Error(`${missing.count} required question(s) still unanswered`);
    }

    try {
      await sql`
        update questionnaire_responses
        set status = 'submitted', submitted_at = now()
        where id = ${data.responseId} and status = 'draft'
      `;
    } catch (err) {
      if (err instanceof Error && "code" in err && err.code === "23505") {
        throw new Error("This school already has a submitted questionnaire of this type");
      }
      throw err;
    }
  });

export const deleteResponse = createServerFn({ method: "POST" })
  .validator(z.object({ responseId: z.string().uuid() }))
  .handler(async ({ data }) => {
    await sql`delete from questionnaire_responses where id = ${data.responseId}`;
  });

export const listSchools = createServerFn({ method: "GET" }).handler(
  async (): Promise<SchoolOption[]> => {
    return sql<SchoolOption[]>`select id, name from schools order by name`;
  },
);

export const getResearchStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<ResearchStats> => {
    const [row] = await sql<ResearchStats[]>`
      select
        (select count(*)::int from question_templates) as templates,
        (select count(*)::int from questionnaire_responses where status = 'draft') as drafts,
        (select count(*)::int from questionnaire_responses where status = 'submitted') as submitted,
        (select count(distinct school_id)::int from questionnaire_responses) as schools_covered
    `;
    return row;
  },
);
