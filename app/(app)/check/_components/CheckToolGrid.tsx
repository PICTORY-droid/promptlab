import CheckToolCard, { type CheckToolCardProps } from "./CheckToolCard";

const primaryTool: CheckToolCardProps = {
  title: "SafeCheck",
  description:
    "개인정보, 회사기밀, 계약정보, 저작권 원문, 허위·과장 표현을 저장 또는 공개 전에 점검합니다.",
  status: "사용 가능",
  href: "/safecheck",
  actionLabel: "SafeCheck 시작",
  variant: "primary",
};

const upcomingTools: CheckToolCardProps[] = [
  {
    title: "StyleCheck",
    description: "반복 표현과 과하게 정돈된 문장을 점검합니다.",
    status: "준비 중",
    variant: "mini",
  },
  {
    title: "AI 문체 점검",
    description: "기계적으로 보일 수 있는 문장 패턴을 점검합니다.",
    status: "준비 중",
    variant: "mini",
  },
  {
    title: "Similarity",
    description: "중복 표현과 원문 반복 위험을 점검합니다.",
    status: "준비 중",
    variant: "mini",
  },
];

export default function CheckToolGrid() {
  return (
    <section className="grid gap-4 sm:gap-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">
          바로 사용 가능
        </p>
        <CheckToolCard {...primaryTool} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">
          다음 검사 준비 중
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {upcomingTools.map((tool) => (
            <CheckToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}