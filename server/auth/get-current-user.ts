import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "../db/supabase-server";

export type CurrentUserResult =
  | {
      ok: true;
      user: User;
      message: null;
    }
  | {
      ok: false;
      user: null;
      message: string;
    };

export async function getCurrentUser(): Promise<CurrentUserResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      user: null,
      message: "로그인이 필요합니다.",
    };
  }

  return {
    ok: true,
    user,
    message: null,
  };
}

export function hasCurrentUser(result: CurrentUserResult): result is {
  ok: true;
  user: User;
  message: null;
} {
  return result.ok;
}
