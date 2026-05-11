export const PROMPT_VISIBILITY = {
  PRIVATE: "private",
  PUBLIC: "public",
} as const;

export const PROMPT_VISIBILITY_VALUES = [
  PROMPT_VISIBILITY.PRIVATE,
  PROMPT_VISIBILITY.PUBLIC,
] as const;

export type PromptVisibility =
  (typeof PROMPT_VISIBILITY_VALUES)[number];
