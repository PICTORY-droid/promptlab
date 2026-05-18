import DashboardSummaryItem from "./DashboardSummaryItem";

type DashboardSummaryCardsProps = {
  email: string;
  promptCount: number;
};

export default function DashboardSummaryCards({
  email,
  promptCount,
}: DashboardSummaryCardsProps) {
  return (
    <section className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3">
      <DashboardSummaryItem
        label="계정"
        title="현재 로그인"
        value={email}
        valueClassName="text-[11px] sm:text-xs"
      />

      <DashboardSummaryItem
        label="프롬프트"
        title="저장된 항목"
        value={`${promptCount.toLocaleString("ko-KR")}개`}
      />
    </section>
  );
}