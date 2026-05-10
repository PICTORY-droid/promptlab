import { describe, expect, it } from "vitest";
import { validatePublicEnv } from "../../server/env/env";

describe("PromptLab v3 environment validation", () => {
  it("returns ok when Supabase public env values are valid", () => {
    const result = validatePublicEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
    });

    expect(result.ok).toBe(true);
  });

  it("returns a clear error when Supabase public env values are missing", () => {
    const result = validatePublicEnv({});

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.message).toContain("Supabase 환경변수");
      expect(result.missingKeys).toContain("NEXT_PUBLIC_SUPABASE_URL");
      expect(result.missingKeys).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
  });
});
