import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import ReportsShell from "./_components/ReportsShell";

export default async function ReportsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  return (
    <ReportsShell
      email={currentUser.user.email ?? "로그인 사용자"}
      userId={currentUser.user.id}
    />
  );
}
