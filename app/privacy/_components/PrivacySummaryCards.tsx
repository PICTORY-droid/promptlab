import { Card, CardContent } from "@/shared/ui/card";

const operatingStandards = [
  {
    title: "원문 저장 제한",
    description:
      "SafeCheck 검사 원문과 고객 개인정보 원문은 저장하지 않는 것을 원칙으로 합니다.",
  },
  {
    title: "인증과 저장",
    description:
      "로그인과 사용자별 데이터 관리는 Supabase Auth와 Supabase DB를 사용합니다.",
  },
  {
    title: "문의와 분석",
    description:
      "문의는 Tally를 통해 접수될 수 있고, 안정성 확인과 사용성 개선에는 Vercel, Supabase, Google Analytics가 사용될 수 있습니다.",
  },
  {
    title: "삭제 요청",
    description:
      "계정 연결과 저장 데이터 삭제 요청은 Contact 페이지를 통해 접수합니다.",
  },
];

export default function PrivacySummaryCards() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <section aria-label="PromptLab 개인정보 운영 기준" className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            PromptLab 개인정보 운영 기준
          </p>

          <div className="grid gap-3">
            {operatingStandards.map((item) => (
              <div key={item.title} className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                  {item.title}
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}