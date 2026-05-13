import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/ui/card";

const summaryCards = [
  {
    title: "SafeCheck 원문 저장 최소화",
    description:
      "SafeCheck는 민감한 원문 저장을 기본으로 하지 않고, 필요한 결과 정보만 제한적으로 처리합니다.",
  },
  {
    title: "로그인 정보 처리",
    description:
      "Google, Kakao, 이메일 Magic Link 로그인에 필요한 계정 식별 정보와 세션 정보를 처리합니다.",
  },
  {
    title: "사용 분석 도구 사용",
    description:
      "서비스 안정성 확인과 개선을 위해 Vercel, Supabase, Tally, Google Analytics를 사용할 수 있습니다.",
  },
];

export default function PrivacySummaryCards() {
  return (
    <section
      aria-label="개인정보 처리 요약"
      className="grid gap-3 sm:grid-cols-3"
    >
      {summaryCards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-4 sm:p-5">
            <div className="space-y-1.5">
              <CardTitle className="text-base">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
