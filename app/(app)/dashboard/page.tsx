import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import DashboardShell from "./_components/DashboardShell";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  return (
    <DashboardShell
      email={currentUser.user.email ?? "로그인 사용자"}
      userId={currentUser.user.id}
    />
  );
}
