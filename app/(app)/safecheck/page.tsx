import { getCurrentUser } from "@/server/auth/get-current-user";
import SafeCheckShell from "./_components/SafeCheckShell";

export default async function SafeCheckPage() {
  const currentUser = await getCurrentUser();

  return (
    <SafeCheckShell
      email={currentUser.ok ? currentUser.user.email ?? "로그인 사용자" : null}
      isLoggedIn={currentUser.ok}
    />
  );
}