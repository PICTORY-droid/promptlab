import {
  Card,
  CardContent,
} from "@/shared/ui/card";

const summaryItems = [
  "SafeCheck 원문 저장 최소화",
  "로그인 계정 식별 정보 처리",
  "서비스 안정성 확인과 사용 분석",
];

export default function PrivacySummaryCards() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <section aria-label="개인정보 처리 요약" className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">
            처리방침 요약
          </p>

          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-600">
            {summaryItems.map((item) => (
              <li key={item} className="break-keep">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}