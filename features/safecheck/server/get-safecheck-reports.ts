import { createSupabaseServerClient } from "../../../server/db/supabase-server";
import {
  mapSafeCheckReportRowToReport,
  type SafeCheckReport,
  type SafeCheckReportRow,
} from "../types/report.types";

export type GetSafeCheckReportsResult =
  | {
      ok: true;
      reports: SafeCheckReport[];
      message: null;
    }
  | {
      ok: false;
      reports: [];
      message: string;
    };

export async function getSafeCheckReports(
  userId: string,
): Promise<GetSafeCheckReportsResult> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("promptlab_safecheck_reports")
    .select(
      `
      id,
      user_id,
      prompt_id,
      score,
      level,
      risk_categories,
      safe_prompt,
      policy_version,
      detector_version,
      created_at
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      reports: [],
      message: error.message,
    };
  }

  return {
    ok: true,
    reports: ((data ?? []) as SafeCheckReportRow[]).map(
      mapSafeCheckReportRowToReport,
    ),
    message: null,
  };
}
