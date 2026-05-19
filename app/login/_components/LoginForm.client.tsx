import LoginDivider from "./LoginDivider";
import MagicLinkLoginForm from "./MagicLinkLoginForm.client";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginForm() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-500">
            PromptLab Login
          </p>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            로그인
          </h1>
          <p className="text-sm leading-5 text-slate-600">
            Google, Kakao 또는 이메일 링크로 로그인합니다.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <SocialLoginButtons />
          <LoginDivider />
          <MagicLinkLoginForm />
        </div>
      </div>
    </div>
  );
}