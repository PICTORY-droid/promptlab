import { getCurrentUser } from "@/server/auth/get-current-user";
import { getCategories } from "@/features/prompts/server/get-categories";
import WriteShell from "./_components/WriteShell";

export default async function WritePage() {
  const currentUser = await getCurrentUser();
  const categoriesResult = await getCategories();

  return (
    <WriteShell
      email={currentUser.ok ? currentUser.user.email ?? "로그인 사용자" : null}
      isLoggedIn={currentUser.ok}
      categories={categoriesResult.ok ? categoriesResult.categories : []}
      categoryLoadMessage={categoriesResult.ok ? null : categoriesResult.message}
    />
  );
}