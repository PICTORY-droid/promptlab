import { createSupabaseServerClient } from "../../../server/db/supabase-server";
import {
  mapPromptCategoryRowToCategory,
  type PromptCategory,
  type PromptCategoryRow,
} from "../types/category.types";

export type GetCategoriesResult =
  | {
      ok: true;
      categories: PromptCategory[];
      message: null;
    }
  | {
      ok: false;
      categories: [];
      message: string;
    };

export async function getCategories(): Promise<GetCategoriesResult> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("promptlab_categories")
    .select("id, name, slug, description, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true });

  if (error) {
    return {
      ok: false,
      categories: [],
      message: error.message,
    };
  }

  return {
    ok: true,
    categories: ((data ?? []) as PromptCategoryRow[]).map(
      mapPromptCategoryRowToCategory,
    ),
    message: null,
  };
}
