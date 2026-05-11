import { describe, expect, it } from "vitest";
import { hasCurrentUser, type CurrentUserResult } from "../../server/auth/get-current-user";

describe("PromptLab v3 auth helpers", () => {
  it("returns true when current user result is ok", () => {
    const result = {
      ok: true,
      user: {
        id: "user-id",
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: "2026-01-01T00:00:00.000Z",
      },
      message: null,
    } satisfies CurrentUserResult;

    expect(hasCurrentUser(result)).toBe(true);
  });

  it("returns false when current user result is not ok", () => {
    const result = {
      ok: false,
      user: null,
      message: "로그인이 필요합니다.",
    } satisfies CurrentUserResult;

    expect(hasCurrentUser(result)).toBe(false);
  });
});
