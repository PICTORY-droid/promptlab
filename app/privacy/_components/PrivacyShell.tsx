import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import { Card, CardContent, CardDescription } from "@/shared/ui/card";
import PrivacySection from "./PrivacySection";
import PrivacySummaryCards from "./PrivacySummaryCards";

const lastUpdated = "2026-05-13";

export default function PrivacyShell() {
  return (
    <PageShell>
      <p className="text-xs text-slate-500">
        최종 업데이트: {lastUpdated}
      </p>

      <PageHeader
        badge="Privacy Policy"
        title="개인정보 처리방침"
        description="PromptLab은 프롬프트 작성, 저장, 안전 점검, 문의 응대, 서비스 안정성 확인에 필요한 정보만 처리합니다."
      />

      <Card className="border-emerald-100 bg-emerald-50">
        <CardContent className="p-4 sm:p-6">
          <CardDescription className="text-emerald-900">
            SafeCheck 검사 원문, 고객 개인정보 원문, 회사기밀 원문은 저장하지
            않는 것을 원칙으로 하며, 기록에는 점수, 판정, 위험 카테고리,
            안전 문장 안내 같은 결과 정보만 최소한으로 남깁니다.
          </CardDescription>
        </CardContent>
      </Card>

      <PrivacySummaryCards />

      <div className="grid gap-3 sm:gap-4">
        <PrivacySection
          title="1. 처리하는 개인정보 항목"
          description="로그인, 프롬프트 저장, SafeCheck 기록, 문의 접수, 오류 확인 과정에서 필요한 정보가 처리될 수 있습니다."
          items={[
            "계정 식별 정보: Supabase Auth, Google OAuth, Kakao OAuth, 이메일 Magic Link 로그인 과정에서 이메일 주소, 소셜 로그인 식별자, 로그인 세션 정보가 처리될 수 있습니다.",
            "프롬프트 저장 정보: 사용자가 직접 저장한 프롬프트 제목, 사용 목적, 본문, 예시 입력, 예시 출력, 안전 주의사항, 공개 범위, 게시 상태가 저장될 수 있습니다.",
            "SafeCheck 결과 정보: 위험 점수, 판정, 위험 카테고리, 안전 문장 안내, 정책 버전, 탐지기 버전, 검사 시각이 저장될 수 있습니다.",
            "문의 접수 정보: Contact 페이지를 통해 입력한 이름, 이메일, 문의 유형, 문의 내용, 답변 동의 여부가 Tally를 통해 처리될 수 있습니다.",
            "기술 및 이용 정보: Vercel, Supabase, Tally, Google Analytics 등에서 접속 로그, 브라우저 정보, 기기 정보, 오류 로그, 서비스 이용 흐름 정보가 처리될 수 있습니다.",
          ]}
        />

        <PrivacySection
          title="2. 저장하지 않는 정보"
          description="PromptLab은 SafeCheck와 리포트 저장 과정에서 민감한 원문 저장을 최소화합니다."
          items={[
            "SafeCheck 리포트에는 검사 원문 프롬프트를 저장하지 않는 것을 원칙으로 합니다.",
            "고객명, 전화번호, 이메일 주소 같은 실제 고객 개인정보 원문은 SafeCheck 리포트에 저장하지 않는 것을 원칙으로 합니다.",
            "회사기밀, 내부자료, 계약조건, 미공개 사업전략 같은 민감한 원문은 SafeCheck 리포트에 저장하지 않는 것을 원칙으로 합니다.",
            "상담기록, 진료기록, 건강정보 등 민감정보 원문은 SafeCheck 리포트에 저장하지 않는 것을 원칙으로 합니다.",
            "Supabase service_role key와 서버 전용 환경변수는 브라우저에 노출하지 않습니다.",
          ]}
        />

        <PrivacySection
          title="3. 개인정보 처리 목적"
          description="처리한 정보는 계정 운영, 프롬프트 관리, 안전 점검, 문의 응대, 보안과 안정성 확보를 위해 사용합니다."
          items={[
            "사용자 로그인, 계정 식별, 세션 유지",
            "사용자별 프롬프트 생성, 조회, 수정, 보관, 복구",
            "프롬프트 공개 여부와 게시 상태 관리",
            "SafeCheck 위험 점검 결과 제공",
            "SafeCheck 검사 기록 조회와 리포트 표시",
            "Contact 문의 접수, 답변, 오류 확인, 서비스 개선",
            "부정 이용 방지, 보안 점검, 서비스 안정성 확보",
            "서비스 이용 흐름 분석과 모바일 사용성 개선",
          ]}
        />

        <PrivacySection
          title="4. 보유 및 이용 기간"
          description="개인정보는 서비스 제공, 기록 확인, 문의 응대, 보안 목적에 필요한 기간 동안 보유될 수 있습니다."
          items={[
            "계정 정보는 사용자가 서비스를 이용하는 기간 동안 보유하며, 계정·데이터 삭제 요청 시 확인 절차 후 삭제하는 것을 원칙으로 합니다.",
            "사용자가 저장한 프롬프트 데이터는 사용자가 직접 삭제하거나 계정·데이터 삭제를 요청할 때까지 보유될 수 있습니다.",
            "SafeCheck 검사 기록은 서비스 내 기록 확인을 위해 보유될 수 있으며, 삭제 요청이 있는 경우 사용자 확인 후 삭제될 수 있습니다.",
            "Contact 문의 정보는 문의 처리, 답변 이력 확인, 분쟁 대응에 필요한 기간 동안 보유될 수 있습니다.",
            "접속 로그, 오류 로그, 사용 분석 정보는 서비스 안정성 확인과 개선에 필요한 기간 동안 Vercel, Supabase, Tally, Google Analytics의 보존 정책에 따라 처리될 수 있습니다.",
            "법령상 보관 의무, 보안 사고 조사, 분쟁 대응 등 정당한 사유가 있는 경우 해당 목적에 필요한 범위에서 일정 기간 보관될 수 있습니다.",
          ]}
        />

        <PrivacySection
          title="5. 개인정보의 파기"
          description="보유 목적이 끝나거나 삭제 요청이 처리된 정보는 복구가 어렵도록 삭제하거나 비식별 처리합니다."
          items={[
            "전자 파일 형태의 개인정보는 복구하기 어려운 방법으로 삭제합니다.",
            "외부 서비스에 저장된 정보는 해당 서비스의 관리 기능, 보존 정책, 백업 정책에 따라 삭제 또는 비식별 처리될 수 있습니다.",
            "백업 또는 로그에 남은 정보는 보안과 안정성 확보를 위한 보관 기간이 지난 뒤 순차적으로 삭제될 수 있습니다.",
            "삭제 요청 처리 과정에서 본인 확인이 필요한 경우, 요청자와 계정 소유자가 일치하는지 확인할 수 있습니다.",
          ]}
        />

        <PrivacySection
          title="6. 외부 서비스 및 처리위탁"
          description="PromptLab은 인증, 데이터베이스, 배포, 문의 접수, 이용 분석을 위해 외부 서비스를 사용합니다."
          items={[
            "Supabase: 사용자 인증, 데이터베이스, 로그인 세션 관리, 사용자별 데이터 접근 제어",
            "Vercel: 웹 애플리케이션 배포, 호스팅, 접속 로그, 오류 로그, 성능 관련 기술 정보 처리",
            "Google OAuth: Google 계정 로그인 제공",
            "Kakao OAuth: Kakao 계정 로그인 제공",
            "Google Analytics: 접속 통계, 서비스 이용 흐름, 기기와 브라우저 정보 등 사용 분석",
            "Tally: Contact 문의 폼 제공과 문의 내용 접수",
            "외부 서비스는 각 서비스의 개인정보 처리방침, 보안 정책, 데이터 처리 기준에 따라 정보를 처리합니다.",
          ]}
        />

        <PrivacySection
          title="7. 정보주체의 권리"
          description="사용자는 본인의 정보에 대해 열람, 수정, 삭제, 처리정지, 계정·데이터 삭제를 요청할 수 있습니다."
          items={[
            "사용자는 본인이 작성한 프롬프트를 조회, 수정, 보관, 삭제할 수 있습니다.",
            "사용자는 공개 상태의 프롬프트를 비공개 또는 초안 상태로 변경할 수 있습니다.",
            "계정 또는 저장 데이터 삭제가 필요한 경우 Contact 페이지를 통해 요청할 수 있습니다.",
            "요청 내용이 본인 확인, 법령상 보관 의무, 보안 사고 조사, 분쟁 대응과 관련되는 경우 처리에 필요한 확인 절차가 진행될 수 있습니다.",
            "로그아웃을 통해 현재 브라우저의 로그인 세션을 종료할 수 있습니다.",
          ]}
        />

        <PrivacySection
          title="8. 안전성 확보 조치"
          description="PromptLab은 사용자별 접근 제어, 민감정보 저장 제한, 서버 환경변수 보호를 기본 운영 원칙으로 둡니다."
          items={[
            "로그인한 사용자만 본인 프롬프트와 검사 기록을 관리할 수 있도록 서버에서 사용자 정보를 확인합니다.",
            "공개 프롬프트 화면에는 작성자 이메일, 사용자 ID, 작성 날짜를 노출하지 않습니다.",
            "SafeCheck block 판정 프롬프트의 저장을 차단합니다.",
            "SafeCheck review 판정 프롬프트는 비공개 초안 저장만 허용합니다.",
            "민감한 설정값과 환경변수는 코드 저장소에 직접 저장하지 않습니다.",
            "서비스 운영 중 발견된 오류와 보안 문제는 필요한 범위에서 점검하고 수정합니다.",
          ]}
        />

        <PrivacySection
          title="9. 입력 금지 정보"
          description="PromptLab은 안전한 프롬프트 작성을 돕는 서비스이므로 사용자는 민감한 원문을 입력하지 않아야 합니다."
          items={[
            "주민등록번호, 여권번호, 운전면허번호 등 고유식별정보",
            "비밀번호, 인증번호, 결제정보, 카드번호, 계좌 비밀번호",
            "고객명, 전화번호, 이메일 주소 등 실제 고객 개인정보 원문",
            "진료기록, 상담기록, 민감한 건강정보, 범죄 관련 정보, 정치·종교 등 민감정보 원문",
            "회사기밀, 내부자료, 계약조건, 미공개 사업전략, 타인에게 공개할 권한이 없는 자료",
            "사용자가 입력 금지 정보를 임의로 입력하여 발생한 문제는 사용자의 입력 행위와 서비스 이용 방식에 따라 처리될 수 있습니다.",
          ]}
        />

        <PrivacySection
          title="10. 자동 수집 장치와 로그"
          description="서비스 안정성 확인과 사용성 개선을 위해 기본적인 기술 정보와 사용 흐름 정보가 처리될 수 있습니다."
          items={[
            "PromptLab은 자체적으로 광고 식별자 또는 정밀 위치정보를 수집하지 않습니다.",
            "Vercel, Supabase, Tally, Google Analytics 등 외부 서비스가 접속 로그, 브라우저 정보, 기기 정보, 오류 로그, 서비스 이용 흐름 정보를 처리할 수 있습니다.",
            "Google Analytics는 서비스 이용 통계와 화면 이용 흐름을 파악하기 위해 쿠키 또는 유사 기술을 사용할 수 있습니다.",
            "Google Analytics로 이름, 이메일, 전화번호 등 개인 식별 정보를 보내지 않는 것을 원칙으로 합니다.",
            "브라우저 쿠키 또는 로컬 저장소는 로그인 세션 유지, 서비스 동작, 사용자 경험 개선을 위해 사용될 수 있습니다.",
            "사용자는 브라우저 설정을 통해 쿠키를 제한할 수 있으나, 이 경우 로그인 또는 일부 기능이 정상적으로 동작하지 않을 수 있습니다.",
          ]}
        />

        <PrivacySection
          title="11. 처리방침의 변경"
          description="서비스 기능, 외부 서비스, 법령, Play Store 정책 변경에 따라 처리방침은 수정될 수 있습니다."
          items={[
            "개인정보 처리방침이 변경되는 경우 본 페이지의 최종 업데이트 일자를 갱신합니다.",
            "중요한 변경이 있는 경우 서비스 화면, 공지, 또는 적절한 방법으로 안내할 수 있습니다.",
            "변경된 처리방침은 본 페이지에 게시된 시점부터 적용됩니다.",
          ]}
        />

        <PrivacySection
          title="12. 문의 및 개인정보 관련 연락처"
          description="개인정보 문의, 삭제 요청, 고충 처리는 Contact 페이지를 통해 접수할 수 있습니다."
          items={[
            "서비스명: PromptLab",
            "제작·운영: PICTORY-DROID, Seoin Kim",
            "운영 사이트: https://promptlab.io.kr",
            "문의 경로: https://promptlab.io.kr/contact",
            "계정·데이터 삭제 요청은 Contact 페이지에서 접수합니다.",
          ]}
        />
      </div>
    </PageShell>
  );
}