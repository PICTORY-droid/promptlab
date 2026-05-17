import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/ui/card";
import DeleteInfoSection from "./DeleteInfoSection";
import DeleteRequestCard from "./DeleteRequestCard";

const lastUpdated = "2026-05-13";

export default function DeleteAccountShell() {
  return (
    <PageShell>
      <PageHeader
        badge="Account & Data Deletion"
        title="계정·데이터 삭제"
        description="PromptLab 연결과 저장 데이터 삭제를 요청하는 페이지입니다."
        meta={<>최종 업데이트: {lastUpdated}</>}
      />

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2">
            <CardTitle className="text-amber-950">
              Google, Kakao 계정 삭제가 아닙니다
            </CardTitle>
            <CardDescription className="text-amber-900">
              이 페이지는 PromptLab 서비스 계정 연결과 저장 데이터 삭제 요청만
              안내합니다.
            </CardDescription>
          </div>
        </CardContent>
      </Card>

      <DeleteRequestCard />

      <DeleteInfoSection
        title="삭제 전 확인사항"
        description="삭제 대상, 제외 대상, 보관 기준을 한 번에 확인합니다."
        sections={[
          {
            title: "삭제 대상",
            items: [
              "PromptLab 서비스 계정 연결 정보",
              "Supabase Auth 사용자 정보 삭제 요청",
              "저장한 프롬프트 제목과 본문",
              "사용자 계정과 연결된 SafeCheck 검사 기록",
              "Contact를 통해 접수된 문의 기록 중 삭제 요청 대상 정보",
            ],
          },
          {
            title: "삭제 대상이 아닌 것",
            items: [
              "Google 계정 자체",
              "Kakao 계정 자체",
              "이메일 계정 자체",
              "Google 또는 Kakao 서비스에 별도로 저장된 정보",
              "사용자가 외부 서비스에 직접 저장한 데이터",
            ],
          },
          {
            title: "SafeCheck 원문 보관 기준",
            items: [
              "SafeCheck는 민감한 원문 저장을 기본으로 하지 않습니다.",
              "검사 결과에는 점수, 위험 카테고리, 안전 문장 안내, 정책 버전 등 필요한 정보만 저장될 수 있습니다.",
              "고객명, 전화번호, 이메일, 회사기밀, 계약조건 같은 민감한 원문은 저장하지 않는 것을 원칙으로 합니다.",
            ],
          },
          {
            title: "일부 보관 가능",
            items: [
              "법령상 보관 의무가 있는 정보는 정해진 기간 동안 보관될 수 있습니다.",
              "부정 이용 방지, 보안 사고 조사, 서비스 안정성 확인에 필요한 로그는 필요한 기간 동안 보관될 수 있습니다.",
              "분쟁 대응이나 권리 보호에 필요한 최소 정보는 해당 목적이 끝날 때까지 보관될 수 있습니다.",
            ],
          },
        ]}
      />
    </PageShell>
  );
}