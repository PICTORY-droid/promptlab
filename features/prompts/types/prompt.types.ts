import type { PromptStatus } from "../constants/prompt-status";
import type { PromptVisibility } from "../constants/prompt-visibility";

export type PromptVariable = {
  name: string;
  description?: string;
  required?: boolean;
};

export type Prompt = {
  id: string;
  userId: string;
  categoryId: string | null;
  categoryName: string | null;
  title: string;
  useCase: string | null;
  promptBody: string;
  variables: PromptVariable[];
  exampleInput: string | null;
  exampleOutput: string | null;
  safetyNotes: string | null;
  visibility: PromptVisibility;
  status: PromptStatus;
  createdAt: string;
  updatedAt: string;
};

export type PromptCreateInput = {
  categoryId?: string | null;
  title: string;
  useCase?: string | null;
  promptBody: string;
  variables?: PromptVariable[];
  exampleInput?: string | null;
  exampleOutput?: string | null;
  safetyNotes?: string | null;
  visibility?: PromptVisibility;
  status?: PromptStatus;
};

export type PromptUpdateInput = Partial<PromptCreateInput>;

export type PromptCategoryJoinRow =
  | {
      name: string | null;
    }
  | {
      name: string | null;
    }[]
  | null;

export type PromptRow = {
  id: string;
  user_id: string;
  category_id: string | null;
  promptlab_categories?: PromptCategoryJoinRow;
  title: string;
  use_case: string | null;
  prompt_body: string;
  variables: PromptVariable[];
  example_input: string | null;
  example_output: string | null;
  safety_notes: string | null;
  visibility: PromptVisibility;
  status: PromptStatus;
  created_at: string;
  updated_at: string;
};

function getCategoryName(category: PromptCategoryJoinRow | undefined) {
  if (!category) {
    return null;
  }

  if (Array.isArray(category)) {
    return category[0]?.name ?? null;
  }

  return category.name ?? null;
}

export function mapPromptRowToPrompt(row: PromptRow): Prompt {
  return {
    id: row.id,
    userId: row.user_id,
    categoryId: row.category_id,
    categoryName: getCategoryName(row.promptlab_categories),
    title: row.title,
    useCase: row.use_case,
    promptBody: row.prompt_body,
    variables: row.variables,
    exampleInput: row.example_input,
    exampleOutput: row.example_output,
    safetyNotes: row.safety_notes,
    visibility: row.visibility,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
