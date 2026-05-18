import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import ContactSafetyNotice from "./ContactSafetyNotice";
import TallyContactFrame from "./TallyContactFrame";

export default function ContactShell() {
  return (
    <PageShell>
      <PageHeader
        badge="Contact"
        title="PromptLab 문의"
        description="서비스 문의, 오류 제보, 계정·데이터 삭제 요청을 접수합니다."
      />

      <ContactSafetyNotice />

      <TallyContactFrame />
    </PageShell>
  );
}