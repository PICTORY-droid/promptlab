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
import DeleteSummaryCards from "./DeleteSummaryCards";

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
              외부 계정 삭제가 아닙니다
            </CardTitle>
            <CardDescription className="text-amber-900">
              Google, Kakao, 이메일 계정 자체를 삭제하지 않습니다.
              PromptLab 서비스 연결과 저장 데이터 삭제 요청만 안내합니다.
            </CardDescription>
          </div>
        </CardContent>
      </Card>

      <DeleteRequestCard />

      <DeleteSummaryCards />

      <div className="grid gap-3 sm:gap-4">
        <DeleteInfoSection
          title="삭제 대상"
          description="요청 처리 시 삭제 대상에 포함될 수 있는 정보입니다."
          items={[
            "PromptLab 서비스 계정 연결 정보",
            "Supabase Auth 사용자 정보 삭제 요청",
            "저장한 프롬프트 제목과 본문",
            "사용자 계정과 연결된 SafeCheck 검사 기록",
            "Contact를 통해 접수된 문의 기록 중 삭제 요청 대상 정보",
            "PromptLab 서비스 이용과 연결된 관련 데이터",
          ]}
        />

        <DeleteInfoSection
          title="삭제 대상이 아닌 것"
          description="PromptLab에서 삭제할 수 없는 외부 계정입니다."
          items={[
            "Google 계정 자체",
            "Kakao 계정 자체",
            "이메일 계정 자체",
            "Google 또는 Kakao 서비스에 별도로 저장된 정보",
            "사용자가 외부 서비스에 직접 저장한 데이터",
          ]}
        />

        <DeleteInfoSection
          title="SafeCheck 원문 보관 기준"
          description="PromptLab은 민감한 원문 저장을 최소화합니다."
          items={[
            "SafeCheck는 민감한 원문 저장을 기본으로 하지 않습니다.",
            "검사 결과와 리포트에는 점수, 위험 카테고리, 안전 문장 안내, 정책 버전 등 필요한 정보만 저장될 수 있습니다.",
            "고객명, 전화번호, 이메일, 회사기밀, 계약조건 같은 민감한 원문은 저장하지 않는 것을 원칙으로 합니다.",
            "저장된 기록이 있는 경우 삭제 요청 대상에 포함됩니다.",
          ]}
        />

        <DeleteInfoSection
          title="일부 데이터 보관 기준"
          description="법적 의무, 보안, 분쟁 대응에 필요한 정보는 일부 보관될 수 있습니다."
          items={[
            "법령상 보관 의무가 있는 정보는 해당 법령에서 정한 기간 동안 보관될 수 있습니다.",
            "부정 이용 방지, 보안 사고 조사, 서비스 안정성 확인에 필요한 로그는 필요한 기간 동안 보관될 수 있습니다.",
            "분쟁 대응이나 권리 보호에 필요한 최소 정보는 해당 목적이 끝날 때까지 보관될 수 있습니다.",
            "보관 기간이 끝난 정보는 복구하기 어려운 방식으로 삭제됩니다.",
          ]}
        />

        <DeleteInfoSection
          title="접수 경로"
          description="삭제 요청과 개인정보 문의 접수 경로입니다."
          items={[
            "Contact: https://promptlab.io.kr/contact",
            "개인정보 문의: pictory-droid@gmail.com",
            "서비스명: PromptLab",
            "제작·운영: PICTORY-DROID, Seoin Kim",
            "운영 사이트: https://promptlab.io.kr",
          ]}
        />
      </div>
    </PageShell>
  );
}