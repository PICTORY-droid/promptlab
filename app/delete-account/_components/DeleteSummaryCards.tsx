import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/ui/card";

const summaryCards = [
  {
    title: "연결 삭제",
    description: "PromptLab 서비스 계정 연결 삭제 요청",
  },
  {
    title: "저장 데이터 삭제",
    description: "프롬프트, 검사 기록, 문의 기록 삭제 요청",
  },
  {
    title: "일부 보관 가능",
    description: "법적 의무, 보안, 분쟁 대응 목적의 최소 보관",
  },
];

export default function DeleteSummaryCards() {
  return (
    <section
      aria-label="계정 및 데이터 삭제 요약"
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