import { z } from "zod";
import {
  PROMPT_STATUS,
  PROMPT_STATUS_VALUES,
} from "../constants/prompt-status";
import {
  PROMPT_VISIBILITY,
  PROMPT_VISIBILITY_VALUES,
} from "../constants/prompt-visibility";

export const promptVariableSchema = z.object({
  name: z.string().trim().min(1, "변수 이름을 입력하세요.").max(80),
  description: z.string().trim().max(300).optional(),
  required: z.boolean().optional(),
});

const promptBaseSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1, "제목을 입력하세요.").max(120),
  useCase: z.string().trim().max(500).nullable().optional(),
  promptBody: z.string().trim().min(1, "프롬프트 본문을 입력하세요.").max(12000),
  variables: z.array(promptVariableSchema).max(30),
  exampleInput: z.string().trim().max(6000).nullable().optional(),
  exampleOutput: z.string().trim().max(6000).nullable().optional(),
  safetyNotes: z.string().trim().max(3000).nullable().optional(),
  visibility: z.enum(PROMPT_VISIBILITY_VALUES),
  status: z.enum(PROMPT_STATUS_VALUES),
});

export const promptCreateSchema = promptBaseSchema.extend({
  variables: z.array(promptVariableSchema).max(30).default([]),
  visibility: z.enum(PROMPT_VISIBILITY_VALUES).default(PROMPT_VISIBILITY.PRIVATE),
  status: z.enum(PROMPT_STATUS_VALUES).default(PROMPT_STATUS.DRAFT),
});

export const promptUpdateSchema = promptBaseSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "수정할 값이 없습니다.",
);

export type PromptCreateSchema = z.infer<typeof promptCreateSchema>;
export type PromptUpdateSchema = z.infer<typeof promptUpdateSchema>;
