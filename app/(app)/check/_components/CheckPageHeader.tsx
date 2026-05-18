import Badge from "@/shared/ui/badge";

export default function CheckPageHeader() {
  return (
    <header className="space-y-2">
      <Badge>PromptLab Check</Badge>

      <p className="max-w-2xl text-sm leading-6 text-slate-600">
        생성형 AI 입력 전 민감정보와 보안 위험을 점검합니다.
      </p>
    </header>
  );
}