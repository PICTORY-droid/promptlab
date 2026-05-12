import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import TallyContactFrame from "./TallyContactFrame";

export default function ContactShell() {
  return (
    <PageShell>
      <PageHeader
        badge="Contact"
        title="PromptLab 문의"
        description="서비스 이용 중 불편한 점, 오류, 제안 사항을 남겨주세요"
      />

      <Card>
        <CardHeader className="p-5 sm:p-6">
          <CardTitle>문의하기</CardTitle>
          <CardDescription>
            문의 내용에 주민등록번호, 비밀번호, 결제정보, 고객 개인정보, 회사기밀은 입력하지 마세요
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          <TallyContactFrame />
        </CardContent>
      </Card>
    </PageShell>
  );
}
