import { getCurrentUser } from "@/server/auth/get-current-user";
import { getSafeCheckReports } from "@/features/safecheck/server/get-safecheck-reports";
import ReportsShell from "./_components/ReportsShell";

export default async function ReportsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    return (
      <ReportsShell
        email={null}
        isLoggedIn={false}
        reports={[]}
        reportLoadMessage="검사 기록은 로그인 후 확인할 수 있습니다. 개인 계정에 저장된 기록만 표시됩니다."
      />
    );
  }

  const reportsResult = await getSafeCheckReports(currentUser.user.id);

  return (
    <ReportsShell
      email={currentUser.user.email ?? "로그인 사용자"}
      isLoggedIn={true}
      reports={reportsResult.ok ? reportsResult.data.reports : []}
      reportLoadMessage={reportsResult.ok ? null : reportsResult.message}
    />
  );
}