"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/server/db/supabase-browser";
import Button from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import ErrorMessage from "@/shared/ui/error-message";
import Input from "@/shared/ui/input";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setSubmitState("error");
      setMessage("이메일을 입력하세요.");
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setSubmitState("error");
        setMessage(error.message);
        return;
      }

      setSubmitState("success");
      setMessage("로그인 링크를 이메일로 보냈습니다. 메일함을 확인하세요.");
    } catch {
      setSubmitState("error");
      setMessage(
        "Supabase 환경변수 또는 인증 설정을 확인하세요. 로딩을 반복하지 않고 여기서 중단했습니다.",
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>이메일 로그인</CardTitle>
        <CardDescription>
          Supabase Auth의 이메일 매직링크 방식으로 로그인합니다.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">이메일</span>
            <Input
              type="email"
              value={email}
              placeholder="name@example.com"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <Button
            type="submit"
            className="w-full"
            disabled={submitState === "submitting"}
          >
            {submitState === "submitting" ? "로그인 링크 보내는 중" : "로그인 링크 받기"}
          </Button>
        </form>

        {submitState === "success" ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-700">
            {message}
          </div>
        ) : null}

        {submitState === "error" ? (
          <ErrorMessage className="mt-4" message={message} />
        ) : null}
      </CardContent>
    </Card>
  );
}
