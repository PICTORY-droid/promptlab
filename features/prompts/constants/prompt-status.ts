export const PROMPT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const PROMPT_STATUS_VALUES = [
  PROMPT_STATUS.DRAFT,
  PROMPT_STATUS.PUBLISHED,
  PROMPT_STATUS.ARCHIVED,
] as const;

export type PromptStatus =
  (typeof PROMPT_STATUS_VALUES)[number];
