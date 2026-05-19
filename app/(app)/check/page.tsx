import { getCurrentUser } from "@/server/auth/get-current-user";
import CheckShell from "./_components/CheckShell";

export default async function CheckPage() {
  const currentUser = await getCurrentUser();

  return (
    <CheckShell
      email={currentUser.ok ? currentUser.user.email ?? "로그인 사용자" : null}
      isLoggedIn={currentUser.ok}
    />
  );
}